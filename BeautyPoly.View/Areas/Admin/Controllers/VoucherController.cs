using BeautyPoly.Data.Models.DTO;
using BeautyPoly.Data.Repositories;
using BeautyPoly.Models;
using Microsoft.AspNetCore.Mvc;

namespace BeautyPoly.View.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class VoucherController : Controller
    {
        VoucherRepo voucherRepo;

        public VoucherController(VoucherRepo voucherRepo)
        {
            this.voucherRepo = voucherRepo;
        }
        [Route("admin/voucher")]
        public IActionResult Index()
        {
            if (HttpContext.Session.GetInt32("AccountID") == null)
                return RedirectToRoute("Login");
            return View();
        }
        [HttpGet("admin/voucher/getall")]
        public IActionResult GetAll(string filter)
        {
            List<Vouchers> list = voucherRepo.GetAllVoucher(filter);
            return Json(list);
        }
        [HttpPost("admin/voucher/create-update")]
        public async Task<IActionResult> CreateOrUpdate([FromBody] VoucherDTO voucherDTO)
        {
            var checkExists = await voucherRepo.FirstOrDefaultAsync(p => p.VoucherCode.ToUpper().Trim() == voucherDTO.Vouchers.VoucherCode.ToUpper().Trim() && p.VoucherID != voucherDTO.Vouchers.VoucherID);
            if (checkExists != null)
            {
                return Json("Mã Voucher đã tồn tại! Vui lòng nhập lại.", new System.Text.Json.JsonSerializerOptions());
            }
            if (voucherDTO.Vouchers.VoucherName == null || voucherDTO.Vouchers.VoucherName == "")
            {
                return Json("Vui lòng nhập tên chương trình Voucher", new System.Text.Json.JsonSerializerOptions());
            }
            if (voucherDTO.Vouchers.VoucherCode == null || voucherDTO.Vouchers.VoucherCode == "")
            {
                return Json("Vui lòng nhập mã Voucher", new System.Text.Json.JsonSerializerOptions());
            }
            if (voucherDTO.Vouchers.Quantity <= 0 || voucherDTO.Vouchers.Quantity.ToString().Length > 10)
            {
                return Json("Vui lòng nhập lại số lượng Voucher", new System.Text.Json.JsonSerializerOptions());
            }
            if (voucherDTO.Vouchers.StartDate == null)
            {
                return Json("Vui lòng nhập ngày áp dụng Voucher", new System.Text.Json.JsonSerializerOptions());
            }
            if (voucherDTO.Vouchers.EndDate == null)
            {
                return Json("Vui lòng nhập ngày kết thúc Voucher", new System.Text.Json.JsonSerializerOptions());
            }
            if (voucherDTO.Vouchers.VoucherType == 0)
            {
                if (voucherDTO.Vouchers.DiscountValue <= 0 || voucherDTO.Vouchers.DiscountValue > 100)
                {
                    return Json("Vui lòng nhập lại giá trị giảm", new System.Text.Json.JsonSerializerOptions());
                }
            }
            if (voucherDTO.Vouchers.VoucherType == 1)
            {
                if (voucherDTO.Vouchers.DiscountValue <= 0 || voucherDTO.Vouchers.DiscountValue.ToString().Length > 10)
                {
                    return Json("Vui lòng nhập lại giá trị giảm", new System.Text.Json.JsonSerializerOptions());
                }
            }
            Vouchers voucher = new Vouchers();
            voucher.VoucherCode = voucherDTO.Vouchers.VoucherCode;
            voucher.Quantity = voucherDTO.Vouchers.Quantity;
            voucher.VoucherName = voucherDTO.Vouchers.VoucherName;
            voucher.StartDate = voucherDTO.Vouchers.StartDate;
            voucher.EndDate = voucherDTO.Vouchers.EndDate;
            voucher.DiscountValue = voucherDTO.Vouchers.DiscountValue;
            voucher.VoucherType = voucherDTO.Vouchers.VoucherType;
            voucher.MinValue = voucherDTO.Vouchers.MinValue;
            voucher.MaxValue = voucherDTO.Vouchers.MaxValue;
            voucher.Description = voucherDTO.Vouchers.Description;
            if (voucherDTO.Vouchers.VoucherID > 0)
            {
                voucher.VoucherID = voucherDTO.Vouchers.VoucherID;
                await voucherRepo.UpdateAsync(voucher);
            }
            else
            {
                voucher.CreateDate = DateTime.Now;
                await voucherRepo.InsertAsync(voucher);
            }
            return Json(1);
        }
        [HttpPost("admin/voucher/delete")]
        public async Task<IActionResult> Delete([FromBody] int voucherID)
        {
            var obj = await voucherRepo.GetByIdAsync(voucherID);
            obj.IsDelete = true;
            await voucherRepo.UpdateAsync(obj);
            return Json(1);
        }
    }
}
