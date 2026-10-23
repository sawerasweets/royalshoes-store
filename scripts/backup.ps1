# SAWERA E-Commerce Database & Asset Backup Script
# Usage: powershell -ExecutionPolicy Bypass -File scripts/backup.ps1

$ErrorActionPreference = "Stop"

$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupDir = "c:\antigravity\backups\$Timestamp"
$MysqlDumpPath = "C:\xampp\mysql\bin\mysqldump.exe"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " SAWERA BACKUP UTILITY (Phase 22)         " -ForegroundColor Cyan
Write-Host " Timestamp: $Timestamp" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Create backup directory
if (-not (Test-Path -Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
}

# 1. Export MySQL Database: sawera_store_db
$SqlOutputFile = "$BackupDir\sawera_store_db_$Timestamp.sql"
Write-Host "[1/3] Dumping MySQL database 'sawera_store_db'..." -ForegroundColor Yellow

if (Test-Path -Path $MysqlDumpPath) {
    & $MysqlDumpPath --user=root --host=127.0.0.1 --single-transaction --routines --triggers sawera_store_db | Out-File -FilePath $SqlOutputFile -Encoding utf8
    $SqlFileSize = (Get-Item $SqlOutputFile).Length / 1KB
    Write-Host "  -> Database dump complete: $([math]::Round($SqlFileSize, 2)) KB" -ForegroundColor Green
} else {
    Write-Warning "mysqldump.exe not found at standard path $MysqlDumpPath. Attempting Node.js fallback exporter..."
    $env:PATH = "C:\Users\hp\nodejs;C:\Users\hp\AppData\Roaming\Antigravity\bin;" + $env:PATH
    node c:\antigravity\scripts\export-backup.js "$SqlOutputFile"
}

# 2. Archive Brand and Product Public Assets
$AssetsZip = "$BackupDir\sawera_public_assets_$Timestamp.zip"
Write-Host "[2/3] Archiving public brand assets and product photography..." -ForegroundColor Yellow

$PublicDir = "c:\antigravity\public"
if (Test-Path -Path $PublicDir) {
    Compress-Archive -Path "$PublicDir\*" -DestinationPath $AssetsZip -CompressionLevel Optimal
    $ZipSize = (Get-Item $AssetsZip).Length / 1KB
    Write-Host "  -> Assets archived: $([math]::Round($ZipSize, 2)) KB" -ForegroundColor Green
}

# 3. Create Manifest
$ManifestFile = "$BackupDir\backup_manifest.json"
$Manifest = [PSCustomObject]@{
    Brand = "SAWERA"
    Edition = "BLACK & GOLD"
    Database = "sawera_store_db"
    Timestamp = $Timestamp
    SqlDump = "$SqlOutputFile"
    AssetsZip = "$AssetsZip"
    Version = "1.0.0"
}
$Manifest | ConvertTo-Json -Depth 3 | Out-File -FilePath $ManifestFile -Encoding utf8

Write-Host "[3/3] Manifest generated at $ManifestFile" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " BACKUP COMPLETE: $BackupDir" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
