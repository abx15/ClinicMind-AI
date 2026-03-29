# 🚀 ClinicMind AI - Quick Start Guide

## 📋 Prerequisites
- **Node.js** 20+ 
- **Python** 3.11+
- **pnpm** package manager

## ⚡ Quick Start (Recommended)

### Option 1: Use the Run Script (Easiest)
```bash
# Double-click or run from command line
run.cmd
```

This script will:
- ✅ Check all prerequisites
- ✅ Install all dependencies automatically  
- ✅ Set up Python virtual environment
- ✅ Start all 5 services
- ✅ Open all applications in your browser

### Option 2: Manual Setup

#### 1. Install Dependencies
```bash
pnpm install
```

#### 2. Set Up Python Environment
```bash
cd backend/ai-service
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn motor python-dotenv openai google-generativeai python-multipart
```

#### 3. Start All Services

**Terminal 1 - Frontend + API Server:**
```bash
pnpm dev
```

**Terminal 2 - AI Service:**
```bash
cd backend/ai-service
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

## 🌐 Access Points

| Application | URL | Port | Description |
|-------------|-----|------|-------------|
| **Patient App** | http://localhost:3000 | 3000 | Hospital search & booking |
| **Hospital App** | http://localhost:3001 | 3001 | Hospital management dashboard |
| **Admin App** | http://localhost:3002 | 3002 | Super admin control panel |
| **API Server** | http://localhost:5000 | 5000 | REST API + Socket.IO |
| **AI Service** | http://localhost:8000 | 8000 | Python AI service |

## 🔑 Default Login Credentials

### Super Admin Portal
- **Email**: admin@clinicmind.in
- **Password**: Admin@123456
- **Access**: http://localhost:3002

### Hospital Admin Portal  
- **Email**: admin@apollo.com
- **Password**: Hospital@123
- **Access**: http://localhost:3001

### Patient Registration
- **Access**: http://localhost:3000
- **Click "Register" to create new patient account**

## 🏥 Features Available

### Patient Portal (Port 3000)
- ✅ Browse verified hospitals
- ✅ Search by city, specialization
- ✅ View doctor profiles
- ✅ Book appointments
- ✅ Real-time queue tracking
- ✅ Prescription history

### Hospital Admin Portal (Port 3001)
- ✅ Dashboard with analytics
- ✅ Doctor management
- ✅ Staff management  
- ✅ Appointment scheduling
- ✅ Queue management
- ✅ Revenue reports

### Super Admin Portal (Port 3002)
- ✅ Platform overview
- ✅ Hospital approvals
- ✅ User management
- ✅ Revenue analytics
- ✅ System health monitoring

## 🔧 Health Check URLs

- **API Health**: http://localhost:5000/health
- **AI Health**: http://localhost:8000/health

## 🛠️ Troubleshooting

### Port Already in Use?
```bash
# Find process using port
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID_NUMBER> /F
```

### Python Issues?
```bash
# Check Python version
python --version

# Recreate virtual environment
cd backend/ai-service
rmdir /s venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Node.js Issues?
```bash
# Clear node modules
rm -rf node_modules
rm pnpm-lock.yaml

# Reinstall
pnpm install
```

### Database Connection?
- Check `.env` files in `backend/api-server/` and `backend/ai-service/`
- Ensure MongoDB URI is correct
- Verify network connectivity

## 📱 Development Workflow

1. **Make changes** to any component
2. **Auto-reload** happens automatically
3. **Check browser** for updates
4. **All services** hot-reload on file changes

## 🎨 Styling Notes

- Uses **Tailwind CSS** with custom design system
- Color palette: Teal primary, with blue/amber/purple accents
- Custom components defined in `globals.css`
- Responsive design for all screen sizes

## 🚀 Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions.

## 📞 Support

If you face any issues:
1. Check the troubleshooting section above
2. Ensure all prerequisites are installed
3. Verify environment variables are set
4. Check browser console for errors

---

**Happy Coding! 🎉**
