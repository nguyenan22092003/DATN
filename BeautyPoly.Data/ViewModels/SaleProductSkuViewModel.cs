using BeautyPoly.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.ViewModels
{
    public class SaleProductSkuViewModel
    {
        public int saleID { get; set; }
        public string SaleName { get; set; }
        public int SaleType { get; set; }
        public int DiscountValue { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsSelect { get; set; }
        public double Price { get; set; }
        public string ProductVariantName { get; set; }
    }
}