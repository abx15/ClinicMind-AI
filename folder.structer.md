clinicmind/                          
├── apps/
│
│   ── 1. PATIENT PORTAL ──────────────────────────────────
│   ├── patient-app/                 → app.clinicmind.in [Vercel]
│   │   ├── app/
│   │   │   │
│   │   │   ├── (public)/            ← Login nahi chahiye
│   │   │   │   ├── page.tsx                    ← Homepage
│   │   │   │   ├── hospitals/
│   │   │   │   │   ├── page.tsx                ← Sabke verified hospitals
│   │   │   │   │   └── [hospitalSlug]/
│   │   │   │   │       ├── page.tsx            ← Hospital profile + doctors list
│   │   │   │   │       └── doctors/
│   │   │   │   │           └── [doctorId]/
│   │   │   │   │               └── page.tsx    ← Doctor public profile
│   │   │   │   └── search/
│   │   │   │       └── page.tsx                ← Doctor/hospital search
│   │   │   │
│   │   │   ├── (auth)/              ← Patient ka login/register
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── register/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── forgot-password/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   └── (dashboard)/         ← Login zaroori
│   │   │       ├── layout.tsx
│   │   │       ├── home/
│   │   │       │   └── page.tsx              ← Patient home
│   │   │       ├── profile/
│   │   │       │   └── page.tsx              ← Edit profile, photo
│   │   │       ├── appointments/
│   │   │       │   ├── page.tsx              ← All appointments
│   │   │       │   ├── book/page.tsx         ← New appointment
│   │   │       │   └── [id]/page.tsx         ← Single appointment detail
│   │   │       ├── queue/
│   │   │       │   └── page.tsx              ← Live queue tracker (Socket.IO)
│   │   │       ├── records/
│   │   │       │   ├── page.tsx              ← Prescription history
│   │   │       │   └── [id]/page.tsx         ← Single prescription view
│   │   │       └── notifications/
│   │   │           └── page.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   ├── hospital/
│   │   │   │   ├── HospitalCard.tsx
│   │   │   │   └── DoctorProfileCard.tsx
│   │   │   ├── queue/
│   │   │   │   └── QueueTracker.tsx          ← Live token display
│   │   │   └── appointment/
│   │   │       ├── BookingForm.tsx
│   │   │       └── AppointmentCard.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useSocket.ts
│   │   │   ├── useQueue.ts
│   │   │   └── useAuth.ts
│   │   │
│   │   ├── middleware.ts             ← Dashboard protect karo
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│
│   ── 2. HOSPITAL PORTAL ─────────────────────────────────
│   ├── hospital-app/                → manage.clinicmind.in [Vercel]
│   │   ├── app/
│   │   │   │
│   │   │   ├── register/
│   │   │   │   └── page.tsx         ← Hospital registration form (public)
│   │   │   │
│   │   │   ├── pending/
│   │   │   │   └── page.tsx         ← "SuperAdmin review mein hai" screen
│   │   │   │
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── forgot-password/page.tsx
│   │   │   │
│   │   │   └── (dashboard)/
│   │   │       ├── layout.tsx       ← Role check here
│   │   │       │
│   │   │       ├── ── HOSPITAL ADMIN VIEWS ──────────────
│   │   │       ├── overview/
│   │   │       │   └── page.tsx              ← Today summary
│   │   │       │
│   │   │       ├── doctors/                  ← Doctor CRUD
│   │   │       │   ├── page.tsx              ← List (verified/pending/rejected)
│   │   │       │   ├── add/
│   │   │       │   │   └── page.tsx          ← Add + send invite
│   │   │       │   └── [doctorId]/
│   │   │       │       └── page.tsx          ← Edit, verify toggle, remove
│   │   │       │
│   │   │       ├── staff/                    ← Staff CRUD
│   │   │       │   ├── page.tsx
│   │   │       │   └── add/page.tsx
│   │   │       │
│   │   │       ├── appointments/
│   │   │       │   └── page.tsx
│   │   │       │
│   │   │       ├── analytics/
│   │   │       │   └── page.tsx
│   │   │       │
│   │   │       ├── settings/
│   │   │       │   └── page.tsx              ← Hospital profile edit
│   │   │       │
│   │   │       ├── ── DOCTOR VIEWS ──────────────────────
│   │   │       ├── doctor/
│   │   │       │   ├── pending/page.tsx      ← "Verify hone ka wait karo"
│   │   │       │   ├── queue/page.tsx        ← Live queue (Socket.IO)
│   │   │       │   ├── patients/
│   │   │       │   │   ├── page.tsx
│   │   │       │   │   └── [patientId]/page.tsx
│   │   │       │   ├── prescriptions/
│   │   │       │   │   ├── page.tsx
│   │   │       │   │   └── new/page.tsx      ← Voice prescription
│   │   │       │   ├── appointments/page.tsx
│   │   │       │   ├── profile/page.tsx      ← Public profile edit
│   │   │       │   └── analytics/page.tsx
│   │   │       │
│   │   │       └── ── STAFF VIEWS ───────────────────────
│   │   │           └── staff/
│   │   │               ├── queue/page.tsx    ← Queue manage
│   │   │               ├── patients/page.tsx ← Register new patient
│   │   │               └── appointments/page.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── LoginForm.tsx
│   │   │   ├── hospital/
│   │   │   │   ├── HospitalRegisterForm.tsx
│   │   │   │   └── SettingsForm.tsx
│   │   │   ├── doctor/
│   │   │   │   ├── DoctorTable.tsx           ← CRUD + verify toggle
│   │   │   │   ├── InviteDoctorModal.tsx
│   │   │   │   ├── VerifyToggle.tsx          ← ON/OFF switch
│   │   │   │   ├── VerificationGate.tsx      ← Blocks if unverified
│   │   │   │   └── VoicePrescription.tsx
│   │   │   ├── staff/
│   │   │   │   └── StaffTable.tsx
│   │   │   └── queue/
│   │   │       └── QueueBoard.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useSocket.ts
│   │   │   ├── useRole.ts            ← Current user ka role detect
│   │   │   ├── useVerification.ts    ← Doctor verify status poll
│   │   │   └── useAuth.ts
│   │   │
│   │   ├── middleware.ts             ← Role-based route guard
│   │   ├── next.config.ts
│   │   └── package.json
│
│   ── 3. SUPER ADMIN PORTAL ──────────────────────────────
│   └── admin-app/                   → admin.clinicmind.in [Vercel]
│       ├── app/
│       │   ├── login/
│       │   │   └── page.tsx          ← Hardcoded superadmin only
│       │   └── (dashboard)/
│       │       ├── layout.tsx
│       │       ├── overview/
│       │       │   └── page.tsx      ← Platform stats
│       │       ├── hospitals/
│       │       │   ├── page.tsx      ← Sab hospitals (pending/verified/rejected)
│       │       │   └── [id]/
│       │       │       └── page.tsx  ← Approve / Reject / Ban
│       │       ├── doctors/
│       │       │   └── page.tsx      ← Sab doctors across hospitals
│       │       ├── patients/
│       │       │   └── page.tsx      ← Sab patients
│       │       ├── analytics/
│       │       │   └── page.tsx      ← AI-powered platform insights
│       │       └── settings/
│       │           └── page.tsx
│       │
│       ├── components/
│       │   ├── HospitalApprovalCard.tsx
│       │   └── PlatformStatsGrid.tsx
│       ├── middleware.ts             ← superadmin only
│       └── package.json
│
│
├── packages/                        ← Shared across all apps
│   │
│   ├── types/                       ← TypeScript types (MOST CRITICAL)
│   │   └── src/
│   │       ├── roles.ts             ← Role enum
│   │       ├── user.ts              ← Patient, Doctor, Staff types
│   │       ├── hospital.ts          ← Hospital, HospitalStatus
│   │       ├── doctor.ts            ← Doctor, VerificationStatus
│   │       ├── appointment.ts
│   │       ├── queue.ts             ← QueueToken, Socket events
│   │       ├── prescription.ts
│   │       └── index.ts
│   │
│   ├── ui/                          ← Shared components
│   │   └── src/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── DataTable.tsx
│   │       ├── StatusBadge.tsx      ← verified/pending/rejected badge
│   │       └── index.ts
│   │
│   ├── utils/
│   │   └── src/
│   │       ├── jwt.ts               ← decode/verify (client-side)
│   │       ├── dateUtils.ts
│   │       ├── phoneUtils.ts
│   │       └── index.ts
│   │
│   └── config/
│       └── src/
│           ├── roles.ts             ← ROLES constant object
│           ├── routes.ts            ← Protected routes list
│           ├── plans.ts             ← Free/Pro/Growth limits
│           └── index.ts
│
│
├── backend/
│   │
│   ├── api-server/                  → api.clinicmind.in [Render]
│   │   └── src/
│   │       ├── index.ts             ← Express + Socket.IO boot
│   │       ├── config/
│   │       │   ├── db.ts            ← MongoDB connect
│   │       │   └── env.ts           ← Zod env validate
│   │       │
│   │       ├── middlewares/
│   │       │   ├── auth.ts          ← JWT verify
│   │       │   ├── role.ts          ← Role guard factory
│   │       │   └── tenantGuard.ts   ← hospitalId isolation
│   │       │
│   │       ├── models/
│   │       │   ├── User.model.ts    ← All roles ek collection
│   │       │   ├── Hospital.model.ts
│   │       │   ├── Doctor.model.ts
│   │       │   ├── Patient.model.ts
│   │       │   ├── Staff.model.ts
│   │       │   ├── Appointment.model.ts
│   │       │   ├── QueueToken.model.ts
│   │       │   ├── Prescription.model.ts
│   │       │   └── Subscription.model.ts
│   │       │
│   │       ├── routes/
│   │       │   ├── auth.routes.ts         ← Login/register all roles
│   │       │   ├── hospital.routes.ts     ← Register, CRUD
│   │       │   ├── doctor.routes.ts       ← Add, invite, verify, remove
│   │       │   ├── staff.routes.ts
│   │       │   ├── patient.routes.ts
│   │       │   ├── appointment.routes.ts
│   │       │   ├── queue.routes.ts
│   │       │   ├── prescription.routes.ts
│   │       │   ├── whatsapp.routes.ts
│   │       │   └── admin.routes.ts        ← SuperAdmin only
│   │       │
│   │       ├── controllers/
│   │       │   ├── auth.controller.ts
│   │       │   ├── hospital.controller.ts
│   │       │   ├── doctor.controller.ts
│   │       │   ├── queue.controller.ts
│   │       │   └── prescription.controller.ts
│   │       │
│   │       ├── services/
│   │       │   ├── auth.service.ts
│   │       │   ├── hospital.service.ts
│   │       │   ├── doctor.service.ts
│   │       │   ├── invite.service.ts      ← Token generate, email/WA bhejo
│   │       │   ├── queue.service.ts
│   │       │   ├── whatsapp.service.ts
│   │       │   ├── notification.service.ts
│   │       │   └── ai.service.ts          ← FastAPI caller
│   │       │
│   │       └── socket/
│   │           ├── index.ts               ← Socket.IO init + auth
│   │           └── queue.socket.ts        ← Queue room events
│   │
│   └── ai-service/                  → ai.clinicmind.in [Render]
│       ├── app/
│       │   ├── main.py
│       │   ├── config.py
│       │   ├── routes/
│       │   │   ├── triage.py
│       │   │   ├── prescription.py
│       │   │   ├── drug_check.py
│       │   │   └── analytics.py
│       │   └── services/
│       │       ├── whisper_service.py
│       │       └── gemini_service.py
│       ├── requirements.txt
│       └── Dockerfile
│
├── turbo.json
├── pnpm-workspace.yaml
└── package.json