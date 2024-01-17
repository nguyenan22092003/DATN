using BeautyPoly.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BeautyPoly.Configurations
{
    public class SaleConfiguration : IEntityTypeConfiguration<Sale>
    {
        public void Configure(EntityTypeBuilder<Sale> builder)
        {
            builder.HasKey(p => p.SaleID);
            builder.Property(p => p.SaleCode).HasColumnType("nvarchar(50)");
            builder.Property(p => p.SaleName).HasColumnType("nvarchar(100)");
            builder.Property(p => p.Description).HasColumnType("nvarchar(200)");
        }
    }
}
