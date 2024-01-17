using BeautyPoly.Common;
using BeautyPoly.Data.Repositories;
using BeautyPoly.Data.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace BeautyPoly.View.Controllers
{
    public class ShopController : Controller
    {
        ProductRepo productRepo;
        CategoryRepo categoryRepo;

        public ShopController(ProductRepo productRepo, CategoryRepo categoryRepo)
        {
            this.productRepo = productRepo;
            this.categoryRepo = categoryRepo;
        }

        [Route("shop")]
        public IActionResult Index()
        {
            return View();
        }
        [HttpGet("shop/get-cate")]
        public async Task<IActionResult> GetCate()
        {
            return Json(await categoryRepo.GetAllAsync());
        }
        [HttpGet("shop/get-product")]
        public IActionResult GetProduct(string keyword, int min, int max, int cateID, string listOptionValueID)
        {
            var list = SQLHelper<ProductViewModel>.ProcedureToList("spGetProductToView", new string[] { "@Keyword", "@MinPrice", "@MaxPrice", "@CateID", "@ListOptionValueID" }, new object[] { keyword, min, max, cateID, listOptionValueID });
            return Json(list, new System.Text.Json.JsonSerializerOptions());
        }
    }
}
