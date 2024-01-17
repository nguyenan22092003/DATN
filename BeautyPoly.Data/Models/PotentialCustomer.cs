namespace BeautyPoly.Models
{
    public class PotentialCustomer
    {
        public int PotentialCustomerID { get; set; }
        public string? PotentialCustomerCode { get; set; }
        public string? FullName { get; set; }
        public DateTime? Birthday { get; set; }
        public string? Avatar { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public DateTime? CreateDate { get; set; }
        public string? Password { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDelete { get; set; }
        public string? ResetPasswordcode { get; set; } //Duy update 17/12/2023
        public virtual Cart? Cart { get; set; }
        public virtual IEnumerable<LocationCustomer>? LocationCustomers { get; set; }
        public virtual IEnumerable<Order>? Orders { get; set; }
        public virtual IEnumerable<VoucherDetails>? VoucherDetails { get; set; }
    }
}
