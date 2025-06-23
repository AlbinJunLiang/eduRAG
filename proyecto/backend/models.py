from pydantic import BaseModel

class ConsultaInput(BaseModel):
    pregunta: str
    modelo: str | None = "gemini-1.5-flash-8b"
    
class ConsultaInputSimple(BaseModel):
    pregunta: str
    modelo: str  # modelo recibido desde el cliente
