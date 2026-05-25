from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from backend.database import supabase

app = FastAPI(
    title="API - Documento Unificado de Saúde",
    description="Backend para centralização de informações médicas"
)

# ====================================================================
# 1. CONFIGURAÇÃO DO CORS
# ====================================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],    # Em produção, trocar pelo link do frontend
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ====================================================================
# 2. MODELOS PYDANTIC
# ====================================================================
class AlertaMedicoCadastro(BaseModel):
    titulo: str
    nivel: str
    descricao: str

class VacinaCadastro(BaseModel):
    nome_vacina: str
    dose: str
    data_aplicacao: Optional[str] = None
    status: str

class Pacientes(BaseModel):
    nome_Paciente: str
    tipo_sanguineo: str
    contato_emergencia: Optional[str] = None
    docu_status: str

# ====================================================================
# 3. FUNÇÕES DE ACESSO AO BANCO (Supabase)
# ====================================================================

def getUser(user_id: str) -> dict | None:
    """Busca um usuário pelo ID. Retorna None se não encontrado."""
    resultado = (
        supabase.table("usuarios")
        .select("*")
        .eq("id", user_id)
        .execute()
    )
    if resultado.data:
        return resultado.data[0]
    return None


def obter_vacinas(paciente_id: str) -> list:
    """Retorna todas as vacinas de um paciente."""
    resultado = (
        supabase.table("vacinas")
        .select("*")
        .eq("paciente_id", paciente_id)
        .execute()
    )
    return resultado.data


def obter_documentos(paciente_id: str) -> list:
    """Retorna todos os documentos de um paciente."""
    resultado = (
        supabase.table("documentos")
        .select("*")
        .eq("paciente_id", paciente_id)
        .execute()
    )
    return resultado.data


def obter_alertas(paciente_id: str) -> list:
    """Retorna todos os alertas de um paciente."""
    resultado = (
        supabase.table("alertas")
        .select("*")
        .eq("paciente_id", paciente_id)
        .execute()
    )
    return resultado.data


# ====================================================================
# 4. ROTAS DA API
# ====================================================================

@app.get("/api/pacientes/{paciente_id}/perfil-completo")
def rota_perfil_completo(paciente_id: str):
    usuario = getUser(paciente_id)
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return {**usuario, "status": "Sucesso"}


@app.get("/api/pacientes/{paciente_id}/vacinas")
def rota_vacinas(paciente_id: str):
    if getUser(paciente_id) is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return obter_vacinas(paciente_id)


@app.get("/api/pacientes/{paciente_id}/documentos")
def rota_documentos(paciente_id: str):
    if getUser(paciente_id) is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return obter_documentos(paciente_id)


@app.get("/api/pacientes/{paciente_id}/alertas")
def rota_alertas(paciente_id: str):
    if getUser(paciente_id) is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return obter_alertas(paciente_id)


@app.post("/api/pacientes/{paciente_id}/alertas")
def adicionar_alerta(paciente_id: str, novo_alerta: AlertaMedicoCadastro):
    if getUser(paciente_id) is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    import uuid
    dados = {
        "id": f"alt-{uuid.uuid4().hex[:8]}",
        "paciente_id": paciente_id,
        "tipo": "condition",
        "titulo": novo_alerta.titulo,
        "descricao": novo_alerta.descricao,
        "severidade": novo_alerta.nivel,
    }
    supabase.table("alertas").insert(dados).execute()
    return {
        "mensagem": f"Alerta '{novo_alerta.titulo}' cadastrado com sucesso para o paciente {paciente_id}!",
        "dados_recebidos": novo_alerta,
    }
