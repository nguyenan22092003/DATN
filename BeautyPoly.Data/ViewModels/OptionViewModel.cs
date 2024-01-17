namespace BeautyPoly.Data.ViewModels
{
    public class OptionViewModel
    {
        public int OptionID { get; set; }
        public string? OptionCode { get; set; }
        public string? OptionName { get; set; }
        public bool? IsDelete { get; set; }
        public bool? IsPublish { get; set; }
    }
}
