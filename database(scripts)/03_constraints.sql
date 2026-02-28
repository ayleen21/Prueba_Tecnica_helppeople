--Archivo: 03_constraints.sql


--Tabla de Productos Foreign Key: IdCategoria 

IF NOT EXISTS ( SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Productos_Categorias')
BEGIN
	ALTER TABLE Productos
	ADD CONSTRAINT FK_Productos_Categorias
	FOREIGN KEY (IdCategoria) 
	REFERENCES Categorias(IdCategoria);
END
GO

--UNIQUE: Nombre de Categoria Unico

IF NOT EXISTS(SELECT 1 FROM sys.key_constraints WHERE name = 'UQ_Categorias_Nombre')
BEGIN
	ALTER TABLE Categorias
	ADD CONSTRAINT UQ_Categorias_Nombre
	UNIQUE (Nombre);
END
GO

--UNIQUE: SKU de Producto Unico

IF NOT EXISTS (SELECT 1 FROM sys.key_constraints WHERE name = 'UQ_Productos_Sku')
BEGIN
	ALTER TABLE Productos
	ADD CONSTRAINT UQ_Productos_Sku
	UNIQUE (Sku);
END
GO

--CHECK: El precio del producto debe ser mayor a 0

IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CHK_Productos_Precio')
BEGIN
	ALTER TABLE Productos
	ADD CONSTRAINT CHK_Productos_Precio
	CHECK (Precio > 0);
END
GO

--CHECK: El stock del producto no puede ser negativo
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CHK_Productos_Stock')
BEGIN
	ALTER TABLE Productos
	ADD CONSTRAINT CHK_Productos_Stock
	CHECK (Stock >= 0);
END
GO

--CHECK: El nombre de la categoria no puede estar vacio

IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Categorias_Nombre_NotEmpty')
BEGIN
	ALTER TABLE Categorias
	ADD CONSTRAINT CK_Categorias_Nombre_NotEmpty
	  CHECK (TRIM(Nombre) <> '');
END
GO

--CHECK: El nombre del producto no puede estar vacio

IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Productos_Nombre_NotEmpty')
BEGIN
	ALTER TABLE Productos
	ADD CONSTRAINT CK_Productos_Nombre_NotEmpty
	CHECK (TRIM(Nombre) <> '');
END
GO

--CHECK: SKU no puede estar vacio

IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Productos_Sku_NotEmpty')
BEGIN
	ALTER TABLE Productos
	ADD CONSTRAINT CK_Productos_Sku_NotEmpty
	 CHECK (TRIM(Sku) <> '');
END
GO