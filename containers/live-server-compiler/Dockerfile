FROM node:15-alpine

RUN apk update && apk upgrade && \
        apk add bash git openssh

RUN apk add make gcc g++ python && \
    npm install --production --silent

COPY monitor.sh /monitor.sh
COPY build.sh /build.sh
