using BeautyPoly.Common;
using BeautyPoly.Data.Models;
using BeautyPoly.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace BeautyPoly.DBContext
{
    public class BeautyPolyDbContext : DbContext
    {
        public BeautyPolyDbContext()
        {
        }
        public BeautyPolyDbContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Accounts> Accounts { get; set; }
        public DbSet<Cart> Cart { get; set; }
        public DbSet<CartDetails> CartDetails { get; set; }
        public DbSet<Categories> Categories { get; set; }
        public DbSet<Coupon> Coupons { get; set; }
        public DbSet<LocationCustomer> LocationCustomers { get; set; }
        public DbSet<Option> Options { get; set; }
        public DbSet<OptionDetails> OptionDetails { get; set; }
        public DbSet<OptionValue> OptionValues { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetails> OrderDetails { get; set; }
        public DbSet<Posts> Posts { get; set; }
        public DbSet<PotentialCustomer> PotentialCustomers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductDetails> ProductDetails { get; set; }
        public DbSet<Roles> Roles { get; set; }
        public DbSet<Sale> Sale { get; set; }
        public DbSet<TransactStatus> TransactStatuses { get; set; }
        public DbSet<VoucherDetails> VoucherDetails { get; set; }
        public DbSet<Vouchers> Vouchers { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(Config.Connection());
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}
