# QAYDNOMA: Bu faylni VMware ichidagi Windows Server 2019 ga ko'chirib o'tkazing
# Va u yerda PowerShell ni Administrator huquqida ochib, ushbu manzilga kirib ishga tushiring: .\server-install.ps1

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "   Windows Server 2019 Avtomatik Sozlash Dasturi       " -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Cyan

# 1. Chocolatey o'rnatish (Dasturlarni avtomat yuklash uchun paket menejeri)
Write-Host "[1/5] Chocolatey paket menejeri o'rnatilmoqda..." -ForegroundColor Yellow
if (!(Test-Path "$env:ProgramData\chocolatey\bin\choco.exe")) {
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
} else {
    Write-Host "Chocolatey allaqachon o'rnatilgan!" -ForegroundColor Green
}

# 2. Node.js va Git o'rnatish
Write-Host "[2/5] Node.js va Git o'rnatilmoqda..." -ForegroundColor Yellow
choco install git nodejs-lts -y --force

# Yangi dasturlarni yo'llarini (Path) joriy sessiyaga yangilash
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# 3. PM2 va Serve o'rnatish
Write-Host "[3/5] PM2 va Serve (Node paketlari) o'rnatilmoqda..." -ForegroundColor Yellow
npm install -g pm2 serve pm2-windows-startup
pm2-startup install

# 4. GitHub dan loyihani tortish
Write-Host "[4/5] GitHub dan loyihangiz yuklanmoqda" -ForegroundColor Yellow
$repoUrl = Read-Host "Iltimos, GitHub loyihangizni manzilini (HTTPS linkini) kiriting"
$projectName = "cyber-lms-production"

Set-Location C:\
if (Test-Path $projectName) {
    Write-Host "Bu papka allaqachon mavjud. Yangilanmoqda..." -ForegroundColor Cyan
    Set-Location $projectName
    git pull
} else {
    git clone $repoUrl $projectName
    Set-Location $projectName
}

# 5. Loyiha papkalariga kirib kutubxonalarni o'rnatish
Write-Host "[5/5] Backend va Frontend kutubxonalari o'rnatilmoqda..." -ForegroundColor Yellow

# Backend uchun
if (Test-Path "backend") {
    Write-Host "Backend papkasi topildi, npm install qilinmoqda..."
    Set-Location backend
    npm install
    # .env.example dan .env yaratish
    if ((Test-Path ".env.example") -and !(Test-Path ".env")) {
        Copy-Item .env.example .env
        Write-Host "Backend uchun .env fayli yaratildi. Bazani sozlashni unutmang!" -ForegroundColor Green
    }
    Set-Location ..
}

# Asosiy papka (Yoki Frontend) uchun
if (Test-Path "package.json") {
    Write-Host "Asosiy papkada npm install qilinmoqda..."
    npm install
    
    # .env.example dan .env yaratish
    if ((Test-Path ".env.example") -and !(Test-Path ".env")) {
        Copy-Item .env.example .env
        Write-Host "Frontend uchun .env fayli yaratildi." -ForegroundColor Green
    }
}

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "BARCHA DASTURLAR VA LOYIHA O'RNATILDI!" -ForegroundColor Green
Write-Host "Keyingi qadamlar:" -ForegroundColor Cyan
Write-Host "1. .env fayllariga kirib parollar va ma'lumotlarni o'zgartiring."
Write-Host "2. Backendni ishga tushiring: cd backend -> pm2 start npm --name 'backend' -- run start"
Write-Host "3. Frontendni build qiling: npm run build -> pm2 start serve --name 'frontend' -- -s dist -l 3000"
Write-Host "4. Firewall dan kerakli portlarni oching."
Write-Host "=======================================================" -ForegroundColor Cyan

Read-Host "Oynani yopish uchun Enter tugmasini bosing..."
