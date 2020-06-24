# This file is a template, and might need editing before it works on your project.
FROM node:12-alpine AS builder

WORKDIR /usr/src/app

COPY $CI_PROJECT_DIR/package.json /usr/src/app/
COPY $CI_PROJECT_DIR/. /usr/src/app

ARG node=dev
ENV NODE_ENV=$node

RUN npm install
RUN npm run build

FROM httpd:2.4-alpine
WORKDIR /usr/local/apache2/htdocs/
COPY ./my-httpd.conf /usr/local/apache2/conf/httpd.conf
COPY --from=builder /usr/src/app/build/ /usr/local/apache2/htdocs/
