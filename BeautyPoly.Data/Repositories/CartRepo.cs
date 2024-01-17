using BeautyPoly.DBContext;
using BeautyPoly.Models;

namespace BeautyPoly.Data.Repositories
{
    public class CartRepo : GenericRepo<Cart>
    {
        public CartRepo(BeautyPolyDbContext dbContext) : base(dbContext)
        {
        }
    }
}
