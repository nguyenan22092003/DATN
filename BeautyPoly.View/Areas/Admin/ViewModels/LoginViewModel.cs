using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace BeautyPoly.Areas.Admin.Models
{
    public class ExternalLoginConfirmationViewModel
    {
        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }

    public class ExternalLoginListViewModel
    {
        public string ReturnUrl { get; set; }
    }

    public class SendCodeViewModel
    {
        public string SelectedProvider { get; set; }
        public string ReturnUrl { get; set; }
        public bool RememberMe { get; set; }
    }

    public class VerifyCodeViewModel
    {
        [Required]
        public string Provider { get; set; }

        [Required]
        [Display(Name = "Code")]
        public string Code { get; set; }
        public string ReturnUrl { get; set; }

        [Display(Name = "Remember this browser?")]
        public bool RememberBrowser { get; set; }

        public bool RememberMe { get; set; }
    }

    public class ForgotViewModel
    {
        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }

    //Đăng nhập
    public class LoginViewModel
    {
        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }
    }
    //Tạo mới tài khoản
    public class CreateAccountViewModel
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string FullName { get; set; }

        [Required]
        [MaxLength(10)]
        [RegularExpression(@"^(0|\+84)[3|5|7|8|9]\d{8}$", ErrorMessage = "Số điện thoại không hợp lệ.")]
        [DataType(DataType.PhoneNumber)]
        public string Phone { get; set; }
        public string Role { get; set; }

        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Mật khẩu quá ngắn, vui lòng thử lại.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "Mật khẩu và mật khẩu nhập lại không khớp.")]
        public string ConfirmPassword { get; set; }
    }
    //Đăng ký tài khoản
    public class RegisterViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [MaxLength(10)]
        [RegularExpression(@"^(0|\+84)[3|5|7|8|9]\d{8}$", ErrorMessage = "Số điện thoại không hợp lệ.")]
        [DataType(DataType.PhoneNumber)]
        public string Phone { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Mật khẩu quá ngắn vui lòng thử lại.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "Mật khẩu và mật khẩu nhập lại không khớp.")]
        public string ConfirmPassword { get; set; }
    }

    //Đổi mật khẩu
    public class ResetPasswordViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Mật khẩu quá ngắn, vui lòng thử lại.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "Mật khẩu và mật khẩu nhập lại không khớp.")]
        public string ConfirmPassword { get; set; }

        public string Code { get; set; }
    }

    //Lấy lại mật khẩu bằng email
    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }
}
