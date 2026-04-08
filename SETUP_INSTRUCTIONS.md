# UrbanNest - Setup & Run Instructions for Ubuntu

## Quick Start (Run Everything)

### Prerequisites
- **PostgreSQL** installed and running
- **Node.js** v20+ installed
- **npm** installed

### Step 1: Ensure PostgreSQL is Running
```bash
sudo systemctl start postgresql
```

### Step 2: Start Backend Server (Terminal 1)
```bash
cd /home/dee/Urban/UrbanNest/server
npm start
```
Backend will run on: **http://localhost:3000**

### Step 3: Start Frontend (Terminal 2)
```bash
cd /home/dee/Urban/UrbanNest
npm start
```
Frontend will run on: **http://localhost:4200**

---

## Detailed Setup (First Time Only)

### 1. Install Dependencies

#### Frontend
```bash
cd /home/dee/Urban/UrbanNest
npm install
```

#### Backend
```bash
cd /home/dee/Urban/UrbanNest/server
npm install
```

### 2. Check Database Connection

Edit `server/.env` if needed:
```
DATABASE_URL="postgresql://urbannest:urbannest@localhost:5432/urbannest"
JWT_SECRET="your-secret-key"
NODE_ENV="development"
```

### 3. Run Prisma Migrations
```bash
cd /home/dee/Urban/UrbanNest/server
npx prisma migrate deploy
```

### 4. Seed Sample Data (158 Users + 158 Listings)
```bash
cd /home/dee/Urban/UrbanNest/server
npx tsx prisma/seed.ts
```

This creates:
- **120 Indian users** with Indian names
- **38 US users** with English names
- **120 Indian listings** with Indian contact names
- **38 US listings** with English contact names
- **Files generated:**
  - `USER_CREDENTIALS.csv` - All 158 user credentials
  - `USER_CREDENTIALS.txt` - Human-readable format

---

## Individual Service Commands

### PostgreSQL Database
```bash
# Start
sudo systemctl start postgresql

# Stop
sudo systemctl stop postgresql

# Check status
sudo systemctl status postgresql

# Connect to DB (if needed)
psql -U urbannest -d urbannest
```

### Backend Server (Port 3000)
```bash
cd /home/dee/Urban/UrbanNest/server

# Development mode (with hot reload)
npm start

# Build for production
npm run build

# Run production build
npm run start:prod
```

### Frontend (Port 4200)
```bash
cd /home/dee/Urban/UrbanNest

# Development mode (with hot reload)
npm start

# Build for production
npm run build

# Serve production build
npx http-server -c-1 -o -p 8080 -P http://localhost:3000? ./dist/urbannest/browser
```

---

## Database Management Commands

### View All Data
```bash
# List all users
curl http://localhost:3000/api/users

# List all listings
curl http://localhost:3000/api/listings

# Pagination example (10 items per page)
curl "http://localhost:3000/api/listings?page=1"
```

### Reset Database (Delete All Data)
```bash
cd /home/dee/Urban/UrbanNest/server
npx prisma migrate reset --force
```

### Re-seed with New Data
```bash
cd /home/dee/Urban/UrbanNest/server
npx prisma migrate reset --force
npx tsx prisma/seed.ts
```

---

## Troubleshooting

### Port Already in Use
If port 3000 or 4200 is already in use:
```bash
# Kill process on port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 4200
lsof -i :4200 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### PostgreSQL Connection Failed
```bash
# Ensure PostgreSQL is running
sudo systemctl start postgresql

# Check PostgrSQL status
sudo systemctl status postgresql

# Verify credentials in server/.env
cat /home/dee/Urban/UrbanNest/server/.env
```

### Clear Node Cache
```bash
# Remove node_modules and reinstall
cd /home/dee/Urban/UrbanNest
rm -rf node_modules package-lock.json
npm install

cd /home/dee/Urban/UrbanNest/server
rm -rf node_modules package-lock.json
npm install
```

---

## Project Structure

```
UrbanNest/
├── server/                      # Express.js backend
│   ├── src/
│   │   ├── index.ts            # Main server file
│   │   ├── auth.ts             # Authentication logic
│   │   ├── prisma.ts           # Database connection
│   │   └── types.ts            # TypeScript types
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   ├── seed.ts             # Generate test data
│   │   └── migrations/         # Database migrations
│   ├── package.json            # Backend dependencies
│   ├── tsconfig.json
│   └── .env                    # Database configuration
│
├── src/                         # Angular frontend
│   ├── app/
│   │   ├── pages/              # Components
│   │   ├── services/           # API services
│   │   ├── guards/             # Auth guard
│   │   ├── interceptors/       # HTTP interceptors
│   │   └── models/             # TypeScript models
│   ├── index.html
│   └── main.ts
│
├── package.json                # Frontend dependencies
├── angular.json                # Angular config
├── tsconfig.json               # TypeScript config
├── proxy.conf.json             # Dev proxy to backend
└── README.md                   # Project documentation
```

---

## User Credentials
- **CSV File:** `/home/dee/Urban/UrbanNest/USER_CREDENTIALS.csv`
- **Format:** User ID, Name, Email, Password
- **Sample Users:**
  - user1@urbannest.com - Raj Kulkarni
  - user120@urbannest.com - Last Indian user
  - user121@urbannest.com - First US user (Diane Carter)
  - user158@urbannest.com - Judith Parker

---

## Features

✅ **158 Test Users & Listings**
- 120 Indian properties with Indian names
- 38 USA properties with English names
- All mixed randomly through pagination

✅ **Search Filters**
- Search by Area (including "usa" / "india")
- Filter by Property Type (Apartment, Row House)
- Filter by Purpose (Rent, Buy)
- Filter by BHK (1-4)
- Price Range filtering

✅ **Authentication**
- User registration & login
- JWT token-based auth
- Secure password hashing

✅ **Database**
- PostgreSQL with Prisma ORM
- Automatic migrations
- Seed script with randomized data

---

## Tips

1. **Always start PostgreSQL first** before backend
2. **Use separate terminals** for backend and frontend
3. **Hard refresh browser** (Ctrl+Shift+R) after code changes
4. **Check .env file** before running backend
5. **Keep USER_CREDENTIALS.csv** safe for testing accounts

---

## Support

For issues, check:
1. PostgreSQL status: `sudo systemctl status postgresql`
2. Port availability: `lsof -i :3000` and `lsof -i :4200`
3. Dependencies installed: `npm list` in both folders
4. Environment variables: `cat server/.env`

