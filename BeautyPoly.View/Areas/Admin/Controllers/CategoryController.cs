using BeautyPoly.Data.Repositories;
using BeautyPoly.Models;
using Microsoft.AspNetCore.Mvc;

namespace BeautyPoly.View.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class CategoryController : Controller
    {
        CategoryRepo categoryRepo;

        public CategoryController(CategoryRepo categoryRepo)
        {
            this.categoryRepo = categoryRepo;
        }
        [Route("admin/category")]
        public IActionResult Index()
        {
            if (HttpContext.Session.GetInt32("AccountID") == null)
                return RedirectToRoute("Login");
            return View();
        }
        //[HttpGet("admin/category/getall")]
        //public IActionResult GetAllCate(string filter)
        //{
        //    List<Category> list = categoryRepo.GetAllCate(filter);
        //    return Json(list);
        //}
        //[HttpGet("admin/category-to-tree/getall")]
        //public IActionResult GetAllCateToTree(string filter)
        //{
        //    List<Category> list = categoryRepo.GetAllCate(filter);
        //    List<TreeNode> treeNodes = ConvertToTreeNodes(list, null);
        //    return Json(treeNodes);
        //}
        //private List<TreeNode> ConvertToTreeNodes(List<Category> categories, int? parentId)
        //{
        //    var nodes = new List<TreeNode>();

        //    foreach (var category in categories.Where(c => c.ParentID == parentId))
        //    {
        //        var node = new TreeNode
        //        {
        //            id = category.CateId,
        //            text = $"{category.CateCode} - {category.CateName}",
        //            children = ConvertToTreeNodes(categories, category.CateId)
        //        };
        //        nodes.Add(node);
        //    }

        //    return nodes;
        //}
        //[HttpPost("admin/cate/create-update")]
        //public async Task<IActionResult> CreateOrUpdate([FromBody] Category category)
        //{
        //    var checkExists = await categoryRepo.FirstOrDefaultAsync(p => p.CateCode.ToUpper().Trim() == category.CateCode.ToUpper().Trim() && p.CateId != category.CateId);
        //    if (checkExists != null)
        //    {
        //        return Json("Danh mục sản phẩm đã tồn tại! Vui lòng nhập lại.", new System.Text.Json.JsonSerializerOptions());
        //    }
        //    Category cate = new Category();
        //    cate.ParentID = category.ParentID;
        //    cate.CateCode = category.CateCode;
        //    cate.CateName = category.CateName;
        //    cate.IsDelete = false;
        //    if (category.CateId > 0)
        //    {
        //        cate.CateId = category.CateId;
        //        await categoryRepo.UpdateAsync(cate);
        //    }
        //    else
        //    {
        //        await categoryRepo.InsertAsync(cate);
        //    }
        //    return Json(1);
        //}
        [HttpPost("admin/cate/delete")]
        public async Task<IActionResult> Delete([FromBody] List<int> listCateID)
        {
            foreach (int cateID in listCateID)
            {
                var obj = await categoryRepo.GetByIdAsync(cateID);
                obj.IsDelete = true;
                await categoryRepo.UpdateAsync(obj);
            }
            return Json(1);
        }
    }
}
