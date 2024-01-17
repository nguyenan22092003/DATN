using BeautyPoly.Common;
using BeautyPoly.Data.Repositories;
using BeautyPoly.Data.ViewModels;
using BeautyPoly.Models;
using Microsoft.AspNetCore.Mvc;

namespace BeautyPoly.View.Controllers
{
    public class ProductDetailsController : Controller
    {
        //ProductImagesRepo productsImageRepo;

        public ProductDetailsController()
        {
            
        }

        [Route("product-detail/{id}")]
        public IActionResult Index(int id)
        {
            var list = SQLHelper<ProductViewModel>.ProcedureToList("spGetProductToView", new string[] { }, new object[] { });
            var model = list.FirstOrDefault(p => p.ProductID == id);
            //var listImage = productsImageRepo.FindAsync(p => p.ProductID == id).Result.ToList();
            Tuple<ProductViewModel> tuple = new Tuple<ProductViewModel>(model);
            return View(tuple);
        }
    }
}
