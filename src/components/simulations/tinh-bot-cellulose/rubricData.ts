/* cSpell:disable */
export interface RubricLevelOption {
  level: 1 | 2 | 3 | 4 | 5;
  label: string;
  percentage: number;
  points: number;
  bullets: string[];
}

export interface Stage3RubricCriterion {
  id: string;
  category:
  | 'Ý tưởng (3.1)'
  | 'Quy trình (3.2)'
  | 'Trình bày & Phản biện'
  | 'Sản phẩm & Quy trình'
  | 'Poster Khoa học'
  | 'Thuyết trình & Phản biện';
  title: string;
  weightPercent: number;
  maxPoints: number;
  levels: RubricLevelOption[];
}

// Bảng tiêu chí đánh giá Chặng 3 (Ý tưởng & Quy trình thực hiện) — Analytical Rubric 5 Tiêu chí × 5 Mức độ
export const STAGE3_RUBRIC_CRITERIA: Stage3RubricCriterion[] = [
  {
    id: 's3-scientific-basis',
    category: 'Ý tưởng (3.1)',
    title: '1. CƠ SỞ KHOA HỌC & MỤC TIÊU Ý TƯỞNG',
    weightPercent: 25,
    maxPoints: 2.5,
    levels: [
      {
        level: 1,
        label: 'Cần cố gắng',
        percentage: 20,
        points: 0.5,
        bullets: [
          'Chưa xác định được đối tượng tái chế thuộc Tinh bột hay Cellulose.',
          'Mục tiêu sản phẩm mơ hồ, chưa gắn với bài toán phế phẩm thực tế.',
          'Giải thích cơ sở hóa học sai lệch từ 2 nội dung trọng tâm trở lên.',
        ],
      },
      {
        level: 2,
        label: 'Đạt',
        percentage: 40,
        points: 1.0,
        bullets: [
          'Nêu được tên nguyên liệu chính (Cellulose hoặc Tinh bột) nhưng chưa giải thích cấu tạo.',
          'Xác định được công năng cơ bản của sản phẩm dự kiến.',
          'Còn nhầm lẫn 1 ý nhỏ về tính tan hoặc độ dai sợi tự nhiên.',
        ],
      },
      {
        level: 3,
        label: 'Khá',
        percentage: 60,
        points: 1.5,
        bullets: [
          'Xác định đúng bản chất polymer tự nhiên (C₆H₁₀O₅)ₙ của nguyên liệu chọn.',
          'Giải thích được vai trò liên kết sợi Cellulose hoặc hồ hóa Tinh bột trong sản phẩm.',
          'Mục tiêu sản phẩm rõ ràng, phù hợp điều kiện làm tại lớp/nhà.',
        ],
      },
      {
        level: 4,
        label: 'Tốt',
        percentage: 80,
        points: 2.0,
        bullets: [
          'Phân tích chính xác sự phối hợp tính chất: sợi Cellulose chịu kéo + keo Tinh bột kết dính.',
          'Nêu rõ nguồn gốc phế phẩm nông nghiệp/học đường cần xử lý tại địa phương.',
          'Đề xuất tiêu chí đánh giá độ bền hoặc khả năng phân hủy sinh học cho sản phẩm.',
        ],
      },
      {
        level: 5,
        label: 'Xuất sắc',
        percentage: 100,
        points: 2.5,
        bullets: [
          'Lập luận khoa học chặt chẽ từ cấu trúc phân tử đến tính chất cơ – lí của vật liệu sinh học.',
          'Mục tiêu ý tưởng định lượng rõ ràng, giải quyết vấn đề môi trường cấp thiết của cộng đồng.',
          'Dự đoán được biến đổi vật lí/hóa học trong từng khâu chế tạo và cách khắc phục.',
        ],
      },
    ],
  },
  {
    id: 's3-creativity',
    category: 'Ý tưởng (3.1)',
    title: '2. TÍNH SÁNG TẠO & GIÁ TRỊ XANH',
    weightPercent: 20,
    maxPoints: 2.0,
    levels: [
      {
        level: 1,
        label: 'Cần cố gắng',
        percentage: 20,
        points: 0.4,
        bullets: [
          'Ý tưởng sao chép nguyên mẫu có sẵn, không có điều chỉnh cải tiến.',
          'Chưa thể hiện thông điệp giảm rác thải nhựa hoặc tái sinh xanh.',
          'Sản phẩm dự kiến thiếu tính ứng dụng trong đời sống học sinh.',
        ],
      },
      {
        level: 2,
        label: 'Đạt',
        percentage: 40,
        points: 0.8,
        bullets: [
          'Có thay đổi nhỏ về hình dáng hoặc vật liệu so với gợi ý mẫu.',
          'Thể hiện được mục đích tận dụng lại giấy vụn hoặc phế phẩm thực vật.',
          'Ứng dụng ở mức trưng bày đơn giản, chưa tối ưu công năng sử dụng.',
        ],
      },
      {
        level: 3,
        label: 'Khá',
        percentage: 60,
        points: 1.2,
        bullets: [
          'Ý tưởng có điểm mới trong tạo hình hoặc phối hợp 2 nguồn phế phẩm sẵn có.',
          'Sản phẩm có công năng rõ ràng (giấy nảy mầm, chậu ươm, hộp quà, bao bì...).',
          'Có thông điệp bảo vệ môi trường gắn với sản phẩm.',
        ],
      },
      {
        level: 4,
        label: 'Tốt',
        percentage: 80,
        points: 1.6,
        bullets: [
          'Sáng tạo trong tích hợp công năng kép (ví dụ giấy gói chứa hạt mầm tự phân hủy).',
          'Tối ưu hóa giá thành gần như 0 đồng nhờ tận dụng tối đa phế liệu trường/gia đình.',
          'Ý tưởng mang tính thẩm mỹ và lan tỏa lối sống xanh thuyết phục.',
        ],
      },
      {
        level: 5,
        label: 'Xuất sắc',
        percentage: 100,
        points: 2.0,
        bullets: [
          'Ý tưởng đột phá, kết hợp nhuần nhuyễn đa loại sợi tự nhiên/tinh bột với phụ gia sinh học an toàn.',
          'Giải pháp thay thế trực tiếp sản phẩm nhựa dùng một lần với giá trị thẩm mỹ và thương mại cao.',
          'Thiết kế thông điệp xanh truyền cảm hứng, có khả năng nhân rộng quy mô toàn trường.',
        ],
      },
    ],
  },
  {
    id: 's3-process-quant',
    category: 'Quy trình (3.2)',
    title: '3. TÍNH LOGIC & ĐỊNH LƯỢNG QUY TRÌNH 4 BƯỚC',
    weightPercent: 25,
    maxPoints: 2.5,
    levels: [
      {
        level: 1,
        label: 'Cần cố gắng',
        percentage: 20,
        points: 0.5,
        bullets: [
          'Trình tự các bước lộn xộn hoặc thiếu từ 2 bước trở lên trong quy trình 4 bước.',
          'Không ghi khối lượng/tỉ lệ nguyên liệu, nước, thời gian thực hiện.',
          'Không phân công người phụ trách hoặc thiếu kế hoạch chuẩn bị dụng cụ.',
        ],
      },
      {
        level: 2,
        label: 'Đạt',
        percentage: 40,
        points: 1.0,
        bullets: [
          'Liệt kê đủ 4 bước cơ bản (Chuẩn bị → Xử lý → Tạo hình → Hoàn thiện).',
          'Ghi định lượng chung chung (ví dụ "một ít nước", "một nắm giấy"), thiếu đơn vị chuẩn.',
          'Có nêu dụng cụ chính nhưng chưa dự trù thời gian cho công đoạn sấy/phơi.',
        ],
      },
      {
        level: 3,
        label: 'Khá',
        percentage: 60,
        points: 1.5,
        bullets: [
          'Quy trình 4 bước tuần tự hợp lý, chuyển tiếp mạch lạc giữa các công đoạn.',
          'Có định lượng cụ thể bằng đơn vị chuẩn (g, ml, phút, °C) cho ≥ 70% nguyên liệu.',
          'Phân công rõ nhiệm vụ cho từng thành viên trong nhóm ở Chặng 4.',
        ],
      },
      {
        level: 4,
        label: 'Tốt',
        percentage: 80,
        points: 2.0,
        bullets: [
          'Quy trình chi tiết 100% các bước kèm tỉ lệ định lượng tối ưu (gam sợi / gam tinh bột / ml nước).',
          'Xác định rõ thông số kỹ thuật then chốt (nhiệt độ hồ hóa, lực ép, thời gian phơi nắng).',
          'Có phương án xử lý sự cố thường gặp (như rách màng, mốc, quá đặc/lỏng).',
        ],
      },
      {
        level: 5,
        label: 'Xuất sắc',
        percentage: 100,
        points: 2.5,
        bullets: [
          'Quy trình chuẩn hóa như bản hướng dẫn kỹ thuật, nhóm khác đọc vào có thể làm theo chính xác.',
          'Định lượng khoa học kèm bảng so sánh hoặc thử nghiệm đối chứng ít nhất 2 công thức phối trộn.',
          'Hoạch định tiến độ chi tiết theo từng mốc thời gian và tiêu chí kiểm tra chất lượng đầu ra.',
        ],
      },
    ],
  },
  {
    id: 's3-safety-env',
    category: 'Quy trình (3.2)',
    title: '4. AN TOÀN THÍ NGHIỆM & BẢO VỆ MÔI TRƯỜNG',
    weightPercent: 15,
    maxPoints: 1.5,
    levels: [
      {
        level: 1,
        label: 'Cần cố gắng',
        percentage: 20,
        points: 0.3,
        bullets: [
          'Đề xuất sử dụng hóa chất tẩy rửa mạnh/độc hại (xút đặc, Javen đặc) không có biện pháp bảo hộ.',
          'Không có quy định an toàn khi dùng thiết bị điện, nhiệt hoặc dao kéo.',
          'Chưa nêu cách xử lý nước thải và bã thừa sau khi chế tạo.',
        ],
      },
      {
        level: 2,
        label: 'Đạt',
        percentage: 40,
        points: 0.6,
        bullets: [
          'Sử dụng nguyên liệu tương đối an toàn nhưng còn 1 bước có nguy cơ bỏng/đứt tay chưa cảnh báo.',
          'Có nhắc nhở đeo găng tay/giữ vệ sinh chung một cách khái quát.',
          'Có ý thức thu gom rác sau thực hành nhưng chưa phân loại bã hữu cơ.',
        ],
      },
      {
        level: 3,
        label: 'Khá',
        percentage: 60,
        points: 0.9,
        bullets: [
          'Không sử dụng hóa chất độc hại; ưu tiên nước ấm, giấm ăn hoặc phụ gia thực phẩm.',
          'Nêu rõ quy tắc an toàn khi dùng máy xay, bếp đun hồ tinh bột và dụng cụ cắt.',
          'Có phương án lọc nước thừa, không đổ bã xơ xuống bồn rửa gây tắc nghẽn.',
        ],
      },
      {
        level: 4,
        label: 'Tốt',
        percentage: 80,
        points: 1.2,
        bullets: [
          '100% nguyên liệu thân thiện môi trường, an toàn tuyệt đối cho học sinh THCS.',
          'Chi tiết hóa đồ bảo hộ (găng tay, tạp dề, kính/kẹp cách nhiệt) cho từng công đoạn có rủi ro.',
          'Tái sử dụng phần nước ngâm/xơ thừa để tưới cây hoặc làm phân ủ xanh tại trường.',
        ],
      },
      {
        level: 5,
        label: 'Xuất sắc',
        percentage: 100,
        points: 1.5,
        bullets: [
          'Đảm bảo nguyên tắc Hóa học Xanh trọn vòng đời: nguyên liệu tái chế – chế tác không phát thải – sản phẩm tự phân hủy.',
          'Xây dựng checklist an toàn 3 khâu (Trước – Trong – Sau chế tạo) cụ thể và khả thi.',
          'Giải pháp tuần hoàn khép kín toàn bộ phụ phẩm thừa thành tài nguyên hữu ích.',
        ],
      },
    ],
  },
  {
    id: 's3-presentation-qa',
    category: 'Trình bày & Phản biện',
    title: '5. TRÌNH BÀY BẢN THIẾT KẾ & PHẢN BIỆN GÓP Ý',
    weightPercent: 15,
    maxPoints: 1.5,
    levels: [
      {
        level: 1,
        label: 'Cần cố gắng',
        percentage: 20,
        points: 0.3,
        bullets: [
          'Bản mô tả ý tưởng và quy trình sơ sài, rời rạc, khó theo dõi.',
          'Thái độ thiếu hợp tác khi nhận xét chéo hoặc bỏ qua góp ý của nhóm bạn.',
          'Không giải thích được lý do chọn tỉ lệ nguyên liệu trong quy trình.',
        ],
      },
      {
        level: 2,
        label: 'Đạt',
        percentage: 40,
        points: 0.6,
        bullets: [
          'Trình bày đủ nội dung 3.1 và 3.2 nhưng diễn đạt còn lan man.',
          'Tiếp thu góp ý của bạn nhưng chưa cụ thể hóa thành chỉnh sửa trong quy trình.',
          'Trả lời được câu hỏi đơn giản về tên vật liệu sử dụng.',
        ],
      },
      {
        level: 3,
        label: 'Khá',
        percentage: 60,
        points: 0.9,
        bullets: [
          'Bản thiết kế trình bày sạch sẽ, phân chia mục 3.1 (Ý tưởng) và 3.2 (Quy trình) rõ ràng.',
          'Lắng nghe tích cực và ghi nhận ít nhất 1 góp ý hữu ích từ nhóm đánh giá.',
          'Giải trình rõ công dụng của từng bước chính trong quy trình.',
        ],
      },
      {
        level: 4,
        label: 'Tốt',
        percentage: 80,
        points: 1.2,
        bullets: [
          'Trình bày mạch lạc, kết hợp sơ đồ khối/hình phác thảo trực quan sản phẩm dự kiến.',
          'Phản biện lịch sự, bảo vệ được phương án bằng lập luận KHTN 9 và sẵn sàng hiệu chỉnh.',
          'Đặt được câu hỏi góp ý mang tính xây dựng cho quy trình của nhóm bạn.',
        ],
      },
      {
        level: 5,
        label: 'Xuất sắc',
        percentage: 100,
        points: 1.5,
        bullets: [
          'Bản thiết kế chuyên nghiệp, truyền cảm hứng và thuyết phục cao trước lớp/GV.',
          'Tư duy phản biện sắc bén, tiếp thu đa chiều để nâng cấp quy trình tối ưu ngay tại lớp.',
          'Đóng góp nhận xét giá trị giúp nhóm bạn phát hiện điểm nghẽn kỹ thuật trước khi thực hành.',
        ],
      },
    ],
  },
];

// Bảng tiêu chí đánh giá Chặng 5 (Ngày hội xanh: Báo cáo sản phẩm) — Analytical Rubric 3 Tiêu chí × 5 Mức độ
export const STAGE5_RUBRIC_CRITERIA: Stage3RubricCriterion[] = [
  {
    id: 'rubric-product',
    category: 'Sản phẩm & Quy trình',
    title: '1. SẢN PHẨM TÁI SINH (Hoàn thiện & Công năng)',
    weightPercent: 40,
    maxPoints: 4.0,
    levels: [
      {
        level: 1,
        label: 'Cần cố gắng',
        percentage: 20,
        points: 0.8,
        bullets: [
          'Sản phẩm bị hỏng, mốc hoặc không hình thành được hình dáng.',
          'Không có hạt mầm (hoặc chưa có giải pháp công năng rõ ràng).',
          'Bề mặt thô ráp, rách nát, chưa thể hiện đặc tính vật liệu sinh học.',
        ],
      },
      {
        level: 2,
        label: 'Đạt',
        percentage: 40,
        points: 1.6,
        bullets: [
          'Sản phẩm còn yếu, dễ rách khi cầm.',
          'Hạt mầm có nhưng bố trí chưa hợp lý, tập trung lệch.',
          'Bề mặt còn lợn cợn (> 30% xơ thô), chỉ dùng 1 loại sợi đơn giản.',
        ],
      },
      {
        level: 3,
        label: 'Khá',
        percentage: 60,
        points: 2.4,
        bullets: [
          'Sản phẩm thành hình vững, thể hiện được độ dai của Cellulose hoặc độ kết dính của Tinh bột.',
          'Hạt mầm phân bố tương đối đều trên ≥ 70% diện tích, không bị dập nát.',
          'Bề mặt tương đối phẳng nhưng chưa mịn đồng đều.',
        ],
      },
      {
        level: 4,
        label: 'Tốt',
        percentage: 80,
        points: 3.2,
        bullets: [
          'Sản phẩm bền, đẹp, thể hiện rõ đặc tính vật lí của Cellulose / Tinh bột.',
          'Hạt mầm tích hợp sẵn đồng đều (100% diện tích), đảm bảo khả năng nảy mầm.',
          'Bề mặt mịn đẹp, quy trình hoàn thiện an toàn không hóa chất độc hại.',
        ],
      },
      {
        level: 5,
        label: 'Xuất sắc',
        percentage: 100,
        points: 4.0,
        bullets: [
          'Sản phẩm hoàn hảo, độ bền và khả năng chịu ẩm tốt, thẩm mỹ cao.',
          'Tích hợp hạt mầm khoa học kèm hướng dẫn gieo trồng / phân hủy sinh học.',
          'Có sự sáng tạo đột phá trong việc kết hợp ≥ 2 loại sợi tự nhiên / tinh bột.',
        ],
      },
    ],
  },
  {
    id: 'rubric-poster',
    category: 'Poster Khoa học',
    title: '2. POSTER KHOA HỌC (Nội dung Bài 30 & Quy trình)',
    weightPercent: 30,
    maxPoints: 3.0,
    levels: [
      {
        level: 1,
        label: 'Cần cố gắng',
        percentage: 20,
        points: 0.6,
        bullets: [
          'Thông tin sai lệch về Bài 30 (Tinh bột & Cellulose) từ 2 kiến thức trở lên.',
          'Thiếu sơ đồ cấu tạo và chưa mô tả rõ quy trình xử lý phế phẩm.',
          'Trình bày cẩu thả, khó đọc, mắc ≥ 5 lỗi chính tả.',
        ],
      },
      {
        level: 2,
        label: 'Đạt',
        percentage: 40,
        points: 1.2,
        bullets: [
          'Đầy đủ thông tin cơ bản về Bài 30, không sai kiến thức trọng tâm.',
          'Bố cục còn rời rạc, quá nhiều chữ (> 60% diện tích).',
          'Có liệt kê quy trình nhưng ít hình ảnh minh họa.',
        ],
      },
      {
        level: 3,
        label: 'Khá',
        percentage: 60,
        points: 1.8,
        bullets: [
          'Trình bày đúng kiến thức Tinh bột / Cellulose và mục tiêu dự án.',
          'Hình ảnh minh họa rõ ràng (≥ 2 ảnh) và có sơ đồ cấu tạo phân tử (C₆H₁₀O₅)ₙ.',
          'Bố cục chia mục cân đối, dễ đọc từ xa.',
        ],
      },
      {
        level: 4,
        label: 'Tốt',
        percentage: 80,
        points: 2.4,
        bullets: [
          'Bố cục khoa học, màu sắc hài hòa, không mắc lỗi chính tả.',
          'Trình bày quy trình xử lý phế phẩm rất trực quan bằng sơ đồ mũi tên và ảnh thực tế.',
          'Gắn chặt cơ sở khoa học Bài 30 với các bước định lượng – tạo khuôn – thử nghiệm.',
        ],
      },
      {
        level: 5,
        label: 'Xuất sắc',
        percentage: 100,
        points: 3.0,
        bullets: [
          'Thiết kế chuyên nghiệp, bố cục cân đối (chữ ≤ 35%), giàu tính thẩm mỹ.',
          'Nội dung kết hợp nhuần nhuyễn giữa KHTN 9 (Bài 30) và thông điệp môi trường.',
          'Hệ thống sơ đồ cấu tạo, bảng số liệu thử nghiệm và quy trình minh họa truyền cảm hứng.',
        ],
      },
    ],
  },
  {
    id: 'rubric-presentation',
    category: 'Thuyết trình & Phản biện',
    title: '3. THUYẾT TRÌNH & PHẢN BIỆN',
    weightPercent: 30,
    maxPoints: 3.0,
    levels: [
      {
        level: 1,
        label: 'Cần cố gắng',
        percentage: 20,
        points: 0.6,
        bullets: [
          'Nói nhỏ, đọc tài liệu hoàn toàn (> 90%).',
          'Thành viên thiếu phối hợp hoặc trình bày lố giờ > 2 phút.',
          'Không trả lời được câu hỏi phản biện từ lớp và giáo viên.',
        ],
      },
      {
        level: 2,
        label: 'Đạt',
        percentage: 40,
        points: 1.2,
        bullets: [
          'Diễn đạt còn ngập ngừng, còn phụ thuộc tài liệu.',
          'Có phân chia thành viên nhưng chuyển tiếp còn gượng.',
          'Chỉ trả lời được các câu hỏi cơ bản về lý thuyết.',
        ],
      },
      {
        level: 3,
        label: 'Khá',
        percentage: 60,
        points: 1.8,
        bullets: [
          'Thuyết trình tự tin, giọng rõ ràng.',
          'Có sự phối hợp nhịp nhàng giữa các thành viên và đảm bảo đúng thời gian.',
          'Phản biện có chiều sâu, giải thích rõ quy trình làm sản phẩm.',
        ],
      },
      {
        level: 4,
        label: 'Tốt',
        percentage: 80,
        points: 2.4,
        bullets: [
          'Diễn đạt lưu loát, lôi cuốn; phối hợp ăn ý với Poster và sản phẩm mẫu.',
          'Sử dụng tiếng Anh chuyên ngành đơn giản (starch, cellulose...) để giới thiệu quy trình.',
          'Phản biện tốt, đưa ra dẫn chứng khoa học bảo vệ quan điểm.',
        ],
      },
      {
        level: 5,
        label: 'Xuất sắc',
        percentage: 100,
        points: 3.0,
        bullets: [
          'Làm chủ sân khấu hoàn toàn; trình bày bằng tiếng Anh/Việt trôi chảy, tự nhiên.',
          'Điều phối nhóm linh hoạt, xử lý tình huống thuyết trình chuyên nghiệp.',
          'Phản biện sắc sảo, thuyết phục bằng số liệu thực nghiệm và đặt câu hỏi giá trị.',
        ],
      },
    ],
  },
];

// Rubric Chặng 5 dành riêng cho GIÁO VIÊN chấm Sản phẩm STEAM tại Ngày hội Xanh (4 Tiêu chí xoay quanh sản phẩm × 5 Mức độ = 10 điểm)
export const STAGE5_TEACHER_PRODUCT_RUBRIC_CRITERIA: Stage3RubricCriterion[] = [
  {
    id: 's5-tea-science',
    category: 'Sản phẩm & Quy trình',
    title: '1. CƠ SỞ KHOA HỌC BÀI 30 THỂ HIỆN TRÊN SẢN PHẨM',
    weightPercent: 25,
    maxPoints: 2.5,
    levels: [
      {
        level: 1,
        label: 'Cần cố gắng',
        percentage: 20,
        points: 0.5,
        bullets: [
          'Sản phẩm chưa thể hiện rõ việc sử dụng sợi cellulose và chất kết dính hồ tinh bột.',
          'Kết cấu rời rạc do chưa vận dụng đúng tính chất vật lí của nguyên liệu.',
        ],
      },
      {
        level: 2,
        label: 'Đạt',
        percentage: 40,
        points: 1.0,
        bullets: [
          'Sản phẩm có sử dụng nguồn cellulose và tinh bột nhưng tỉ lệ phối trộn chưa hợp lí.',
        ],
      },
      {
        level: 3,
        label: 'Khá',
        percentage: 60,
        points: 1.5,
        bullets: [
          'Sản phẩm thể hiện đúng vai trò khung sợi cellulose (dai, bền) và chất kết dính sinh học hồ tinh bột.',
        ],
      },
      {
        level: 4,
        label: 'Tốt',
        percentage: 80,
        points: 2.0,
        bullets: [
          'Phối trộn sợi cellulose và hồ tinh bột hài hòa, phát huy rõ tính bền sợi và độ kết dính tự nhiên.',
        ],
      },
      {
        level: 5,
        label: 'Xuất sắc',
        percentage: 100,
        points: 2.5,
        bullets: [
          'Tối ưu hóa hoàn hảo tỉ lệ cellulose : tinh bột trên sản phẩm; đạt chất lượng vật liệu sinh học vượt trội.',
        ],
      },
    ],
  },
  {
    id: 's5-tea-quality',
    category: 'Sản phẩm & Quy trình',
    title: '2. ĐỘ BỀN, KỸ THUẬT HOÀN THIỆN & KHẢ NĂNG NẢY MẦM CỦA HẠT',
    weightPercent: 35,
    maxPoints: 3.5,
    levels: [
      {
        level: 1,
        label: 'Cần cố gắng',
        percentage: 20,
        points: 0.7,
        bullets: [
          'Sản phẩm chưa thành hình, bị rã, ẩm mốc; chưa tích hợp hạt giống hoặc hạt bị chết phôi, không nảy mầm.',
        ],
      },
      {
        level: 2,
        label: 'Đạt',
        percentage: 40,
        points: 1.4,
        bullets: [
          'Sản phẩm thành hình nhưng độ bền kém, bề mặt thô; hạt mầm phân bố chưa đều, tỉ lệ nảy mầm thấp (< 40%).',
        ],
      },
      {
        level: 3,
        label: 'Khá',
        percentage: 60,
        points: 2.1,
        bullets: [
          'Sản phẩm chắc chắn, đáp ứng tốt công năng cơ bản; hạt giống tích hợp tương đối đều và có nảy mầm khi tưới ẩm (≥ 50%).',
        ],
      },
      {
        level: 4,
        label: 'Tốt',
        percentage: 80,
        points: 2.8,
        bullets: [
          'Sản phẩm bền đẹp, bề mặt mịn đồng đều, chịu ẩm nhẹ tốt; hạt mầm tích hợp đều và nảy mầm khỏe, đạt tỉ lệ cao (≥ 75%).',
        ],
      },
      {
        level: 5,
        label: 'Xuất sắc',
        percentage: 100,
        points: 3.5,
        bullets: [
          'Hoàn thiện sắc sảo như sản phẩm thương mại xanh: bền chắc, chịu lực/ẩm tốt; hạt giống nảy mầm đồng loạt (≥ 90%) có minh chứng đối chứng rõ ràng.',
        ],
      },
    ],
  },
  {
    id: 's5-tea-creativity',
    category: 'Sản phẩm & Quy trình',
    title: '3. TÍNH SÁNG TẠO, THẨM MỸ & NGUYÊN LIỆU TÁI CHẾ',
    weightPercent: 20,
    maxPoints: 2.0,
    levels: [
      {
        level: 1,
        label: 'Cần cố gắng',
        percentage: 20,
        points: 0.4,
        bullets: ['Hình thức sơ sài, sao chép mẫu đơn giản, chưa có điểm nhấn sáng tạo trên sản phẩm.'],
      },
      {
        level: 2,
        label: 'Đạt',
        percentage: 40,
        points: 0.8,
        bullets: ['Sản phẩm gọn gàng ở mức cơ bản, sử dụng 1 loại phế phẩm tái chế thông dụng.'],
      },
      {
        level: 3,
        label: 'Khá',
        percentage: 60,
        points: 1.2,
        bullets: ['Tạo hình sản phẩm cân đối, bắt mắt; tận dụng tốt phế phẩm nông nghiệp/giấy vụn địa phương.'],
      },
      {
        level: 4,
        label: 'Tốt',
        percentage: 80,
        points: 1.6,
        bullets: ['Kết hợp sáng tạo ≥ 2 nguồn phế phẩm; kiểu dáng đẹp, màu sắc tự nhiên hài hòa, có nhãn mác.'],
      },
      {
        level: 5,
        label: 'Xuất sắc',
        percentage: 100,
        points: 2.0,
        bullets: ['Thiết kế sản phẩm độc đáo, thẩm mỹ cao, đóng gói hoàn chỉnh kèm hướng dẫn sử dụng tinh tế.'],
      },
    ],
  },
  {
    id: 's5-tea-safety',
    category: 'Sản phẩm & Quy trình',
    title: '4. QUÁ TRÌNH TỰ PHÂN HỦY SINH HỌC, AN TOÀN & ỨNG DỤNG THỰC TẾ',
    weightPercent: 20,
    maxPoints: 2.0,
    levels: [
      {
        level: 1,
        label: 'Cần cố gắng',
        percentage: 20,
        points: 0.4,
        bullets: ['Sản phẩm còn lẫn tạp chất/hóa chất tẩy rửa hoặc keo nhựa khó phân hủy, không an toàn khi gieo trồng.'],
      },
      {
        level: 2,
        label: 'Đạt',
        percentage: 40,
        points: 0.8,
        bullets: ['Sản phẩm an toàn khi cầm nắm nhưng chưa kiểm chứng quá trình tự phân hủy trong đất/nước, tính ứng dụng còn hạn chế.'],
      },
      {
        level: 3,
        label: 'Khá',
        percentage: 60,
        points: 1.2,
        bullets: ['100% nguyên liệu an toàn, bắt đầu mềm và tự phân hủy sinh học trong đất ẩm; có thể thay thế đồ nhựa dùng 1 lần.'],
      },
      {
        level: 4,
        label: 'Tốt',
        percentage: 80,
        points: 1.6,
        bullets: ['Quá trình phân hủy sinh học diễn ra rõ rệt, tan rã tự nhiên thành mùn hữu cơ nuôi cây, không để lại vi nhựa hay chất độc.'],
      },
      {
        level: 5,
        label: 'Xuất sắc',
        percentage: 100,
        points: 2.0,
        bullets: ['Vòng đời Xanh khép kín: sản phẩm phân hủy hoàn toàn trong đất thành chất dinh dưỡng cho hạt nảy mầm, chi phí tối ưu, sẵn sàng nhân rộng.'],
      },
    ],
  },
];


export interface RubricFormState {
  selections: Record<string, 1 | 2 | 3 | 4 | 5>;
  points: Record<string, number>;
  evaluatorMode: 'peer' | 'self';
  evaluatorGroup: string;
  targetGroup: string;
  className: string;
  feedbackNote: string;
  isSending: boolean;
  status: 'idle' | 'success' | 'error';
  message: string | null;
  validationError: string | null;
}

export const createInitialRubricFormState = (): RubricFormState => ({
  selections: {},
  points: {},
  evaluatorMode: 'peer',
  evaluatorGroup: '',
  targetGroup: '',
  className: '',
  feedbackNote: '',
  isSending: false,
  status: 'idle',
  message: null,
  validationError: null,
});

export const getCriterionPointFromState = (
  criterion: Stage3RubricCriterion,
  state: Pick<RubricFormState, 'points' | 'selections'>
): number | undefined => {
  if (state.points[criterion.id] !== undefined) return state.points[criterion.id];
  const pickedLevel = state.selections[criterion.id];
  if (pickedLevel === undefined) return undefined;
  return criterion.levels.find((item) => item.level === pickedLevel)?.points;
};

export const getRubricSummary = (criteria: Stage3RubricCriterion[], state: RubricFormState) => {
  const answeredCount = criteria.filter(
    (c) => state.points[c.id] !== undefined || state.selections[c.id] !== undefined
  ).length;
  const isComplete = answeredCount === criteria.length;
  const totalPoints =
    Math.round(criteria.reduce((sum, c) => sum + (getCriterionPointFromState(c, state) ?? 0), 0) * 100) /
    100;
  const rank =
    totalPoints >= 8.5
      ? { label: 'Xuất sắc', colorClass: 'bg-emerald-500 text-white' }
      : totalPoints >= 7.0
        ? { label: 'Khá / Tốt', colorClass: 'bg-sky-500 text-white' }
        : totalPoints >= 5.0
          ? { label: 'Đạt yêu cầu', colorClass: 'bg-amber-500 text-white' }
          : { label: 'Cần cải thiện', colorClass: 'bg-rose-500 text-white' };
  return { answeredCount, isComplete, totalPoints, rank };
};

export const buildRubricMailtoBodyFor = (
  stageTitle: string,
  criteria: Stage3RubricCriterion[],
  state: RubricFormState
) => {
  const { totalPoints, rank } = getRubricSummary(criteria, state);
  const modeLabel = state.evaluatorMode === 'self' ? 'Tự đánh giá' : 'Đánh giá đồng đẳng';
  const lines = [
    `PHIẾU ĐÁNH GIÁ RUBRIC ${stageTitle.toUpperCase()}`,
    `Hình thức: ${modeLabel}`,
    `Nhóm thực hiện đánh giá: ${state.evaluatorGroup.trim() || 'Chưa ghi'}`,
    `Nhóm được đánh giá: ${state.targetGroup.trim() || 'Chưa ghi'}`,
    `Lớp: ${state.className.trim() || 'KHTN 9'}`,
    `-----------------------------------------`,
    ...criteria.map((c) => {
      const pts = getCriterionPointFromState(c, state) ?? 0;
      const lvNum = state.selections[c.id];
      const lvLabel = c.levels.find((l) => l.level === lvNum)?.label ?? '';
      return `${c.title}: ${pts}/${c.maxPoints} đ (${lvLabel})`;
    }),
    `-----------------------------------------`,
    `TỔNG ĐIỂM: ${totalPoints} / 10 điểm (${rank.label})`,
    `Nhận xét góp ý: ${state.feedbackNote.trim() || '(Không có)'}`,
  ];
  return lines.join('\n');
};

export const RUBRIC_CATEGORY_BADGE_CLASSES: Record<Stage3RubricCriterion['category'], string> = {
  'Ý tưởng (3.1)': 'bg-amber-100 text-amber-800',
  'Quy trình (3.2)': 'bg-sky-100 text-sky-800',
  'Trình bày & Phản biện': 'bg-purple-100 text-purple-800',
  'Sản phẩm & Quy trình': 'bg-emerald-100 text-emerald-800',
  'Poster Khoa học': 'bg-orange-100 text-orange-800',
  'Thuyết trình & Phản biện': 'bg-purple-100 text-purple-800',
};

export const RUBRIC_LEVEL_STYLE_CLASSES: Record<1 | 2 | 3 | 4 | 5, { picked: string; badge: string }> = {
  1: { picked: 'bg-rose-50 border-rose-500 ring-2 ring-rose-400/50 text-rose-950', badge: 'bg-rose-600 text-white' },
  2: { picked: 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/50 text-amber-950', badge: 'bg-amber-600 text-white' },
  3: { picked: 'bg-sky-50 border-sky-500 ring-2 ring-sky-400/50 text-sky-950', badge: 'bg-sky-600 text-white' },
  4: { picked: 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-400/50 text-indigo-950', badge: 'bg-indigo-600 text-white' },
  5: { picked: 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/50 text-emerald-950', badge: 'bg-emerald-600 text-white' },
};


export interface Stage6SelfRubricCriterion {
  id: string;
  code: string;
  badge: string;
  title: string;
  weightText: string;
  maxPoints: number;
  levels: {
    level: 1 | 2 | 3 | 4 | 5;
    points: number;
    text: string;
  }[];
}

export const STAGE6_SELF_RUBRIC_CRITERIA: Stage6SelfRubricCriterion[] = [
  {
    id: 's6_self_padlet',
    code: '1',
    badge: 'Năng lực số • Padlet',
    title: 'THAM GIA THẢO LUẬN & MINH CHỨNG PADLET',
    weightText: '25% • Tối đa: 2.5đ',
    maxPoints: 2.5,
    levels: [
      { level: 1, points: 0.5, text: 'Em chưa đăng bài lên Padlet của nhóm và chưa tham gia bình luận trao đổi cùng các bạn.' },
      { level: 2, points: 1.0, text: 'Em có đăng bài lên Padlet nhưng nội dung còn ngắn, phải đợi nhóm trưởng nhắc nhở.' },
      { level: 3, points: 1.5, text: 'Em đã đăng đầy đủ minh chứng phần việc của mình lên Padlet đúng thời hạn quy định.' },
      { level: 4, points: 2.0, text: 'Em chủ động đăng ảnh/video quá trình làm việc rõ nét và tích cực bình luận góp ý trên Padlet.' },
      { level: 5, points: 2.5, text: 'Em thường xuyên trao đổi ý tưởng, hệ thống hóa thông tin trên Padlet và góp ý sâu cho nhóm bạn.' },
    ],
  },
  {
    id: 's6_self_knowledge',
    code: '2',
    badge: 'Kiến thức KHTN 9',
    title: 'VẬN DỤNG KIẾN THỨC TINH BỘT & CELLULOSE',
    weightText: '25% • Tối đa: 2.5đ',
    maxPoints: 2.5,
    levels: [
      { level: 1, points: 0.5, text: 'Em còn lúng túng, chưa phân biệt rõ cấu tạo và tính chất của Tinh bột với Cellulose.' },
      { level: 2, points: 1.0, text: 'Em nhận biết được nguyên liệu thuộc Tinh bột hay Cellulose nhưng giải thích chưa trọn vẹn.' },
      { level: 3, points: 1.5, text: 'Em hiểu rõ công thức (C₆H₁₀O₅)ₙ và giải thích được vai trò liên kết sợi hoặc hồ hóa tinh bột.' },
      { level: 4, points: 2.0, text: 'Em vận dụng kiến thức Bài 30 để đề xuất tỉ lệ phối trộn nguyên liệu và xử lý sự cố kỹ thuật.' },
      { level: 5, points: 2.5, text: 'Em làm chủ kiến thức khoa học của dự án, tự tin giải thích cơ chế hóa học bằng cả tiếng Anh/Việt.' },
    ],
  },
  {
    id: 's6_self_practice',
    code: '3',
    badge: 'Thực hành & Hóa học xanh',
    title: 'KỸ NĂNG THỰC HÀNH & TUÂN THỦ AN TOÀN',
    weightText: '30% • Tối đa: 3.0đ',
    maxPoints: 3.0,
    levels: [
      { level: 1, points: 0.6, text: 'Em chưa hoàn thành nhiệm vụ thực hành được giao hoặc chưa chú ý an toàn dụng cụ/nhiệt.' },
      { level: 2, points: 1.2, text: 'Em có tham gia làm sản phẩm nhưng thao tác còn lúng túng, định lượng chưa chính xác.' },
      { level: 3, points: 1.8, text: 'Em hoàn thành tốt khâu thực hành được phân công, tuân thủ đúng quy tắc an toàn vệ sinh.' },
      { level: 4, points: 2.4, text: 'Em thao tác thành thạo, đo lường chuẩn xác và chủ động tái sử dụng phụ phẩm bảo vệ môi trường.' },
      { level: 5, points: 3.0, text: 'Em là nhân tố nòng cốt tạo ra sản phẩm bền đẹp, sáng tạo cải tiến kỹ thuật và giữ an toàn tuyệt đối.' },
    ],
  },
  {
    id: 's6_self_coop',
    code: '4',
    badge: 'Hợp tác & Báo cáo',
    title: 'TINH THẦN HỢP TÁC, POSTER & THUYẾT TRÌNH',
    weightText: '20% • Tối đa: 2.0đ',
    maxPoints: 2.0,
    levels: [
      { level: 1, points: 0.4, text: 'Em ít tham gia họp nhóm, nộp việc trễ hạn và chưa tham gia khâu Poster hay thuyết trình.' },
      { level: 2, points: 0.8, text: 'Em tham gia ở mức thụ động, có hỗ trợ làm Poster hoặc thuyết trình nhưng còn phụ thuộc tài liệu.' },
      { level: 3, points: 1.2, text: 'Em phối hợp vui vẻ, đúng hẹn, đóng góp nội dung Poster và hoàn thành phần trình bày được giao.' },
      { level: 4, points: 1.6, text: 'Em lắng nghe, hỗ trợ bạn tích cực; thuyết trình tự tin hoặc thiết kế Poster khoa học, đẹp mắt.' },
      { level: 5, points: 2.0, text: 'Em kết nối cả nhóm hiệu quả, thuyết trình lôi cuốn và tự tin phản biện trước lớp và giáo viên.' },
    ],
  },
];

export interface Stage6LeaderRubricCriterion {
  id: string;
  code: string;
  title: string;
  weightText: string;
  maxPoints: number;
  levels: {
    level: 1 | 2 | 3 | 4 | 5;
    points: number;
    text: string;
  }[];
}

export const STAGE6_LEADER_RUBRIC_CRITERIA: Stage6LeaderRubricCriterion[] = [
  {
    id: 's6_ldr_padlet',
    code: '1',
    title: 'TRAO ĐỔI & CẬP NHẬT MINH CHỨNG TRÊN PADLET',
    weightText: 'Trọng số: 25% • Tối đa: 2.5đ',
    maxPoints: 2.5,
    levels: [
      { level: 1, points: 0.5, text: 'Không tham gia thảo luận trên Padlet; không đăng tải minh chứng phần việc được giao.' },
      { level: 2, points: 1.0, text: 'Có đăng bài lên Padlet nhưng sơ sài, chỉ thực hiện sau khi nhóm trưởng nhắc nhở nhiều lần.' },
      { level: 3, points: 1.5, text: 'Cập nhật đầy đủ minh chứng cá nhân lên cột Padlet của nhóm đúng thời hạn quy định.' },
      { level: 4, points: 2.0, text: 'Tích cực trao đổi ý tưởng trên Padlet, đăng ảnh/video quá trình làm việc rõ nét, chi tiết.' },
      { level: 5, points: 2.5, text: 'Dẫn dắt thảo luận sôi nổi trên Padlet, hỗ trợ tổng hợp minh chứng và góp ý hiệu quả cho nhóm bạn.' },
    ],
  },
  {
    id: 's6_ldr_task',
    code: '2',
    title: 'THỰC HIỆN NHIỆM VỤ CHUYÊN MÔN & CHẾ TẠO SẢN PHẨM',
    weightText: 'Trọng số: 35% • Tối đa: 3.5đ',
    maxPoints: 3.5,
    levels: [
      { level: 1, points: 0.7, text: 'Không hoàn thành phần việc được phân công hoặc làm qua loa, gây ảnh hưởng tiến độ chung.' },
      { level: 2, points: 1.4, text: 'Hoàn thành phần việc ở mức cơ bản nhưng còn sai sót, cần thành viên khác sửa lại.' },
      { level: 3, points: 2.1, text: 'Hoàn thành đúng nhiệm vụ được giao (chuẩn bị phế phẩm, xay/ép khuôn, làm Poster...).' },
      { level: 4, points: 2.8, text: 'Thực hiện nhiệm vụ cẩn thận, đảm bảo định lượng kỹ thuật và an toàn Hóa học Xanh.' },
      { level: 5, points: 3.5, text: 'Hoàn thành xuất sắc phần việc với chất lượng cao, có sáng kiến tối ưu quy trình chế tạo.' },
    ],
  },
  {
    id: 's6_ldr_coop',
    code: '3',
    title: 'TINH THẦN HỢP TÁC, KỶ LUẬT & ĐÚNG HẠN',
    weightText: 'Trọng số: 20% • Tối đa: 2.0đ',
    maxPoints: 2.0,
    levels: [
      { level: 1, points: 0.4, text: 'Thường xuyên vắng họp nhóm, trễ hạn tất cả các chặng, thiếu tôn trọng ý kiến tập thể.' },
      { level: 2, points: 0.8, text: 'Tham gia chưa đều, còn trễ hạn 1–2 đầu việc, thái độ làm việc thụ động.' },
      { level: 3, points: 1.2, text: 'Tham gia đầy đủ các buổi làm việc nhóm, tuân thủ phân công và nộp bài đúng hạn.' },
      { level: 4, points: 1.6, text: 'Chủ động phối hợp nhịp nhàng, lắng nghe góp ý và sẵn sàng nhận thêm việc khi nhóm cần.' },
      { level: 5, points: 2.0, text: 'Gương mẫu, kỷ luật cao, luôn kết nối và hỗ trợ kịp thời các thành viên gặp khó khăn.' },
    ],
  },
  {
    id: 's6_ldr_poster',
    code: '4',
    title: 'ĐÓNG GÓP HOÀN THIỆN POSTER & THUYẾT TRÌNH PHẢN BIỆN',
    weightText: 'Trọng số: 20% • Tối đa: 2.0đ',
    maxPoints: 2.0,
    levels: [
      { level: 1, points: 0.4, text: 'Không tham gia chuẩn bị Poster, không tham gia thuyết trình hay hỗ trợ trả lời phản biện.' },
      { level: 2, points: 0.8, text: 'Có tham gia hỗ trợ khâu trình bày/hậu cần nhưng đóng góp nội dung kiến thức Bài 30 còn ít.' },
      { level: 3, points: 1.2, text: 'Đóng góp nội dung/hình ảnh cho Poster hoặc tham gia thuyết trình đúng phần được phân công.' },
      { level: 4, points: 1.6, text: 'Tích cực biên tập Poster khoa học, luyện tập thuyết trình tự tin và hỗ trợ trả lời phản biện.' },
      { level: 5, points: 2.0, text: 'Đóng vai trò nòng cốt trong thiết kế Poster, thuyết trình lôi cuốn hoặc phản biện sắc sảo.' },
    ],
  },
];

export interface Stage6MemberRecord {
  id: string;
  name: string;
  role: string;
  scores: Record<string, number>;
  comment: string;
}

export interface Stage6TeamPreset {
  id: string;
  name: string;
  className: string;
  leaderName: string;
  productName: string;
  members: Stage6MemberRecord[];
}

export const STAGE6_TEAM_PRESETS: Stage6TeamPreset[] = [
  {
    id: 'team-ngan',
    name: 'Nhóm 1 - Hóa Học Xanh (Green Chem)',
    className: '9A',
    leaderName: 'Nguyễn Thuý Ngân',
    productName: 'Vật liệu xơ sợi sinh học & Màng bọc thực phẩm tự hủy',
    members: [
      {
        id: 'ngan-m1',
        name: 'Lê Hải Yến',
        role: 'Kỹ thuật viên chế tạo & Thử nghiệm',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 1.6 },
        comment: 'Thao tác cẩn thận, đo lường chuẩn xác nguyên liệu bột xơ sợi, thực hiện quy trình an toàn.',
      },
      {
        id: 'ngan-m2',
        name: 'Trần Quỳnh Như',
        role: 'Biên tập Poster & Nội dung Bài 30',
        scores: { s6_ldr_padlet: 2.5, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Thiết kế Poster khoa học, bố cục hài hòa, thể hiện rõ công thức và cơ chế liên kết sợi.',
      },
      {
        id: 'ngan-m3',
        name: 'Phạm Quỳnh Trâm',
        role: 'Phụ trách định lượng phụ gia & Chống ẩm',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Nghiên cứu phụ gia sinh học an toàn, tích cực phối hợp cùng nhóm thực hành ép khuôn.',
      },
      {
        id: 'ngan-m4',
        name: 'Huỳnh Kha My',
        role: 'Truyền thông số & Quay dựng Video',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Chụp ảnh, quay clip các bước thực hành rõ nét, cập nhật bài đăng lên Padlet đúng hạn.',
      },
      {
        id: 'ngan-m5',
        name: 'Võ Như Quỳnh',
        role: 'Thuyết trình viên & Trả lời phản biện',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Thuyết trình lưu loát, tự tin, nắm vững kiến thức Hóa học Xanh và phản biện thuyết phục.',
      },
    ],
  },
  {
    id: 'team-thao',
    name: 'Nhóm 2 - Tinh Bột Xanh (Green Starch)',
    className: '9A',
    leaderName: 'Nguyễn Thu Thảo',
    productName: 'Túi màng sinh học tự phân hủy từ Tinh bột & Sợi rơm rạ',
    members: [
      {
        id: 'thao-m1',
        name: 'Lê Thiên Hà Giang',
        role: 'Kỹ thuật viên chế tạo & Định lượng tỷ lệ',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 1.6 },
        comment: 'Thao tác cẩn thận, đo lường chuẩn xác tỷ lệ tinh bột và chất hóa dẻo glycerol an toàn.',
      },
      {
        id: 'thao-m2',
        name: 'Hoàng Trần Ngọc Anh',
        role: 'Biên tập Poster & Nội dung Bài 30',
        scores: { s6_ldr_padlet: 2.5, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Thiết kế Poster khoa học, đẹp mắt, phân tích rõ cơ chế hồ hóa tinh bột và liên kết mạch polymer.',
      },
      {
        id: 'thao-m3',
        name: 'Nguyễn Minh Khang',
        role: 'Nghiên cứu phụ gia sinh học & Độ bền',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Tích cực thử nghiệm độ dai chịu lực của màng sinh học và ghi chép nhật ký thực hành đầy đủ.',
      },
      {
        id: 'thao-m4',
        name: 'Nguyễn Minh Quân',
        role: 'Truyền thông số & Quay dựng Video',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Quay phim các bước thí nghiệm rõ nét, đăng tải minh chứng lên Padlet đúng hạn quy định.',
      },
      {
        id: 'thao-m5',
        name: 'Nguyễn Nam Phong',
        role: 'Thuyết trình viên & Trả lời phản biện',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Phong thái tự tin, đối đáp mạch lạc và giải thích sâu sắc thông điệp Hóa học Xanh.',
      },
    ],
  },
  {
    id: 'team-hung',
    name: 'Nhóm 3 - Sợi Tái Sinh (Eco Paper)',
    className: '9A',
    leaderName: 'Trần Hoàng Hùng',
    productName: 'Giấy sinh học từ bã mía & rơm rạ nảy mầm',
    members: [
      {
        id: 'hung-m1',
        name: 'Bùi Minh Huy',
        role: 'Kỹ thuật viên chế tạo & Thử nghiệm',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Thao tác thực hành cẩn thận, đo lường chuẩn xác nguyên liệu bột bã mía, tuân thủ an toàn.',
      },
      {
        id: 'hung-m2',
        name: 'Lê Như Cát Tường',
        role: 'Biên tập Poster & Nội dung Bài 30',
        scores: { s6_ldr_padlet: 2.5, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Thiết kế Poster rất đẹp mắt, khoa học, thể hiện chuẩn xác cấu tạo và cơ chế hóa học Bài 30.',
      },
      {
        id: 'hung-m3',
        name: 'Liêu Hoàng Gia',
        role: 'Phụ trách định lượng phụ gia & Chống mốc',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Tìm tòi giải pháp phụ gia sinh học an toàn, nhiệt tình hỗ trợ ép khuôn và phơi mẫu.',
      },
      {
        id: 'hung-m4',
        name: 'Đặng Thị Minh Đông',
        role: 'Truyền thông số & Quay dựng Video',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Cập nhật minh chứng đầy đủ lên Padlet, quay dựng video hành trình sống động, lôi cuốn.',
      },
      {
        id: 'hung-m5',
        name: 'Nguyễn Hoàng Bảo Trân',
        role: 'Thuyết trình viên & Phản biện',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Thuyết trình tự tin, mạch lạc, đối đáp và phản biện thông minh trước lớp và giáo viên.',
      },
      {
        id: 'hung-m6',
        name: 'Phan Lê Huy',
        role: 'Chuẩn bị phế phẩm hữu cơ & Hậu cần',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Thu gom nguyên liệu bã mía, rơm rạ kịp thời; dọn dẹp vệ sinh phòng thực hành sạch sẽ.',
      },
    ],
  },
  {
    id: 'team-phuong-anh',
    name: 'Nhóm 4 - Bách Thảo Sinh Học (Bio Polymer)',
    className: '9A',
    leaderName: 'Trần Phương Anh (STT: 05)',
    productName: 'Khay đựng thực phẩm tự phân hủy từ xơ dừa & tinh bột ngô',
    members: [
      {
        id: 'pa-m1',
        name: 'Võ Hoàng Dung',
        role: 'Kỹ thuật viên chế tạo & Thử nghiệm (STT: 08)',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 1.6 },
        comment: 'Thao tác ép nhiệt định hình khay thực phẩm chuẩn xác, nhiệt tình phối hợp cùng nhóm.',
      },
      {
        id: 'pa-m2',
        name: 'Phan Thanh Ngân',
        role: 'Biên tập Poster & Nội dung Bài 30 (STT: 25)',
        scores: { s6_ldr_padlet: 2.5, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Biên tập nội dung lý thuyết Bài 30 sắc nét, bố cục Poster hiện đại, sáng tạo.',
      },
      {
        id: 'pa-m3',
        name: 'Hồ Lê Bảo Ngọc',
        role: 'Phụ trách định lượng phụ gia & Chống ẩm (STT: 27)',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Tính toán tỷ lệ chất kết dính sinh học an toàn, kiểm soát độ ẩm mẫu khay tốt.',
      },
      {
        id: 'pa-m4',
        name: 'Lê Thị Minh Thảo',
        role: 'Truyền thông số & Quay dựng Video (STT: 39)',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 1.6 },
        comment: 'Ghi hình quá trình xử lý xơ dừa chi tiết, cập nhật Padlet đều đặn đúng tiến độ.',
      },
      {
        id: 'pa-m5',
        name: 'Nguyễn Phạm Tường Vy',
        role: 'Thuyết trình viên & Trả lời phản biện (STT: 50)',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Trình bày sản phẩm lôi cuốn, trả lời câu hỏi phản biện của thầy cô tự tin, thuyết phục.',
      },
    ],
  },
  {
    id: 'team-hanh-quynh',
    name: 'Nhóm 5 - Vòng Đời Tự Nhiên (Nature Cycle)',
    className: '9A',
    leaderName: 'Dương Minh Hạnh Quỳnh',
    productName: 'Chậu ươm cây tự phân hủy từ bã cà phê, mùn cưa và hồ tinh bột',
    members: [
      {
        id: 'hq-m1',
        name: 'Lê Nguyễn Phương Vy',
        role: 'Kỹ thuật viên chế tạo & Thử nghiệm',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 1.6 },
        comment: 'Nhiệt tình tham gia khâu ép chậu ươm, điều chỉnh tỷ lệ hồ tinh bột kết dính đồng đều.',
      },
      {
        id: 'hq-m2',
        name: 'Võ Trần Gia Hân',
        role: 'Biên tập Poster & Nội dung Bài 30',
        scores: { s6_ldr_padlet: 2.5, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Thiết kế Poster giàu tính thẩm mỹ, giải thích rõ cơ chế phân hủy sinh học trong đất.',
      },
      {
        id: 'hq-m3',
        name: 'Nguyễn Huỳnh Phương Thảo',
        role: 'Phụ trách định lượng phụ gia & Chống ẩm',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Đo lường nguyên liệu mùn cưa và bã cà phê chuẩn xác, giữ gìn vệ sinh khu vực làm việc.',
      },
      {
        id: 'hq-m4',
        name: 'Võ Ngọc Phương Trang',
        role: 'Truyền thông số & Quay dựng Video',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Tích cực quay dựng video clip thử nghiệm gieo hạt trong chậu ươm, đăng bài đúng hạn.',
      },
      {
        id: 'hq-m5',
        name: 'Lê Hồng Sun Ny',
        role: 'Thuyết trình viên & Trả lời phản biện',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Giọng nói truyền cảm, phong thái tự tin, lan tỏa thông điệp Hóa học Xanh ấn tượng.',
      },
    ],
  },
  {
    id: 'team-tam-anh',
    name: 'Nhóm 6 - Tương Lai Xanh (Green Future)',
    className: '9A',
    leaderName: 'Nguyễn Phạm Tâm Anh',
    productName: 'Màng bảo quản nông sản kháng khuẩn từ tinh bột sắn & sợi chuối',
    members: [
      {
        id: 'ta-m1',
        name: 'Lê Thạch Trâm Anh',
        role: 'Kỹ thuật viên chế tạo & Thử nghiệm',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 1.6 },
        comment: 'Thực hành tách sợi chuối cẩn thận, phối trộn dung dịch hồ hóa tinh bột sắn chuẩn tỷ lệ.',
      },
      {
        id: 'ta-m2',
        name: 'Nguyễn Tuyết Ngân',
        role: 'Biên tập Poster & Nội dung Bài 30',
        scores: { s6_ldr_padlet: 2.5, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Hệ thống kiến thức Bài 30 khoa học, trình bày hình ảnh so sánh vi cấu trúc trực quan.',
      },
      {
        id: 'ta-m3',
        name: 'Hoàng Hải Đăng',
        role: 'Phụ trách định lượng phụ gia & Thử độ bền dai',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Khảo sát độ bền kéo đứt của màng sinh học chi tiết, ghi nhận số liệu thực nghiệm đầy đủ.',
      },
      {
        id: 'ta-m4',
        name: 'Nguyễn Ngọc Anh Thư',
        role: 'Truyền thông số & Quay dựng Video',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Biên tập video clip tổng kết dự án sinh động, lồng nhạc nền và hiệu ứng đồ họa đẹp mắt.',
      },
      {
        id: 'ta-m5',
        name: 'Lê Trần Bảo Trí',
        role: 'Chuẩn bị nguyên liệu phế phẩm & Hậu cần',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Chủ động thu gom thân cây chuối sau thu hoạch, hỗ trợ nhóm sơ chế phế phẩm an toàn.',
      },
      {
        id: 'ta-m6',
        name: 'Phan Hồ Hữu Đạt',
        role: 'Thuyết trình viên & Trả lời phản biện',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Làm chủ sân khấu báo cáo, trả lời sắc sảo các câu hỏi phản biện của nhóm bạn và giáo viên.',
      },
    ],
  },
  {
    id: 'team-phong-danh',
    name: 'Nhóm 7 - Đổi Mới Sáng Tạo (Eco Innovation)',
    className: '9A',
    leaderName: 'Lê Quốc Phong Danh',
    productName: 'Bao bì xốp sinh học định hình từ bã mía & tinh bột lúa mì',
    members: [
      {
        id: 'pd-m1',
        name: 'Đào Tiến Dũng',
        role: 'Kỹ thuật viên chế tạo & Thử nghiệm',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 1.6 },
        comment: 'Thao tác ép nhiệt xốp bã mía an toàn, đảm bảo bề mặt sản phẩm nhẵn mịn, định hình tốt.',
      },
      {
        id: 'pd-m2',
        name: 'Hoàng Trọng Khôi',
        role: 'Biên tập Poster & Nội dung Bài 30',
        scores: { s6_ldr_padlet: 2.5, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Thiết kế Poster đạt chuẩn học đường, sơ đồ quy trình 4 bước rõ ràng, dễ theo dõi.',
      },
      {
        id: 'pd-m3',
        name: 'Ngô Gia Phúc',
        role: 'Phụ trách định lượng phụ gia & Chống mốc',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Nghiên cứu phụ gia sinh học tự nhiên chống mốc hiệu quả, tuân thủ an toàn Hóa học Xanh.',
      },
      {
        id: 'pd-m4',
        name: 'Phạm Tuấn Ngọc',
        role: 'Truyền thông số & Quay dựng Video',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 1.6, s6_ldr_poster: 1.6 },
        comment: 'Chụp ảnh và quay phim quá trình làm việc chi tiết, dẫn dắt thảo luận trên Padlet sôi nổi.',
      },
      {
        id: 'pd-m5',
        name: 'Nguyễn Đông Sơn',
        role: 'Thuyết trình viên & Trả lời phản biện',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Thuyết minh tự tin, diễn giải lưu loát tính ưu việt của bao bì sinh học thay thế hạt xốp EPS.',
      },
    ],
  },
  {
    id: 'team-tai',
    name: 'Nhóm 8 - Hành Tinh Xanh (Eco Planet)',
    className: '9A',
    leaderName: 'Vũ Bá Tài',
    productName: 'Vật liệu sinh học & Sản phẩm tái sinh thân thiện môi trường',
    members: [
      {
        id: 'tai-m1',
        name: 'Đỗ Quốc Huy',
        role: 'Kỹ thuật viên chế tạo & Thử nghiệm',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 1.6 },
        comment: 'Thao tác định lượng và thực hành chế tạo chuẩn xác, tuân thủ an toàn Hóa học Xanh.',
      },
      {
        id: 'tai-m2',
        name: 'Trần Đức Anh',
        role: 'Biên tập Poster & Nội dung Bài 30',
        scores: { s6_ldr_padlet: 2.5, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Thiết kế Poster khoa học, làm nổi bật công thức (C₆H₁₀O₅)ₙ và cơ chế liên kết sợi.',
      },
      {
        id: 'tai-m3',
        name: 'Lê Thanh Bình',
        role: 'Truyền thông số & Thuyết trình phản biện',
        scores: { s6_ldr_padlet: 2.0, s6_ldr_task: 2.8, s6_ldr_coop: 2.0, s6_ldr_poster: 2.0 },
        comment: 'Cập nhật minh chứng đầy đủ lên Padlet, phong thái thuyết trình tự tin và phản biện rõ ràng.',
      },
    ],
  },
];

export const INITIAL_STAGE6_MEMBERS: Stage6MemberRecord[] = STAGE6_TEAM_PRESETS[0].members;

export interface Stage6TeacherRubricCriterion {
  id: string;
  code: string;
  stageTag: string;
  title: string;
  weightText: string;
  maxPoints: number;
  levels: {
    level: 1 | 2 | 3 | 4 | 5;
    points: number;
    text: string;
  }[];
}

export const STAGE6_TEACHER_RUBRIC_CRITERIA: Stage6TeacherRubricCriterion[] = [
  {
    id: 's6_tea_padlet',
    code: '1',
    stageTag: 'Chặng 1–4 • Hoạt động số',
    title: '1. HỢP TÁC NHÓM & TƯƠNG TÁC TRÊN PADLET',
    weightText: 'Trọng số: 10% | Tối đa: 1.0đ',
    maxPoints: 1.0,
    levels: [
      { level: 1, points: 0.2, text: 'Không tạo cột nhóm hoặc bỏ trống Padlet; không có minh chứng trao đổi trực tuyến. Thành viên đùn đẩy trách nhiệm, nộp sản phẩm trễ hạn tất cả các chặng.' },
      { level: 2, points: 0.4, text: 'Có đăng bài lên Padlet nhưng rời rạc, chỉ 1–2 thành viên hoạt động. Nộp bài đúng hạn 1–2 chặng; chưa tương tác nhận xét bài của nhóm bạn.' },
      { level: 3, points: 0.6, text: 'Cập nhật đủ minh chứng tiến độ 4 chặng lên Padlet kèm phân công nhiệm vụ rõ. Có ≥ 2 lượt bình luận góp ý mang tính xây dựng cho các nhóm khác trên Padlet.' },
      { level: 4, points: 0.8, text: 'Tổ chức cột Padlet khoa học, trực quan (kèm ảnh/video quá trình thực hành tại nhà). 100% thành viên tham gia thảo luận sôi nổi, phản hồi và tiếp thu góp ý kịp thời.' },
      { level: 5, points: 1.0, text: 'Quản trị Padlet xuất sắc như nhật ký nghiên cứu số chuyên nghiệp, cập nhật đúng hạn 100%. Tương tác đa chiều, đặt câu hỏi phản biện sâu sắc giúp nâng chất lượng chung của cả lớp.' },
    ],
  },
  {
    id: 's6_tea_science',
    code: '2',
    stageTag: 'Chặng 2–3 • Ý tưởng (3.1)',
    title: '2. CƠ SỞ KHOA HỌC & TÍNH SÁNG TẠO XANH',
    weightText: 'Trọng số: 15% | Tối đa: 1.5đ',
    maxPoints: 1.5,
    levels: [
      { level: 1, points: 0.3, text: 'Chưa phân biệt được bản chất Tinh bột và Cellulose; sai lệch ≥ 2 kiến thức trọng tâm. Ý tưởng sao chép nguyên mẫu, chưa gắn với giải pháp tái chế phế phẩm thực tế.' },
      { level: 2, points: 0.6, text: 'Nêu được tên nguyên liệu polymer tự nhiên nhưng giải thích cấu tạo/tính chất còn sơ sài. Có điều chỉnh nhỏ về tạo hình; thể hiện được mục đích tận dụng rác thải hữu cơ.' },
      { level: 3, points: 0.9, text: 'Xác định đúng công thức (C₆H₁₀O₅)ₙ và vai trò liên kết sợi Cellulose / hồ hóa Tinh bột. Ý tưởng sáng tạo rõ nét (giấy nảy mầm, chậu ươm, vật liệu sinh học...) kèm thông điệp xanh.' },
      { level: 4, points: 1.2, text: 'Phân tích chặt chẽ mối liên hệ giữa cấu trúc hóa học và tính chất cơ lý của vật liệu. Tích hợp công năng kép độc đáo, tối ưu chi phí gần như 0 đồng từ phế phẩm địa phương.' },
      { level: 5, points: 1.5, text: 'Vận dụng xuất sắc kiến thức Bài 30 để phối trộn đa nguồn sợi/tinh bột với phụ gia an toàn. Giải pháp thay thế nhựa dùng một lần có tính thẩm mỹ, khả năng thương mại và nhân rộng cao.' },
    ],
  },
  {
    id: 's6_tea_process',
    code: '3',
    stageTag: 'Chặng 3 • Quy trình (3.2)',
    title: '3. THIẾT KẾ QUY TRÌNH 4 BƯỚC & AN TOÀN HÓA HỌC XANH',
    weightText: 'Trọng số: 15% | Tối đa: 1.5đ',
    maxPoints: 1.5,
    levels: [
      { level: 1, points: 0.3, text: 'Quy trình thiếu bước, lộn xộn; không có định lượng nguyên liệu và thời gian. Đề xuất hóa chất độc hại (xút đặc, Javen đặc) hoặc thiếu quy định an toàn điện/nhiệt.' },
      { level: 2, points: 0.6, text: 'Đủ 4 bước (Chuẩn bị → Xử lý → Tạo hình → Hoàn thiện) nhưng định lượng còn ước lượng. Nguyên liệu tương đối an toàn; có nhắc nhở bảo hộ chung nhưng chưa xử lý bã/nước thải.' },
      { level: 3, points: 0.9, text: 'Quy trình 4 bước logic, định lượng chuẩn (g, ml, phút, °C) cho ≥ 70% thành phần. Không dùng hóa chất độc hại; có phương án lọc nước thừa, không gây tắc bồn rửa.' },
      { level: 4, points: 1.2, text: 'Định lượng tối ưu 100% công đoạn kèm thông số kỹ thuật và phương án xử lý sự cố. Chi tiết hóa đồ bảo hộ từng khâu; tái sử dụng nước ngâm/xơ thừa để tưới cây, ủ phân.' },
      { level: 5, points: 1.5, text: 'Quy trình chuẩn hóa như tài liệu kỹ thuật, kèm bảng thử nghiệm đối chứng ≥ 2 công thức. Đảm bảo Hóa học Xanh trọn vòng đời (tái chế — không phát thải — tự phân hủy) với checklist 3 khâu.' },
    ],
  },
  {
    id: 's6_tea_product',
    code: '4',
    stageTag: 'Chặng 4 • Thực hành chế tạo',
    title: '4. CHẤT LƯỢNG & CÔNG NĂNG SẢN PHẨM TÁI SINH',
    weightText: 'Trọng số: 20% | Tối đa: 2.0đ',
    maxPoints: 2.0,
    levels: [
      { level: 1, points: 0.4, text: 'Sản phẩm hỏng, ẩm mốc, rách nát hoặc không thành hình khối. Chưa tích hợp hạt mầm hoặc chưa thể hiện được công năng sử dụng.' },
      { level: 2, points: 0.8, text: 'Sản phẩm thành hình nhưng kết cấu yếu, dễ rách; bề mặt còn lợn cợn (> 30% xơ thô). Có hạt mầm nhưng phân bố lệch, thiếu đồng đều.' },
      { level: 3, points: 1.2, text: 'Kết cấu vững chắc, thể hiện rõ độ dai sợi Cellulose hoặc độ kết dính Tinh bột. Hạt mầm phân bố đều ≥ 70% diện tích, không dập nát; bề mặt tương đối phẳng.' },
      { level: 4, points: 1.6, text: 'Sản phẩm bền, đẹp, bề mặt mịn đồng đều; quy trình hoàn thiện an toàn tuyệt đối. Hạt mầm tích hợp đều 100% diện tích, đảm bảo tỉ lệ nảy mầm tốt khi thử nghiệm.' },
      { level: 5, points: 2.0, text: 'Sản phẩm hoàn mỹ, chịu ẩm/chịu lực tốt, tính thẩm mỹ cao vượt mong đợi. Kết hợp đột phá ≥ 2 loại sợi tự nhiên/tinh bột kèm hướng dẫn sử dụng và phân hủy sinh học.' },
    ],
  },
  {
    id: 's6_tea_poster',
    code: '5',
    stageTag: 'Chặng 4 • Báo cáo trực quan',
    title: '5. POSTER KHOA HỌC (NỘI DUNG BÀI 30 & QUY TRÌNH)',
    weightText: 'Trọng số: 15% | Tối đa: 1.5đ',
    maxPoints: 1.5,
    levels: [
      { level: 1, points: 0.3, text: 'Sai lệch kiến thức Tinh bột & Cellulose từ 2 nội dung trở lên; thiếu sơ đồ cấu tạo. Trình bày cẩu thả, rời rạc, khó đọc, mắc ≥ 5 lỗi chính tả.' },
      { level: 2, points: 0.6, text: 'Đủ thông tin cơ bản Bài 30 nhưng bố cục nhiều chữ (> 60% diện tích), ít hình ảnh. Có liệt kê quy trình nhưng thiếu sơ đồ trực quan hóa.' },
      { level: 3, points: 0.9, text: 'Trình bày chính xác kiến thức Bài 30, có sơ đồ cấu tạo (C₆H₁₀O₅)ₙ và ≥ 2 ảnh thực tế. Bố cục chia mục cân đối, cỡ chữ rõ ràng, dễ quan sát từ xa.' },
      { level: 4, points: 1.2, text: 'Bố cục khoa học, màu sắc hài hòa, không lỗi chính tả; sơ đồ quy trình mũi tên trực quan. Gắn kết chặt chẽ cơ sở hóa học Bài 30 với số liệu định lượng và kết quả thử nghiệm.' },
      { level: 5, points: 1.5, text: 'Thiết kế chuyên nghiệp, cân đối (chữ ≤ 35%), giàu tính thẩm mỹ và truyền cảm hứng. Hệ thống hóa xuất sắc kiến thức KHTN 9, bảng số liệu đối chứng và thông điệp môi trường.' },
    ],
  },
  {
    id: 's6_tea_video',
    code: '6',
    stageTag: 'Chặng 4 • Truyền thông số',
    title: '6. VIDEO TỔNG KẾT HÀNH TRÌNH & LAN TỎA DỰ ÁN',
    weightText: 'Trọng số: 15% | Tối đa: 1.5đ',
    maxPoints: 1.5,
    levels: [
      { level: 1, points: 0.3, text: 'Không nộp video hoặc video rời rạc, thiếu minh chứng quá trình làm việc của nhóm. Hình ảnh mờ rung, âm thanh rè/không nghe rõ lời thuyết minh; vượt quá thời lượng quy định.' },
      { level: 2, points: 0.6, text: 'Có ghép ảnh/clip các bước làm sản phẩm nhưng chuyển cảnh thô, thiếu mạch kể chuyện. Thuyết minh/phụ đề còn sơ sài, chưa nêu bật được kiến thức Bài 30 và kết quả thử nghiệm.' },
      { level: 3, points: 0.9, text: 'Video tái hiện đủ 4 chặng (Ý tưởng → Chế tạo → Thử nghiệm → Sản phẩm), đúng thời lượng. Hình ảnh rõ nét, âm thanh dễ nghe, có phụ đề/nhãn chú thích các bước định lượng chính.' },
      { level: 4, points: 1.2, text: 'Dựng phim mạch lạc, lôi cuốn; kết hợp hài hòa cảnh quay thực tế, nhạc nền và lời bình truyền cảm. Lồng ghép khéo léo giải thích khoa học Tinh bột/Cellulose và minh chứng sử dụng thực tế.' },
      { level: 5, points: 1.5, text: 'Video chất lượng cao, sáng tạo (góc quay đa dạng, hiệu ứng/đồ họa trực quan, thông điệp xanh mạnh mẽ). Có sự góp mặt/phối hợp của cả nhóm, truyền cảm hứng sống xanh và có giá trị tuyên truyền cao.' },
    ],
  },
  {
    id: 's6_tea_presentation',
    code: '7',
    stageTag: 'Chặng 4 • Báo cáo tổng kết',
    title: '7. THUYẾT TRÌNH & PHẢN BIỆN KHOA HỌC',
    weightText: 'Trọng số: 10% | Tối đa: 1.0đ',
    maxPoints: 1.0,
    levels: [
      { level: 1, points: 0.2, text: 'Nói nhỏ, phụ thuộc hoàn toàn vào tài liệu đọc (> 90%); trình bày lố giờ > 2 phút. Thiếu phối hợp nhóm; không trả lời được câu hỏi phản biện.' },
      { level: 2, points: 0.4, text: 'Diễn đạt ngập ngừng; có phân chia người nói nhưng chuyển tiếp còn gượng. Chỉ trả lời được các câu hỏi lý thuyết cơ bản, chưa giải thích sâu quy trình.' },
      { level: 3, points: 0.6, text: 'Thuyết trình tự tin, rõ ràng, đúng thời gian quy định; phối hợp nhịp nhàng. Giải thích được cơ sở khoa học và công dụng từng bước trong quy trình.' },
      { level: 4, points: 0.8, text: 'Diễn đạt lưu loát, lôi cuốn; kết hợp ăn ý Poster, sản phẩm mẫu và thuật ngữ tiếng Anh (starch, cellulose...). Phản biện lịch sự, bảo vệ quan điểm bằng dẫn chứng khoa học thuyết phục.' },
      { level: 5, points: 1.0, text: 'Làm chủ sân khấu hoàn toàn, sử dụng song ngữ Anh/Việt tự nhiên; xử lý tình huống linh hoạt. Phản biện sắc sảo bằng số liệu thực nghiệm và đặt câu hỏi phản biện giá trị cho nhóm bạn.' },
    ],
  },
];

export const getStage6RankInfo = (score: number) => {
  if (score >= 9.0) return { label: 'Xuất sắc', colorClass: 'bg-emerald-500 text-white', badge: '🏆 Xuất sắc (9.0 – 10đ)' };
  if (score >= 8.0) return { label: 'Tốt', colorClass: 'bg-blue-500 text-white', badge: '⭐ Tốt (8.0 – 8.9đ)' };
  if (score >= 6.5) return { label: 'Khá', colorClass: 'bg-amber-500 text-white', badge: '👍 Khá (6.5 – 7.9đ)' };
  if (score >= 5.0) return { label: 'Đạt', colorClass: 'bg-orange-500 text-white', badge: '🌱 Đạt (5.0 – 6.4đ)' };
  return { label: 'Cần cố gắng', colorClass: 'bg-rose-500 text-white', badge: '⚡ Cần cố gắng (< 5.0đ)' };
};

