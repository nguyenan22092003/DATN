using BeautyPoly.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.Configurations
{
    public class ProductSkuConfiguration : IEntityTypeConfiguration<ProductSkus>
    {
        public void Configure(EntityTypeBuilder<ProductSkus> builder)
        {
            builder.HasKey(p => p.ProductSkusID);
            builder.Property(p => p.Sku).HasColumnType("nvarchar(50)");
            builder.Property(p => p.ProductVariantCode).HasColumnType("nvarchar(50)");
            builder.HasOne(p=>p.Product).WithMany(p => p.ProductSkus).HasForeignKey(p => p.ProductID);
        }
    }
}
