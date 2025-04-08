namespace sam.Models
{
    public class Subject
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string? Category { get; set; }

        [Required]
        public string? SubjectName { get; set; }

    }
}