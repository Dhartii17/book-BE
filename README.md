# Book Management API

REST API for a role-based book library built with Node.js, Express, TypeScript, MongoDB/Mongoose, JWT, bcryptjs, Zod, Helmet, CORS, and express-rate-limit.

## Roles and permissions

- **Public visitor:** can list/search books and view a book's details.
- **Registered user:** can register/sign in, add books, update/delete only books they created.
- **Admin:** can list/search/read books, update/delete any book, and view the registered-user list.
- Public registration always creates a `user` role. It cannot assign an admin role.

## Setup

Requirements: Node.js 18+, npm, and MongoDB.

1. Open a terminal in this backend project directory.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set a strong `JWT_SECRET` and your MongoDB URI.
4. Start MongoDB.
5. Run `npm run dev`.

The API defaults to `http://localhost:4000/api`.

## Create the first admin

Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and optionally `ADMIN_NAME` in `.env`, then run:

```bash
npm run seed
```

The seed script creates the admin only if the email does not already exist. Change the example password before use. Do not use seeded credentials in production.

## Main endpoints

### Auth
- `POST /api/auth/register` — `{ name, email, password }`; password must be at least 8 characters.
- `POST /api/auth/login` — `{ email, password }`.
- `GET /api/auth/me` — authenticated user.

### Books
- `GET /api/books?page=1&limit=10&search=...` — public list/search and pagination.
- `GET /api/books/:id` — public details.
- `POST /api/books` — authenticated; creates a book owned by the current user.
- `PATCH /api/books/:id` — owner or admin.
- `DELETE /api/books/:id` — owner or admin.

### Users
- `GET /api/users?page=1&limit=10&search=...` — admin only.

All protected endpoints require `Authorization: Bearer <token>`.
