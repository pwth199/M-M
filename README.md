# 🌱 MẦM • Trao Gửi Yêu Thương – Ươm Mầm Sự Sống

Hệ thống Website Cửa Hàng Xanh Bền Vững & Nền Tảng Quà Tặng QR Cá Nhân Hóa.

---

## 🌟 Tính Năng Nổi Bật

- **Cửa Hàng Xanh**:
  - Trưng bày các sản phẩm giấy hạt thủ công, bookmark hoa khô, viên nén ươm mầm.
  - Phân loại theo danh mục mục lục linh hoạt, tìm kiếm sản phẩm theo từ khóa.
  - Xem chi tiết sản phẩm, lựa chọn phân loại và tùy chọn quà tặng đi kèm.
- **Tạo Quà Tặng QR & Thiệp Lời Chúc**:
  - Khách hàng tự do tạo thiệp quà tặng, đính kèm thông điệp, hình ảnh kỷ niệm.
  - Khách có thể tùy chỉnh tiêu đề dịp tặng quà theo ý muốn.
  - Hệ thống tạo mã QR độc quyền dẫn tới trang thông điệp bí mật dành riêng cho người nhận.
- **Khu Vườn Mầm (Cộng Đồng)**:
  - Nơi chia sẻ hành trình nảy mầm và nhật ký chăm sóc cây xanh.
  - Phân quyền: Đăng nhập tài khoản để đăng tải bài viết chia sẻ, khách vãng lai vẫn có thể xem và tương tác thả tim.
- **Giỏ Hàng & Thanh Toán VietQR Tự Động**:
  - Giỏ hàng trực quan, tính toán tổng tiền chính xác.
  - Tạo mã VietQR chuẩn ngân hàng kèm số tiền và nội dung chuyển khoản tự động.
- **Bảng Điều Khiển Quản Trị (Admin Dashboard)**:
  - Mã PIN mặc định: `mam2026` (Bảo mật bằng thuật toán SHA-256 thuần JavaScript, chạy tốt trên mọi thiết bị và trình duyệt).
  - **Quản lý danh mục & mục lục**: Thêm mới, đổi tên, thay đổi thứ tự hiển thị và xóa danh mục.
  - **Quản lý sản phẩm & giá bán**: Thêm sản phẩm, cập nhật giá nhanh chóng.
  - **Quản lý CMS giao diện**: Chỉnh sửa tiêu đề banner, mô tả, khẩu hiệu, thương hiệu logo,...
  - **Xuất file HTML độc lập (Gửi Zalo)**: Tải bản xuất hoàn chỉnh đã nhúng toàn bộ dữ liệu mới nhất để gửi qua Zalo hoặc máy khác.
- **Tích Hợp Google Apps Script**:
  - Đồng bộ dữ liệu đơn hàng và khách hàng về Google Sheets (`google-apps-script.gs`).

---

## 📁 Cấu Trúc Thư Mục

| Tên File | Chức Năng |
| :--- | :--- |
| **`index.html`** | File giao diện web chính thức (chạy trên máy tính, điện thoại và GitHub Pages) |
| **`mam (1).html`** | Bản sao lưu giao diện gốc |
| **`google-apps-script.gs`** | Mã nguồn Google Apps Script kết nối Google Sheets |
| **`mam_backup.html`** | Bản sao lưu dữ liệu cũ |

---

## 🚀 Hướng Dẫn Bật Website Trực Tuyến Miễn Phí (GitHub Pages)

1. Đẩy mã nguồn lên kho lưu trữ (Repository) trên GitHub của bạn.
2. Tại trang GitHub của Repository, chọn **Settings** (Cài đặt) > **Pages** (ở thanh menu bên trái).
3. Tại mục **Build and deployment** > **Branch**:
   - Chọn nhánh: `main`
   - Chọn thư mục: `/ (root)`
   - Nhấn **Save**.
4. Sau 1 - 2 phút, GitHub sẽ cấp cho bạn một đường link website trực tuyến miễn phí có chứng chỉ HTTPS chuẩn quốc tế (ví dụ: `https://<tên-github-của-bạn>.github.io/<tên-repo>/`).
