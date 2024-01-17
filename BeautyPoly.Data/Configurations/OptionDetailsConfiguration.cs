using BeautyPoly.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Configurations
{
    public class OptionDetailsConfiguration : IEntityTypeConfiguration<OptionDetails>
    {
        public void Configure(EntityTypeBuilder<OptionDetails> builder)
        {
            builder.HasKey(p => p.OptionDetailsID);
            
            builder.HasOne(p=>p.Product).WithMany(p => p.OptionDetails).HasForeignKey(p => p.ProductID);
            builder.HasOne(p=>p.Option).WithMany(p => p.OptionDetails).HasForeignKey(p => p.OptionID);
        }
    }
}
