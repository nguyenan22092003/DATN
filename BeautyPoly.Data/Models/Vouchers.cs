namespace BeautyPoly.Models
{
    public class Vouchers
    {
        public int VoucherID { get; set; }
        public string? VoucherCode { get; set; }
        public string? VoucherName { get; set; }
        public DateTime? CreateDate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? MinValue { get; set; }
        public int? DiscountValue { get; set; }
        public int? MaxValue { get; set; }
        public int? VoucherType { get; set; }
        public int? Quantity { get; set; }
        public int? UseQuantity { get; set; }
        public string? Description { get; set; }
        public bool? IsDelete { get; set; }

        public virtual IEnumerable<VoucherDetails>? VoucherDetails { get; set; }
    }
}
