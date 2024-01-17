using BeautyPoly.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FigureFpoly.Configurations
{
    public class OrderDetailsConfiguration : IEntityTypeConfiguration<OrderDetails>
    {
        public void Configure(EntityTypeBuilder<OrderDetails> builder)
        {
            builder.HasKey(p => p.OrderDetailsID);

            builder.HasOne(p=>p.Order).WithMany(p=>p.OrderDetails).HasForeignKey(p=>p.OrderID);
            builder.HasOne(p=>p.ProductSkus).WithMany(p=>p.OrderDetails).HasForeignKey(p=>p.ProductSkusID);
        }
    }
}
