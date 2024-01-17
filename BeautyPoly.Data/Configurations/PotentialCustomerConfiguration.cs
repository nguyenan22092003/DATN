using BeautyPoly.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BeautyPoly.Configurations
{
    public class PotentialCustomerConfiguration : IEntityTypeConfiguration<PotentialCustomer>
    {
        public void Configure(EntityTypeBuilder<PotentialCustomer> builder)
        {
            builder.HasKey(p => p.PotentialCustomerID);
            builder.Property(p => p.PotentialCustomerCode).HasColumnType("nvarchar(50)");
            builder.Property(p => p.FullName).HasColumnType("nvarchar(100)");
            builder.Property(p => p.Avatar).HasColumnType("nvarchar(100)");
            builder.Property(p => p.Email).HasColumnType("nvarchar(100)");
            builder.Property(p => p.Phone).HasColumnType("nvarchar(20)");
            builder.Property(p => p.Password).HasColumnType("nvarchar(100)");
        }
    }
}
