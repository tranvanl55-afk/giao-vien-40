# BÁO CÁO TIẾN ĐỘ DỰ ÁN (PROJECT PROGRESS & ISSUES LOG)
## DỰ ÁN: TÔI YÊU KHOA HỌC TỰ NHIÊN (KHTN 4.0)

---

## 1. NHỮNG GÌ ĐÃ HOÀN THÀNH (COMPLETED MILESTONES)

### 1.1. Chuẩn hóa Khung Đánh giá Rubric Sư phạm
- **Tách biệt Chặng 3 và Chặng 5**: Hoàn tất phân chia 2 bảng Rubric độc lập, không còn bị gộp chung làm sai lệch tiêu chí đánh giá:
  - **Rubric Chặng 3**: 5 tiêu chí $\times$ 5 mức độ (Ý tưởng 3.1 & Quy trình 3.2 theo chuẩn  / ).
  - **Rubric Chặng 5**: 3 tiêu chí $\times$ 5 mức độ dành riêng cho Gian hàng Hội chợ Xanh.
- **Trích xuất Component dùng chung**: Đã tạo `RubricInteractivePanel` giúp giao diện đồng nhất, trực quan, có điểm phần trăm và ô nhận xét.
- **Bảng điều khiển Giáo viên (Dashboard)**: Cho phép giáo viên lọc xem từng loại rubric, tính điểm trung bình nhóm, xem chi tiết từng thành viên và xuất báo cáo CSV.

### 1.2. Giải quyết Bài toán Lưu trữ & Đồng bộ Dữ liệu
- **Cơ chế Lưu Cục bộ (Offline Auto-save)**: Triển khai `LOCAL_PROGRESS_CACHE_KEY = 'khtn9_bai30_progress_v3_state'` trong `localStorage`, học sinh không bị mất tiến độ khi vô tình tải lại trang.
- **Nút "↺ Làm lại từ đầu"**: Cho phép học sinh xóa cache an toàn và thực hiện lại bài học khi cần thiết.
- **Đồng bộ Firebase Firestore**: Đã cấu hình và cập nhật `firestore.rules` cho phép lưu trữ an toàn kết quả trắc nghiệm (`khtn9_bai30_stage2_tests`) và phiếu đánh giá (`khtn9_bai30_stage3_rubrics`).
- **Đồng bộ Google Sheets Webhook**: Xây dựng đoạn mã Google Apps Script tiếp nhận HTTP POST, ghi trực tiếp kết quả vào bảng tính của Thầy Trần Văn Lĩnh (`tranvanl55@gmail.com`).

### 1.3. Tối ưu Giao diện & Thí nghiệm Ảo
- **Nút bảo hiểm Video Chặng 2**: Bổ sung nút *"✓ Xác nhận đã xem video (nếu mạng chậm)"* ở cả Phần I và Phần III, giúp học sinh mở khóa câu hỏi trắc nghiệm ngay cả khi mạng trường học bị đứt đoạn hoặc chặn video.
- **Loại bỏ widget tĩnh thừa**: Đã xóa mô hình cắt mạch phân tử tĩnh trùng lặp ở Chặng 2 Phần II.2 để học sinh tập trung trải nghiệm mô phỏng động học.
- **Tinh gọn mô phỏng Canvas (`public/thuy-phan-tinh-bot.html`)**:
  - Đã loại bỏ nút "Thêm Thuốc thử Iod" và cuvette ống nghiệm vì không cần thiết khi phân tử Glucose đã hiện rõ.
  - Tối ưu chiều cao iframe xuống mức chuẩn `h-115` (`460px`), hiển thị trọn vẹn màn hình mà không bị thanh cuộn thừa che khuất.

### 1.4. Hệ thống Hướng dẫn Chi tiết Toàn diện cho Từng Chặng
- **Cấu trúc Dữ liệu Hướng dẫn Chuyên sâu (`STAGE_DETAILED_GUIDES`)**: Xây dựng đầy đủ hướng dẫn sư phạm cho cả 6 chặng (Chặng 1 $\rightarrow$ Chặng 6) gồm 4 phần:
  1. 🎯 *Mục tiêu cốt lõi của chặng*.
  2. 📋 *Quy trình thực hiện chi tiết từng bước (Step-by-step)* kèm gợi ý thao tác cụ thể.
  3. 💡 *Bí quyết & Lưu ý quan trọng để đạt điểm tối đa*.
  4. ✅ *Điều kiện để hoàn thành chặng (Checklist)*.
- **Giao diện Modal Hướng dẫn Tương tác Cao (`showStageGuideModal`)**:
  - Thiết kế chuẩn Glassmorphism, có thanh chuyển nhanh qua lại giữa 6 chặng để học sinh/giáo viên tham khảo trước hoặc xem lại.
  - Hỗ trợ đóng nhanh bằng phím `Escape`, nút `✕`, hoặc bấm ra ngoài màn hình.
  - Nút bấm *"Bắt đầu làm bài Chặng này"* tự động chuyển trạng thái bài học.
- **Điểm chạm (Touchpoints) kích hoạt thuận tiện trên mọi thiết bị**:
  - Banner Hướng dẫn nổi bật ngay đầu nội dung của mỗi chặng.
  - Nút Hướng dẫn trên thanh Menu Header cố định và thanh điều hướng 6 chặng.
  - Nút xem hướng dẫn tích hợp trong hộp thoại Trợ lý dẫn chuyện và Mascot góc dưới màn hình.

### 1.5. Hướng dẫn Đi kèm Trực tiếp Từng Nhiệm vụ (Task-Level Guides)
- **Từ điển Hướng dẫn 18 Nhiệm vụ (`TASK_SPECIFIC_GUIDES`)**: Tích hợp hướng dẫn riêng biệt cho toàn bộ các nhiệm vụ từ Chặng 1 đến Chặng 6.
- **Nút Bấm & Khung Hướng dẫn Co giãn (Accordion) trong từng Thẻ Nhiệm vụ**:
  - Mọi hộp `LockedTaskBox` và Thẻ Phiếu ghi bài đều có nút bấm `[ 💡 Hướng dẫn nhiệm vụ ]`.
  - Khi bấm, khung hướng dẫn viền vàng/amber trượt mở ngay trên đầu nhiệm vụ, hiển thị: 🎯 *Mục tiêu nhiệm vụ*, 📋 *Các bước thao tác cụ thể 1-2-3*, và ✨ *Mẹo làm bài*.
  - Học sinh có thể vừa đọc hướng dẫn vừa làm bài ngay bên dưới mà không bị che khuất màn hình.

### 1.6. Hệ thống Đánh giá Dự án Toàn diện 360 độ tại Chặng 6.2 (Mới hoàn thành)
- **Cấu trúc 3 Phân hệ Đánh giá Độc lập trong Ô 6.2 (`task-s6-assessment`)**:
  1. **Tab 1 — 🙋‍♂️ Học sinh tự đánh giá**:
     - *Phần I*: Analytical Rubric 4 tiêu chí $\times$ 5 mức độ (Thang 10đ, tỷ trọng: Padlet 25% • 2.5đ, Kiến thức Bài 30 25% • 2.5đ, Thực hành an toàn 30% • 3.0đ, Hợp tác & Báo cáo 20% • 2.0đ).
     - *Phần II*: Góc tự phản chiếu (Reflection) gồm 4 câu hỏi tự luận mở (Đóng góp cho nhóm, Điều tâm đắc về Hóa học Xanh, Khó khăn & cách khắc phục, Đề xuất cải tiến sản phẩm).
     - Tích hợp **Bộ chọn Nhóm 1..8** và **Nút bấm 1-chạm chọn nhanh tên học sinh**: Học sinh bấm vào tên mình (hoặc Nhóm trưởng) để tự động điền Họ tên, Lớp, Nhóm và chữ ký điện tử.
     - Tự động cộng dồn điểm `/10` và hiển thị huy hiệu xếp loại chuẩn (Xuất sắc, Tốt, Khá, Đạt, Cần cố gắng).
  2. **Tab 2 — 👑 Nhóm trưởng đánh giá thành viên**:
     - Hỗ trợ đầy đủ **8 Nhóm dự án của toàn bộ lớp học** (chuẩn hóa đầy đủ họ và tên, số thứ tự STT, số 1 là Nhóm trưởng):
       - **Nhóm 1**: NT *Nguyễn Thuý Ngân* + 5 thành viên (*Lê Hải Yến, Trần Quỳnh Như, Phạm Quỳnh Trâm, Huỳnh Kha My, Võ Như Quỳnh*).
       - **Nhóm 2**: NT *Nguyễn Thu Thảo* + 5 thành viên (*Lê Thiên Hà Giang, Hoàng Trần Ngọc Anh, Nguyễn Minh Khang, Nguyễn Minh Quân, Nguyễn Nam Phong*).
       - **Nhóm 3**: NT *Trần Hoàng Hùng* + 6 thành viên (*Bùi Minh Huy, Lê Như Cát Tường, Liêu Hoàng Gia, Đặng Thị Minh Đông, Nguyễn Hoàng Bảo Trân, Phan Lê Huy*).
       - **Nhóm 4**: NT *Trần Phương Anh (STT: 05)* + 5 thành viên (*Võ Hoàng Dung STT: 08, Phan Thanh Ngân STT: 25, Hồ Lê Bảo Ngọc STT: 27, Lê Thị Minh Thảo STT: 39, Nguyễn Phạm Tường Vy STT: 50*).
       - **Nhóm 5**: NT *Dương Minh Hạnh Quỳnh* + 5 thành viên (*Lê Nguyễn Phương Vy, Võ Trần Gia Hân, Nguyễn Huỳnh Phương Thảo, Võ Ngọc Phương Trang, Lê Hồng Sun Ny*).
       - **Nhóm 6**: NT *Nguyễn Phạm Tâm Anh* + 6 thành viên (*Lê Thạch Trâm Anh, Nguyễn Tuyết Ngân, Hoàng Hải Đăng, Nguyễn Ngọc Anh Thư, Lê Trần Bảo Trí, Phan Hồ Hữu Đạt*).
       - **Nhóm 7**: NT *Lê Quốc Phong Danh* + 5 thành viên (*Đào Tiến Dũng, Hoàng Trọng Khôi, Ngô Gia Phúc, Phạm Tuấn Ngọc, Nguyễn Đông Sơn*).
       - **Nhóm 8**: NT *Vũ Bá Tài* + 3 thành viên (*Đỗ Quốc Huy, Trần Đức Anh, Lê Thanh Bình*).
     - Giao diện thẻ chọn từng bạn để chấm theo Rubric 4 tiêu chí đóng góp cá nhân (Padlet 25%, Nhiệm vụ chuyên môn 35%, Kỷ luật 20%, Poster/Thuyết trình 20%).
     - Tự động tính điểm `/10`, ô nhận xét riêng cho từng bạn, và Bảng tổng hợp điểm của cả nhóm kèm điểm trung bình.
  3. **Tab 3 — 👨‍🏫 Giáo viên đánh giá nhóm**:
     - Chuẩn hóa theo Hướng dẫn thiết kế & sử dụng Rubric của **Rubric tiêu chuẩn** — **Trường THCS Ngô Chí Quốc — Tổ KHTN**.
     - Tích hợp thanh chọn nhanh **8 Nhóm dự án của lớp**: Giáo viên chỉ cần bấm chọn Nhóm 1..8 để tự động điền Tên nhóm, Lớp, Tên sản phẩm dự án.
     - Bảng Analytical Rubric 7 tiêu chí $\times$ 5 mức độ xuyên suốt cả dự án (Padlet 10% • 1.0đ, Ý tưởng xanh 15% • 1.5đ, Quy trình & An toàn 15% • 1.5đ, Sản phẩm tái sinh 20% • 2.0đ, Poster khoa học 15% • 1.5đ, Video tổng kết 15% • 1.5đ, Thuyết trình phản biện 10% • 1.0đ).
     - Tự động cộng tổng điểm `/10`, quy đổi mức đạt chuẩn bằng hộp chọn trực quan, ô nhận xét điểm mạnh & góp ý cải tiến, ô lưu ý điều chỉnh điểm cá nhân.
  4. **Tiện ích In & Xuất PDF**: Tích hợp nút `[ In / Xuất PDF ]` cho phép giáo viên và học sinh xuất bản in hoặc lưu file PDF ngay từ giao diện.
  5. **Bảo toàn trọn vẹn Ô 6.1**: Tích hợp tinh gọn phần Tổng kết kiến thức EM ĐÃ HỌC/EM CÓ THỂ cùng Trò chơi vận động AI Body Pose Quiz trên Smart TV vào cùng Ô 6.1.

---

## 2. NHỮNG LỖI ĐÃ PHÁT HIỆN & ĐÃ XỬ LÝ (RESOLVED ISSUES & BUGS)

| Sự cố phát hiện | Nguyên nhân gốc rễ | Giải pháp đã khắc phục triệt để | Trạng thái |
| :--- | :--- | :--- | :---: |
| **Lỗi TypeScript TS2322** trong `TinhBotCelluloseElearning.tsx` | Thiếu danh mục `'Trình bày & Phản biện'` trong Union Type `Stage3RubricCriterion['category']`. | Bổ sung đầy đủ giá trị vào Union Type và thêm ánh xạ màu sắc giao diện tương ứng. | **ĐÃ XỬ LÝ (0 error)** |
| **Đánh giá Rubric & Điểm kiểm tra không được lưu đến đâu cả** | Firestore Rules chặn người dùng ẩn danh/chưa đăng nhập; chưa có Webhook Google Sheets mặc định. | Cập nhật `firestore.rules` mở quyền tạo dữ liệu cho 2 collection; viết mã Apps Script Webhook kết nối Google Sheets và bổ sung thông báo trạng thái nộp bài rõ ràng. | **ĐÃ XỬ LÝ** |
| **Kẹt video không mở khóa được câu hỏi ở Chặng 2** | Sự kiện `onEnded` của HTML5 video không kích hoạt khi học sinh dùng mạng 3G/Wifi yếu hoặc tua video. | Bổ sung nút xác nhận xem video thủ công và hạ ngưỡng bảo hiểm `currentTime >= duration - 0.25s`. | **ĐÃ XỬ LÝ** |
| **Khung mô phỏng bị dài và tràn màn hình** | Thẻ iframe đặt chiều cao `h-155` quá lớn và có các nút chức năng phụ gây chật chội. | Rút gọn chiều cao còn `h-115`, bỏ các nút thừa trong file HTML Canvas, tối ưu CSS Media Query. | **ĐÃ XỬ LÝ** |
| **Màn hình cảnh báo "Google hasn't verified this app" khi triển khai Webhook** | Google Apps Script yêu cầu cấp quyền truy cập vào Google Sheets của tài khoản giáo viên. | Hướng dẫn giáo viên bấm vào **Advanced / Nâng cao** $\rightarrow$ chọn **Go to Dự án (unsafe)** $\rightarrow$ bấm **Allow / Cho phép** để lấy link `/exec`. | **ĐÃ HƯỚNG DẪN** |

---

## 3. BƯỚC TIẾP THEO CẦN THỰC HIỆN (NEXT IMMEDIATE STEPS)

1. **Cập nhật URL Webhook chính thức**:
   - Khi giáo viên sao chép link Web App dạng `https://script.google.com/macros/s/.../exec`, hỗ trợ giáo viên gắn trực tiếp vào biến `GOOGLE_SHEET_WEBHOOK_URL` trong mã nguồn hoặc dán qua thanh địa chỉ `?webhook=...`.
2. **Kiểm tra thực chiến trên Smart TV / Máy chiếu**:
   - Chạy thử bài giảng Bài 30 trên màn hình lớn của lớp học để kiểm tra độ rõ của văn bản và khoảng cách bấm của các nút.
3. **Mở rộng các bài học tiếp theo**:
   - Áp dụng kiến trúc Rubric và Canvas tương tác này cho các chuyên đề tiếp theo trong chương trình Khoa học Tự nhiên 9.
