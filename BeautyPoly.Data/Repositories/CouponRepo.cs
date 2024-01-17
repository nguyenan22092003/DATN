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
    public class CouponRepo : GenericRepo<Coupon>
    {
        public CouponRepo(BeautyPolyDbContext dbContext) : base(dbContext)
        {
        }
        public List<Coupon> GetAllCoupon(string filter)
        {
            List<Coupon> list = SQLHelper<Coupon>.ProcedureToList("spGetCoupon", new string[] { "@Keyword" }, new object[] { filter });
            return list;
        }
    }
}
