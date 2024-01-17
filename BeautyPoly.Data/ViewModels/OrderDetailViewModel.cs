using BeautyPoly.Models;

namespace BeautyPoly.Data.ViewModels
{
    public class OrderDetailViewModel : OrderDetails
    {
        public string CombinedOptionValues { get; set; }
        public string ProductName { get; set; }
        public string Image { get; set; }
        public int ProductID { get; set; }
    }
}
