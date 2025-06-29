from fastapi import FastAPI
from backend import api  # Importa api.py como módulo del paquete

app = FastAPI()
app.include_router(api.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
