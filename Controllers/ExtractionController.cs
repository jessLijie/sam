using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using F23.StringSimilarity;
using FuzzySharp;
using System.Text.RegularExpressions;


namespace sam.Controllers
{
    public class ExtractionController : ControllerBase
    {

        // Valid SPM grades
        private static readonly List<string> ValidGrades = new List<string>

        {
            "A+", "A", "A-", "B+", "B", "C+", "C", "D", "E", "G"
        };

        // Valid STPM grades
        private static readonly List<string> ValidSTPMGrades = new List<string>

        {
            "4.00", "3.67", "3.33", "3.00", "2.67", "2.33", "2.00","1.67", "1.33", "1.00","1.00"
        };

        // Common OCR fixes
        private static readonly Dictionary<string, string> Corrections = new Dictionary<string, string>

        {
            { "BARAGA MELAYD", "BAHASA MELAYU" },
            { "BARAGA MELsYD", "BAHASA MELAYU" },
            { "BAHASA MELAYD", "BAHASA MELAYU" },
            { "BAHASA CTNA", "BAHASA CINA" },
            { "BAHASA INGGERIS", "BAHASA INGGERIS" },
            { "SEIARAH", "SEJARAH" },
            { "HATHEMATICS", "MATHEMATICS" },
            { "ADDITIONAL HATHEMATICS", "ADDITIONAL MATHEMATICS" },
            { "FHYSICS", "PHYSICS" },
            { "CHRMISTRY", "CHEMISTRY" },
            { "CHMERLANG", "CEMERLANG" },
            { "CRMERLANG", "CEMERLANG" },
            { "CRMERLANG TERTINGGI", "CEMERLANG TERTINGGI" },
            { "TINGGT", "TINGGI" },
            { "TINGGL", "TINGGI" }
                };

        private static readonly string[] InvalidSubjectKeywords = new[]
{
            "CEMERLANG", "TINGGI", "TERTINGGI", "PEPERIKSAAN", "LEMBAGA", "KEMENTERIAN",
            "LAYAK", "MENDAPAT", "SIJIL", "PENGARAN", "GRED", "SHIC", "BUKIT", "MALURI", "KUALA", "LUMPUR","MATA","PELAJARAN","NAMA","GRED"
        };

        private static readonly List<string> ValidSPMSubjects = new List<string>
            {
                "Bahasa Melayu", "Bahasa Inggeris", "Pendidikan Moral", "Sejarah",
                "Mathematics", "Additional Mathematics", "Physics", "Chemistry",
                "Biology", "Bahasa Cina"
            };

        private static readonly List<string> ValidSTPMSubjects = new List<string>
            {
                "Pengajian Am","Mathematics (T)","Mathematics (M)","Physics","Chemistry","Biology"
            };



        public static Dictionary<string, string> ParseSpmSubjects(string extractedText)
        {
            var result = new Dictionary<string, string>();
            var lines = extractedText.Replace("\r\n", "\n").Split('\n')
                .Select(line => line.Trim()).Where(line => line.Length > 0).ToList();

            // Step 1: Extract fuzzy-matched subjects
            List<string> matchedSubjects = new List<string>();

            foreach (var line in lines)
            {
                var bestMatch = Process.ExtractOne(line, ValidSPMSubjects);
                if (bestMatch != null && bestMatch.Score >= 85 && !matchedSubjects.Contains(bestMatch.Value))
                {
                    matchedSubjects.Add(bestMatch.Value);
                }
            }

            // Step 2: Extract grades (loose match)
            List<string> grades = new List<string>();
            Regex looseGradeRegex = new Regex(@"[AaJj]\s?[\*\+=~\-]?", RegexOptions.IgnoreCase);

            foreach (var line in lines)
            {
                var match = looseGradeRegex.Match(line);
                if (match.Success)
                {
                    grades.Add(NormalizeGrade(match.Value));
                }
            }

            for (int i = 0; i < grades.Count; i++)
            {
                Console.WriteLine(grades[i]);
            }

            // Step 3: Match subjects with grades
            int count = Math.Min(matchedSubjects.Count, grades.Count);
            for (int i = 0; i < count; i++)
            {
                // result[matchedSubjects[i]] = grades[i];
                result[matchedSubjects[matchedSubjects.Count - count + i]] = grades[grades.Count - count + i];

            }

            Console.WriteLine("Extracted " + matchedSubjects.Count + " subjects and " + grades.Count + " grades");



            return result;
        }

  public static Dictionary<string, string> ParseStpmSubjects(string extractedText)
        {
            var result = new Dictionary<string, string>();
            var lines = extractedText.Replace("\r\n", "\n").Split('\n')
                .Select(line => line.Trim()).Where(line => line.Length > 0).ToList();

            // Step 1: Extract fuzzy-matched subjects
            List<string> matchedSubjects = new List<string>();

            foreach (var line in lines)
            {
                var bestMatch = Process.ExtractOne(line, ValidSTPMSubjects);
                if (bestMatch != null && bestMatch.Score >= 85 && !matchedSubjects.Contains(bestMatch.Value))
                {
                    matchedSubjects.Add(bestMatch.Value);
                }
            }

            // Step 2: Extract grades (loose match)
            List<string> grades = new List<string>();
            Regex looseGradeRegex = new Regex(@"[AaJj]\s?[\*\+=~\-]?", RegexOptions.IgnoreCase);

            foreach (var line in lines)
            {
                var match = looseGradeRegex.Match(line);
                if (match.Success)
                {
                    grades.Add(NormalizeGrade(match.Value));
                }
            }

            for (int i = 0; i < grades.Count; i++)
            {
                Console.WriteLine(grades[i]);
            }

            // Step 3: Match subjects with grades
            int count = Math.Min(matchedSubjects.Count, grades.Count);
            for (int i = 0; i < count; i++)
            {
                // result[matchedSubjects[i]] = grades[i];
                result[matchedSubjects[matchedSubjects.Count - count + i]] = grades[grades.Count - count + i];

            }

            Console.WriteLine("Extracted " + matchedSubjects.Count + " subjects and " + grades.Count + " grades");



            return result;
        }

        private static string NormalizeGrade(string raw)
        {
            raw = raw.Trim().ToUpper();

            if (raw == "A+" || raw == "A" || raw == "A-") return raw;

            if (raw == "A*" || raw == "A=*") return "A+";

            if (raw == "A~" || raw == "A=~" || raw == "A=") return "A-";

            // Handle misreads with fuzzy patterns
            if (raw.StartsWith("A") && (raw.Contains("+") || raw.Contains("*"))) return "A+";
            if (raw.StartsWith("A") && (raw.Contains("~") || raw.Contains("="))) return "A-";

            if (ValidGrades.Contains(raw)) return raw;

            return null; // unknown grades treated as null
        }


        private static int LevenshteinDistance(string s, string t)
        {
            var d = new int[s.Length + 1, t.Length + 1];

            for (int i = 0; i <= s.Length; i++) d[i, 0] = i;
            for (int j = 0; j <= t.Length; j++) d[0, j] = j;

            for (int i = 1; i <= s.Length; i++)
            {
                for (int j = 1; j <= t.Length; j++)
                {
                    int cost = (s[i - 1] == t[j - 1]) ? 0 : 1;
                    d[i, j] = Math.Min(
                        Math.Min(d[i - 1, j] + 1, d[i, j - 1] + 1),
                        d[i - 1, j - 1] + cost
                    );
                }
            }

            return d[s.Length, t.Length];
        }


    }
}