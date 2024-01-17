using BeautyPoly.Data.Models;
using BeautyPoly.DBContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.Repositories
{
    public class SaleItemsRepo : GenericRepo<SaleItems>
    {
        public SaleItemsRepo(BeautyPolyDbContext dbContext) : base(dbContext)
        {
        }
    }
}
