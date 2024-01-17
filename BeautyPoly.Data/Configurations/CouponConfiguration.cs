using BeautyPoly.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BeautyPoly.Configurations
{
    public class CouponConfiguration : IEntityTypeConfiguration<Coupon>
    {
        public void Configure(EntityTypeBuilder<Coupon> builder)
        {
            builder.HasKey(p => p.CouponID);
            builder.Property(p => p.CouponCode).HasColumnType("nvarchar(50)");
            builder.Property(p => p.CouponName).HasColumnType("nvarchar(100)");
            builder.Property(p => p.Description).HasColumnType("nvarchar(200)");
        }
    }
}
