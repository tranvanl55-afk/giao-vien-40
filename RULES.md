# QUY TẮC PHÁT TRIỂN & ĐIỀU CẤM KỴ KHI LẬP TRÌNH (RULES & CONSTRAINTS)
## DỰ ÁN: TÔI YÊU KHOA HỌC TỰ NHIÊN (KHTN 4.0)

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
   - Ưu tiên sử dụng Tailwind Canonical Classes (ví dụ: dùng `h-115`, `h-155`, `h-165`, `min-w-27.5` thay vì arbitrary brackets `h-[460px]`, `h-[620px]`, `min-w-[110px]`).
   - Đảm bảo responsive mượt mà trên cả Mobile, Laptop và màn hình lớn Smart TV (4K/1080p).
2. **CSS Tương thích Trình duyệt (Cross-browser Standards)**:
   - Khi dùng vendor prefix (như `-webkit-background-clip: text;`), luôn đi kèm thuộc tính chuẩn quốc tế (`background-clip: text;`).
3. **TypeScript Nghiêm ngặt (Strict Typing)**:
   - Không bỏ qua cảnh báo kiểu dữ liệu. Kiểm soát chặt chẽ `union types`, `state actions`, không để sót kiểu cũ không còn sử dụng.
   - Luôn xác thực lại với `npx tsc --noEmit` đảm bảo 0 error trước khi hoàn thành công việc.

---

## 3. TƯ DUY KIỂM SOÁT LOGIC NGẦM
1. **Vòng đời State & Cleanup**:
   - Khi chuyển chặng, reset trò chơi hoặc kết thúc video, luôn dọn dẹp các bộ đếm thời gian (`timer`, `interval`), âm thanh (`Web Audio API`), và listener sự kiện.
2. **Bảo hiểm thời gian cho Video & Hoạt ảnh**:
   - Không chỉ dựa vào sự kiện `onEnded` của trình duyệt. Luôn cài ngưỡng bảo hiểm (ví dụ `currentTime >= duration - 0.25s`) và nút xác nhận thủ công để học sinh không bị kẹt khi mạng tải video chậm.
3. **Quản lý Cache & Phiên bản**:
   - Khi cấu trúc câu hỏi hoặc dữ liệu bài học thay đổi, luôn nâng cấp key lưu trữ (ví dụ `LOCAL_PROGRESS_CACHE_KEY = '..._v3'`) và viết cơ chế tự động xóa dữ liệu cache cũ để học sinh không bị dính nội dung lỗi thời.
4. **Hỗ trợ tối đa cho Lớp học thông minh**:
   - Mọi hoạt động dạy học, trò chơi tương tác phải hỗ trợ cả chuột/chạm và phím tắt điều khiển từ xa (Remote / Bàn phím không dây: `Space`, `Enter`, phím số, `R`).

---

## 4. NHỮNG ĐIỀU AI TUYỆT ĐỐI KHÔNG ĐƯỢC LÀM (STRICT PROHIBITIONS)

1. **Tuyệt đối KHÔNG tự ý xóa code hoặc rút gọn tính năng cốt lõi**:
   - Không được cắt bớt các chặng học, câu hỏi, logic bài tập, hoặc bảng Rubric để "làm cho code ngắn hơn" trừ khi có yêu cầu xóa rõ ràng từ người dùng.
2. **Tuyệt đối KHÔNG sử dụng `any` bừa bãi để vượt qua trình biên dịch TypeScript**:
   - Phải định nghĩa interface, type hoặc generic rõ ràng cho từng tham số, state và API payload.
3. **Tuyệt đối KHÔNG hardcode API Key hoặc thông tin bảo mật nhạy cảm**:
   - Không ghi trực tiếp Secret Key, private credentials vào mã nguồn git. Mọi key riêng phải thông qua biến môi trường `.env` hoặc để người dùng tự nhập qua Modal bảo mật.
4. **Tuyệt đối KHÔNG phụ thuộc đơn phương vào kết nối mạng trực tuyến**:
   - Luôn có cơ chế Fallback ngoại tuyến (Offline local storage, dữ liệu mẫu cục bộ) để tiết dạy của giáo viên không bị hủy hoại nếu mạng trường học đột ngột mất kết nối.
5. **Tuyệt đối KHÔNG tạo vòng lặp vô tận (Infinite Loops)**:
   - Cẩn trọng tối đa với mảng dependencies trong `useEffect`, `useCallback`, `useMemo`. Tránh việc kích hoạt re-render liên tục làm nóng máy và đơ trình duyệt của Smart TV.
6. **Tuyệt đối KHÔNG tự tiện sửa đổi các thư mục ngoài phạm vi dự án**:
   - Giữ phạm vi chỉnh sửa nằm trong `c:\Website\tôi-yêu-khoa-học-tự-nhiên\`. Không tạo file rác ngoài Desktop hoặc thư mục hệ thống.
7. **Tuyệt đối KHÔNG xóa/cắt ghép mù quáng khối mã lớn hoặc xóa nhầm file**:
   - Luôn đọc kỹ ranh giới thẻ đóng/mở (`<div>`, `<button>`, `<table>`, `{... ? (...) : (...)}`) trước khi thay thế; sửa từng vùng nhỏ và chạy `npx tsc --noEmit` kiểm tra ngay để không làm đứt gãy cấu trúc hay mất tính năng.
   - Không chạy lệnh xóa hàng loạt file theo wildcard khi chưa rà soát kỹ danh sách file bị ảnh hưởng.
