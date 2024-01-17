using BeautyPoly.Data.Models.DTO;
using BeautyPoly.Data.Repositories;
using BeautyPoly.Models;
using Microsoft.AspNetCore.Mvc;

namespace BeautyPoly.View.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class CouponController : Controller
    {
        CouponRepo couponRepo;

        public CouponController(CouponRepo couponRepo)
        {
            this.couponRepo = couponRepo;
        }
        [Route("admin/coupon")]
        public IActionResult Index()
        {
            if (HttpContext.Session.GetInt32("AccountID") == null)
                return RedirectToRoute("Login");
            return View();
        }
        [HttpGet("admin/coupon/getall")]
        public IActionResult GetAll(string filter)
        {
            List<Coupon> list = couponRepo.GetAllCoupon(filter);
            return Json(list);
        }
        [HttpPost("admin/coupon/create-update")]
        public async Task<IActionResult> CreateOrUpdate([FromBody] CouponDTO couponDTO)
        {
            var checkExists = await couponRepo.FirstOrDefaultAsync(p => p.CouponCode.ToUpper().Trim() == couponDTO.Coupon.CouponCode.ToUpper().Trim() && p.CouponID != couponDTO.Coupon.CouponID);
            if (checkExists != null)
            {
                return Json("Mã Coupon đã tồn tại! Vui lòng nhập lại.", new System.Text.Json.JsonSerializerOptions());
            }
            if (couponDTO.Coupon.CouponName == null || couponDTO.Coupon.CouponName == "")
            {
                return Json("Vui lòng nhập tên chương trình Coupon", new System.Text.Json.JsonSerializerOptions());
            }
            if (couponDTO.Coupon.CouponCode == null || couponDTO.Coupon.CouponCode == "")
            {
                return Json("Vui lòng nhập mã Coupon", new System.Text.Json.JsonSerializerOptions());
            }
            if (couponDTO.Coupon.Quantity <= 0 || couponDTO.Coupon.Quantity.ToString().Length > 10)
            {
                return Json("Vui lòng nhập lại số lượng Coupon", new System.Text.Json.JsonSerializerOptions());
            }
            if (couponDTO.Coupon.StartDate == null)
            {
                return Json("Vui lòng nhập ngày áp dụng Coupon", new System.Text.Json.JsonSerializerOptions());
            }
            if (couponDTO.Coupon.EndDate == null)
            {
                return Json("Vui lòng nhập ngày kết thúc Coupon", new System.Text.Json.JsonSerializerOptions());
            }
            if (couponDTO.Coupon.CouponType == 0)
            {
                if (couponDTO.Coupon.DiscountValue <= 0 || couponDTO.Coupon.DiscountValue > 100)
                {
                    return Json("Vui lòng nhập lại giá trị giảm", new System.Text.Json.JsonSerializerOptions());
                }
            }
            if (couponDTO.Coupon.CouponType == 1)
            {
                if (couponDTO.Coupon.DiscountValue <= 0 || couponDTO.Coupon.DiscountValue.ToString().Length > 10)
                {
                    return Json("Vui lòng nhập lại giá trị giảm", new System.Text.Json.JsonSerializerOptions());
                }
            }
            Coupon coupon = new Coupon();
            coupon.CouponCode = couponDTO.Coupon.CouponCode;
            coupon.Quantity = couponDTO.Coupon.Quantity;
            coupon.CouponName = couponDTO.Coupon.CouponName;
            coupon.StartDate = couponDTO.Coupon.StartDate;
            coupon.EndDate = couponDTO.Coupon.EndDate;
            coupon.DiscountValue = couponDTO.Coupon.DiscountValue;
            coupon.CouponType = couponDTO.Coupon.CouponType;
            coupon.Description = couponDTO.Coupon.Description;
            if (couponDTO.Coupon.CouponID > 0)
            {
                coupon.CouponID = couponDTO.Coupon.CouponID;
                await couponRepo.UpdateAsync(coupon);
            }
            else
            {
                coupon.CreateDate = DateTime.Now;
                await couponRepo.InsertAsync(coupon);
            }
            return Json(1);
        }
        [HttpPost("admin/coupon/delete")]
        public async Task<IActionResult> Delete([FromBody] int couponID)
        {
            var obj = await couponRepo.GetByIdAsync(couponID);
            obj.IsDelete = true;
            await couponRepo.UpdateAsync(obj);
            return Json(1);
        }
    }
}
