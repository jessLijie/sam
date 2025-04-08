namespace sam.Models{
 public class EntryRequirements
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string? Graduate_type { get; set; }

        [Required]
        public string? Requirement_type { get; set; }

        [Required]
        public string? Subject { get; set; }

        [Required]
        public string? Grade { get; set; }

        public string? Faculty { get; set; }
        public string? Program_code { get; set; }

    }
}