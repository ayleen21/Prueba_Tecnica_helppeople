using Catalogo.Api.Entities;
using Catalogo.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace Catalogo.Api.Services;

public class CsvProductoImporter
{
    private readonly AppDbContext _context;
    public CsvProductoImporter(AppDbContext context)
    {
        _context = context;
    }

    public async Task<(int creados, int errores, List<string> erroresDetalle)> ImportarCsvAsync(Stream csvStream)
    {
        var errores = new List<string>();
        int creados = 0;
        int erroresCount = 0;
        using var reader = new StreamReader(csvStream);
        string? header = await reader.ReadLineAsync();
        if (header == null)
        {
            errores.Add("El archivo está vacío.");
            return (0, 1, errores);
        }
        var columnas = header.Split(',');
        // Esperados: Nombre,Descripcion,Sku,Precio,Stock,IdCategoria,Activo
        while (!reader.EndOfStream)
        {
            var linea = await reader.ReadLineAsync();
            if (string.IsNullOrWhiteSpace(linea)) continue;
            var campos = linea.Split(',');
            if (campos.Length < 7)
            {
                errores.Add($"Fila incompleta: {linea}");
                erroresCount++;
                continue;
            }
            try
            {
                var nombre = campos[0].Trim();
                var descripcion = campos[1].Trim();
                var sku = campos[2].Trim();
                var precio = decimal.Parse(campos[3], CultureInfo.InvariantCulture);
                var stock = int.Parse(campos[4]);
                var idCategoria = int.Parse(campos[5]);
                var activo = campos[6].Trim().ToLower() == "true" || campos[6].Trim() == "1";
                // Validaciones mínimas
                if (string.IsNullOrWhiteSpace(nombre) || string.IsNullOrWhiteSpace(sku) || precio <= 0)
                {
                    errores.Add($"Datos inválidos en fila: {linea}");
                    erroresCount++;
                    continue;
                }
                // Validar existencia de categoría
                var categoriaExiste = await _context.Categorias.AnyAsync(c => c.IdCategoria == idCategoria);
                if (!categoriaExiste)
                {
                    errores.Add($"Categoría no existe para fila: {linea}");
                    erroresCount++;
                    continue;
                }
                // Validar SKU único
                var skuExiste = await _context.Productos.AnyAsync(p => p.Sku == sku);
                if (skuExiste)
                {
                    errores.Add($"SKU repetido en fila: {linea}");
                    erroresCount++;
                    continue;
                }
                var producto = new Producto
                {
                    Nombre = nombre,
                    Descripcion = descripcion,
                    Sku = sku,
                    Precio = precio,
                    Stock = stock,
                    IdCategoria = idCategoria,
                    Activo = activo,
                    FechaCreacion = DateTime.UtcNow
                };
                _context.Productos.Add(producto);
                creados++;
            }
            catch (Exception ex)
            {
                errores.Add($"Error en fila: {linea} - {ex.Message}");
                erroresCount++;
            }
        }
        await _context.SaveChangesAsync();
        return (creados, erroresCount, errores);
    }
}
