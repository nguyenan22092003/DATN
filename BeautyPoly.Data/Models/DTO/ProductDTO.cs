namespace BeautyPoly.Data.Models.DTO
{
    public class ProductDTO
    {
        public int ID { get; set; }
        public string? ProductName { get; set; }
        public string? ProductCode { get; set; }
        public int? CateID { get; set; }
        public List<int> ListOptionID { get; set; }
        public List<SkuDTO> ListSku { get; set; }
        public List<int> DeleteOptionDetail { get; set; }
    }
}
