using BeautyPoly.Common;
using BeautyPoly.Data.Models.DTO;
using BeautyPoly.Data.Repositories;
using BeautyPoly.Data.ViewModels;
using BeautyPoly.Models;
using BeautyPoly.View.Helper;
using Microsoft.AspNetCore.Mvc;

namespace BeautyPoly.View.Controllers
{
    public class CartController : Controller
    {
        ProductSkuRepo productSkuRepo;

        CartDetailsRepo cartDetailsRepo;
        CartRepo cartRepo;
        public CartController(ProductSkuRepo productSkuRepo, CartDetailsRepo cartDetailsRepo, CartRepo cartRepo)
        {
            this.productSkuRepo = productSkuRepo;
            this.cartDetailsRepo = cartDetailsRepo;
            this.cartRepo = cartRepo;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] ProductSkusDTO model)
        {

            //var customerID = 0;
            if (model.CustomerID == 0)
            {
                var list = HttpContext.Session.GetObject<List<CartDetails>>("CartDetail");
                var productSku = await productSkuRepo.GetByIdAsync(model.ID);
                CartDetails cartDetails = new CartDetails();
                cartDetails = list.FirstOrDefault(p => p.ProductSkusID == model.ID);
                if (cartDetails != null)
                {
                    list.Remove(cartDetails);
                    cartDetails.ProductSkusID = model.ID;
                    cartDetails.Quantity = model.Quantity + cartDetails.Quantity;
                }
                else
                {
                    cartDetails = new CartDetails();
                    cartDetails.ProductSkusID = model.ID;
                    cartDetails.Quantity = model.Quantity;
                }
                if (cartDetails.Quantity > productSku.Quantity)
                {
                    cartDetails.Quantity = productSku.Quantity;
                }
                list.Add(cartDetails);
                HttpContext.Session.SetObject<List<CartDetails>>("CartDetail", list);
            }
            else
            {
                var checkExist = await cartRepo.FirstOrDefaultAsync(p => p.PotentialCustomerID == model.CustomerID);
                if (checkExist == null)
                {
                    Cart cart = new Cart();
                    cart.PotentialCustomerID = model.CustomerID;
                    await cartRepo.InsertAsync(cart);
                }
                var list = cartDetailsRepo.FindAsync(p => p.CartID == model.CustomerID).Result.ToList();

                var productSku = await productSkuRepo.GetByIdAsync(model.ID);
                CartDetails cartDetails = new CartDetails();
                if (list != null)
                {
                    cartDetails = list.FirstOrDefault(p => p.ProductSkusID == model.ID);
                    if (cartDetails != null)
                    {
                        cartDetails.ProductSkusID = model.ID;
                        cartDetails.Quantity = model.Quantity + cartDetails.Quantity;
                        if (cartDetails.Quantity > productSku.Quantity)
                        {
                            cartDetails.Quantity = productSku.Quantity;
                        }

                        await cartDetailsRepo.UpdateAsync(cartDetails);
                    }
                    else
                    {
                        cartDetails = new CartDetails();
                        cartDetails.ProductSkusID = model.ID;
                        cartDetails.Quantity = model.Quantity;
                        cartDetails.CartID = model.CustomerID;
                        if (cartDetails.Quantity > productSku.Quantity)
                        {
                            cartDetails.Quantity = productSku.Quantity;
                        }
                        await cartDetailsRepo.InsertAsync(cartDetails);
                    }
                }
                else
                {
                    cartDetails = new CartDetails();
                    cartDetails.ProductSkusID = model.ID;
                    cartDetails.Quantity = model.Quantity;
                    cartDetails.CartID = model.CustomerID;
                    await cartDetailsRepo.InsertAsync(cartDetails);
                }
            }
            return Json(1);
        }

        public IActionResult GetProductInCart(int customerID)
        {
            var listCart = new List<CartDetails>();
            if (customerID == 0)
            {
                listCart = HttpContext.Session.GetObject<List<CartDetails>>("CartDetail");
            }
            else
            {
                listCart = cartDetailsRepo.FindAsync(p => p.CartID == customerID).Result.ToList();
            }
            List<ProductSkusViewModel> listSkuCart = new List<ProductSkusViewModel>();

            foreach (var item in listCart)
            {
                var model = SQLHelper<ProductSkusViewModel>.ProcedureToModel("spGetProductToCart", new string[] { "@SkuID", "@Quantity" }, new object[] { item.ProductSkusID, item.Quantity });
                listSkuCart.Add(model);
            }

            return Json(listSkuCart, new System.Text.Json.JsonSerializerOptions());
        }
        [Route("cart/change-quantity")]
        public async Task<IActionResult> ChangeQuantity(int productSkuID, int quantity, int customerID)
        {
            var productSku = await productSkuRepo.GetByIdAsync(productSkuID);


            var listCart = new List<CartDetails>();
            if (customerID == 0)
            {
                listCart = HttpContext.Session.GetObject<List<CartDetails>>("CartDetail");
                int index = listCart.FindIndex(p => p.ProductSkusID == productSkuID);
                if (index != -1)
                {
                    CartDetails detail = listCart[index];
                    detail.Quantity = quantity;
                    if (productSku.Quantity < quantity)
                    {
                        detail.Quantity = productSku.Quantity;
                    }
                    listCart[index] = detail;
                    HttpContext.Session.SetObject<List<CartDetails>>("CartDetail", listCart);
                }
            }
            else
            {
                var detail = await cartDetailsRepo.FirstOrDefaultAsync(c => c.CartID == customerID && c.ProductSkusID == productSkuID);
                detail.Quantity = quantity;
                if (productSku.Quantity < quantity)
                {
                    detail.Quantity = productSku.Quantity;
                }
                await cartDetailsRepo.UpdateAsync(detail);
            }
            return Json(1);
        }
        [HttpDelete("cart/delete")]
        public async Task<IActionResult> DeleteCartDetail(int productSkuID, int customerID)
        {

            var listCart = new List<CartDetails>();
            if (customerID == 0)
            {
                listCart = HttpContext.Session.GetObject<List<CartDetails>>("CartDetail");
                listCart.RemoveAt(listCart.FindIndex(p => p.ProductSkusID == productSkuID));
                HttpContext.Session.SetObject<List<CartDetails>>("CartDetail", listCart);
            }
            else
            {
                var detail = await cartDetailsRepo.FirstOrDefaultAsync(c => c.CartID == customerID && c.ProductSkusID == productSkuID);
                await cartDetailsRepo.DeleteAsync(detail);
            }
            return Json(1);
        }
    }
}
