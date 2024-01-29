FROM node:lts-buster

WORKDIR /usr/src/app_client

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

RUN npm install
RUN npm install react-scripts@3.3.1 -g --silent

COPY . /usr/src/app_client