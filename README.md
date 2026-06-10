# Order Web

A restaurant order management web application built with Next.js, Supabase, and Tailwind CSS. The project includes admin and staff interfaces for managing bills, tables, menu items, staff users, and restaurant performance data.

## Key Features

- Admin dashboard with real-time restaurant metrics
- Bill management and order summaries
- Table management with QR code generation
- Menu item creation and updates
- Role-based authentication using Supabase
- Supabase server-side APIs for secure data access

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Supabase (`@supabase/supabase-js`, `@supabase/auth-helpers-nextjs`)
- Lucide icons
- Recharts
- Radix UI primitives

## Project Structure

- `src/app/` - application pages and UI routes
- `src/app/api/` - server route handlers for bills, orders, tables, admin, dashboard, and upload
- `src/components/` - reusable UI components and auth pages
- `src/controllers/` - request controllers for API logic
- `src/models/` - Supabase database queries and business logic
- `src/utils/` - helper utilities and authenticated fetch wrapper
- `src/lib/` - authentication helpers and role checks

## Environment Variables

Create a `.env.local` file at the project root and add the following values:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_APP_URL=your-URL
```

> `SUPABASE_SERVICE_ROLE_KEY` is required for server-side Supabase operations in `src/api/adminClient.js`.

## Run Locally

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Build and Start

```bash
npm run build
npm run start
```

## Notes

- The admin hero page fetches stats from `/api/admin/stats` and requires a valid Supabase auth session.
- API routes under `src/app/api` use role-based access checks via `requireRole`.
- If you see sample stats on the admin page, make sure the user is signed in and the auth token is available.

## Troubleshooting

- Confirm valid Supabase credentials in `.env.local`
- Confirm admin/staff user exists in the Supabase `staff` table
- Restart the development server after changing environment variables

## License

This project is provided as-is.
