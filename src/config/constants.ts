/**
 * Quiz games configuration.
 * Each key is a simulation ID that requires a GameConfigScreen before starting.
 */
export const QUIZ_GAMES: Record<string, { title: string; description: string; rules: string[] }> = {
  'game-star-race': {
    title: 'Cuộc đua ngôi sao',
    description: 'Đua xe trả lời câu hỏi chia đôi màn hình cho 2 đội cực kỳ kịch tính!',
    rules: [
      'Trò chơi đấu trí dành cho hai đội chơi trên cùng một thiết bị.',
      'Mỗi câu hỏi sẽ hiển thị đồng thời ở hai bên màn hình.',
      'Trả lời đúng giúp xe của đội bạn tiến lên 1 bước và ghi thêm 1 sao ⭐.',
      'Trả lời sai xe sẽ đứng yên hoặc bị tụt lại.',
      'Đội nào cán đích hoặc đạt 10 sao ⭐ trước sẽ giành chiến thắng chung cuộc!'
    ]
  },
  'game-puzzle-flip': {
    title: 'Lật mảnh ghép',
    description: 'Trả lời đúng các câu đố để lật các mảnh ghép bí ẩn hé lộ bức tranh ẩn giấu.',
    rules: [
      'Bức tranh bí ẩn được chia thành nhiều mảnh ghép bị che kín.',
      'Mỗi mảnh ghép tương ứng với một câu hỏi trắc nghiệm.',
      'Chọn một ô mảnh ghép và trả lời câu hỏi để lật mở ô đó.',
      'Sau khi lật mở các vùng tranh, người chơi hãy đoán từ khóa hoặc nội dung bức tranh để hoàn thành thử thách!'
    ]
  },
  'game-keo-co': {
    title: 'Kéo co kiến thức',
    description: '2 đội kéo dây bằng cách trả lời câu hỏi — đội nào kéo sợi dây về phía mình trước thắng! ⚔️',
    rules: [
      'Hai đội chơi Đỏ và Xanh sẽ đấu kéo co bằng trí tuệ.',
      'Nhấn nhanh câu trả lời chính xác cho các câu hỏi xuất hiện.',
      'Trả lời đúng và nhanh hơn sẽ tạo lực kéo sợi dây về phía đội mình.',
      'Trả lời sai sẽ giúp đối phương kéo dây dễ dàng hơn.',
      'Đội nào kéo thành công mốc dây qua vạch giới hạn đỏ sẽ giành chiến thắng!'
    ]
  },
  'game-doi-khang': {
    title: 'Game Đối Kháng',
    description: 'Buzzer 1v1 — ai nhấn trước được trả lời, đội đạt 10 điểm trước chiến thắng! ⚡',
    rules: [
      'Đấu trường buzzer 1v1 trực diện giữa 2 người chơi.',
      'Khi câu hỏi hiển thị, người chơi nhấn nút cướp quyền (Buzzer) thật nhanh.',
      'Ai bấm trước sẽ giành quyền trả lời trong vòng vài giây.',
      'Trả lời đúng được cộng 1 điểm, trả lời sai điểm sẽ được cộng trực tiếp cho đối thủ.',
      'Người đầu tiên giành được 10 điểm sẽ là nhà vô địch!'
    ]
  },
  'game-chem-hoa-qua': {
    title: 'Chém Hoa Quả',
    description: 'Click vào quả cây mang đáp án đúng để ghi điểm — sai mất tim! 🍎',
    rules: [
      'Các loại quả mang các chữ cái đáp án trắc nghiệm (A, B, C, D) bay liên tục trên màn hình.',
      'Đọc câu hỏi và chém (nhấp chuột hoặc vuốt) vào đúng quả mang đáp án chính xác để ghi điểm.',
      'Nếu chém nhầm quả mang đáp án sai hoặc để lỡ quả đúng rơi mất, bạn sẽ bị trừ 1 mạng (tim).',
      'Cố gắng ghi điểm số cao nhất trước khi hết 3 mạng (tim)!'
    ]
  },
  'game-theo-luot': {
    title: 'Game Theo Lượt',
    description: 'Tung xúc xắc, di chuyển trên bàn cờ 25 ô, trả lời câu hỏi để giữ vị trí — 2–4 người chơi! 🎲',
    rules: [
      'Bàn cờ gồm 25 ô số với các chướng ngại vật và câu đố ngẫu nhiên.',
      'Đến lượt của mình, người chơi tung xúc xắc để di chuyển số ô tương ứng.',
      'Trả lời câu hỏi trắc nghiệm tại ô dừng chân: trả lời đúng để giữ vị trí, trả lời sai sẽ phải lùi lại.',
      'Người chơi nào về đích hoặc tích lũy được nhiều điểm nhất khi kết thúc lượt sẽ thắng cuộc!'
    ]
  },
  'game-quiz': {
    title: 'Đố Vui Khoa Học',
    description: 'Trả lời câu hỏi khoa học để kích hoạt siêu năng lực vượt chướng ngại vật! Chọn avatar, 3 mạng, giới hạn thời gian cực kịch tính! 🏆',
    rules: [
      'Nhân vật của bạn sẽ chạy tự động trên đường chạy.',
      'Khi gặp chướng ngại vật, câu hỏi trắc nghiệm sẽ xuất hiện.',
      'Trả lời đúng để kích hoạt kỹ năng nhảy qua hoặc phá hủy chướng ngại vật và tiếp tục chạy.',
      'Trả lời sai hoặc đâm vào chướng ngại vật sẽ làm giảm 1 mạng.',
      'Vượt qua quãng đường dài nhất có thể trước khi mất hết 3 mạng!'
    ]
  },
  'game-crossword': {
    title: 'Giải ô chữ',
    description: 'Hệ thống ô chữ ô chữ liên hoàn thách thức tư duy và vốn kiến thức.',
    rules: [
      'Bảng ô chữ gồm các hàng ngang và một từ khóa chính ở hàng dọc.',
      'Nhấp vào từng hàng ngang để đọc gợi ý và giải câu hỏi tương ứng.',
      'Giải đúng các hàng ngang sẽ dần lộ diện các chữ cái nằm trong từ khóa chính hàng dọc.',
      'Đoán đúng từ khóa chính của ô chữ trước khi hết thời gian quy định!'
    ]
  },
  'game-giai-ma-buc-tranh': {
    title: 'Giải Mã Bức Tranh',
    description: 'Trả lời đúng câu hỏi để mở khóa từng mảnh ghép và khám phá bức tranh bí ẩn đằng sau! 🖼️',
    rules: [
      'Một bức tranh nghệ thuật bí ẩn bị che phủ hoàn toàn.',
      'Mỗi câu hỏi trắc nghiệm tương ứng với một góc của bức tranh.',
      'Trả lời đúng để lật mở góc tranh đó, tiết lộ một phần hình ảnh.',
      'Dựa trên các phần hình ảnh đã mở, hãy suy đoán từ khóa chủ đề đằng sau bức tranh để giành chiến thắng!'
    ]
  },
  'game-ai-la-trieu-phu': {
    title: 'Ai là triệu phú',
    description: 'Trải nghiệm trò chơi trí tuệ mô phỏng chương trình truyền hình nổi tiếng với đầy đủ sự trợ giúp.',
    rules: [
      'Vượt qua chuỗi 15 câu hỏi trắc nghiệm KHTN độ khó tăng dần để giành giải thưởng 150.000.000đ.',
      'Mỗi câu hỏi có 25 giây suy nghĩ.',
      'Ba mốc quan trọng tự động bảo toàn số tiền thưởng: Câu 5, Câu 10, Câu 15.',
      'Bạn có 3 quyền trợ giúp đắc lực: 50-50, Hỏi ý kiến khán giả, và Gọi điện cho người thân.',
      'Có thể chọn dừng cuộc chơi bất cứ lúc nào để bảo toàn số tiền thưởng hiện tại.'
    ]
  },
  'action-quiz-game': {
    title: 'Trắc nghiệm vận động',
    description: 'Vừa học vừa chơi, thực hiện các động tác thể chất vui nhộn theo đáp án.',
    rules: [
      'Học sinh vừa trả lời câu hỏi trắc nghiệm vừa thực hiện các động tác thể chất vui nhộn.',
      'Lựa chọn đáp án đúng để nhân vật của bạn di chuyển, vượt qua chướng ngại vật.',
      'Giúp kết hợp rèn luyện sức khỏe thể chất và tư duy kiến thức tự nhiên.'
    ]
  },
  'world-explorer-game': {
    title: 'Khám phá thế giới',
    description: 'Hành trình thám hiểm vượt chướng ngại vật qua các vùng đất kỳ thú.',
    rules: [
      'Hành trình phiêu lưu qua các vùng đất kỳ thú trên bản đồ tự nhiên.',
      'Mỗi địa điểm dừng chân sẽ đưa ra những thử thách kiến thức khác nhau.',
      'Trả lời đúng để giúp đoàn thám hiểm tiến sâu hơn vào bản đồ và khám phá các bí ẩn sinh thái!'
    ]
  }
};

/**
 * List of simulation IDs that are games/apps and should navigate directly to lesson view.
 * Used by both handleSelectSub and handleHotToolClick.
 */
export const GAMES_AND_APPS = [
  'game-action-quiz', 'phieu-bai-hoc', 'mindmap-app', 'game-world-explorer',
  'game-duck-race', 'game-hub', 'game-star-race', 'game-puzzle-flip',
  'game-spin-wheel', 'game-keo-co', 'game-doi-khang', 'game-chem-hoa-qua',
  'game-theo-luot', 'game-quiz', 'game-crossword', 'game-giai-ma-buc-tranh',
  'game-dai-duong-ma-thuat', 'game-ai-la-trieu-phu'
];

/**
 * Maps subcategory IDs to their target simulation IDs for direct navigation.
 */
const SUB_ID_TO_SIM_ID: Record<string, string> = {
  'game-action-quiz': 'action-quiz-game',
  'game-world-explorer': 'world-explorer-game',
  'game-duck-race': 'duck-race-game',
};

/**
 * Resolves a subcategory ID to the target simulation ID for navigation.
 * Returns null if the sub should navigate to subcategory view instead.
 */
export function resolveSimulationId(subId: string): string | null {
  if (SUB_ID_TO_SIM_ID[subId]) return SUB_ID_TO_SIM_ID[subId];
  if (GAMES_AND_APPS.includes(subId)) return subId;
  return null;
}

/**
 * AI tool group filter configuration.
 */
export const AI_GROUPS = [
  { id: 'all', name: 'Tất cả' },
  { id: 'chatbot', name: 'Trò chuyện & Hỏi đáp' },
  { id: 'presentation', name: 'Thuyết trình & Đồ họa' },
  { id: 'programming', name: 'Hỗ trợ lập trình' },
  { id: 'table', name: 'Bảng biểu & Trực quan' },
  { id: 'image', name: 'Tạo ảnh nghệ thuật' },
  { id: 'video', name: 'Video & Âm thanh' },
  { id: 'email', name: 'Email & Tự động hóa' },
  { id: 'planning', name: 'Lập kế hoạch & Tri thức' },
  { id: 'education', name: 'Học tập & Đánh giá' },
  { id: 'check-ai', name: 'Phát hiện AI (AI Detector)' },
  { id: 'research', name: 'Nghiên cứu & Chuyên môn' }
];
