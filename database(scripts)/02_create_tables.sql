--Archivo: 02_create_tables.sql

--Tabla de Categorias
IF OBJECT_ID('dbo.Categorias', 'U') IS NULL
BEGIN
    CREATE TABLE Categorias (
        IdCategoria INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Nombre NVARCHAR(150) NOT NULL,
        Descripcion NVARCHAR(500) NULL,
        Activo BIT NOT NULL DEFAULT 1,
        FechaCreacion DATETIME2 NOT NULL DEFAULT GETDATE(),
        FechaModificacion DATETIME2 NULL
    );
END
GO


--Tabla de Productos
IF OBJECT_ID('dbo.Productos', 'U') IS NULL
BEGIN
    CREATE TABLE Productos (
        IdProducto INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        IdCategoria INT NOT NULL,
        Nombre NVARCHAR(200) NOT NULL,
        Descripcion NVARCHAR(1000) NULL,
        Sku NVARCHAR(100) NOT NULL,
        Precio DECIMAL(18,2) NOT NULL,
        Stock INT NOT NULL DEFAULT 0,
        Activo BIT NOT NULL DEFAULT 1,
        FechaCreacion DATETIME2 NOT NULL DEFAULT GETDATE(),
        FechaModificacion DATETIME2 NULL
    );
END
GO