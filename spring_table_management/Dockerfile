# Sử dụng image OpenJDK chính thức
FROM openjdk:17-jdk-slim

# Tạo thư mục làm việc
WORKDIR /app

# Copy file pom.xml và mã nguồn
COPY pom.xml .
COPY src ./src

# Cài đặt Maven và build dự án
RUN apt-get update && apt-get install -y maven
RUN mvn clean package -DskipTests

# Copy file JAR đã build
COPY target/*.jar app.jar

# Command để chạy ứng dụng
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

# Mở port mà Spring Boot sử dụng (mặc định 8080)
EXPOSE 8080