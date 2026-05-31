import json
import uuid
from pathlib import Path
from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI(
    title="API - Documento Unificado de Saúde",
    description="Backend para centralização de informações médicas"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

_DATA_FILE = Path(__file__).parent / "mock_data.json"
with open(_DATA_FILE, encoding="utf-8") as f:
    _db = json.load(f)


# ====================================================================
# MODELOS PYDANTIC
# ====================================================================

class AlertaMedicoCadastro(BaseModel):
    titulo: str
    nivel: str
    descricao: str

class VacinaCadastro(BaseModel):
    id_vacina: Optional[str] = None
    nome_vacina: str
    dose: str
    data_aplicacao: Optional[str] = None
    status_vacina: str


# ====================================================================
# FUNÇÕES DE ACESSO AO MOCK
# ====================================================================

def getUser(cpf: str) -> dict | None:
    for p in _db["pacientes"]:
        if p["cpf_paciente"] == cpf:
            return p
    return None


def obter_vacinas(cpf: str) -> list:
    return [v for v in _db["vacinas"] if v["paciente_id"] == cpf]


def obter_documentos(cpf: str) -> list:
    return [d for d in _db["documentos"] if d["paciente_id"] == cpf]


def obter_alertas(cpf: str) -> list:
    return [a for a in _db["alertas"] if a["paciente_id"] == cpf]


# ====================================================================
# ROTAS DA API
# ====================================================================

@app.post("/login")
def login(username: str = Form(...), password: str = Form(...)):
    paciente = next(
        (p for p in _db["pacientes"] if p["email"] == username and p["senha_hash"] == password),
        None,
    )
    if paciente is None:
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos.")

    cpf = paciente["cpf_paciente"]
    return {
        "patient_data": paciente,
        "vaccines": obter_vacinas(cpf),
        "alerts": obter_alertas(cpf),
        "documents": obter_documentos(cpf),
    }


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
    novo = {
        "id_alerta": f"alt-{uuid.uuid4().hex[:8]}",
        "paciente_id": paciente_id,
        "tipo_alerta": "condition",
        "titulo_alerta": novo_alerta.titulo,
        "descricao_alerta": novo_alerta.descricao,
        "severidade_alerta": novo_alerta.nivel,
    }
    _db["alertas"].append(novo)
    return {"mensagem": f"Alerta '{novo_alerta.titulo}' cadastrado com sucesso!"}


@app.post("/patients/{paciente_id}/vaccines")
def adicionar_vacina(paciente_id: str, vacina: VacinaCadastro):
    if getUser(paciente_id) is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    nova = {
        "id_vacina": vacina.id_vacina or uuid.uuid4().hex[:8],
        "paciente_id": paciente_id,
        "nome_vacina": vacina.nome_vacina,
        "dose": vacina.dose,
        "data_aplicacao": vacina.data_aplicacao,
        "status_vacina": vacina.status_vacina,
    }
    _db["vacinas"].append(nova)
    return nova


@app.put("/patients/{paciente_id}/vaccines/{vacina_id}")
def editar_vacina(paciente_id: str, vacina_id: str, vacina: VacinaCadastro):
    if getUser(paciente_id) is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    for i, v in enumerate(_db["vacinas"]):
        if v["paciente_id"] == paciente_id and v["id_vacina"] == vacina_id:
            _db["vacinas"][i] = {
                "id_vacina": vacina_id,
                "paciente_id": paciente_id,
                "nome_vacina": vacina.nome_vacina,
                "dose": vacina.dose,
                "data_aplicacao": vacina.data_aplicacao,
                "status_vacina": vacina.status_vacina,
            }
            return _db["vacinas"][i]
    raise HTTPException(status_code=404, detail="Vacina não encontrada")


@app.delete("/patients/{paciente_id}/vaccines/{vacina_id}")
def deletar_vacina(paciente_id: str, vacina_id: str):
    if getUser(paciente_id) is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    antes = len(_db["vacinas"])
    _db["vacinas"] = [
        v for v in _db["vacinas"]
        if not (v["paciente_id"] == paciente_id and v["id_vacina"] == vacina_id)
    ]
    if len(_db["vacinas"]) == antes:
        raise HTTPException(status_code=404, detail="Vacina não encontrada")
    return {"mensagem": "Vacina removida com sucesso"}
