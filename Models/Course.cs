namespace sam.Models
{
    public class Course
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string? FacultyCode { get; set; }

        [Required]
        public string? Faculty { get; set; }

        [Required]
        public string? CourseCode { get; set; }

         [Required]
        public string? CourseName { get; set; }

        [Required]
        public int? Quota { get; set; }

    }
}