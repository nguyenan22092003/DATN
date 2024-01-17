using BeautyPoly.Data.Repositories;
using BeautyPoly.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace BeautyPoly.View.Areas.Admin.Controllers
{
    [Area("Admin")]

    public class RoleController : Controller
    {
        RoleRepo roleRepo;
        AccountRepo accountRepo;
        public RoleController(RoleRepo roleRepo, AccountRepo accountRepo)
        {
            this.roleRepo = roleRepo;
            this.accountRepo = accountRepo;
        }

        [Route("admin/role")]
        public IActionResult Index()
        {
            if (HttpContext.Session.GetInt32("AccountID") == null)
                return RedirectToRoute("Login");
            return View();
        }

        [HttpGet("admin/role/getall")]
        public IActionResult GetAll(string filter)
        {
            List<Roles> list = roleRepo.GetAllRole(filter);
            return Json(list);
        }

        [HttpPost("admin/role/create")]
        public async Task<IActionResult> CreateOrUpdate([FromBody] Roles roles)
        {

            var checkExists = await roleRepo.FirstOrDefaultAsync(p => p.RoleCode.Trim() == roles.RoleCode.Trim() && p.RoleID != roles.RoleID);
            Roles role = new Roles();
            if (checkExists != null)
            {
                return Json("Mã chức vụ đã tồn tại! Vui lòng nhập lại.", new System.Text.Json.JsonSerializerOptions());
            }
            if (roles.RoleID > 0)
            {
                await roleRepo.UpdateAsync(roles);
            }
            else
            {
                role.RoleCode = roles.RoleCode;
                role.RoleName = roles.RoleName;
                role.Description = roles.Description;
                role.IsDelete = roles.IsDelete;
                await roleRepo.InsertAsync(role);
            }
            return Json(1);
        }

        [HttpDelete("admin/role/delete")]
        public async Task<IActionResult> Delete([FromBody] int roleID)
        {

            await roleRepo.DeleteAsync(await roleRepo.GetByIdAsync(roleID));

            return Json(1);
        }

        [HttpPut("admin/role/disablerole")]
        public async Task<IActionResult> Disable([FromBody] int roleID)
        {

            var role = await roleRepo.GetByIdAsync(roleID);
            role.IsDelete = true;
            await roleRepo.UpdateAsync(role);
            return Json(1);
        }

        [HttpGet("admin/role/checkUsage")]
        public IActionResult CheckRoleUsage(int roleId)
        {
            try
            {
                // Kiểm tra xem vai trò có đang được sử dụng bởi ít nhất một tài khoản hay không
                bool isUsed = IsRoleUsed(roleId);

                // Trả về kết quả cho client
                return Json(isUsed);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Có lỗi xảy ra: " + ex.Message);
            }
        }

        public bool IsRoleUsed(int roleId)
        {
            var tk = accountRepo.GetAllAccounts("").ToList();

            bool isUsed = tk.Any(account => account.RoleID == roleId);

            return isUsed;
        }

        [HttpPut("admin/role/updateStatus")]
        public async Task<IActionResult> ChangeStatus([FromBody] int roleID)
        {
            try
            {



                var role = await roleRepo.GetByIdAsync(roleID);
                role.IsDelete = !role.IsDelete;
                await roleRepo.UpdateAsync(role);

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
