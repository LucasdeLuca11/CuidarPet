using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CuidarPet.Api.Migrations
{
    /// <inheritdoc />
    public partial class ChangeCompanyTypeToEnum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "CompanyType",
                table: "users",
                type: "INTEGER",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 100,
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CompanyType",
                table: "users",
                type: "TEXT",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldMaxLength: 100,
                oldNullable: true);
        }
    }
}
