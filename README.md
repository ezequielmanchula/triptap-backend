# TripTap Backend

Este proyecto ha sido dividido en dos partes para mejor mantenimiento y despliegue:

## Estructura

```
triptap-backend/
├── api/             # API NestJS (para deploy en Render)
│   ├── src/         # Código fuente
│   ├── prisma/      # Cliente Prisma para la API
│   └── README.md    # Instrucciones específicas de la API
│
├── database/        # Gestión de base de datos (para Neon)
│   ├── prisma/      # Schema y migraciones
│   │   └── migrations/  # Migraciones SQL
│   ├── postgres/    # Volumen para DB local
│   ├── pgadmin/     # Volumen para pgAdmin
│   └── README.md    # Instrucciones de DB
│
├── README.md        # Este archivo
├── .gitignore
└── render.yaml      # Configuración de deploy
```

## Inicio rápido

### Base de datos (Neon)

```bash
cd database
# Configura DATABASE_URL con tu URL de Neon
./apply_migrations.sh
```

### API (Render)

La API se despliega automáticamente en Render usando `render.yaml`. 
Variables requeridas en Render:
- DATABASE_URL (de Neon)
- JWT_SECRET
- NODE_ENV=production
- CORS_ORIGIN

### Desarrollo local

1. Levanta la base de datos:
```bash
cd database
docker compose up -d
```

2. En otra terminal, inicia la API:
```bash
cd api
pnpm install
cp .env.example .env
# configura DATABASE_URL en .env
pnpm run start:dev
```

Ver README en cada carpeta para más detalles.
