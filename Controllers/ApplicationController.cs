using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sam.Data;
using sam.Models;

namespace sam.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ApplicationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Application
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Application>>> GetApplications()
        {
            return await _context.Applications.ToListAsync();
        }

        // GET: api/Application/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Application>> GetApplication(int id)
        {
            var application = await _context.Applications.FindAsync(id);

            if (application == null)
            {
                return NotFound();
            }

            return application;
        }

        [HttpGet("detail/{id}")]
        public async Task<ActionResult<Application>> GetDetailApplication(int id)
        {
            var application = await _context.Applications
                .Include(a => a.Applicants)  // Eagerly load related Applicants
                .FirstOrDefaultAsync(a => a.Id == id);

            if (application == null)
            {
                return NotFound();
            }

            return application;
        }

        [HttpPost]
        public async Task<ActionResult<Application>> PostApplication(CombinedApplicationDto input)
        {
            var application = new Application
            {
                Name = input.Name,
                SpmResult = input.SpmResult,
                PreUResult = input.PreUResult,
                PreUType = input.PreUType,
                AppliedProgram = input.Program_code
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            var applicant = new Applicant
            {
                Name = input.Name, 
                IcNumber = input.IcNumber,
                Address = input.Address,
                Gender = input.Gender,
                ApplicationId = application.Id
            };

            _context.Applicants.Add(applicant);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetApplication), new { id = application.Id }, application);
        }

        // PUT: api/Application/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutApplication(int id, Application application)
        {
            if (id != application.Id)
            {
                return BadRequest();
            }

            _context.Entry(application).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ApplicationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Application/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteApplication(int id)
        {
            var application = await _context.Applications.FindAsync(id);
            if (application == null)
            {
                return NotFound();
            }

            _context.Applications.Remove(application);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ApplicationExists(int id)
        {
            return _context.Applications.Any(e => e.Id == id);
        }
    }
}
