using BeautyPoly.Common;
using BeautyPoly.Data.ViewModels;
using BeautyPoly.DBContext;
using BeautyPoly.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.Repositories
{
    public class OptionRepo : GenericRepo<Option>
    {
        public OptionRepo(BeautyPolyDbContext dbContext) : base(dbContext)
        {
        }
        public List<Option> GetAllOption(string filter)
        {
            List<Option> list = SQLHelper<Option>.ProcedureToList("spGetOption",new string[] { "@KeyWord" },new object[] {filter});
            return list;
        }
    }
}
