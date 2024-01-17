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
    public class OptionConfiguration : IEntityTypeConfiguration<Option>
    {
        public void Configure(EntityTypeBuilder<Option> builder)
        {
            builder.HasKey(p => p.OptionID);
            builder.Property(p=>p.OptionCode).HasColumnType("nvarchar(50)");
            builder.Property(p=>p.OptionName).HasColumnType("nvarchar(100)");
        }
    }
}
