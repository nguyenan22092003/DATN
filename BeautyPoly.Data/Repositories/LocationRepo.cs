using BeautyPoly.DBContext;
using BeautyPoly.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.Repositories
{
    public class LocationRepo : GenericRepo<LocationCustomer>
    {
        public LocationRepo(BeautyPolyDbContext dbContext) : base(dbContext)
        {
        }
    }
}
