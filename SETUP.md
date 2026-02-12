# Quick Setup Guide

This is a simplified guide to get the Zapier Clone running quickly on your local machine.

## 🚀 Quick Start (5 minutes)

### 1. Prerequisites Check

Ensure you have installed:
- Node.js 18+ (`node --version`)
- PostgreSQL (`psql --version`)
- npm (`npm --version`)

### 2. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd zapier

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install hooks service dependencies
cd hooks
npm install
cd ..

# Install processor dependencies (optional for basic setup)
cd processor
npm install
cd ..
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb zapier

# Or using psql:
psql -U postgres
CREATE DATABASE zapier;
\q
```

### 4. Configure Environment

Create `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/zapier?schema=public"
JWT_PASSWORD="your-super-secret-jwt-key-min-32-chars-long"
FRONTEND_URL="http://localhost:3000"
```

**Note:** Replace `postgres:password` with your PostgreSQL username and password.

### 5. Initialize Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# When prompted, name your migration (e.g., "init")
```

### 6. Seed Database

You need to add available triggers and actions manually:

```bash
# Open Prisma Studio
npm run prisma:studio
```

Then add these records:

**AvailableTrigger table:**
- id: `webhook`
- name: `Webhook`
- image: `https://cdn-icons-png.flaticon.com/512/5579/5579249.png`

**AvailableAction table:**
- id: `email`
- name: `Send Email`
- image: `https://cdn-icons-png.flaticon.com/512/732/732200.png`

- id: `send-sol`
- name: `Send Solana`
- image: `https://cryptologos.cc/logos/solana-sol-logo.png`

Alternatively, run this SQL:

```sql
INSERT INTO "AvailableTrigger" (id, name, image) VALUES 
  ('webhook', 'Webhook', 'https://cdn-icons-png.flaticon.com/512/5579/5579249.png');

INSERT INTO "AvailableAction" (id, name, image) VALUES 
  ('email', 'Send Email', 'https://cdn-icons-png.flaticon.com/512/732/732200.png'),
  ('send-sol', 'Send Solana', 'https://cryptologos.cc/logos/solana-sol-logo.png');
```

### 7. Start the Application

#### Option A: Basic Setup (No Kafka)

This runs the frontend and backend:

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

#### Option B: Full Setup (With Webhooks)

In separate terminals:

```bash
# Terminal 1: Backend
npm run backend

# Terminal 2: Frontend
npm run frontend

# Terminal 3: Hooks service
npm run hooks
```

#### Option C: Everything Together

```bash
npm run dev:all
```

## 🎯 Test the Application

1. **Open browser:** http://localhost:3000
2. **Sign up:** Create a new account
3. **Login:** Use your credentials
4. **Create a Zap:**
   - Click "Create" button
   - Select "Webhook" as trigger
   - Add "Send Email" action
   - Configure email details
   - Click "Publish"

5. **Get your webhook URL** from the dashboard
6. **Trigger it:**
   ```bash
   curl -X POST http://localhost:3002/hooks/catch/{userId}/{zapId} \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "name": "John"}'
   ```

## 🔧 Advanced Setup (Kafka + Full Workflow)

For the complete workflow including background processing:

### 1. Install Kafka

**macOS (Homebrew):**
```bash
brew install kafka
brew services start zookeeper
brew services start kafka
```

**Linux (Ubuntu/Debian):**
```bash
# Download Kafka
wget https://downloads.apache.org/kafka/3.6.0/kafka_2.13-3.6.0.tgz
tar -xzf kafka_2.13-3.6.0.tgz
cd kafka_2.13-3.6.0

# Start Zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties

# In another terminal, start Kafka
bin/kafka-server-start.sh config/server.properties
```

**Windows:**
Download from https://kafka.apache.org/downloads and follow the quickstart guide.

### 2. Create Kafka Topic

```bash
# If using Homebrew
kafka-topics --create --topic zap-events --bootstrap-server localhost:9092

# If using downloaded Kafka
bin/kafka-topics.sh --create --topic zap-events --bootstrap-server localhost:9092
```

### 3. Configure Worker Service

Create `.env` in the `worker` directory:

```env
# Email configuration (optional)
SMTP_ENDPOINT="smtp.gmail.com"
SMTP_USERNAME="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# Solana configuration (optional)
SOL_PRIVATE_KEY="your-base58-encoded-private-key"
```

### 4. Start All Services

In separate terminals:

```bash
# Terminal 1: Backend
npm run backend

# Terminal 2: Frontend
npm run frontend

# Terminal 3: Hooks
npm run hooks

# Terminal 4: Processor
npm run processor

# Terminal 5: Worker
npm run worker
```

## 📱 Mobile Testing

The application is fully responsive. Test on:

1. **Chrome DevTools:**
   - Press F12 → Toggle device toolbar
   - Test on various screen sizes

2. **Real Device:**
   - Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - Update `frontend/app/config.ts` to use your IP
   - Access from mobile: `http://192.168.x.x:3000`

## 🐛 Common Issues

### "Cannot connect to database"
- Ensure PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in `.env`
- Verify database exists: `psql -l | grep zapier`

### "Module not found"
```bash
npm run prisma:generate
cd frontend && npm install
```

### "Port already in use"
- Backend (3001): `lsof -ti:3001 | xargs kill` (Mac/Linux)
- Frontend (3000): `lsof -ti:3000 | xargs kill` (Mac/Linux)
- Windows: `netstat -ano | findstr :3001` then `taskkill /PID <pid> /F`

### Prisma Client errors
```bash
npm run prisma:generate
```

### TypeScript errors in worker
```bash
cd worker
npm install --save-dev @types/node
```

## 🎓 Next Steps

1. Read the [full README.md](./README.md) for architecture details
2. Explore the API documentation
3. Add custom actions in the worker
4. Deploy to production (see README.md deployment section)

## 📚 Useful Commands

```bash
# View database in GUI
npm run prisma:studio

# Reset database
npm run prisma:migrate reset

# Check logs
# Backend logs appear in the terminal running npm run backend
# Frontend logs appear in browser console

# Build for production
npm run build:frontend
```

## 🆘 Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Review error messages in browser console (F12)
- Check backend terminal for API errors
- Ensure all services are running

---

**Ready to automate!** 🚀