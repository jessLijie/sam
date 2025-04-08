namespace sam.Models{
    public class Applicant
    {
        [Key]
        public int Id { get; set; }  

        [Required]
        public string? Name { get; set; }

        [Required]
        public string? IcNumber { get; set; }

        public string? Address { get; set; }

        public string? Gender { get; set; }

        [Required]
        public int ApplicationId { get; set; }
    }
}
