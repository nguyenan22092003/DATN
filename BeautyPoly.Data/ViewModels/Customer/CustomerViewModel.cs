using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.ViewModels.Customer
{
    public class CustomerViewModel
    {
        public long CustomerId { get; set; }

        [Required(ErrorMessage = "Họ và tên không được để trống")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Số điện thoại không được để trống")]
        [RegularExpression(@"^(\d{10}|\d{11})$", ErrorMessage = "Số điện thoại không hợp lệ")]
        public string Phone { get; set; }
        public string Email { get; set; }

        [Required(ErrorMessage = "Ngày sinh không được để trống")]
        public DateTime DateBirth { get; set; }

        [Required(ErrorMessage = "Địa chỉ không được để trống")]
        public string Address { get; set; }

       
    }
}
