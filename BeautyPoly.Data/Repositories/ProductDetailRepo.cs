using BeautyPoly.DBContext;
using BeautyPoly.Models;

namespace BeautyPoly.Data.Repositories
{
    public class ProductDetailRepo : GenericRepo<ProductDetails>
    {

        public ProductDetailRepo(BeautyPolyDbContext dbContext) : base(dbContext)
        {
        }

    }
}
