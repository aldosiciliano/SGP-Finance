# 🏦 SGP Finance

<div align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" alt="React 18">
  <img src="https://img.shields.io/badge/FastAPI-0.104-green?logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker" alt="Docker">
  <img src="https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome" alt="Chrome Extension">
</div>

<div align="center">
  <strong>Sistema de gestión de finanzas personales diseñado para Argentina</strong>
</div>

---

## ¿Qué es SGP Finance?

Una aplicación **web moderna y extensión de Chrome** para controlar tus gastos, presupuestos e inversiones con un enfoque en el contexto económico argentino. Accede a tus finanzas desde cualquier pestaña con un solo clic, y registra gastos rápidamente con atajos de teclado.

## Características destacadas

### 🚀 Extensión de Chrome
- **Side Panel integrado** - Accede a tu dashboard sin salir de tu pestaña actual
- **Gasto rápido con `Alt+G`** - Ventana flotante para registrar gastos en segundos
- **Wizard paso a paso** - Monto → Categoría → Descripción con navegación por teclado
- **Sincronización automática** - El dashboard se actualiza al guardar un gasto
- **Sesión persistente** - Mantiene tu sesión activa por 7 días

### 💰 Gastos y Categorías
- **Registro rápido** de gastos con descripción y etiquetas
- **Categorías personalizadas** con colores e íconos
- **Presupuestos mensuales** por categoría con alertas de uso
- **Filtros avanzados** por fecha, categoría y búsqueda

### 📊 Visualización y Reportes
- **Dashboard interactivo** con gráficos de evolución mensual
- **Análisis por categorías** con porcentajes y tendencias
- **Comparativas** entre períodos para identificar patrones

### 🔒 Seguridad y Rendimiento
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

# 4. Backend listo!
# API: http://localhost:8000/docs
```

### Instalación de la Extensión de Chrome

```bash
# 1. Construir la extensión
cd frontend
npm install
npm run build:extension

# 2. Cargar en Chrome
# - Abre chrome://extensions/
# - Activa "Modo de desarrollador"
# - Clic en "Cargar extensión sin empaquetar"
# - Selecciona la carpeta frontend/dist

# 3. Listo! Usa la extensión:
# - Clic en el ícono para abrir el Side Panel
# - Alt+G para gasto rápido desde cualquier pestaña
```

### Acceso Web (Opcional)

```bash
# Si prefieres usar la versión web
cd frontend
npm run dev
# Frontend: http://localhost:5173
```

---

## Tecnología

| Frontend | Backend | Base de Datos | Infraestructura |
|----------|---------|---------------|----------------|
| React 18 | FastAPI | PostgreSQL | Docker |
| Tailwind CSS | SQLAlchemy | Alembic | Chrome Extension |
| Recharts | JWT Auth | | |
| React Router | Pydantic | | |

---

## Para desarrolladores

```bash
# Desarrollo frontend web
cd frontend
npm install
npm run dev

# Build de la extensión
cd frontend
npm run build:extension
# Luego recarga la extensión en chrome://extensions

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
