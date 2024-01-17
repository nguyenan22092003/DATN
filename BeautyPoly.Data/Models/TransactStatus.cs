namespace BeautyPoly.Models
{
    public class TransactStatus
    {
        public int TransactStatusID { get; set; }
        public string? TransactStatusCode { get; set; }
        public string? StatusName { get; set; }
        public string? Description { get; set; }
        public bool? IsDelete { get; set; }

        public virtual IEnumerable<Order>? Orders { get; set; }
    }
}
