using BeautyPoly.DBContext;
using BeautyPoly.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.Repositories
{
    public class CustomerRepository: GenericRepo<PotentialCustomer>
    {
        private readonly BeautyPolyDbContext _context;

        public CustomerRepository(BeautyPolyDbContext dbContext) : base(dbContext)
        {
        }
    }
}
