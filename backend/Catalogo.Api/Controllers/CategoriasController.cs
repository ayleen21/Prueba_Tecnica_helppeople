using Catalogo.Api.Data;
using Catalogo.Api.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias()
    {
        var categorias = await _context.Categorias.ToListAsync();
        return Ok(categorias);
    }

    
    // POST - Crear
    [HttpPost]
    public async Task<ActionResult<Categoria>> CreateCategoria(Categoria categoria)
    {
        _context.Categorias.Add(categoria);
        await _context.SaveChangesAsync();

        return Created("", categoria);
    }

    // PUT - Actualizar
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateCategoria(int id, Categoria categoria)
    {
        if (id != categoria.IdCategoria)
            return BadRequest("El id no coincide");

        var categoriaExistente = await _context.Categorias.FindAsync(id);

        if (categoriaExistente == null)
            return NotFound();

        categoriaExistente.Nombre = categoria.Nombre;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE - Eliminar
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCategoria(int id)
    {
        var categoria = await _context.Categorias.FindAsync(id);

        if (categoria == null)
            return NotFound();

        _context.Categorias.Remove(categoria);
        await _context.SaveChangesAsync();

        return NoContent();
    }

}

