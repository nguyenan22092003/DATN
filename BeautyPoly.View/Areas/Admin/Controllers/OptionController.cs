using BeautyPoly.Data.Models.DTO;
using BeautyPoly.Data.Repositories;
using BeautyPoly.Models;
using Microsoft.AspNetCore.Mvc;

namespace BeautyPoly.View.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class OptionController : Controller
    {
        OptionRepo optionRepo;
        OptionValueRepo optionValueRepo;
        public OptionController(OptionRepo optionRepo, OptionValueRepo optionValueRepo)
        {
            this.optionRepo = optionRepo;
            this.optionValueRepo = optionValueRepo;
        }

        [Route("admin/option")]
        public IActionResult Index()
        {
            if (HttpContext.Session.GetInt32("AccountID") == null)
                return RedirectToRoute("Login");
            return View();
        }
        [HttpGet("admin/option/getall")]
        public IActionResult GetAll(string filter)
        {
            List<Option> list = optionRepo.GetAllOption(filter);
            return Json(list, new System.Text.Json.JsonSerializerOptions());
        }
        [HttpGet("admin/option/getallvalue")]
        public IActionResult GetAllValue(int optionID)
        {
            List<OptionValue> optionValues = optionValueRepo.GetAllAsync().Result.ToList();
            optionValues = optionValues.Where(p => p.OptionID == optionID).ToList();
            return Json(optionValues, new System.Text.Json.JsonSerializerOptions());
        }
        [HttpPost("admin/option/create")]
        public async Task<IActionResult> CreateOrUpdate([FromBody] OptionDTO optionDTO)
        {
            var checkExists = await optionRepo.FirstOrDefaultAsync(p => p.OptionName.ToUpper().Trim() == optionDTO.Option.OptionName.ToUpper().Trim() && p.OptionID != optionDTO.Option.OptionID);
            if (checkExists != null)
            {
                return Json("Thuộc tính đã tồn tại! Vui lòng nhập lại.", new System.Text.Json.JsonSerializerOptions());
            }
            Option option = new Option();
            if (optionDTO.Option.OptionID > 0)
            {
                option = optionDTO.Option;
                await optionRepo.UpdateAsync(option);
                foreach (var item in optionDTO.OptionValues)
                {
                    OptionValue optionValue = new OptionValue();
                    if (item.OptionValueID > 0)
                    {
                        optionValue = item;
                        optionValue.OptionID = option.OptionID;
                        await optionValueRepo.UpdateAsync(optionValue);
                    }
                    else
                    {
                        optionValue.OptionValueName = item.OptionValueName;
                        optionValue.IsPublish = item.IsPublish;
                        optionValue.IsDelete = item.IsDelete;
                        optionValue.OptionID = option.OptionID;
                        await optionValueRepo.InsertAsync(optionValue);
                    }
                }
                foreach (var id in optionDTO.ListDeleteValues)
                {
                    await optionValueRepo.DeleteAsync(await optionValueRepo.GetByIdAsync(id));
                }
            }
            else
            {
                option.OptionName = optionDTO.Option.OptionName;
                option.IsPublish = optionDTO.Option.IsPublish;
                await optionRepo.InsertAsync(option);
                foreach (var item in optionDTO.OptionValues)
                {
                    OptionValue optionValue = new OptionValue();
                    if (item.OptionValueID > 0)
                    {
                        optionValue = item;
                        optionValue.OptionID = option.OptionID;
                        await optionValueRepo.UpdateAsync(optionValue);
                    }
                    else
                    {
                        optionValue.OptionValueName = item.OptionValueName;
                        optionValue.IsPublish = item.IsPublish;
                        optionValue.IsDelete = item.IsDelete;
                        optionValue.OptionID = option.OptionID;
                        await optionValueRepo.InsertAsync(optionValue);
                    }
                }
            }
            return Json(1);
        }
        [HttpPost("admin/option/updateisdelete")]
        public async Task<IActionResult> UpdateIsDelete(int optionID)
        {

            var option = await optionRepo.GetByIdAsync(optionID);
            option.IsDelete = !option.IsDelete;
            await optionRepo.UpdateAsync(option);
            return Json(1);

        }
        [HttpDelete("admin/option/delete")]
        public async Task<IActionResult> Delete([FromBody] int optionID)
        {
            var listValue = await optionValueRepo.GetAllAsync();
            await optionValueRepo.DeleteRangeAsync(listValue.Where(p => p.OptionID == optionID));
            var option = await optionRepo.GetByIdAsync(optionID);
            await optionRepo.DeleteAsync(option);

            return Json(1);
        }
    }
}
