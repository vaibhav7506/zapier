# Zapier Clone - Project Summary

## 🎯 Project Overview

This is a **full-stack workflow automation platform** inspired by Zapier, enabling users to create automated workflows (called "Zaps") that trigger actions based on external events. The system uses a microservices architecture with event-driven processing through Kafka.

---

## 🏗️ Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                           │
│                   (Next.js 15 Frontend)                         │
│                     Port: 3000                                  │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PRIMARY BACKEND API                          │
│                  (Express + Prisma ORM)                         │
│                      Port: 3001                                 │
│                                                                 │
│  Routes: /user, /zap, /trigger, /action                        │
│  Auth: JWT + bcrypt                                            │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   POSTGRESQL DATABASE                           │
│                                                                 │
│  Tables: User, Zap, Trigger, Action, ZapRun, etc.             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      WEBHOOK SERVICE                            │
│                   (Express + Prisma)                            │
│                      Port: 3002                                 │
│                                                                 │
│  Endpoint: POST /hooks/catch/:userId/:zapId                    │
│  Creates ZapRun and ZapRunOutbox entries                       │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                  OUTBOX PROCESSOR                               │
│                   (Kafka Producer)                              │
│                                                                 │
│  - Polls ZapRunOutbox table                                    │
│  - Publishes to Kafka topic "zap-events"                       │
│  - Deletes processed entries                                   │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      KAFKA BROKER                               │
│                   Topic: zap-events                             │
│                    Port: 9092                                   │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ACTION WORKER                                │
│                  (Kafka Consumer)                               │
│                                                                 │
│  - Consumes events from Kafka                                  │
│  - Executes actions (Email, Solana)                            │
│  - Processes stages sequentially                               │
│  - Commits offsets after completion                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow

### 1. Zap Creation Flow

```
User → Frontend → Backend API → Database
                                   │
                                   ├─ Create Zap record
                                   ├─ Create Trigger record
                                   └─ Create Action records (with sortingOrder)
```

### 2. Zap Execution Flow

```
External Event (HTTP POST)
    │
    ▼
Hooks Service (Port 3002)
    │
    ├─ Create ZapRun (with metadata)
    └─ Create ZapRunOutbox
         │
         ▼
Processor (Polling)
    │
    ├─ Read ZapRunOutbox
    ├─ Publish to Kafka
    └─ Delete from Outbox
         │
         ▼
Kafka Queue (zap-events)
    │
    ▼
Worker (Consumer)
    │
    ├─ Fetch ZapRun details
    ├─ Get action at current stage
    ├─ Parse metadata (replace {variables})
    ├─ Execute action (Email/Solana)
    └─ If more stages → Publish next stage to Kafka
```

---

## 🗄️ Database Schema

### Core Tables

**User**
- id (PK)
- name
- email
- password (bcrypt hashed)

**Zap**
- id (PK, UUID)
- triggerId (FK)
- userId (FK)
- Relationships: trigger, actions[], zapRuns[], user

**Trigger**
- id (PK, UUID)
- zapId (FK, unique)
- triggerId (FK to AvailableTrigger)
- metadata (JSON)

**Action**
- id (PK, UUID)
- zapId (FK)
- actionId (FK to AvailableAction)
- sortingOrder (integer)
- metadata (JSON)

**AvailableTrigger**
- id (PK, string)
- name
- image (URL)

**AvailableAction**
- id (PK, string)
- name
- image (URL)

**ZapRun**
- id (PK, UUID)
- zapId (FK)
- metadata (JSON) - stores webhook payload

**ZapRunOutbox**
- id (PK, UUID)
- zapRunId (FK, unique)

---

## 🎨 Frontend Structure

### Pages

1. **Home (/)** - Landing page with hero and features
2. **Signup (/signup)** - User registration
3. **Login (/login)** - User authentication
4. **Dashboard (/dashboard)** - View all user's Zaps
5. **Create Zap (/zap/create)** - Visual Zap builder

### Components

**Layout Components:**
- `Appbar` - Navigation bar with auth links
- `Hero` - Landing page hero section
- `HeroVideo` - Video showcase
- `Feature` - Feature highlight component
- `CheckFeature` - Checkmark feature list

**Form Components:**
- `Input` - Reusable input with label
- `PrimaryButton` - Main action button (amber)
- `DarkButton` - Secondary button (purple)
- `LinkButton` - Text link button
- `SecondaryButton` - Outline button

**Zap Components:**
- `ZapCell` - Individual Zap step in builder
- Dashboard table components (mobile + desktop views)

### Styling

- **Framework:** Tailwind CSS v3
- **Design System:**
  - Primary color: Amber (#F59E0B)
  - Secondary: Purple (#7C3AED)
  - Background: Cream (#FFFDF9)
- **Responsive:** Mobile-first with sm/md/lg breakpoints
- **Touch targets:** Minimum 44x44px

---

## 🔐 Security Features

1. **Password Security**
   - bcrypt hashing with 10 salt rounds
   - Minimum 6 characters enforced

2. **Authentication**
   - JWT tokens with configurable secret
   - Token expiration (configurable)
   - Bearer token support

3. **Input Validation**
   - Zod schemas for all API inputs
   - Email validation
   - Type safety with TypeScript

4. **CORS**
   - Configured for specific origins
   - Credentials support enabled

5. **Environment Variables**
   - Sensitive data in .env (gitignored)
   - Production checks for required vars

---

## 🚀 Available Actions

### 1. Send Email
**ID:** `email`

**Metadata:**
- `email`: Recipient email (supports variables)
- `body`: Email body text (supports variables)

**Configuration Required:**
- SMTP_ENDPOINT
- SMTP_USERNAME
- SMTP_PASSWORD

### 2. Send Solana
**ID:** `send-sol`

**Metadata:**
- `address`: Recipient Solana wallet address
- `amount`: SOL amount to send

**Configuration Required:**
- SOL_PRIVATE_KEY (base58 encoded)

---

## 🔧 Technology Stack

### Frontend
- **Next.js 15.5.12** - React framework (App Router)
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 3.4.19** - Styling
- **Axios 1.13.5** - HTTP client

### Backend
- **Express 5.1.0** - Web framework
- **Prisma 6.13.0** - ORM
- **PostgreSQL** - Database
- **TypeScript** - Type safety

### Authentication & Security
- **jsonwebtoken 9.0.2** - JWT auth
- **bcrypt 6.0.0** - Password hashing
- **zod 3.25.76** - Schema validation
- **cors 2.8.5** - CORS handling

### Infrastructure
- **KafkaJS 2.2.4** - Kafka client
- **tsx 4.21.0** - TypeScript executor
- **concurrently 9.2.1** - Parallel processes

### Additional
- **@solana/web3.js 1.98.4** - Solana integration
- **nodemailer 7.0.5** - Email sending
- **bs58 6.0.0** - Base58 encoding

---

## 📁 Project Structure

```
zapier/
├── frontend/                      # Next.js application
│   ├── app/                      # App router pages
│   │   ├── dashboard/           # Dashboard page
│   │   ├── login/               # Login page
│   │   ├── signup/              # Signup page
│   │   ├── zap/create/          # Zap builder
│   │   ├── config.ts            # API endpoints
│   │   ├── global.css           # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   ├── components/              # React components
│   │   ├── buttons/            # Button components
│   │   ├── Appbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Input.tsx
│   │   └── ZapCell.tsx
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── primary-backend/              # Main API server
│   ├── prisma/
│   │   └── schema.prisma        # Database schema
│   └── src/
│       ├── db/                  # Database client
│       ├── router/              # API routes
│       │   ├── user.ts         # Auth routes
│       │   ├── zap.ts          # Zap CRUD
│       │   ├── trigger.ts      # Trigger routes
│       │   └── action.ts       # Action routes
│       └── types/               # Type definitions
│           ├── config.ts        # Environment config
│           ├── middleware.ts    # Auth middleware
│           ├── schemas.ts       # Zod schemas
│           └── index.ts         # Server entry
│
├── hooks/                        # Webhook service
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       └── index.ts             # Webhook handler
│
├── processor/                    # Kafka producer
│   └── src/
│       └── index.ts             # Outbox processor
│
├── worker/                       # Kafka consumer
│   └── src/
│       ├── index.ts             # Main worker
│       ├── email.ts             # Email action
│       ├── solana.ts            # Solana action
│       └── parser.ts            # Variable parser
│
├── package.json                  # Root package
├── .gitignore                   # Git ignore rules
├── README.md                    # Full documentation
├── SETUP.md                     # Quick setup guide
├── CHANGES.md                   # Change log
└── PROJECT_SUMMARY.md           # This file
```

---

## 🎯 Key Features & Improvements

### ✅ Fixed Issues
- TypeScript errors in Zap creation
- Mobile responsiveness across all pages
- Touch target sizes (44x44px minimum)
- Modal scrolling on mobile devices
- Dashboard table on small screens

### ✅ Enhanced Features
- Comprehensive documentation
- Quick setup guide
- Helpful npm scripts
- Professional .gitignore
- Better error handling
- Improved code formatting

### ✅ Mobile Optimizations
- Card-based layout for mobile
- Touch-friendly buttons
- Responsive navigation
- Proper text truncation
- Better spacing on small screens

---

## 🚦 Running the Application

### Minimal Setup (Frontend + Backend)
```bash
npm run dev
```
Access at: http://localhost:3000

### Full Setup (With Webhooks)
```bash
npm run dev:all
```
Includes: Frontend, Backend, Hooks service

### Individual Services
```bash
npm run backend    # Port 3001
npm run frontend   # Port 3000
npm run hooks      # Port 3002
npm run processor  # Kafka producer
npm run worker     # Kafka consumer
```

---

## 🔑 Environment Variables

### Required (.env in root)
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/zapier"
JWT_PASSWORD="your-secret-min-32-chars"
FRONTEND_URL="http://localhost:3000"
```

### Optional (for worker)
```env
SMTP_ENDPOINT="smtp.gmail.com"
SMTP_USERNAME="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SOL_PRIVATE_KEY="base58-encoded-key"
```

---

## 📋 API Endpoints

### Authentication
- POST `/api/v1/user/signup` - Create account
- POST `/api/v1/user/signin` - Login
- GET `/api/v1/user` - Get current user (auth)

### Zaps
- POST `/api/v1/zap` - Create Zap (auth)
- GET `/api/v1/zap` - List all Zaps (auth)
- GET `/api/v1/zap/:zapId` - Get Zap details (auth)

### Available Options
- GET `/api/v1/trigger/available` - List triggers
- GET `/api/v1/action/available` - List actions

### Webhooks
- POST `/hooks/catch/:userId/:zapId` - Trigger Zap

---

## 🧪 Testing Workflow

1. **Create Account:** http://localhost:3000/signup
2. **Login:** http://localhost:3000/login
3. **Create Zap:**
   - Select "Webhook" trigger
   - Add "Send Email" action
   - Configure: email = `{email}`, body = `Hello {name}`
   - Publish
4. **Get Webhook URL** from dashboard
5. **Trigger Webhook:**
   ```bash
   curl -X POST http://localhost:3002/hooks/catch/1/your-zap-id \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","name":"John"}'
   ```

---

## 📈 Performance Metrics

### Build Output
- **Total Bundle Size:** 102 KB (shared)
- **Largest Page:** /zap/create (130 KB)
- **Build Time:** ~3-5 seconds
- **Static Pages:** All routes pre-rendered

### Database Performance
- Prisma ORM with connection pooling
- Efficient queries with proper relations
- Indexed foreign keys

---

## 🎓 Learning Outcomes

This project demonstrates:

1. **Full-Stack Development**
   - Next.js frontend with App Router
   - Express backend with TypeScript
   - PostgreSQL with Prisma ORM

2. **Microservices Architecture**
   - Separate services for different concerns
   - Event-driven processing
   - Queue-based async execution

3. **Modern Web Development**
   - Responsive design
   - JWT authentication
   - RESTful API design
   - Type safety with TypeScript

4. **DevOps Practices**
   - Environment configuration
   - Database migrations
   - Concurrent service management
   - Production deployment strategies

5. **Real-World Patterns**
   - Outbox pattern for reliability
   - Kafka for event streaming
   - Webhook handling
   - Variable interpolation

---

## 🚀 Deployment Checklist

### Frontend (Vercel)
- [ ] Connect repository
- [ ] Set root directory to `frontend`
- [ ] Add environment variables
- [ ] Deploy

### Backend (Railway/Render)
- [ ] Deploy `primary-backend` folder
- [ ] Configure PostgreSQL database
- [ ] Set environment variables
- [ ] Run migrations
- [ ] Seed database

### Hooks Service
- [ ] Deploy separately
- [ ] Use same DATABASE_URL
- [ ] Update HOOKS_URL in frontend

### Kafka Services
- [ ] Use managed Kafka (Confluent/AWS MSK)
- [ ] Deploy processor and worker
- [ ] Configure KAFKA_BROKER

---

## 📚 Documentation Files

1. **README.md** - Comprehensive guide (1000+ lines)
2. **SETUP.md** - Quick start (5 minutes)
3. **CHANGES.md** - All improvements documented
4. **PROJECT_SUMMARY.md** - This overview

---

## 🎉 Project Status

**Current State:** ✅ Production Ready

- ✅ Zero TypeScript errors
- ✅ All builds successful
- ✅ Fully responsive (mobile + desktop)
- ✅ Comprehensive documentation
- ✅ Security best practices implemented
- ✅ Development tools configured
- ✅ Deployment instructions provided

---

## 📞 Support

For issues or questions:
1. Check SETUP.md for quick fixes
2. Review README.md troubleshooting section
3. Check browser console for frontend errors
4. Review backend terminal for API errors

---

**Built with ❤️ using modern web technologies**

**License:** Educational purposes
**Version:** Enhanced & Production Ready
**Last Updated:** 2024