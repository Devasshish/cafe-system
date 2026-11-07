# Cafe Menu & Order Management System

A full-stack MERN application for a modern Cafe Menu & Order Management System built with Agile development practices.

## Project Structure

```text
├── backend/               # Express & Node.js API (MVC Architecture)
│   ├── src/
│   │   ├── config/        # Database & Swagger configuration
│   │   ├── controllers/   # Route controllers (business logic)
│   │   ├── middlewares/   # Centralized error handler & validation
│   │   ├── models/        # Mongoose data models
│   │   ├── routes/        # Express API routes
│   │   ├── utils/         # Helper functions
│   │   ├── app.js         # Express app initialization & middleware
│   │   └── server.js      # Server listener & DB connection entrypoint
│   ├── .env.example       # Backend environment template
│   └── package.json
├── frontend/              # React.js + Vite Application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # Global state management
│   │   ├── hooks/         # Custom React hooks
│   │   ├── layouts/       # Application layouts (MainLayout)
│   │   ├── pages/         # Page views (Menu, Cart, Admin)
│   │   ├── services/      # Axios API service client
│   │   ├── App.jsx        # Routing configuration
│   │   └── main.jsx       # React DOM entrypoint
│   ├── .env.example       # Frontend environment template
│   ├── tailwind.config.js # Tailwind CSS configuration
│   ├── postcss.config.js  # PostCSS configuration
│   └── package.json
└── README.md
```

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, React Router DOM, Axios, Lucide React
- **Backend**: Node.js, Express, MongoDB Atlas, Mongoose, Helmet, Morgan, express-validator, Swagger JSDoc / UI

## Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
Backend runs at `http://localhost:5000`
- API Health Check: `http://localhost:5000/api/health`
- Swagger Documentation: `http://localhost:5000/api/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Frontend runs at `http://localhost:5173`

