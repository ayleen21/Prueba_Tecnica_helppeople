--Archivo: 05_seed.sql

-- Insertar datos de ejemplo en Categorias

IF NOT EXISTS (SELECT 1 FROM dbo.Categorias WHERE Nombre = 'Tecnología')
BEGIN
    INSERT INTO dbo.Categorias (Nombre, Descripcion)
    VALUES ('Tecnología', 'Productos tecnológicos y electrónicos');
END

IF NOT EXISTS (SELECT 1 FROM dbo.Categorias WHERE Nombre = 'Hogar')
BEGIN
    INSERT INTO dbo.Categorias (Nombre, Descripcion)
    VALUES ('Hogar', 'Artículos para el hogar');
END

IF NOT EXISTS (SELECT 1 FROM dbo.Categorias WHERE Nombre = 'Oficina')
BEGIN
    INSERT INTO dbo.Categorias (Nombre, Descripcion)
    VALUES ('Oficina', 'Productos de oficina y papelería');
END

GO

-- Insertar datos de ejemplo en Productos

DECLARE @IdTecnologia INT = (SELECT IdCategoria FROM dbo.Categorias WHERE Nombre = 'Tecnología');
DECLARE @IdHogar INT = (SELECT IdCategoria FROM dbo.Categorias WHERE Nombre = 'Hogar');
DECLARE @IdOficina INT = (SELECT IdCategoria FROM dbo.Categorias WHERE Nombre = 'Oficina');


IF NOT EXISTS (SELECT 1 FROM dbo.Productos WHERE Sku = 'TEC-001')
BEGIN
    INSERT INTO dbo.Productos
    (IdCategoria, Nombre, Descripcion, Sku, Precio, Stock)
    VALUES
    (@IdTecnologia, 'Teclado Mecánico', 'Teclado mecánico RGB', 'TEC-001', 250000, 15);
END

IF NOT EXISTS (SELECT 1 FROM dbo.Productos WHERE Sku = 'TEC-002')
BEGIN
    INSERT INTO dbo.Productos
    (IdCategoria, Nombre, Descripcion, Sku, Precio, Stock)
    VALUES
    (@IdTecnologia, 'Mouse Gamer', 'Mouse óptico 7200 DPI', 'TEC-002', 120000, 30);
END

IF NOT EXISTS (SELECT 1 FROM dbo.Productos WHERE Sku = 'HOG-001')
BEGIN
    INSERT INTO dbo.Productos
    (IdCategoria, Nombre, Descripcion, Sku, Precio, Stock)
    VALUES
    (@IdHogar, 'Silla Ergonómica', 'Silla con soporte lumbar', 'HOG-001', 800000, 5);
END

IF NOT EXISTS (SELECT 1 FROM dbo.Productos WHERE Sku = 'OFI-001')
BEGIN
    INSERT INTO dbo.Productos
    (IdCategoria, Nombre, Descripcion, Sku, Precio, Stock)
    VALUES
    (@IdOficina, 'Escritorio Ejecutivo', 'Escritorio de madera', 'OFI-001', 1200000, 3);
END

IF NOT EXISTS (SELECT 1 FROM dbo.Productos WHERE Sku = 'OFI-002')
BEGIN
    INSERT INTO dbo.Productos
    (IdCategoria, Nombre, Descripcion, Sku, Precio, Stock)
    VALUES
    (@IdOficina, 'Archivador Metálico', 'Archivador de 4 cajones', 'OFI-002', 450000, 8);
END

GO