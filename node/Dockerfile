FROM node:10.15.3-alpine
RUN mkdir /node
RUN mkdir /node/app
RUN mkdir /node/lambda

COPY ./package.json /node/package.json
COPY ./package-lock.json /node/package-lock.json
COPY ./app /node/app

# ディレクトリを移動する
WORKDIR /node

RUN npm install

# ポート3000番を開放する
EXPOSE 3000

CMD ["npm", "run", "start"]
