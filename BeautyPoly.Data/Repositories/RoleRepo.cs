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
    public class RoleRepo : GenericRepo <Roles>
    {
        public RoleRepo(BeautyPolyDbContext dbContext)  :   base(dbContext) 
        {
        }
        
        public List<Roles> GetAllRole(string filter)
        {
            List<Roles> list = SQLHelper<Roles>.ProcedureToList("spGetRole", new string[] {"@KeyWord"}, new object[] {filter});
            return list;
        }

       
    }
}
