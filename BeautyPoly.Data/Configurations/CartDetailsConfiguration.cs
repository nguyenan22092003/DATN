using BeautyPoly.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BeautyPoly.Configurations
{
    public class CartDetailsConfiguration : IEntityTypeConfiguration<CartDetails>
    {
        public void Configure(EntityTypeBuilder<CartDetails> builder)
        {
            builder.HasKey(p => p.CartDetailsID);
            builder.Property(p => p.CartID);
            builder.Property(p => p.ProductSkusID);
            builder.Property(p => p.Quantity);
            builder.Property(p => p.TotalPrice);
            builder.Property(p => p.Price);

            builder.HasOne(p=>p.Cart).WithMany(p=>p.CartDetails).HasForeignKey(p=>p.CartID);
            builder.HasOne(p=>p.ProductSkus).WithMany(p=>p.CartDetails).HasForeignKey(p=>p.ProductSkusID);
        }
    }
}
