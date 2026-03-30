import 'dotenv/config'
import dns from 'dns'
dns.setServers(['8.8.8.8', '8.8.4.4'])

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
  console.log('✅ Connected to MongoDB for large seeding')
}

async function hash(pw: string) { return bcrypt.hash(pw, 12) }

// Sample data arrays
const hospitalNames = [
  'Apollo Hospitals', 'Fortis Healthcare', 'Max Healthcare', 'Manipal Hospitals', 'Narayana Health',
  'Columbia Asia', 'Medanta', 'Wockhardt Hospitals', 'Jaslok Hospital', 'Lilavati Hospital',
  'Kokilaben Hospital', 'Hinduja Hospital', 'Breach Candy Hospital', 'Sir H.N. Reliance Foundation',
  'Tata Memorial Hospital', 'AIIMS', 'PGIMER', 'CMC Vellore', 'SGPGI Lucknow', 'Safdarjung Hospital',
  'Ram Manohar Lohia', 'G.B. Pant Hospital', 'Lok Nayak Hospital', 'Safdarjung', 'Dr. RML Hospital',
  'BLK Super Speciality', 'Artemis Hospital', 'Paras Hospital', 'Metro Hospital', 'Yashoda Hospitals',
  'KIMS Hospital', 'Care Hospitals', 'Continental Hospitals', 'Sunshine Hospitals', 'Star Hospitals',
  'Global Hospitals', 'Rainbow Hospital', 'Kamineni Hospitals', 'Oscar Hospitals', 'Citizens Hospital',
  'Asian Institute of Gastroenterology', 'KIMS Secunderabad', 'Yashoda Hospitals Secunderabad',
  'Gleneagles Global Hospitals', 'Basavatarakam Indo American Cancer Hospital', 'Omega Hospitals',
  'Prasad Hospitals', 'Aware Gleneagles Global Hospitals', 'Malla Reddy Hospitals', 'Sri Sai Ram Hospital',
  'Ankura Hospital', 'Malla Reddy Narayana Multispeciality', 'Hyderabad Kids Hospital', 'KIMS Cuddles',
  'Rainbow Children Hospital', 'Little Stars Children Hospital', 'Buds to Blossom Hospital',
  'Kangaroo Care Hospital', 'Cloudnine Hospital', 'Motherhood Hospital', 'Cradle Hospital',
  'Fernandez Hospital', 'Prashanth Hospitals', 'Kamineni Hospitals', 'Srinivasa Hospitals',
  'Ovum Hospitals', 'GarbhaGudi IVF', 'Morpheus IVF', 'Nova IVF', 'Indira IVF',
  'Cloudnine IVF', 'Milann Fertility', 'Bourn Hall Clinic', 'GyneWorld', 'Maya Women Hospital',
  'Aparna Hospitals', 'KIMS Hospital Kondapur', 'Citizens Hospital Kukatpally',
  'Continental Hospitals Gachibowli', 'Apollo Hospitals Jubilee Hills', 'Apollo Hyderguda',
  'Apollo Secunderabad', 'Apollo Whitefield', 'Apollo Bannerghatta', 'Apollo Sheshadripur',
  'Fortis Hospital Bannerghatta', 'Fortis Hospital Cunningham', 'Fortis Hospital Rajajinagar',
  'Fortis Hospital Nagarbhavi', 'Manipal Hospital Whitefield', 'Manipal Hospital Old Airport',
  'Manipal Hospital Jayanagar', 'Manipal Hospital Sarjapur', 'Manipal Hospital Malleswaram',
  'Narayana Health Whitefield', 'Narayana Health Rajajinagar', 'Narayana Health HSR Layout',
  'Narayana Health Electronic City', 'Narayana Health Koramangala', 'Narayana Health Marathahalli',
  'Columbia Asia Hebbal', 'Columbia Asia Whitefield', 'Columbia Asia Yeshwanthpur',
  'Columbia Asia Sarjapur', 'Columbia Asia Kalyan Nagar', 'Medanta Whitefield',
  'Medanta Gurgaon', 'Medanta Patna', 'Medanta Lucknow', 'Medanta Jaipur', 'Medanta Indirapuram',
  'Wockhardt Hospital Mumbai', 'Wockhardt Hospital Bangalore', 'Wockhardt Hospital Nagpur',
  'Wockhardt Hospital Rajkot', 'Wockhardt Hospital Surat', 'Wockhardt Hospital Vadodara',
  'Jaslok Hospital Mumbai', 'Jaslok Hospital Pune', 'Jaslok Hospital Delhi', 'Jaslok Hospital Bangalore',
  'Lilavati Hospital Mumbai', 'Lilavati Hospital Thane', 'Lilavati Hospital Navi Mumbai',
  'Kokilaben Hospital Mumbai', 'Kokilaben Hospital Pune', 'Kokilaben Hospital Delhi',
  'Hinduja Hospital Mumbai', 'Hinduja Hospital Pune', 'Hinduja Hospital Delhi', 'Hinduja Hospital Bangalore',
  'Breach Candy Hospital Mumbai', 'Breach Candy Hospital Pune', 'Breach Candy Hospital Delhi',
  'Sir H.N. Reliance Mumbai', 'Sir H.N. Reliance Delhi', 'Sir H.N. Reliance Bangalore', 'Sir H.N. Reliance Hyderabad',
  'Tata Memorial Mumbai', 'Tata Memorial Delhi', 'Tata Memorial Bangalore', 'Tata Memorial Hyderabad',
  'AIIMS Delhi', 'AIIMS Mumbai', 'AIIMS Bangalore', 'AIIMS Hyderabad', 'AIIMS Chennai',
  'AIIMS Kolkata', 'AIIMS Lucknow', 'AIIMS Bhopal', 'AIIMS Bhubaneswar', 'AIIMS Jodhpur',
  'AIIMS Raipur', 'AIIMS Rishikesh', 'AIIMS Patna', 'AIIMS Guwahati', 'PGIMER Chandigarh',
  'CMC Vellore', 'CMC Ludhiana', 'SGPGI Lucknow', 'Safdarjung Delhi', 'Ram Manohar Lohia Delhi',
  'G.B. Pant Delhi', 'Lok Nayak Delhi', 'Dr. RML Delhi', 'BLK Super Speciality Delhi',
  'Artemis Gurgaon', 'Artemis Delhi', 'Paras Gurgaon', 'Paras Delhi', 'Metro Delhi',
  'Metro Gurgaon', 'Metro Noida', 'Yashoda Hyderabad', 'Yashoda Secunderabad', 'KIMS Hyderabad',
  'KIMS Secunderabad', 'Care Hyderabad', 'Care Bangalore', 'Continental Hyderabad',
  'Sunshine Hyderabad', 'Star Hyderabad', 'Global Hyderabad', 'Rainbow Hyderabad',
  'Kamineni Hyderabad', 'Oscar Hyderabad', 'Citizens Hyderabad', 'Asian Gastro Hyderabad'
]

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
  'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
  'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad',
  'Meerut', 'Rajkot', 'Kalyan-Dombivli', 'Vasai-Virar', 'Varanasi', 'Srinagar', 'Dhanbad', 'Jodhpur',
  'Coimbatore', 'Amritsar', 'Raipur', 'Allahabad', 'Ranchi', 'Gwalior', 'Vijayawada', 'Jabalpur',
  'Madurai', 'Gurgaon', 'Guwahati', 'Chandigarh', 'Hubli-Dharwad', 'Mysore', 'Tiruchirappalli', 'Thiruvananthapuram',
  'Bhilai', 'Kochi', 'Cuttack', 'Firozabad', 'Bhubaneswar', 'Noida', 'Warangal', 'Salem',
  'Raigarh', 'Thiruvallur', 'Guntur', 'Bikaner', 'Ajmer', 'Kolhapur', 'Ujjain', 'Loni', 'Siliguri',
  'Jalandhar', 'Tirupur', 'Sangli', 'Navi Mumbai', 'Bhilwara', 'Rourkela', 'Tirupati', 'Ratlam',
  'Panipat', 'Karnal', 'Sholapur', 'Tumkur', 'Kozhikode', 'Akola', 'Ichalkaranji', 'Tirunelveli',
  'Bhiwani', 'Rajahmundry', 'Nellore', 'Sambalpur', 'Bilaspur', 'Mirzapur', 'Ramagundam', 'Anand',
  'Aurangabad', 'Bharatpur', 'Gurgaon', 'Durgapur', 'Imphal', 'Rourkela', 'Hapur', 'Palwal'
]

const specializations = [
  'Cardiology', 'Orthopedic', 'Pediatrics', 'Neurology', 'General Medicine', 'Dermatology',
  'Gynecology', 'Ophthalmology', 'ENT', 'Psychiatry', 'Urology', 'Nephrology', 'Gastroenterology',
  'Pulmonology', 'Endocrinology', 'Rheumatology', 'Hematology', 'Oncology', 'Surgery',
  'Plastic Surgery', 'Neurosurgery', 'Cardiothoracic Surgery', 'Pediatric Surgery', 'Orthopedic Surgery',
  'Urological Surgery', 'Vascular Surgery', 'General Surgery', 'Laparoscopic Surgery', 'Bariatric Surgery',
  'Colorectal Surgery', 'Breast Surgery', 'Hand Surgery', 'Spine Surgery', 'Joint Replacement Surgery',
  'Sports Medicine', 'Pain Management', 'Critical Care', 'Emergency Medicine', 'Anesthesiology',
  'Radiology', 'Pathology', 'Microbiology', 'Clinical Psychology', 'Dietetics', 'Physiotherapy',
  'Occupational Therapy', 'Speech Therapy', 'Audiology', 'Genetics', 'Immunology', 'Allergy',
  'Infectious Diseases', 'Tropical Medicine', 'Travel Medicine', 'Occupational Health', 'Public Health',
  'Family Medicine', 'Community Medicine', 'Preventive Medicine', 'Geriatrics', 'Palliative Care',
  'Hospice Care', 'Sleep Medicine', 'Aviation Medicine', 'Underwater Medicine', 'Hyperbaric Medicine'
]

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

async function generateLargeSeed() {
  await connect()

  console.log('\n🌱 Starting LARGE database seed...\n')

  // ── 1. SUPERADMIN (already exists) ─────────────────────────────────
  let superadmin = await User.findOne({ email: 'admin@clinicmind.in' })
  if (!superadmin) {
    superadmin = await User.create({
      name: 'Arun Kumar',
      email: 'admin@clinicmind.in',
      phone: '9129939972',
      passwordHash: await hash('Admin@123456'),
      role: 'superadmin',
      isVerified: true,
      isActive: true,
    })
    console.log('✅ Superadmin created: admin@clinicmind.in / Admin@123456')
  } else {
    console.log('⏭️  Superadmin already exists')
  }

  // ── 2. CREATE 200 HOSPITALS ────────────────────────────────────────
  console.log('\n🏥 Creating 200 hospitals...')
  const hospitals = []
  
  for (let i = 0; i < 200; i++) {
    const hospitalName = hospitalNames[i % hospitalNames.length]
    const city = cities[i % cities.length]
    const slug = `${hospitalName.toLowerCase().replace(/\s+/g, '-')}-${city.toLowerCase()}-${i}`
    
    // Create hospital admin
    const hospitalAdminEmail = `admin${i}@${hospitalName.toLowerCase().replace(/\s+/g, '')}.com`
    const hospitalAdmin = await User.create({
      name: `${hospitalName} Admin`,
      email: hospitalAdminEmail,
      phone: `9000000${String(i).padStart(4, '0')}`,
      passwordHash: await hash('Hospital@123'),
      role: 'hospital_admin',
      isVerified: true,
      isActive: true,
    })

    // Create hospital
    const hospital = await Hospital.create({
      name: hospitalName,
      slug,
      address: `${Math.floor(Math.random() * 999) + 1}, ${['MG Road', 'Park Street', 'Connaught Place', ' Brigade Road', 'Anna Salai'][i % 5]}`,
      city,
      pincode: String(Math.floor(Math.random() * 900000) + 100000),
      licenseNumber: `${city.substring(0, 2).toUpperCase()}-${2024}-${String(i).padStart(3, '0')}`,
      phone: `0${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90000000) + 10000000}`,
      email: `info@${hospitalName.toLowerCase().replace(/\s+/g, '')}.com`,
      adminUserId: hospitalAdmin._id,
      status: i < 180 ? 'verified' : (i < 190 ? 'pending' : 'rejected'),
      plan: ['free', 'pro', 'growth'][i % 3],
      description: `${hospitalName} is a leading multi-specialty hospital in ${city} providing comprehensive healthcare services.`,
      specializations: specializations.slice(Math.floor(Math.random() * 10), Math.floor(Math.random() * 20) + 10),
      verifiedAt: i < 180 ? new Date() : undefined,
      verifiedBy: i < 180 ? superadmin._id : undefined,
    })

    // Update hospital admin's hospitalId
    await User.findByIdAndUpdate(hospitalAdmin._id, { hospitalId: hospital._id })
    
    hospitals.push(hospital)
    
    if ((i + 1) % 20 === 0) {
      console.log(`✅ Created ${i + 1}/200 hospitals`)
    }
  }

  // ── 3. CREATE 500 DOCTORS ────────────────────────────────────────
  console.log('\n👨‍⚕️ Creating 500 doctors...')
  
  for (let i = 0; i < 500; i++) {
    const hospital = hospitals[i % hospitals.length]
    const firstName = firstNames[i % firstNames.length]
    const lastName = lastNames[i % lastNames.length]
    const doctorName = `Dr. ${firstName} ${lastName}`
    const specialization = specializations[i % specializations.length]
    
    const doctorEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${hospital.name.toLowerCase().replace(/\s+/g, '')}.com`
    
    const isVerified = Math.random() > 0.2 // 80% verified
    
    const user = await User.create({
      name: doctorName,
      email: doctorEmail,
      phone: `9000000${String(500 + i).padStart(4, '0')}`,
      passwordHash: await hash('Doctor@123'),
      role: 'doctor',
      hospitalId: hospital._id,
      isVerified: isVerified,
      isActive: true,
    })

    await Doctor.create({
      userId: user._id,
      hospitalId: hospital._id,
      name: doctorName,
      specialization,
      qualifications: ['MBBS', 'MD', 'DM', 'MS', 'MCh'].slice(0, Math.floor(Math.random() * 3) + 2),
      experience: Math.floor(Math.random() * 20) + 1,
      bio: `Experienced ${specialization.toLowerCase()} with expertise in patient care and treatment.`,
      consultationFee: Math.floor(Math.random() * 1500) + 500,
      isVerified: isVerified,
      isPublic: isVerified,
      verifiedBy: isVerified ? hospital.adminUserId : undefined,
      verifiedAt: isVerified ? new Date() : undefined,
    })

    if ((i + 1) % 50 === 0) {
      console.log(`✅ Created ${i + 1}/500 doctors`)
    }
  }

  // ── 4. CREATE 1000 PATIENTS ────────────────────────────────────────
  console.log('\n👥 Creating 1000 patients...')
  
  for (let i = 0; i < 1000; i++) {
    const firstName = firstNames[i % firstNames.length]
    const lastName = lastNames[i % lastNames.length]
    
    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`,
      phone: `9${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      passwordHash: await hash('Patient@123'),
      role: 'patient',
      isVerified: true,
      isActive: true,
    })

    await Patient.create({ userId: user._id })

    if ((i + 1) % 100 === 0) {
      console.log(`✅ Created ${i + 1}/1000 patients`)
    }
  }

  // ── 5. CREATE STAFF ───────────────────────────────────────────────
  console.log('\n👨‍💼 Creating staff members...')
  
  for (let i = 0; i < 200; i++) {
    const hospital = hospitals[i % hospitals.length]
    const firstName = firstNames[i % firstNames.length]
    const lastName = lastNames[i % lastNames.length]
    
    await User.create({
      name: `${firstName} ${lastName}`,
      email: `staff${i}@${hospital.name.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: `8000000${String(i).padStart(4, '0')}`,
      passwordHash: await hash('Staff@123'),
      role: 'staff',
      hospitalId: hospital._id,
      isVerified: true,
      isActive: true,
    })
  }

  // ── SUMMARY ────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════════')
  console.log('✅ LARGE SEED COMPLETE — Massive dataset created:')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('🏥 HOSPITALS:      200 (180 verified, 20 pending/rejected)')
  console.log('👨‍⚕️ DOCTORS:       500 (400 verified, 100 pending)')
  console.log('👥 PATIENTS:       1000 (all verified)')
  console.log('👨‍💼 STAFF:         200 (all verified)')
  console.log('👤 SUPERADMIN:    1 (admin@clinicmind.in / Admin@123456)')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('🌐 All data properly connected and ready for frontend!')
  console.log('📱 Public portal will show 180 verified hospitals')
  console.log('🔍 Each hospital has 2-3 doctors on average')
  console.log('🎯 Perfect for testing scalability and UI performance!')
  console.log('═══════════════════════════════════════════════════════════════\n')

  await mongoose.disconnect()
  console.log('🔌 Disconnected. Large seed complete!')
  process.exit(0)
}

generateLargeSeed().catch((err) => {
  console.error('❌ Large seed failed:', err)
  process.exit(1)
})
