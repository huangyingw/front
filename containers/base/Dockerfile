FROM alpine:edge

RUN apk add --no-cache \
        bash \
        build-base \
        chromium \
        curl \
        g++ \
        git \
        libsass \
        libstdc++ \
        make \
        nodejs \
        npm \
        python \
        udev

RUN npm install -g typescript gulp @angular/cli

ENV CHROME_BIN=/usr/bin/chromium-browser
