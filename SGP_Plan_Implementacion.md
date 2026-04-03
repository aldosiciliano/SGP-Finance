# 🗂️ SGP Web — Plan de Implementación
### Sistema de Gestión de Gastos Personales (Migración VB.NET → Full Stack Web)

> **Versión:** 1.0  
> **Fecha de inicio:** Abril 2026  
> **Stack:** React + Tailwind · FastAPI · PostgreSQL · Docker  
> **Objetivo CV:** Proyecto full stack completo, documentado y deployado

---

## 📌 Índice

1. [Visión general](#1-visión-general)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Arquitectura del sistema](#3-arquitectura-del-sistema)
4. [Modelo de datos](#4-modelo-de-datos)
5. [Fases de implementación](#5-fases-de-implementación)
6. [Estructura de carpetas](#6-estructura-de-carpetas)
7. [Endpoints de la API](#7-endpoints-de-la-api)
8. [Funcionalidades por módulo](#8-funcionalidades-por-módulo)
9. [Criterios de calidad para CV](#9-criterios-de-calidad-para-cv)
10. [Checklist de entrega](#10-checklist-de-entrega)

---

## 1. Visión general

El **SGP Web** es la reescritura moderna del sistema de gastos personales original desarrollado en VB.NET/Windows Forms. La nueva versión expone una API RESTful consumida por un frontend reactivo, con soporte para múltiples monedas (ARS/USD), seguimiento de portafolio de inversiones y visualización de datos financieros.

### Problema que resuelve
- Registro y categorización de gastos en ARS
- Conversión y seguimiento en USD como refugio de valor
- Análisis de portafolio de inversiones (cripto, fondos temáticos, renta fija)
- Visualización de tendencias de gasto mes a mes

### Valor diferencial para el CV
- Muestra **evolución tecnológica** (de VB.NET a full stack moderno)
- Dominio real del stack: FastAPI, React, PostgreSQL, Docker
- Proyecto con contexto financiero argentino (inflación, brecha cambiaria)
- Deployado y accesible públicamente

---

## 2. Stack tecnológico

| Capa | Tecnología | Justificación |
|---|---|---|
| Frontend | React 18 + Vite | Componentes reutilizables, SPA |
| Estilos | Tailwind CSS | Rápido, utility-first |
| Gráficos | Recharts | Gráficos financieros declarativos |
| Backend | FastAPI (Python) | Ya conocido, async, OpenAPI auto |
| ORM | SQLAlchemy + Alembic | Migraciones controladas |
| Base de datos | PostgreSQL | Relacional, robusto |
| Autenticación | JWT (python-jose) | Stateless, estándar |
| Containerización | Docker + Docker Compose | Reproducibilidad |
| CI/CD | GitHub Actions | Deploy automático |
| Deploy | Render / Railway (gratuito) | Portfolio público |

---

## 3. Arquitectura del sistema

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
│   ┌──────────┐  ┌──────────┐  ┌─────────────────┐  │
│   │/categorias│ │/reportes │  │   /divisas      │  │
│   └──────────┘  └──────────┘  └─────────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │ SQLAlchemy ORM
                       ▼
┌─────────────────────────────────────────────────────┐
│                   POSTGRESQL                         │
│   usuarios · gastos · categorias · inversiones       │
│   tipos_cambio · presupuestos · etiquetas            │
└─────────────────────────────────────────────────────┘
```

---

## 4. Modelo de datos

### Entidades principales

```sql
-- Usuarios
usuarios (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR UNIQUE NOT NULL,
  password    VARCHAR NOT NULL,         -- hash bcrypt
  nombre      VARCHAR,
  creado_en   TIMESTAMP DEFAULT NOW()
)

-- Categorías de gasto
categorias (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR NOT NULL,
  icono       VARCHAR,                  -- emoji o código de ícono
  color       VARCHAR,                  -- hex color
  usuario_id  INT REFERENCES usuarios
)

-- Gastos
gastos (
  id            SERIAL PRIMARY KEY,
  monto_ars     NUMERIC(12,2) NOT NULL,
  monto_usd     NUMERIC(12,2),          -- calculado al momento del registro
  descripcion   VARCHAR,
  fecha         DATE NOT NULL,
  categoria_id  INT REFERENCES categorias,
  usuario_id    INT REFERENCES usuarios,
  etiquetas     TEXT[]                  -- array de etiquetas libres
)

-- Inversiones
inversiones (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR NOT NULL,       -- "BTC", "Arca Ahorro USD", etc.
  tipo          VARCHAR NOT NULL,       -- crypto | fondo | acciones | renta_fija
  monto_ars     NUMERIC(12,2),
  monto_usd     NUMERIC(12,2),
  fecha_entrada DATE,
  notas         TEXT,
  usuario_id    INT REFERENCES usuarios
)

-- Tipo de cambio histórico (cache local)
tipos_cambio (
  id        SERIAL PRIMARY KEY,
  fecha     DATE NOT NULL,
  usd_ars   NUMERIC(10,4),
  fuente    VARCHAR                     -- "bluelytics", "manual"
)

-- Presupuestos mensuales
presupuestos (
  id            SERIAL PRIMARY KEY,
  categoria_id  INT REFERENCES categorias,
  monto         NUMERIC(12,2),
  mes           INT,
  anio          INT,
  usuario_id    INT REFERENCES usuarios
)
```

---

## 5. Fases de implementación

### ✅ Fase 0 — Setup del proyecto *(Semana 1)*

- [ ] Crear repositorio en GitHub con README inicial
- [ ] Configurar `docker-compose.yml` con FastAPI + PostgreSQL
- [ ] Inicializar proyecto React con Vite + Tailwind
- [ ] Configurar Alembic para migraciones
- [ ] Crear `.env.example` con variables necesarias
- [ ] Configurar GitHub Actions básico (lint + test)

**Entregable:** Proyecto levantando con `docker compose up`, sin errores.

---

### ✅ Fase 1 — Autenticación *(Semana 2)*

**Backend:**
- [ ] Modelo `Usuario` + migración
- [ ] Endpoint `POST /auth/register`
- [ ] Endpoint `POST /auth/login` → devuelve JWT
- [ ] Middleware de autenticación (dependencia FastAPI)
- [ ] Hash de contraseñas con `bcrypt`

**Frontend:**
- [ ] Pantalla de Login / Registro
- [ ] Contexto de autenticación (`AuthContext`)
- [ ] Persistencia del token en `localStorage`
- [ ] Rutas protegidas con `PrivateRoute`

**Entregable:** Registro, login y logout funcionando.

---

### ✅ Fase 2 — Gastos (CRUD core) *(Semana 3)*

**Backend:**
- [ ] Modelos `Gasto` + `Categoria` + migraciones
- [ ] CRUD completo para `/gastos`
- [ ] CRUD para `/categorias`
- [ ] Filtros: por fecha, categoría, rango de monto
- [ ] Paginación en listado de gastos

**Frontend:**
- [ ] Dashboard principal (esqueleto)
- [ ] Tabla de gastos con filtros
- [ ] Formulario de nuevo gasto (modal)
- [ ] Selector de categorías con colores/íconos
- [ ] Conversión ARS → USD automática al ingresar

**Entregable:** Alta, edición, eliminación y listado de gastos.

---

### ✅ Fase 3 — Tipo de cambio *(Semana 4)*

**Backend:**
- [ ] Integración con API [Bluelytics](https://api.bluelytics.com.ar/v2/latest)
- [ ] Cache local en tabla `tipos_cambio`
- [ ] Endpoint `GET /divisas/actual` → cotización del día
- [ ] Endpoint `GET /divisas/historico` → para gráfico

**Frontend:**
- [ ] Widget de cotización en el header (ARS/USD oficial + blue)
- [ ] Gráfico de cotización histórica (Recharts `LineChart`)
- [ ] Auto-cálculo de equivalente USD al registrar gasto

**Entregable:** Cotización en tiempo real integrada al flujo de gastos.

---

### ✅ Fase 4 — Inversiones *(Semana 5)*

**Backend:**
- [ ] Modelo `Inversion` + migración
- [ ] CRUD `/inversiones`
- [ ] Endpoint `GET /inversiones/resumen` → totales por tipo

**Frontend:**
- [ ] Pantalla de portafolio
- [ ] Tabla de activos con tipo, monto ARS/USD, fecha entrada
- [ ] Gráfico de torta por tipo de activo (Recharts `PieChart`)
- [ ] Card de resumen: total invertido / rendimiento estimado

**Entregable:** Portafolio de inversiones visible y editable.

---

### ✅ Fase 5 — Reportes y análisis *(Semana 6)*

**Backend:**
- [ ] `GET /reportes/mensual` → gastos agrupados por mes
- [ ] `GET /reportes/categorias` → distribución por categoría
- [ ] `GET /reportes/comparativa` → mes actual vs anterior
- [ ] `GET /presupuestos` + CRUD

**Frontend:**
- [ ] Pantalla de reportes
- [ ] Gráfico de barras: gasto mensual (últimos 6 meses)
- [ ] Gráfico de dona: distribución por categoría
- [ ] Barra de progreso de presupuesto por categoría
- [ ] Selector de rango de fechas

**Entregable:** Dashboard analítico completo.

---

### ✅ Fase 6 — Pulido y deploy *(Semana 7)*

- [ ] Responsive design completo (mobile-first)
- [ ] Manejo de errores global (toast notifications)
- [ ] Loading states y skeletons
- [ ] Tests básicos en FastAPI (`pytest`)
- [ ] Deploy backend en Render (free tier)
- [ ] Deploy frontend en Vercel
- [ ] README profesional con capturas y demo GIF
- [ ] Variables de entorno configuradas en producción

**Entregable:** App pública y enlace en el CV.

---

## 6. Estructura de carpetas

```
sgp-web/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── config.py          # Variables de entorno
│   │   │   ├── security.py        # JWT + bcrypt
│   │   │   └── database.py        # Sesión SQLAlchemy
│   │   ├── models/
│   │   │   ├── usuario.py
│   │   │   ├── gasto.py
│   │   │   ├── categoria.py
│   │   │   ├── inversion.py
│   │   │   └── tipo_cambio.py
│   │   ├── schemas/               # Pydantic schemas
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── gastos.py
│   │   │   ├── categorias.py
│   │   │   ├── inversiones.py
│   │   │   ├── divisas.py
│   │   │   └── reportes.py
│   │   └── services/              # Lógica de negocio
│   ├── alembic/                   # Migraciones
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                # Botones, inputs, modales
│   │   │   ├── charts/            # Wrappers de Recharts
│   │   │   └── layout/            # Navbar, Sidebar
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Gastos.jsx
│   │   │   ├── Inversiones.jsx
│   │   │   └── Reportes.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useGastos.js
│   │   ├── services/
│   │   │   └── api.js             # Axios instance + interceptores
│   │   └── App.jsx
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 7. Endpoints de la API

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/auth/register` | Registro de usuario | ❌ |
| POST | `/auth/login` | Login → JWT | ❌ |
| GET | `/gastos` | Listar gastos (filtros, paginación) | ✅ |
| POST | `/gastos` | Crear gasto | ✅ |
| PUT | `/gastos/{id}` | Editar gasto | ✅ |
| DELETE | `/gastos/{id}` | Eliminar gasto | ✅ |
| GET | `/categorias` | Listar categorías | ✅ |
| POST | `/categorias` | Crear categoría | ✅ |
| GET | `/inversiones` | Listar inversiones | ✅ |
| POST | `/inversiones` | Registrar inversión | ✅ |
| GET | `/inversiones/resumen` | Totales por tipo | ✅ |
| GET | `/divisas/actual` | Cotización del día | ✅ |
| GET | `/divisas/historico` | Historial de cotización | ✅ |
| GET | `/reportes/mensual` | Gastos por mes | ✅ |
| GET | `/reportes/categorias` | Distribución por categoría | ✅ |
| GET | `/presupuestos` | Presupuestos del usuario | ✅ |
| POST | `/presupuestos` | Crear presupuesto | ✅ |

---

## 8. Funcionalidades por módulo

### 📊 Dashboard
- Resumen del mes: total gastado ARS / USD equivalente
- Comparativa con el mes anterior (↑↓ %)
- Widget de cotización dólar (oficial, blue, MEP)
- Últimos 5 gastos registrados
- Alerta si superaste el presupuesto en alguna categoría

### 💸 Gastos
- Tabla paginada con búsqueda y filtros
- Filtrar por: categoría, fecha, rango de monto
- Formulario rápido de carga (tecla rápida `/`)
- Edición inline o en modal
- Exportar a CSV

### 📈 Inversiones
- Lista de activos con tipo, monto, fecha de entrada
- Valor total del portafolio en ARS y USD
- Gráfico de torta por tipo de activo
- Notas por activo (estrategia, plazo)

### 📉 Reportes
- Gráfico de barras: evolución mensual (últimos 6 meses)
- Gráfico de dona: distribución por categoría
- Progreso visual de presupuesto mensual
- Comparativa ingresos vs egresos (si se agrega módulo de ingresos)

---

## 9. Criterios de calidad para CV

| Criterio | Descripción |
|----------|-------------|
| **README** | Badges, descripción, capturas, instrucciones de instalación, link a demo |
| **Demo en vivo** | App deployada en Render/Vercel, accesible sin instalación |
| **OpenAPI docs** | FastAPI auto-genera `/docs` — mostrarlo como feature |
| **Historial de commits** | Commits atómicos con mensajes descriptivos (`feat:`, `fix:`, `docs:`) |
| **Variables de entorno** | `.env.example` completo, nunca secrets en el repo |
| **Manejo de errores** | API retorna errores descriptivos, frontend los muestra al usuario |
| **Responsive** | Funciona en mobile (importante para demos en persona) |
| **Tests** | Al menos tests de los endpoints críticos (auth, gastos) |

---

## 10. Checklist de entrega

### Código
- [ ] Repositorio público en GitHub
- [ ] `docker compose up` levanta todo sin errores
- [ ] Variables de entorno documentadas en `.env.example`
- [ ] Migraciones de base de datos con Alembic
- [ ] Tests en `pytest` para rutas críticas

### Documentación
- [ ] README con descripción, stack y capturas
- [ ] GIF o video de demo (30-60 seg)
- [ ] Sección "Instalación local" paso a paso
- [ ] Diagrama de arquitectura (el del punto 3)
- [ ] Link a la app deployada

### Frontend
- [ ] Login y registro funcionando
- [ ] CRUD de gastos completo
- [ ] Gráficos visibles con datos reales
- [ ] Diseño responsive (mobile + desktop)
- [ ] Manejo de errores con notificaciones

### Backend
- [ ] Autenticación JWT funcionando
- [ ] Todos los endpoints documentados en `/docs`
- [ ] Integración con Bluelytics para cotización
- [ ] Paginación implementada en listados

---

> 💡 **Tip final:** No hace falta terminar todo antes de subir al CV. Con las Fases 0-3 terminadas ya tenés un proyecto presentable. Agregás las demás fases iterativamente y lo mencionás como "en desarrollo activo".
