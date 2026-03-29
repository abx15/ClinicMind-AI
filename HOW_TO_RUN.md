# 🚀 How to Run ClinicMind AI

## ⚡ Quick Start Options

### Option 1: PowerShell (Recommended)
```powershell
# Open PowerShell in project folder and run:
.\run.ps1
```

### Option 2: Command Prompt (CMD)
```cmd
# Open CMD in project folder and run:
run.cmd
```

### Option 3: Quick Start (CMD)
```cmd
# Open CMD in project folder and run:
quick-start.bat
```

### Option 4: Manual Start

**Terminal 1 (Frontend + API):**
```bash
pnpm dev
```

**Terminal 2 (AI Service):**
```bash
cd backend\ai-service
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

## 🔑 Login Credentials

| Portal | Email | Password | URL |
|--------|-------|----------|------|
| **Super Admin** | admin@clinicmind.in | Admin@123456 | http://localhost:3002 |
| **Hospital Admin** | admin@apollo.com | Hospital@123 | http://localhost:3001 |
| **Patient** | Register new account | - | http://localhost:3000 |

## 🌐 Access URLs

- **Patient App**: http://localhost:3000
- **Hospital App**: http://localhost:3001  
- **Admin App**: http://localhost:3002
- **API Health**: http://localhost:5000/health
- **AI Health**: http://localhost:8000/health

## ⚠️ Important Notes

### For PowerShell Users:
- Use `.\run.ps1` (with the dot-slash)
- If you get execution policy error, run: `Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process`

### For CMD Users:  
- Use `run.cmd` or `quick-start.bat`
- Both scripts work the same way

### Troubleshooting:
1. **Port already in use?** Close other applications or restart computer
2. **Dependencies missing?** Scripts install automatically
3. **Python errors?** Scripts create virtual environment automatically
4. **Node.js errors?** Make sure Node.js 20+ is installed

## 🎯 What Each Script Does

### `run.ps1` (PowerShell)
- ✅ Checks all prerequisites
- ✅ Installs dependencies automatically
- ✅ Creates Python virtual environment
- ✅ Starts all services in separate windows
- ✅ Opens all applications in browser
- ✅ Colorful output with status updates

### `run.cmd` (Batch)
- ✅ Same features as PowerShell version
- ✅ Works on any Windows system
- ✅ Automatic dependency installation
- ✅ Browser opening

### `quick-start.bat` (Fast)
- ⚡ Quick start without checks
- 🌐 Opens browsers immediately
- 🚀 Starts services fast

---

**🎉 Choose any option above to get started!**
