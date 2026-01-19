# Project Billing & Time Tracking System

A full-stack Next.js application for managing projects, tracking employee time, and calculating billing summaries. Designed with role-based access control (RBAC), robust security, and a modern UI.

## 🚀 Features

### Core Functionality

- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full access to all projects, time logs, and billing summaries. Can manage projects and users.
  - **Employee**: Can view assigned projects and log time. Restricted from seeing sensitive billing rates and administrative controls.
- **Project Management**: Create, update, archive, and view details of projects.
- **Time Tracking**:
  - Kanban-style board for time log management (Todo, In Progress, Done).
  - Drag-and-drop status updates.
  - Strict validation on hours (daily limits, positive values).
- **Billing Intelligence**: Automatic calculation of billable hours and total cost based on project rates.

### Technical & Security Highlights

- **Security**:
  - API Rate Limiting (Brute force protection).
  - Input Sanitization & SQL Injection prevention.
  - Secure Security Headers (Helmet-style).
  - Request Size Limiting.
- **Performance**:
  - Infinite scroll pagination for time logs.
  - Optimistic UI updates for better responsiveness.
- **Architecture**:
  - Next.js 14/15 App Router.
  - Prisma ORM with PostgreSQL.
  - Tailwind CSS + Shadcn UI components.
  - React Query for state management.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS, Lucide Icons, React Hook Form, Zod.
- **Backend**: Next.js API Routes (Serverless), Prisma ORM.
- **Database**: PostgreSQL.
- **Tools**: TypeScript, ESLint, Prettier.

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL Database
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd project-billing-trackor-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment**
   Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your database credentials and secret keys.

4. **Database Setup**
   Run migrations and seed the database with initial data (Admin and Employee accounts).

   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🔑 Default Accounts

The seed script creates the following accounts for testing:

| Role         | Email                       | Password       |
| ------------ | --------------------------- | -------------- |
| **Admin**    | `admin@billingtrack.com`    | `Admin@123`    |
| **Employee** | `employee@billingtrack.com` | `Employee@123` |

> **Note**: You can use the "Quick Login" buttons on the login page to instantly sign in with these accounts.

## 🧪 Running Tests & Build

To verify the application build for production:

```bash
npm run build
npm start
```

## 🔒 Security

This application implements several security layers:

- **Rate Limiting**: Protects auth and API endpoints from abuse.
- **CORS**: Configured in `src/lib/security.ts`.
- **Validation**: Zod schemas ensure data integrity on client and server.

## 📄 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed endpoint information.
