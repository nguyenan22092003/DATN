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
    public class OrderRepo : GenericRepo<Order>
    {
        public OrderRepo(BeautyPolyDbContext dbContext) : base(dbContext)
        {
        }

        public List<Order> GetAllCategory(string filter, int? parentID, int? cateID)
        {
            List<Order> list = SQLHelper<Order>.ProcedureToList("spGetOrders", new string[] { "@Keyword"}, new object[] { filter});
            return list;
        }
    }
}
