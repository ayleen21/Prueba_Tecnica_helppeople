using System;

namespace Catalogo.Api.DTOs.Productos
{
    public class ProductoDto
    {
        public int IdProducto { get; set; }
        public int IdCategoria { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string? Descripcion { get; set; }

        public string Sku { get; set; } = string.Empty;

        public decimal Precio { get; set; }

        public int Stock { get; set; }

        public bool Activo { get; set; }

        public string CategoriaNombre { get; set; } = string.Empty;

        public DateTime FechaCreacion { get; set; }
    }
}