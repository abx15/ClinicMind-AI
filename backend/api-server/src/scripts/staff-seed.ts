import 'dotenv/config'
import dns from 'dns'
dns.setServers(['8.8.8.8', '8.8.4.4'])

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from '../models/User.model'
import { Hospital } from '../models/Hospital.model'

async function connect() {
  const uri = process.env.MONGODB_URI
  if (!uri) { console.error('MONGODB_URI missing'); process.exit(1) }
  await mongoose.connect(uri, { family: 4, serverSelectionTimeoutMS: 10000 })
  console.log('✅ Connected to MongoDB for staff seeding')
}

async function hash(pw: string) { return bcrypt.hash(pw, 12) }

// Staff names
const firstNames = [
  'Rahul', 'Priya', 'Amit', 'Anita', 'Ramesh', 'Sunita', 'Arjun', 'Kavita', 'Vikram', 'Meena',
  'Rajesh', 'Neha', 'Sanjay', 'Pooja', 'Deepak', 'Rashmi', 'Manish', 'Divya', 'Avinash', 'Swati',
  'Vijay', 'Anjali', 'Suresh', 'Kiran', 'Ravi', 'Shweta', 'Ajay', 'Preeti', 'Nitin', 'Richa',
  'Pankaj', 'Sonia', 'Karthik', 'Ankita', 'Mohan', 'Shilpa', 'Vivek', 'Nisha', 'Rohit', 'Aarti',
  'Anand', 'Priyanka', 'Siddharth', 'Megha', 'Harsh', 'Komal', 'Gaurav', 'Tanvi', 'Abhishek', 'Rashmi',
  'Prateek', 'Ishita', 'Tarun', 'Shreya', 'Mayank', 'Aditi', 'Kunal', 'Pooja', 'Rohit', 'Sneha',
  'Nikhil', 'Anusha', 'Varun', 'Radhika', 'Samarth', 'Tanya', 'Aditya', 'Isha', 'Rohan', 'Ananya',
  'Ayush', 'Diya', 'Arnav', 'Kavya', 'Reyansh', 'Myra', 'Vihaan', 'Anvi', 'Dhruv', 'Aarohi'
]

const lastNames = [
  'Sharma', 'Verma', 'Singh', 'Kumar', 'Gupta', 'Agarwal', 'Jain', 'Patel', 'Shah', 'Mehta',
  'Reddy', 'Nair', 'Iyer', 'Pillai', 'Menon', 'Nambiar', 'Chatterjee', 'Mukherjee', 'Banerjee', 'Chakraborty',
  'Ghosh', 'Sarkar', 'Majumdar', 'Das', 'Roy', 'Bose', 'Sen', 'Dutta', 'Chakraborty', 'Mandal',
  'Pillai', 'Nair', 'Menon', 'Pillai', 'Nambiar', 'Varma', 'Mishra', 'Tiwari', 'Pandey', 'Dubey',
  'Yadav', 'Jha', 'Thakur', 'Chauhan', 'Rathore', 'Shekhawat', 'Choudhary', 'Bhatia', 'Khanna', 'Malhotra',
  'Kapoor', 'Chopra', 'Kohli', 'Arora', 'Bajwa', 'Sandhu', 'Bhatia', 'Bedi', 'Ahluwalia', 'Gill',
  'Singh', 'Sidhu', 'Brar', 'Dhaliwal', 'Bains', 'Grewal', 'Saini', 'Bhullar', 'Sohal', 'Toor'
]

const staffRoles = ['Receptionist', 'Nurse', 'Lab Technician', 'Pharmacist', 'Billing Executive', 'Ward Boy', 'Security Guard', 'Housekeeping', 'Radiologist', 'Pathologist']

async function seedStaff() {
  await connect()

  console.log('\n👨‍💼 Starting staff seeding...\n')

  // Get all hospitals
  const hospitals = await Hospital.find({ status: 'verified' })
  console.log(`Found ${hospitals.length} verified hospitals`)

  if (hospitals.length === 0) {
    console.log('❌ No verified hospitals found. Please run large-seed first.')
    process.exit(1)
  }

  // Create 300 staff members
  for (let i = 0; i < 300; i++) {
    const hospital = hospitals[i % hospitals.length]
    const firstName = firstNames[i % firstNames.length]
    const lastName = lastNames[i % lastNames.length]
    const role = staffRoles[i % staffRoles.length]
    
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}staff${i}@${hospital.name.toLowerCase().replace(/\s+/g, '')}.com`
    
    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log(`⏭️  Staff already exists: ${email}`)
      continue
    }
    
    await User.create({
      name: `${firstName} ${lastName}`,
      email,
      phone: `8000000${String(i).padStart(4, '0')}`,
      passwordHash: await hash('Staff@123'),
      role: 'staff',
      hospitalId: hospital._id,
      isVerified: true,
      isActive: true,
    })

    if ((i + 1) % 50 === 0) {
      console.log(`✅ Created ${i + 1}/300 staff members`)
    }
  }

  // ── SUMMARY ────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════')
  console.log('✅ STAFF SEED COMPLETE — 300 staff members created:')
  console.log('═══════════════════════════════════════════════════════════')
  console.log('👨‍💼 STAFF MEMBERS: 300 (all verified and active)')
  console.log('🏥 HOSPITALS:       Staff distributed across all verified hospitals')
  console.log('🔑 LOGIN CREDENTIAL: Staff@123 (for all staff accounts)')
  console.log('📱 STAFF CAN NOW LOGIN to hospital apps!')
  console.log('═══════════════════════════════════════════════════════════\n')

  await mongoose.disconnect()
  console.log('🔌 Disconnected. Staff seed complete!')
  process.exit(0)
}

seedStaff().catch((err) => {
  console.error('❌ Staff seed failed:', err)
  process.exit(1)
})
