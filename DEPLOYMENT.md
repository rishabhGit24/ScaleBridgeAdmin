# Admin Portal Deployment Guide

## Prerequisites

1. Backend API must be deployed and running
2. MongoDB database must be set up with admin credentials

## Setup Admin User in MongoDB

Before deploying the admin portal, you need to set up the admin user in MongoDB:

```bash
cd server
npm run setup-admin
```

This will create an admin user with:

- Username: `scalebridge`
- Password: `31102003`

## Local Development

1. Install dependencies:

```bash
cd admin-portal
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Open browser at `http://localhost:5173`

## Deploy to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI (if not already installed):

```bash
npm install -g vercel
```

2. Deploy from admin-portal directory:

```bash
cd admin-portal
vercel
```

3. Follow the prompts:
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project: No
   - Project name: scalebridge-admin-portal
   - Directory: ./
   - Override settings: No

### Option 2: Using Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your Git repository
4. Configure:
   - Framework Preset: Vite
   - Root Directory: admin-portal
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click "Deploy"

## Environment Configuration

The admin portal uses the same backend API as the main website. Make sure the API_URL in `src/config.js` points to your deployed backend:

```javascript
export const API_URL = import.meta.env.PROD
  ? "https://scale-bridge-backend.vercel.app/api"
  : "http://localhost:5000/api";
```

## Login Credentials

Default credentials:

- Username: `scalebridge`
- Password: `31102003`

## Features

- Secure login with session persistence
- View all contact form submissions
- Search and filter contacts
- Real-time data refresh
- Responsive design matching main website

## Security Notes

- Passwords are currently stored in plain text for simplicity
- For production, implement proper password hashing (bcrypt)
- Consider adding JWT tokens for better session management
- Add rate limiting to prevent brute force attacks
