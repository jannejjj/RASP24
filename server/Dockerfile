FROM node:lts-buster

WORKDIR /usr/src/app_server

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

RUN npm install
RUN npm i multer

COPY . /usr/src/app_server