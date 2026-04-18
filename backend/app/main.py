from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.routers import auth, categorias, gastos, presupuestos, reportes

app = FastAPI(
    title="SGP Finance API",
    description="Sistema de Gestión de Gastos Personales",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-CSRF-Token"],
)


@app.middleware("http")
async def csrf_protection(request: Request, call_next):
    protected_methods = {"POST", "PUT", "PATCH", "DELETE"}
    exempt_paths = {"/auth/login", "/auth/register"}

    if request.method not in protected_methods or request.url.path in exempt_paths:
        return await call_next(request)

    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        return await call_next(request)

    access_cookie = request.cookies.get(settings.cookie_name)
    if not access_cookie:
        return await call_next(request)

    csrf_cookie = request.cookies.get(settings.csrf_cookie_name)
    csrf_header = request.headers.get(settings.csrf_header_name)

    if not csrf_cookie or not csrf_header or csrf_cookie != csrf_header:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"detail": "CSRF token inválido o ausente"},
        )

    return await call_next(request)

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
