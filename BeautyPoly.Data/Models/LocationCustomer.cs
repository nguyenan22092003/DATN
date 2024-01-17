namespace BeautyPoly.Models
{
    public class LocationCustomer
    {
        public int LocationCustomerID { get; set; }
        public int? PotentialCustomerID { get; set; }
        public int? ProvinceID { get; set; }
        public int? DistrictID { get; set; }
        public string? WardID { get; set; }
        public string? Address { get; set; }
        public bool? IsDefault { get; set; }
        public bool? IsDelete { get; set; }
        public virtual PotentialCustomer? PotentialCustomer { get; set; }

    }
}
