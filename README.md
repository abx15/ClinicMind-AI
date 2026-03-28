# ClinicMind AI - Complete Healthcare Management System

A comprehensive full-stack healthcare platform that connects patients, hospitals, doctors, and staff through intelligent appointment booking, queue management, and AI-powered medical services.

## 🏥 Overview

ClinicMind AI is a modern healthcare management system built with:
- **Patient-centric** appointment booking and queue tracking
- **Hospital management** with doctor verification workflows
- **AI-powered** medical triage and prescription services
- **Real-time** queue management via Socket.IO
- **Multi-role** authentication system (Superadmin, Hospital Admin, Doctor, Staff, Patient)

## 🚀 Features

### 🏥 Hospital Management
- Hospital registration with superadmin approval
- Doctor invitation and verification system
- Multi-specialty hospital support
- Tenant isolation for data security

### 👨‍⚕️ Doctor System
- Invite-based doctor onboarding
- Professional profile management
- Verification workflow for hospital admins
- Public profile visibility controls

### 📋 Queue & Appointments
- Real-time queue management
- Token-based patient tracking
- Appointment booking system
- ETA calculations and updates

### 🤖 AI Services
- Symptom triage with urgency assessment
- Drug interaction checking
- Voice-to-text prescription
- Medical analytics and insights

### 📱 Patient Experience
- Easy hospital and doctor discovery
- Online appointment booking
- Real-time queue tracking
- Digital prescription access

## 🏗️ Architecture

### Monorepo Structure
```
FullStackMonoRepo/
├── apps/
│   ├── patient-app/     # Next.js - Patient frontend
│   ├── hospital-app/    # Next.js - Hospital/Doctor frontend  
│   └── admin-app/       # Next.js - Superadmin frontend
├── backend/
│   ├── api-server/      # Node.js + Express + Socket.IO
│   └── ai-service/      # Python FastAPI + ML Services
└── packages/
    ├── config/          # Shared configuration
    ├── types/           # TypeScript definitions
    └── ui/              # Shared UI components
```

### Technology Stack

**Backend:**
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Socket.IO (Real-time)
- JWT Authentication
- Python FastAPI (AI Services)
- OpenAI & Google Gemini APIs

**Frontend:**
- Next.js 15 + TypeScript
- TailwindCSS + shadcn/ui
- Zustand (State Management)
- Socket.IO Client

**Infrastructure:**
- MongoDB Atlas
- Vercel (Frontend Deployment)
- Railway/DigitalOcean (Backend)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- MongoDB Atlas connection
- API keys for AI services

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/abx15/ClinicMind-AI.git
cd ClinicMind-AI
```

2. **Install dependencies**
```bash
# Install root dependencies
pnpm install

# Install backend dependencies
cd backend/api-server && pnpm install
cd ../ai-service && pip install -r requirements.txt

# Install frontend dependencies
cd ../../apps/patient-app && pnpm install
cd ../hospital-app && pnpm install
cd ../admin-app && pnpm install
```

3. **Environment Setup**

Create `.env` files:

**backend/api-server/.env**
```env
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-jwt-secret
FRONTEND_URLS=http://localhost:3000,http://localhost:3001,http://localhost:3002
AI_SERVICE_URL=http://localhost:8000
```

**backend/ai-service/.env**
```env
MONGODB_URL=mongodb+srv://your-connection-string
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key
```

**Frontend apps (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_AI_URL=http://localhost:8000/api/v1
```

4. **Database Setup**
```bash
# Seed initial data
cd backend/api-server
pnpm seed
```

5. **Start Development Servers**

```bash
# Terminal 1: API Server
cd backend/api-server
pnpm dev

# Terminal 2: AI Service  
cd backend/ai-service
python -m uvicorn app.main:app --reload --port 8000

# Terminal 3: Patient App
cd apps/patient-app
pnpm dev

# Terminal 4: Hospital App
cd apps/hospital-app
pnpm dev

# Terminal 5: Admin App
cd apps/admin-app
pnpm dev
```

## 📱 Applications

### Patient App (`http://localhost:3000`)
- Hospital and doctor discovery
- Appointment booking
- Real-time queue tracking
- Prescription access

### Hospital App (`http://localhost:3001`)
- Hospital admin dashboard
- Doctor management and verification
- Queue management board
- Appointment scheduling

### Admin App (`http://localhost:3002`)
- Platform-wide hospital management
- User analytics and insights
- System configuration

## 🔐 Authentication Roles

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Superadmin | admin@clinicmind.in | Admin@123456 | Platform management |
| Hospital Admin | admin@apollo.com | Hospital@123 | Hospital operations |
| Doctor | priya@apollo.com | Doctor@123 | Patient care & prescriptions |
| Staff | staff@apollo.com | Staff@123 | Hospital support |
| Patient | ramesh@test.com | Patient@123 | Book appointments & care |

## 🧪 Testing

### Backend Testing
```bash
cd backend/api-server
# Run integration tests
pnpm test

# Seed test data
pnpm seed
```

### API Documentation
- **Base URL**: `http://localhost:5000/api/v1`
- **AI Service**: `http://localhost:8000/api/v1`
- **Socket.IO**: `ws://localhost:5000`

See `BACKEND_STATUS.md` for comprehensive API documentation and test results.

## 🤖 AI Services

### Symptom Triage
Analyzes patient symptoms and provides:
- Possible conditions
- Urgency level assessment  
- Recommended specializations
- Red flag warnings

### Drug Interactions
Checks medication combinations for:
- Interaction severity
- Contraindications
- Alternative suggestions

### Voice Prescriptions
Converts voice recordings to:
- Structured prescriptions
- Medication details
- Dosage instructions

## 📊 Real-time Features

### Queue Management
- Live token tracking
- ETA calculations
- Doctor-patient matching
- Queue status updates

### Socket.IO Events
```javascript
// Patient connects to queue
socket.emit('queue:join', { doctorId });

// Doctor calls next patient
socket.emit('queue:call', { tokenId });

// Real-time updates
socket.on('queue:token-called', (data) => {
  updateQueueDisplay(data);
});
```

## 🔧 Configuration

### Hospital Specializations
- Cardiology
- Orthopedics  
- Pediatrics
- Neurology
- General Medicine
- Dermatology
- Oncology
- And more...

### Queue Settings
- Average consultation time: 10 minutes
- Token refresh interval: 30 seconds
- Auto-advance timeout: 2 minutes

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Deploy each app
cd apps/patient-app && vercel --prod
cd apps/hospital-app && vercel --prod  
cd apps/admin-app && vercel --prod
```

### Backend (Railway/DigitalOcean)
```bash
# Build and deploy API server
cd backend/api-server
pnpm build
railway up

# Deploy AI service
cd backend/ai-service
railway up
```

## 📈 Monitoring

### Health Checks
- API Server: `GET /health`
- AI Service: `GET /health`
- Database: MongoDB Atlas metrics

### Logging
- Structured JSON logging
- Error tracking with context
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commits
- Add tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@clinicmind.in
- Documentation: Check `BACKEND_STATUS.md`

## 🎯 Roadmap

### Phase 1 ✅ (Complete)
- [x] Basic authentication system
- [x] Hospital management
- [x] Doctor invitation system
- [x] Queue management
- [x] AI integration

### Phase 2 (In Progress)
- [ ] Mobile applications
- [ ] Advanced analytics
- [ ] Telemedicine features
- [ ] Payment integration

### Phase 3 (Planned)
- [ ] Multi-language support
- [ ] International hospital networks
- [ ] Advanced AI diagnostics
- [ ] Wearable device integration

---

**Built with ❤️ for better healthcare management**

[ClinicMind AI](https://clinicmind.in) | [GitHub](https://github.com/abx15/ClinicMind-AI) | [Documentation](./BACKEND_STATUS.md)