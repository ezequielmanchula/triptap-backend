# API service for TripTap

Esta carpeta contiene la API (NestJS) del proyecto. Usa Prisma para conectarse a la DB.

Para instalar dependencias y arrancar:

```bash
# desde api/
pnpm install
pnpm run start:dev
```

Ajustes:
- Asegúrate de que `DATABASE_URL` apunte a la DB levantada (p. ej. `postgres://postgres:123456@localhost:5432/db`).
- Las migraciones están en `../prisma/migrations` (si decides mantenerlas centralizadas).
