using BeautyPoly.Common;
using BeautyPoly.DBContext;
using BeautyPoly.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.Repositories
{
    public class VoucherRepo : GenericRepo<Vouchers>
    {
        public VoucherRepo(BeautyPolyDbContext dbContext) : base(dbContext)
        {
        }
        public List<Vouchers> GetAllVoucher(string filter)
        {
            List<Vouchers> list = SQLHelper<Vouchers>.ProcedureToList("spGetVoucher", new string[] { "@Keyword" }, new object[] { filter });
            return list;
        }
        public List<Vouchers> GetVoucherByCustomer(int customerID)
        {
            List<Vouchers> list = SQLHelper<Vouchers>.ProcedureToList("spGetVoucherDetailsByCustomer", new string[] { "@CustomerID" }, new object[] { customerID });
            return list;
        }
    }
}
