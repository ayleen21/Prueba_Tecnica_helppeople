using Catalogo.Api.Data;
using Catalogo.Api.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Catalogo.Api.DTOs.Categorias;

namespace Catalogo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriasController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriasController(AppDbContext context)
    {
        _context = context;
    }

    // Metodo GET - Listar categorias 
    [HttpGet]
    public async Task<ActionResult> GetCategorias()
    {
        var categorias = await _context.Categorias
            .Select(c => new CategoriaDto
            {
                IdCategoria = c.IdCategoria,
                Nombre = c.Nombre,
                Descripcion = c.Descripcion,
                Activo = c.Activo
            })
            .ToListAsync();

        return Ok(categorias);
    }


    // Metodo POST - Crear nueva categoria
    [HttpPost]
    public async Task<ActionResult> PostCategoria([FromBody] CategoriaCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // validar que el nombre sea unico 
        var nombreExiste = await _context.Categorias
            .AnyAsync(c => c.Nombre == dto.Nombre);
        if (nombreExiste)
            return BadRequest("Ya existe una categoría con ese nombre.");

        var categoria = new Categoria
        {
            Nombre = dto.Nombre,
            Descripcion = dto.Descripcion,
            Activo = dto.Activo,
            FechaCreacion = DateTime.UtcNow
        };

        _context.Categorias.Add(categoria);
        await _context.SaveChangesAsync();

        var resultDto = new CategoriaDto
        {
            IdCategoria = categoria.IdCategoria,
            Nombre = categoria.Nombre,
            Descripcion = categoria.Descripcion,
            Activo = categoria.Activo
        };

        return CreatedAtAction(
            nameof(GetCategoria),
            new { id = categoria.IdCategoria },
            resultDto
        );
    }
    // Metodo GET - Obtener categoria por id
    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoriaDto>> GetCategoria(int id)
    {
        var categoria = await _context.Categorias
            .Where(c => c.IdCategoria == id)
            .Select(c => new CategoriaDto
            {
                IdCategoria = c.IdCategoria,
                Nombre = c.Nombre,
                Descripcion = c.Descripcion,
                Activo = c.Activo
            })
            .FirstOrDefaultAsync();

        if (categoria == null)
            return NotFound();

        return Ok(categoria);
    }

    // Metodo PUT - Actualizar categoria
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateCategoria(int id, [FromBody] CategoriaUpdateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var categoriaExistente = await _context.Categorias.FindAsync(id);
        if (categoriaExistente == null)
            return NotFound();

        // Validar nombre unico para la categoria 
        var nombreExiste = await _context.Categorias
            .AnyAsync(c => c.Nombre == dto.Nombre && c.IdCategoria != id);
        if (nombreExiste)
            return BadRequest("Ya existe una categoría con ese nombre.");


        categoriaExistente.Nombre = dto.Nombre;
        categoriaExistente.Descripcion = dto.Descripcion;
        categoriaExistente.Activo = dto.Activo;
        categoriaExistente.FechaModificacion = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Devolver el DTO con los dato actuaizados
        var resultDto = new CategoriaDto
        {
            IdCategoria = categoriaExistente.IdCategoria,
            Nombre = categoriaExistente.Nombre,
            Descripcion = categoriaExistente.Descripcion,
            Activo = categoriaExistente.Activo
        };
        return Ok(resultDto);
    }

    // Metodo DELETE - Eliminar categoria

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCategoria(int id)
    {
        var categoria = await _context.Categorias.FindAsync(id);

        if (categoria == null)
            return NotFound();

        // Antes de eliminar la categorial asegurarse que no tenga productos asociados
        var tieneProductos = await _context.Productos
            .AnyAsync(p => p.IdCategoria == id);

        if (tieneProductos)
            return BadRequest("No se puede eliminar la categoría porque tiene productos asociados.");

        _context.Categorias.Remove(categoria);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
