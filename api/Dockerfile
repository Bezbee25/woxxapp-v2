FROM python:3.12-slim
RUN useradd -m -u 1000 woxxapp
WORKDIR /srv/woxxapp
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app/ ./app/
COPY alembic/ ./alembic/
COPY alembic.ini .
USER woxxapp
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
