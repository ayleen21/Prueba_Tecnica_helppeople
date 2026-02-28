
# Catálogo de Productos - Prueba Técnica
---
**Nota:** Este proyecto usa React + Vite para el frontend. La estructura base fue generada con la plantilla oficial de Vite, luego personalizada para la prueba técnica. Para detalles sobre Vite y React consulta la [documentación oficial de Vite](https://vitejs.dev/guide/).


Este proyecto es una solución completa para la gestión de un catálogo de productos y categorías, cumpliendo con los requisitos de la prueba técnica. Incluye backend (.NET), frontend (React) y scripts para la base de datos SQL Server.

## Tabla de Contenidos
1. [Requisitos](#requisitos)
2. [Tecnologías utilizadas](#tecnologías-utilizadas)
3. [Ejecución del proyecto](#ejecución-del-proyecto)
4. [Ejemplo de uso: carga masiva](#ejemplo-de-uso-carga-masiva)
5. [Principales endpoints de la API](#principales-endpoints-de-la-api)
6. [Variables de entorno](#variables-de-entorno)

## Requisitos

### Generales
- Sistema operativo: Windows, Linux o MacOS
- Acceso a internet para instalar dependencias

### Backend
- .NET 8 SDK o superior ([descargar aquí](https://dotnet.microsoft.com/download))
- SQL Server (puede ser una instancia local, en red o en Docker)

### Frontend
- Node.js 18 o superior ([descargar aquí](https://nodejs.org/))
- npm (incluido con Node.js)

### Herramientas recomendadas
- Visual Studio Code o cualquier editor de tu preferencia
- Postman o similar para probar la API

## Tecnologías utilizadas

- **Backend:**
	- ASP.NET Core Web API
	- Entity Framework Core
	- C# 10
	- SQL Server

- **Frontend:**
	- React 18
	- Vite
	- Ant Design
	- Axios
	- JavaScript (ES6+)

- **Otros:**
	- Scripts SQL para creación y seed de base de datos
	- Control de versiones con Git

## Ejecución del proyecto

### Backend

1. Ve a la carpeta del backend:
   ```bash
   cd backend/Catalogo.Api
   ```
2. Restaura los paquetes y compila:
   ```bash
   dotnet restore
   dotnet build
   ```
3. Ejecuta la API:
   ```bash
   dotnet run
   ```
4. La API estará disponible en `https://localhost:5001` o el puerto configurado.

### Frontend

1. Ve a la carpeta del frontend:
   ```bash
   cd frontend/catalogo-frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la app:
   ```bash
   npm run dev
   ```
4. El frontend estará disponible en `http://localhost:5173` (o el puerto que indique Vite).

### Base de datos

1. Asegúrate de tener SQL Server corriendo.
2. Entra a tu gestor de SQL Server (SSMS, Azure Data Studio, etc).
3. Ejecuta los scripts en el orden:
   - `database(scripts)/01_create_database.sql`
   - `database(scripts)/02_create_tables.sql`
   - `database(scripts)/03_constraints.sql`
   - `database(scripts)/04_indexes.sql`
   - `database(scripts)/05_seed.sql`
4. Verifica que la base y las tablas se hayan creado correctamente.

## Ejemplo de uso: carga masiva

Para cargar productos de forma masiva, utiliza el endpoint:

- **POST** `/api/productos/carga-masiva-csv`
  - Formato: `multipart/form-data` con el archivo CSV en el campo `archivo`.
  - Ejemplo de plantilla CSV:

    ```csv
    Nombre,Descripcion,Sku,Precio,Stock,IdCategoria,Activo
    Producto 1,Descripción del producto 1,SKU001,100.50,10,1,true
    Producto 2,Descripción del producto 2,SKU002,200.00,5,2,true
    ```
  - Respuesta:
    ```json
    {
      "creados": 2,
      "errores": 0,
      "erroresDetalle": []
    }
    ```

## Principales endpoints de la API

- **GET** `/api/productos` — Listar productos (con filtros, paginación y ordenamiento)
- **GET** `/api/productos/{id}` — Obtener detalle de un producto
- **POST** `/api/productos` — Crear producto
- **PUT** `/api/productos/{id}` — Editar producto
- **DELETE** `/api/productos/{id}` — Eliminar producto
- **POST** `/api/productos/carga-masiva-csv` — Carga masiva de productos vía CSV

- **GET** `/api/categorias` — Listar categorías
- **POST** `/api/categorias` — Crear categoría
- **PUT** `/api/categorias/{id}` — Editar categoría
- **DELETE** `/api/categorias/{id}` — Eliminar categoría

## Variables de entorno

### Backend

Configura la cadena de conexión en `backend/Catalogo.Api/appsettings.Development.json`:

```json
  "ConnectionStrings": {
	 "DefaultConnection": "Server=localhost;Database=CatalogoDb;User Id=usuario;Password=tu_password;TrustServerCertificate=True;"
  }
```
Ajusta usuario, password y servidor según tu entorno.

### Frontend

Si necesitas cambiar la URL de la API, edita el archivo `frontend/catalogo-frontend/src/api/axiosClient.js`:

```js
const API_URL = 'https://localhost:5001/api';
```

