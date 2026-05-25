import json

from fastapi import FastAPI, HTTPException

app = FastAPI()

DB_PATH = './db.json'


def read_db() -> dict:
    with open(DB_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)


def getUser(user_id: str) -> dict | None:
    db = read_db()
    for usuario in db['usuarios']:
        if usuario['id'] == user_id:
            return usuario
    return None


@app.get("/users/{user_id}")
async def get_user(user_id: str):
    usuario = getUser(user_id)
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return usuario
