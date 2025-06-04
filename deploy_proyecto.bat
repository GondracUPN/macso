@echo off
echo ==============================
echo  🚀 Iniciando despliegue...
echo ==============================
echo.

:: 1. Compilar el frontend
echo 🔧 Compilando el frontend...
cd frontend
call npm run build
cd ..

:: 2. Construir la imagen de Docker
echo 🐳 Construyendo la imagen de Docker...
docker build -t gcr.io/maccso/proyecto .

:: 3. Subir la imagen a Google Cloud
echo ☁️ Subiendo la imagen a Google Cloud...
docker push gcr.io/maccso/proyecto

:: 4. Desplegar en Google Cloud Run
echo 🚀 Desplegando en Google Cloud Run...
gcloud run deploy proyecto --image gcr.io/maccso/proyecto --platform managed --region us-central1 --allow-unauthenticated --port 8080 
echo.
echo ==============================
echo ✅ Despliegue completado 🚀🎉
echo ==============================
pause
