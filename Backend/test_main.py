from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import mysql.connector

app = FastAPI(title="Passaporte de Saúde - API com CRUD Completo")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="admin",
            password="root",
            database="passaporte_saude"
        )
        return connection
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Erro no banco: {err}")

class Vaccine(BaseModel):
    id_vacina: str
    nome_vacina: str
    dose: str
    data_aplicacao: Optional[str] = None
    status_vacina: str

class Alert(BaseModel):
    id_alerta: str
    tipo_alerta: str
    titulo_alerta: str
    descricao_alerta: str
    severidade_alerta: str

class Document(BaseModel):
    id_documento: str
    titulo_documento: str
    tipo_documento: str
    data_criacao_documento: str
    status_documento: str

class PatientProfile(BaseModel):
    cpf_paciente: str
    nome_paciente: str
    nome_completo: str
    email: str
    avatar: Optional[str] = None
    status_saude: str
    tipo_sanguineo: str
    valor_qr: str

class LoginResponse(BaseModel):
    message: str
    patient_data: PatientProfile
    vaccines: List[Vaccine]
    alerts: List[Alert]
    documents: List[Document]

class VaccineCreateUpdate(BaseModel):
    id_vacina: str
    nome_vacina: str
    dose: str
    data_aplicacao: Optional[str] = None
    status_vacina: str

@app.post("/login", response_model=LoginResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query_paciente = "SELECT * FROM pacientes WHERE email = %s"
    cursor.execute(query_paciente, (form_data.username,))
    paciente = cursor.fetchone()

    if not paciente or form_data.password != paciente["senha_hash"]:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="E-mail ou senha incorretos.")

    cpf = paciente["cpf_paciente"]

    cursor.execute("SELECT id_vacina, nome_vacina, dose, data_aplicacao, status_vacina FROM vacinas WHERE paciente_id = %s", (cpf,))
    vacinas = cursor.fetchall()

    cursor.execute("SELECT id_alerta, tipo_alerta, titulo_alerta, descricao_alerta, severidade_alerta FROM alertas WHERE paciente_id = %s", (cpf,))
    alertas = cursor.fetchall()

    cursor.execute("SELECT id_documento, titulo_documento, tipo_documento, data_criacao_documento, status_documento FROM documentos WHERE paciente_id = %s", (cpf,))
    documentos = cursor.fetchall()

    cursor.close()
    conn.close()

    paciente.pop("senha_hash", None)

    return {
        "message": "Login efetuado com sucesso!",
        "patient_data": paciente,
        "vaccines": vacinas,
        "alerts": alertas,
        "documents": documentos
    }

@app.post("/patients/{cpf_paciente}/vaccines", status_code=201)
def add_vaccine(cpf_paciente: str, vaccine: VaccineCreateUpdate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        query = """
            INSERT INTO vacinas (id_vacina, paciente_id, nome_vacina, dose, data_aplicacao, status_vacina)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            vaccine.id_vacina,
            cpf_paciente,
            vaccine.nome_vacina,
            vaccine.dose,
            vaccine.data_aplicacao,
            vaccine.status_vacina
        ))
        conn.commit()
        return {"message": "Vacina registrada com sucesso!"}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=400, detail=f"Erro ao inserir: {err}")
    finally:
        cursor.close()
        conn.close()

@app.get("/patients/{cpf_paciente}/vaccines", response_model=List[Vaccine])
def get_vaccines(cpf_paciente: str):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    query = "SELECT id_vacina, nome_vacina, dose, data_aplicacao, status_vacina FROM vacinas WHERE paciente_id = %s"
    cursor.execute(query, (cpf_paciente,))
    vacinas = cursor.fetchall()
    
    cursor.close()
    conn.close()
    return vacinas

@app.put("/patients/{cpf_paciente}/vaccines/{id_vacina}")
def update_vaccine(cpf_paciente: str, id_vacina: str, vaccine: VaccineCreateUpdate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = """
        UPDATE vacinas 
        SET nome_vacina = %s, dose = %s, data_aplicacao = %s, status_vacina = %s
        WHERE id_vacina = %s AND paciente_id = %s
    """
    cursor.execute(query, (
        vaccine.nome_vacina,
        vaccine.dose,
        vaccine.data_aplicacao,
        vaccine.status_vacina,
        id_vacina,
        cpf_paciente
    ))
    conn.commit()
    
    if cursor.rowcount == 0:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Vacina ou Paciente não encontrado.")
        
    cursor.close()
    conn.close()
    return {"message": "Vacina atualizada com sucesso!"}

@app.delete("/patients/{cpf_paciente}/vaccines/{id_vacina}")
def delete_vaccine(cpf_paciente: str, id_vacina: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "DELETE FROM vacinas WHERE id_vacina = %s AND paciente_id = %s"
    cursor.execute(query, (id_vacina, cpf_paciente))
    conn.commit()
    
    if cursor.rowcount == 0:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Vacina ou Paciente não encontrado.")
        
    cursor.close()
    conn.close()
    return {"message": "Vacina removida com sucesso!"}