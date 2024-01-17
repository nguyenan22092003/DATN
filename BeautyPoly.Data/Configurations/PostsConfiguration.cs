using BeautyPoly.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BeautyPoly.Configurations
{
    public class PostsConfiguration : IEntityTypeConfiguration<Posts>
    {
        public void Configure(EntityTypeBuilder<Posts> builder)
        {
            builder.HasKey(p => p.PostsID);
            builder.Property(p => p.PostsCode).HasColumnType("nvarchar(50)");
            builder.Property(p => p.Title).HasColumnType("nvarchar(100)");
            builder.Property(p => p.Contents).HasColumnType("nvarchar(max)");
            builder.Property(p => p.Img).HasColumnType("nvarchar(max)");
            builder.Property(p => p.Tags).HasColumnType("nvarchar(100)");
            builder.Property(p => p.ShortContents).HasColumnType("nvarchar(100)");
            builder.Property(p => p.Author).HasColumnType("nvarchar(100)");
            builder.Property(p => p.Alias).HasColumnType("nvarchar(100)");
        }
    }
}
