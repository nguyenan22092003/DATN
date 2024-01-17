using System.ComponentModel.DataAnnotations;

namespace BeautyPoly.View.Models
{
    public class ResetPass
    {
        [Required]
        public string Email { get; set; }
    }
}
