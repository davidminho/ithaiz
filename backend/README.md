# iThaiz CMS backend

This folder provides a local Directus + PostgreSQL CMS foundation for the static iThaiz frontend.

## Local setup

```sh
cd backend
cp .env.example .env
# Edit .env and replace every change-me / replace-me value.
docker compose up -d
```

Open the Directus admin at [http://localhost:8055](http://localhost:8055) and sign in with `DIRECTUS_ADMIN_EMAIL` and `DIRECTUS_ADMIN_PASSWORD` from `.env`.

The first database start creates `menu_categories` and `menu_items`. Directus exposes those tables in the Data Studio and through its REST/GraphQL APIs.

## Import the extracted menu

The source file is kept at `backend/data/menu_extracted.json`. Import it after Directus is ready:

```sh
DIRECTUS_URL=http://localhost:8055 \
DIRECTUS_EMAIL=admin@example.com \
DIRECTUS_PASSWORD='your-admin-password' \
MENU_IMPORT_STATUS=draft \
node scripts/import-menu.mjs
```

The importer upserts 15 categories and 103 menu items using their stable extracted IDs. Imported records default to `draft` so the client can review OCR-derived content before publishing it. Use `MENU_IMPORT_STATUS=published` only after client approval.

## Production notes

- Pin the Directus image to a tested exact version before production; the compose file currently uses the supported major tag `directus/directus:11` for local setup.
- Use strong secrets, private database networking, HTTPS, managed PostgreSQL backups, and object storage for uploads.
- Configure Directus roles so the client can edit content and media without changing the data model or permissions.
- The frontend is not connected to the API yet. The next slice should replace the static menu data with a read-only published-items endpoint and keep a static fallback.
