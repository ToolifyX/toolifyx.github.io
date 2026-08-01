# Walkthrough - Tích hợp Firebase Analytics

Tôi đã hoàn tất việc tích hợp Firebase Analytics vào hệ thống theo dõi của dự án PhungX. Việc này giúp bạn theo dõi hành vi người dùng chi tiết hơn thông qua Firebase Console.

## Các thay đổi đã thực hiện

### 1. Cài đặt Firebase SDK
- Đã cài đặt thư viện chính thức `firebase` (`npm install firebase`).

### 2. Cấu hình hệ thống
- **[analytics/config.ts](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/analytics/config.ts):** Thêm các trường cấu hình cần thiết cho Firebase (API Key, Project ID, App ID...).
- Đã thêm logic kiểm tra cấu hình để cảnh báo nếu thiếu các biến môi trường cần thiết trong chế độ phát triển.

### 3. Triển khai Firebase Provider
- **[analytics/providers/FirebaseProvider.ts](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/analytics/providers/FirebaseProvider.ts):** Tạo lớp Provider mới để kết nối AnalyticsManager với Firebase SDK.
- Hỗ trợ đầy đủ:
    - `trackEvent`: Gửi các sự kiện tùy chỉnh (tool_opened, search_submitted...).
    - `trackPageView`: Theo dõi lượt xem trang.
    - `setUserProperties`: Lưu thông tin thuộc tính người dùng (theme, language...).
    - `setConsent`: Hỗ trợ quản lý quyền riêng tư.

### 4. Kích hoạt tự động
- **[analytics/AnalyticsInitializer.tsx](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/analytics/AnalyticsInitializer.tsx):** Đăng ký `FirebaseProvider` vào danh sách các nhà cung cấp phân tích. Firebase sẽ tự động khởi chạy cùng với Google Analytics và PostHog.

## Hướng dẫn cấu hình

Để Firebase hoạt động, bạn cần thêm các biến môi trường sau vào file `.env.local` của mình:

> [!IMPORTANT]
> Bạn có thể xem mẫu tại file [firebase_env_template.txt](file:///Users/phung/Documents/Workspace/google-play/toolifyx.github.io/firebase_env_template.txt).

```bash
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=phungx-xxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=phungx-xxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=phungx-xxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXX
```

## Kết quả kiểm tra
- [x] **Build:** `npm run build` hoàn thành thành công, không có lỗi TypeScript.
- [x] **Modular:** Firebase được load động ở phía client, không làm chậm quá trình render server ban đầu.
- [x] **Hợp nhất:** Các sự kiện hiện tại sẽ được gửi đồng thời tới cả Google Analytics, PostHog và Firebase.
