using Catalogo.Api.Data;
using Catalogo.Api.Entities;
using Catalogo.Api.DTOs.Productos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Catalogo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductosController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductosController(AppDbContext context)
    {
        _context = context;
    }

    //Metodo GET - Listar productos con filtros, paginacion y ordenamiento
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Producto>>> GetProductos(
    int page = 1,
    int pageSize = 10,
    string? search = null,
    int? idCategoria = null,
    decimal? precioMin = null,
    decimal? precioMax = null,
    bool? activo = null,
    string? sortBy = null,
    string? sortDir = "asc"
)
    {
        var query = _context.Productos
            .AsQueryable();

        // Filtro busqueda por nombre o SKU
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(p =>
                p.Nombre.Contains(search) ||
                p.Sku.Contains(search));
        }

        //  Filtro por categoria
        if (idCategoria.HasValue)
        {
            query = query.Where(p => p.IdCategoria == idCategoria.Value);
        }

        // Filtro por rango de precios
        if (precioMin.HasValue)
        {
            query = query.Where(p => p.Precio >= precioMin.Value);
        }

        if (precioMax.HasValue)
        {
            query = query.Where(p => p.Precio <= precioMax.Value);
        }

        // Filtro por estado activo/inactivo
        if (activo.HasValue)
        {
            query = query.Where(p => p.Activo == activo.Value);
        }

        // Ordenamiento 
        if (!string.IsNullOrWhiteSpace(sortBy))
        {
            if (sortBy.ToLower() == "precio")
            {
                query = sortDir?.ToLower() == "desc"
                    ? query.OrderByDescending(p => p.Precio)
                    : query.OrderBy(p => p.Precio);
            }
            else if (sortBy.ToLower() == "nombre")
            {
                query = sortDir?.ToLower() == "desc"
                    ? query.OrderByDescending(p => p.Nombre)
                    : query.OrderBy(p => p.Nombre);
            }
        }
        else
        {
            query = query.OrderBy(p => p.IdProducto);
        }

        var totalRegistros = await query.CountAsync();

        // Paginacion
        var productos = await query
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .Select(p => new ProductoDto
        {
            IdProducto = p.IdProducto,
            IdCategoria = p.IdCategoria,
            Nombre = p.Nombre,
            Sku = p.Sku,
            Precio = p.Precio,
            Stock = p.Stock,
            Activo = p.Activo,
            CategoriaNombre = p.Categoria != null ? p.Categoria.Nombre : string.Empty,
            FechaCreacion = p.FechaCreacion
        })
        .ToListAsync();

        return Ok(new
        {
            total = totalRegistros,
            page,
            pageSize,
            items = productos
        });
    }

    //Metodo GET - Obtener producto por id
    [HttpGet("{id}")]
    public async Task<ActionResult<ProductoDto>> GetProducto(int id)
    {
        var producto = await _context.Productos
            .Where(p => p.IdProducto == id)
            .Select(p => new ProductoDto
            {
                IdProducto = p.IdProducto,
                IdCategoria = p.IdCategoria,
                Nombre = p.Nombre,
                Sku = p.Sku,
                Precio = p.Precio,
                Stock = p.Stock,
                Activo = p.Activo,
                CategoriaNombre = p.Categoria.Nombre,
                FechaCreacion = p.FechaCreacion
            })
            .FirstOrDefaultAsync();

        if (producto == null)
            return NotFound();

        return Ok(producto);
    }

    // Metodo POST - Crear nuevo producto
    [HttpPost]
    public async Task<ActionResult> PostProducto([FromBody] ProductoCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // valida si la categoria existe
        var categoriaExiste = await _context.Categorias
            .AnyAsync(c => c.IdCategoria == dto.IdCategoria);

        if (!categoriaExiste)
            return BadRequest("La categoria especificada no existe.");

        // Validar SKU unico
        var skuExiste = await _context.Productos.AnyAsync(p => p.Sku == dto.Sku);
        if (skuExiste)
            return BadRequest("Ya existe un producto con ese SKU.");

        // Crear entidad
        var producto = new Producto
        {
            IdCategoria = dto.IdCategoria,
            Nombre = dto.Nombre,
            Descripcion = dto.Descripcion,
            Sku = dto.Sku,
            Precio = dto.Precio,
            Stock = dto.Stock,
            Activo = dto.Activo,
            FechaCreacion = DateTime.UtcNow
        };

        _context.Productos.Add(producto);
        await _context.SaveChangesAsync();

        // Retornar 201 Created con Location header
        return CreatedAtAction(
            nameof(GetProducto),
            new { id = producto.IdProducto },
            new
            {
                producto.IdCategoria,
                producto.IdProducto,
                producto.Nombre,
                producto.Descripcion
            });
    }

    // Metodo POST - Crear productos en cantidad masiva
    [HttpPost("productosMasivo")]
    public async Task<ActionResult> PostProductosMasivo(
        [FromBody] List<ProductoCreateDto> productosDto)
    {
        if (productosDto == null || productosDto.Count == 0)
            return BadRequest("La lista de productos está vacía.");

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Obtener todas las categorias unicas enviadas
        var categoriasIds = productosDto
            .Select(p => p.IdCategoria)
            .Distinct()
            .ToList();

        // Traer categorias existentes en una sola consulta
        var categoriasExistentes = await _context.Categorias
            .Where(c => categoriasIds.Contains(c.IdCategoria))
            .Select(c => c.IdCategoria)
            .ToListAsync();

        // Validar si alguna categoria no existe
        var categoriasInvalidas = categoriasIds
            .Except(categoriasExistentes)
            .ToList();

        if (categoriasInvalidas.Any())
            return BadRequest($"Las siguientes categorías no existen: {string.Join(", ", categoriasInvalidas)}");

        // Crear entidades
        var productos = productosDto.Select(dto => new Producto
        {
            IdCategoria = dto.IdCategoria,
            Nombre = dto.Nombre,
            Descripcion = dto.Descripcion,
            Sku = dto.Sku,
            Precio = dto.Precio,
            Stock = dto.Stock,
            Activo = dto.Activo,
            FechaCreacion = DateTime.UtcNow
        }).ToList();

        _context.Productos.AddRange(productos);
        await _context.SaveChangesAsync();

        return Created(string.Empty, new
        {
            mensaje = "Productos creados correctamente",
            cantidad = productos.Count,
            ids = productos.Select(p => p.IdProducto)
        });
    }

    //Metodo PUT - Actualizar producto
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateProducto(int id, [FromBody] ProductoUpdateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var productoExistente = await _context.Productos.FindAsync(id);
        if (productoExistente == null)
            return NotFound();

        // Validar si la categoria existe
        var categoriaExiste = await _context.Categorias.AnyAsync(c => c.IdCategoria == dto.IdCategoria);
        if (!categoriaExiste)
            return BadRequest("La categoria especificada no existe.");


        productoExistente.IdCategoria = dto.IdCategoria;
        productoExistente.Nombre = dto.Nombre;
        productoExistente.Descripcion = dto.Descripcion;
        productoExistente.Sku = dto.Sku;
        productoExistente.Precio = dto.Precio;
        productoExistente.Stock = dto.Stock;
        productoExistente.Activo = dto.Activo;
        productoExistente.FechaModificacion = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Devolver el DTO actualizado
        var resultDto = new ProductoDto
        {
            IdProducto = productoExistente.IdProducto,
            IdCategoria = productoExistente.IdCategoria,
            Nombre = productoExistente.Nombre,
            Sku = productoExistente.Sku,
            Precio = productoExistente.Precio,
            Stock = productoExistente.Stock,
            Activo = productoExistente.Activo,
            CategoriaNombre = (await _context.Categorias.FindAsync(productoExistente.IdCategoria))?.Nombre ?? string.Empty,
            FechaCreacion = productoExistente.FechaCreacion
        };
        return Ok(resultDto);
    }

    //Metodo DELETE - Eliminar producto
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProducto(int id)
    {
        var producto = await _context.Productos.FindAsync(id);
        if (producto == null)
            return NotFound();

        _context.Productos.Remove(producto);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
