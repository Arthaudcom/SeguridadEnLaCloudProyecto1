FROM python:3.11-slim

RUN apt-get update && apt-get install -y netcat-openbsd

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x /app/wait-for-it.sh

ENTRYPOINT ["/app/wait-for-it.sh", "db", "5432", "--"]

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
