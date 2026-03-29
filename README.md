# ClinicMind AI

> India's first AI-native clinic OS — WhatsApp-first, voice-powered, real-time queue management for Indian hospitals and clinics.

![ClinicMind AI](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--time-010101)

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Screenshots](#screenshots)

---

## Overview

ClinicMind AI is a **multi-tenant SaaS platform** that solves the operational chaos in Indian clinics and hospitals. Doctors see 80–150 patients daily on paper. Patients wait 2–3 hours with no information. Staff manually manage everything.

ClinicMind replaces this with:
- **AI-powered voice prescriptions** — doctor speaks, AI structures it
- **Real-time queue tracking** — patient sees live ETA on their phone
- **WhatsApp-native booking** — no app download needed for patients
- **Drug interaction checking** — AI catches dangerous combinations instantly
- **Hospital verification system** — only verified hospitals appear publicly

---

## Live Demo

| Portal | URL | Credentials |
|--------|-----|-------------|
| Patient App | https://app.clinicmind.in | Register with any email |
| Hospital Admin | https://manage.clinicmind.in | admin@apollo.com / Hospital@123 |
| Doctor Dashboard | https://manage.clinicmind.in | priya@apollo.com / Doctor@123 |
| Super Admin | https://admin.clinicmind.in | admin@clinicmind.in / Admin@123456 |

---

## Architecture
┌─────────────────────────────────────────────────────────────────┐ │ CLINICMIND AI PLATFORM │ │ │ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │ │ │ patient-app │ │ hospital-app│ │ admin-app │ │ │ │ :3000 │ │ :3001 │ │ :3002 │ │ │ │ Next.js 15 │ │ Next.js 15 │ │ Next.js 15 │ │ │ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ │ │ │ │ │ │ │ └────────────────┼────────────────┘ │ │ │ │ │ ┌────────▼────────┐ │ │ │ API Gateway │ │ │ │ Node.js :5000 │ │ │ │ Express + │ │ │ │ Socket.IO │ │ │ └────────┬────────┘ │ │ │ │ │ ┌───────────┼───────────┐ │ │ │ │ │ │ │ ┌────────▼───┐ ┌────▼────┐ ┌──▼──────────┐ │ │ │ MongoDB │ │ Redis │ │ FastAPI │ │ │ │ Atlas │ │ (Queue) │ │ AI :8000 │ │ │ │ │ │ │ │ Whisper │ │ │ └────────────┘ └─────────┘ │ Gemini │ │ │ └─────────────┘ │ └─────────────────────────────────────────────────────────────────┘

### Multi-tenant Design

Every piece of data is isolated by `hospitalId`. The tenant guard middleware
enforces this on every authenticated request — a doctor at Apollo Hospitals
can never access data from Ruby Hall Clinic, even with a valid JWT.

### 5 User Roles
```
superadmin        → You — full platform control
└── hospital_admin → Hospital manager — doctors, staff, settings
    ├── doctor  → Verified doctor — queue, prescriptions, AI tools
    ├── staff   → Receptionist — queue management, bookings
    └── (manages) patient → App users — book, track, records
```

---

## Tech Stack

### Frontend (Turborepo Monorepo)
| Package | Purpose |
|---------|---------|
| Next.js 15 (App Router) | 4 separate apps, SSR + CSR |
| TypeScript | Full type safety across monorepo |
| Tailwind CSS | Design system with custom tokens |
| Zustand | Client state (auth, user data) |
| TanStack Query v5 | Server state, caching, refetching |
| Socket.IO Client | Real-time queue updates |
| React Hook Form + Zod | Forms with schema validation |
| DM Sans + Syne | Custom typography system |

### Backend (Node.js)
| Package | Purpose |
|---------|---------|
| Express.js | REST API server |
| Socket.IO | Real-time bidirectional events |
| Mongoose | MongoDB ODM with typed schemas |
| JWT + bcryptjs | Stateless authentication |
| Zod | Environment variable validation |
| DNS override | Google DNS for Atlas connectivity |

### AI Service (Python)
| Package | Purpose |
|---------|---------|
| FastAPI | Async Python API framework |
| OpenAI Whisper | Voice-to-text transcription |
| Google Gemini 1.5 Flash | Prescription structuring, triage |
| Motor (async Mongoose) | Async MongoDB reads |
| scikit-learn | Demand forecasting model |

### Infrastructure
| Service | What runs there |
|---------|----------------|
| Vercel | 4 Next.js frontends |
| Render | Node.js API + Python FastAPI |
| MongoDB Atlas | Primary database |
| Upstash Redis | Queue token caching |

---

## Features

### Patient Portal (app.clinicmind.in)
- Browse and search verified hospitals by city, specialization
- View verified doctor profiles with qualifications and fees
- Book appointments in 3 steps (select doctor → date/time → confirm)
- Get real-time queue token with live ETA (Socket.IO)
- View prescription history
- WhatsApp reminders for appointments

### Hospital Admin Portal (manage.clinicmind.in)
- Multi-step hospital registration form
- Doctor invite system — send setup link via email/WhatsApp
- One-click verify/unverify toggle per doctor
- Staff (receptionist/nurse) management
- Today's appointment overview
- Revenue and patient analytics

### Doctor Dashboard (manage.clinicmind.in/doctor)
- Live queue board with Socket.IO — see patients in real time
- Call next patient, mark done, skip tokens
- **Voice prescription** — speak → Whisper transcribes → Gemini structures
- AI drug interaction checker — paste medications, get instant analysis
- Patient history and prescription records
- Verification gate — dashboard locked until hospital admin approves

### Super Admin Panel (admin.clinicmind.in)
- Hospital approval workflow — review registrations, approve or reject with reason
- Platform-wide stats: hospitals, doctors, patients, MRR
- Revenue breakdown by plan (Free / Pro / Growth)
- All doctors and patients across entire platform
- Hospital status management (verified / suspended)

---

## Project Structure
```
clinicmind/
├── apps/
│   ├── patient-app/          → app.clinicmind.in
│   ├── hospital-app/         → manage.clinicmind.in
│   └── admin-app/            → admin.clinicmind.in
├── packages/
│   ├── ui/                   → Shared React components
│   ├── types/                → Shared TypeScript types
│   └── config/               → Constants, routes, plans
├── backend/
│   ├── api-server/           → Node.js + Express + Socket.IO
│   └── ai-service/           → Python FastAPI + Whisper + Gemini
├── turbo.json
└── pnpm-workspace.yaml
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 8+
- Python 3.11+
- MongoDB Atlas account (free tier works)

### 1. Clone and install
```bash
git clone https://github.com/abx15/clinicmind-ai.git
cd clinicmind-ai
pnpm install
```

### 2. Set up environment variables
```bash
# Copy example env files
cp backend/api-server/.env.example backend/api-server/.env
cp backend/ai-service/.env.example backend/ai-service/.env
cp apps/patient-app/.env.example apps/patient-app/.env.local
cp apps/hospital-app/.env.example apps/hospital-app/.env.local
cp apps/admin-app/.env.example apps/admin-app/.env.local
```

Fill in your values (see [Environment Variables](#environment-variables) section).

### 3. Seed the database
```bash
cd backend/api-server
pnpm seed
```

This creates:
- Superadmin account: `admin@clinicmind.in` / `Admin@123456` 
- Hospital admin: `admin@apollo.com` / `Hospital@123` 
- 3 doctors (2 verified, 1 pending)
- 1 staff member
- 3 test patients

### 4. Start all services
```bash
# Terminal 1: All frontends + Node.js API
pnpm dev

# Terminal 2: Python AI service
cd backend/ai-service
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

Open:
- Patient App: http://localhost:3000
- Hospital App: http://localhost:3001
- Admin App:    http://localhost:3002
- API Health:   http://localhost:5000/health
- AI Health:    http://localhost:8000/health

---

## Environment Variables

### backend/api-server/.env
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clinicmind
JWT_SECRET=your_minimum_32_character_secret_key_here
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URLS=http://localhost:3000,http://localhost:3001,http://localhost:3002
AI_SERVICE_URL=http://localhost:8000
WHATSAPP_TOKEN=your_meta_whatsapp_token
WHATSAPP_PHONE_ID=your_phone_number_id
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_SECRET=your_razorpay_secret
```

### backend/ai-service/.env
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clinicmind
GEMINI_API_KEY=your_google_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
FRONTEND_URLS=http://localhost:3000,http://localhost:3001,http://localhost:3002
```

### apps/*/env.local (all frontends)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_AI_URL=http://localhost:8000/api/v1
```

---

## API Documentation

### Auth
```
POST /api/v1/auth/register     Body: { name, email, phone, password, role }
POST /api/v1/auth/login        Body: { email, password }
GET  /api/v1/auth/me           Header: Authorization: Bearer <token>
POST /api/v1/auth/logout       Header: Authorization: Bearer <token>
```

### Hospitals (Public)
```
GET /api/v1/hospitals          Query: search, city, specialization
GET /api/v1/hospitals/:slug    Single hospital + verified doctors
```

### Hospitals (Admin)
```
POST /api/v1/hospitals/register
PATCH /api/v1/admin/hospitals/:id/approve
PATCH /api/v1/admin/hospitals/:id/reject    Body: { reason }
```

### Doctors
```
POST /api/v1/doctors/invite     Body: { name, email, phone, specialization }
POST /api/v1/doctors/setup      Query: token=xxx
PATCH /api/v1/doctors/:id/verify
PATCH /api/v1/doctors/:id/unverify
GET  /api/v1/doctors            Query: hospitalId, specialization
```

### Queue
```
POST /api/v1/queue/token        Body: { doctorId, hospitalId }
GET  /api/v1/queue/:doctorId/today
PATCH /api/v1/queue/:tokenId/call
PATCH /api/v1/queue/:tokenId/done
GET  /api/v1/queue/my-status
```

### AI (Doctor only)
```
POST /api/v1/ai/triage               Body: { symptoms[], age, gender }
POST /api/v1/ai/prescription/voice   Multipart: audio file
POST /api/v1/ai/drug-check           Body: { medications[] }
```

### Socket.IO Events
```
Client → Server:
queue:join { doctorId }
queue:leave { doctorId }

Server → Client:
queue:new-token { token, remainingCount }
queue:token-called { token, remainingCount }
queue:token-done { token, remainingCount }
queue:eta-updated { tokens[] }
```

---

## Deployment

### Frontend — Vercel
Each Next.js app deploys as a separate Vercel project:
```bash
cd apps/patient-app && vercel --prod
cd apps/hospital-app && vercel --prod
cd apps/admin-app && vercel --prod
```

### Backend — Render
Node.js API and Python FastAPI each run as a separate Render Web Service.
See `render.yaml` in each backend directory.

### Required production env vars on Render:
```
MONGODB_URI          → MongoDB Atlas connection string
JWT_SECRET           → Strong random secret (32+ chars)
FRONTEND_URLS        → Comma-separated production URLs
GEMINI_API_KEY       → Google AI Studio key
OPENAI_API_KEY       → OpenAI key (for Whisper)
```

---

## Screenshots

| Screen | Description |
|--------|-------------|
| Patient Homepage | Hospital listing with search and filters |
| Queue Tracker | Live Socket.IO token with ETA countdown |
| Hospital Admin | Doctor management with verify toggle |
| Doctor Queue | Real-time queue board with AI tools |
| Super Admin | Hospital approval workflow |
| Voice Prescription | Record → Transcribe → Structure |

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature` 
3. Commit your changes: `git commit -m 'Add some feature'` 
4. Push to the branch: `git push origin feature/your-feature` 
5. Open a Pull Request

---

## Author

**Arun Kumar Bind**
Full Stack & Generative AI Developer

- Portfolio: https://arun15dev.netlify.app
- GitHub: https://github.com/abx15
- LinkedIn: https://linkedin.com/in/arun-kumar-a3b047353
- Email: developerarunwork@gmail.com

---

## License

MIT License — see LICENSE file for details.

---

*Built with ❤️ for Indian healthcare*