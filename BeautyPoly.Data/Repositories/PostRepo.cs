using BeautyPoly.Common;
using BeautyPoly.Data.ViewModels;
using BeautyPoly.DBContext;
using BeautyPoly.Models;

namespace BeautyPoly.Data.Repositories
{
    public class PostRepo : GenericRepo<Posts>
    {
        BeautyPolyDbContext _dbContext;
        public PostRepo(BeautyPolyDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }
        public List<PostViewModel> GetAllPost(string? filter)
        {
            List<PostViewModel> list = SQLHelper<PostViewModel>.ProcedureToList("spGetPost", new string[] { "@Keyword" }, new object[] { filter });
            return list;
        }
        public PostViewModel GetDetailPost(int filter)
        {
            PostViewModel detail = SQLHelper<PostViewModel>.ProcedureToModel("spGetDetailPost", new string[] { "@Keyword" }, new object[] { filter });
            return detail;
        }
    }
}
