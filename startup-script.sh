#!/bin/bash

sudo apt update -y && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose unzip curl

sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

cd /home/ubuntu

if [ ! -d "proyecto-backend" ]; then
  git clone --branch NewRelease https://github.com/Arthaudcom/SeguridadEnLaCloudProyecto1.git proyecto-backend
else
  cd proyecto-backend
  git reset --hard
  git pull origin NewRelease
fi

cd proyecto-backend
rm -rf frontend

export DATABASE_URL="postgresql://postgres:postgres@35.238.5.109:5432/blog_database"
export BACKEND_PORT=8000

sudo docker-compose down || true
sudo docker-compose up --build -d

echo "[Unit]
Description=Docker Compose Backend Service
Requires=docker.service
After=docker.service

[Service]
Restart=always
User=ubuntu
WorkingDirectory=/home/ubuntu/proyecto-backend
ExecStart=/usr/bin/docker-compose up --build -d
ExecStop=/usr/bin/docker-compose down

[Install]
WantedBy=multi-user.target" | sudo tee /etc/systemd/system/backend.service

sudo systemctl daemon-reload
sudo systemctl enable backend.service
sudo systemctl start backend.service
