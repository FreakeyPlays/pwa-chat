### STAGE 1 ###
FROM node:19.8.1-alpine AS builder

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build

### STAGE 2 ###

FROM nginx:1.21.3-alpine

WORKDIR /usr/share/nginx/html

COPY --from=builder /usr/src/app/src /usr/share/nginx/html
RUN ["rm", "-rf", "assets/sass", "assets/ts"]