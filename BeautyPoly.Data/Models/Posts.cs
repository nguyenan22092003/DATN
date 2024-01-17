namespace BeautyPoly.Models
{
    public class Posts
    {
        public int PostsID { get; set; }
        public string? PostsCode { get; set; }
        public string? Title { get; set; }
        public string? Contents { get; set; }
        public string? Img { get; set; }
        public bool? IsPublished { get; set; }
        public string? Tags { get; set; }
        public string? ShortContents { get; set; }
        public string? Author { get; set; }
        public DateTime? CreateDate { get; set; }
        public string? Alias { get; set; }
        public bool? IsHot { get; set; }
        public bool? IsNewFeed { get; set; }
        public int? Status { get; set; }
        public bool? IsDelete { get; set; }
    }
}
