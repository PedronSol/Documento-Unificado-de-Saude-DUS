import pytest
from pydantic import ValidationError
from models import Vaccine, Alert
from datetime import date

def test_criar_vacina_valida():
    dados = {
        "id_vacina": 10,
        "nome_vacina": "Tríplice Viral",
        "dose": "Reforço",
        "data_aplicacao": date(2026, 5, 31),
        "status_vacina": "applied"
    }
    vacina = Vaccine(**dados)
    assert vacina.nome_vacina == "Tríplice Viral"
    assert vacina.status_vacina == "applied"

def test_erro_nome_vacina_vazio():
    with pytest.raises(ValidationError):
        Vaccine(
            id_vacina=11,
            nome_vacina="   ",
            dose="1ª Dose",
            status_vacina="pending"
        )

def test_erro_id_vacina_invalido():
    with pytest.raises(ValidationError):
        Vaccine(
            id_vacina="texto_invalido",
            nome_vacina="BCG",
            dose="Dose Única",
            status_vacina="applied"
        )

def test_criar_alerta_valido():
    alerta = Alert(
        id_alerta=1,
        tipo_alerta="allergy",
        titulo_alerta="Alergia a Sulfa",
        descricao_alerta="Erupções cutâneas graves.",
        severidade_alerta="high"
    )
    assert alerta.titulo_alerta == "Alergia a Sulfa"