using BeautyPoly.DBContext;
using BeautyPoly.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.Repositories
{
    public class CartDetailsRepo : GenericRepo<CartDetails>
    {
        public CartDetailsRepo(BeautyPolyDbContext dbContext) : base(dbContext)
        {
        }
    }
}
