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
    public class CourseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CourseController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("courses")]
        public async Task<IActionResult> GetCourses()
        {
            var courses = await _context.Courses.ToListAsync();

            var groupedCourses = courses
                .GroupBy(c => c.FacultyCode)
                .ToDictionary(g => g.Key, g => g.Select(c => new
                {
                    code = c.CourseCode,
                    name = c.CourseName,
                    quota = c.Quota
                }).ToList());

            return Ok(groupedCourses);
        }

        [HttpPut("updateQuotas")]
        public async Task<IActionResult> UpdateQuotas([FromBody] List<UpdateQuotaDto> updates)
        {
            if (updates == null || !updates.Any())
            {
                return BadRequest("No quota updates provided.");
            }

            var courseCodes = updates.Select(u => u.Code).ToList();

            var courses = await _context.Courses
                .Where(c => courseCodes.Contains(c.CourseCode))
                .ToListAsync();

            foreach (var update in updates)
            {
                var course = courses.FirstOrDefault(c => c.CourseCode == update.Code);
                if (course != null)
                {
                    course.Quota = update.Quota;
                    _context.Entry(course).State = EntityState.Modified;
                }
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }


        [HttpGet("faculties")]
        public async Task<IActionResult> GetFaculties()
        {
            var faculties = await _context.Courses
                .Select(c => new { c.FacultyCode, c.Faculty })
                .Distinct()
                .ToListAsync();

            return Ok(faculties);
        }

        [HttpGet("subjects")]
        public async Task<ActionResult<IEnumerable<Subject>>> GetSubjects()
        {
            var sortedSubjects = await _context.Subjects
                .OrderBy(s => s.Category)
                .ToListAsync();

            return Ok(sortedSubjects);
        }

        [HttpGet("subjects/{category}")]
        public async Task<IActionResult> GetSubjectsByCategory(string category)
        {
            var subjects = await _context.Subjects
                .Where(s => s.Category == category)
                .Select(s => new { s.SubjectName })
                .ToListAsync();

            if (subjects == null || !subjects.Any())
            {
                return NotFound("No subjects found for this category.");
            }

            return Ok(subjects);
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Subjects
                .Select(s => s.Category)
                .Distinct()
                .ToListAsync();

            return Ok(categories);
        }

        [HttpPost("add")]
        public async Task<ActionResult<Subject>> AddSubject(Subject subject)
        {
            _context.Subjects.Add(subject);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSubjects), new { id = subject.Id }, subject);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateSubject(int id, Subject subject)
        {
            if (id != subject.Id)
            {
                return BadRequest();
            }

            _context.Entry(subject).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteSubject(int id)
        {
            var subject = await _context.Subjects.FindAsync(id);
            if (subject == null)
            {
                return NotFound();
            }

            _context.Subjects.Remove(subject);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}
