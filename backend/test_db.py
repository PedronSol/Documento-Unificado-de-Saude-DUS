import pytest
from backend.main_r import getUser


def test_usuario_existente():
    usuario = getUser('usr-001')
    assert usuario is not None
    assert usuario['id'] == 'usr-001'
    assert usuario['nome'] == 'Ana Clara Souza'
    assert usuario['cpf'] == '123.456.789-00'
    assert usuario['tipo_sanguineo'] == 'A+'
    assert usuario['papel'] == 'paciente'


def test_usuario_inexistente():
    usuario = getUser('usr-999')
    assert usuario is None
