# 🧠 Proyecto RAG con Gemini y LangChain

Este proyecto implementa un sistema de Recuperación Aumentada con Generación (RAG) utilizando embeddings generados con **Google Gemini**, procesamiento con **LangChain**, y almacenamiento con **ChromaDB**. El backend está construido en Python.

---

## ✅ Requisitos previos

- Tener instalado **Python 3.12** o superior.
- Conexión a internet para acceder a la API de Google Gemini.
- Crear un archivo `.env` con tu clave de API.
  

---

## 📦 Dependencias

El proyecto utiliza las siguientes bibliotecas principales:

- **FastAPI**: Framework para crear APIs modernas y rápidas.
- **Uvicorn**: Servidor ASGI para correr el backend.
- **Pydantic**: Validación y manejo de datos.
- **LangChain**: Framework para procesamiento de lenguaje con modelos generativos.
- **langchain-community**: Conectores adicionales para LangChain.
- **google-generativeai**: Cliente oficial para acceder a los modelos de Gemini.
- **sentence-transformers**: Alternativa para embeddings (si se desea comparar).
- **chromadb**: Base vectorial ligera para almacenar y consultar embeddings.
- **python-dotenv**: Cargar variables de entorno desde un archivo `.env`.

---

## 🔧 Instalación

1. Abre la consola (CMD, PowerShell o terminal).
2. Dirígete a la carpeta del proyecto:
   ```bash
   cd ruta/a/tu/proyecto
   
## Para instalar dependencias
pip install -r requirements.txt

## Para ejecutar el backend
python -m backend.main

## Para probar la API REST

Este documento describe cómo probar una API REST que responde preguntas utilizando modelos generativos como `gemma3:1b`. Se utilizan varios endpoints para realizar las consultas.

---

## 📍 Endpoints disponibles

Puedes realizar una solicitud `POST` a cualquiera de los siguientes endpoints:

1. `https://bustling-tiny-angle.glitch.me/api/proxy?servicio=vps`
2. `https://bustling-tiny-angle.glitch.me/api/proxy?servicio=google`
3. `http://localhost:8000/api/vps/consulta`
4. `http://localhost:8000/google/vps/consulta`

> ⚠️ Nota: Algunos de estos endpoints pueden dejar de estar disponibles.

---

## 🔧 Tipo de solicitud

- **Método HTTP**: `POST`
- **Cabeceras recomendadas**:
  ```http
  Content-Type: application/json


