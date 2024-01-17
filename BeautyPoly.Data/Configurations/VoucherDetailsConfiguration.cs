using BeautyPoly.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BeautyPoly.Configurations
{
    public class VoucherDetailsConfiguration : IEntityTypeConfiguration<VoucherDetails>
    {
        public void Configure(EntityTypeBuilder<VoucherDetails> builder)
        {
            builder.HasKey(p => p.VoucherDetailsID);

            builder.HasOne(p=>p.PotentialCustomer).WithMany(p=>p.VoucherDetails).HasForeignKey(p=>p.PotentialCustomerID);
            builder.HasOne(p=>p.Vouchers).WithMany(p=>p.VoucherDetails).HasForeignKey(p=>p.VoucherID);
        }   
    }
}
