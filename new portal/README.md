# The Daily Pulse — Full-Stack News Portal

A MERN-stack news portal: **React (Vite) + Tailwind CSS + Zustand** on the frontend,
**Node.js + Express + MongoDB (Mongoose)** on the backend, with JWT authentication.

## Features
- Home page with 5 sections: Top 6 stories (API), category browser, latest news grid (API), publish CTA, newsletter signup
- News page — all articles, with category filter, search, and pagination (API)
- Single news details page with view counter (API)
- Login & Register with JWT auth (API)
- Logged-in users can publish their own news (API)
- Dashboard / Profile page — update name, bio, avatar, password (API)
- Users can edit/delete their own articles from the Dashboard (API)
- Contact Us page
- Responsive Header & Footer

## Project structure
```
news-portal/
  backend/     # Express + MongoDB API
  frontend/    # React + Vite + Tailwind + Zustand
```

## 1. Run locally

### Backend
```bash
cd backend
cp .env.example .env      # then fill in MONGO_URI and JWT_SECRET
npm install
npm run dev                # http://localhost:5000
```
Get a free MongoDB URI from https://www.mongodb.com/cloud/atlas (Atlas free tier).

### Frontend
```bash
cd frontend
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                 # http://localhost:5173
```

## 2. Push to GitHub
```bash
cd news-portal
git init
git add .
git commit -m "Initial commit: full-stack news portal"
git branch -M main
git remote add origin https://github.com/<your-username>/news-portal.git
git push -u origin main
```
(Create the empty repo on GitHub first, then run the above from this folder.)

## 3. Deploy

### Backend → Render
1. New "Web Service" on https://render.com, connect your GitHub repo, root directory `backend`.
2. Build command: `npm install`  |  Start command: `npm start`
3. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT` (Render sets PORT automatically, but keep the fallback).
4. Deploy — note the live URL, e.g. `https://news-portal-api.onrender.com`.

### Frontend → Vercel
1. New Project on https://vercel.com, import the same repo, root directory `frontend`.
2. Framework preset: Vite. Build command: `npm run build`. Output dir: `dist`.
3. Add environment variable `VITE_API_URL` = `https://news-portal-api.onrender.com/api`.
4. Deploy — Vercel gives you the live frontend URL.

### CORS note
In `backend/server.js`, `cors()` currently allows all origins for simplicity. For production
you can restrict it to your Vercel domain:
```js
app.use(cors({ origin: process.env.CLIENT_URL }));
```
and set `CLIENT_URL` in Render to your Vercel URL.

## API Reference (brief)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Register a new user |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/auth/me | Yes | Get current user |
| GET | /api/news | No | All news (query: category, search, page, limit) |
| GET | /api/news/top | No | Top 6 news for homepage |
| GET | /api/news/:id | No | Single news (increments views) |
| GET | /api/news/user/mine | Yes | Logged-in user's own news |
| POST | /api/news | Yes | Create news |
| PUT | /api/news/:id | Yes (owner) | Update news |
| DELETE | /api/news/:id | Yes (owner) | Delete news |
| PUT | /api/users/profile | Yes | Update profile |

## Tech stack
- Frontend: React 18, React Router, Zustand, Tailwind CSS, Axios, Vite
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
