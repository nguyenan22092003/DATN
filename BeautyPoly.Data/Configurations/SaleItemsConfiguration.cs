using BeautyPoly.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.Configurations
{
    public class SaleItemsConfiguration : IEntityTypeConfiguration<SaleItems>
    {
        public void Configure(EntityTypeBuilder<SaleItems> builder)
        {
            builder.HasKey(p => p.SaleItemsID);
            builder.HasOne(p=>p.Sale).WithMany(p => p.SaleItems).HasForeignKey(p => p.SaleID);
            builder.HasOne(p=>p.ProductSkus).WithMany(p => p.SaleItems).HasForeignKey(p => p.ProductSkusID);
        }
    }
}
