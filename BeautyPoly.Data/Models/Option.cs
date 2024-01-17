using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Models
{
    public class Option
    {
        public int OptionID { get; set; }
        public string? OptionCode { get; set; }
        public string? OptionName { get; set; }
        public bool? IsDelete { get; set; }
        public bool? IsPublish { get; set; }

        public IEnumerable<OptionValue>? OptionValues { get; set; }
        public IEnumerable<OptionDetails>? OptionDetails { get; set; }
    }
}
