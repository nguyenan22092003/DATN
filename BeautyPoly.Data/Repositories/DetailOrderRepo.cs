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
    public class DetailOrderRepo : GenericRepo<OrderDetails>
    {
        public DetailOrderRepo(BeautyPolyDbContext dbContext) : base(dbContext)
        {
            
        }
    }
}
