using BeautyPoly.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BeautyPoly.Configurations
{
    public class AccountsConfiguration : IEntityTypeConfiguration<Accounts>
    {
        public void Configure(EntityTypeBuilder<Accounts> builder)
        {
            builder.HasKey(p => p.AccountID);
            builder.Property(p => p.AccountCode).HasColumnType("nvarchar(50)");
            builder.Property(p => p.FullName).HasColumnType("nvarchar(100)");
            builder.Property(p => p.Email).HasColumnType("nvarchar(100)");
            builder.Property(p => p.Phone).HasColumnType("nvarchar(20)");
            builder.Property(p => p.Password).HasColumnType("nvarchar(50)");

            builder.HasOne(p => p.Roles).WithMany(p => p.Accounts).HasForeignKey(p => p.RoleID);
        }
    }
}
