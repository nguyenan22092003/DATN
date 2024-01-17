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
    public class CategoryConfiguration : IEntityTypeConfiguration<Categories>
    {
        public void Configure(EntityTypeBuilder<Categories> builder)
        {
            builder.HasKey(p => p.CateID);
            builder.Property(p => p.CateCode).HasColumnType("nvarchar(50)");
            builder.Property(p => p.CateName).HasColumnType("nvarchar(150)");
        }
    }
}
