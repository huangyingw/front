FROM node:13-alpine

RUN apk update && apk upgrade && \
        apk add --no-cache bash git openssh

COPY monitor.sh /monitor.sh
COPY build.sh /build.sh
