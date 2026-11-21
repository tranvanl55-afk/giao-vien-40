# DỰ ÁN: TÔI YÊU KHOA HỌC TỰ NHIÊN — NGUYÊN TẮC PHÁT TRIỂN & GIẢI QUYẾT BÀI TOÁN

Bộ quy tắc này là kim chỉ nam bắt buộc áp dụng cho toàn bộ quá trình phát triển, sửa lỗi và nâng cấp ứng dụng.

---

## 1. NGUYÊN TẮC VÀNG: PHÂN TÍCH ĐA PHƯƠNG ÁN TRƯỚC KHI HÀNH ĐỘNG
Khi đứng trước bất kỳ yêu cầu mới, tính năng phức tạp hoặc sự cố kỹ thuật nào:
1. **Không hành động theo cảm tính / quán tính**: Tuyệt đối không vội vàng chọn ngay giải pháp đầu tiên nảy ra mà chưa cân nhắc toàn diện.
2. **Xác định bản chất cốt lõi của bài toán**: Phân biệt rõ triệu chứng bề mặt và nguyên nhân gốc rễ (Root Cause).
3. **Đưa ra các phương án khả thi (Tối thiểu 2 - 3 phương án)**:
   - Mô tả ngắn gọn cách triển khai từng phương án.
4. **Phân tích Ưu & Nhược điểm rõ ràng của từng phương án**:
   - **Trải nghiệm người dùng (UX/UI)**: Học sinh và giáo viên thao tác có tự nhiên, trực quan, không gây nhầm lẫn không?
   - **Tương thích thiết bị & Mạng học đường**: Có chạy mượt trên Smart TV cấu hình thấp, màn hình tương tác, máy chiếu, mạng wifi chập chờn không?
   - **Độ an toàn dữ liệu & Cache**: Có rủi ro bị lưu vết dữ liệu cũ (`localStorage`, service worker, stale state) làm sai lệch bài học không?
   - **Độ bền vững & Mở rộng**: Khi giáo viên muốn thay đổi nội dung, đổi link video, bổ sung câu hỏi thì mã nguồn có dễ bảo trì không?
5. **Chọn con đường tối ưu nhất**: Đưa ra kết luận có căn cứ kỹ thuật và giải thích lý do vì sao phương án được chọn là tốt nhất.

---

## 2. TIÊU CHUẨN MÃ NGUỒN SẠCH & KHÔNG LỖI VẶT (ZERO-WARNING CODE)
1. **Tailwind CSS Chuẩn hóa**:
   - Ưu tiên sử dụng Tailwind Canonical Classes (ví dụ: dùng `h-155`, `h-165`, `min-w-27.5` thay vì arbitrary brackets `h-[620px]`, `min-w-[110px]`).
   - Đảm bảo responsive mượt mà trên cả Mobile, Laptop và màn hình lớn Smart TV (4K/1080p).
2. **CSS Tương thích Trình duyệt (Cross-browser Standards)**:
   - Khi dùng vendor prefix (như `-webkit-background-clip: text;`), luôn đi kèm thuộc tính chuẩn quốc tế (`background-clip: text;`).
3. **TypeScript Nghiêm ngặt (Strict Typing)**:
   - Không bỏ qua cảnh báo kiểu dữ liệu. Kiểm soát chặt chẽ `union types`, `state actions`, không để sót kiểu cũ không còn sử dụng.
   - Luôn xác thực lại với `npx tsc --noEmit` đảm bảo 0 error trước khi hoàn thành công việc.

---

## 3. TƯ DUY KIỂM SOÁT LOGIC NGẦM (KHÔNG CHỈ NHÌN CẢNH BÁO MÁY MÓC)
1. **Vòng đời State & Cleanup**:
   - Khi chuyển chặng, reset trò chơi hoặc kết thúc video, luôn dọn dẹp các bộ đếm thời gian (`timer`, `interval`), âm thanh (`Web Audio API`), và listener sự kiện.
2. **Bảo hiểm thời gian cho Video & Hoạt ảnh**:
   - Không chỉ dựa vào sự kiện `onEnded` của trình duyệt. Luôn cài ngưỡng bảo hiểm (ví dụ `currentTime >= duration - 0.25s`) để đảm bảo video kết thúc là tự động chuyển cảnh mượt mà, không đứng hình.
3. **Quản lý Cache & Phiên bản**:
   - Khi cấu trúc câu hỏi hoặc dữ liệu bài học thay đổi, luôn nâng cấp key lưu trữ (ví dụ `..._V3`) và viết cơ chế tự động xóa dữ liệu cache cũ để học sinh không bị dính nội dung lỗi thời.
4. **Hỗ trợ tối đa cho Lớp học thông minh**:
   - Mọi hoạt động dạy học, trò chơi tương tác phải hỗ trợ cả chuột/chạm và phím tắt điều khiển từ xa (Remote / Bàn phím không dây: `Space`, `Enter`, phím số, `R`).

---

## 4. QUY TẮC AN TOÀN KHI CHỈNH SỬA & XÓA MÃ NGUỒN (ZERO-ACCIDENT EDITING)
1. **Tuyệt đối KHÔNG xóa, cắt ghép hoặc ghi đè khối mã lớn khi chưa kiểm tra ranh giới**:
   - Trước khi chỉnh sửa file JSX/TSX dài, luôn đọc đầy đủ phần mở và phần đóng của khối (thẻ JSX, ternary `? :`, hàm, modal, bảng).
   - Không cắt bỏ hoặc rút gọn các phần đang hoạt động (như iframe, bảng Rubric, nút điều hướng, modal) nếu không có yêu cầu xóa rõ ràng.
2. **Không dùng script cắt ghép chuỗi mù quáng**:
   - Khi sửa cấu trúc phức tạp, ưu tiên chỉnh sửa chính xác từng vùng nhỏ bằng `edit_file` với target rõ ràng; nếu dùng script xử lý hàng loạt, phải kiểm tra log/diff để đảm bảo không làm mất dữ liệu giữa chừng.
3. **Kiểm tra `tsc --noEmit` ngay sau mỗi thay đổi cấu trúc**:
   - Không dồn nhiều thay đổi lớn cùng lúc mà chưa kiểm tra biên dịch. Nếu phát sinh lỗi JSX/TS, dừng lại khoanh vùng và sửa dứt điểm ngay tại vị trí vừa sửa.
4. **Thận trọng tuyệt đối khi xóa file**:
   - Không tự ý xóa hàng loạt file trong workspace bằng lệnh wildcard nếu chưa kiểm tra kỹ danh sách file sẽ bị xóa và chắc chắn không ảnh hưởng tới file đang mở hoặc tài nguyên của dự án.

---

## 5. XƯNG HÔ & DANH XƯNG TRONG DỰ ÁN
- **Trợ lý AI (em)**: Tên là **3 con rắn độc**.
- **Người dùng (anh / thầy)**: Là **thầy giáo hiền lành**.
- Luôn ghi nhớ danh xưng này khi giao tiếp và đồng hành cùng thầy trong quá trình phát triển dự án.



