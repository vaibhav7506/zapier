# Zapier Clone - Workflow Automation Platform

A full-stack workflow automation platform inspired by Zapier, built with Next.js, Express, Prisma, and Kafka. Create automated workflows (Zaps) that trigger actions based on external events.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Workflow Explanation](#workflow-explanation)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This project is a workflow automation platform that allows users to create "Zaps" - automated workflows that connect different services. When a trigger event occurs (via webhook), the system executes a series of actions like sending emails or Solana transactions.

## ✨ Features

- **User Authentication** - Secure signup/login with JWT and bcrypt password hashing
- **Visual Zap Builder** - Drag-and-drop interface to create automation workflows
- **Webhook Triggers** - Accept external events via HTTP webhooks
- **Multiple Actions** - Email sending, Solana transactions, and extensible action system
- **Event Processing** - Kafka-based event queue for reliable execution
- **Responsive Design** - Mobile-first UI with Tailwind CSS
- **Real-time Dashboard** - View and manage all your Zaps

## 🏗 Architecture

```
┌─────────────┐      ┌──────────────┐      ┌────────────┐
│   Frontend  │─────▶│    Backend   │─────▶│  Database  │
│  (Next.js)  │      │  (Express)   │      │(PostgreSQL)│
└─────────────┘      └──────────────┘      └────────────┘
                            │
                            ▼
┌─────────────┐      ┌──────────────┐      ┌────────────┐
│   Webhook   │─────▶│  Processor   │─────▶│   Kafka    │
│   Service   │      │  (Outbox)    │      │   Queue    │
└─────────────┘      └──────────────┘      └────────────┘
                                                   │
                                                   ▼
                                            ┌────────────┐
                                            │   Worker   │
                                            │ (Actions)  │
                                            └────────────┘
```

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS v3** - Utility-first styling
- **Axios** - HTTP client

### Backend
- **Express 5** - Node.js web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Relational database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Zod** - Schema validation

### Infrastructure
- **Kafka** - Event streaming platform
- **Node.js 18+** - Runtime environment

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL** - [Download](https://www.postgresql.org/download/)
- **Apache Kafka** - [Download](https://kafka.apache.org/downloads) (Optional, for full workflow)
- **npm** or **yarn** - Package manager

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd zapier
```

### 2. Install Root Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 4. Install Service Dependencies

```bash
# Hooks service
cd hooks
npm install
cd ..

# Processor service
cd processor
npm install
cd ..

# Worker service (if has package.json)
cd worker
npm install
cd ..
```

## ⚙️ Configuration

### 1. Database Setup

Create a PostgreSQL database:

```bash
createdb zapier
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/zapier?schema=public"

# JWT Secret (use a strong random string in production)
JWT_PASSWORD="your-secure-jwt-secret-min-32-characters"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"

# Optional: Kafka Configuration
KAFKA_BROKER="localhost:9092"
```

### 3. Frontend Configuration

The frontend automatically uses environment variables. For production, set:

```env
NEXT_PUBLIC_BACKEND_URL="https://your-backend-url.com"
NEXT_PUBLIC_HOOKS_URL="https://your-hooks-url.com"
```

### 4. Generate Prisma Client

```bash
npm run prisma:generate
```

### 5. Run Database Migrations

```bash
npm run prisma:migrate
```

### 6. Seed Database (Optional)

You need to manually add available triggers and actions to the database:

```sql
-- Add available triggers
INSERT INTO "AvailableTrigger" (id, name, image) VALUES 
  ('webhook', 'Webhook', 'https://cdn-icons-png.flaticon.com/512/5579/5579249.png');

-- Add available actions
INSERT INTO "AvailableAction" (id, name, image) VALUES 
  ('email', 'Send Email', 'https://cdn-icons-png.flaticon.com/512/732/732200.png'),
  ('send-sol', 'Send Solana', 'https://cryptologos.cc/logos/solana-sol-logo.png');
```

## 🎮 Running the Application

### Quick Start (Development)

Run both frontend and backend together:

```bash
npm run dev
```

This starts:
- **Backend** on `http://localhost:3001`
- **Frontend** on `http://localhost:3000`

### Run Services Individually

**Backend API:**
```bash
npm run backend
```

**Frontend:**
```bash
npm run frontend
```

**Hooks Service:**
```bash
cd hooks
npm start
# Runs on http://localhost:3002
```

**Processor (requires Kafka):**
```bash
cd processor
npm start
```

**Worker (requires Kafka):**
```bash
cd worker
npm start
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api/v1
- **Hooks Endpoint:** http://localhost:3002/hooks/catch/:userId/:zapId

## 📁 Project Structure

```
zapier/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App router pages
│   │   ├── dashboard/       # Dashboard page
│   │   ├── login/           # Login page
│   │   ├── signup/          # Signup page
│   │   ├── zap/            # Zap pages
│   │   │   └── create/     # Zap creation page
│   │   ├── config.ts       # API configuration
│   │   ├── global.css      # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   └── components/          # React components
│       ├── buttons/        # Button components
│       ├── Appbar.tsx      # Navigation bar
│       ├── Hero.tsx        # Hero section
│       ├── Input.tsx       # Input component
│       └── ZapCell.tsx     # Zap builder cell
│
├── primary-backend/          # Express backend API
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── src/
│       ├── db/             # Database client
│       ├── router/         # API routes
│       │   ├── user.ts    # User routes
│       │   ├── zap.ts     # Zap routes
│       │   ├── trigger.ts # Trigger routes
│       │   └── action.ts  # Action routes
│       └── types/          # TypeScript types
│           ├── config.ts   # Configuration
│           ├── middleware.ts # Auth middleware
│           ├── schemas.ts  # Zod schemas
│           └── index.ts    # Server entry
│
├── hooks/                   # Webhook service
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       └── index.ts        # Webhook endpoint
│
├── processor/               # Kafka event processor
│   └── src/
│       └── index.ts        # Outbox processor
│
├── worker/                  # Action executor
│   └── src/
│       ├── index.ts        # Kafka consumer
│       ├── email.ts        # Email action
│       ├── solana.ts       # Solana action
│       └── parser.ts       # Metadata parser
│
├── package.json            # Root dependencies
└── README.md              # This file
```

## 🔄 Workflow Explanation

### 1. User Creates a Zap

1. User signs up/logs in to the platform
2. Navigates to "Create Zap" page
3. Selects a **Trigger** (e.g., Webhook)
4. Adds one or more **Actions** (e.g., Send Email, Send SOL)
5. Configures action metadata (email address, amount, etc.)
6. Publishes the Zap

**Backend Flow:**
```
POST /api/v1/zap
├─ Validates input with Zod
├─ Creates Zap record
├─ Creates Trigger record
├─ Creates Action records with sorting order
└─ Returns zapId
```

### 2. External Event Triggers Zap

An external service sends a POST request to the webhook endpoint:

```bash
curl -X POST http://localhost:3002/hooks/catch/{userId}/{zapId} \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com"}'
```

**Hooks Service Flow:**
```
Webhook receives data
├─ Creates ZapRun with metadata
├─ Creates ZapRunOutbox entry
└─ Returns success response
```

### 3. Processor Handles Event

The Processor service polls the `ZapRunOutbox` table:

```
Processor (every few seconds)
├─ Fetches pending outbox entries
├─ Publishes to Kafka topic "zap-events"
└─ Deletes processed outbox entries
```

### 4. Worker Executes Actions

The Worker consumes events from Kafka:

```
Worker receives event
├─ Fetches ZapRun details
├─ Gets action at current stage
├─ Parses metadata with webhook data
├─ Executes action (email/solana)
├─ If more actions exist:
│   └─ Publishes next stage to Kafka
└─ Commits Kafka offset
```

### 5. Actions Execute

**Email Action:**
- Parses recipient and body from metadata
- Replaces variables like `{email}` with webhook data
- Sends email via SMTP

**Solana Action:**
- Parses recipient address and amount
- Creates and signs Solana transaction
- Sends SOL to recipient

## 📡 API Documentation

### Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Endpoints

#### **POST** `/api/v1/user/signup`
Create a new user account.

**Request:**
```json
{
  "username": "user@example.com",
  "password": "secure-password",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "Please verify your account by checking your email"
}
```

#### **POST** `/api/v1/user/signin`
Login to existing account.

**Request:**
```json
{
  "username": "user@example.com",
  "password": "secure-password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### **GET** `/api/v1/user`
Get current user information. (Authenticated)

**Response:**
```json
{
  "user": {
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

#### **POST** `/api/v1/zap`
Create a new Zap. (Authenticated)

**Request:**
```json
{
  "availableTriggerId": "webhook",
  "triggerMetadata": {},
  "actions": [
    {
      "availableActionId": "email",
      "actionMetadata": {
        "email": "{email}",
        "body": "Hello {name}!"
      }
    }
  ]
}
```

**Response:**
```json
{
  "zapId": "clx1234567890"
}
```

#### **GET** `/api/v1/zap`
Get all Zaps for current user. (Authenticated)

**Response:**
```json
{
  "zaps": [
    {
      "id": "clx1234567890",
      "triggerId": "trigger-id",
      "userId": 1,
      "trigger": {
        "id": "trigger-id",
        "type": {
          "id": "webhook",
          "name": "Webhook",
          "image": "https://..."
        }
      },
      "actions": [
        {
          "id": "action-id",
          "sortingOrder": 0,
          "type": {
            "id": "email",
            "name": "Send Email",
            "image": "https://..."
          }
        }
      ]
    }
  ]
}
```

#### **GET** `/api/v1/zap/:zapId`
Get a specific Zap. (Authenticated)

#### **GET** `/api/v1/trigger/available`
Get all available triggers.

#### **GET** `/api/v1/action/available`
Get all available actions.

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your repository to Vercel
2. Set **Root Directory** to `frontend`
3. Add environment variables:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-backend.com
   NEXT_PUBLIC_HOOKS_URL=https://your-hooks.com
   ```
4. Deploy

### Backend (Railway/Render/Fly.io)

1. Deploy the `primary-backend` folder
2. Set environment variables:
   ```
   DATABASE_URL=postgresql://...
   JWT_PASSWORD=your-secret
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
3. Run migrations: `npm run prisma:migrate`

### Hooks Service

Deploy separately with the same DATABASE_URL.

### Kafka Services

For production, use managed Kafka (Confluent, AWS MSK) and deploy processor/worker as separate services.

## 🐛 Troubleshooting

### Frontend can't connect to backend

**Issue:** API calls fail with network errors.

**Solution:**
- Ensure backend is running on port 3001
- Check `frontend/app/config.ts` has correct BACKEND_URL
- Verify CORS is enabled in backend

### Login/Signup fails

**Issue:** "Invalid credentials" or "User already exists"

**Solution:**
- Check DATABASE_URL is correct
- Run `npm run prisma:generate`
- Verify bcrypt is installed: `npm install bcrypt`
- Check browser console for detailed errors

### Zap creation fails

**Issue:** "Failed to create zap" error

**Solution:**
- Ensure you've seeded AvailableTrigger and AvailableAction tables
- Check backend logs for validation errors
- Verify JWT token is valid (try logging in again)

### Webhook not triggering

**Issue:** POST to webhook endpoint doesn't execute actions

**Solution:**
- Hooks service must be running on port 3002
- Kafka must be running for processor/worker
- Check ZapRunOutbox table has entries
- Verify userId and zapId in webhook URL are correct

### Responsive design issues on mobile

**Solution:**
- All components are designed mobile-first
- Minimum touch target is 44x44px
- Test on actual devices or Chrome DevTools mobile view
- Ensure viewport meta tag is in layout.tsx (already present)

### Database connection fails

**Issue:** "Can't reach database server"

**Solution:**
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL format
- Ensure database exists: `createdb zapier`
- Check firewall/network settings

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

- Inspired by [Zapier](https://zapier.com)
- Built with modern web technologies
- UI design inspired by Zapier's clean interface

---

**Note:** This is a learning project and not intended for production use without proper security audits, error handling, and infrastructure setup.

For questions or issues, please open a GitHub issue.