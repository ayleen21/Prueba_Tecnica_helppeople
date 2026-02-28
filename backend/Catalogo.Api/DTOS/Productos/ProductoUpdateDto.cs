using System.ComponentModel.DataAnnotations;

namespace Catalogo.Api.DTOs.Productos
{
    public class ProductoUpdateDto
    {
        [Required]
        public int IdCategoria { get; set; }

        [Required]
        [MaxLength(200)]
        public string Nombre { get; set; }

        [MaxLength(1000)]
        public string? Descripcion { get; set; }

        [Required]
        [MaxLength(100)]
        public string Sku { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "El precio debe ser mayor a 0.")]
        public decimal Precio { get; set; }

        [Range(0, int.MaxValue)]
        public int Stock { get; set; } = 0;

        public bool Activo { get; set; }
    }
}
