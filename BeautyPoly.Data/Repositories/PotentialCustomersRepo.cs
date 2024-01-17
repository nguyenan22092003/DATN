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
    public class PotentialCustomersRepo : GenericRepo<PotentialCustomer>
    {
        public PotentialCustomersRepo(BeautyPolyDbContext dbContext) : base(dbContext)
        {
        }

        public List<PotentialCustomer> GetAll(string filter)
        {
            List<PotentialCustomer> list = SQLHelper<PotentialCustomer>.ProcedureToList("spGetPotentialCustomers", new string[] {"@KeyWord"}, new object[] {filter });
            return list;
        
        }
    }
}
