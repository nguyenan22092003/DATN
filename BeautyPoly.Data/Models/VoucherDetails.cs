namespace BeautyPoly.Models
{
    public class VoucherDetails
    {
        public int VoucherDetailsID { get; set; }
        public int? PotentialCustomerID { get; set; }
        public int? VoucherID { get; set; }

        public virtual PotentialCustomer? PotentialCustomer { get; set; }
        public virtual Vouchers? Vouchers { get; set; }
    }
}
