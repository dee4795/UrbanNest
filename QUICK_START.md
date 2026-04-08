# ⚡ Quick Start - Run UrbanNest in Ubuntu

## The Fastest Way (3 Steps)

### Terminal 1: Start PostgreSQL & Backend
```bash
sudo systemctl start postgresql
cd /home/dee/Urban/UrbanNest/server
npm start
```
✅ Backend runs on http://localhost:3000

### Terminal 2: Start Frontend
```bash
cd /home/dee/Urban/UrbanNest
npm start
```
✅ Frontend opens on http://localhost:4200

**Done!** 🎉 The app is running!

---

## Test Accounts (in USER_CREDENTIALS.csv)

First 5 accounts (Indian users):
```
user1@urbannest.com - Raj Kulkarni - [see CSV for password]
user2@urbannest.com - Rahul Verma
user3@urbannest.com - Abhay Patel
user4@urbannest.com - Anita Sharma
user5@urbannest.com - Diksha Patel
```

Last 5 accounts (US users):
```
user154@urbannest.com - Diane Carter
user155@urbannest.com - Brian Roberts
user156@urbannest.com - Kathleen Phillips
user157@urbannest.com - George Campbell
user158@urbannest.com - Judith Parker
```

---

## Full Setup (if needed)

See **SETUP_INSTRUCTIONS.md** for:
- Complete installation steps
- Database commands
- Troubleshooting
- Project structure details

---

## Stop Everything

```bash
# Press Ctrl+C in both Terminal 1 and Terminal 2
# Then stop PostgreSQL:
sudo systemctl stop postgresql
```

