using BeautyPoly.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BeautyPoly.Configurations
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.HasKey(p => p.OrderID);
            builder.Property(p => p.AccountName).HasColumnType("nvarchar(100)");
            builder.Property(p => p.CustomerName).HasColumnType("nvarchar(100)");
            builder.Property(p => p.OrderCode).HasColumnType("nvarchar(50)");
            builder.Property(p => p.Note).HasColumnType("nvarchar(200)");
            builder.Property(p => p.Address).HasColumnType("nvarchar(150)");
            builder.Property(p => p.MedthodPayment).HasColumnType("nvarchar(100)");
            builder.Property(p => p.PurchaseMethod).HasColumnType("nvarchar(100)");

            builder.HasOne(p => p.Accounts).WithMany(p => p.Orders).HasForeignKey(p => p.AccountID);
            builder.HasOne(p => p.TransactStatus).WithMany(p => p.Orders).HasForeignKey(p => p.TransactStatusID);
            builder.HasOne(p => p.Coupon).WithMany(p => p.Orders).HasForeignKey(p => p.CouponID);
            builder.HasOne(p => p.PotentialCustomer).WithMany(p => p.Orders).HasForeignKey(p => p.PotentialCustomerID);
        }
    }
}
