using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.ViewModels
{
    public class OptionDetailViewModel
    {
        public int OptionDetailsID { get; set; }
        public int? ProductID { get; set; }
        public int? OptionID { get; set; }
        public string? OptionName { get; set; }
    }
}
