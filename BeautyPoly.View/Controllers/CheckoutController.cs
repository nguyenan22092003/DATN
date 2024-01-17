using BeautyPoly.Common;
using BeautyPoly.Data.Common;
using BeautyPoly.Data.Models.DTO;
using BeautyPoly.Data.Repositories;
using BeautyPoly.Data.ViewModels;
using BeautyPoly.Models;
using BeautyPoly.View.Helper;
using BeautyPoly.View.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using System.Text;

namespace BeautyPoly.View.Controllers
{
    public class CheckoutController : Controller
    {
        private readonly HttpClient _httpClient;
        CouponRepo couponRepo;
        VoucherRepo voucherRepo;
        PotentialCustomersRepo customersRepo;
        OrderRepo orderRepo;
        CartDetailsRepo cartDetailsRepo;
        DetailOrderRepo detailOrderRepo;
        ProductSkuRepo productSkuRepo;
        VoucherDetailsRepo voucherDetailsRepo;
        public CheckoutController(CouponRepo couponRepo, VoucherRepo voucherRepo, PotentialCustomersRepo customersRepo, OrderRepo orderRepo, CartDetailsRepo cartDetailsRepo, DetailOrderRepo detailOrderRepo, ProductSkuRepo productSkuRepo, VoucherDetailsRepo voucherDetailsRepo)
        {
            this.couponRepo = couponRepo;
            this.voucherRepo = voucherRepo;
            this.customersRepo = customersRepo;
            this.orderRepo = orderRepo;
            _httpClient = new HttpClient();

            _httpClient.DefaultRequestHeaders.Add("token", "4984199c-febd-11ed-8a8c-6e4795e6d902");
            this.cartDetailsRepo = cartDetailsRepo;
            this.detailOrderRepo = detailOrderRepo;
            this.productSkuRepo = productSkuRepo;
            this.voucherDetailsRepo = voucherDetailsRepo;
        }
        //Lấy địa chỉ quận huyện
        public JsonResult GetListDistrict(int idProvin)
        {
            HttpResponseMessage responseDistrict = _httpClient.GetAsync("https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=" + idProvin).Result;
            District lstDistrict = new District();
            if (responseDistrict.IsSuccessStatusCode)
            {
                string jsonData2 = responseDistrict.Content.ReadAsStringAsync().Result;

                lstDistrict = JsonConvert.DeserializeObject<District>(jsonData2);
            }
            return Json(lstDistrict, new System.Text.Json.JsonSerializerOptions());
        }
        //Lấy địa chỉ phường xã
        public JsonResult GetListWard(int idWard)
        {


            HttpResponseMessage responseWard = _httpClient.GetAsync("https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=" + idWard).Result;

            Ward lstWard = new Ward();

            if (responseWard.IsSuccessStatusCode)
            {
                string jsonData2 = responseWard.Content.ReadAsStringAsync().Result;

                lstWard = JsonConvert.DeserializeObject<Ward>(jsonData2);
            }
            return Json(lstWard, new System.Text.Json.JsonSerializerOptions());
        }
        public async Task<JsonResult> GetTotalShipping([FromBody] ShippingOrder shippingOrder)
        {
            try
            {
                _httpClient.DefaultRequestHeaders.Add("shop_id", "4189080");

                var apiUrl = "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";

                var queryString = new StringBuilder();
                queryString.Append($"from_district_id={3440}");
                queryString.Append($"&from_ward_code=13010");
                queryString.Append($"&service_id={shippingOrder.service_id}");
                //queryString.Append($"&service_type_id=");
                queryString.Append($"&to_district_id={shippingOrder.to_district_id}");
                queryString.Append($"&to_ward_code={shippingOrder.to_ward_code}");
                queryString.Append($"&height={shippingOrder.height}");
                queryString.Append($"&length={shippingOrder.length}");
                queryString.Append($"&weight={shippingOrder.weight}");
                queryString.Append($"&width={shippingOrder.width}");
                queryString.Append($"&insurance_value={shippingOrder.insurance_value}");
                queryString.Append($"&coupon=");


                var fullUrl = $"{apiUrl}?{queryString}";

                HttpResponseMessage responseWShipping = await _httpClient.GetAsync(fullUrl);

                if (responseWShipping.IsSuccessStatusCode)
                {
                    string jsonData = await responseWShipping.Content.ReadAsStringAsync();
                    var shipping = JsonConvert.DeserializeObject<Shipping>(jsonData);

                    HttpContext.Session.SetInt32("shiptotal", shipping.data.total);


                    shipping.data.totaloder = shipping.data.total + 10;

                    return Json(shipping, new System.Text.Json.JsonSerializerOptions());
                }
                else
                {
                    // Log or handle the error appropriately
                    var errorMessage = $"Error: {responseWShipping.StatusCode} - {responseWShipping.ReasonPhrase}";
                    Console.WriteLine(errorMessage);

                    return Json(new { error = errorMessage });
                }
            }
            catch (Exception ex)
            {

                return Json(new { error = "An error occurred while processing the request." });
            }
        }

        public IActionResult Index()
        {
            HttpResponseMessage responseProvin = _httpClient.GetAsync("https://online-gateway.ghn.vn/shiip/public-api/master-data/province").Result;

            Provin lstprovin = new Provin();
            if (responseProvin.IsSuccessStatusCode)
            {
                string jsonData2 = responseProvin.Content.ReadAsStringAsync().Result;


                lstprovin = JsonConvert.DeserializeObject<Provin>(jsonData2);
                ViewBag.Provin = new SelectList(lstprovin.data, "ProvinceID", "ProvinceName");
            }

            return View();
        }

        [HttpGet("checkout/addcoupon")]
        public async Task<IActionResult> AddCoupon(string couponCode, int total, string phone)
        {
            try
            {
                CheckoutViewModel _couponViewModel = new CheckoutViewModel();
                var coupons = await couponRepo.GetAllAsync();
                if (couponCode == null)
                {
                    _couponViewModel.TotalValue = total;
                    _couponViewModel.Value = 0;
                    _couponViewModel.Note = "Vui lòng nhập mã giảm giá để áp dụng!";
                    return Json(_couponViewModel);
                }
                foreach (var item in coupons)
                {
                    if (item.CouponCode == couponCode)
                    {
                        _couponViewModel.TotalValue = total;
                        _couponViewModel.Value = 0;
                        if (phone == null)
                        {
                            _couponViewModel.Note = "Vui lòng nhập SDT trước khi áp dụng!";
                            return Json(_couponViewModel);
                        }
                        var existCustomer = orderRepo.GetAllAsync().Result.FirstOrDefault(p => p.CouponID == item.CouponID && p.CustomerPhone == phone);
                        item.Orders = null;
                        if (existCustomer != null)
                        {
                            _couponViewModel.Note = $"Tài khoản với SDT: [{phone}] đã sử dụng mã giảm giá!";
                            return Json(_couponViewModel);
                        }
                        if (item.EndDate < DateTime.Now)
                        {
                            _couponViewModel.Note = "Mã giảm giá đã hết hạn!";
                            return Json(_couponViewModel);
                        }
                        if (item.Quantity <= 0)
                        {
                            _couponViewModel.Note = "Đã hết mã giảm giá!";
                            return Json(_couponViewModel);
                        }
                        if (item.CouponType == 0)
                        {
                            _couponViewModel.Coupon = item;
                            _couponViewModel.TotalValue = (int)(total * (1 - (item.DiscountValue / (double)100)));
                            _couponViewModel.Value = (int)(total * (item.DiscountValue / (double)100));
                            _couponViewModel.Note = $"Giảm {item.DiscountValue}% cho toàn bộ đơn hàng";
                        }
                        else
                        {
                            if (total - item.DiscountValue < 0)
                            {
                                _couponViewModel.Note = "Mã giảm giá không phù hợp!";
                                return Json(_couponViewModel);
                            }
                            _couponViewModel.Coupon = item;
                            _couponViewModel.TotalValue = (int)(total - item.DiscountValue);
                            _couponViewModel.Value = (int)item.DiscountValue;
                            _couponViewModel.Note = $"Giảm {item.DiscountValue:#,0} VND cho toàn bộ đơn hàng";
                        }
                        return Json(_couponViewModel);
                    }
                }
                _couponViewModel.TotalValue = total;
                _couponViewModel.Value = 0;
                _couponViewModel.Note = "Mã giảm giá không tồn tại!";
                return Json(_couponViewModel);
            }
            catch (Exception)
            {

                return Json(null);
            }
        }
        [HttpGet("checkout/getvoucher-by-customer")]
        public IActionResult GetVoucherByCustomer(int customerID)
        {
            var list = voucherRepo.GetVoucherByCustomer(customerID);
            return Json(list);
        }
        [HttpGet("checkout/addvoucher")]
        public async Task<IActionResult> AddVoucher(int voucherID, int total)
        {
            try
            {
                CheckoutViewModel _voucherViewModel = new CheckoutViewModel();
                var voucher = await voucherRepo.GetByIdAsync(voucherID);
                _voucherViewModel.TotalValue = total;
                _voucherViewModel.Value = 0;
                if (voucher != null)
                {
                    if (voucher.VoucherType == 0)
                    {
                        _voucherViewModel.Voucher = voucher;
                        _voucherViewModel.TotalValue = (int)(total * (1 - (voucher.DiscountValue / (double)100)));
                        _voucherViewModel.Value = (int)(total * (voucher.DiscountValue / (double)100));
                        if (_voucherViewModel.Value >= voucher.MaxValue)
                        {
                            _voucherViewModel.TotalValue = (int)(total - voucher.MaxValue);
                            _voucherViewModel.Value = (int)voucher.MaxValue;
                        }
                        _voucherViewModel.Note = $"Giảm {voucher.DiscountValue}% cho toàn bộ đơn hàng";
                    }
                    else
                    {
                        if (total - voucher.DiscountValue < 0)
                        {
                            _voucherViewModel.Note = "Phiếu giảm giá không phù hợp!";
                            return Json(_voucherViewModel);
                        }
                        _voucherViewModel.Voucher = voucher;
                        _voucherViewModel.TotalValue = (int)(total - voucher.DiscountValue);
                        _voucherViewModel.Value = (int)voucher.DiscountValue;
                        _voucherViewModel.Note = $"Giảm {voucher.DiscountValue:#,0} VND cho toàn bộ đơn hàng";
                    }
                }
                return Json(_voucherViewModel);
            }
            catch (Exception)
            {

                return Json(null);
            }
        }
        [HttpPost("checkout/create-order")]
        public async Task<IActionResult> CreateOrder([FromBody] CheckOutDTO checkOut)
        {
            try
            {
                var listCart = new List<CartDetails>();
                if (checkOut.CustomerID == 0)
                {
                    listCart = HttpContext.Session.GetObject<List<CartDetails>>("CartDetail");
                }
                else
                {
                    listCart = cartDetailsRepo.FindAsync(p => p.CartID == checkOut.CustomerID).Result.ToList();
                }
                foreach (var item in listCart)
                {
                    var model = SQLHelper<ProductSkusViewModel>.ProcedureToModel("spGetProductToCart", new string[] { "@SkuID", "@Quantity" }, new object[] { item.ProductSkusID, item.Quantity });
                    var check = await productSkuRepo.FirstOrDefaultAsync(p => p.ProductSkusID == item.ProductSkusID && p.Quantity >= item.Quantity);
                    if (check != null) continue;
                    else return Json($"Sản phẩm [{model.ProductSkuName}] đã hết hàng! Vui lòng chọn sản phẩm khác.");
                }

                PotentialCustomer customer = await customersRepo.FirstOrDefaultAsync(p => p.Phone == checkOut.Phone || p.Email == checkOut.Email);
                if (customer == null)
                {
                    customer = new PotentialCustomer();
                    customer.FullName = checkOut.FullName;
                    customer.Phone = checkOut.Phone;
                    customer.Email = checkOut.Email;
                    customer.Password = MaHoaMD5.EncryptPassword("1");
                    await customersRepo.InsertAsync(customer);
                }
                double totalPrice = (double)HttpContext.Session.GetInt32("shiptotal");
                Order order = new Order();
                order.TransactStatusID = 1;
                order.Address = checkOut.Address;
                order.OrderCode = "HD_" + DateTime.Now.Ticks;
                order.CustomerName = checkOut.FullName;
                order.CustomerPhone = checkOut.Phone;
                order.PotentialCustomerID = customer.PotentialCustomerID;
                order.MedthodPayment = "cash";
                order.OrderDate = DateTime.Now;
                order.Note = checkOut.Note;
                order.ShipPrice = Convert.ToInt32(totalPrice);
                await orderRepo.InsertAsync(order);
                List<ProductSkusViewModel> listSkuCart = new List<ProductSkusViewModel>();
                foreach (var item in listCart)
                {
                    var model = SQLHelper<ProductSkusViewModel>.ProcedureToModel("spGetProductToCart", new string[] { "@SkuID", "@Quantity" }, new object[] { item.ProductSkusID, item.Quantity });
                    OrderDetails orderDetails = new OrderDetails();
                    orderDetails.OrderID = order.OrderID;
                    orderDetails.ProductSkusID = model.ProductSkusID;
                    orderDetails.Quantity = model.QuantityCart;
                    orderDetails.Price = TextUtils.ToInt(model.Price);
                    orderDetails.PriceNew = TextUtils.ToInt(model.PriceNew);
                    orderDetails.TotalMoney = model.TotalPrice;
                    totalPrice += model.TotalPrice;
                    await detailOrderRepo.InsertAsync(orderDetails);
                }
                if (checkOut.CouponID > 0)
                {
                    var coupon = await couponRepo.GetByIdAsync(checkOut.CouponID);
                    if (coupon != null)
                    {
                        coupon.Quantity--;
                        await couponRepo.UpdateAsync(coupon);
                        order.CouponID = coupon.CouponID;
                        order.Discount = checkOut.Discount;
                        totalPrice = totalPrice - checkOut.Discount;
                    }
                }
                if (checkOut.VoucherID > 0)
                {
                    var voucher = await voucherRepo.GetByIdAsync(checkOut.VoucherID);
                    if (voucher != null)
                    {
                        voucher.Quantity--;
                        await voucherRepo.UpdateAsync(voucher);
                        var voucherCustomer = voucherDetailsRepo.GetAllAsync().Result.FirstOrDefault(p => p.VoucherID == voucher.VoucherID && p.PotentialCustomerID == checkOut.CustomerID);
                        if (voucherCustomer != null)
                        {
                            await voucherDetailsRepo.DeleteAsync(voucherCustomer);
                        }
                        order.VoucherID = voucher.VoucherID;
                        order.Discount = checkOut.Discount;
                        totalPrice = totalPrice - checkOut.Discount;
                    }
                }
                order.TotalMoney = totalPrice;
                await orderRepo.UpdateAsync(order);
                if (checkOut.UseVNPay)
                {
                    return Json(Payment(order, checkOut.CustomerID));
                }
                HttpContext.Session.Remove("CartDetail");
                if (checkOut.CustomerID > 0)
                {
                    await cartDetailsRepo.DeleteRangeAsync(listCart);
                }
                return Json(1);
            }
            catch (Exception ex)
            {
                return Json(0);
            }

        }
        public string Payment(Order order, int customerID)
        {
            string url = "http://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
            string returnUrl = $"https://localhost:44315/Checkout/PaymentConfirm?id={order.OrderID}&customerID={customerID}";
            string tmnCode = "6AV1KO3E";
            string hashSecret = "UGHKKYGUTTLWWTQOJBECDFAMDHZDBLWW";

            PayLib pay = new PayLib();

            pay.AddRequestData("vnp_Version", "2.1.0"); //Phiên bản api mà merchant kết nối. Phiên bản hiện tại là 2.1.0
            pay.AddRequestData("vnp_Command", "pay"); //Mã API sử dụng, mã cho giao dịch thanh toán là 'pay'
            pay.AddRequestData("vnp_TmnCode", tmnCode); //Mã website của merchant trên hệ thống của VNPAY (khi đăng ký tài khoản sẽ có trong mail VNPAY gửi về)
            pay.AddRequestData("vnp_Amount", ((long)(order.TotalMoney * 100)).ToString());
            // pay.AddRequestData("vnp_Amount", "1000000"); //số tiền cần thanh toán, công thức: số tiền * 100 - ví dụ 10.000 (mười nghìn đồng) --> 1000000
            pay.AddRequestData("vnp_BankCode", ""); //Mã Ngân hàng thanh toán (tham khảo: https://sandbox.vnpayment.vn/apis/danh-sach-ngan-hang/), có thể để trống, người dùng có thể chọn trên cổng thanh toán VNPAY
            pay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss")); //ngày thanh toán theo định dạng yyyyMMddHHmmss
            pay.AddRequestData("vnp_CurrCode", "VND"); //Đơn vị tiền tệ sử dụng thanh toán. Hiện tại chỉ hỗ trợ VND
            pay.AddRequestData("vnp_IpAddr", HttpContext.Connection.RemoteIpAddress?.ToString()); //Địa chỉ IP của khách hàng thực hiện giao dịch
            pay.AddRequestData("vnp_Locale", "vn");//Ngôn ngữ giao diện hiển thị - Tiếng Việt (vn), Tiếng Anh (en)
            pay.AddRequestData("vnp_OrderInfo", "Thanh toan don hang"); //Thông tin mô tả nội dung thanh toán
            pay.AddRequestData("vnp_OrderType", "other"); //topup: Nạp tiền điện thoại - billpayment: Thanh toán hóa đơn - fashion: Thời trang - other: Thanh toán trực tuyến
            pay.AddRequestData("vnp_ReturnUrl", returnUrl); //URL thông báo kết quả giao dịch khi Khách hàng kết thúc thanh toán
            pay.AddRequestData("vnp_TxnRef", "HD_" + DateTime.Now.Ticks.ToString()); //mã hóa đơn

            string paymentUrl = pay.CreateRequestUrl(url, hashSecret);


            return paymentUrl;
        }

        public async Task<IActionResult> PaymentConfirm(int id, int customerID)
        {
            var order = await orderRepo.GetByIdAsync(id);
            if (Request.QueryString.Value != null)
            {

                string hashSecret = "UGHKKYGUTTLWWTQOJBECDFAMDHZDBLWW"; //Chuỗi bí mật
                var vnpayData = Request.Query;
                PayLib pay = new PayLib();

                var account = customersRepo.FirstOrDefaultAsync(c => c.PotentialCustomerID == order.PotentialCustomerID).Result.FullName;

                //lấy toàn bộ dữ liệu được trả về
                foreach (var (key, value) in vnpayData)
                {
                    if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                    {
                        pay.AddResponseData(key, value);
                    }
                }

                string orderId = pay.GetResponseData("vnp_TxnRef"); //mã hóa đơn
                string vnpayTranId = pay.GetResponseData("vnp_TransactionNo"); //mã giao dịch tại hệ thống VNPAY
                string vnp_ResponseCode = pay.GetResponseData("vnp_ResponseCode"); //response code: 00 - thành công, khác 00 - xem thêm https://sandbox.vnpayment.vn/apis/docs/bang-ma-loi/
                string vnp_SecureHash = Request.Query["vnp_SecureHash"]; //hash của dữ liệu trả về
                bool checkSignature = pay.ValidateSignature(vnp_SecureHash, hashSecret); //check chữ ký đúng hay không?
                if (checkSignature)
                {
                    if (vnp_ResponseCode == "00")
                    {
                        //Thanh toán thành công
                        ViewBag.Message = "Thanh toán thành công hóa đơn " + orderId + " | Mã giao dịch: " + vnpayTranId;

                        if (order != null)
                        {
                            order.TransactStatusID = 1;
                            order.MedthodPayment = "credit_card";
                            await orderRepo.UpdateAsync(order);
                        }

                        var listCart = new List<CartDetails>();
                        if (customerID == 0)
                        {
                            HttpContext.Session.Remove("CartDetail");
                        }
                        else
                        {
                            listCart = cartDetailsRepo.FindAsync(p => p.CartID == customerID).Result.ToList();
                            await cartDetailsRepo.DeleteRangeAsync(listCart);
                        }
                        return RedirectToAction("Index", "Home");

                    }
                    else
                    {
                        await detailOrderRepo.DeleteRangeAsync(await detailOrderRepo.FindAsync(p => p.OrderDetailsID == order.OrderID));
                        await orderRepo.DeleteAsync(order);
                        //Thanh toán không thành công. Mã lỗi: vnp_ResponseCode
                        ViewBag.Message = "Có lỗi xảy ra trong quá trình xử lý hóa đơn " + orderId + " | Mã giao dịch: " + vnpayTranId + " | Mã lỗi: " + vnp_ResponseCode;

                        return RedirectToAction("Index");
                    }
                }
                else
                {
                    await detailOrderRepo.DeleteRangeAsync(await detailOrderRepo.FindAsync(p => p.OrderDetailsID == order.OrderID));
                    await orderRepo.DeleteAsync(order);

                    return RedirectToAction("Index");
                }
            }
            return RedirectToAction("Index");
        }
    }
}
