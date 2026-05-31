from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import date

class Vaccine(BaseModel):
    id_vacina: int               
    nome_vacina: str
    dose: str
    data_aplicacao: Optional[date] = None
    status_vacina: str

    @field_validator('nome_vacina')
    def nome_nao_vazio(cls, v):
        if not v.strip():
            raise ValueError('O nome da vacina não pode ser vazio')
        return v

class Alert(BaseModel):
    id_alerta: int               
    tipo_alerta: str
    titulo_alerta: str
    descricao_alerta: str
    severidade_alerta: str