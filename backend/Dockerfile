FROM python:3.11-slim

WORKDIR /app

# TODO: REvisar la estabilidad de instalar deps cad vez que se buildea el contendor
# Instalar dependencias del sistema de forma eficiente
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fuente
COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
