namespace sam.Models{
        public class Application
    {
        [Key]
        public int Id { get; set; } 

        [Required]
        public string? Name { get; set; }

        public string? SpmResult { get; set; }  
        public string? PreUResult { get; set; }    

        [Required]
        public string? PreUType { get; set; }      

        [Required]
        public string? ApplicationStatus { get; set; }

        [Required]
        public string? FirstChoice { get; set; }

         [Required]
        public string? SecondChoice { get; set; }

         [Required]
        public string? ThirdChoice { get; set; }

        [Required]
        public string? AppliedProgram { get; set; }


        public ICollection<Applicant>? Applicants { get; set; }

    }
}
