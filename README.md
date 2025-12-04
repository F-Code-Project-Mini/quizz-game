# Hướng dẫn cài đặt và chạy dự án Quizz Game

Dự án Quizz Game bao gồm hai phần chính:

- backend/ – phần API sử dụng Node.js, Prisma và MySQL
- frontend/ – giao diện người dùng xây dựng bằng React + Vite
- Database chạy thông qua Docker

Tài liệu này hướng dẫn chi tiết từng bước để người mới cũng có thể chạy được dự án.

---

## 1. Clone dự án về máy

Mở Terminal hoặc CMD và chạy các lệnh sau:

```
git clone https://github.com/F-Code-Project-Mini/quizz-game.git
cd quizz-game
````

Trong thư mục dự án sẽ có:

```bash
backend/
frontend/
docker-compose.yml
```

---

## 2. Cài đặt Docker

Dự án dùng Docker để chạy MySQL và phpMyAdmin.

Nếu bạn chưa có Docker, tải và cài đặt tại:

https://www.docker.com/products/docker-desktop/

Cài đặt xong, mở Docker Desktop lên và đảm bảo Docker đang chạy.

---

## 3. Khởi chạy Database bằng Docker

Đứng trong thư mục quizz-game và chạy:

```
docker-compose up -d
```

Lệnh này sẽ khởi động:
- MySQL
- phpMyAdmin

Bạn có thể kiểm tra bằng:

```
docker ps
```

---

## 4. Truy cập phpMyAdmin để xem Database

Mở trình duyệt và truy cập: http://localhost:8080

Đăng nhập với:

User: **root**  
Password: **quizz_ps**

---

## 5. Chạy phần Frontend

Mở một cửa sổ terminal mới.

Từ thư mục **quizz-game** chạy:

```
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy ở địa chỉ:

http://localhost:5173  
(hoặc cổng khác nếu Vite báo)

---

## 6. Chạy phần Backend

Mở thêm một terminal mới để chạy song song.

Từ thư mục **quizz-game** chạy:

```
cd backend
npm install
npm run dev
```

Backend thường chạy ở:

http://localhost:8000

---

## 7. Migrate Database bằng Prisma

Backend dùng Prisma nên cần tạo bảng trong database.

Đứng tại thư mục **backend** và chạy:

```
npx prisma db push
```

---

## 8. Seed dữ liệu mẫu

Sau khi migrate xong, chạy:

```
npx prisma db seed
```

Lệnh này sẽ thêm dữ liệu mẫu giúp bạn test hệ thống ngay.

---

## 9. Hoàn tất

Khi bạn đã chạy:

- Docker (MySQL + phpMyAdmin)
- Frontend (npm run dev)
- Backend (npm run dev)
- Migrate (db push)
- Seed (db seed)

→ Dự án đã sẵn sàng để sử dụng.

---

## 10. Một số lỗi thường gặp

### Backend không kết nối được database

Kiểm tra file .env trong thư mục backend.

**DATABASE_URL="mysql://root:quizz_ps@localhost:3306/quizz"**

Nếu sai, sửa lại rồi khởi chạy lại backend.

### Không migrate được database (db push bị lỗi)

Thử reset database:

```
docker-compose down -v
docker-compose up -d
```

Sau đó chạy lại:

```
npx prisma db push
npx prisma db seed
```

### Docker không chạy

Kiểm tra:
- Docker Desktop có mở chưa
- Port 3306 hoặc 8080 có bị ứng dụng khác chiếm không
