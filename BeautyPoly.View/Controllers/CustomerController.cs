using BeautyPoly.Common;
using BeautyPoly.Data.Repositories;
using BeautyPoly.Data.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
namespace BeautyPoly.View.Controllers
{
    public class CustomerController : Controller
    {
        CustomerRepository _customerRepo;
        OrderRepo orderRepo;

        public CustomerController(CustomerRepository customerRepository, OrderRepo orderRepo)
        {
            _customerRepo = customerRepository;
            this.orderRepo = orderRepo;
        }

        public IActionResult EditCustomer()
        {
            var customerIdClaim = HttpContext.User.FindFirst("CustomerId");
            if (customerIdClaim != null)
            {
                return View();
            }
            else
            {
                return NotFound();
            }
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult GetOrderCustomer(int customerID)
        {
            var order = SQLHelper<OrderViewModel>.ProcedureToList("spGetOrderCustomer", new string[] { "@CustomerID" }, new object[] { customerID });
            return Json(order, new JsonSerializerOptions());
        }
        public IActionResult GetOrderDetailCustomer(int orderID)
        {
            var orderDetail = SQLHelper<OrderDetailViewModel>.ProcedureToList("spGetOrderDetailCustomer", new string[] { "@OrderID" }, new object[] { orderID });
            return Json(orderDetail, new JsonSerializerOptions());
        }
    }
}
