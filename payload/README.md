# iThaiz Payload CMS

Payload is the CMS layer for the iThaiz website. It is designed for deployment as a Next.js app on Vercel, with Vercel Postgres/Neon and Vercel Blob.

## Collections

- `users`: CMS administrators
- `categories`: menu categories
- `menu-items`: editable menu items with draft/version support
- `media`: uploaded images

Install and run locally:

```bash
cd payload
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:3000/admin` to create the first administrator.

The JSON seed data remains at `../backend/data/menu_extracted.json`. A dedicated import command will be added after the Vercel Postgres connection is provisioned, so production data is never imported without a confirmed database target.
