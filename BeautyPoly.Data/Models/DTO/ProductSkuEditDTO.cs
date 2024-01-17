namespace BeautyPoly.Data.Models.DTO
{
    public class ProductSkuEditDTO
    {
        public int ID { get; set; }
        public string OptionValueID { get; set; }
        public int Quantity { get; set; }
        public double CapitalPrice { get; set; }
        public double Price { get; set; }
        public int ProductID { get; set; }
        public List<int> ListOptionID { get; set; }
        public List<int> DeleteOptioDetail { get; set; }
    }
}
