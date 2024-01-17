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
    public class OptionValueConfiguration : IEntityTypeConfiguration<OptionValue>
    {
        public void Configure(EntityTypeBuilder<OptionValue> builder)
        {
            builder.HasKey(p => p.OptionValueID);
            builder.Property(p => p.OptionValueCode).HasColumnType("nvarchar(50)");
            builder.Property(p => p.OptionValueName).HasColumnType("nvarchar(100)");

            builder.HasOne(p => p.Option).WithMany(p => p.OptionValues).HasForeignKey(p=>p.OptionID);
        }
    }
}
