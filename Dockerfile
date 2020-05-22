FROM python:3.7.5-alpine

WORKDIR /app
COPY . /app

EXPOSE 5000

RUN pip install -r requirements.txt
CMD FLASK_APP=app.py flask run --host="::"
