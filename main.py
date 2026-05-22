from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

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
    allow_credentials=True,
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

# Rota de Leitura (GET) - A que já tínhamos feito
@app.get("/api/pacientes/{paciente_id}/perfil-completo")
def obter_perfil_completo(paciente_id: str):
    if paciente_id != "BR-2024-7829-4561":
        return {"erro": "Paciente não encontrado."}
    
    return {
        "paciente": {"nome": "Maria Silva Santos", "tipo_sanguineo": "O+"},
        # (O resto dos dados simulados viriam aqui...)
        "status": "Sucesso"
    }

# Rota de Escrita (POST) - Usando nosso modelo Pydantic!
@app.post("/api/pacientes/{paciente_id}/alertas")
def adicionar_alerta(paciente_id: str, novo_alerta: AlertaMedicoCadastro):
    # O FastAPI já validou se 'novo_alerta' tem titulo, nivel e descricao!
    
    # Aqui entraria o código para enviar isso para o MySQL do Diogo
    
    return {
        "mensagem": f"Alerta '{novo_alerta.titulo}' cadastrado com sucesso para o paciente {paciente_id}!",
        "dados_recebidos": novo_alerta
    }