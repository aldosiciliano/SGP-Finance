# 🏦 SGP Finance

<div align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" alt="React 18">
  <img src="https://img.shields.io/badge/FastAPI-0.104-green?logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker" alt="Docker">
</div>

<div align="center">
  <strong>Sistema de gestión de finanzas personales diseñado para Argentina</strong>
</div>

---

## ¿Qué es SGP Finance?

Una aplicación web moderna para controlar tus gastos, presupuestos e inversiones con un enfoque en el contexto económico argentino. Ideal para quienes quieren tomar el control de sus finanzas personales con herramientas simples pero potentes.

## Características destacadas

### Gastos y Categorías
- **Registro rápido** de gastos con descripción y etiquetas
- **Categorías personalizadas** con colores e íconos
- **Presupuestos mensuales** por categoría con alertas de uso
- **Filtros avanzados** por fecha, categoría y búsqueda

### Visualización y Reportes
- **Dashboard interactivo** con gráficos de evolución mensual
- **Análisis por categorías** con porcentajes y tendencias
- **Comparativas** entre períodos para identificar patrones


### Seguridad y Rendimiento
- **Autenticación segura** con JWT y cookies HttpOnly
- **Protección CSRF** y validación de datos
- **Diseño responsive** que funciona en cualquier dispositivo
- **Carga rápida** con optimización de assets

---

## Inicio rápido

### Requisitos
- Docker
- 5 minutos de tu tiempo

### Instalación
```bash
# 1. Clonar el proyecto
git clone https://github.com/aldosiciliano/sgp-finance.git
cd sgp-finance

# 2. Configurar entorno
cp .env.example .env
# Editar .env con tus datos (opcional para demo)

# 3. Iniciar todo con Docker
docker compose up -d

# 4. Listo! Accede a:
# Frontend: http://localhost:5173
# API: http://localhost:8000/docs
```

---

## Tecnología

| Frontend | Backend | Base de Datos | Infraestructura |
|----------|---------|---------------|----------------|
| React 18 | FastAPI | PostgreSQL | Docker |
| Tailwind CSS | SQLAlchemy | Alembic | |
| Recharts | JWT Auth | | |

---

## Para desarrolladores

```bash
# Desarrollo frontend
cd frontend
npm install
npm run dev

# Desarrollo backend
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

<div align="center">
  <p>Hecho con <span style="color: #e74c3c;">&#10084;</span> en Argentina</p>
</div>
