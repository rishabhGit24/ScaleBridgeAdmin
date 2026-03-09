# ScaleBridge Admin Portal - Quick Setup Guide

## What's Been Created

A complete admin portal in the `admin-portal` folder with:

- Login page with authentication
- Dashboard displaying all contact submissions
- Search and filter functionality
- Responsive design matching your main website

## Backend Changes

Added to `server/index.js`:

- POST `/api/admin/login` - Admin authentication endpoint
- GET `/api/contacts` - Fetch all contact submissions (already existed)

## Setup Steps

### 1. Initialize Admin User in Database

First, create the admin user in MongoDB:

```bash
cd server
npm run setup-admin
```

This creates an admin with:

- Username: `scalebridge`
- Password: `31102003`

### 2. Install Admin Portal Dependencies

```bash
cd admin-portal
npm install
```

### 3. Test Locally

```bash
npm run dev
```

Open http://localhost:5173 and login with:

- Username: `scalebridge`
- Password: `31102003`

### 4. Deploy Backend (if not already done)

Make sure your backend is deployed with the new login endpoint:

```bash
cd server
vercel
```

### 5. Deploy Admin Portal

```bash
cd admin-portal
vercel
```

## File Structure

```
admin-portal/
├── src/
│   ├── components/
│   │   ├── Login.jsx          # Login page
│   │   ├── Login.css
│   │   ├── Dashboard.jsx      # Main dashboard
│   │   └── Dashboard.css
│   ├── App.jsx                # Main app with auth logic
│   ├── App.css
│   ├── config.js              # API URL configuration
│   ├── main.jsx               # Entry point
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── vercel.json                # Vercel deployment config
└── README.md
```

## Features

✅ Secure login with session persistence (localStorage)
✅ View all contact submissions in card layout
✅ Search by name, email, company, or phone
✅ Real-time data refresh
✅ Responsive design
✅ Status badges for entries
✅ Formatted dates
✅ Logout functionality

## API Endpoints Used

- `POST /api/admin/login` - Authenticate admin
- `GET /api/contacts` - Fetch all contact submissions

## Default Credentials

- Username: `scalebridge` (common for all users)
- Password: `31102003` (can be changed per user to their DOB later)

## Next Steps

1. Run `npm run setup-admin` in the server folder
2. Test the admin portal locally
3. Deploy both backend and admin portal to Vercel
4. Access your admin portal at the deployed URL

## Future Enhancements

- Add password hashing (bcrypt)
- Implement JWT tokens
- Add user management (multiple admins with different passwords)
- Add contact status updates (new → contacted → closed)
- Export contacts to CSV
- Add pagination for large datasets
