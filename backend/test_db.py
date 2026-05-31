from fastapi.testclient import TestClient
from backend.main import app, getUser, obter_vacinas, obter_documentos, obter_alertas

client = TestClient(app)

CPF_EXISTENTE = "000.111.222-22"   # Carlos Silva
CPF_INEXISTENTE = "999.999.999-99"


# ====================================================================
# Funções de acesso ao mock
# ====================================================================

def test_usuario_existente():
    usuario = getUser(CPF_EXISTENTE)
    assert usuario is not None
    assert usuario["cpf_paciente"] == CPF_EXISTENTE
    assert usuario["nome_paciente"] == "Carlos Silva"
    assert usuario["tipo_sanguineo"] == "A+"
    assert usuario["status_saude"] == "updated"


def test_vacinas_existentes():
    vacinas = obter_vacinas(CPF_EXISTENTE)
    assert len(vacinas) > 0
    assert all(v["paciente_id"] == CPF_EXISTENTE for v in vacinas)
    assert any(v["nome_vacina"] == "COVID-19 (Pfizer)" for v in vacinas)
    assert all("status_vacina" in v for v in vacinas)


def test_documentos_existentes():
    documentos = obter_documentos(CPF_EXISTENTE)
    assert len(documentos) > 0
    assert all(d["paciente_id"] == CPF_EXISTENTE for d in documentos)
    assert any(d["titulo_documento"] == "Eletrocardiograma" for d in documentos)
    assert all(d["status_documento"] in ("new", "viewed") for d in documentos)


def test_alertas_existentes():
    alertas = obter_alertas(CPF_EXISTENTE)
    assert len(alertas) > 0
    assert all(a["paciente_id"] == CPF_EXISTENTE for a in alertas)
    assert any(a["tipo_alerta"] == "condition" for a in alertas)
    assert all(a["severidade_alerta"] in ("high", "medium", "low") for a in alertas)


def test_usuario_inexistente():
    assert getUser(CPF_INEXISTENTE) is None


def test_vacinas_usuario_inexistente():
    assert obter_vacinas(CPF_INEXISTENTE) == []


# ====================================================================
# Rotas da API
# ====================================================================

def test_login_sucesso():
    resp = client.post("/login", data={"username": "carlos.silva@email.com", "password": "senha123"})
    assert resp.status_code == 200
    body = resp.json()
    assert body["patient_data"]["cpf_paciente"] == CPF_EXISTENTE
    assert "vaccines" in body
    assert "alerts" in body
    assert "documents" in body


def test_login_credenciais_invalidas():
    resp = client.post("/login", data={"username": "nao@existe.com", "password": "errada"})
    assert resp.status_code == 401
    assert resp.json()["detail"] == "E-mail ou senha incorretos."


def test_rota_perfil_completo():
    resp = client.get(f"/api/pacientes/{CPF_EXISTENTE}/perfil-completo")
    assert resp.status_code == 200
    assert resp.json()["cpf_paciente"] == CPF_EXISTENTE


def test_rota_perfil_inexistente():
    resp = client.get(f"/api/pacientes/{CPF_INEXISTENTE}/perfil-completo")
    assert resp.status_code == 404


def test_rota_vacinas():
    resp = client.get(f"/api/pacientes/{CPF_EXISTENTE}/vacinas")
    assert resp.status_code == 200
    vacinas = resp.json()
    assert len(vacinas) > 0
    assert any(v["nome_vacina"] == "COVID-19 (Pfizer)" for v in vacinas)


def test_rota_vacinas_inexistente():
    resp = client.get(f"/api/pacientes/{CPF_INEXISTENTE}/vacinas")
    assert resp.status_code == 404


def test_rota_documentos():
    resp = client.get(f"/api/pacientes/{CPF_EXISTENTE}/documentos")
    assert resp.status_code == 200
    assert len(resp.json()) > 0


def test_rota_alertas():
    resp = client.get(f"/api/pacientes/{CPF_EXISTENTE}/alertas")
    assert resp.status_code == 200
    assert len(resp.json()) > 0


def test_adicionar_alerta():
    payload = {"titulo": "Diabetes Tipo 2", "nivel": "medium", "descricao": "Controlada com dieta."}
    resp = client.post(f"/api/pacientes/{CPF_EXISTENTE}/alertas", json=payload)
    assert resp.status_code == 200
    assert "mensagem" in resp.json()


def test_adicionar_alerta_usuario_inexistente():
    payload = {"titulo": "Teste", "nivel": "low", "descricao": "Irrelevante."}
    resp = client.post(f"/api/pacientes/{CPF_INEXISTENTE}/alertas", json=payload)
    assert resp.status_code == 404


def test_crud_vacina():
    nova = {
        "nome_vacina": "Hepatite A",
        "dose": "1ª Dose",
        "data_aplicacao": "01/01/2025",
        "status_vacina": "applied",
    }

    resp = client.post(f"/patients/{CPF_EXISTENTE}/vaccines", json=nova)
    assert resp.status_code == 200
    vacina_id = resp.json()["id_vacina"]

    editada = {**nova, "nome_vacina": "Hepatite A (Editada)", "status_vacina": "pending", "data_aplicacao": None}
    resp = client.put(f"/patients/{CPF_EXISTENTE}/vaccines/{vacina_id}", json=editada)
    assert resp.status_code == 200
    assert resp.json()["nome_vacina"] == "Hepatite A (Editada)"

    resp = client.delete(f"/patients/{CPF_EXISTENTE}/vaccines/{vacina_id}")
    assert resp.status_code == 200
    assert "mensagem" in resp.json()


def test_deletar_vacina_inexistente():
    resp = client.delete(f"/patients/{CPF_EXISTENTE}/vaccines/id-que-nao-existe")
    assert resp.status_code == 404
