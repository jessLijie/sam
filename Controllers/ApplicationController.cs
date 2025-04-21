using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sam.Data;
using sam.Models;
using UglyToad.PdfPig;
using System.Text.RegularExpressions;
using System.Globalization;
using System.Text;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using iText.Kernel.Pdf.Canvas.Parser.Listener;
using PdfiumViewer;
using Tesseract;
using System.Drawing.Imaging;
using System;
using System.IO;
using Emgu.CV;
using Emgu.CV.Structure;
using Emgu.CV.CvEnum;
using System.Drawing;

namespace sam.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ApplicationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Application
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Application>>> GetApplications()
        {
            return await _context.Applications.ToListAsync();
        }

        // GET: api/Application/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Application>> GetApplication(int id)
        {
            var application = await _context.Applications.FindAsync(id);

            if (application == null)
            {
                return NotFound();
            }

            return application;
        }

        [HttpGet("detail/{id}")]
        public async Task<ActionResult<Application>> GetDetailApplication(int id)
        {
            var application = await _context.Applications
                .Include(a => a.Applicants)  // Eagerly load related Applicants
                .FirstOrDefaultAsync(a => a.Id == id);

            if (application == null)
            {
                return NotFound();
            }

            return application;
        }

        [HttpPost]
        public async Task<ActionResult<Application>> PostApplication(CombinedApplicationDto input)
        {
            var application = new Application
            {
                Name = input.Name,
                SpmResult = input.SpmResult,
                PreUResult = input.PreUResult,
                PreUType = input.PreUType,
                AppliedProgram = input.Program_code,
                ApplicationStatus = "pending"
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            var applicant = new Applicant
            {
                Name = input.Name,
                IcNumber = input.IcNumber,
                Address = input.Address,
                Gender = input.Gender,
                ApplicationId = application.Id
            };

            _context.Applicants.Add(applicant);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetApplication), new { id = application.Id }, application);
        }

        [HttpPost("scan/spm")]
        public async Task<IActionResult> ScanSPM(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // use uglyToad
            // var results = new Dictionary<string, string>();

            // using (var stream = file.OpenReadStream())
            // using (var pdf = PdfDocument.Open(stream))
            // {
            //     foreach (var page in pdf.GetPages())
            //     {
            //         string text = page.Text;

            //         // Pattern: subject name followed by grade (e.g. BAHASA MELAYU A+)
            //         var regex = new Regex(@"([A-Z\s]+)\s+(A\+|A|A\-|B\+|B|B\-|C\+|C|C\-|D\+|D|E|G)", RegexOptions.IgnoreCase);

            //         foreach (Match match in regex.Matches(text))
            //         {
            //             string subject = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(match.Groups[1].Value.Trim().ToLower());
            //             string grade = match.Groups[2].Value.ToUpper();

            //             if (!results.ContainsKey(subject))
            //                 results[subject] = grade;
            //         }
            //     }
            // }

            // return Ok(results);

            // extract everything 
            // var extractedText = new StringBuilder();

            // using (var stream = file.OpenReadStream())
            // using (var pdf = PdfDocument.Open(stream))
            // {
            //     foreach (var page in pdf.GetPages())
            //     {
            //         string text = page.Text;
            //         extractedText.AppendLine(text);
            //     }
            // }

            // return Ok(extractedText.ToString());

            // use iTextSharp
            // var extractedText = new StringBuilder();

            // using (var stream = file.OpenReadStream())
            // using (var pdfReader = new PdfReader(stream))
            // using (var pdfDocument = new iText.Kernel.Pdf.PdfDocument(pdfReader))
            // {
            //     // Iterate through all the pages in the PDF
            //     for (int i = 1; i <= pdfDocument.GetNumberOfPages(); i++)
            //     {
            //         var page = pdfDocument.GetPage(i);
            //         var strategy = new SimpleTextExtractionStrategy();
            //         var text = PdfTextExtractor.GetTextFromPage(page, strategy);
            //         extractedText.AppendLine(text);  // Add the extracted text from the page
            //     }
            // }

            // // Return the extracted text as plain text in the response
            // return Content(extractedText.ToString(), "text/plain");

            // use Tesseract
            // var extractedText = new StringBuilder();
            // bool isTextBasedPdf = false;

            // try
            // {
            //     using (var stream = file.OpenReadStream())
            //     {
            //         var pdfDocument = PdfiumViewer.PdfDocument.Load(stream);

            //         for (int pageIndex = 0; pageIndex < pdfDocument.PageCount; pageIndex++)
            //         {
            //             string pageText = pdfDocument.GetPdfText(pageIndex);

            //             if (!string.IsNullOrWhiteSpace(pageText))
            //             {
            //                 isTextBasedPdf = true;
            //                 extractedText.AppendLine(pageText);
            //             }
            //         }

            //         if (isTextBasedPdf)
            //         {
            //             return Content(extractedText.ToString(), "text/plain");
            //         }

            //         // Fallback to OCR if no embedded text found
            //         using (var ocrEngine = new TesseractEngine(@"./bin/Debug/net8.0/tessdata", "eng", EngineMode.Default))
            //         {
            //             for (int pageIndex = 0; pageIndex < pdfDocument.PageCount; pageIndex++)
            //             {
            //                 using (var bitmap = (Bitmap)pdfDocument.Render(pageIndex, 300, 300, true))
            //                 using (var pix = PixConverter.ToPix(bitmap))
            //                 using (var page = ocrEngine.Process(pix))
            //                 {
            //                     extractedText.AppendLine(page.GetText());
            //                 }
            //             }
            //         }
            //     }
            // }
            // catch (Exception ex)
            // {
            //     return StatusCode(500, $"An error occurred while processing the file: {ex.Message}");
            // }

            // return Content(extractedText.ToString(), "text/plain");

            // Complete pipeline


            var extractedText = new StringBuilder();
            bool isTextBasedPdf = false;

            try
            {
                using (var stream = file.OpenReadStream())
                {
                    var pdfDocument = PdfiumViewer.PdfDocument.Load(stream);

                    for (int pageIndex = 0; pageIndex < pdfDocument.PageCount; pageIndex++)
                    {
                        string pageText = pdfDocument.GetPdfText(pageIndex);
                        if (!string.IsNullOrWhiteSpace(pageText))
                        {
                            isTextBasedPdf = true;
                            extractedText.AppendLine(pageText);
                        }
                    }

                    if (isTextBasedPdf)
                    {
                        var extracted = extractedText.ToString();
                        var parsed = ExtractionController.ParseSpmSubjects(extracted);

                        return new JsonResult(new
                        {
                            rawText = extracted,
                            parsed = parsed
                        });
                    }

                    // string tessdataPath = Path.Combine(Directory.GetCurrentDirectory(), "tessdata");
                    using var ocrEngine = new TesseractEngine(@"./bin/Debug/net8.0/tessdata", "eng", EngineMode.Default);

                    for (int pageIndex = 0; pageIndex < pdfDocument.PageCount; pageIndex++)
                    {
                        using (var rawBitmap = (Bitmap)pdfDocument.Render(pageIndex, 300, 300, true))
                        using (var emguImage = rawBitmap.ToImage<Bgr, byte>())
                        {
                            var gray = emguImage.Convert<Gray, byte>().ThresholdBinary(new Gray(180), new Gray(255));

                            using (var pix = PixConverter.ToPix(gray.ToBitmap()))
                            using (var page = ocrEngine.Process(pix))
                            {
                                extractedText.AppendLine(page.GetText());
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }

            var extractedTextStr = extractedText.ToString();
            // Console.WriteLine("Extracted SPM Text:\n" + extractedTextStr);
            var results = ExtractionController.ParseSpmSubjects(extractedTextStr);

            // Check if the dictionary is empty
            if (results.Count == 0)
            {
                Console.WriteLine("No subjects and grades were extracted.");
            }
            else
            {
                Console.WriteLine("Extracted SPM Grade:");

                // Iterate through the dictionary and print each subject and grade
                foreach (var entry in results)
                {
                    Console.WriteLine($"{entry.Key}: {entry.Value}");
                }
            }
            return Ok(new
            {
                rawText = extractedTextStr,
                parsed = results
            });
        }

        // PUT: api/Application/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutApplication(int id, Application application)
        {
            if (id != application.Id)
            {
                return BadRequest();
            }

            _context.Entry(application).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ApplicationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Application/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteApplication(int id)
        {
            var application = await _context.Applications.FindAsync(id);
            if (application == null)
            {
                return NotFound();
            }

            _context.Applications.Remove(application);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ApplicationExists(int id)
        {
            return _context.Applications.Any(e => e.Id == id);
        }
    }
}
