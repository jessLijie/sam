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

        public string? ApplicationStatus { get; set; }

        public string? FirstChoice { get; set; }

        public string? SecondChoice { get; set; }

        public string? ThirdChoice { get; set; }

        public string? AppliedProgram { get; set; }


        public ICollection<Applicant>? Applicants { get; set; }

    }
}
