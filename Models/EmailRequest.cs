namespace YourNamespace.Models
{
    public class EmailRequest
{
    public string? To { get; set; }
    public string? Subject { get; set; }
    public string? Body { get; set; }
    public string? ExcelFileBase64 { get; set; } // This holds the Base64 string of the Excel file
}

}
