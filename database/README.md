# Database service for TripTap

Esta carpeta contiene la configuración de la base de datos y el esquema Prisma.

Incluye:
- `prisma/schema.prisma` (modelo y datasource)
- `docker-compose.yml` con servicios `db` (Postgres) y `pgadmin`.
- `postgres/` y `pgadmin/` (volúmenes locales para persistencia).

Notas:
- Las migraciones están en `database/prisma/migrations` (copiadas desde el proyecto original).
- Para levantar la BD localmente: desde `database/` ejecutar `docker compose up -d`.

Despliegue en Neon (recomendado):

1. Crea un proyecto en Neon y copia la connection string (DATABASE_URL).
2. Desde la carpeta `database/` aplica las migraciones con:

```bash
# Exporta la variable de entorno (ejemplo):
export DATABASE_URL="postgres://user:pass@host:5432/dbname"
./apply_migrations.sh
```

Esto generará el cliente Prisma y aplicará las migraciones en la base de Neon.

Nota: Neon administra credenciales y acceso; asegúrate de permitir conexiones desde la IP de despliegue o usar el túnel que ofrece Neon.
