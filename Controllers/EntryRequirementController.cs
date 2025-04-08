using Microsoft.AspNetCore.Mvc;
namespace sam.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EntryRequirementController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EntryRequirementController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("general")]
        public async Task<ActionResult<IEnumerable<EntryRequirements>>> GetGeneralRequirements()
        {
            var generalRequirements = await _context.EntryRequirements
                                                    .Where(r => r.Requirement_type == "general")
                                                    .OrderBy(r => r.Graduate_type)
                                                    .ToListAsync();
            return Ok(generalRequirements);
        }

        [HttpGet("special/{programCode}")]
        public IActionResult GetSpecialRequirements(string programCode)
        {
            var specialRequirements = _context.EntryRequirements
                .Where(x => x.Program_code == programCode)
                .OrderBy(x => x.Graduate_type)
                .ToList();
            return Ok(specialRequirements);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateEntryRequirement(int id, [FromBody] EntryRequirements updatedRequirement)
        {
            if (id != updatedRequirement.Id)
            {
                return BadRequest("ID mismatch.");
            }

            var existingRequirement = await _context.EntryRequirements.FindAsync(id);

            if (existingRequirement == null)
            {
                return NotFound("Entry requirement not found.");
            }

            existingRequirement.Grade = updatedRequirement.Grade;
            existingRequirement.Subject = updatedRequirement.Subject;
            existingRequirement.Requirement_type = updatedRequirement.Requirement_type;
            existingRequirement.Graduate_type = updatedRequirement.Graduate_type;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(existingRequirement);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteEntryRequirement(int id)
        {
            var requirement = await _context.EntryRequirements.FindAsync(id);

            if (requirement == null)
            {
                return NotFound("Entry requirement not found.");
            }

            _context.EntryRequirements.Remove(requirement);

            try
            {
                await _context.SaveChangesAsync();
                return Ok("Entry requirement deleted successfully.");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateEntryRequirement([FromBody] EntryRequirements newRequirement)
        {
            if (newRequirement == null)
            {
                return BadRequest("Invalid data.");
            }

            if (newRequirement.Requirement_type == "general")
            {
                var existingRequirement = await _context.EntryRequirements
                    .FirstOrDefaultAsync(r => r.Graduate_type == newRequirement.Graduate_type
                                              && r.Subject == newRequirement.Subject
                                              && r.Requirement_type == newRequirement.Requirement_type);

                if (existingRequirement != null)
                {
                    return Conflict("A combination of category, subject, and requirement type already exists.");
                }
            }

            if (!string.IsNullOrEmpty(newRequirement.Faculty) && !string.IsNullOrEmpty(newRequirement.Program_code))
            {
                var existingSpecialRequirement = await _context.EntryRequirements
                    .FirstOrDefaultAsync(r => r.Faculty == newRequirement.Faculty
                                              && r.Program_code == newRequirement.Program_code
                                              && r.Graduate_type == newRequirement.Graduate_type
                                              && r.Subject == newRequirement.Subject
                                              && r.Requirement_type == newRequirement.Requirement_type);

                if (existingSpecialRequirement != null)
                {
                    return Conflict("A combination of category, subject, requirement type, faculty, and program code already exists.");
                }
            }

            _context.EntryRequirements.Add(newRequirement);

            try
            {
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetGeneralRequirements), new { id = newRequirement.Id }, newRequirement);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


    }



}
