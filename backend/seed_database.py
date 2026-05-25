#!/usr/bin/env python3
"""
Script para popular o banco de dados Supabase com dados de teste.
Cria 100 usuários com vacinas, documentos e alertas fictícios.
"""

from faker import Faker
from database import supabase
import uuid
import random
from datetime import datetime, timedelta

fake = Faker("pt_BR")

# Configurações
NUM_USUARIOS = 100
TIPOS_SANGUINEO = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]
VACINAS_COMUNS = [
    {"nome": "COVID-19 (Pfizer)", "doses": ["1ª dose", "2ª dose", "3ª dose (reforço)"]},
    {"nome": "Influenza", "doses": ["Dose anual"]},
    {"nome": "HPV", "doses": ["1ª dose", "2ª dose", "3ª dose"]},
    {"nome": "Tríplice Viral (MMR)", "doses": ["1ª dose", "2ª dose"]},
    {"nome": "Hepatite B", "doses": ["1ª dose", "2ª dose", "3ª dose"]},
    {"nome": "Febre Amarela", "doses": ["Dose única", "Reforço"]},
    {"nome": "Meningococo", "doses": ["1ª dose", "2ª dose"]},
]

TIPOS_DOCUMENTOS = [
    "Receita Médica",
    "Exame de Sangue",
    "Raio X",
    "Eletrocardiograma",
    "Ressonância Magnética",
    "Ultrassom",
    "Relatório Médico",
]

ALERTAS = [
    {"titulo": "Pressão Arterial Elevada", "severidade": "alto"},
    {"titulo": "Colesterol Alto", "severidade": "médio"},
    {"titulo": "Glicemia em Jejum Alterada", "severidade": "médio"},
    {"titulo": "Alergia a Penicilina", "severidade": "alto"},
    {"titulo": "Asma", "severidade": "médio"},
    {"titulo": "Diabetes Tipo 2", "severidade": "alto"},
    {"titulo": "Hipotireoidismo", "severidade": "baixo"},
]


def gerar_usuarios(quantidade: int):
    """Gera e insere usuários no banco."""
    print(f"📝 Gerando {quantidade} usuários...")
    usuarios = []

    for i in range(quantidade):
        usuario_id = f"usr-{str(i + 1).zfill(6)}"
        usuarios.append({
            "id": usuario_id,
            "nome_Paciente": fake.name(),
            "tipo_sanguineo": random.choice(TIPOS_SANGUINEO),
            "contato_emergencia": fake.phone_number(),
        })

    # Insere em lotes de 50
    for j in range(0, len(usuarios), 50):
        lote = usuarios[j : j + 50]
        supabase.table("usuarios").insert(lote).execute()
        print(f"  ✅ {min(j + 50, len(usuarios))}/{quantidade} usuários inseridos")

    return [u["id"] for u in usuarios]


def gerar_vacinas(usuario_ids: list):
    """Gera e insere vacinas para cada usuário."""
    print(f"\n💉 Gerando vacinas para {len(usuario_ids)} usuários...")
    vacinas = []

    for usuario_id in usuario_ids:
        # 3 a 6 vacinas por usuário
        num_vacinas = random.randint(3, 6)
        vacinas_selecionadas = random.sample(VACINAS_COMUNS, min(num_vacinas, len(VACINAS_COMUNS)))

        for vacina in vacinas_selecionadas:
            dose_selecionada = random.choice(vacina["doses"])
            data_aplicacao = fake.date_between(start_date="-2y").isoformat()

            vacinas.append({
                "id": f"vac-{uuid.uuid4().hex[:8]}",
                "paciente_id": usuario_id,
                "nome_vacina": vacina["nome"],
                "dose": dose_selecionada,
                "data_aplicacao": data_aplicacao,
                "status": random.choice(["aplicada", "agendada", "pendente"]),
            })

    # Insere em lotes de 100
    for j in range(0, len(vacinas), 100):
        lote = vacinas[j : j + 100]
        supabase.table("vacinas").insert(lote).execute()
        print(f"  ✅ {min(j + 100, len(vacinas))}/{len(vacinas)} vacinas inseridas")

    return vacinas


def gerar_documentos(usuario_ids: list):
    """Gera e insere documentos para cada usuário."""
    print(f"\n📄 Gerando documentos para {len(usuario_ids)} usuários...")
    documentos = []

    for usuario_id in usuario_ids:
        # 2 a 5 documentos por usuário
        num_docs = random.randint(2, 5)

        for _ in range(num_docs):
            documentos.append({
                "id": f"doc-{uuid.uuid4().hex[:8]}",
                "paciente_id": usuario_id,
                "tipo": random.choice(TIPOS_DOCUMENTOS),
                "data_documento": fake.date_between(start_date="-1y").isoformat(),
                "descricao": fake.sentence(nb_words=8),
                "url_arquivo": f"https://storage.supabase.co/docs/{uuid.uuid4().hex}.pdf",
            })

    # Insere em lotes de 100
    for j in range(0, len(documentos), 100):
        lote = documentos[j : j + 100]
        supabase.table("documentos").insert(lote).execute()
        print(f"  ✅ {min(j + 100, len(documentos))}/{len(documentos)} documentos inseridos")

    return documentos


def gerar_alertas(usuario_ids: list):
    """Gera e insere alertas para cada usuário."""
    print(f"\n⚠️  Gerando alertas para {len(usuario_ids)} usuários...")
    alertas = []

    for usuario_id in usuario_ids:
        # 0 a 3 alertas por usuário
        num_alertas = random.randint(0, 3)

        if num_alertas == 0:
            continue

        alertas_selecionados = random.sample(ALERTAS, min(num_alertas, len(ALERTAS)))

        for alerta in alertas_selecionados:
            alertas.append({
                "id": f"alt-{uuid.uuid4().hex[:8]}",
                "paciente_id": usuario_id,
                "tipo": "condition",
                "titulo": alerta["titulo"],
                "descricao": fake.sentence(nb_words=10),
                "severidade": alerta["severidade"],
            })

    # Insere em lotes de 100
    for j in range(0, len(alertas), 100):
        lote = alertas[j : j + 100]
        supabase.table("alertas").insert(lote).execute()
        print(f"  ✅ {min(j + 100, len(alertas))}/{len(alertas)} alertas inseridos")

    return alertas


def main():
    """Função principal."""
    print("=" * 60)
    print("🌱 SEED DATABASE - Documento Unificado de Saúde")
    print("=" * 60)

    try:
        # Gera dados
        usuario_ids = gerar_usuarios(NUM_USUARIOS)
        gerar_vacinas(usuario_ids)
        gerar_documentos(usuario_ids)
        gerar_alertas(usuario_ids)

        print("\n" + "=" * 60)
        print("✅ SUCESSO! Banco de dados populado com:")
        print(f"   • {NUM_USUARIOS} usuários")
        print(f"   • ~{NUM_USUARIOS * 4.5:.0f} vacinas")
        print(f"   • ~{NUM_USUARIOS * 3.5:.0f} documentos")
        print(f"   • ~{NUM_USUARIOS * 1.5:.0f} alertas")
        print("=" * 60)

        # Mostra alguns exemplos
        print("\n📊 Exemplos de dados:")
        resultado = supabase.table("usuarios").select("*").limit(1).execute()
        if resultado.data:
            print(f"  Usuário: {resultado.data[0]}")

    except Exception as e:
        print(f"\n❌ ERRO: {str(e)}")
        raise


if __name__ == "__main__":
    main()
