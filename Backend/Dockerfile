FROM python:3.11-slim

ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

WORKDIR /app

RUN pip install --no-cache-dir fastapi uvicorn mysql-connector-python pydantic python-multipart bcrypt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]