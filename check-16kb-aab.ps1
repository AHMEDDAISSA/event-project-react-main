# ===== CONFIG =====
$aabPath = "android\app\build\outputs\bundle\release\app-release.aab"
$extractPath = "aab_extracted"
$readelf = "$env:LOCALAPPDATA\Android\Sdk\ndk\26.1.10909125\toolchains\llvm\prebuilt\windows-x86_64\bin\llvm-readelf.exe"

Write-Host "🔍 Checking REAL 16KB compatibility..." -ForegroundColor Cyan

# Clean
if (Test-Path $extractPath) {
    Remove-Item -Recurse -Force $extractPath
}

Expand-Archive -Path $aabPath -DestinationPath $extractPath

# Get all .so files and group by name and architecture
$soFiles = Get-ChildItem -Path "$extractPath\base\lib" -Recurse -Filter *.so

# Create a hashtable to track results per architecture
$archResults = @{}

foreach ($file in $soFiles) {
    # Extract architecture from path (e.g., base/lib/arm64-v8a/xxx.so)
    $arch = ($file.Directory.Name)
    $libName = $file.Name
    
    # Run readelf on the file
    $output = & $readelf -l $file.FullName
    
    # Check for LOAD segments
    $alignLines = $output | Select-String "LOAD"
    
    $has4k = $false
    $has16k = $false
    
    foreach ($line in $alignLines) {
        if ($line -match "0x1000") {
            $has4k = $true
        }
        elseif ($line -match "0x4000") {
            $has16k = $true
        }
    }
    
    # Store result
    if (-not $archResults.ContainsKey($arch)) {
        $archResults[$arch] = @{}
    }
    
    if ($has4k -and -not $has16k) {
        $archResults[$arch][$libName] = "4KB ONLY"
    }
    elseif ($has16k) {
        $archResults[$arch][$libName] = "16KB Compatible"
    }
    else {
        $archResults[$arch][$libName] = "Unknown"
    }
}

# Display results grouped by architecture
Write-Host "`n📊 Results by Architecture:" -ForegroundColor Cyan
Write-Host "=" * 50

foreach ($arch in $archResults.Keys | Sort-Object) {
    Write-Host "`n🏗️  Architecture: $arch" -ForegroundColor Yellow
    
    $hasIncompatible = $false
    
    foreach ($libName in $archResults[$arch].Keys | Sort-Object) {
        $status = $archResults[$arch][$libName]
        
        if ($status -eq "4KB ONLY") {
            Write-Host "  ❌ $libName - $status" -ForegroundColor Red
            $hasIncompatible = $true
        }
        elseif ($status -eq "16KB Compatible") {
            Write-Host "  ✅ $libName - $status" -ForegroundColor Green
        }
        else {
            Write-Host "  ⚠️ $libName - $status" -ForegroundColor Yellow
        }
    }
    
    if ($hasIncompatible) {
        Write-Host "  🚨 This architecture has 4KB-only libraries!" -ForegroundColor Red
    } else {
        Write-Host "  🎉 This architecture is fully 16KB compatible!" -ForegroundColor Green
    }
}

# Summary
Write-Host "`n" + "=" * 50
Write-Host "📋 Summary:" -ForegroundColor Cyan

$anyIncompatible = $false
foreach ($arch in $archResults.Keys) {
    $incompatibleCount = ($archResults[$arch].Values | Where-Object { $_ -eq "4KB ONLY" }).Count
    if ($incompatibleCount -gt 0) {
        $anyIncompatible = $true
        Write-Host "  ❌ $arch : $incompatibleCount incompatible library(s)" -ForegroundColor Red
    } else {
        Write-Host "  ✅ $arch : All libraries compatible" -ForegroundColor Green
    }
}

Write-Host ""

if ($anyIncompatible) {
    Write-Host "🚨 Your app is NOT 16KB safe for all architectures!" -ForegroundColor Red
    Write-Host "   You need to rebuild native libraries with 16KB alignment support." -ForegroundColor Yellow
} else {
    Write-Host "🎉 Your app is fully 16KB compatible across all architectures!" -ForegroundColor Green
}