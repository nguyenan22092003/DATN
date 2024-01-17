using BeautyPoly.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.Models
{
    public class Categories
    {
        public int CateID { get; set; }
        public string? CateCode { get; set; }
        public string? CateName { get; set; }
        public bool? IsDelete { get; set; } = false;

        public virtual IEnumerable<Product>? Products { get; set; }
    }
}
