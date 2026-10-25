@echo off
rem Doble clic para desplegar toda la tienda. Para solo la web o solo el
rem servidor, abre una terminal y usa: bash deploy.sh frontend  /  bash deploy.sh backend
cd /d "%~dp0"
"C:\Program Files\Git\bin\bash.exe" deploy.sh
echo.
pause
