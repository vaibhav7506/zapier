# Verification Checklist

Use this checklist to verify that your Zapier Clone installation is working correctly.

## 📋 Pre-Installation Verification

### System Requirements
- [ ] Node.js 18+ installed (`node --version`)
- [ ] PostgreSQL installed and running (`pg_isready`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (optional) (`git --version`)

### Port Availability
Check that these ports are available:
- [ ] Port 3000 (Frontend)
- [ ] Port 3001 (Backend)
- [ ] Port 3002 (Hooks)
- [ ] Port 5432 (PostgreSQL)
- [ ] Port 9092 (Kafka - optional)

**Check port availability (example for port 3000):**
```bash
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -ti:3000
```

---

## 🗄️ Database Verification

### 1. Database Created
```bash
# List databases
psql -U postgres -l | grep zapier
```
- [ ] Database "zapier" exists

### 2. Prisma Setup
```bash
# From project root
npm run prisma:generate
```
- [ ] Prisma Client generated successfully
- [ ] No errors in terminal

### 3. Migrations Applied
```bash
npm run prisma:migrate
```
- [ ] Migrations completed without errors
- [ ] Tables created in database

### 4. Database Seeded
```bash
# Open Prisma Studio
npm run prisma:studio
```
- [ ] AvailableTrigger table has "webhook" entry
- [ ] AvailableAction table has "email" entry
- [ ] AvailableAction table has "send-sol" entry

**Or verify with SQL:**
```sql
SELECT * FROM "AvailableTrigger";
SELECT * FROM "AvailableAction";
```

---

## 🔧 Backend Verification

### 1. Backend Starts Successfully
```bash
npm run backend
```

**Expected Output:**
```
Backend server running on http://localhost:3001
```

- [ ] Server starts without errors
- [ ] Port 3001 is listening
- [ ] No database connection errors

### 2. API Health Check
Open browser or use curl:
```bash
curl http://localhost:3001/api/v1/trigger/available
```

**Expected Response:**
```json
{
  "availableTriggers": [
    {
      "id": "webhook",
      "name": "Webhook",
      "image": "https://..."
    }
  ]
}
```

- [ ] API responds with JSON
- [ ] No CORS errors
- [ ] Triggers list is returned

### 3. CORS Configuration
From browser console on http://localhost:3000:
```javascript
fetch('http://localhost:3001/api/v1/trigger/available')
  .then(r => r.json())
  .then(console.log)
```

- [ ] Request succeeds
- [ ] No CORS errors in console

---

## 🎨 Frontend Verification

### 1. Frontend Starts Successfully
```bash
npm run frontend
```

**Expected Output:**
```
▲ Next.js 15.5.12
- Local:        http://localhost:3000
- Ready in 2.5s
```

- [ ] Development server starts
- [ ] No compilation errors
- [ ] Port 3000 accessible

### 2. Frontend Build
```bash
cd frontend && npm run build
```

**Expected Output:**
```
✓ Compiled successfully
✓ Generating static pages (8/8)
```

- [ ] Build completes without errors
- [ ] All pages generated successfully
- [ ] No TypeScript errors

### 3. Pages Load Correctly

Visit each page and verify:

**Home Page (http://localhost:3000)**
- [ ] Page loads without errors
- [ ] Appbar visible with Logo, Login, Signup buttons
- [ ] Hero section displays correctly
- [ ] Video player visible
- [ ] Responsive on mobile (use DevTools)

**Signup Page (http://localhost:3000/signup)**
- [ ] Form displays correctly
- [ ] Input fields are visible
- [ ] "Get started free" button works
- [ ] Features list visible on left side

**Login Page (http://localhost:3000/login)**
- [ ] Form displays correctly
- [ ] Email and password fields visible
- [ ] Login button functional
- [ ] Features list visible on left side

### 4. Mobile Responsiveness
Use Chrome DevTools (F12 → Toggle Device Toolbar):

Test on:
- [ ] iPhone SE (375px) - smallest mobile
- [ ] iPhone 12/13 (390px)
- [ ] iPad (768px)
- [ ] Desktop (1920px)

Verify:
- [ ] All text is readable
- [ ] Buttons are tappable (min 44x44px)
- [ ] No horizontal scrolling
- [ ] Forms are usable
- [ ] Navigation works

---

## 🔐 Authentication Verification

### 1. User Signup
1. Go to http://localhost:3000/signup
2. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: test123456

**Verify:**
- [ ] Form submits without errors
- [ ] Success message appears
- [ ] Redirected to login page
- [ ] User created in database

**Check database:**
```bash
npm run prisma:studio
# Check User table for test@example.com
```
- [ ] User exists in database
- [ ] Password is hashed (not plain text)

### 2. User Login
1. Go to http://localhost:3000/login
2. Enter credentials from signup

**Verify:**
- [ ] Login succeeds
- [ ] Token stored in localStorage (F12 → Application → Local Storage)
- [ ] Redirected to dashboard
- [ ] No 403 errors

### 3. Protected Route Access
1. Clear localStorage (F12 → Application → Local Storage → Clear All)
2. Try to visit http://localhost:3000/dashboard

**Verify:**
- [ ] Redirected to login (or shows error)
- [ ] Cannot access dashboard without token

---

## 🎯 Zap Creation Verification

### 1. Dashboard Access
After logging in, visit http://localhost:3000/dashboard

**Verify:**
- [ ] Dashboard loads without errors
- [ ] "My Zaps" heading visible
- [ ] "Create" button visible
- [ ] Empty state message if no Zaps

### 2. Available Options Load
Click "Create" button

**Verify:**
- [ ] Create page loads (http://localhost:3000/zap/create)
- [ ] "Trigger" cell visible
- [ ] "Publish" button in header
- [ ] "+" button to add actions visible

### 3. Trigger Selection
1. Click on "Trigger" cell
2. Modal opens

**Verify:**
- [ ] Modal opens without errors
- [ ] "Webhook" option visible with icon
- [ ] Close button (X) works
- [ ] Modal is scrollable on mobile

### 4. Action Selection
1. Click "+" button to add action
2. Click on "Action" cell
3. Modal opens

**Verify:**
- [ ] Modal shows available actions
- [ ] "Send Email" visible with icon
- [ ] "Send Solana" visible with icon
- [ ] Clicking action shows metadata form

### 5. Email Action Configuration
1. Select "Send Email" action
2. Fill in:
   - To: {email}
   - Body: Hello {name}!
3. Click Submit

**Verify:**
- [ ] Form accepts input
- [ ] Submit button works
- [ ] Modal closes
- [ ] Action cell shows "Send Email"

### 6. Zap Publishing
1. Ensure trigger is set to "Webhook"
2. Ensure at least one action is configured
3. Click "Publish" button in header

**Verify:**
- [ ] Request sent to backend
- [ ] No errors in console
- [ ] Redirected to dashboard
- [ ] New Zap visible in dashboard

### 7. Dashboard Display
Back on dashboard:

**Verify:**
- [ ] Zap appears in list
- [ ] Integration icons visible
- [ ] Zap ID displayed
- [ ] Webhook URL visible
- [ ] "Go" button works

**Mobile View:**
- [ ] Card layout on mobile
- [ ] All information readable
- [ ] Webhook URL is clickable
- [ ] "View Details" button accessible

---

## 🔗 Webhook Service Verification

### 1. Hooks Service Starts
```bash
npm run hooks
```

**Expected Output:**
```
Server listening on port 3002
```

- [ ] Service starts without errors
- [ ] Port 3002 listening

### 2. Webhook Endpoint Test
Get webhook URL from dashboard (format: `http://localhost:3002/hooks/catch/{userId}/{zapId}`)

**Send test request:**
```bash
curl -X POST http://localhost:3002/hooks/catch/1/YOUR_ZAP_ID \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"John Doe"}'
```

**Expected Response:**
```json
{
  "message": "Webhook received"
}
```

- [ ] Request returns 200 OK
- [ ] JSON response received
- [ ] No errors in hooks service logs

### 3. Database Verification
After triggering webhook:

```bash
npm run prisma:studio
```

Check:
- [ ] New entry in ZapRun table
- [ ] metadata contains webhook payload
- [ ] New entry in ZapRunOutbox table

---

## 🔄 Full Workflow Verification (Optional - Requires Kafka)

### 1. Kafka Setup
- [ ] Kafka installed and running
- [ ] Zookeeper running
- [ ] Topic "zap-events" created

**Verify Kafka:**
```bash
# Check if Kafka is running
kafka-topics --list --bootstrap-server localhost:9092
```
- [ ] "zap-events" topic exists

### 2. Processor Verification
```bash
npm run processor
```

**Verify:**
- [ ] Processor starts without errors
- [ ] Connects to Kafka successfully
- [ ] Polls ZapRunOutbox table
- [ ] Publishes events to Kafka
- [ ] Deletes processed outbox entries

### 3. Worker Verification
```bash
npm run worker
```

**Verify:**
- [ ] Worker starts without errors
- [ ] Connects to Kafka successfully
- [ ] Consumes events from "zap-events" topic
- [ ] Logs show event processing

### 4. Email Action (if configured)
Set environment variables in worker:
```env
SMTP_ENDPOINT=smtp.gmail.com
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

**Trigger webhook and verify:**
- [ ] Email sent successfully
- [ ] No SMTP errors in worker logs
- [ ] Email received at destination

---

## 🧪 Error Handling Verification

### 1. Invalid Login
Try logging in with wrong credentials

**Verify:**
- [ ] Error message displayed
- [ ] No console errors
- [ ] User stays on login page

### 2. Duplicate Signup
Try signing up with existing email

**Verify:**
- [ ] Error message: "User already exists"
- [ ] User not created again in database

### 3. Unauthorized Access
1. Delete token from localStorage
2. Try to create Zap

**Verify:**
- [ ] 403 error returned
- [ ] Redirected to login page

### 4. Invalid Zap Creation
Try publishing Zap without selecting trigger

**Verify:**
- [ ] Nothing happens (function returns early)
- [ ] No error message (could be improved)

---

## 📊 Performance Verification

### 1. Page Load Times
Use Chrome DevTools (F12 → Network tab)

**Verify:**
- [ ] Home page loads < 2 seconds
- [ ] Dashboard loads < 3 seconds
- [ ] No failed requests
- [ ] All assets load successfully

### 2. Bundle Size
```bash
cd frontend && npm run build
```

**Verify:**
- [ ] Total bundle < 150KB per page
- [ ] Shared bundle < 110KB
- [ ] No warnings about large bundles

### 3. Database Queries
Check backend terminal logs during Zap fetch

**Verify:**
- [ ] Queries use proper relations (include)
- [ ] No N+1 query problems
- [ ] Response time < 500ms

---

## ✅ Final Checklist

### Core Functionality
- [ ] User can sign up
- [ ] User can log in
- [ ] User can create Zaps
- [ ] User can view Zaps
- [ ] Webhooks can trigger Zaps (with hooks service)

### Security
- [ ] Passwords are hashed
- [ ] JWT tokens work correctly
- [ ] Protected routes require authentication
- [ ] CORS is properly configured

### UI/UX
- [ ] All pages are responsive
- [ ] Mobile experience is good
- [ ] Buttons have proper hover states
- [ ] Forms are user-friendly
- [ ] Loading states are clear

### Code Quality
- [ ] No TypeScript errors
- [ ] Frontend builds successfully
- [ ] Backend starts without errors
- [ ] All services run independently

### Documentation
- [ ] README.md is comprehensive
- [ ] SETUP.md provides quick start
- [ ] Environment variables documented
- [ ] API endpoints documented

---

## 🐛 Common Issues Found During Verification

If any checks fail, refer to:
1. **SETUP.md** - Quick fixes
2. **README.md** - Troubleshooting section
3. **Backend logs** - API errors
4. **Browser console** - Frontend errors

---

## 📝 Verification Report Template

```
Date: ___________
Verified by: ___________

✅ PASSED
- Backend starts successfully
- Frontend builds without errors
- User authentication works
- Zap creation works
- Dashboard displays correctly
- Mobile responsiveness verified

⚠️ WARNINGS
- (List any warnings)

❌ FAILED
- (List any failures)

NOTES:
- (Any additional observations)
```

---

## 🎉 Success Criteria

Your installation is successful if:
1. ✅ All core functionality checks pass
2. ✅ No errors in console or terminal
3. ✅ Can create and view Zaps
4. ✅ Mobile experience is smooth
5. ✅ Documentation is clear

**If all checks pass: Congratulations! Your Zapier Clone is fully functional! 🚀**

---

**Pro Tip:** Save this checklist and run through it after any major changes or updates to ensure nothing breaks.