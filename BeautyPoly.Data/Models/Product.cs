using BeautyPoly.Data.Models;

namespace BeautyPoly.Models
{
    public class Product
    {
        public int ProductID { get; set; }
        public int? CateID { get; set; }
        public string? ProductName { get; set; }
        public string? ProductCode { get; set; }
        public DateTime? CreateDate { get; set; }
        public DateTime? ModifiledDate { get; set; }
        public int? Status { get; set; }
        public bool? IsDelete { get; set; }

        public Categories? Categories { get; set; }
        public virtual IEnumerable<OptionDetails>? OptionDetails { get; set; }
        public virtual IEnumerable<ProductSkus>? ProductSkus { get; set; }
    }   
}
