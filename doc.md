Khi bạn **sửa code** trong dự án Spring Boot hoặc React, để cập nhật lại ứng dụng chạy bằng Docker, bạn làm như sau:

---

## 🚀 Với Backend (Spring Boot)

### ✅ Khi bạn thay đổi code Java (controller, service, v.v.)
Bạn cần **build lại file `.jar`** và **build lại Docker image**.

### 🛠 Các bước:

1. **Build lại file `.jar`**
   ```bash
   cd backend
   mvn clean package
   ```

2. **Build lại Docker image**
   ```bash
   docker-compose build backend
   ```

3. **Chạy lại container**
   ```bash
   docker-compose up -d
   ```

---

## 💻 Với Frontend (React)

### ✅ Khi bạn sửa code React
React sẽ cần được build lại thành HTML/CSS/JS để đưa vào Docker.

### 🛠 Các bước:

1. **Build lại frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Build lại Docker image**
   ```bash
   docker-compose build frontend
   ```

3. **Chạy lại container**
   ```bash
   docker-compose up -d
   ```

---

## 🧠 Ghi nhớ nhanh:

| Thay đổi gì        | Cần làm gì                               |
|--------------------|-------------------------------------------|
| Sửa code Java      | `mvn package → docker-compose build`      |
| Sửa code React     | `npm run build → docker-compose build`    |
| Cập nhật nhanh     | `docker-compose up -d`                    |

---

👉 Nếu bạn sửa **chút ít** và muốn **auto cập nhật mà không phải build mỗi lần**, mình có thể chỉ bạn cách **dùng volume bind** hoặc chạy Spring Boot ở chế độ dev không cần Docker mỗi lần build — bạn muốn mình chia sẻ cách này không?