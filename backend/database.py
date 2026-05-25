import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL: str = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY: str = os.environ.get("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise EnvironmentError(
        "Variáveis de ambiente SUPABASE_URL e SUPABASE_KEY são obrigatórias. "
        "Copie o .env.example para .env e preencha com as credenciais do Supabase."
    )

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
