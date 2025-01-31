FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.27

COPY --from=builder /app/dist /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

# Mở port 80 cho Nginx
EXPOSE 80 

# Chạy Nginx (detached mode)
CMD ["nginx", "-g", "daemon off;"]