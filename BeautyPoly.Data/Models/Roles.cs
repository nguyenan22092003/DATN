namespace BeautyPoly.Models
{
    public class Roles
    {
        public int RoleID { get; set; }
        public string? RoleCode { get; set; }
        public string? RoleName { get; set; }
        public string? Description { get; set; }
        public bool? IsDelete { get; set; }

        public virtual IEnumerable<Accounts>? Accounts { get; set; }
    }
}
