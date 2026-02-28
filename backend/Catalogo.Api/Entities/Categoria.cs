namespace Catalogo.Api.Entities
{
    public class Categoria
    {
        public int IdCategoria { get; set; }
        public required string Nombre { get; set; }
        public string? Descripcion { get; set; }
        public bool Activo { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime? FechaModificacion { get; set; }

    //Establece una relacion, ya que una categoria puede tener varios productos
        public ICollection<Producto> Productos { get; set; } = new List<Producto>();
    }
    
}
