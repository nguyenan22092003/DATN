using BeautyPoly.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.Models.DTO
{
    public class CustomerDTO
    {
        public PotentialCustomer PotentialCustomer { get; set; }
        public List<LocationCustomer> LocationCustomers { get; set; }
        public List<int> ListDeleteValues { get; set; }
    }
}
