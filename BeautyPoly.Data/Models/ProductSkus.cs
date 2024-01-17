using BeautyPoly.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Models
{
    public class ProductSkus
    {
        public int ProductSkusID { get; set; }
        public int? ProductID { get; set; }
        public string? Sku { get; set; }
        public string? ProductVariantCode { get; set; }
        public string? ProductVariantName { get; set; }
        public string? Image { get; set; }
        public double? CapitalPrice { get; set; }
        public double? Price { get; set; }
        public int? Quantity { get; set; }
        public bool? IsDelete { get; set; }

        public virtual Product? Product { get; set; }
        public virtual IEnumerable<ProductDetails>? ProductDetails { get; set; }
        public virtual IEnumerable<CartDetails>? CartDetails { get; set; }
        public virtual IEnumerable<OrderDetails>? OrderDetails { get; set; }
        public virtual IEnumerable<SaleItems>? SaleItems { get; set; }
    }
}
