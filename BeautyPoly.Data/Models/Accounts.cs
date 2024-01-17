namespace BeautyPoly.Models
{
    public class Accounts
    {
        public int AccountID { get; set; }
        public string? AccountCode { get; set; }
        public int? RoleID { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Password { get; set; }
        public DateTime? CreateDate { get; set; }
        public int? Status { get; set; }
        public bool? IsActive { get; set; }
        //public bool? IsDelete { get; set; }

        public virtual Roles? Roles { get; set; }
        public virtual IEnumerable<Order>? Orders { get; set; }
    }
}
