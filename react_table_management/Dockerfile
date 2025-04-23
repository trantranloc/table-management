# Sử dụng Node.js để build React
FROM node:18 AS build

# Tạo thư mục làm việc
WORKDIR /app

# Copy package.json và cài đặt dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy mã nguồn và build dự án React
COPY . .
RUN npm run build

# Sử dụng Nginx để phục vụ các file tĩnh
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Mở port 80 cho Nginx
EXPOSE 80

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]