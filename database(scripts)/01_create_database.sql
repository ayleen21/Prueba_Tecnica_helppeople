--Archivo: 01_create_database.sql

IF DB_ID('CatalogoProductosBD') IS NULL
BEGIN
    CREATE DATABASE CatalogoProductosBD;
END
GO

USE CatalogoProductosBD;
GO