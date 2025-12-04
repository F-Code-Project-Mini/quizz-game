# Hướng dẫn cài đặt và chạy dự án Quizz Game

Dự án Quizz Game bao gồm hai phần chính:

- backend/ – phần API sử dụng Node.js, Prisma và MySQL
- frontend/ – giao diện người dùng xây dựng bằng React + Vite
- Database chạy thông qua Docker

Tài liệu này hướng dẫn chi tiết từng bước để người mới cũng có thể chạy được dự án.

---

## 0. Điều kiện tiên quyết

Trước khi bắt đầu, hãy đảm bảo máy bạn đã cài:
1. **Node.js**
    * Khuyến nghị: Node.js phiên bản LTS (ví dụ: ≥ 18.x)
    * Kiểm tra:
        * `node -v`
        * `npm -v`
2. **Docker Desktop** (tích hợp sẵn Docker Engine + Docker Compose v2)
    * [Tải](https://www.docker.com/get-started/) tại trang chủ Docker (chọn bản phù hợp Windows / macOS / Linux).
    * Sau khi cài xong, mở Docker Desktop và đảm bảo nó đang chạy (không báo lỗi).

3. **Git** (để clone source code)
    * [Tải](https://git-scm.com/install/) và lựa chọn hệ điều hành phù hợp để cài đặt
    * Kiểm tra: `git --version`

Nếu các lệnh trên chạy được và báo phiên bản → bạn có thể tiếp tục.

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

## 2. Khởi chạy Database/ các service liên quan khác bằng Docker

Đứng trong thư mục **quizz-game** và chạy:

```
docker compose up -d
```

Lệnh này sẽ khởi động:
- MySQL
- phpMyAdmin
- Redis
- ... có thể cập nhật thêm trong tương lai

Bạn có thể kiểm tra các tiến trình đang chạy bằng:

```
docker ps
```

Ngoài ra nếu muốn dừng tất cả tiến trình đang chạy thì:
```
docker compose down
```

---

## 3. Truy cập phpMyAdmin để xem Database

Mở trình duyệt và truy cập: http://localhost:8080

Đăng nhập với:

User: **root**  
Password: **quizz_ps**

---

## 4. Chạy phần Frontend

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

## 5. Chạy phần Backend

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

## 6. Migrate Database bằng Prisma

Backend dùng Prisma nên cần tạo bảng trong database.

Đứng tại thư mục **backend** và chạy:

```
npx prisma db push
```

---

## 7. Seed dữ liệu mẫu

Sau khi migrate xong, chạy:

```
npx prisma db seed
```

Lệnh này sẽ thêm dữ liệu mẫu giúp bạn test hệ thống ngay.

---

## 8. Hoàn tất

Khi bạn đã chạy:

- Docker (MySQL + phpMyAdmin)
- Frontend (npm run dev)
- Backend (npm run dev)
- Migrate (db push)
- Seed (db seed)

→ Dự án đã sẵn sàng để sử dụng.

---

## 9. Một số lỗi thường gặp

### Backend không kết nối được database

Kiểm tra file .env trong thư mục backend.

**DATABASE_URL="mysql://root:quizz_ps@localhost:3306/quizz"**

Nếu sai, sửa lại rồi khởi chạy lại backend.

### Không migrate được database (db push bị lỗi)

Thử reset database:

```
docker compose down -v
docker compose up -d
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
