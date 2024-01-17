using BeautyPoly.Data.Repositories;
using BeautyPoly.Data.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace BeautyPoly.View.Controllers
{
    public class PostController : Controller
    {
        PostRepo postRepo;

        public PostController(PostRepo postRepo)
        {
            this.postRepo = postRepo;
        }
        [Route("blog-details")]
        public IActionResult Index()
        {
            return View();
        }
        [HttpGet("post/getall")]
        public async Task<IActionResult> GetAllPost(string? filter)
        {
            List<PostViewModel> list = postRepo.GetAllPost(filter);
            return Json(list);
        }
        [HttpGet("post/detail-post")]
        public async Task<IActionResult> DetailPost(int postId)
        {
            var post = postRepo.GetDetailPost(postId);
            return Json(post);
        }

    }
}
