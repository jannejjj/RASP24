FROM node:lts-buster

WORKDIR /usr/src/app_server

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

RUN npm install

COPY . /usr/src/app_server