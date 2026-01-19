# 🚀 Deployment Fix: Setting up a Cloud Database

## ❌ The Problem

You are using `localhost` in your `DATABASE_URL`.

```bash
postgresql://postgres:...@localhost:5432/...
```

**This works on your computer, but NOT on Vercel.**
When code runs on Vercel, `localhost` refers to the Vercel server, which does not have your database. Your database needs to be on the internet.

## ✅ The Solution

You need a **Cloud PostgreSQL Database**.

### Step 1: Get a Free Cloud Database (Neon.tech)

1.  Go to [Neon.tech](https://neon.tech) and Sign Up.
2.  Create a **New Project**.
3.  **IMPORTANT:** For running migrations, you need the **Direct Connection**.
    - In the Neon Dashboard -> **Connection Details**, UNCHECK "Pooled connection".
    - Copy _this_ connection string (it should NOT have `-pooler` in the host).
    - Example: `postgres://alex:AbCd...@ep-cool-cloud.us-east-1.aws.neon.tech/neondb?sslmode=require`

### Step 2: Push Your Schema (Migrate)

You need to create the tables in your new Cloud Database.

1.  Open your local terminal.
2.  Run this command (replace with YOUR **Direct** Neon URL):

    ```bash
    # Update your local .env temporarily or pass the var inline
    DATABASE_URL="postgres://alex:AbC...@ep-cool-cloud..." npx prisma migrate dev --name init
    ```

    - **Note**: Using `migrate dev` creates the initial migration files and applies them.
    - **Seed**: This will also automatically run the seed script to create Admin/Employee accounts.

### Step 3: Configure Vercel

1.  Go to your project on **Vercel** -> **Settings** -> **Environment Variables**.
2.  Add/Edit `DATABASE_URL`.
    - **Tip**: For the running app (Vercel), you _can_ use the **Pooled** connection string (Host has `-pooler`) for better performance, but the Direct one works too.
3.  Make sure you also have:
    - `JWT_SECRET`: (Any long random string)
    - `ALLOWED_ORIGINS`: Your Vercel URL (e.g., `https://your-project.vercel.app`) - **No trailing slash**.

### Step 4: Redeploy

1.  Go to Vercel -> **Deployments**.
2.  Click the three dots `...` on the failed/latest deployment -> **Redeploy**.

## 💡 Troubleshooting

### "P1017: Server has closed the connection"

- **Cause**: You are using a **Pooled** connection string for a migration command.
- **Fix**: Use the **Direct** connection string (uncheck "Pooled" in Neon dashboard) when running `npx prisma migrate ...`.

### "No migration found"

- **Cause**: Use `npx prisma migrate dev --name init` instead of `deploy` for the first time.

### "Network Error" on Frontend

- **Cause**: Backend API calls failing due to CORS.
- **Fix**: Ensure `ALLOWED_ORIGINS` in Vercel Env Vars matches your browser URL exactly.
