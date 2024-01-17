namespace BeautyPoly.Models
{
    public class Coupon
    {
        public int CouponID { get; set; }
        public string? CouponCode { get; set; }
        public DateTime? CreateDate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? DiscountValue { get; set; }
        public string? CouponName { get; set; }
        public int? CouponType { get; set; }
        public int? Quantity { get; set; }
        public string? Description { get; set; }
        public bool? IsDelete { get; set; }

        public virtual IEnumerable<Order>? Orders { get; set; }
    }
}
