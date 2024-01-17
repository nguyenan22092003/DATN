using BeautyPoly.Common;
using BeautyPoly.Data.Models;
using BeautyPoly.DBContext;
using BeautyPoly.Models;

namespace BeautyPoly.Data.Repositories
{
    public class CategoryRepo : GenericRepo<Categories>
    {
        public CategoryRepo(BeautyPolyDbContext dbContext) : base(dbContext)
        {
        }
        public List<Categories> GetAllCate(string filter)
        {
            return SQLHelper<Categories>.ProcedureToList("spGetCategory", new string[] { "@Keyword" }, new object[] { filter });
        }
    }
}
