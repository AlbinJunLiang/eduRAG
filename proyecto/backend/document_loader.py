import os
from glob import glob
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

def cargar_documentos():
    # Obtener ruta absoluta al directorio actual (donde está este script)
    current_dir = os.path.dirname(__file__)
    archivos_path = os.path.abspath(os.path.join(current_dir, "../../archivos/*.txt"))

    txt_files = glob(archivos_path)
    print(f"Archivos encontrados: {txt_files}")
    
    documents = []
    for file in txt_files:
        loader = TextLoader(file, encoding="utf-8")
        documents.extend(loader.load())
    
    print(f"Documentos cargados: {len(documents)}")
    return documents

def dividir_y_vectorizar(documents):
    if not documents:
        raise ValueError("No se cargaron documentos.")

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_text("\n".join([doc.page_content for doc in documents]))

    if not chunks:
        raise ValueError("No se generaron fragmentos de texto.")

    embeddings = HuggingFaceEmbeddings(model_name="paraphrase-multilingual-MiniLM-L12-v2")

    # Usar ruta absoluta para el directorio de persistencia
    current_dir = os.path.dirname(__file__)
    persist_path = os.path.abspath(os.path.join(current_dir, "../../database"))

    vector_db = Chroma.from_texts(chunks, embeddings, persist_directory=persist_path)

    return vector_db  # corregido
