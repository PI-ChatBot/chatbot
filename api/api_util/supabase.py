# Inicialização de Supabase Client

import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL", "")  # URL do projeto Supabase
key: str = os.environ.get("SUPABASE_KEY", "")  # Chave de API do Supabase

# Criar cliente Supabase
supabase: Client = create_client(url, key)
