--Archivo: 01_create_database.sql

IF DB_ID('CatalogoProductosDB') IS NULL
BEGIN
    CREATE DATABASE CatalogoProductosDB;
END
GO

USE CatalogoProductosDB;
GO