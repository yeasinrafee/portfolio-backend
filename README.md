# Portfolio Backend

A fully dynamic, production-ready backend for a personal portfolio website with an admin dashboard — built with Nest.js, Prisma, and PostgreSQL.

Manages projects, blog posts (with a rich-text editor), skills, experience, education, testimonials, technologies, comments & reactions from visitors, contact form submissions, file uploads, and site-wide analytics — all through a single well-documented REST API.

---

## ✨ Features

- **Auth** — JWT access + refresh tokens, bcrypt password hashing, role-based access (`ADMIN` / `USER`), password reset via email
- **Content management** — Projects (with an ordered image gallery), Blog (rich-text HTML, sanitized, syntax-highlighted code blocks, auto reading-time), Skills, Experience, Education, Technologies, Testimonials
- **Visitor engagement** — Comments (with moderation) and Like/Dislike reactions on projects & blog posts, scoped to authenticated users
- **Contact** — Public contact form with an admin inbox (read/unread, IP capture)
- **Search & filtering** — PostgreSQL native full-text search (relevance-ranked) on projects and blog posts, plus tag filters and sort presets (latest/oldest/popular)
- **SEO** — Per-page meta tags (title/description/keywords/OG image/canonical URL), a sitemap data endpoint, and a real RSS feed
- **File uploads** — Cloudinary integration for images and documents (PDF/DOC/DOCX)
- **Dashboard analytics** — A single endpoint aggregating content counts, view stats, top content, and recent activity
- **Profile** — A singleton module for personal info, bio, contact details, and social links (hero section / contact page)
- **Security** — Helmet, CORS whitelist, rate limiting (with stricter limits on auth endpoints), global input validation, sanitized error responses (no internal detail leakage), HTML sanitization on rich-text content
- **Docs** — Full interactive Swagger/OpenAPI documentation

---

## 🛠 Tech Stack

| Category            | Technology                             |
| ------------------- | -------------------------------------- |
| Runtime / Framework | Node.js, Nest.js (TypeScript)          |
| Database            | PostgreSQL                             |
| ORM                 | Prisma v7                              |
| Auth                | JWT, bcrypt                            |
| File storage        | Cloudinary                             |
| Email               | Nodemailer (SMTP)                      |
| Rate limiting       | `@nestjs/throttler`                    |
| Validation          | `class-validator`, `class-transformer` |
| API Docs            | Swagger (`@nestjs/swagger`)            |

---

## 📋 Prerequisites

- Node.js (v20+ recommended)
- PostgreSQL (running locally or a hosted instance)
- A Cloudinary account (free tier is fine)
- An SMTP provider for sending password-reset emails (e.g. [Mailtrap](https://mailtrap.io) for development, [Resend](https://resend.com)/SendGrid for production)

---

## 🚀 Getting Started

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd portfolio-backend
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

See [Environment Variables](#-environment-variables) below for what each value means.

### 3. Set up the database

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Seed the first admin account

```bash
npx prisma db seed
```

This creates an admin user using `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from your `.env` (defaults to `admin@example.com` / `ChangeMe123!` if not set — **change the password immediately after first login**).

### 5. Run the app

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api/v1`, and interactive Swagger docs at `http://localhost:3000/api/docs`.

---

## 🔑 Environment Variables

| Variable                                              | Description                                                                |
| ----------------------------------------------------- | -------------------------------------------------------------------------- |
| `PORT`                                                | Port the server listens on (default `3000`)                                |
| `NODE_ENV`                                            | `development` / `production`                                               |
| `DATABASE_URL`                                        | PostgreSQL connection string                                               |
| `JWT_ACCESS_SECRET`                                   | Secret for signing access tokens                                           |
| `JWT_ACCESS_EXPIRES_IN`                               | Access token lifetime (e.g. `15m`)                                         |
| `JWT_REFRESH_SECRET`                                  | Secret for signing refresh tokens                                          |
| `JWT_REFRESH_EXPIRES_IN`                              | Refresh token lifetime (e.g. `7d`)                                         |
| `CORS_ORIGIN`                                         | Comma-separated list of allowed frontend origins                           |
| `CLOUDINARY_CLOUD_NAME`                               | Cloudinary account cloud name                                              |
| `CLOUDINARY_API_KEY`                                  | Cloudinary API key                                                         |
| `CLOUDINARY_API_SECRET`                               | Cloudinary API secret                                                      |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | SMTP credentials for sending emails                                        |
| `SMTP_FROM`                                           | Sender name/address for outgoing emails                                    |
| `FRONTEND_URL`                                        | Base URL of the frontend (used to build password-reset links)              |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`            | Optional — credentials used by the seed script for the first admin account |

Generate strong secrets for the JWT values with:

```bash
openssl rand -base64 32
```

---

## 📜 Available Scripts

| Command                  | Description                       |
| ------------------------ | --------------------------------- |
| `npm run start:dev`      | Start the app in watch mode       |
| `npm run build`          | Compile TypeScript to `dist/`     |
| `npm run start:prod`     | Run the compiled build            |
| `npx prisma migrate dev` | Create/apply a database migration |
| `npx prisma generate`    | Regenerate the Prisma client      |
| `npx prisma db seed`     | Seed the first admin account      |
| `npx prisma studio`      | Open Prisma's DB GUI              |

---

## 📚 API Documentation

Full interactive API documentation (every endpoint, request/response schema, and the ability to try requests directly) is available via Swagger once the app is running:

```
http://localhost:3000/api/docs
```

---

## 📁 Project Structure

```
src/
 ├── auth/              # JWT auth, guards, strategies, password reset
 ├── users/             # User lookup/management (used internally by auth)
 ├── prisma/            # Prisma service/module (DB connection)
 ├── cloudinary/         # Cloudinary provider/service
 ├── email/             # Nodemailer email service
 ├── common/            # Shared filters, decorators, DTOs (pagination, etc.)
 ├── config/            # Centralized environment configuration
 └── modules/
      ├── projects/
      ├── technologies/
      ├── skills/
      ├── experience/
      ├── education/
      ├── blog/
      ├── comments/
      ├── reactions/
      ├── testimonials/
      ├── contact/
      ├── dashboard/
      ├── profile/
      ├── seo/
      └── uploads/
prisma/
 ├── schema.prisma
 ├── seed.ts
 └── migrations/
```

---

## 🔒 Security Notes

- Never commit `.env` — it's already covered by `.gitignore`
- Rotate `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` before deploying to production
- Change the seeded admin password immediately after first login
- All rich-text blog content is sanitized server-side before being stored

---

## 📄 License

Add your preferred license here (e.g. MIT).
