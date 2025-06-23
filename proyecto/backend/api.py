from fastapi import APIRouter
from pydantic import BaseModel
import requests
from .models import ConsultaInput, ConsultaInputSimple
from .gemini_client import client
from .document_loader import cargar_documentos, dividir_y_vectorizar

router = APIRouter()

# Carga y vectorización al inicio
documents = cargar_documentos()
vector_db = dividir_y_vectorizar(documents)

# Endpoint 1: usa gemini_client para generar respuesta
@router.post("/google/consulta")
def consulta_educacion_vial(input: ConsultaInput):
    query = input.pregunta
    modelo = getattr(input, "modelo", "gemini-1.5-flash-8b")  # para que no falle si no viene 'modelo'

    relevant_chunks = vector_db.similarity_search(query, k=8)
    contexto = "\n".join([chunk.page_content for chunk in relevant_chunks])

    prompt = f"""
Eres un experto en educación vial. Solo puedes responder preguntas estrictamente relacionadas con educación vial.
Utiliza exclusivamente la siguiente información como contexto para generar la respuesta:

{contexto}

Pregunta: {query}
"""
    try:
        response = client.models.generate_content(
            model=modelo,
            contents=prompt
        )
        return {"respuesta": response.text}
    except Exception as e:
        return {"error": str(e)}

# Endpoint 2: hace POST externo a API HTTP remota

@router.post("/vps/consulta")
def consulta_educacion_vial_externa(input: ConsultaInputSimple):
    query = input.pregunta
    modelo = input.modelo  # aquí recibes el modelo

    relevant_chunks = vector_db.similarity_search(query, k=8)
    contexto = "\n".join([chunk.page_content for chunk in relevant_chunks])

    payload = {
        "model": modelo,  # se usa el modelo recibido
        "messages": [{
            "role": "user",
            "content": f"""Eres un experto en educación vial. Solo puedes responder preguntas estrictamente relacionadas con educación vial.
Debes ignorar y rechazar cualquier pregunta que no esté dentro de este ámbito.
Utiliza exclusivamente la siguiente información como contexto para generar la respuesta:

{contexto}

Pregunta: {query}
"""
        }],
        "stream": False,
        "think": False
    }

    try:
        response = requests.post("http://31.97.43.76:11434/api/chat", json=payload)
        return {"respuesta": response.json().get("message", {}).get("content", "Sin respuesta")}
    except Exception as e:
        return {"error": str(e)}