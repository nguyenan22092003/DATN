using BeautyPoly.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.Models.DTO
{
    public class OptionDTO
    {
        public Option Option { get; set; }
        public List<OptionValue> OptionValues { get; set; }
        public List<int> ListDeleteValues { get; set; }
    }
}
