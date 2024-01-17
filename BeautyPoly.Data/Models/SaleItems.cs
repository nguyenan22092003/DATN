using BeautyPoly.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.Models
{
    public class SaleItems
    {
        public int SaleItemsID { get; set; }
        public int? SaleID { get; set; }
        public int? ProductSkusID { get; set; }
        public bool? IsSelect { get; set; }
        public virtual Sale? Sale { get; set; }
        public virtual ProductSkus? ProductSkus { get; set; }
    }
}
