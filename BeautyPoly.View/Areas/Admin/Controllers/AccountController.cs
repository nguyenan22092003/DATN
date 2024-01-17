using BeautyPoly.Data.Repositories;
using BeautyPoly.Models;
using BeautyPoly.View.Areas.Admin.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace BeautyPoly.View.Areas.Admin.Controllers
{
    [Area("Admin")]

    public class AccountController : Controller
    {
        AccountRepo accountRepo;
        RoleRepo roleRepo;

        public AccountController(AccountRepo accountRepo, RoleRepo roleRepo)
        {
            this.accountRepo = accountRepo;
            this.roleRepo = roleRepo;
        }

        [Route("admin/account")]
        public IActionResult Index()
        {
            if (HttpContext.Session.GetInt32("AccountID") == null)
                return RedirectToRoute("Login");
            return View();
        }

        [HttpGet("admin/account/getall")]

        public IActionResult GetAll(string filter)
        {
            List<AccountViewModel> list = accountRepo.GetAllAccounts(filter);
            return Json(list);
        }

        [HttpPost("admin/account/create")]
        public async Task<IActionResult> CreateOrUpdate([FromBody] Accounts accounts)
        {

            var checkExists = await accountRepo.FirstOrDefaultAsync(p => p.AccountCode.Trim() == accounts.AccountCode.Trim() && p.AccountID != accounts.AccountID);
            Accounts obj = new Accounts();
            if (checkExists != null)
            {
                return Json("Mã tài khoản đã tồn tại! Vui lòng nhập lại.", new System.Text.Json.JsonSerializerOptions());
            }
            if (accounts.AccountID > 0)
            {
                await accountRepo.UpdateAsync(accounts);
            }
            else
            {
                obj.AccountCode = accounts.AccountCode;
                obj.FullName = accounts.FullName;
                obj.Email = accounts.Email;
                obj.Phone = accounts.Phone;
                obj.Password = accounts.Password;
                obj.RoleID = accounts.RoleID;
                obj.CreateDate = DateTime.Now;
                obj.Status = accounts.Status;
                obj.IsActive = accounts.IsActive;
                obj.Password = "1";
                await accountRepo.InsertAsync(obj);
            }
            return Json(1);
        }

        [HttpDelete("admin/account/delete")]
        public async Task<IActionResult> Delete([FromBody] int accountID)
        {
            await accountRepo.DeleteAsync(await accountRepo.GetByIdAsync(accountID));
            return Json(1);
        }

        [HttpPut("admin/account/updateStatus")]
        public async Task<IActionResult> ChangeStatus([FromBody] int accountID)
        {
            try
            {
                var account = await accountRepo.GetByIdAsync(accountID);
                account.IsActive = !account.IsActive;
                await accountRepo.UpdateAsync(account);
                // Trả về kết quả thành công cho client
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Có lỗi xảy ra: " + ex.Message);
            }
        }

    }
}
