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

## Deploy đơn giản nhất

Nếu muốn ít cấu hình nhất, hãy deploy theo cách này:

- `client/` lên Vercel
- `server/` lên Render
- database dùng MongoDB Atlas

### Frontend trên Vercel

1. Vào Vercel và import repo GitHub này.
2. Khi tạo project, chọn `Root Directory` là `client`.
3. Thêm biến môi trường:

```env
VITE_API_URL=https://<render-backend-domain>/api
```

4. Deploy project.

Lưu ý:

- Repo đã có [client/vercel.json](/e:/Workspace/WebsiteShoe/client/vercel.json) để rewrite tất cả route SPA về `index.html`, nên các đường dẫn như `/products`, `/cart`, `/shipping` sẽ không bị 404 khi refresh trên Vercel.

### Backend trên Render

1. Vào Render và tạo `Web Service` mới từ repo GitHub này.
2. Chọn `Root Directory` là `server`.
3. Có thể dùng file [render.yaml](/e:/Workspace/WebsiteShoe/render.yaml) ở root repo để Render tự đọc cấu hình build/start cơ bản.
4. Khai báo các biến môi trường:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=<mongodb-atlas-uri>
JWT_SECRET=<secret-mạnh>
JWT_EXPIRES_IN=30d
CLIENT_URL=https://<vercel-frontend-domain>
SERVER_PUBLIC_URL=https://<render-backend-domain>
```

5. Sau khi deploy xong, kiểm tra health check:

```text
https://<render-backend-domain>/api/health
```

### Thứ tự nên làm

1. Deploy backend lên Render trước.
2. Lấy domain backend và gán vào `VITE_API_URL` của frontend trên Vercel.
3. Deploy frontend lên Vercel.
4. Lấy domain frontend và cập nhật lại `CLIENT_URL` trên Render.
5. Redeploy backend một lần nữa để CORS khớp domain thật.

### Lưu ý production

- Nên dùng MongoDB Atlas thay vì Mongo local.
- [server/src/app.js](/e:/Workspace/WebsiteShoe/server/src/app.js) đã bật `trust proxy` để backend chạy đúng sau proxy của Render.
- Chức năng upload ảnh hiện đang lưu file local trong `server/uploads/`. Cách này phù hợp để demo, nhưng nếu đi production thật thì nên chuyển sang Cloudinary, S3 hoặc Vercel Blob.