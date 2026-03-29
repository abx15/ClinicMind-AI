# 🔐 Login Credentials Guide - All Roles

## 🏥 Patient Portal (http://localhost:3000)
- **Email**: ramesh@test.com
- **Password**: Patient@123
- **Role**: Patient

## 🏢 Hospital Admin Portal (http://localhost:3001)
- **Email**: admin@apollo.com
- **Password**: Hospital@123
- **Role**: Hospital Admin

## 🛡️ Super Admin Portal (http://localhost:3002)
- **Email**: admin@clinicmind.in
- **Password**: Admin@123456
- **Role**: Super Admin

## 👨‍⚕️ Doctor Login (via Hospital Portal)
- **Email**: priya@apollo.com
- **Password**: Doctor@123
- **Role**: Doctor (Verified)

## 👩‍⚕️ Staff Login (via Hospital Portal)
- **Email**: staff@apollo.com
- **Password**: Staff@123
- **Role**: Staff

## 📝 Additional Test Users

### More Patients:
- **Email**: sunita@test.com | **Password**: Patient@123
- **Email**: arjun@test.com | **Password**: Patient@123

### More Doctors:
- **Email**: rahul@apollo.com | **Password**: Doctor@123 (Pending Verification)
- **Email**: anita@apollo.com | **Password**: Doctor@123 (Verified)

## 🚀 Features Available

### Patient Features:
- ✅ Browse hospitals
- ✅ Search doctors
- ✅ Book appointments
- ✅ View prescriptions
- ✅ Track appointments

### Hospital Admin Features:
- ✅ Manage doctors
- ✅ Manage staff
- ✅ Appointment scheduling
- ✅ Queue management
- ✅ Revenue reports

### Super Admin Features:
- ✅ Platform overview
- ✅ Hospital approvals
- ✅ User management
- ✅ System analytics
- ✅ Revenue tracking

## 🔧 Login Flow

1. **Patient**: Direct login → Browse hospitals
2. **Hospital Admin**: Login → Dashboard → Management
3. **Super Admin**: Login → Overview → Platform control
4. **Doctor/Staff**: Login via Hospital portal → Role-based access

## 🌐 Access URLs

| Portal | URL | Port |
|--------|-----|------|
| Patient | http://localhost:3000 | 3000 |
| Hospital | http://localhost:3001 | 3001 |
| Admin | http://localhost:3002 | 3002 |

All login pages have demo credentials displayed for easy testing!
