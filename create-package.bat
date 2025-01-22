@echo off
setlocal EnableDelayedExpansion

:: Extract version from manifest.json
for /f "tokens=2 delims=:," %%a in ('type manifest.json ^| findstr "version"') do (
    set "version=%%a"
    set "version=!version:"=!"
    set "version=!version: =!"
)

:: Create zip file name with version
set "zipname=SeamlessAadSsoForEdge_v%version%.zip"

:: Remove any existing zip files
echo Cleaning up old packages...
del /f /q SeamlessAadSsoForEdge*.zip 2>nul
if exist "%zipname%" (
    echo Removing existing package: %zipname%
    del /f /q "%zipname%"
)

:: Create temporary file list
echo Creating package list...
set "tempfile=%temp%\files_to_zip.txt"
dir /b *.json *.js *.md LICENSE > "%tempfile%"
findstr /v /i "create-package.bat" "%tempfile%" > "%tempfile%.tmp"
move /y "%tempfile%.tmp" "%tempfile%" > nul

:: Create zip file using the file list
echo Creating package %zipname%...
powershell -Command "Get-Content '%tempfile%' | ForEach-Object { Compress-Archive -Path $_ -DestinationPath '%zipname%' -Update }"

:: Clean up
del "%tempfile%"

echo.
echo Package created successfully: %zipname%
echo.
pause