namespace BeautyPoly.Data.Models.DTO
{
    public class ProductSkuDetailDTO
    {
        public int ID { get; set; }
        public int ProductID { get; set; }
        public List<int> ListOptionID { get; set; }
        public List<SkuDTO> ListSku { get; set; }
        public List<int> DeleteOptionDetail { get; set; }
    }

    public class SkuDTO
    {
        public string OptionValueID { get; set; }
        public int Quantity { get; set; }
        public double CapitalPrice { get; set; }
        public double Price { get; set; }
        public string Image { get; set; }
    }
}
