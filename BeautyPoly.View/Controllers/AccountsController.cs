using BeautyPoly.Data.Repositories;
using BeautyPoly.DBContext;
using BeautyPoly.Models;
using BeautyPoly.View.Extension;
using BeautyPoly.View.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;

namespace BeautyPoly.View.Controllers
{
    public class AccountsController : Controller
    {

        CustomerRepository _customerRepository;
        LoginAccountRepository _loginRepository;

        private readonly ISendEmail _sendEmail;

        private readonly BeautyPolyDbContext _context;

        public AccountsController(LoginAccountRepository loginRepository, ISendEmail sendEmail, CustomerRepository customerRepository)
        {
            _loginRepository = loginRepository;
            _sendEmail = sendEmail;
            _context = new BeautyPolyDbContext();
            _customerRepository = customerRepository;
        }
        [HttpPost("account/register")]
        public IActionResult Register([FromBody] PotentialCustomer model)
        {
            var check = _loginRepository.CreateCustomer(model);

            if (check == 1)
            {
                return Json(new { success = true });
            }
            else if (check == 2)
            {
                return Json(new { success = false });
            }
            else
            {
                return Json(new { success = false });
            }
        }
        [HttpPost("account/login")]
        public async Task<IActionResult> Login([FromBody] PotentialCustomer model)
        {
            var check = _loginRepository.Login(model);

            if (check != null)
            {
                // Your secret key for signing the token (keep it secret!)
                string secretKey = "pUPGPwLPV75oh909Fq+FidTseGoGfI9bl+tyCpHGOHk=";

                // Create a list of claims (you can customize this based on your needs)
                var claims = new[]
                {
                    new Claim("Name", check.FullName),
                    new Claim("Email", check.Email),
                    new Claim("Phone", check.Phone),
                    new Claim("DateOfBirth", check.Birthday.ToString()),
                    new Claim("Id", check.PotentialCustomerID.ToString()),
                    // Add any additional claims as needed
                };

                // Create the credentials used to sign the token
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                // Create the token
                var token = new JwtSecurityToken(
                    issuer: "your_issuer",
                    audience: "your_audience",
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(30), // Set the expiration time
                    signingCredentials: creds
                );

                // Serialize the token to a string
                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
                return Json(new { success = true, token = tokenString });
                //return RedirectToAction("Index", "Customer");
            }
            else
            {
                return Json(new { success = false, token = "" });
            }
        }


        [Authorize]

        public IActionResult Logout()
        {

            HttpContext.SignOutAsync("MyCookie");
            return RedirectToAction("Index", "Home");
        }

        public IActionResult ForgotPassword()
        {
            return View();
        }
        [HttpPost, AllowAnonymous]
        public async Task<IActionResult> ForgotPassword(ResetPass resetPass)
        {
            if (string.IsNullOrWhiteSpace(resetPass.Email))
            {
                ViewData["ErrorMessage"] = "Email is required!";
                return View(resetPass);

            }
            var user = _context.PotentialCustomers.FirstOrDefault(u => u.Email == resetPass.Email);

            if (user != null)
            {
                var resetToken = RandomCode.GenerateRandomCode(6);
                user.ResetPasswordcode = resetToken;
                await _context.SaveChangesAsync();

                // Send reset link  email
                var resetLink = Url.Action("ResetPass", "Accounts", new { }, Request.Scheme);
                var emailSubject = "Password Reset Request";
                var emailBody = $"Hi {user.FullName}, <br/> You recently requested to reset your password for your account. This is your request code: <b>{resetToken}</b> Please click on the following link to reset your password: <a href='{HtmlEncoder.Default.Encode(resetLink)}'>Reset Password</a>";

                await _sendEmail.SendEmailAsync(user.Email, emailSubject, emailBody);

                ViewData["Sucsess"] = "Reset password code has been sent to your email , Check your email now.";
                return View(resetPass);
            }
            else
            {
                ViewData["ErrorMessage"] = "Email not found!";
                return View(resetPass);
            }

        }


        public IActionResult ResetPass()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> ResetPass(ResetPasswordVm obj)
        {
            if (string.IsNullOrWhiteSpace(obj.ConfirmCode) || string.IsNullOrWhiteSpace(obj.ConfirmPassword) || string.IsNullOrWhiteSpace(obj.NewPassword))
            {
                ViewData["ErrorMessage"] = "Please enter your Confirm code and New password!";
                return View(obj);

            }
            if (obj.NewPassword != obj.ConfirmPassword)
            {
                ViewData["ErrorMessage"] = "Your new password or confirm password are wrong, try again!";
                return View(obj);
            }
            else
            {
                var user = _context.PotentialCustomers.FirstOrDefault(s => s.Email == obj.Email);
                if (user != null)
                {
                    if (obj.ConfirmCode != user.ResetPasswordcode)
                    {
                        ViewData["ErrorMessage"] = " Confirm code is wrong,try again!";
                        return View(obj);
                    }
                    else
                    {
                        user.Password = Common.MaHoaMD5.EncryptPassword(obj.NewPassword);
                        user.ResetPasswordcode = null;
                        await _context.SaveChangesAsync();
                        ViewData["Sucsess"] = " Your password is changed,return to the login!";
                        return View(obj);
                    }

                }
                else
                {
                    ViewData["ErrorMessage"] = "Email not found!";
                    return View(obj);
                }

            }

        }
        [HttpPost("account/changepass")]
        public async Task<IActionResult> ChangePassword(string passwordold, string passwordnew)
        {
            var token = Request.Headers["Authorization"].ToString();
            token = token.Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token);
            var tokenS = jsonToken as JwtSecurityToken;
            var customerIDstr = tokenS.Claims.First(claim => claim.Type == "Id").Value;
            var customerId = Int32.Parse(customerIDstr);
            if (customerId != null && passwordnew != null && passwordold != null)
            {
                try
                {
                    //var customer =  _customerRepository.GetByIdAsync(customerId);
                    PotentialCustomer customer = await _customerRepository.FirstOrDefaultAsync(p => p.PotentialCustomerID == customerId);
                    string password_old = string.IsNullOrEmpty(customer.Password) ? "" : Common.MaHoaMD5.EncryptPassword(passwordold);
                    string password_new = string.IsNullOrEmpty(customer.Password) ? "" : Common.MaHoaMD5.EncryptPassword(passwordnew);
                    if (customer.Password != password_old)
                    {
                        return Json(3);
                    }
                    if (customer.Password == password_new)
                    {
                        return Json(2);
                    }
                    customer.Password = password_new;
                    await _customerRepository.UpdateAsync(customer);
                    return Json(1);
                }
                catch
                {
                    return Json(0);
                }
            }
            return Json(0);
        }

        [HttpPost("account/changeinfo")]
        public async Task<IActionResult> ChageInfo(string fullname, string phone, DateTime birthday)
        {
            var token = Request.Headers["Authorization"].ToString();
            token = token.Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token);
            var tokenS = jsonToken as JwtSecurityToken;
            var customerIDstr = tokenS.Claims.First(claim => claim.Type == "Id").Value;
            var customerId = Int32.Parse(customerIDstr);
            if (customerId != null && fullname != null && phone != null && birthday != null)
            {
                try
                {
                    PotentialCustomer customer = await _customerRepository.FirstOrDefaultAsync(p => p.PotentialCustomerID == customerId);
                    customer.FullName = fullname;
                    customer.Phone = phone;
                    customer.Birthday = birthday;
                    await _customerRepository.UpdateAsync(customer);
                    await _context.SaveChangesAsync();
                    return Json(1);

                }
                catch
                {

                    return Json(0);
                }
            }
            return Json(0);

        }
    }
}
