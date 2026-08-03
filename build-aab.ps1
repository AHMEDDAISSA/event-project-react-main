# Simple PowerShell script to clean and build Android App Bundle (.aab)

# Save current location (project root)
$ProjectRoot = Get-Location

# === Verify line in file ===
$FilePath = "app\services\apiPaths.js"
$TargetLine = "  baseURL: 'https://ditte.creativedms.pro/api/',"

Write-Host "🔍 Checking if file '$FilePath' contains : live Server URL line ..."

if (Test-Path $FilePath) {
    $FileContent = Get-Content $FilePath
    if ($FileContent -contains $TargetLine) {
        Write-Host "✅ Line found — continuing build..."
    } else {
        Write-Host "❌ live Server URL line is commented in $FilePath"
        Write-Host "⛔ Please check your configuration."
        exit 1  # Stops script execution with error code
    }
} else {
    Write-Host "❌ File not found: $FilePath"
    Write-Host "⛔ setting file not found."
    exit 1
}

Write-Host "Cleaning Android build..."
Set-Location android
.\gradlew.bat clean

Write-Host "Building release AAB..."
.\gradlew.bat bundleRelease

# Return back to project root
Set-Location $ProjectRoot

Write-Host "`n✅ Build complete!"
Write-Host "Your AAB is located at:"
Write-Host "android\app\build\outputs\bundle\release\app-release.aab"
