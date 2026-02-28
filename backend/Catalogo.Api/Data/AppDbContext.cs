using Microsoft.EntityFrameworkCore;
using Catalogo.Api.Entities;

namespace Catalogo.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Categoria> Categorias { get; set; } = null!;
        public DbSet<Producto> Productos { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.HasKey(e => e.IdCategoria);
                entity.Property(e => e.Nombre).IsRequired();

                entity.HasMany(e => e.Productos)
                      .WithOne(p => p.Categoria)
                      .HasForeignKey(p => p.IdCategoria);
            });

            modelBuilder.Entity<Producto>(entity =>
            {
                entity.HasKey(e => e.IdProducto);
                entity.Property(e => e.Nombre).IsRequired();
                entity.Property(e => e.Sku).IsRequired();
            });
        }
    }
}