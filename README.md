# TripTap Backend

NestJS + PostgreSQL + Prisma setup.

## Conexión desde frontend (axios)

Ejemplo de uso con axios:

```js
import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:3000' });

// Registro
await api.post('/auth/register', {
	email: 'user@example.com',
	name: 'Juan',
	lastName: 'Perez',
	phone: 54911223344,
	password: 'miPassword123'
});

// Login
const res = await api.post('/auth/login', {
	email: 'user@example.com',
	password: 'miPassword123'
});
const token = res.data.access_token;

// Llamada protegida
await api.get('/users', {
	headers: { Authorization: `Bearer ${token}` }
});
```

### Notas importantes
- El backend espera y responde JSON.
- El header `Authorization: Bearer <token>` es necesario para rutas protegidas.
- Si tu frontend corre en otro origen/puerto, asegúrate de que CORS esté habilitado (ya configurado para `http://localhost:3001`).
- Configura `JWT_SECRET` y `DATABASE_URL` en tu entorno o `.env`.
