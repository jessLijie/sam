using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace sam.Migrations
{
    /// <inheritdoc />
    public partial class updateApplicationModal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Applicants_ApplicationId",
                table: "Applicants",
                column: "ApplicationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Applicants_Applications_ApplicationId",
                table: "Applicants",
                column: "ApplicationId",
                principalTable: "Applications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applicants_Applications_ApplicationId",
                table: "Applicants");

            migrationBuilder.DropIndex(
                name: "IX_Applicants_ApplicationId",
                table: "Applicants");
        }
    }
}
