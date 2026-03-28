import 'dotenv/config'
import dns from 'dns'
dns.setServers(['8.8.8.8', '8.8.4.4']) // DNS fix here too

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from '../models/User.model'
import { Hospital } from '../models/Hospital.model'
import { Doctor } from '../models/Doctor.model'
import { Patient } from '../models/Patient.model'

async function connect() {
  const uri = process.env.MONGODB_URI
  if (!uri) { console.error('MONGODB_URI missing'); process.exit(1) }
  await mongoose.connect(uri, { family: 4, serverSelectionTimeoutMS: 10000 })
  console.log('✅ Connected to MongoDB for seeding')
}

async function hash(pw: string) { return bcrypt.hash(pw, 12) }

async function seed() {
  await connect()

  console.log('\n🌱 Starting database seed...\n')

  // ── 1. SUPERADMIN ─────────────────────────────────
  let superadmin = await User.findOne({ email: 'admin@clinicmind.in' })
  if (!superadmin) {
    superadmin = await User.create({
      name:         'Arun Kumar',
      email:        'admin@clinicmind.in',
      phone:        '9129939972',
      passwordHash: await hash('Admin@123456'),
      role:         'superadmin',
      isVerified:   true,
      isActive:     true,
    })
    console.log('✅ Superadmin created: admin@clinicmind.in / Admin@123456')
  } else {
    console.log('⏭️  Superadmin already exists')
  }

  // ── 2. HOSPITAL ADMIN ──────────────────────────────
  let hospitalAdmin = await User.findOne({ email: 'admin@apollo.com' })
  if (!hospitalAdmin) {
    hospitalAdmin = await User.create({
      name:         'Apollo Admin',
      email:        'admin@apollo.com',
      phone:        '9000000001',
      passwordHash: await hash('Hospital@123'),
      role:         'hospital_admin',
      isVerified:   true,
      isActive:     true,
    })
    console.log('✅ Hospital Admin created: admin@apollo.com / Hospital@123')
  } else {
    console.log('⏭️  Hospital Admin already exists')
  }

  // ── 3. HOSPITAL ────────────────────────────────────
  let hospital = await Hospital.findOne({ slug: 'apollo-hospitals-pune' })
  if (!hospital) {
    hospital = await Hospital.create({
      name:            'Apollo Hospitals',
      slug:            'apollo-hospitals-pune',
      address:         'Plot No. 13, Bund Garden Road',
      city:            'Pune',
      pincode:         '411001',
      licenseNumber:   'MH-2024-001',
      phone:           '02026127777',
      email:           'info@apollopune.com',
      adminUserId:     hospitalAdmin._id,
      status:          'verified',
      plan:            'pro',
      description:     'Apollo Hospitals is a leading multi-specialty hospital in Pune.',
      specializations: ['Cardiology','Orthopedic','Pediatrics','Neurology','General Medicine'],
      verifiedAt:      new Date(),
      verifiedBy:      superadmin._id,
    })
    // Update hospital admin's hospitalId
    await User.findByIdAndUpdate(hospitalAdmin._id, { hospitalId: hospital._id })
    console.log('✅ Hospital created: Apollo Hospitals, Pune (verified)')
  } else {
    console.log('⏭️  Hospital already exists')
  }

  // ── 4. DOCTORS ─────────────────────────────────────
  const doctorsData = [
    {
      name:            'Dr. Priya Sharma',
      email:           'priya@apollo.com',
      phone:           '9000000002',
      specialization:  'Cardiologist',
      qualifications:  ['MBBS','MD (Cardiology)','DM'],
      experience:      8,
      bio:             'Expert in interventional cardiology with 8+ years experience.',
      consultationFee: 800,
      isVerified:      true,
    },
    {
      name:            'Dr. Rahul Mehta',
      email:           'rahul@apollo.com',
      phone:           '9000000003',
      specialization:  'Orthopedic Surgeon',
      qualifications:  ['MBBS','MS (Orthopedics)'],
      experience:      5,
      bio:             'Specialist in joint replacement and sports injuries.',
      consultationFee: 700,
      isVerified:      false,
    },
    {
      name:            'Dr. Anita Verma',
      email:           'anita@apollo.com',
      phone:           '9000000004',
      specialization:  'Pediatrician',
      qualifications:  ['MBBS','MD (Pediatrics)'],
      experience:      12,
      bio:             'Child specialist with expertise in neonatal care.',
      consultationFee: 600,
      isVerified:      true,
    },
  ]

  for (const d of doctorsData) {
    const existing = await User.findOne({ email: d.email })
    if (!existing) {
      const user = await User.create({
        name:         d.name,
        email:        d.email,
        phone:        d.phone,
        passwordHash: await hash('Doctor@123'),
        role:         'doctor',
        hospitalId:   hospital._id,
        isVerified:   d.isVerified,
        isActive:     true,
      })
      await Doctor.create({
        userId:          user._id,
        hospitalId:      hospital._id,
        name:            d.name,
        specialization:  d.specialization,
        qualifications:  d.qualifications,
        experience:      d.experience,
        bio:             d.bio,
        consultationFee: d.consultationFee,
        isVerified:      d.isVerified,
        isPublic:        d.isVerified,
        verifiedBy:      d.isVerified ? hospitalAdmin._id : undefined,
        verifiedAt:      d.isVerified ? new Date() : undefined,
      })
      console.log(`✅ Doctor created: ${d.email} / Doctor@123 (verified: ${d.isVerified})`)
    } else {
      console.log(`⏭️  Doctor already exists: ${d.email}`)
    }
  }

  // ── 5. STAFF ───────────────────────────────────────
  let staff = await User.findOne({ email: 'staff@apollo.com' })
  if (!staff) {
    staff = await User.create({
      name:         'Reena Receptionist',
      email:        'staff@apollo.com',
      phone:        '9000000005',
      passwordHash: await hash('Staff@123'),
      role:         'staff',
      hospitalId:   hospital._id,
      isVerified:   true,
      isActive:     true,
    })
    console.log('✅ Staff created: staff@apollo.com / Staff@123')
  } else {
    console.log('⏭️  Staff already exists')
  }

  // ── 6. PATIENTS ────────────────────────────────────
  const patientsData = [
    { name: 'Ramesh Kumar',  email: 'ramesh@test.com', phone: '9111111001' },
    { name: 'Sunita Devi',   email: 'sunita@test.com', phone: '9111111002' },
    { name: 'Arjun Singh',   email: 'arjun@test.com',  phone: '9111111003' },
  ]

  for (const p of patientsData) {
    const existing = await User.findOne({ email: p.email })
    if (!existing) {
      const user = await User.create({
        name:         p.name,
        email:        p.email,
        phone:        p.phone,
        passwordHash: await hash('Patient@123'),
        role:         'patient',
        isVerified:   true,
        isActive:     true,
      })
      await Patient.create({ userId: user._id })
      console.log(`✅ Patient created: ${p.email} / Patient@123`)
    } else {
      console.log(`⏭️  Patient already exists: ${p.email}`)
    }
  }

  // ── SUMMARY ────────────────────────────────────────
  console.log('\n═══════════════════════════════════════')
  console.log('✅ SEED COMPLETE — Test credentials:')
  console.log('═══════════════════════════════════════')
  console.log('SUPERADMIN:      admin@clinicmind.in   / Admin@123456')
  console.log('HOSPITAL ADMIN:  admin@apollo.com       / Hospital@123')
  console.log('DOCTOR (verified): priya@apollo.com    / Doctor@123')
  console.log('DOCTOR (pending):  rahul@apollo.com    / Doctor@123')
  console.log('STAFF:           staff@apollo.com       / Staff@123')
  console.log('PATIENT:         ramesh@test.com        / Patient@123')
  console.log('═══════════════════════════════════════\n')

  await mongoose.disconnect()
  console.log('🔌 Disconnected. Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
