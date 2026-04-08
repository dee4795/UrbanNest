# UrbanNest

UrbanNest now uses a PostgreSQL-backed API for:
- user registration/login
- creating property listings
- fetching listings for search

## Project structure

- Frontend (Angular): `/`
- Backend API (Express + Prisma): `/server`
- Database: PostgreSQL

## 1) Install PostgreSQL (choose one)

### Option A: Docker (recommended if you already have Docker)

```bash
docker compose up -d db
```

This uses `docker-compose.yml` and creates:
- database: `urbannest`
- username: `postgres`
- password: `postgres`
- port: `5432`
- version: PostgreSQL 18

### Option B: Native Ubuntu install

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql
```

Create DB user/database:

```bash
sudo -u postgres psql -c "CREATE USER urbannest WITH PASSWORD 'urbannest';"
sudo -u postgres psql -c "CREATE DATABASE urbannest OWNER urbannest;"
```

## 2) Configure backend env

```bash
cd server
cp .env.example .env
```

Default `.env`:

```env
DATABASE_URL="postgresql://urbannest:urbannest@localhost:5432/urbannest?schema=public"
JWT_SECRET="change-this-in-production"
PORT=3000
```

## 3) Install dependencies

Frontend:

```bash
npm install
```

Backend:

```bash
cd server
npm install
```

## 4) Create tables (Prisma migration)

```bash
cd server
npm run prisma:migrate -- --name init
npm run prisma:seed
```

## 5) Run the app

Terminal 1 (backend):

```bash
npm run start:api
```

Terminal 2 (frontend):

```bash
npm start
```

Open: `http://localhost:4200`

The Angular app proxies `/api/*` to `http://localhost:3000` using `proxy.conf.json`.

## API endpoints added

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/listings`
- `POST /api/listings` (requires Bearer token)
- `GET /api/health`

## 📸 Property Images Feature

### Image Storage Architecture
UrbanNest uses **image URLs** instead of storing binary files in the database. This approach:
- ✅ Keeps database lean and performant
- ✅ Supports external image hosting
- ✅ Allows for flexible image management
- ✅ Works seamlessly with any CDN or file storage

### Two Ways to Add Images

**Option 1: Upload from Device**
- Select multiple images from your computer
- Images are converted to base64 data URLs
- Perfect for quick uploads without external hosting

**Option 2: Provide Image URL**
- Paste direct image URLs (HTTPS)
- Ideal for images already hosted on CDN/cloud storage
- Supports: Unsplash, Imgur, AWS S3, Google Cloud Storage, etc.

### Image Validation
- Accepts HTTP/HTTPS URLs
- Accepts Base64 data URLs
- Validates all URLs before saving to database
- Maximum of multiple images per listing

### Example Usage (API)
```json
{
  "title": "Beautiful Apartment",
  "imageDataUrls": [
    "https://images.unsplash.com/photo-1...?w=500",
    "https://example-cdn.com/apartment.jpg",
    "data:image/jpeg;base64,/9j/4AAQSkZJR..."
  ]
}
```

## Notes

- Existing browser `localStorage` users/listings are no longer used.
- New login/listing data is stored in PostgreSQL.
- Images are stored as URL strings in the database - no file storage required
- For production, set a strong `JWT_SECRET` and secure CORS/origins.
# UrbanNest
