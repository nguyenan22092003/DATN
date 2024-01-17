using BeautyPoly.Data.Models;

namespace BeautyPoly.Models
{
    public class Sale
    {
        public int SaleID { get; set; }
        public string? SaleCode { get; set; }
        public string? SaleName { get; set; }
        public DateTime? CreateDate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? DiscountValue { get; set; }
        public int? SaleType { get; set; }
        public int? Quantity { get; set; }
        public string? Description { get; set; }
        public bool? IsDelete { get; set; }

        public virtual IEnumerable<SaleItems> SaleItems { get; set; }
    }
}
