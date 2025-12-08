# Amapola Frontend

Frontend React para el sistema Amapola.

## Configuración con Docker

Este proyecto está configurado para ejecutarse con Docker Compose junto con el backend y la base de datos.

### Requisitos

- Docker
- Docker Compose

### Ejecutar con Docker

Desde el directorio del backend (donde está el docker-compose.yml):

```bash
docker-compose up
```

Esto levantará:
- PostgreSQL en el puerto 5432
- Backend API en el puerto 3001
- Frontend en el puerto 3000

### Desarrollo local (sin Docker)

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

3. Ejecutar:
```bash
npm run dev
```

## Estructura del Proyecto

```
.
├── src/
│   ├── App.jsx       # Componente principal
│   ├── App.css       # Estilos del componente principal
│   ├── main.jsx      # Punto de entrada
│   └── index.css     # Estilos globales
├── index.html        # HTML principal
├── package.json      # Dependencias del proyecto
├── vite.config.js    # Configuración de Vite
└── Dockerfile        # Configuración Docker
```

