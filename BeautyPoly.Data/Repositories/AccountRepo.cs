using BeautyPoly.Common;
using BeautyPoly.DBContext;
using BeautyPoly.Models;
using BeautyPoly.View.Areas.Admin.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.Repositories
{
    public class AccountRepo : GenericRepo<Accounts>
    {
        public AccountRepo(BeautyPolyDbContext dbContext) : base(dbContext)
        {
        }

        public List<AccountViewModel> GetAllAccounts(string filter)
        {
            List<AccountViewModel> list = SQLHelper<AccountViewModel>.ProcedureToList("spGetAccount", new string[] { "@KeyWord" }, new object[] { filter });
            return list;
        }
    }
}
