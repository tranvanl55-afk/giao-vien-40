# KẾ HOẠCH HÀNH ĐỘNG & DANH SÁCH NHIỆM VỤ (TASKS ROADMAP)
## DỰ ÁN: TÔI YÊU KHOA HỌC TỰ NHIÊN (KHTN 4.0)

---

## 1. GIAI ĐOẠN 1: THIẾT LẬP NỀN TẢNG VÀ KIẾN TRÚC LÕI (HOÀN TẤT)
- [x] Khởi tạo dự án Vite 6 + React 19 + TypeScript + Tailwind CSS v4.
- [x] Thiết lập hệ thống Router phân cấp môn học (Hóa học, Vật lý, Sinh học, Công nghệ).
- [x] Tích hợp Firebase Authentication (Email, Google, Khách ẩn danh).
- [x] Xây dựng hệ thống Trợ lý học tập AI thông minh với Google Gemini SDK.
- [x] Tạo kho tài nguyên hơn 60 mô phỏng và trò chơi tương tác đa người chơi.

---

## 2. GIAI ĐOẠN 2: PHÁT TRIỂN DỰ ÁN STEAM BÀI 30 - TINH BỘT & CELLULOSE (HOÀN TẤT)
- [x] Số hóa toàn bộ 6 chặng học tập sư phạm:
  - [x] **Chặng 1**: Video phóng sự rác thải, ô nhiễm trắng và gợi mở dự án tái chế.
  - [x] **Chặng 2**: Kiến thức cốt lõi (Cấu trúc phân tử, Tính chất hóa học, Phản ứng màu Iodine, Thủy phân enzyme, Ứng dụng & Bài kiểm tra củng cố).
  - [x] **Chặng 3**: Nghiên cứu & Thiết kế giải pháp kỹ thuật (Nhóm 3.1 & 3.2).
  - [x] **Chặng 4**: Chế tạo mẫu thử & Ghi nhận thông số nhật ký.
  - [x] **Chặng 5**: Báo cáo Gian hàng Hội chợ Xanh & Đánh giá gian hàng.
  - [x] **Chặng 6**: Khảo sát cảm xúc, lan tỏa tinh thần sống xanh.
- [x] Tích hợp mô phỏng Canvas HTML5 động học phân tử Enzyme Amylase (`thuy-phan-tinh-bot.html`).

---

## 3. GIAI ĐOẠN 3: TÁCH BIỆT & CHUẨN HÓA HỆ THỐNG RUBRIC (HOÀN TẤT)
- [x] Phân tích đối chiếu theo chuẩn khung năng lực  / .
- [x] Tách biệt độc lập **Rubric Chặng 3** (5 tiêu chí $\times$ 5 mức độ: Tính mới ý tưởng, Kiến thức KHTN, Kỹ năng thiết kế quy trình, Khả năng ứng dụng thực tế, Trình bày & Phản biện).
- [x] Tách biệt độc lập **Rubric Chặng 5** (3 tiêu chí $\times$ 5 mức độ: Tính thẩm mỹ gian hàng, Thông điệp bảo vệ môi trường, Kỹ năng thuyết minh).
- [x] Xây dựng Component tái sử dụng `RubricInteractivePanel` có thanh tiến độ phần trăm và ghi chú đóng góp.
- [x] Xây dựng `TeacherDashboard` cho phép lọc theo loại Rubric (Chặng 3 / Chặng 5 / Tất cả), tính điểm trung bình nhóm và xuất file CSV.

---

## 4. GIAI ĐOẠN 4: ĐỒNG BỘ DỮ LIỆU ĐA TẦNG & CHỐNG MẤT DỮ LIỆU (HOÀN TẤT)
- [x] Triển khai bộ nhớ cục bộ `LOCAL_PROGRESS_CACHE_KEY` tự động lưu từng hành động của học sinh.
- [x] Bổ sung nút "↺ Làm lại từ đầu" có xác nhận cảnh báo an toàn.
- [x] Cấu hình Firestore Rules cho phép ghi nhận bài kiểm tra (`khtn9_bai30_stage2_tests`) và bảng rubric (`khtn9_bai30_stage3_rubrics`).
- [x] Viết script Google Apps Script Webhook kết nối tự động về bảng tính Google Sheets của giáo viên (Thầy Trần Văn Lĩnh `tranvanl55@gmail.com`).
- [x] Cung cấp tham số URL `?webhook=...` để giáo viên cấu hình linh hoạt cho từng lớp học.

---

## 5. GIAI ĐOẠN 5: TINH GỌN GIAO DIỆN & TỐI ƯU HÓA TRẢI NGHIỆM LỚP HỌC (HOÀN TẤT)
- [x] Loại bỏ widget cắt mạch phân tử tĩnh trùng lặp ở Chặng 2 Phần II.2 để học sinh tập trung vào mô phỏng Canvas tương tác.
- [x] Tinh gọn file mô phỏng `thuy-phan-tinh-bot.html`:
  - [x] Loại bỏ nút "Thêm Thuốc thử Iod (Kiểm tra)" và ống nghiệm thử nghiệm vì ở trạng thái thu nhỏ học sinh đã quan sát rõ các hạt Glucose phân rã.
  - [x] Cân chỉnh chiều cao iframe về `h-115` (`460px`) hiển thị trọn vẹn màn hình mà không cần thanh cuộn phụ.
- [x] Thêm nút bảo hiểm video *"✓ Xác nhận đã xem video (nếu mạng chậm)"* ở Chặng 2 Phần I & Phần III, chống kẹt bài khi mạng học đường yếu.
- [x] Xây dựng hệ thống Hướng dẫn chi tiết từng chặng (`STAGE_DETAILED_GUIDES`):
  - [x] Soạn thảo hướng dẫn sư phạm 4 phần chuẩn hóa (Mục tiêu, Quy trình từng bước, Bí quyết, Điều kiện hoàn thành) cho cả 6 chặng.
  - [x] Tích hợp Hộp thoại Hướng dẫn (Modal) tương tác cao, chuyển tab 6 chặng, phím tắt Escape.
  - [x] Bố trí các nút bấm/banner kích hoạt hướng dẫn ở Header, Navbar, đầu mỗi Chặng và Trợ lý dẫn chuyện.
- [x] Tích hợp Hướng dẫn đi kèm trực tiếp từng nhiệm vụ (`TASK_SPECIFIC_GUIDES`):
  - [x] Soạn thảo hướng dẫn riêng biệt cho 18 nhiệm vụ cụ thể (Mục tiêu, Các bước thực hiện 1-2-3, Mẹo làm bài).
  - [x] Bổ sung nút co giãn `[ 💡 Hướng dẫn nhiệm vụ ]` vào `LockedTaskBox` và Thẻ Phiếu ghi bài.
  - [x] Tối ưu trải nghiệm: vừa đọc hướng dẫn vừa thao tác làm bài trực tiếp bên dưới không bị che khuất màn hình.

---

## 6. GIAI ĐOẠN 6: ĐÁNH GIÁ DỰ ÁN TOÀN DIỆN 360 ĐỘ TẠI CHẶNG 6.2 (HOÀN TẤT)
- [x] **Tái cấu trúc Chặng 6 sư phạm**:
  - [x] **Ô 6.1**: Tích hợp Tổng kết kiến thức EM ĐÃ HỌC/EM CÓ THỂ cùng Trò chơi vận động AI Body Pose Quiz trên Smart TV (hoặc trắc nghiệm cá nhân).
  - [x] **Ô 6.2**: Xây dựng phân hệ Đánh giá dự án toàn diện 360 độ gồm 3 Tab độc lập.
- [x] **Tab 1: Học sinh tự đánh giá & Reflection**:
  - [x] Rubric 4 tiêu chí $\times$ 5 mức độ (Padlet 25%, Kiến thức Bài 30 25%, Kỹ năng thực hành an toàn 30%, Hợp tác & Báo cáo 20% — Thang 10đ).
  - [x] Góc tự phản chiếu (Reflection) gồm 4 câu hỏi tự luận mở (Đóng góp cho nhóm, Điều tâm đắc, Khó khăn & cách khắc phục, Đề xuất cải tiến).
  - [x] Tích hợp bộ chọn 7 Nhóm dự án và nút 1-chạm chọn nhanh tên học sinh (auto-fill Họ tên, Lớp, Nhóm, Chữ ký).
  - [x] Ký tên học sinh, tự động tính tổng điểm và quy đổi xếp loại chuẩn.
- [x] **Tab 2: Nhóm trưởng đánh giá thành viên**:
  - [x] Nạp sẵn toàn bộ **7 Nhóm dự án của cả lớp** (đầy đủ họ và tên, số 1 là Nhóm trưởng, có số thứ tự STT):
    - Nhóm 1: NT Nguyễn Thuý Ngân + 5 thành viên (Lê Hải Yến, Trần Quỳnh Như, Phạm Quỳnh Trâm, Huỳnh Kha My, Võ Như Quỳnh).
    - Nhóm 2: NT Nguyễn Thu Thảo + 5 thành viên (Lê Thiên Hà Giang, Hoàng Trần Ngọc Anh, Nguyễn Minh Khang, Nguyễn Minh Quân, Nguyễn Nam Phong).
    - Nhóm 3: NT Trần Hoàng Hùng + 6 thành viên (Bùi Minh Huy, Lê Như Cát Tường, Liêu Hoàng Gia, Đặng Thị Minh Đông, Nguyễn Hoàng Bảo Trân, Phan Lê Huy).
    - Nhóm 4: NT Trần Phương Anh (STT: 05) + 5 thành viên (Võ Hoàng Dung STT: 08, Phan Thanh Ngân STT: 25, Hồ Lê Bảo Ngọc STT: 27, Lê Thị Minh Thảo STT: 39, Nguyễn Phạm Tường Vy STT: 50).
    - Nhóm 5: NT Dương Minh Hạnh Quỳnh + 5 thành viên (Lê Nguyễn Phương Vy, Võ Trần Gia Hân, Nguyễn Huỳnh Phương Thảo, Võ Ngọc Phương Trang, Lê Hồng Sun Ny).
    - Nhóm 6: NT Nguyễn Phạm Tâm Anh + 6 thành viên (Lê Thạch Trâm Anh, Nguyễn Tuyết Ngân, Hoàng Hải Đăng, Nguyễn Ngọc Anh Thư, Lê Trần Bảo Trí, Phan Hồ Hữu Đạt).
    - Nhóm 7: NT Lê Quốc Phong Danh + 5 thành viên (Đào Tiến Dũng, Hoàng Trọng Khôi, Ngô Gia Phúc, Phạm Tuấn Ngọc, Nguyễn Đông Sơn).
  - [x] Thẻ tương tác chọn thành viên để chấm theo Rubric 4 tiêu chí đóng góp cá nhân (Padlet 25%, Chế tạo 35%, Kỷ luật 20%, Poster/Thuyết trình 20%).
  - [x] Ô nhận xét riêng cho từng bạn, Bảng tổng hợp điểm cả nhóm và thống kê điểm trung bình.
- [x] **Tab 3: Giáo viên đánh giá nhóm**:
  - [x] Chuẩn hóa theo tiêu chuẩn **Rubric tiêu chuẩn** — **Trường THCS Ngô Chí Quốc — Tổ KHTN**.
  - [x] Thanh chọn nhanh 7 Nhóm dự án của lớp để chuyển đổi giữa các nhóm với 1 click.
  - [x] Analytical Rubric 7 tiêu chí $\times$ 5 mức độ xuyên suốt cả dự án (Padlet 10%, Ý tưởng xanh 15%, Quy trình & An toàn 15%, Sản phẩm tái sinh 20%, Poster 15%, Video 15%, Thuyết trình phản biện 10%).
  - [x] Khung nhận xét điểm mạnh & góp ý cải tiến, quy đổi mức đạt chuẩn bằng hộp chọn trực quan, lưu ý điều chỉnh điểm cá nhân.
- [x] **Tiện ích In & Xuất PDF**: Nút In/Xuất PDF trực tiếp trên thanh điều hướng đánh giá.

---

## 7. GIAI ĐOẠN 7: KẾ HOẠCH BẢO TRÌ & NÂNG CẤP TIẾP THEO (BACKLOG)
- [ ] **Bước 1**: Nhận URL Webhook chính thức từ giáo viên sau khi hoàn tất bước Triển khai Ứng dụng Web (Web App) trên Google Apps Script để gắn cố định làm Webhook mặc định.
- [ ] **Bước 2**: Mở rộng hệ thống Rubric tương tự cho các bài học STEAM khác trong chương trình KHTN 9 (Ví dụ: Bài Polyme, Bài Nhiên liệu, Bài Kim loại).
- [ ] **Bước 3**: Bổ sung chế độ nén Offline PWA (Progressive Web App) hỗ trợ chạy hoàn toàn ngoại tuyến không cần internet tại các điểm trường vùng sâu vùng xa.
- [ ] **Bước 4**: Kiểm thử định kỳ tính tương thích với các bản cập nhật trình duyệt mới trên Smart TV và hệ điều hành Android TV.
