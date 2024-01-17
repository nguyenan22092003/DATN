namespace BeautyPoly.Data.ViewModels
{
    public class ProductSkusViewModel
    {
        public int ProductSkusID { get; set; }
        public int? ProductID { get; set; }
        public int? SaleID { get; set; }
        public int? SaleType { get; set; }
        public int? DiscountValue { get; set; }
        public long? STT { get; set; }
        public string? Sku { get; set; }
        public double? CapitalPrice { get; set; }
        public double? Price { get; set; }
        public double? PriceNew { get; set; }
        public int? Quantity { get; set; }
        public bool? IsDelete { get; set; }
        public int CountOption { get; set; }
        public string? ProductSkuName { get; set; }
        public int QuantityCart { get; set; }
        public double TotalPrice { get; set; }
        public double TotalPriceSale { get; set; }
        public string? ProductName { get; set; }
        public string? Image { get; set; }
    }
}
