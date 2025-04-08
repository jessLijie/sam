using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using YourNamespace.Models;

[Route("api/email")]
[ApiController]
public class MailController : ControllerBase
{
    private readonly SmtpSettings _smtpSettings;

    public MailController(IOptions<SmtpSettings> smtpSettings)
    {
        _smtpSettings = smtpSettings.Value;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
    {
        if (string.IsNullOrEmpty(request.To) || string.IsNullOrEmpty(request.Body))
        {
            return BadRequest("Recipient and message are required.");
        }

        try
        {
            var smtpClient = new SmtpClient(_smtpSettings.Host)
            {
                Port = _smtpSettings.Port,
                Credentials = new NetworkCredential(_smtpSettings.Username, _smtpSettings.Password),
                EnableSsl = _smtpSettings.EnableSSL
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_smtpSettings.Username),
                Subject = request.Subject,
                Body = request.Body,
                IsBodyHtml = false
            };
            if (string.IsNullOrEmpty(request.To))
            {
                throw new ArgumentException("Recipient email cannot be null or empty.");
            }
            mailMessage.To.Add(request.To);

            await smtpClient.SendMailAsync(mailMessage);

            return Ok(new { message = "Email sent successfully!" });
        }
        catch (System.Exception ex)
        {
            return StatusCode(500, new { message = "Email sending failed.", error = ex.Message });
        }
    }
}
