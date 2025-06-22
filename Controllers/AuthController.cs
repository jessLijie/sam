
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sam.Data;
using sam.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sam.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        // In-memory users for simplicity
        private static readonly List<(string Username, string Password)> _users = new()
    {
        ("admin123", "password"),
        ("admin456", "password"),
        ("admin789", "password")
    };

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _users.FirstOrDefault(u =>
                u.Username.Equals(request.Username, StringComparison.OrdinalIgnoreCase) &&
                u.Password == request.Password);

            if (user == default)
            {
                return Unauthorized("Invalid username or password");
            }

            // Fake token (replace with JWT if needed later)
            var token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());

            return Ok(new { token, username = user.Username });
        }

    }
}