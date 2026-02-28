namespace Catalogo.Api.Entities;

public class Producto
{
    public int IdProducto { get; set; }
    public int IdCategoria { get; set; }
    public string Nombre { get; set; } = null!;
    public string? Descripcion { get; set; }
    public string Sku { get; set; } = null!;
    public decimal Precio { get; set; }
    public int Stock { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime FechaCreacion { get; set; }
    public DateTime? FechaModificacion { get; set; }

    //Establece una relacion, ya que un producto pertenece a una categoria
    public Categoria Categoria { get; set; } = null!;
}