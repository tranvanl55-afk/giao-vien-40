# TÀI LIỆU THIẾT KẾ GIAO DIỆN & TRẢI NGHIỆM (DESIGN SYSTEM & UI/UX)
## DỰ ÁN: TÔI YÊU KHOA HỌC TỰ NHIÊN (KHTN 4.0)

---

## 1. PHONG CÁCH CHỦ ĐẠO (DESIGN PHILOSOPHY)

- **Phong cách**: Hiện đại, Khoa học công nghệ cao (Scientific & Tech-Forward), pha trộn **Glassmorphism** (hiệu ứng kính mờ `backdrop-blur-md` kết hợp viền bán trong suốt `border-white/10`).
- **Không gian thị giác**: Rõ ràng, trực quan, độ tương phản cao nhằm hiển thị sắc nét trên cả **Màn hình máy chiếu**, **Màn hình tương tác thông minh**, và **Smart TV lớp học 4K/1080p**.
- **Chế độ hiển thị kép (Dual Mode)**:
  - **Dark Mode (Mặc định cho Mô phỏng & Phòng thí nghiệm ảo)**: Giảm mỏi mắt khi học sinh quan sát chuyển động hạt vi mô, tăng độ rực rỡ của các hiệu ứng phản ứng hóa học phát sáng.
  - **Light Mode**: Phù hợp cho việc đọc tài liệu văn bản, làm bài tập dài và in ấn báo cáo.

---

## 2. BẢNG MÀU CHUẨN HÓA (COLOR PALETTE)

| Nhóm màu | Mã Hex / Tailwind Class | Ý nghĩa sư phạm & Chức năng |
| :--- | :--- | :--- |
| **Primary Cyan** | `#06b6d4` (`cyan-500`), `#0891b2` (`cyan-600`) | Màu sắc chủ đạo đại diện cho Khoa học, Hóa học dung dịch, Nước và Công nghệ cao |
| **Emerald Green** | `#10b981` (`emerald-500`), `#059669` (`emerald-600`) | Đại diện cho Sinh học, Dự án STEAM Xanh, Tái chế rác thải, Nông nghiệp bền vững |
| **Violet / Indigo** | `#8b5cf6` (`purple-500`), `#6366f1` (`indigo-500`) | Biểu tượng cho Trí tuệ nhân tạo (AI Gemini), Cơ học lượng tử, Thiên văn học |
| **Amber / Orange** | `#f59e0b` (`amber-500`), `#ea580c` (`orange-600`) | Thể hiện mức nhiệt độ phản ứng, cảnh báo an toàn hóa chất, điểm thưởng |
| **Rose / Crimson** | `#f43f5e` (`rose-500`), `#dc2626` (`red-600`) | Trạng thái lỗi, câu trả lời chưa chính xác, điểm cần lưu ý nguy hiểm |
| **Dark Background**| `#020617` (`slate-950`), `#0f172a` (`slate-900`) | Nền tảng không gian sâu, chống lóa cho mắt học sinh |
| **Light Background**| `#f8fafc` (`slate-50`), `#f1f5f9` (`slate-100`) | Nền giao diện sáng thân thiện, thanh lịch |

---

## 3. TYPOGRAPHY & CÔNG THỨC TOÁN - HÓA

- **Font chữ chính**: `font-sans` sử dụng họ font không chân hiện đại (System UI, Inter, Roboto, Segoe UI) với khả năng hiển thị tiếng Việt dấu thanh chuẩn mực, không lỗi font.
- **Quy chuẩn kích cỡ chữ (Type Scale)**:
  - **Tiêu đề Chặng / Tiêu đề lớn (H1)**: `text-2xl sm:text-3xl font-extrabold tracking-tight`
  - **Tiêu đề mục con (H2, H3)**: `text-lg sm:text-xl font-bold`
  - **Nội dung bài học (Body)**: `text-sm sm:text-base leading-relaxed`
  - **Ghi chú & Nhãn thông số (Caption/Badge)**: `text-xs font-semibold uppercase tracking-wider`
- **Biểu diễn Công thức Hóa học & Toán học**:
  - Tích hợp thư viện **KaTeX** chuẩn quốc tế:
    - Glucose: $\text{C}_6\text{H}_{12}\text{O}_6$
    - Tinh bột / Cellulose: $(\text{C}_6\text{H}_{10}\text{O}_5)_n$
    - Phản ứng thủy phân: $(\text{C}_6\text{H}_{10}\text{O}_5)_n + n\text{H}_2\text{O} \xrightarrow[\text{Enzyme}]{\text{Acid / } t^\circ} n\text{C}_6\text{H}_{12}\text{O}_6$

---

## 4. CÁC THÀNH PHẦN GIAO DIỆN CHUẨN (UI COMPONENTS)

### 4.1. Khung Thẻ Kính Mờ (Glassmorphism Cards)
```html
<!-- Cấu trúc thẻ tiêu chuẩn -->
<div class="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-2xl p-6 shadow-xl shadow-cyan-950/20">
  <!-- Nội dung -->
</div>
```

### 4.2. Bộ Nút Thao Tác (Action Buttons)
- **Primary Button (Kêu gọi hành động chính)**:
  - Lớp: `bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-cyan-500/25 active:scale-95 transition-all`
- **Secondary / Ghost Button (Nút bổ trợ)**:
  - Lớp: `bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold py-2.5 px-4 rounded-xl transition-all`
- **Video Fallback Button (Nút bảo hiểm khi mạng yếu)**:
  - Lớp: `bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-medium py-2 px-4 rounded-lg`

### 4.3. Bảng Đánh Giá Rubric Tương Tác (`RubricInteractivePanel`)
- Chia thành từng tiêu chí rõ ràng kèm danh mục đánh giá (Ý tưởng công nghệ, Tính khả thi sinh học, Kỹ năng thuyết minh, v.v.).
- 5 cấp độ đánh giá từ 1 đến 5 điểm tương ứng màu sắc trực quan (Đỏ $\rightarrow$ Cam $\rightarrow$ Vàng $\rightarrow$ Xanh dương $\rightarrow$ Xanh lá).
- Tích hợp thanh điểm tiến độ theo phần trăm và ô nhận xét góp ý xây dựng.

### 4.4. Khung Nhúng Mô Phỏng Iframe Chuẩn Hóa
- Tối ưu chiều cao hiển thị `h-115` (`460px`) kết hợp bo tròn `rounded-2xl` và viền kim loại công nghệ.
- Tránh việc bị khuất nút điều khiển hay tràn màn hình trên các thiết bị màn hình nhỏ.

---

## 5. THIẾT KẾ ĐÁP ỨNG & TƯƠNG THÍCH MÀN HÌNH LỚP HỌC (RESPONSIVE & SMART TV)

### 5.1. Tương thích Smart TV & Màn hình Tương tác (4K / 1080p)
- Khoảng cách bấm (Touch target) của nút bấm tối thiểu **$44 \times 44\text{px}$** để học sinh và giáo viên dễ dàng bấm bằng ngón tay hoặc bút cảm ứng.
- Phím tắt bàn phím không dây phục vụ điều khiển từ xa:
  - `Space`: Tạm dừng / Phát video hoặc hoạt ảnh.
  - `Enter`: Xác nhận nộp bài hoặc chuyển bước kế tiếp.
  - `R`: Làm lại thí nghiệm hoặc reset trạng thái.

### 5.2. Tương thích Tablet & Mobile
- Bố cục lưới linh hoạt `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.
- Tự động thu gọn thanh điều hướng bên trái thành thanh trượt di động hoặc thanh điều hướng đáy (Bottom Bar) khi màn hình dưới $768\text{px}$.
