# WebsiteShoe

Hướng dẫn chạy dự án bán giày fullstack trong repo này.

## Tổng quan

- `server/`: backend dùng Express + MongoDB
- `client/`: frontend dùng React + Vite + Tailwind CSS

## Yêu cầu môi trường

Máy cần cài sẵn:

- Node.js `18+`
- npm `9+`
- MongoDB local hoặc chuỗi kết nối MongoDB hợp lệ

## Cách chạy backend

Mở terminal thứ nhất và chạy:

```powershell
cd server
npm install
Copy-Item .env.example .env
```

Nội dung file `.env` mặc định:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/website-shoe
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_with_a_strong_secret_key
JWT_EXPIRES_IN=30d
```

Lưu ý:

- Hãy bảo đảm MongoDB đã được khởi động trước khi chạy server.
- `CLIENT_URL` phải trùng với địa chỉ frontend để tránh lỗi CORS.

Nếu muốn nạp dữ liệu sản phẩm mẫu, chạy thêm:

```powershell
npm run seed
```

Sau đó khởi động backend:

```powershell
npm run dev
```

Backend mặc định chạy tại:

```text
http://localhost:5000
```

Có thể kiểm tra nhanh bằng:

```powershell
Invoke-RestMethod http://localhost:5000/api/health
```

## Cách chạy frontend

Mở terminal thứ hai và chạy:

```powershell
cd client
npm install
Copy-Item .env.example .env
npm run dev
```

Nội dung file `.env` của frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

Frontend mặc định chạy tại:

```text
http://localhost:5173
```

## Chạy nhanh toàn bộ dự án

Terminal 1:

```powershell
cd server
npm install
Copy-Item .env.example .env
npm run seed
npm run dev
```

Terminal 2:

```powershell
cd client
npm install
Copy-Item .env.example .env
npm run dev
```

## Tài khoản quản trị

Hiện tại repo chưa có script tạo sẵn tài khoản admin.

Cách làm:

1. Đăng ký một tài khoản qua API `POST /api/users`.
2. Mở MongoDB và cập nhật trường `isAdmin` thành `true`.

Ví dụ với `mongosh`:

```powershell
mongosh "mongodb://127.0.0.1:27017/website-shoe" --eval "db.users.updateOne({ email: 'admin@example.com' }, { \$set: { isAdmin: true } })"
```

## Một số API chính

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/users`
- `POST /api/users/login`
- `GET /api/users/profile`
- `POST /api/orders`
- `GET /api/orders/:id`
- `GET /api/orders`
- `PUT /api/orders/:id/deliver`

## Các lệnh thường dùng

### Backend

- `npm run dev`: chạy server ở chế độ phát triển với `nodemon`
- `npm start`: chạy server ở chế độ thường
- `npm run seed`: xóa dữ liệu sản phẩm cũ và nạp dữ liệu mẫu

### Frontend

- `npm run dev`: chạy frontend ở chế độ phát triển
- `npm run build`: build frontend
- `npm run preview`: xem bản build local

## File quan trọng

- [README.md](/e:/Workspace/WebsiteShoe/README.md)
- [server/package.json](/e:/Workspace/WebsiteShoe/server/package.json)
- [server/.env.example](/e:/Workspace/WebsiteShoe/server/.env.example)
- [server/src/server.js](/e:/Workspace/WebsiteShoe/server/src/server.js)
- [server/src/app.js](/e:/Workspace/WebsiteShoe/server/src/app.js)
- [server/src/seeder.js](/e:/Workspace/WebsiteShoe/server/src/seeder.js)
- [client/package.json](/e:/Workspace/WebsiteShoe/client/package.json)
- [client/.env.example](/e:/Workspace/WebsiteShoe/client/.env.example)
- [client/src/main.jsx](/e:/Workspace/WebsiteShoe/client/src/main.jsx)
