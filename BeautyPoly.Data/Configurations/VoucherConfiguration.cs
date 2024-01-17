using BeautyPoly.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BeautyPoly.Configurations
{
    public class VoucherConfiguration : IEntityTypeConfiguration<Vouchers>
    {
        public void Configure(EntityTypeBuilder<Vouchers> builder)
        {
            builder.HasKey(p => p.VoucherID);
            builder.Property(p => p.VoucherCode).HasColumnType("nvarchar(50)");
            builder.Property(p=>p.VoucherName).HasColumnType("nvarchar(100)");
            builder.Property(p=>p.Description).HasColumnType("nvarchar(200)");
        }
    }
}
