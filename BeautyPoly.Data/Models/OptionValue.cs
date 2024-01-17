using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Models
{
    public class OptionValue
    {
        public int OptionValueID { get; set; }
        public int? OptionID { get; set; }
        public string? OptionValueCode { get; set; }
        public string? OptionValueName { get; set; }
        public bool? IsDelete { get; set; }
        public bool? IsPublish { get; set; }

        public virtual Option? Option { get; set; }
        public virtual IEnumerable<ProductDetails>? ProductDetails { get; set; }
    }
}
