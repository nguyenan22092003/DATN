using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.ViewModels
{
    public class CategoryViewModel
    {
        public int CateId { get; set; }
        public int? ParentID { get; set; }
        public string? CateCode { get; set; }
        public string? CateName { get; set; }
        public string? Img { get; set; }
        public int? Ordersing { get; set; }
        public bool? IsPublished { get; set; }
        public string? Alias { get; set; }
        public string? Description { get; set; }
        public bool? IsDelete { get; set; }
        public int? Level { get; set; }
    }
}
