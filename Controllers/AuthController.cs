
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using sam.Data;
using sam.Models;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
namespace sam.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {

        private readonly IConfiguration _config;

        public AuthController(IConfiguration config)
        {
            _config = config;
        }
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
            try
            {
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _config["Jwt:Issuer"],
                    audience: _config["Jwt:Audience"],
                    claims: new[] { new Claim(ClaimTypes.Name, request.Username) },
                    expires: DateTime.Now.AddMinutes(Convert.ToDouble(_config["Jwt:ExpiresInMinutes"])),
                    signingCredentials: creds
                );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
                return Ok(new { token = tokenString, username = user.Username });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Token generation failed: {ex.Message}");
            }



        }

    }
}