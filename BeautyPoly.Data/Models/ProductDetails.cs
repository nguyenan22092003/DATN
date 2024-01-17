namespace BeautyPoly.Models
{
    public class ProductDetails
    {
        public int ProductDetailsID { get; set; }
        public int? ProductSkusID { get; set; }
        public int? OptionDetailsID { get; set; }
        public int? OptionValueID { get; set; }
        

        public virtual ProductSkus? ProductSkus { get; set; }
        public virtual OptionDetails? OptionDetails { get; set; }
        public virtual OptionValue? OptionValue { get; set; }
    }
}
