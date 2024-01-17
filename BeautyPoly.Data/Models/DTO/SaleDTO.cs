using BeautyPoly.Data.Repositories;
using BeautyPoly.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.Models.DTO
{
    public class SaleDTO
    {
        public Sale Sale { get; set; }
        public List<SaleItems> arrSaleItems { get; set; }        
    }
}
