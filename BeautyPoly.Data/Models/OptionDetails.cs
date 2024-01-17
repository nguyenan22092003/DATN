using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Models
{
    public class OptionDetails
    {
        public int OptionDetailsID { get; set; }
        public int? ProductID { get; set; }
        public int? OptionID { get; set; }

        public virtual Product? Product { get; set; }
        public virtual Option? Option { get; set; }

        public virtual IEnumerable<ProductDetails>? ProductDetails { get; set; }
    }
}
