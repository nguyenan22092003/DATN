namespace BeautyPoly.Models
{
    public class OrderDetails
    {
        public int OrderDetailsID { get; set; }
        public int? OrderID { get; set; }
        public int ProductSkusID { get; set; }
        public int? Quantity { get; set; }
        public double? TotalMoney { get; set; }
        public int? Price { get; set; }
        public int? PriceNew { get; set; }
        public int? Status { get; set; }

        public virtual Order? Order { get; set; }
        public virtual ProductSkus? ProductSkus { get; set; }
    }
}
