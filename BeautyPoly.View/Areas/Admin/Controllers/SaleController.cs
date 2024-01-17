using BeautyPoly.Common;
using BeautyPoly.Data.Models;
using BeautyPoly.Data.Models.DTO;
using BeautyPoly.Data.Repositories;
using BeautyPoly.Data.ViewModels;
using BeautyPoly.Models;
using Microsoft.AspNetCore.Mvc;

namespace BeautyPoly.View.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class SaleController : Controller
    {
        SaleRepo saleRepo;
        SaleItemsRepo saleItemsRepo;
        ProductSkuRepo productSkusRepo;

        public SaleController(SaleRepo saleRepo, SaleItemsRepo saleItemsRepo, ProductSkuRepo productSkusRepo)
        {
            this.saleRepo = saleRepo;
            this.saleItemsRepo = saleItemsRepo;
            this.productSkusRepo = productSkusRepo;
        }

        [Route("admin/sale")]
        public IActionResult Index()
        {
            //if (HttpContext.Session.GetInt32("AccountID") == null)
            //    return RedirectToRoute("Login");
            return View();
        }

        [HttpGet("admin/sale/getall")]
        public IActionResult GetAll(string filter)
        {
            List<Sale> list = saleRepo.GetAllSale(filter);
            return Json(list);
        }
        [HttpGet("admin/productskus/getall")]
        public IActionResult GetAllProductSkus(string filter, int optionID, int optionValueID)
        {
            var list = SQLHelper<ProductSkus>.ProcedureToList("spGetProductSkusByFilter", new string[] { "@Keyword", "@OptionID", "@OptionValueID" }, new object[] { filter, optionID, optionValueID });
            return Json(list);
        }
        [HttpGet("admin/saleitems/get-by-sale-id")]
        public IActionResult GetAllSaleItemsBySaleID(int saleID)
        {
            var list = saleItemsRepo.GetAllAsync().Result.Where(p => p.SaleID == saleID);
            return Json(list);
        }
        [HttpGet("admin/saleproductsku/getall")]
        public IActionResult GetAllSaleProductSku(int productSkuID)
        {
            var list = SQLHelper<SaleProductSkuViewModel>.ProcedureToList("spGetSaleProductSku", new string[] { "@ID" }, new object[] { productSkuID });
            return Json(list);
        }
        [HttpPost("admin/saleitems/update")]
        public async Task<IActionResult> UpdateSaleItems(int productSkuID, int saleIDSelect)
        {
            var saleItems = saleItemsRepo.GetAllAsync().Result.Where(p => p.ProductSkusID == productSkuID);
            foreach (var item in saleItems)
            {
                item.IsSelect = false;
                await saleItemsRepo.UpdateAsync(item);
            }
            var saleItem = await saleItemsRepo.FirstOrDefaultAsync(p => p.ProductSkusID == productSkuID && p.SaleID == saleIDSelect);
            if (saleItem != null)
            {
                saleItem.IsSelect = true;
                await saleItemsRepo.UpdateAsync(saleItem);
            }                   
            return Json(1);
        }
        [HttpPost("admin/saleitems/timelive")]
        public async Task<IActionResult> UpLoadTimeLive()
        {            
            var sales = await saleRepo.GetAllAsync();
            foreach (var item1 in sales)
            {
                var saleItems = saleItemsRepo.GetAllAsync().Result.Where(p => p.SaleID == item1.SaleID);
                if (item1.EndDate <= DateTime.Now)
                {
                    foreach (var item2 in saleItems)
                    {
                        item2.IsSelect = false;
                        await saleItemsRepo.UpdateAsync(item2);
                    }
                }
                if (item1.StartDate >= DateTime.Now)
                {
                    foreach (var item2 in saleItems)
                    {
                        item2.IsSelect = true;
                        var productSku = await productSkusRepo.GetByIdAsync((int)item2.ProductSkusID);
                        var sale = await saleRepo.GetByIdAsync((int)item2.SaleID);
                        if (sale.SaleType == 1)
                        {
                            if((Convert.ToInt32(productSku.Price) - sale.DiscountValue) <= 0)
                            {
                                item2.IsSelect = false;
                            }
                        }
                        await saleItemsRepo.UpdateAsync(item2);
                    }
                }
            }
            
            return Json(1);
        }
        [HttpDelete("admin/saleitems/delete")]
        public async Task<IActionResult> DeleteSaleItems(int productSkuID, int saleID)
        {
            var saleItem = await saleItemsRepo.FirstOrDefaultAsync(p => p.ProductSkusID == productSkuID && p.SaleID == saleID);
            await saleItemsRepo.DeleteAsync(saleItem);
            return Json(1);
        }
        [HttpPost("admin/sale/create-update")]
        public async Task<IActionResult> CreateOrUpdate([FromBody] SaleDTO saleDTO)
        {
            var checkExists = await saleRepo.FirstOrDefaultAsync(p => p.SaleCode.ToUpper().Trim() == saleDTO.Sale.SaleCode.ToUpper().Trim() && p.SaleID != saleDTO.Sale.SaleID && p.IsDelete == false);
            if (checkExists != null)
            {
                return Json("Mã Sale đã tồn tại! Vui lòng nhập lại.", new System.Text.Json.JsonSerializerOptions());
            }
            if (saleDTO.Sale.SaleName == null || saleDTO.Sale.SaleName == "")
            {
                return Json("Vui lòng nhập tên chương trình Sale", new System.Text.Json.JsonSerializerOptions());
            }
            if (saleDTO.Sale.SaleCode == null || saleDTO.Sale.SaleCode == "")
            {
                return Json("Vui lòng nhập mã Sale", new System.Text.Json.JsonSerializerOptions());
            }
            if (saleDTO.Sale.Quantity <= 0 || saleDTO.Sale.Quantity.ToString().Length > 10)
            {
                return Json("Vui lòng nhập lại số lượng Sale", new System.Text.Json.JsonSerializerOptions());
            }
            if (saleDTO.Sale.StartDate == null)
            {
                return Json("Vui lòng nhập ngày áp dụng Sale", new System.Text.Json.JsonSerializerOptions());
            }
            if (saleDTO.Sale.EndDate == null)
            {
                return Json("Vui lòng nhập ngày kết thúc Sale", new System.Text.Json.JsonSerializerOptions());
            }
            if (saleDTO.Sale.SaleType == 0)
            {
                if (saleDTO.Sale.DiscountValue <= 0 || saleDTO.Sale.DiscountValue > 100)
                {
                    return Json("Vui lòng nhập lại giá trị giảm", new System.Text.Json.JsonSerializerOptions());
                }
            }
            if (saleDTO.Sale.SaleType == 1)
            {
                if (saleDTO.Sale.DiscountValue <= 0 || saleDTO.Sale.DiscountValue.ToString().Length > 10)
                {
                    return Json("Vui lòng nhập lại giá trị giảm", new System.Text.Json.JsonSerializerOptions());
                }
            }
            Sale sale = new Sale();
            sale.SaleCode = saleDTO.Sale.SaleCode;
            sale.Quantity = saleDTO.Sale.Quantity;
            sale.SaleName = saleDTO.Sale.SaleName;
            sale.StartDate = saleDTO.Sale.StartDate;
            sale.EndDate = saleDTO.Sale.EndDate;
            sale.DiscountValue = saleDTO.Sale.DiscountValue;
            sale.SaleType = saleDTO.Sale.SaleType;
            sale.Description = saleDTO.Sale.Description;
            sale.IsDelete = false;
            if (saleDTO.Sale.SaleID > 0)
            {
                sale.SaleID = saleDTO.Sale.SaleID;
                await saleRepo.UpdateAsync(sale);
                var saleItems = saleItemsRepo.GetAllAsync().Result.Where(p => p.SaleID == saleDTO.Sale.SaleID);
                await saleItemsRepo.DeleteRangeAsync(saleItems);
            }
            else
            {
                sale.CreateDate = DateTime.Now;
                await saleRepo.InsertAsync(sale);
                saleDTO.Sale.SaleID = sale.SaleID;
            }
            foreach (var item in saleDTO.arrSaleItems)
            {
                var saleItems = new SaleItems()
                {
                    SaleID = sale.SaleID,
                    ProductSkusID = item.ProductSkusID,
                    IsSelect = true,
                };
                var check = saleItemsRepo.GetAllAsync().Result.Where(p=>p.ProductSkusID == item.ProductSkusID && p.SaleID != sale.SaleID);
                foreach (var item2 in check)
                {
                    item2.IsSelect = false;
                    await saleItemsRepo.UpdateAsync(item2);
                }
                await saleItemsRepo.InsertAsync(saleItems);
            }
            return Json(1);
        }
        [HttpPost("admin/sale/delete")]
        public async Task<IActionResult> Delete([FromBody] int saleID)
        {
            var obj = await saleRepo.GetByIdAsync(saleID);
            obj.IsDelete = true;
            await saleRepo.UpdateAsync(obj);
            return Json(1);
        }
    }
}
