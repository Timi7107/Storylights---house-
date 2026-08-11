# StoryLights House

A full-stack starter for a public story-reading and paid writer-publishing platform.

## Features

- Public homepage and story discovery
- Romance, War, Thriller and Fictional categories
- Reader story pages
- Writer registration/login
- Writer dashboard
- Story submission form
- Paystack publishing fee flow
- Payment verification and webhook handling
- Admin route for users with `role = admin`
- SQLite database
- Owner details for Olayinka Timilehin

## Run locally

1. Install Node.js 18+.
2. Copy `.env.example` to `.env.local`.
3. Add your Paystack test secret/public keys.
4. Run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The database is created automatically in `data/storylights.db`.

## Payment flow

A writer submits a story. The server creates the story as `pending_payment`, initializes Paystack, and redirects the writer to Paystack. After payment, the callback verifies the transaction and publishes the story. A webhook is also included as a second confirmation path.

Before production, configure the Paystack webhook URL as:

`https://YOUR-DOMAIN.com/api/payments/webhook`

Do not put the Paystack secret key in frontend code.

## Making yourself admin

After registering your account, open the SQLite database and run:

```sql
UPDATE users SET role='admin' WHERE email='ogunniyaolayinka@gmail.com';
```

For a production deployment, move the database to a persistent managed database and use secure authentication/session infrastructure.
