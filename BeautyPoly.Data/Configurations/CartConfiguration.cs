using BeautyPoly.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BeautyPoly.Configurations
{
    public class CartConfiguration : IEntityTypeConfiguration<Cart>
    {
        public void Configure(EntityTypeBuilder<Cart> builder)
        {
            builder.HasKey(p=>p.PotentialCustomerID);
            builder.Property(p => p.Note).HasColumnType("nvarchar(200)");
            builder.Property(p => p.TotalMoney);
            builder.HasOne(p => p.PotentialCustomer).WithOne(p => p.Cart);
        }
    }
}
