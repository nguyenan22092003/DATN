using BeautyPoly.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BeautyPoly.Configurations
{
    public class RolesConfiguration : IEntityTypeConfiguration<Roles>
    {
        public void Configure(EntityTypeBuilder<Roles> builder)
        {
            builder.HasKey(p => p.RoleID);
            builder.Property(p => p.RoleCode).HasColumnType("nvarchar(50)");
            builder.Property(p => p.RoleName).HasColumnType("nvarchar(100)");
            builder.Property(p => p.Description).HasColumnType("nvarchar(200)");
        }
    }
}
