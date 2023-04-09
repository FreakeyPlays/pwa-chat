### STAGE 1 ###
FROM node:19.8.1-alpine AS builder

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build

### STAGE 2 ###

FROM nginx:1.21.3-alpine

WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/src/app/src/dist /usr/share/nginx/html