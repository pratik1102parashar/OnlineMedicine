# OnlineMedicine

OnlineMedicine is a local-first medicine marketplace built with Nuxt 3 / Vue 3, TailwindCSS, Pinia, Nitro server routes, JSON file storage, and a clean repository-service architecture.

## Features

- OTP-based mobile authentication with JWT cookie sessions and RBAC (admin/customer)
- JSON-backed repositories inside `/storage` so the persistence layer can later be swapped for SQL/NoSQL databases
- Medicine catalog with search, filtering, pagination, discount pricing, and prescription flags
- Cart, coupon engine, COD checkout, order lifecycle handling, and inventory-safe stock decrements
- Admin dashboard for analytics, medicines, inventory, coupons, and order status changes
- Structured audit logs written to `/logs`
- OpenAPI JSON at `/api/docs/openapi` and an in-app docs page at `/docs`
- Seeded demo data for immediate local use

## Demo logins

Use OTP login with one of these numbers. OTPs are logged to the terminal in development.

- Admin: `+919900000001`
- Customer: `+919900000002`

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` – start local development server
- `npm run build` – production build
- `npm run lint` – run ESLint
- `npm run test` – run Vitest unit tests
- `npm run seed` – re-seed demo JSON storage

## Storage layout

The local data files live in `/storage`:

- `users.json`
- `medicines.json`
- `carts.json`
- `orders.json`
- `coupons.json`
- `inventory.json`
- `otp.json`

## Docker

```bash
docker build -t onlinemedicine .
docker run -p 3000:3000 onlinemedicine
```
