import pytest
from backend.main import getUser, obter_vacinas, obter_documentos, obter_alertas


def test_usuario_existente():
    usuario = getUser('usr-001')
    assert usuario is not None
    assert usuario['id'] == 'usr-001'
    assert usuario['nome'] == 'Ana Clara Souza'
    assert usuario['cpf'] == '123.456.789-00'
    assert usuario['tipo_sanguineo'] == 'A+'
    assert usuario['papel'] == 'paciente'


def test_vacines_existents():
    vacinas = obter_vacinas('usr-001')
    assert vacinas is not None
    assert len(vacinas) > 0
    assert all(v['paciente_id'] == 'usr-001' for v in vacinas)
    assert any(v['nome_vacina'] == 'COVID-19 (Pfizer)' for v in vacinas)
    assert all('status' in v for v in vacinas)


def test_documentos_existents():
    documentos = obter_documentos('usr-001')
    assert documentos is not None
    assert len(documentos) > 0
    assert all(d['paciente_id'] == 'usr-001' for d in documentos)
    assert any(d['titulo'] == 'Hemograma Completo' for d in documentos)
    assert all(d['status'] in ('new', 'viewed') for d in documentos)


def test_obter_alert():
    alertas = obter_alertas('usr-001')
    assert alertas is not None
    assert len(alertas) > 0
    assert all(a['paciente_id'] == 'usr-001' for a in alertas)
    assert any(a['tipo'] == 'allergy' for a in alertas)
    assert all(a['severidade'] in ('high', 'medium', 'low') for a in alertas)


def test_usuario_inexistente():
    usuario = getUser('usr-999')
    assert usuario is None

def test_vacines_inexistente():
    vacine = getUser("nao_tem")
    assert vacine is None
    

