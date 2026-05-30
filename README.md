# Nepali Business Directory Australia 🇳🇵🇦🇺

A web application serving as a directory for Nepali businesses across Australia. Users can browse businesses by category and filter by Australian state/territory.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL

## Categories

35+ business categories including Real Estate, Mortgage & Finance, Restaurant, Beauty, Medical, Education, Migration Consultancy, Disability Support, Plumbing, Landscaping, and more.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+

## Setup

### 1. Database

```bash
# Create the database
createdb nepali_business_directory

# Or via psql
psql -U postgres -c "CREATE DATABASE nepali_business_directory;"
```

### 2. Backend

```bash
cd backend

# Copy env file and update with your DB credentials
cp .env.example .env

# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Seed sample data
npm run db:seed

# Start development server (runs on port 5000)
npm run dev
```

### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server (runs on port 3000)
npm run dev
```

The frontend proxies API requests to the backend, so both need to be running.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| GET | `/api/categories/:slug` | Get category by slug |
| GET | `/api/businesses` | List businesses (supports `state`, `category`, `search`, `page`, `limit` query params) |
| GET | `/api/businesses/:id` | Get single business |
| GET | `/api/businesses/state/:state/stats` | Get business count per category for a state |
| GET | `/api/health` | Health check |

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/database.ts
│   │   ├── database/migrate.ts
│   │   ├── database/seed.ts
│   │   ├── routes/businesses.ts
│   │   ├── routes/categories.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/index.ts
│   │   ├── components/
│   │   ├── types/index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── tsconfig.json
└── README.md
```
