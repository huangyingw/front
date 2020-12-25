FROM node:15-alpine

RUN apk update && apk upgrade && \
        apk add bash git openssh

RUN apk add make gcc g++ python

COPY monitor.sh /monitor.sh
