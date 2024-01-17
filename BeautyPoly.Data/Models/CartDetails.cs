namespace BeautyPoly.Models
{
    public class CartDetails
    {
        public int CartDetailsID { get; set; }
        public int? CartID { get; set; }
        public int ProductSkusID { get; set; }
        public int? Quantity { get; set; }
        public double? TotalPrice { get; set; }
        public int? Price { get; set; }

        public virtual Cart? Cart { get; set; }
        public virtual ProductSkus? ProductSkus { get; set; }
    }
}
