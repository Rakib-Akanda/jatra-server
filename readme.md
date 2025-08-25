# Jatra Server

Backend server for **Jatra** – a modern transport management platform.  
 Handles routes, bookings, schedules, and authentication using a scalable REST API.

---

## Live Deployment

[Jatra Server Live](https://jatra-server.vercel.app)

---

## Project Overview

**Jatra Server** is a backend API built with Node.js, Express, and TypeScript.  
It powers the Jatra platform, which helps users to:

- Manage travel routes
- Authenticate and authorize users

This server follows a **modular architecture** with separate layers for routes, controllers, services, and database models.

---

## Features

- **JWT Authentication & Authorization**
- **Routes**
- **Ride Booking System with Validation**
- **Centralized Error Handling & Logging**
- **TypeScript Support**
- **Database Integration (MongoDB)**
- **Ready for deployment (e.g. Vercel)**

---

## Technology Stack

**Backend**: Node.js, Express.js, TypeScript  
**Database**: MongoDB
**Authentication**: JWT (JSON Web Token)  
**Validation**: Zod
**Dev Tools**: Nodemon, ESLint, Prettier, ts-node-dev

---

## Setup Instructions

### 1 Clone the Repository

```bash
git clone https://github.com/Rakib-Akanda/jatra-server.git
cd jatra-server
2 Install Dependencies
npm install
3 Configure Environment Variables
Create a .env file in the root directory based on .env.example:

PORT=5000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret
4 Run the Server
Development Mode :

npm run dev

npm run build

npm start

 Project Structure
jatra-server/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── models/         # Database schemas
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── index.ts        # App entry point
├── .env.example
├── package.json
├── tsconfig.json
└── README.md

npm test
 Notes
Make sure you have Node.js v18+ installed.

Ensure your database server (MongoDB) is running before starting the app.


Contributing
Contributions are welcome! 🎉


👨‍💻 Maintainer
Rakib Akanda

GitHub: @Rakib-Akanda

Email: rmd04037@gmail.com
```
