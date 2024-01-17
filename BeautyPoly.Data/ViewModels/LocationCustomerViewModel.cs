namespace BeautyPoly.View.Areas.Admin.ViewModels
{
    public class LocationCustomerViewModel
    {
        public int LocationCustomerID { get; set; }
        public int PotentialCustomerID { get; set; }
        public int? ProvinceID { get; set; }
        public string ProvinceName { get; set; }
        public int? DistrictID { get; set; }
        public string DistrictName { get; set; }
        public string? WardID { get; set; }
        public string WardName { get; set; }
        public string? Address { get; set; }
        public bool? IsDefault { get; set; }
        public bool? IsDelete { get; set; }
    }
}
