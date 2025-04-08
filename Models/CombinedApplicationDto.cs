public class CombinedApplicationDto
{
    // Application properties
    public string? Name { get; set; }
    public string? SpmResult { get; set; }    // JSON string
    public string? PreUResult { get; set; }     // JSON string
    public string? PreUType { get; set; }
    public string? Program_code { get; set; }   // This will be saved into the AppliedProgram column

    // Applicant properties
    public string? IcNumber { get; set; }
    public string? Address { get; set; }
    public string? Gender { get; set; }
}
