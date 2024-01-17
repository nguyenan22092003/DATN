using BeautyPoly.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.ViewModels.Customer
{
    public class ProductDetailsViewModelCustomer : Product
    {
        public double MinPrice { get; set; }
        public double MaxPrice { get; set; }
    }
}
