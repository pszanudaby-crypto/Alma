# Alma Backend

Backend replaces direct Supabase calls with a Node.js API and PostgreSQL.

## Local run

```bash
cp .env.example .env
npm run migrate
npm run dev:full
```

Required server variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `CORS_ORIGIN`
- `PUBLIC_APP_URL`
- `MEDIA_DIR`
- `ADMIN_EMAILS`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

The first registered user becomes `admin` automatically.
If `ADMIN_EMAILS` and `ADMIN_PASSWORD` are set, migrations create/update the admin user.
