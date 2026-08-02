# Blog Management System — Backend API

A RESTful backend API built with **Node.js, Express, and MongoDB**, featuring **JWT + httpOnly
cookie authentication**. Registered users can create, read, update, and delete their own blog
posts. All blog routes are protected — only logged-in users with a valid JWT can access them.

## Project structure
```
blog-management-system/
  config/
    db.js                 # MongoDB connection
  models/
    User.js                # User schema (bcrypt password hashing)
    Blog.js                # Blog schema
  middleware/
    auth.js                 # protect() - verifies JWT from cookie or Bearer header
    errorHandler.js         # centralized error handling
  controllers/
    authController.js       # register, login, logout, get/update profile
    blogController.js       # blog CRUD + ownership checks
  routes/
    authRoutes.js
    blogRoutes.js
  utils/
    generateToken.js        # signs JWT, sets httpOnly cookie, returns user + token
  server.js                 # app entry point
  .env.example
  package.json
```

## How authentication works
- On register/login, the server signs a JWT and sends it two ways:
  1. As an **httpOnly cookie** named `token` (best for browser/frontend clients — not readable by JS, safer against XSS).
  2. In the **JSON response body** (`token` field — useful for Postman/mobile clients that use the `Authorization: Bearer <token>` header instead).
- The `protect` middleware checks the cookie first, then falls back to the `Authorization` header.
- Passwords are hashed with bcrypt before saving and are never returned in API responses (schema uses `select: false` on the password field).

## 1. Setup & run locally
```bash
cd blog-management-system
cp .env.example .env      # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev                 # http://localhost:5000
```
Get a free MongoDB URI from https://www.mongodb.com/cloud/atlas (Atlas free tier).

Generate a strong `JWT_SECRET`, e.g.:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 2. Push to GitHub
```bash
cd blog-management-system
git init
git add .
git commit -m "Initial commit: Blog Management System backend API"
git branch -M main
git remote add origin https://github.com/<your-username>/blog-management-system.git
git push -u origin main
```
(Create the empty repo on GitHub first, then run the above from this folder.)

## 3. Testing the API
Use Postman/Insomnia/Thunder Client.
- For cookie-based testing in Postman: enable "Automatically follow redirects" and cookies are stored automatically per Postman's cookie jar for the domain — no extra config needed.
- For header-based testing: copy the `token` from the login/register response and send it as `Authorization: Bearer <token>` on protected routes.

## API Reference

### Auth routes — base `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /register | Public | Register a new user. Body: `{ name, email, password, phoneNumber }` |
| POST | /login | Public | Login. Body: `{ email, password }`. Sets JWT cookie + returns token |
| POST | /logout | Private | Clears the auth cookie |
| GET | /profile | Private | Returns the logged-in user's profile |
| PUT | /profile | Private | Update profile. Body: any of `{ name, phoneNumber, password }` |

### Blog routes — base `/api/blogs` (ALL routes require a valid JWT)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | / | Private | Create blog. Body: `{ title, content, authorName, tags, blogImage }` |
| GET | / | Private | Get all blogs. Query: `?search=&tag=&page=&limit=` |
| GET | /:id | Private | Get a single blog by ID |
| PUT | /:id | Private (owner only) | Update a blog — only the creator can edit |
| DELETE | /:id | Private (owner only) | Delete a blog — only the creator can delete |

### Example requests

**Register**
```json
POST /api/auth/register
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "phoneNumber": "01712345678"
}
```

**Login**
```json
POST /api/auth/login
{
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Create Blog**
```json
POST /api/blogs
{
  "title": "Getting Started with Node.js",
  "content": "Node.js is a JavaScript runtime built on Chrome's V8 engine...",
  "authorName": "Jane Doe",
  "tags": ["nodejs", "backend"],
  "blogImage": "https://example.com/image.jpg"
}
```

## 4. Deploy (optional)
Deploy to **Render** or **Railway**:
1. New Web Service, connect your GitHub repo.
2. Build command: `npm install`  |  Start command: `npm start`
3. Environment variables: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `COOKIE_EXPIRE_DAYS`, `CLIENT_URL`, `NODE_ENV=production`.
4. If your frontend is on a different domain, make sure `CLIENT_URL` matches it exactly (cookies require this for cross-site requests).

## Tech stack
Node.js, Express, MongoDB, Mongoose, JWT (jsonwebtoken), bcryptjs, cookie-parser, validator, cors
