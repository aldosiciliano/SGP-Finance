# 🏦 SGP Finance — Sistema de Gestión de Gastos Personales

> **Versión:** 1.0  
> **Stack:** React + Tailwind · FastAPI · PostgreSQL · Docker  
> **Estado:** 🚧 En desarrollo activo

## 📋 Descripción

SGP Finance es un sistema web moderno para gestionar gastos personales con soporte multi-moneda (ARS/USD), diseñado para el contexto económico argentino. Permite registrar gastos, analizar patrones de consumo y seguir un portafolio de inversiones.

### ✨ Características principales

- **Registro de gastos** en pesos argentinos con conversión automática a USD
- **Categorización personalizada** con colores e íconos
- **Seguimiento de inversiones** (cripto, fondos, renta fija)
- **Cotización en tiempo real** del dólar (oficial/blue)
- **Reportes y análisis** con gráficos interactivos
- **Autenticación segura** con JWT

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                    CLIENTE (Browser)                 │
│              React 18 + Tailwind + Recharts          │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP / JSON
                       ▼
┌─────────────────────────────────────────────────────┐
│                  FASTAPI BACKEND                     │
│   ┌──────────┐  ┌──────────┐  ┌─────────────────┐  │
│   │  /auth   │  │ /gastos  │  │  /inversiones   │  │
│   └──────────┘  └──────────┘  └─────────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │ SQLAlchemy ORM
                       ▼
┌─────────────────────────────────────────────────────┐
│                   POSTGRESQL                         │
│   usuarios · gastos · categorias · inversiones       │
└─────────────────────────────────────────────────────┘
```

## 🚀 Instalación local

### Prerrequisitos

- Docker y Docker Compose
- Node.js 18+ (para desarrollo frontend)
- Python 3.11+ (para desarrollo backend)

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/aldosiciliano/sgp-finance.git
   cd sgp-finance
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

3. **Levantar servicios**
   ```bash
   docker compose up -d
   ```

4. **Acceder a la aplicación**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Documentación API: http://localhost:8000/docs

## 📊 Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | FastAPI (Python) |
| Base de datos | PostgreSQL |
| ORM | SQLAlchemy + Alembic |
| Autenticación | JWT |
| Gráficos | Recharts |
| Containerización | Docker |

## 🗂️ Estructura del proyecto

```
sgp-finance/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   ├── models/
│   │   ├── routers/
│   │   └── services/
│   ├── alembic/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🎯 Objetivo del proyecto

Este proyecto fue creado como parte de mi portafolio para demostrar:

- **Evolución tecnológica**: Migración desde VB.NET/Windows Forms a stack web moderno
- **Dominio full stack**: React + FastAPI + PostgreSQL + Docker
- **Contexto real**: Solución para problemas financieros argentinos (inflación, brecha cambiaria)
- **Best practices**: Arquitectura limpia, testing, CI/CD

## 📄 Licencia

MIT License - ver archivo [LICENSE](LICENSE) para detalles.

---
> 💡 **Nota**: Este proyecto está en desarrollo activo. ¡Seguime para ver el progreso!
