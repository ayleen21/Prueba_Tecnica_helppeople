--Archivo: 04_indexes.

-- INDEX: Productos - IdCategoria

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Productos_IdCategoria'AND object_id = OBJECT_ID('dbo.Productos'))
BEGIN
    CREATE INDEX IX_Productos_IdCategoria
    ON dbo.Productos (IdCategoria);
END
GO

-- INDEX: Productos - Nombre (Search)

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Productos_Nombre' AND object_id = OBJECT_ID('dbo.Productos'))
BEGIN
    CREATE INDEX IX_Productos_Nombre
    ON dbo.Productos (Nombre);
END
GO

-- INDEX: Productos - Precio (Rango)

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Productos_Precio'AND object_id = OBJECT_ID('dbo.Productos'))
BEGIN
    CREATE INDEX IX_Productos_Precio
    ON dbo.Productos (Precio);
END
GO

-- INDEX: Productos - Activo

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Productos_Activo' AND object_id = OBJECT_ID('dbo.Productos'))
BEGIN
    CREATE INDEX IX_Productos_Activo
    ON dbo.Productos (Activo);
END
GO

-- INDEX: Productos - FechaCreacion (ORDEN - Sort)

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Productos_FechaCreacion'AND object_id = OBJECT_ID('dbo.Productos'))
BEGIN
    CREATE INDEX IX_Productos_FechaCreacion
    ON dbo.Productos (FechaCreacion);
END
GO