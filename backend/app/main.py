from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, categorias, gastos, presupuestos, reportes

app = FastAPI(
    title="SGP Finance API",
    description="Sistema de Gestión de Gastos Personales",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,  # Importante para cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(auth.router)
app.include_router(categorias.router)
app.include_router(gastos.router)
app.include_router(presupuestos.router)
app.include_router(reportes.router)

@app.get("/")
async def root():
    return {"message": "SGP Finance API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
