namespace BeautyPoly.Models
{
    public class Order
    {
        public int OrderID { get; set; }
        public int? PotentialCustomerID { get; set; }
        public int? TransactStatusID { get; set; }
        public int? CouponID { get; set; }
        public int? VoucherID { get; set; }
        public int? AccountID { get; set; }
        public string? AccountName { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerPhone { get; set; }
        public DateTime? OrderDate { get; set; }
        public DateTime? ShipDate { get; set; }
        public string? OrderCode { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string? Note { get; set; }
        public double? TotalMoney { get; set; }
        public double? ReceiveCustomerMoney { get; set; }
        public double? ReturnCustomerMoney { get; set; }
        public string? Address { get; set; }
        public string? MedthodPayment { get; set; }
        public string? PurchaseMethod { get; set; }
        public bool? IsApproved { get; set; }
        public bool? IsDelete { get; set; }
        public int? Discount { get; set; }
        public int? ShipPrice { get; set; }
        public virtual Accounts? Accounts { get; set; }
        public virtual TransactStatus? TransactStatus { get; set; }
        public virtual Coupon? Coupon { get; set; }
        public virtual PotentialCustomer? PotentialCustomer { get; set; }
        public virtual IEnumerable<OrderDetails>? OrderDetails { get; set; }
    }
}
