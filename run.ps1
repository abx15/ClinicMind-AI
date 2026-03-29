# ClinicMind AI - PowerShell Setup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "     ClinicMind AI - Development Server" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Python is installed
try {
    $pythonVersion = python --version
    Write-Host "✅ Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Python is not installed!" -ForegroundColor Red
    Write-Host "Please install Python from https://python.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if pnpm is installed
try {
    $pnpmVersion = pnpm --version
    Write-Host "✅ pnpm: $pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  pnpm not found, installing..." -ForegroundColor Yellow
    npm install -g pnpm
}

# Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
pnpm install

# Check if virtual environment exists
if (-not (Test-Path "backend\ai-service\venv")) {
    Write-Host "🐍 Creating Python virtual environment..." -ForegroundColor Blue
    Set-Location backend\ai-service
    python -m venv venv
    Set-Location ..\..
}

# Install Python dependencies
Write-Host "🐍 Installing Python dependencies..." -ForegroundColor Blue
Set-Location backend\ai-service
& venv\Scripts\Activate.ps1
pip install fastapi uvicorn motor python-dotenv openai google-generativeai python-multipart
Set-Location ..\..

# Start all services
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "     Starting Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🚀 Starting Frontend + API Server..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/k", "pnpm dev" -WindowStyle Normal

Write-Host "🤖 Starting AI Service..." -ForegroundColor Green
Start-Sleep -Seconds 3
$aiCommand = 'cd backend\ai-service & venv\Scripts\activate & uvicorn app.main:app --reload --port 8000'
Start-Process -FilePath "cmd" -ArgumentList "/k", $aiCommand -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "     Services Starting..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🌐 Access Points:" -ForegroundColor Yellow
Write-Host "Patient App:     http://localhost:3000" -ForegroundColor White
Write-Host "Hospital App:    http://localhost:3001" -ForegroundColor White
Write-Host "Admin App:       http://localhost:3002" -ForegroundColor White
Write-Host "API Server:      http://localhost:5000" -ForegroundColor White
Write-Host "AI Service:      http://localhost:8000" -ForegroundColor White
Write-Host ""

Write-Host "🔑 Default Login:" -ForegroundColor Yellow
Write-Host "Super Admin:     admin@clinicmind.in / Admin@123456" -ForegroundColor White
Write-Host "Hospital Admin:   admin@apollo.com / Hospital@123" -ForegroundColor White
Write-Host ""

Write-Host "🌍 Opening applications in browser..." -ForegroundColor Blue
Start-Sleep -Seconds 3

Start-Process "http://localhost:3000"
Start-Process "http://localhost:3001" 
Start-Process "http://localhost:3002"
Start-Process "http://localhost:5000/health"
Start-Process "http://localhost:8000/health"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "     All Services Started Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Keep this window open to run all services." -ForegroundColor Yellow
Write-Host "Press CTRL+C in individual windows to stop services." -ForegroundColor Yellow
Write-Host ""

Read-Host "Press Enter to continue..."
