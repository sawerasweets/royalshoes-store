# SAWERA E-Commerce Database & Asset Restore Script
# Usage: powershell -ExecutionPolicy Bypass -File scripts/restore.ps1 [-BackupFolder <Path>]

param (
    [Parameter(Mandatory=$false)]
    [string]$BackupFolder
)

$ErrorActionPreference = "Stop"
$MysqlPath = "C:\xampp\mysql\bin\mysql.exe"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " SAWERA RESTORE UTILITY (Phase 22)        " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Identify Target Backup Folder
if (-not $BackupFolder) {
    $BackupsRoot = "c:\antigravity\backups"
    if (-not (Test-Path $BackupsRoot)) {
        Write-Error "No backups directory found at $BackupsRoot"
    }
    $Latest = Get-ChildItem -Path $BackupsRoot -Directory | Sort-Object CreationTime -Descending | Select-Object -First 1
    if (-not $Latest) {
        Write-Error "No existing backup snapshots found in $BackupsRoot"
    }
    $BackupFolder = $Latest.FullName
}

Write-Host "Using backup snapshot: $BackupFolder" -ForegroundColor Yellow

# 2. Check for SQL Dump
$SqlDump = Get-ChildItem -Path $BackupFolder -Filter "*.sql" | Select-Object -First 1
if (-not $SqlDump) {
    Write-Error "No SQL dump file found in $BackupFolder"
}

Write-Host "[1/2] Restoring database 'sawera_store_db' from $($SqlDump.Name)..." -ForegroundColor Yellow
if (Test-Path -Path $MysqlPath) {
    Get-Content $SqlDump.FullName | & $MysqlPath --user=root --host=127.0.0.1 sawera_store_db
    Write-Host "  -> Database restored successfully." -ForegroundColor Green
} else {
    Write-Error "mysql.exe CLI not found at $MysqlPath"
}

# 3. Check for Assets Zip
$AssetsZip = Get-ChildItem -Path $BackupFolder -Filter "*.zip" | Select-Object -First 1
if ($AssetsZip) {
    Write-Host "[2/2] Restoring public assets from $($AssetsZip.Name)..." -ForegroundColor Yellow
    $PublicDir = "c:\antigravity\public"
    Expand-Archive -Path $AssetsZip.FullName -DestinationPath $PublicDir -Force
    Write-Host "  -> Assets restored to $PublicDir" -ForegroundColor Green
} else {
    Write-Host "No assets archive found to restore, skipping." -ForegroundColor Gray
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " RESTORATION COMPLETE" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
