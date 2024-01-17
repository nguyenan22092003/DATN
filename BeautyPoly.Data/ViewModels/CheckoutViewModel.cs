using BeautyPoly.Models;

namespace BeautyPoly.View.ViewModels
{
    public class CheckoutViewModel
    {
        public Coupon? Coupon { get; set; }
        public Vouchers? Voucher { get; set; }
        public int Value { get; set; }
        public int TotalValue { get; set; }
        public string Note { get; set; }
    }
}
