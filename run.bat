@echo off
echo [JB Card Picker] Iniciando servidor HTTP en el puerto 8000...
start cmd /k "python -m http.server 8000"
timeout /t 2 >nul
start http://localhost:8000/jb_cartas.html
