FROM node:22-trixie-slim

# Python + venv usados pelo backend para executar apps/ml (montado em /usr/src/ml)
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 python3-venv openssl \
    && rm -rf /var/lib/apt/lists/* \
    && python3 -m venv /opt/ml-venv \
    && /opt/ml-venv/bin/pip install --no-cache-dir \
       numpy==2.5.3 pandas==3.0.6 scikit-learn==1.9.1 scipy==1.18.1 joblib==1.6.0

ENV ML_APP_PATH=/usr/src/ml
ENV ML_PYTHON_EXECUTABLE=/opt/ml-venv/bin/python

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start:dev"]
