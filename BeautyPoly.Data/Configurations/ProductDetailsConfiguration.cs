using BeautyPoly.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BeautyPoly.Configurations
{
    public class ProductDetailsConfiguration : IEntityTypeConfiguration<ProductDetails>
    {
        public void Configure(EntityTypeBuilder<ProductDetails> builder)
        {
            builder.HasKey(p => p.ProductDetailsID);

            builder.HasOne(p => p.ProductSkus).WithMany(p => p.ProductDetails).HasForeignKey(p => p.ProductSkusID);
            builder.HasOne(p => p.OptionDetails).WithMany(p => p.ProductDetails).HasForeignKey(p => p.OptionDetailsID);
            builder.HasOne(p => p.OptionValue).WithMany(p => p.ProductDetails).HasForeignKey(p => p.OptionValueID);
        }
    }
}
