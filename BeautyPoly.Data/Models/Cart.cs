namespace BeautyPoly.Models
{
    public class Cart
    {
        public int PotentialCustomerID { get; set; }
        public string? Note { get; set; }
        public double? TotalMoney { get; set; }
        public virtual PotentialCustomer? PotentialCustomer { get; set; }
        public virtual IEnumerable<CartDetails>? CartDetails { get; set; }
    }
}
