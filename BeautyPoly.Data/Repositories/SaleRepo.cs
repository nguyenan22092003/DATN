using BeautyPoly.Common;
using BeautyPoly.Data.Models;
using BeautyPoly.DBContext;
using BeautyPoly.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.Repositories
{
    public class SaleRepo : GenericRepo<Sale>
    {
        public SaleRepo(BeautyPolyDbContext dbContext) : base(dbContext)
        {
        }
        public List<Sale> GetAllSale(string filter)
        {
            List<Sale> list = SQLHelper<Sale>.ProcedureToList("spGetSale", new string[] { "@Keyword" }, new object[] { filter });
            return list;
        }
        public List<Categories> GetAllCateIsSale()
        {
            List<Categories> list = SQLHelper<Categories>.ProcedureToList("spGetCategoryIsSale", new string[] { "@Id" }, new object[] { 0 });
            return list;
        }
        public List<Product> GetAllProductIsSale(string filter)
        {
            List<Product> list = SQLHelper<Product>.ProcedureToList("spGetProductIsSale", new string[] {"@Id", "@Keyword" }, new object[] {0, filter });
            return list;
        }
    }
}
