=======================================================
  CATÁLOGO DIGITAL MULTI-RUBRO — MAPA DE PROYECTO
=======================================================
Stack: Laravel (backend API) + React (frontend SPA)
Patrón: MVC
Base de datos: MySQL

-------------------------------------------------------
BACKEND  (Laravel)
-------------------------------------------------------

backend/
│
├── app/
│   │
│   ├── Http/
│   │   │
│   │   ├── Controllers/
│   │   │     Controladores MVC. Reciben la request HTTP,
│   │   │     llaman al Service o Model correspondiente
│   │   │     y devuelven una respuesta JSON.
│   │   │     Archivos esperados:
│   │   │       - ProductoController.php   (CRUD productos)
│   │   │       - RubroController.php      (listar rubros/subrubros)
│   │   │       - CatalogoController.php   (generar PDF)
│   │   │       - ConsultaController.php   (enviar mail)
│   │   │
│   │   ├── Requests/
│   │   │     Clases de validación. Definen las reglas que
│   │   │     deben cumplir los datos antes de llegar al Controller.
│   │   │     Archivos esperados:
│   │   │       - StoreProductoRequest.php
│   │   │       - ConsultaRequest.php
│   │   │
│   │   └── Resources/
│   │         Transforman los modelos Eloquent en JSON limpio
│   │         para la API. Controlan qué campos se exponen.
│   │         Archivos esperados:
│   │           - ProductoResource.php
│   │           - ProductoCollection.php
│   │
│   ├── Models/
│   │     Modelos Eloquent (la M del MVC). Representan las
│   │     tablas de la base de datos y sus relaciones.
│   │     Archivos esperados:
│   │       - Producto.php   (belongsTo Rubro, Subrubro)
│   │       - Rubro.php      (hasMany Subrubro, hasMany Producto)
│   │       - Subrubro.php   (belongsTo Rubro, hasMany Producto)
│   │
│   ├── Mail/
│   │     Clases Mailable de Laravel. Definen el contenido
│   │     y destinatario del correo de consulta por producto.
│   │     Archivos esperados:
│   │       - ConsultaProductoMail.php
│   │
│   └── Services/
│         Lógica de negocio desacoplada del Controller.
│         Mantiene los Controllers delgados y el código reutilizable.
│         Archivos esperados:
│           - ProductoService.php   (manejo de imágenes, creación)
│           - PdfService.php        (generación del PDF con dompdf)
│
├── database/
│   │
│   ├── migrations/
│   │     Archivos que definen la estructura de las tablas SQL.
│   │     Se ejecutan con: php artisan migrate
│   │     Archivos esperados:
│   │       - create_rubros_table.php
│   │       - create_subrubros_table.php
│   │       - create_productos_table.php
│   │
│   └── seeders/
│         Poblan la base de datos con datos iniciales.
│         Se ejecutan con: php artisan db:seed
│         Archivos esperados:
│           - RubroSeeder.php   (carga los 4 rubros y sus subrubros)
│
├── resources/
│   └── views/
│       └── pdf/
│             Vistas Blade usadas exclusivamente para generar
│             el PDF del catálogo con dompdf.
│             Archivos esperados:
│               - catalogo.blade.php
│
├── routes/
│     Define los endpoints de la API REST.
│     Archivos esperados:
│       - api.php   (todas las rutas: productos, rubros, pdf, consulta)
│
└── storage/
    └── app/
        └── public/
            └── productos/
                  Almacena las imágenes subidas por el administrador.
                  Accesible públicamente via symlink (storage:link).

-------------------------------------------------------
FRONTEND  (React + Vite)
-------------------------------------------------------

frontend/
│
├── public/
│     Archivos estáticos servidos directamente.
│     (favicon, imágenes globales, etc.)
│
└── src/
    │
    ├── api/
    │     Configuración de Axios y funciones que hacen
    │     las llamadas HTTP a la API de Laravel.
    │     Archivos esperados:
    │       - index.js   (baseURL, interceptores, funciones fetch)
    │
    ├── components/
    │     Componentes React reutilizables (UI).
    │     Archivos esperados:
    │       - ProductoCard.jsx       (tarjeta de producto)
    │       - FiltroRubros.jsx       (selector de rubro)
    │       - FiltroSubrubros.jsx    (selector de subrubro)
    │       - FormularioProducto.jsx (formulario de carga admin)
    │       - ModalConsulta.jsx      (formulario de consulta por mail)
    │
    ├── hooks/
    │     Custom hooks de React para reutilizar lógica de estado.
    │     Archivos esperados:
    │       - useProductos.js   (fetch, filtros, estado de productos)
    │
    └── pages/
          Páginas completas que se montan según la ruta activa.
          Archivos esperados:
            - Catalogo.jsx   (vista pública con filtros y productos)
            - Admin.jsx      (panel de carga y gestión de productos)
            - NotFound.jsx   (página 404)

-------------------------------------------------------
ENDPOINTS API  (routes/api.php)
-------------------------------------------------------

GET    /api/rubros              → Lista rubros con sus subrubros
GET    /api/productos           → Lista productos (filtros: ?rubro_id= &subrubro_id=)
POST   /api/productos           → Crear producto (admin)
PUT    /api/productos/{id}      → Editar producto (admin)
DELETE /api/productos/{id}      → Eliminar producto (admin)
POST   /api/consulta            → Enviar mail de consulta
GET    /api/catalogo/pdf        → Generar y descargar PDF del catálogo

-------------------------------------------------------
BASE DE DATOS
-------------------------------------------------------

rubros        → id, nombre
subrubros     → id, rubro_id (FK), nombre
productos     → id, titulo, descripcion, precio,
                imagen_path, rubro_id (FK), subrubro_id (FK),
                created_at, updated_at

=======================================================
