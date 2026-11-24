# Open Open · By OpenDev

Website học lập trình nhiều trang, được mở rộng từ giao diện OpenDev Learn ban đầu.

## Cấu trúc

- `index.html`: trang chủ Open Open.
- `courses/html.html` đến `courses/sql.html`: 8 trang học riêng cho từng ngôn ngữ.
- `assets/styles.css`: hệ thống giao diện dùng chung (mica/blur, gradient xanh lam - xanh ngọc, bo góc, responsive và animation).
- `assets/course-data.js`: nội dung 4 bài học cho mỗi ngôn ngữ.
- `assets/app.js`: điều hướng bài học, tìm khóa học, sao chép code và lưu tiến độ trên trình duyệt.

## Chạy

1. Giải nén thư mục.
2. Mở `index.html` bằng trình duyệt hiện đại.
3. Chọn một ngôn ngữ để mở trang bài học riêng.

Có thể chạy qua máy chủ tĩnh (khuyến nghị) bằng cách vào thư mục dự án rồi chạy `python -m http.server 8000`, sau đó mở `http://localhost:8000`.

## Lưu ý

- Website không cần framework hay thư viện bên ngoài.
- Tiến độ học được lưu cục bộ trong trình duyệt bằng localStorage.
- Khu vực ví dụ hiển thị kết quả mẫu để minh họa; website chưa tích hợp compiler/interpreter thực thi các ngôn ngữ.
