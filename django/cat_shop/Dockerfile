FROM python:alpine

RUN pip install --upgrade pip

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

CMD ["daphne","-b","0.0.0.0","-p","8000","cat_shop.asgi:application"]