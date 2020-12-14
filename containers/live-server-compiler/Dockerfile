FROM node:13-alpine

RUN apk update && apk upgrade && \
        apk add --no-cache bash git openssh

RUN apk add --no-cache make gcc g++ python && \
    npm install --production --silent

COPY monitor.sh /monitor.sh
COPY build.sh /build.sh
