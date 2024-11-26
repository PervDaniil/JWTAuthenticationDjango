from pathlib import Path

BASE_DIR_PATH = Path(__file__).resolve().parent.parent

SECRET_KEY = 'DJANGO SECRET KEY FOR PRODUCTION'

ALLOWED_HOSTS = [
    '127.0.0.1',
    'localhost',
]
