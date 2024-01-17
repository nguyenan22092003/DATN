using BeautyPoly.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BeautyPoly.Configurations
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.HasKey(p => p.ProductID);
            builder.Property(p => p.ProductName).HasColumnType("nvarchar(150)");
            builder.Property(p => p.ProductCode).HasColumnType("nvarchar(50)");

            builder.HasOne(p=>p.Categories).WithMany(p=>p.Products).HasForeignKey(p=>p.CateID);
        }
    }
}
