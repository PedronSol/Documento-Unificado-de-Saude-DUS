from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_login_success():
    """Testa o cenário de login com sucesso e a integridade do retorno dos dados"""
    login_payload = {
        "username": "carlos.silva@email.com",
        "password": "senha123"
    }
    
    response = client.post("/login", data=login_payload)
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["patient_data"]["nome_paciente"] == "Carlos Silva"
    assert data["patient_data"]["cpf_paciente"] == "00011122222"
    
    assert len(data["vaccines"]) == 3
    assert len(data["alerts"]) == 2
    assert "senha_hash" not in data["patient_data"]

def test_login_wrong_password():
    """Testa erro de login com senha incorreta"""
    login_payload = {
        "username": "carlos.silva@email.com",
        "password": "senha_errada_aqui"
    }
    response = client.post("/login", data=login_payload)
    assert response.status_code in [400, 401]

def test_login_user_not_found():
    """Testa erro de login com usuário inexistente"""
    login_payload = {
        "username": "inexistente@email.com",
        "password": "senha123"
    }
    response = client.post("/login", data=login_payload)
    assert response.status_code in [400, 404]