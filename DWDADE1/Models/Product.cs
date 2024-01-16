using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DWDADE1.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        [Range(100, 400)]
        public decimal Price { get; set; }
        public bool Status { get; set; }
        public string? Image { get; set; }
    }
}
