namespace BeautyPoly.Data.Models.DTO
{
    public class CheckOutDTO
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Note { get; set; }
        public int CouponID { get; set; }
        public bool UseVNPay { get; set; }
        public int Discount { get; set; }
        public int VoucherID { get; set; }
        public int CustomerID { get; set; }

    }
}
