FROM node:16.9-buster AS builder

WORKDIR /usr/src/app

RUN npm i -g pnpm

COPY . .
RUN mkdir -p ./secrets

FROM builder as dev
RUN pnpm install
RUN pnpm prebuild && pnpm build

FROM builder as prod
RUN pnpm install --production
RUN pnpm prebuild && pnpm build