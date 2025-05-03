# 🎓 Đồ Án Tốt Nghiệp - Triển khai Hệ thống Tìm kiếm và Gợi ý bằng Kubernetes

## 📦 Repository Chính

- Backend & Triển khai: [backend-do-an](https://github.com/Ha-Hieu-Thanh/do-an)
- Frontend: [frontend-do-an](https://github.com/Ha-Hieu-Thanh/front-end-do-an)
- Nginx Server (Phục vụ kiểm thử chiến lược cân bằng tải): [nginx-server](https://github.com/Ha-Hieu-Thanh/nginx-server)
- Service chuyển text thành vector: [embedding_service](https://github.com/Ha-Hieu-Thanh/embedding_service)

---

## 🚀 Hướng dẫn triển khai nhanh

### 1. Clone repository chính

```bash
git clone https://github.com/Ha-Hieu-Thanh/do-an.git
cd do-an
```

### 2. Khởi tạo Minikube với tài nguyên phù hợp

```bash
minikube start --cpus=6 --memory=12288 --driver=docker
```

### 3. Deploy các tài nguyên Kubernetes

```bash
kubectl apply -f k8s/
```

### 4. Kích hoạt tunnel để truy cập từ bên ngoài

```bash
minikube tunnel
```

### 5. (Tuỳ chọn) Tạo đường dẫn public với ngrok

```bash
ngrok http http://localhost
```

---

## 💡 Ghi chú

- Đảm bảo đã cài đặt đầy đủ: `kubectl`, `minikube`, `docker`, và `ngrok`.
- Trong thư mục `k8s/` đã bao gồm định nghĩa triển khai cho backend, frontend, dịch vụ embedding, và cấu hình nginx (nếu có).
- Bạn có thể chỉnh sửa cấu hình service, deployment hoặc ingress tùy theo yêu cầu thử nghiệm.

---

## 📞 Liên hệ

Mọi thắc mắc, vui lòng liên hệ qua GitHub hoặc mở issue tại repository tương ứng.
