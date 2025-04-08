using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace sam.Migrations
{
    /// <inheritdoc />
    public partial class editCourse : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FacultyCode",
                table: "Courses",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FacultyCode",
                table: "Courses");
        }
    }
}
