import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Info, Leaf, Egg, Dna, Check, X, Award, HelpCircle, 
  RefreshCw, Scale, BookOpen, ChevronRight, Maximize2, Minimize2,
  Sparkles, CheckCircle2, AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ----------------------------------------------------
// DỮ LIỆU CẤU TẠO CHI TIẾT CỦA CÁC LOẠI TẾ BÀO
// ----------------------------------------------------
interface OrganelleDetail {
  id: string;
  name: string;
  engName?: string;
  color: string;
  desc: string;
  function: string;
  fact: string;
}

const CELL_STRUCTURES: Record<'prokaryotic' | 'animal' | 'plant', {
  title: string;
  subTitle: string;
  generalDesc: string;
  sketchfabUrl: string;
  parts: OrganelleDetail[];
}> = {
  prokaryotic: {
    title: "Tế bào Nhân Sơ",
    subTitle: "Điển hình: Tế bào Vi khuẩn (Bacteria)",
    generalDesc: "Tế bào nhân sơ có cấu trúc đơn giản, kích thước nhỏ (khoảng 1 - 5 µm), chưa có nhân hoàn chỉnh (chỉ có vùng nhân chứa DNA vòng kép) và không có các bào quan có màng bao bọc trong tế bào chất.",
    sketchfabUrl: "https://sketchfab.com/models/f010ea6bb2c840759b12de4545322870/embed?autostart=1&preload=1&ui_theme=dark&ui_hint=0",
    parts: [
      {
        id: "nucleoid",
        name: "Vùng nhân",
        engName: "Nucleoid",
        color: "#fb7185", // rose-400
        desc: "Khu vực chứa vật chất di truyền chính của vi khuẩn. Khác với tế bào nhân thực, vùng nhân ở đây không có màng nhân bao bọc xung quanh.",
        function: "Chứa phân tử DNA vòng kép, lưu trữ và truyền đạt thông tin di truyền điều khiển mọi hoạt động sống của tế bào.",
        fact: "Vì không có màng ngăn cách, DNA tiếp xúc trực tiếp với tế bào chất giúp quá trình nhân đôi và phiên mã diễn ra cực kỳ nhanh chóng."
      },
      {
        id: "plasmid",
        name: "Plasmid",
        engName: "Plasmid",
        color: "#f472b6", // pink-400
        desc: "Các phân tử DNA vòng nhỏ, nằm độc lập ngoài vùng nhân trong tế bào chất.",
        function: "Mang các gene phụ trợ hữu ích cho vi khuẩn, ví dụ như gene kháng thuốc kháng sinh hoặc gene phân hủy các chất độc hại.",
        fact: "Vi khuẩn có thể truyền các plasmid này cho nhau qua quá trình tiếp hợp, truyền khả năng kháng thuốc cho đồng loại."
      },
      {
        id: "ribosome",
        name: "Ribosome 70S",
        engName: "Ribosome",
        color: "#fb923c", // orange-400
        desc: "Bào quan nhỏ không có màng bao bọc, rải rác khắp tế bào chất. Ở tế bào nhân sơ, ribosome có kích thước 70S (nhỏ hơn ribosome 80S của nhân thực).",
        function: "Là nơi tổng hợp protein dựa trên thông tin mã hóa từ mRNA.",
        fact: "Ribosome là bào quan duy nhất mà cả tế bào nhân sơ và tế bào nhân thực đều sở hữu chung."
      },
      {
        id: "cytoplasm",
        name: "Tế bào chất",
        engName: "Cytoplasm",
        color: "#38bdf8", // sky-400
        desc: "Vùng dịch keo lỏng (bào tương) nằm bên trong màng sinh chất, chứa các bào quan, chất dinh dưỡng, ion và enzyme.",
        function: "Là môi trường diễn ra mọi hoạt động trao đổi chất, phản ứng hóa sinh của tế bào vi khuẩn.",
        fact: "Tế bào chất ở tế bào nhân sơ hoàn toàn không có hệ thống nội màng hay các bộ khung tế bào phức tạp."
      },
      {
        id: "cell_membrane",
        name: "Màng sinh chất",
        engName: "Plasma Membrane",
        color: "#2dd4bf", // teal-400
        desc: "Lớp màng kép phospholipid khảm các phân tử protein, bao bọc trực tiếp lấy tế bào chất.",
        function: "Kiểm soát quá trình vận chuyển chọn lọc các chất vào/ra tế bào; đồng thời là nơi diễn ra hô hấp và quang hợp (ở một số loài vi khuẩn).",
        fact: "Ở vi khuẩn, màng sinh chất có thể gấp nếp tạo thành cấu trúc mêzôxôm hỗ trợ quá trình phân chia tế bào."
      },
      {
        id: "cell_wall",
        name: "Vách tế bào",
        engName: "Cell Wall",
        color: "#4ade80", // green-400
        desc: "Lớp vỏ bảo vệ cứng cáp nằm bên ngoài màng sinh chất, được cấu tạo chủ yếu từ peptidoglycan.",
        function: "Quy định hình dạng đặc trưng của tế bào (hình cầu, hình que, hình xoắn) và bảo vệ tế bào khỏi bị vỡ do áp suất thẩm thấu.",
        fact: "Dựa vào độ dày mỏng và cấu trúc của vách peptidoglycan, người ta chia vi khuẩn làm 2 nhóm: Gram dương (vách dày) và Gram âm (vách mỏng)."
      },
      {
        id: "capsule",
        name: "Vỏ nhầy",
        engName: "Capsule",
        color: "#a78bfa", // violet-400
        desc: "Lớp vỏ chất nhầy dính (polysaccharide) bao bọc bên ngoài vách tế bào ở một số loài vi khuẩn.",
        function: "Giúp vi khuẩn bám dính vào bề mặt vật chủ, chống chịu khô hạn và giúp vi khuẩn lẩn trốn sự thực bào từ hệ miễn dịch vật chủ.",
        fact: "Những vi khuẩn có vỏ nhầy thường có độc lực cao hơn và dễ gây bệnh nguy hiểm hơn."
      },
      {
        id: "flagella",
        name: "Roi nhầy",
        engName: "Flagellum",
        color: "#facc15", // yellow-400
        desc: "Cấu trúc dạng sợi dài, mảnh, cấu tạo từ protein flagellin bọc ngoài tế bào chất.",
        function: "Quay tròn như động cơ chân vịt giúp vi khuẩn di chuyển linh hoạt trong môi trường lỏng.",
        fact: "Tốc độ di chuyển của vi khuẩn nhờ roi có thể đạt tới 50-60 lần chiều dài cơ thể của chúng trong mỗi giây."
      },
      {
        id: "pili",
        name: "Lông (Nhung mao)",
        engName: "Pili / Fimbriae",
        color: "#94a3b8", // slate-400
        desc: "Những sợi lông ngắn và mảnh hơn roi, mọc ra từ vách tế bào vi khuẩn.",
        function: "Giúp vi khuẩn bám chắc vào các bề mặt tế bào vật chủ hoặc kết cặp với nhau để truyền DNA (plasmid) qua cầu tiếp hợp.",
        fact: "Lông giới tính (sex pili) là công cụ chính giúp vi khuẩn 'giao phối' và truyền gene kháng thuốc cho nhau."
      }
    ]
  },
  animal: {
    title: "Tế bào Động vật",
    subTitle: "Tế bào Nhân thực (Eukaryotic Cell)",
    generalDesc: "Tế bào động vật có kích thước trung bình (10 - 30 µm), có nhân hoàn chỉnh được bao bọc bởi màng nhân kép và chứa nhiều bào quan có màng ngăn chia tế bào thành các phân khu chức năng riêng biệt.",
    sketchfabUrl: "https://sketchfab.com/models/b7c3eb09beab49e4a4a250d08b331c20/embed?autostart=1&preload=1&ui_theme=dark&ui_hint=0",
    parts: [
      {
        id: "nucleus",
        name: "Nhân tế bào",
        engName: "Nucleus",
        color: "#a78bfa", // violet-400
        desc: "Bào quan lớn nhất và quan trọng nhất, hình cầu, được bao bọc bởi màng nhân kép có chứa các lỗ nhân.",
        function: "Lưu giữ toàn bộ vật chất di truyền (DNA dạng nhiễm sắc thể), điều khiển và điều hòa mọi hoạt động sống của tế bào.",
        fact: "Bên trong nhân có nhân con (hạch nhân) - nơi chịu trách nhiệm tổng hợp các phân tử RNA ribosome (rRNA)."
      },
      {
        id: "mitochondria",
        name: "Ty thể",
        engName: "Mitochondria",
        color: "#fb923c", // orange-400
        desc: "Được mệnh danh là 'nhà máy năng lượng' của tế bào, có màng kép: màng ngoài trơn nhẵn, màng trong gấp nếp thành các mào chứa enzyme hô hấp.",
        function: "Thực hiện hô hấp tế bào, chuyển hóa các chất hữu cơ (glucose) thành năng lượng ATP phục vụ cho mọi hoạt động của tế bào.",
        fact: "Ty thể chứa DNA và ribosome riêng, có khả năng tự nhân đôi độc lập với sự phân chia của tế bào."
      },
      {
        id: "golgi",
        name: "Bộ máy Golgi",
        engName: "Golgi Apparatus",
        color: "#60a5fa", // blue-400
        desc: "Hệ thống các túi dẹt màng xếp song song nhau nhưng không thông nhau.",
        function: "Tiếp nhận, sửa đổi cấu trúc hóa học, phân loại, đóng gói và vận chuyển các sản phẩm protein/lipid được tổng hợp từ lưới nội chất đến các nơi cần thiết.",
        fact: "Bộ máy Golgi hoạt động giống như một trung tâm bưu điện hoặc nhà ga logistics cực kỳ hiện đại trong tế bào."
      },
      {
        id: "rough_er",
        name: "Lưới nội chất hạt",
        engName: "Rough Endoplasmic Reticulum",
        color: "#f472b6", // pink-400
        desc: "Hệ thống màng ống và túi dẹt thông với màng nhân, bề mặt có đính rất nhiều hạt ribosome nhỏ.",
        function: "Tham gia tổng hợp các loại protein xuất bào (tiết ra ngoài) hoặc protein cấu tạo nên màng tế bào.",
        fact: "Các tế bào bạch cầu sản sinh kháng thể có hệ thống lưới nội chất hạt cực kỳ phát triển để sản xuất kháng thể hàng loạt."
      },
      {
        id: "smooth_er",
        name: "Lưới nội chất trơn",
        engName: "Smooth Endoplasmic Reticulum",
        color: "#ec4899", // pink-500
        desc: "Hệ thống màng ống liên tục với lưới nội chất hạt, tuy nhiên bề mặt trơn nhẵn, không chứa ribosome.",
        function: "Tổng hợp các chất lipid, chuyển hóa carbohydrate và thực hiện chức năng khử độc (giải độc chất hóa học, thuốc lá, rượu).",
        fact: "Tế bào gan của con người chứa lượng lưới nội chất trơn khổng lồ để lọc sạch và đào thải chất độc khỏi cơ thể."
      },
      {
        id: "lysosome",
        name: "Tiêu thể",
        engName: "Lysosome",
        color: "#facc15", // yellow-400
        desc: "Dạng túi nhỏ một lớp màng bao bọc, chứa hàm lượng lớn enzyme thủy phân phân giải mạnh mẽ.",
        function: "Tiêu hóa thức ăn nội bào, phân hủy các bào quan già cỗi bị hỏng, và tiêu diệt các tác nhân xâm nhập có hại như vi khuẩn.",
        fact: "Nếu tiêu thể bị vỡ ra hàng loạt, các enzyme giải phóng sẽ tự tiêu hủy chính tế bào đó, một quá trình gọi là 'tự thực tế bào'."
      },
      {
        id: "centrosome",
        name: "Trung thể",
        engName: "Centrosome",
        color: "#2dd4bf", // teal-400
        desc: "Bào quan không có màng ngăn, cấu tạo từ hai trung tử xếp vuông góc với nhau và vùng chất quanh trung tử.",
        function: "Hình thành nên thoi vô sắc (thoi phân bào) giúp kéo các nhiễm sắc thể về hai cực trong quá trình phân chia tế bào.",
        fact: "Tế bào thực vật bậc cao hoàn toàn không có trung thể nhưng vẫn phân chia bình thường nhờ hệ thống vi ống tự sắp xếp."
      },
      {
        id: "cell_membrane",
        name: "Màng sinh chất",
        engName: "Plasma Membrane",
        color: "#34d399", // emerald-400
        desc: "Lớp màng kép lipid khảm protein, bao quanh tế bào, đóng vai trò ranh giới sống của tế bào.",
        function: "Kiểm soát dòng vật chất ra vào tế bào một cách chọn lọc, trao đổi thông tin và nhận diện tế bào lân cận.",
        fact: "Màng tế bào động vật còn có các phân tử cholesterol xen kẽ giúp giữ độ ổn định và tính linh động của màng ở các nhiệt độ khác nhau."
      }
    ]
  },
  plant: {
    title: "Tế bào Thực vật",
    subTitle: "Tế bào Nhân thực (Eukaryotic Cell)",
    generalDesc: "Tế bào thực vật có kích thước lớn (10 - 100 µm), có nhân hoàn chỉnh và sở hữu 3 cấu trúc đặc biệt khác với tế bào động vật: vách tế bào cellulose cứng cáp, lục lạp thực hiện quang hợp và không bào trung tâm khổng lồ.",
    sketchfabUrl: "https://sketchfab.com/models/b6ae11c611b44e0991d08f8c5a0bf3c7/embed?autostart=1&preload=1&ui_theme=dark&ui_hint=0",
    parts: [
      {
        id: "cell_wall",
        name: "Vách tế bào",
        engName: "Cell Wall",
        color: "#22c55e", // green-500
        desc: "Lớp vách cứng bao bọc ngoài màng sinh chất, cấu tạo chủ yếu từ các sợi cellulose liên kết chặt chẽ.",
        function: "Tạo khung nâng đỡ vững chắc, định hình hình dạng tế bào thực vật (thường có góc cạnh) và bảo vệ tế bào.",
        fact: "Vách tế bào chính là thành phần tạo nên chất gỗ dẻo dai giúp thân cây có thể đứng cao và vươn thẳng đón ánh sáng mặt trời."
      },
      {
        id: "chloroplast",
        name: "Lục lạp",
        engName: "Chloroplast",
        color: "#4ade80", // green-400
        desc: "Bào quan hình bầu dục chứa nhiều túi dẹt thylakoid xếp chồng (grana) nằm trong chất nền stroma. Chứa chất diệp lục hấp thu ánh sáng.",
        function: "Nơi diễn ra quá trình quang hợp: hấp thụ ánh sáng mặt trời để tổng hợp chất hữu cơ (glucose) từ khí CO2 và H2O.",
        fact: "Lục lạp cung cấp oxy và hầu hết nguồn thức ăn hữu cơ cho toàn bộ sự sống trên Trái Đất thông qua chuỗi thức ăn."
      },
      {
        id: "vacuole",
        name: "Không bào trung tâm",
        engName: "Central Vacuole",
        color: "#38bdf8", // sky-400
        desc: "Một túi màng đơn lớn nằm ở trung tâm tế bào thực vật trưởng thành, có thể chiếm tới 90% thể tích tế bào.",
        function: "Tích trữ nước, chất dinh dưỡng, muối khoáng, chất thải; duy trì áp suất thẩm thấu tạo lực trương nước giúp tế bào luôn căng và nâng đỡ cây non.",
        fact: "Khi cây thiếu nước, không bào trung tâm bị xẹp xuống làm tế bào mất sức trương, dẫn đến hiện tượng cây bị héo úa."
      },
      {
        id: "nucleus",
        name: "Nhân tế bào",
        engName: "Nucleus",
        color: "#a78bfa", // violet-400
        desc: "Trung tâm điều khiển chứa DNA được bọc trong màng nhân kép. Thường bị đẩy lệch về một phía do không bào trung tâm quá lớn.",
        function: "Chứa hệ gene, điều phối các hoạt động phát triển, phân chia và trao đổi chất của tế bào.",
        fact: "Tương tự như tế bào động vật, nhân thực vật chứa các nhiễm sắc thể chứa thông tin di truyền dưới dạng DNA."
      },
      {
        id: "mitochondria",
        name: "Ty thể",
        engName: "Mitochondria",
        color: "#fb923c", // orange-400
        desc: "Bào quan hô hấp màng kép, chuyển hóa năng lượng hóa học thành năng lượng ATP.",
        function: "Nơi diễn ra quá trình hô hấp tế bào để cung cấp ATP cần thiết cho sự nảy mầm, sinh trưởng và ra hoa của cây.",
        fact: "Nhiều người lầm tưởng thực vật chỉ quang hợp mà không hô hấp. Thực chất, thực vật hô hấp liên tục cả ngày lẫn đêm nhờ ty thể."
      },
      {
        id: "golgi",
        name: "Bộ máy Golgi",
        engName: "Golgi Apparatus",
        color: "#60a5fa", // blue-400
        desc: "Các đĩa màng dẹt xếp chồng hỗ trợ quá trình chế biến và bài tiết các chất.",
        function: "Đóng gói, phân phối protein và tổng hợp các polysaccharide phức tạp (như pectin, hemicellulose) cấu tạo nên vách tế bào mới.",
        fact: "Trong tế bào thực vật, bộ máy Golgi còn được gọi là Dictyosome."
      },
      {
        id: "er",
        name: "Lưới nội chất",
        engName: "Endoplasmic Reticulum",
        color: "#f472b6", // pink-400
        desc: "Mạng lưới màng nội bào phân nhánh nối liền màng nhân với màng sinh chất.",
        function: "Tổng hợp các chất hữu cơ như protein và lipid, đồng thời là hệ thống kênh vận chuyển các chất bên trong tế bào.",
        fact: "Hệ thống lưới nội chất liên kết chặt chẽ với các cầu sinh chất (plasmodesmata) tạo thành mạng lưới giao thông liên tế bào."
      }
    ]
  }
};

// ----------------------------------------------------
// DỮ LIỆU CÂU HỎI TRẮC NGHIỆM CHO TỪNG LOẠI TẾ BÀO
// ----------------------------------------------------
interface Question {
  question: string;
  options: string[];
  answer: number; // Index của đáp án đúng
  explain: string;
}

const QUIZ_QUESTIONS: Record<'prokaryotic' | 'animal' | 'plant', Question[]> = {
  prokaryotic: [
    {
      question: "Thành phần cấu tạo hóa học chính của vách tế bào vi khuẩn (nhân sơ) là chất nào sau đây?",
      options: ["Cellulose", "Peptidoglycan", "Chitin", "Phospholipid"],
      answer: 1,
      explain: "Vách tế bào nhân sơ cấu tạo chính từ peptidoglycan. Trong khi đó, cellulose là thành phần vách tế bào thực vật."
    },
    {
      question: "Vùng nhân của tế bào nhân sơ có đặc điểm gì đặc biệt?",
      options: [
        "Có màng nhân kép bao bọc bên ngoài",
        "Có chứa nhiều nhân con bên trong",
        "Chỉ chứa một phân tử DNA vòng kép và chưa có màng nhân",
        "Chứa các nhiễm sắc thể thẳng và dẹt"
      ],
      answer: 2,
      explain: "Tế bào nhân sơ chưa có nhân hoàn chỉnh, vật chất di truyền của nó chỉ là một phân tử DNA vòng kép trần nằm tự do trong tế bào chất, gọi là vùng nhân."
    },
    {
      question: "Cấu trúc nào của vi khuẩn thường chứa các gene kháng thuốc kháng sinh và có thể chuyển giao giữa các tế bào?",
      options: ["Plasmid", "Vùng nhân", "Ribosome", "Vỏ nhầy"],
      answer: 0,
      explain: "Plasmid là các phân tử DNA vòng kép nhỏ nằm ngoài vùng nhân, thường mang gene có lợi phụ trợ như gene kháng thuốc kháng sinh."
    },
    {
      question: "Bào quan duy nhất có mặt ở cả tế bào nhân sơ và tế bào nhân thực là gì?",
      options: ["Ty thể", "Bộ máy Golgi", "Lưới nội chất", "Ribosome"],
      answer: 3,
      explain: "Ribosome là bào quan không có màng bao bọc chịu trách nhiệm tổng hợp protein, hiện diện ở tất cả các loại tế bào từ nhân sơ đến nhân thực."
    },
    {
      question: "Lông (Pili) ở vi khuẩn có chức năng chủ yếu là gì?",
      options: [
        "Giúp vi khuẩn bơi lội nhanh trong nước",
        "Bám dính vào bề mặt chủ và trao đổi vật chất di truyền",
        "Quang hợp tổng hợp đường",
        "Bảo vệ vi khuẩn khỏi nhiệt độ cao"
      ],
      answer: 1,
      explain: "Lông (nhung mao/pili) giúp vi khuẩn bám vào bề mặt vật chủ để gây bệnh, và lông giới tính hỗ trợ tiếp hợp truyền DNA cho vi khuẩn khác."
    }
  ],
  animal: [
    {
      question: "Bào quan nào được ví là 'nhà máy năng lượng' giải phóng ATP cho tế bào động vật?",
      options: ["Nhân tế bào", "Bộ máy Golgi", "Ty thể", "Tiêu thể"],
      answer: 2,
      explain: "Ty thể thực hiện quá trình hô hấp tế bào để phân giải các chất hữu cơ giải phóng năng lượng ATP cung cấp cho toàn bộ hoạt động sống."
    },
    {
      question: "Tế bào động vật KHÔNG có bào quan hoặc cấu trúc nào dưới đây?",
      options: ["Vách tế bào & Lục lạp", "Màng sinh chất & Ty thể", "Nhân tế bào & Ribosome", "Bộ máy Golgi & Trung thể"],
      answer: 0,
      explain: "Tế bào động vật không có vách tế bào (nên hình dạng mềm dẻo) và không có lục lạp (không có khả năng tự quang hợp chế tạo chất hữu cơ)."
    },
    {
      question: "Bào quan nào chứa enzyme thủy phân mạnh mẽ chịu trách nhiệm phân hủy chất thải và bào quan già cỗi?",
      options: ["Lưới nội chất trơn", "Tiêu thể (Lysosome)", "Trung thể", "Ribosome"],
      answer: 1,
      explain: "Tiêu thể (lysosome) chứa nhiều enzyme tiêu hóa dùng để phân hủy các chất hữu cơ dư thừa, vi khuẩn xâm nhập hoặc bào quan bị tổn thương."
    },
    {
      question: "Cấu trúc nào điều khiển và điều phối mọi hoạt động sống bên trong tế bào động vật?",
      options: ["Màng tế bào", "Tế bào chất", "Nhân tế bào", "Trung thể"],
      answer: 2,
      explain: "Nhân tế bào chứa vật chất di truyền (DNA) - nơi lưu trữ toàn bộ mật mã điều khiển sự tổng hợp protein và các hoạt động sống của tế bào."
    },
    {
      question: "Trong tế bào động vật, trung thể có vai trò cốt lõi trong quá trình nào?",
      options: ["Tổng hợp lipid", "Giải độc tế bào", "Phân chia tế bào (hình thành thoi vô sắc)", "Hô hấp tế bào tạo năng lượng"],
      answer: 2,
      explain: "Trung thể chứa hai trung tử, chịu trách nhiệm hình thành thoi phân bào để phân chia đồng đều nhiễm sắc thể về hai cực tế bào trong phân bào."
    }
  ],
  plant: [
    {
      question: "Thành phần tạo nên sự cứng cáp, bền vững giúp cây đứng thẳng và giữ được hình dạng tế bào thực vật là:",
      options: ["Lớp vỏ nhầy peptidoglycan", "Màng sinh chất", "Vách tế bào cấu tạo từ cellulose", "Chất nền ngoại bào"],
      answer: 2,
      explain: "Vách tế bào thực vật được tạo thành từ cellulose dai chắc, giúp bảo vệ tế bào và làm giá đỡ cho cây đứng thẳng."
    },
    {
      question: "Bào quan nào có màu xanh lục, thực hiện vai trò hấp thụ ánh sáng để tổng hợp đường nuôi sống cây?",
      options: ["Không bào trung tâm", "Lục lạp", "Ty thể", "Bộ máy Golgi"],
      answer: 1,
      explain: "Lục lạp chứa chất diệp lục có khả năng chuyển hóa năng lượng ánh sáng thành năng lượng hóa học trong phân tử đường (quang hợp)."
    },
    {
      question: "Khi cây bị thiếu nước, hiện tượng héo lá xảy ra do sự suy giảm áp suất trương tại bào quan nào?",
      options: ["Nhân tế bào", "Ty thể", "Không bào trung tâm", "Lục lạp"],
      answer: 2,
      explain: "Không bào trung tâm chứa dịch tế bào, khi đủ nước nó phồng to tạo áp suất trương nước giữ cây cứng cáp. Thiếu nước không bào xẹp lại làm tế bào co nguyên sinh, cây bị héo."
    },
    {
      question: "Nhận định nào sau đây là ĐÚNG về quá trình năng lượng trong tế bào thực vật?",
      options: [
        "Thực vật chỉ có lục lạp để tạo đường, không cần ty thể.",
        "Thực vật có cả lục lạp để quang hợp và ty thể để hô hấp tạo ATP.",
        "Ty thể ở thực vật có thể quang hợp khi không có ánh sáng mặt trời.",
        "Lục lạp tự phân hủy chất độc tương tự tiêu thể ở động vật."
      ],
      answer: 1,
      explain: "Thực vật cần lục lạp để tạo ra chất dinh dưỡng (quang hợp) và ty thể để hô hấp phân giải chất dinh dưỡng đó giải phóng ATP hoạt động."
    },
    {
      question: "Bào quan nào ở thực vật chịu trách nhiệm chính trong việc chế biến, đóng gói protein và tổng hợp vật liệu xây dựng vách tế bào (pectin, hemicellulose)?",
      options: ["Lưới nội chất hạt", "Bộ máy Golgi", "Không bào", "Lục lạp"],
      answer: 1,
      explain: "Bộ máy Golgi (hay dictyosome ở thực vật) thu nhận protein cấu trúc, hoàn thiện chúng và tổng hợp các chuỗi đường phức để tạo vách tế bào mới."
    }
  ]
};

// ----------------------------------------------------
// TÌM HIỂU BẢNG SO SÁNH GIỮA CÁC TẾ BÀO
// ----------------------------------------------------
const COMPARISONS = {
  proVsEu: [
    { criteria: "Kích thước tế bào", pro: "Nhỏ (1 - 5 µm)", eu: "Lớn hơn rất nhiều (10 - 100 µm)" },
    { criteria: "Nhân tế bào", pro: "Chưa có màng nhân (chỉ có vùng nhân chứa DNA vòng kép trần)", eu: "Có nhân hoàn chỉnh với màng nhân kép bao bọc" },
    { criteria: "Bào quan có màng", pro: "Không có", eu: "Có nhiều bào quan phức tạp (ty thể, lục lạp, lưới nội chất, bộ máy Golgi, v.v.)" },
    { criteria: "Thành phần vách tế bào", pro: "Cấu tạo từ peptidoglycan", eu: "Thực vật có vách cellulose; động vật không có" },
    { criteria: "Ribosome", pro: "Ribosome 70S (kích thước nhỏ)", eu: "Ribosome 80S trong tế bào chất (kích thước lớn hơn)" },
    { criteria: "Phân chia tế bào", pro: "Trực phân (phân đôi đơn giản)", eu: "Nguyên phân và giảm phân phức tạp có thoi phân bào" }
  ],
  aniVsPla: [
    { criteria: "Vách tế bào", animal: "Không có (tế bào mềm dẻo, hình dạng không cố định)", plant: "Có vách cấu tạo từ cellulose (tế bào cứng cáp, hình đa giác ổn định)" },
    { criteria: "Lục lạp (Quang hợp)", animal: "Không có (dinh dưỡng dị dưỡng)", plant: "Có chứa diệp lục (dinh dưỡng tự dưỡng quang hợp)" },
    { criteria: "Không bào", animal: "Không có hoặc có nhiều không bào kích thước rất nhỏ", plant: "Có một không bào trung tâm khổng lồ chứa dịch tế bào" },
    { criteria: "Trung thể", animal: "Có trung thể tham gia tạo thoi phân bào", plant: "Không có ở thực vật bậc cao (vẫn phân chia nhờ vi ống)" },
    { criteria: "Chất dự trữ chính", animal: "Glycogen và lipid", plant: "Tinh bột và dầu thực vật" },
    { criteria: "Tiêu thể", animal: "Có tiêu thể phát triển để phân giải chất", plant: "Hiếm gặp (không bào trung tâm đảm nhận một số vai trò phân hủy)" }
  ]
};

export function TeBaoSimulation({ onBack }: { onBack: () => void }) {
  const [cellType, setCellType] = useState<'prokaryotic' | 'animal' | 'plant'>('prokaryotic');
  const [activeTab, setActiveTab] = useState<'structure' | 'compare' | 'quiz'>('structure');
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  
  // Trạng thái load IFrame
  const [iframeLoading, setIframeLoading] = useState(true);
  
  // Trạng thái phóng to iframe
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Trạng thái Quiz
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);

  const activeCellData = CELL_STRUCTURES[cellType];
  const questions = QUIZ_QUESTIONS[cellType];

  // Reset states khi chuyển đổi loại tế bào
  useEffect(() => {
    setIframeLoading(true);
    setSelectedPart(null);
    resetQuiz();
    
    // Tự động chọn phần tử đầu tiên của tế bào mới
    if (activeCellData.parts.length > 0) {
      setSelectedPart(activeCellData.parts[0].id);
    }
  }, [cellType]);

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowQuizResult(false);
  };

  const handleAnswerClick = (optionIdx: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIdx);
    setIsAnswered(true);
    
    const isCorrect = optionIdx === questions[currentQuestionIdx].answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowQuizResult(true);
      if (score + (selectedOption === questions[currentQuestionIdx].answer ? 1 : 0) === questions.length) {
        // Bắn pháo hoa ăn mừng khi đạt điểm tuyệt đối
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }
  };

  // Mẹo khoa học hiển thị khi IFrame đang tải
  const getTip = () => {
    if (cellType === 'prokaryotic') {
      return "Mách nhỏ: Tế bào vi khuẩn nhân sơ nhân đôi rất nhanh, một số loài có thể nhân đôi chỉ sau 20 phút!";
    } else if (cellType === 'animal') {
      return "Mách nhỏ: Cơ thể người chứa khoảng 30 nghìn tỷ tế bào động vật hoạt động không ngừng nghỉ.";
    } else {
      return "Mách nhỏ: Diệp lục trong lục lạp tế bào thực vật phản xạ ánh sáng xanh lá nên chúng ta thấy lá có màu xanh.";
    }
  };

  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col font-sans text-slate-100 overflow-hidden">
      
      {/* HEADER */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-6 z-10 shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm md:text-base font-black text-white tracking-tight uppercase flex items-center gap-2">
              <Dna className="w-5 h-5 text-indigo-400 animate-pulse" />
              Mô Phỏng Tế Bào 3D
            </h1>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Khoa học tự nhiên lớp 6 & Lớp 8
            </p>
          </div>
        </div>

        {/* BỘ CHỌN LOẠI TẾ BÀO */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-2xl shadow-inner max-md:scale-90 origin-right">
          <button
            onClick={() => setCellType('prokaryotic')}
            className={`px-3 py-1.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              cellType === 'prokaryotic' 
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-900/30' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Nhân Sơ
          </button>
          
          <button
            onClick={() => setCellType('animal')}
            className={`px-3 py-1.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              cellType === 'animal' 
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-pink-900/30' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Egg className="w-3.5 h-3.5" /> Động Vật
          </button>
          
          <button
            onClick={() => setCellType('plant')}
            className={`px-3 py-1.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              cellType === 'plant' 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/30' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" /> Thực Vật
          </button>
        </div>
      </header>

      {/* CONTAINER CHÍNH */}
      <div className="flex-1 relative flex flex-col lg:flex-row overflow-hidden">
        
        {/* KHU VỰC HIỂN THỊ MÔ HÌNH 3D (Bên trái) */}
        <div className={`relative bg-slate-900 transition-all duration-300 flex flex-col ${
          isFullscreen ? 'w-full h-full absolute inset-0 z-50' : 'flex-1 h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-slate-800'
        }`}>
          {/* Nút Phóng to / Thu nhỏ mô hình */}
          <button
            onClick={() => setIsFullscreen(prev => !prev)}
            className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition-all shadow-md cursor-pointer"
            title={isFullscreen ? "Thu nhỏ giao diện" : "Xem toàn màn hình mô hình"}
          >
            {isFullscreen ? <Minimize2 className="w-4.5 h-4.5" /> : <Maximize2 className="w-4.5 h-4.5" />}
          </button>

          {/* Nút Reload Iframe */}
          <button
            onClick={() => {
              setIframeLoading(true);
              const frame = document.getElementById('sketchfab-frame') as HTMLIFrameElement;
              if (frame) frame.src = frame.src;
            }}
            className="absolute top-4 right-16 z-30 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition-all shadow-md cursor-pointer"
            title="Tải lại mô hình 3D"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>

          {/* Loading Indicator */}
          {iframeLoading && (
            <div className="absolute inset-0 bg-slate-950/95 z-20 flex flex-col items-center justify-center p-6 text-center">
              <div className="relative w-20 h-20 mb-6">
                <div className="w-full h-full rounded-full border-[3px] border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                <Dna className="w-8 h-8 text-indigo-400 absolute inset-0 m-auto animate-bounce" />
              </div>
              <h3 className="text-base font-extrabold text-white mb-2">Đang nạp mô hình 3D tương tác...</h3>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">{getTip()}</p>
            </div>
          )}

          {/* Nút Hướng Dẫn Tương Tác */}
          <div className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1.5 shadow-md pointer-events-none">
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>Kéo chuột để xoay 3D • Cuộn chuột để Thu phóng mô hình</span>
          </div>

          {/* Nhãn loại tế bào nổi */}
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-bold text-slate-200">
            <span className="text-[10px] text-slate-400 font-normal uppercase block tracking-wider">Mô hình nhúng</span>
            {activeCellData.title} 3D
          </div>

          {/* IFrame Sketchfab */}
          <div className="w-full flex-1 relative bg-slate-950">
            <iframe
              id="sketchfab-frame"
              title={activeCellData.title}
              src={activeCellData.sketchfabUrl}
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen; xr-spatial-tracking"
              onLoad={() => {
                // Thêm thời gian đệm nhỏ cho mượt mà
                setTimeout(() => setIframeLoading(false), 850);
              }}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* BẢNG TƯƠNG TÁC THÔNG TIN (Bên phải) */}
        <div className="w-full lg:w-96 bg-slate-900/95 border-t lg:border-t-0 border-slate-800 flex flex-col shadow-2xl z-20 shrink-0 h-1/2 lg:h-full">
          
          {/* CÁC TAB CHỌN CHỨC NĂNG */}
          <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-1">
            <button
              onClick={() => setActiveTab('structure')}
              className={`flex-1 py-2 px-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'structure' 
                  ? 'bg-slate-800 text-white border border-slate-700/50 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Cấu Tạo
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`flex-1 py-2 px-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'compare' 
                  ? 'bg-slate-800 text-white border border-slate-700/50 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" /> So Sánh
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-2 px-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'quiz' 
                  ? 'bg-slate-800 text-white border border-slate-700/50 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-rose-400" /> Trắc Nghiệm
            </button>
          </div>

          {/* CHI TIẾT TAB CONTENT */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            
            {/* 1. TAB CẤU TẠO (STRUCTURE) */}
            {activeTab === 'structure' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
                  <h3 className="text-base font-black text-white">{activeCellData.title}</h3>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block mb-2">{activeCellData.subTitle}</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{activeCellData.generalDesc}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Thành phần chi tiết:</h4>
                  
                  {/* Danh sách các bào quan dạng Accordion / List */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {activeCellData.parts.map((part) => (
                      <button
                        key={part.id}
                        onClick={() => setSelectedPart(part.id)}
                        className={`px-3 py-2 rounded-xl text-[11px] font-bold text-left transition-all border flex items-center gap-2 cursor-pointer ${
                          selectedPart === part.id
                            ? 'bg-slate-800 text-white border-indigo-500/80 shadow-md shadow-indigo-900/10'
                            : 'bg-slate-950/40 text-slate-300 border-slate-800 hover:bg-slate-800/30'
                        }`}
                      >
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0" 
                          style={{ 
                            backgroundColor: part.color,
                            boxShadow: selectedPart === part.id ? `0 0 8px ${part.color}` : 'none'
                          }} 
                        />
                        <span className="truncate">{part.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Khung giải thích bào quan được chọn */}
                {selectedPart && (() => {
                  const partInfo = activeCellData.parts.find(p => p.id === selectedPart);
                  if (!partInfo) return null;
                  return (
                    <div className="bg-gradient-to-b from-slate-950 to-slate-900/60 p-5 rounded-2xl border border-slate-800/80 shadow-xl space-y-3 animate-in zoom-in-95 duration-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-base font-black text-white flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: partInfo.color }} />
                            {partInfo.name}
                          </h3>
                          {partInfo.engName && (
                            <span className="text-[10px] text-slate-400 italic block font-semibold">Tên khoa học: {partInfo.engName}</span>
                          )}
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-slate-800 border border-slate-700/60 text-slate-300">
                          Bào quan
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-xs leading-relaxed">
                        <p className="text-slate-300"><strong className="text-slate-200 font-extrabold">Mô tả:</strong> {partInfo.desc}</p>
                        <p className="text-slate-300"><strong className="text-indigo-300 font-extrabold">Chức năng sinh học:</strong> {partInfo.function}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-start gap-2 bg-indigo-950/20 p-3 rounded-xl border border-indigo-900/20">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-indigo-200 leading-relaxed"><strong className="text-amber-300">Thú vị là:</strong> {partInfo.fact}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* 2. TAB SO SÁNH (COMPARE) */}
            {activeTab === 'compare' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* A. Nhân sơ vs Nhân thực */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Scale className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">Tế bào Nhân sơ vs Nhân thực</h3>
                  </div>
                  
                  <div className="overflow-hidden rounded-xl border border-slate-800 text-[10px]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950 border-b border-slate-800">
                          <th className="p-2 font-bold text-slate-300">Tiêu chí</th>
                          <th className="p-2 font-bold text-indigo-400">Nhân sơ</th>
                          <th className="p-2 font-bold text-violet-400">Nhân thực</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-slate-950/20">
                        {COMPARISONS.proVsEu.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-800/30">
                            <td className="p-2 font-black text-slate-400">{row.criteria}</td>
                            <td className="p-2 text-slate-300">{row.pro}</td>
                            <td className="p-2 text-slate-300">{row.eu}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* B. Động vật vs Thực vật */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Scale className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">Tế bào Động vật vs Thực vật</h3>
                  </div>
                  
                  <div className="overflow-hidden rounded-xl border border-slate-800 text-[10px]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950 border-b border-slate-800">
                          <th className="p-2 font-bold text-slate-300">Tiêu chí</th>
                          <th className="p-2 font-bold text-rose-400">Động vật</th>
                          <th className="p-2 font-bold text-emerald-400">Thực vật</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-slate-950/20">
                        {COMPARISONS.aniVsPla.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-800/30">
                            <td className="p-2 font-black text-slate-400">{row.criteria}</td>
                            <td className="p-2 text-slate-300">{row.animal}</td>
                            <td className="p-2 text-slate-300">{row.plant}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. TAB TRẮC NGHIỆM (QUIZ) */}
            {activeTab === 'quiz' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                {!showQuizResult ? (
                  // CHI TIẾT CÂU HỎI
                  <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800/80 space-y-4 shadow-lg">
                    {/* Tiến trình làm bài */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                        Câu hỏi {currentQuestionIdx + 1} / {questions.length}
                      </span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-indigo-950/80 border border-indigo-900/60 text-indigo-300">
                        Điểm: {score}/{questions.length}
                      </span>
                    </div>
                    
                    {/* Thanh progress */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
                        style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
                      />
                    </div>

                    {/* Nội dung câu hỏi */}
                    <p className="text-xs md:text-sm font-bold text-white leading-relaxed pt-2">
                      {questions[currentQuestionIdx].question}
                    </p>

                    {/* Các lựa chọn đáp án */}
                    <div className="space-y-2.5 pt-2">
                      {questions[currentQuestionIdx].options.map((option, idx) => {
                        let btnStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/50 hover:text-white";
                        let iconElement = null;

                        if (isAnswered) {
                          const isCorrectOpt = idx === questions[currentQuestionIdx].answer;
                          const isUserSel = idx === selectedOption;
                          
                          if (isCorrectOpt) {
                            btnStyle = "bg-emerald-950/50 border-emerald-500 text-emerald-300";
                            iconElement = <Check className="w-4 h-4 text-emerald-400 shrink-0" />;
                          } else if (isUserSel) {
                            btnStyle = "bg-rose-950/50 border-rose-500 text-rose-300";
                            iconElement = <X className="w-4 h-4 text-rose-400 shrink-0" />;
                          } else {
                            btnStyle = "bg-slate-900/40 border-slate-800 text-slate-500 opacity-50";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={isAnswered}
                            onClick={() => handleAnswerClick(idx)}
                            className={`w-full p-3 rounded-xl border text-xs font-bold text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                          >
                            <span>{option}</span>
                            {iconElement}
                          </button>
                        );
                      })}
                    </div>

                    {/* Phần giải thích chi tiết khi trả lời xong */}
                    {isAnswered && (
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-300 space-y-1">
                        <span className="text-[9px] font-black uppercase text-indigo-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Giải thích khoa học:
                        </span>
                        <p className="text-[10.5px] text-slate-300 leading-relaxed">
                          {questions[currentQuestionIdx].explain}
                        </p>
                      </div>
                    )}

                    {/* Nút Chuyển câu hỏi */}
                    {isAnswered && (
                      <button
                        onClick={handleNextQuestion}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-md cursor-pointer"
                      >
                        {currentQuestionIdx < questions.length - 1 ? "Câu tiếp theo" : "Xem kết quả"}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  // BÁO CÁO KẾT QUẢ QUIZ
                  <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/80 text-center space-y-5 shadow-lg animate-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 rounded-full bg-indigo-950 border border-indigo-850 flex items-center justify-center mx-auto shadow-inner">
                      <Award className="w-8 h-8 text-amber-400" />
                    </div>
                    
                    <div>
                      <h3 className="text-base font-black text-white">Kết quả bài trắc nghiệm</h3>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-1">
                        Về {activeCellData.title}
                      </p>
                    </div>

                    <div className="bg-slate-900 py-4 px-6 rounded-2xl border border-slate-800 max-w-xs mx-auto">
                      <p className="text-3xl font-black text-indigo-400">{score} / {questions.length}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold">Câu trả lời chính xác</p>
                    </div>

                    <p className="text-xs text-slate-300 px-2 leading-relaxed">
                      {score === questions.length 
                        ? "Tuyệt vời! Bạn có hiểu biết hoàn hảo về cấu tạo của loại tế bào này." 
                        : score >= 3 
                        ? "Rất tốt! Bạn đã nắm được đa phần các bào quan cơ bản." 
                        : "Đừng nản chí! Hãy xem kỹ lại phần Cấu tạo và làm lại bài kiểm tra nhé."
                      }
                    </p>

                    <button
                      onClick={resetQuiz}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700/60 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" /> Thực hiện lại bài học
                    </button>
                  </div>
                )}
              </div>
            )}
            
          </div>

          {/* FOOTER INFO PANEL */}
          <div className="p-4 border-t border-slate-800/60 bg-slate-950/40 text-[10px] text-slate-400 flex items-center justify-between shrink-0">
            <span className="font-semibold uppercase tracking-wider text-slate-500">Môn Sinh học tế bào</span>
            <span className="flex items-center gap-1 font-bold text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Bản phát hành 3D mới nhất
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
