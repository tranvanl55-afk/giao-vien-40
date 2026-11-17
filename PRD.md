# TÀI LIỆU YÊU CẦU SẢN PHẨM (PRD - PRODUCT REQUIREMENTS DOCUMENT)
## DỰ ÁN: TÔI YÊU KHOA HỌC TỰ NHIÊN (KHTN 4.0)

---

## 1. TỔNG QUAN DỰ ÁN
**Tôi Yêu Khoa Học Tự Nhiên** là nền tảng E-Learning và Mô phỏng tương tác chuyên sâu dành cho môn Khoa học Tự nhiên cấp THCS & THPT theo chương trình GDPT 2018. Dự án số hóa toàn diện quá trình dạy và học với trọng tâm kết hợp liên môn STEAM, mô phỏng động học phân tử thời gian thực, trò chơi giáo dục và hệ thống đánh giá Rubric chuẩn sư phạm.

---

## 2. BẠN ĐANG XÂY DỰNG GÌ? (WHAT WE ARE BUILDING)

### 2.1. Nền tảng E-Learning & Mô phỏng Trực quan
- **Mô phỏng Khoa học Tương tác 2D/3D**: Hơn 60 mô phỏng chuyên đề (Hóa học, Vật lý, Sinh học, AI/Machine Learning, Cơ học, Thiên văn học).
- **Hệ thống Bài giảng STEAM Chuẩn sư phạm**:
  - Tiêu biểu: **Bài 30 - Tinh bột và Cellulose (KHTN 9)**: Dự án STEAM *"Bắt đầu từ sự kết thúc - Tái sinh rác thải thành giấy nảy mầm và bao bì sinh học"*.
  - Cấu trúc 6 Chặng sư phạm khép kín:
    - **Chặng 1: Khởi động & Nhận thức vấn đề**: Video phóng sự rác thải, ô nhiễm trắng, câu hỏi gợi mở kết nối kiến thức thực tiễn.
    - **Chặng 2: Khám phá kiến thức cốt lõi**: 
      + I. Cấu trúc phân tử & Trạng thái tự nhiên của Tinh bột và Cellulose.
      + II. Tính chất hóa học: Phản ứng màu đặc trưng với Iodine và Phản ứng thủy phân xúc tác acid/enzyme Amylase kèm mô phỏng động học phân tử Canvas.
      + III. Ứng dụng & Ý nghĩa sinh học đối với cơ thể và môi trường.
      + Bài kiểm tra củng cố kiến thức trắc nghiệm & tự luận chấm điểm tự động.
    - **Chặng 3: Nghiên cứu kiến thức nền & Đề xuất giải pháp**:
      + Nhóm 3.1: Đề xuất ý tưởng tái chế vỏ trấu, bã mía, rơm rạ thành vật liệu sinh học.
      + Nhóm 3.2: Thiết kế quy trình kỹ thuật sản xuất giấy gieo mầm / màng sinh học bọc thực phẩm.
      + Bộ công cụ Rubric tương tác chuẩn  /  (Tự đánh giá & Đánh giá chéo).
    - **Chặng 4: Chế tạo & Thử nghiệm mẫu**: Nhật ký sản xuất, hình ảnh mẫu thử, ghi nhận sai số kỹ thuật.
    - **Chặng 5: Báo cáo & Chia sẻ (Gian hàng Hội chợ Xanh)**:
      + Triển lãm poster, video demo sản phẩm mẫu.
      + Rubric Đánh giá Gian hàng Xanh (3 tiêu chí: Tính thẩm mỹ - Thông điệp môi trường - Kỹ năng thuyết minh).
    - **Chặng 6: Phản ánh & Lan tỏa giá trị**: Bảng khảo sát cảm xúc, đóng góp cộng đồng, tuyên ngôn lối sống xanh.

### 2.2. Trợ lý Giáo dục & AI Thông minh
- **Trợ lý AI Gemini (`AIAssistant`)**: Hỗ trợ giải đáp thắc mắc khoa học của học sinh theo ngữ cảnh từng bài học.
- **AI Soạn giáo án & Sinh câu hỏi (`GiaoAnAI`, `TaoDeKiemTraApp`)**: Tự động hóa công việc hành chính cho giáo viên.
- **Công cụ trích xuất tài liệu Word (`docxEditor`, `docxExport`)**: Hỗ trợ chỉnh sửa và tải tài liệu chuẩn định dạng.

### 2.3. Hệ thống Trò chơi Học tập Đa người chơi (Multiplayer)
- **StarRace Game & Game Hub**: Thi đấu hỏi đáp thời gian thực giữa các học sinh/đội nhóm trong lớp thông qua kết nối phòng đấu Firebase Realtime/Firestore.
- **Đua vịt gọi tên (`DuaVitGoiTenGame`) & Khám phá thế giới**: Tăng tính hấp dẫn cho các hoạt động khởi động đầu giờ học.

### 2.4. Hệ thống Đánh giá & Báo cáo Tự động cho Giáo viên
- **Dashboard Giáo viên**: Giám sát kết quả làm bài trắc nghiệm Chặng 2, kết quả đánh giá Rubric Chặng 3 và Chặng 5.
- **Lưu trữ đa tầng**:
  - Bộ nhớ cục bộ (`localStorage` có cơ chế phiên bản `LOCAL_PROGRESS_CACHE_KEY`).
  - Đám mây Firebase Firestore (`khtn9_bai30_stage2_tests`, `khtn9_bai30_stage3_rubrics`).
  - Google Sheets Webhook (Apps Script) đồng bộ tự động về bảng tính cá nhân của giáo viên để tính điểm học bạ.
  - Xuất báo cáo nhanh định dạng CSV.

---

## 3. DÀNH CHO AI? (TARGET AUDIENCE)

### 3.1. Học sinh THCS (Trọng tâm Lớp 9) & THPT
- **Đặc điểm**: Thế hệ học sinh số (Gen Z/Alpha), thích trải nghiệm trực quan, thao tác chạm/kéo thả, học tập thông qua game hóa (Gamification).
- **Nhu cầu**:
  - Dễ dàng tiếp cận kiến thức trừu tượng (như phản ứng thủy phân enzyme, cấu trúc polymer) mà phòng thí nghiệm trường học khó hoặc nguy hiểm khi thực hiện.
  - Tự học mọi lúc mọi nơi trên điện thoại, máy tính bảng hoặc máy tính để bàn.
  - Nhận phản hồi tức thì về kết quả bài thi và đánh giá công bằng từ bạn bè/thầy cô.

### 3.2. Giáo viên Khoa học Tự nhiên (KHTN)
- **Đại diện tiêu biểu**: Thầy **Trần Văn Lĩnh** (`tranvanl55@gmail.com`) cùng các đồng nghiệp giảng dạy KHTN trên toàn quốc.
- **Nhu cầu**:
  - Trình chiếu và tổ chức hoạt động dạy học mượt mà trên **Smart TV**, **Màn hình tương tác thông minh**, hoặc **Máy chiếu**.
  - Không cần cài đặt phần mềm phức tạp, mở trình duyệt là sử dụng được ngay.
  - Có các nút hỗ trợ giảng dạy từ xa (bàn phím không dây / remote chuột bay).
  - Thu thập điểm số và đánh giá Rubric về một Google Sheet duy nhất mà không tốn công chấm điểm thủ công từng bài.

### 3.3. Tổ chuyên môn & Ban Giám hiệu Nhà trường
- Cung cấp minh chứng sinh động cho các tiết dạy chuyên đề đổi mới phương pháp dạy học, tiết học STEAM đạt chuẩn quốc gia.
- Lưu trữ số liệu học tập phục vụ kiểm định chất lượng giáo dục.

---

## 4. TIÊU CHÍ ĐO LƯỜNG THÀNH CÔNG (SUCCESS METRICS)
1. **Trải nghiệm mượt mà**: 100% video và hoạt ảnh có bảo hiểm chuyển cảnh; hoạt động ổn định trên mạng wifi học đường chập chờn.
2. **Độ chính xác sư phạm**: 100% Rubric chuẩn hóa theo khung đánh giá phát triển năng lực của Bộ GD&ĐT / .
3. **Độ tin cậy dữ liệu**: Dữ liệu kiểm tra và đánh giá không bị mất mát khi học sinh lỡ tay tải lại trang nhờ cơ chế Auto-save LocalStorage kết hợp đồng bộ Cloud.
