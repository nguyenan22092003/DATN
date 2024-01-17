using BeautyPoly.Data.Models.DTO;
using BeautyPoly.Data.Repositories;
using BeautyPoly.Data.ViewModels;
using BeautyPoly.Helper;
using BeautyPoly.Models;
using Microsoft.AspNetCore.Mvc;

namespace BeautyPoly.View.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class PostController : Controller
    {
        PostRepo postRepo;

        public PostController(PostRepo postRepo)
        {
            this.postRepo = postRepo;
        }
        [Route("admin/post")]
        public IActionResult Index()
        {
            if (HttpContext.Session.GetInt32("AccountID") == null)
                return RedirectToRoute("Login");
            return View();
        }
        [HttpGet("admin/post/getall")]
        public IActionResult GetAll(string filter)
        {
            List<PostViewModel> list = postRepo.GetAllPost(filter);
            return Json(list);
        }
        [HttpPost("admin/post/create-update")]
        public async Task<IActionResult> CreateOrUpdate([FromBody] PostDTO postDTO)
        {
            var check = await postRepo.FirstOrDefaultAsync(p => p.PostsID == postDTO.post.PostsID);
            var checkExists = await postRepo.FirstOrDefaultAsync(p => p.PostsCode.ToUpper().Trim() == postDTO.post.PostsCode.ToUpper().Trim());
            if (checkExists != null && checkExists.PostsCode.ToUpper().Trim() != check.PostsCode.ToUpper().Trim())
            {
                return Json("Mã Post đã tồn tại! Vui lòng nhập lại.", new System.Text.Json.JsonSerializerOptions());
            }
            if (string.IsNullOrEmpty(postDTO.post.Title))
            {
                return Json("Vui lòng nhập tiêu đề Post", new System.Text.Json.JsonSerializerOptions());
            }
            if (string.IsNullOrEmpty(postDTO.post.Contents))
            {
                return Json("Vui lòng nhập nội dung Post", new System.Text.Json.JsonSerializerOptions());
            }
            if (string.IsNullOrEmpty(postDTO.post.ShortContents))
            {
                return Json("Vui lòng nhập nội dung tóm tắt Post", new System.Text.Json.JsonSerializerOptions());
            }
            if (string.IsNullOrEmpty(postDTO.post.Author))
            {
                return Json("Vui lòng nhập tác giả Post", new System.Text.Json.JsonSerializerOptions());
            }
            if (!string.IsNullOrEmpty(postDTO.post.Img))
            {
                string fileName = postDTO.post.PostsCode + ".png";
                Utilities.ConvertAndSaveImage(postDTO.post.Img, fileName);
            }
            if (check != null)
            {
                check.PostsID = postDTO.post.PostsID;
                check.PostsCode = postDTO.post.PostsCode;
                check.Title = postDTO.post.Title;
                check.Contents = postDTO.post.Contents;
                if (!string.IsNullOrEmpty(postDTO.post.Img)) check.Img = postDTO.post.Img;
                check.IsPublished = postDTO.post.IsPublished;
                check.Tags = postDTO.post.Tags;
                check.ShortContents = postDTO.post.ShortContents;
                check.Author = postDTO.post.Author;
                check.Alias = postDTO.post.Alias;
                check.IsHot = postDTO.post.IsHot;
                check.IsNewFeed = postDTO.post.IsNewFeed;
                check.Status = postDTO.post.Status;
                check.IsDelete = postDTO.post.IsDelete;
                check.PostsID = postDTO.post.PostsID;
                await postRepo.UpdateAsync(check);
            }
            else
            {
                Posts post = new Posts();
                post.PostsID = postDTO.post.PostsID;
                post.PostsCode = postDTO.post.PostsCode;
                post.Title = postDTO.post.Title;
                post.Contents = postDTO.post.Contents;
                post.Img = postDTO.post.Img;
                post.IsPublished = postDTO.post.IsPublished;
                post.Tags = postDTO.post.Tags;
                post.ShortContents = postDTO.post.ShortContents;
                post.CreateDate = postDTO.post.CreateDate;
                post.Author = postDTO.post.Author;
                post.Alias = postDTO.post.Alias;
                post.IsHot = postDTO.post.IsHot;
                post.IsNewFeed = postDTO.post.IsNewFeed;
                post.Status = postDTO.post.Status;
                post.IsDelete = postDTO.post.IsDelete;
                post.PostsID = postDTO.post.PostsID;
                post.CreateDate = DateTime.Now;
                await postRepo.InsertAsync(post);
            }
            return Json(1);
        }
        [HttpDelete("admin/post/delete")]
        public async Task<IActionResult> Delete([FromBody] int postID)
        {
            await postRepo.DeleteAsync(await postRepo.GetByIdAsync(postID));
            return Json(1);
        }
    }
}
