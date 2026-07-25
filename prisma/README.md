# Database (MongoDB Atlas + Prisma)

The app persists contact enquiries, newsletter subscribers, appointments,
patient records (profile / visits / invoices) and portal accounts in MongoDB,
accessed through Prisma. MongoDB with Prisma requires a replica set — every
Atlas cluster is one by default, so no extra setup is needed.

## One-time setup

1. **Create a cluster** at <https://www.mongodb.com/atlas> (the free M0 tier is
   fine) and a database user.
2. **Get the connection string**: Atlas → Cluster → *Connect* → *Drivers*.
3. **Configure `.env`** (copy from `.env.example`):

   ```
   DATABASE_URL="mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/aurora_health?retryWrites=true&w=majority&appName=Cluster0"
   ```

   - **Percent-encode** special characters in the password (`@` → `%40`,
     `:` → `%3A`, `/` → `%2F`, `#` → `%23`). A literal `@` in the password
     breaks URI parsing.
   - Include a **database name** in the path (`/aurora_health`).
   - Add your IP (or `0.0.0.0/0` for dev) under Atlas → *Network Access*.

## Commands

| Command              | What it does                                              |
| -------------------- | -------------------------------------------------------- |
| `npm run db:generate`| Regenerate the Prisma client (also runs on `postinstall`)|
| `npm run db:push`    | Sync the schema + indexes to the cluster (no SQL migrations on Mongo) |
| `npm run db:seed`    | Load the demo patient, history, and a demo portal login  |
| `npm run db:studio`  | Open Prisma Studio to browse/edit data                   |

Typical first run:

```bash
npm install        # installs deps and runs prisma generate
npm run db:push    # creates collections + indexes in Atlas
npm run db:seed    # optional demo data
npm run dev
```

## Demo login (after seeding)

`jordan.ellis@example.com` / `aurora-demo-1234` — **change or remove before any
real deployment** (see `prisma/seed.ts`).

## Models

- **Contact** — `POST /api/contact`
- **NewsletterSubscriber** — `POST /api/newsletter` (upsert; unique email)
- **Appointment** — `POST /api/appointments` (guest or `mrn`-linked), `GET /api/appointments?mrn=`
- **Patient / Visit / Invoice** — portal record + history, populated by the seed
- **User** — portal accounts, `POST /api/auth/register` + `POST /api/auth/login`
  (bcrypt-hashed passwords)

## What's not included

The auth routes verify credentials and create accounts but do **not** issue a
session — no cookie or JWT is set. Add NextAuth / iron-session (or your own
session strategy) on top when you want persistent sign-in state. The portal
pages still render the seeded demo data directly; point them at
`GET /api/appointments` and the patient models when you wire the UI to live data.
