using System.ComponentModel.DataAnnotations;

namespace Catalogo.Api.DTOs.Categorias
{
    public class CategoriaUpdateDto
    {
        [Required]
        [MaxLength(150)]
        public string Nombre { get; set; }

        [MaxLength(500)]
        public string? Descripcion { get; set; }

        public bool Activo { get; set; }
    }
}
