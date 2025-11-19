import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

_client: Client = None

def get_supabase() -> Client:
    global _client
    if _client is None:
        url = os.getenv('SUPABASE_URL')
        key = os.getenv('SUPABASE_KEY')
        if not url or not key:
            raise ValueError('Missing SUPABASE_URL or SUPABASE_KEY in environment')
        _client = create_client(url, key)
    return _client

def load_config():
    """Load configuration from environment variables"""
    return {
        'supabase_url': os.getenv('SUPABASE_URL'),
        'supabase_key': os.getenv('SUPABASE_KEY'),
        'revalidate_secret': os.getenv('REVALIDATE_SECRET'),
        'revalidate_url': os.getenv('REVALIDATE_URL', 'https://tech-radar-six.vercel.app/api/revalidate')
    }
