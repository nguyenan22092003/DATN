namespace BeautyPoly.Data.Models.DTO
{
    public class LocationCustomerDTO
    {
        public int LocationCustomerID { get; set; }
        public int PotentialCustomerID { get; set; }
        public int? ProvinceID { get; set; }
        public int? DistrictID { get; set; }
        public string? WardID { get; set; }
        public string? Address { get; set; }
        public bool? IsDefault { get; set; }
        public bool? IsDelete { get; set; }
    }
}
