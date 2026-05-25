from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
app = FastAPI(
    title="API - Documento Unificado de Saúde",
    description="Backend para centralização de informações médicas"
)

# ====================================================================
# 1. CONFIGURAÇÃO DO CORS
# Isso avisa ao navegador que o frontend do seu grupo tem permissão 
# para conversar com esta API sem ser bloqueado.
# ====================================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Em produção..., trocar o "*" pelo link do frontend
    allow_credentials=False, # Não pode ser True quando allow_origins=["*"]
    allow_methods=["*"], # Permite GET, POST, PUT, DELETE...
    allow_headers=["*"],
)

# ====================================================================
# 2. MODELOS PYDANTIC 
# Essas classes garantem que vão enviar lixo para o banco de dados.
# Se o front enviar um alerta sem "titulo", o FastAPI bloqueia na hora.
# ====================================================================

class AlertaMedicoCadastro(BaseModel):
    titulo: str
    nivel: str
    descricao: str

class VacinaCadastro(BaseModel):
    nome_vacina: str
    dose: str
    data_aplicacao: Optional[str] = None # Optional que pode vir vazio (Pendente)
    status: str

class Pacientes(BaseModel):
    nome_Paciente: str
    tipo_sanguineo: str
    contato_emergencia: Optional[str] = None # Optional que pode vir vazio (Pendente)
    docu_status: str
# ====================================================================
# 3. ROTAS DA API
# ====================================================================
DB_PATH = './db.json'

def read_db() -> dict:
    with open(DB_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def getUser(user_id: str) -> dict | None:
    db = read_db()
    for usuario in db['usuarios']:
        if usuario['id'] == user_id:
            return usuario
    return None


# Rota de Leitura (GET) - A que já tínhamos feito
@app.get("/api/pacientes/{paciente_id}/perfil-completo")

def obter_perfil_completo(paciente_id: str):
    usuario = getUser(paciente_id)
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    return {**usuario, "status": "Sucesso"}
    
@app.get("/api/pacientes/{paciente_id}/vacinas")
def obter_vacinas(paciente_id: str):
    if getUser(paciente_id) is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    db = read_db()
    vacinas = [v for v in db["vacinas"] if v["paciente_id"] == paciente_id]
    return vacinas

@app.get("/api/pacientes/{paciente_id}/documentos")
def obter_documentos(paciente_id: str):
    if getUser(paciente_id) is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    db = read_db()
    documentos = [d for d in db["documentos"] if d["paciente_id"] == paciente_id]
    return documentos

@app.get("/api/pacientes/{paciente_id}/alertas")
def obter_alertas(paciente_id: str):
    if getUser(paciente_id) is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    db = read_db()
    alertas = [a for a in db["alertas"] if a["paciente_id"] == paciente_id]
    return alertas

# Rota de Escrita (POST) - Usando nosso modelo Pydantic!
@app.post("/api/pacientes/{paciente_id}/alertas")
def adicionar_alerta(paciente_id: str, novo_alerta: AlertaMedicoCadastro):

    return {
        "mensagem": f"Alerta '{novo_alerta.titulo}' cadastrado com sucesso para o paciente {paciente_id}!",
        "dados_recebidos": novo_alerta
    }