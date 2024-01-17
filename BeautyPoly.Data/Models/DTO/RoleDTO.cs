using BeautyPoly.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.Models.DTO
{
    public class RoleDTO
    {
        public Roles Roles { get; set; }    
        public List<int> ListDeleteRoles { get; set; }
    }
}
