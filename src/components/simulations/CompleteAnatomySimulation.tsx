import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Activity, Info, HelpCircle, 
  Dna, AlertCircle, CheckCircle2, XCircle, 
  BrainCircuit, Sparkles, Maximize, Minimize,
  Heart, HeartPulse, RefreshCw, Stethoscope,
  Users, BookOpen, GraduationCap, ShieldAlert, Award
} from 'lucide-react';

interface OrganDetail {
  name: string;
  englishName: string;
  role: string;
  funFact: string;
  question: string;
  answer: string;
  options: string[];
  annotationId?: number;
}

interface SystemInfo {
  id: string;
  name: string;
  englishName: string;
  colorClass: string;
  bgGlow: string;
  borderGlow: string;
  gradient: string;
  textGlow: string;
  description: string;
  organs: Record<string, OrganDetail>;
}

const SYSTEMS_DATA: Record<string, SystemInfo> = {
  circulatory: {
    id: "circulatory",
    name: "Hệ Tuần Hoàn",
    englishName: "Circulatory System",
    colorClass: "rose",
    bgGlow: "rgba(244, 63, 94, 0.15)",
    borderGlow: "rgba(244, 63, 94, 0.4)",
    gradient: "from-rose-500 to-red-600",
    textGlow: "text-rose-400",
    description: "Vận chuyển chất dinh dưỡng, khí oxy, hormone và các chất thải trao đổi đến và đi khỏi các tế bào trong cơ thể để giúp duy trì sự sống và ổn định nội môi.",
    organs: {
      heart: {
        name: "Tim",
        englishName: "Heart",
        role: "Hoạt động như một chiếc máy bơm cơ học bền bỉ, co bóp nhịp nhàng không ngừng nghỉ để đẩy máu giàu oxy qua hệ thống động mạch đi nuôi toàn bộ cơ thể và hút máu nghèo oxy quay trở lại qua hệ tĩnh mạch.",
        funFact: "Tim của bạn đập trung bình khoảng 100.000 lần một ngày và bơm tương đương hơn 7.500 lít máu đi khắp cơ thể!",
        question: "Cấu tạo tim của người trưởng thành gồm có mấy ngăn chính?",
        options: ["2 ngăn (1 tâm nhĩ, 1 tâm thất)", "3 ngăn (2 tâm nhĩ, 1 tâm thất)", "4 ngăn (2 tâm nhĩ, 2 tâm thất)", "5 ngăn"],
        answer: "4 ngăn (2 tâm nhĩ, 2 tâm thất)",
        annotationId: 1
      },
      arteries: {
        name: "Động mạch",
        englishName: "Arteries",
        role: "Hệ thống các ống dẫn máu có thành dày dặn, đàn hồi tốt, chịu áp lực cực cao để vận chuyển máu giàu oxy từ tim đi đến phân phối cho tất cả các mô và cơ quan trên cơ thể.",
        funFact: "Động mạch lớn nhất cơ thể là Động mạch chủ (Aorta), nó có đường kính tương đương một chiếc ống vòi vườn tưới cây thông thường!",
        question: "Tại sao thành của các động mạch lại dày và đàn hồi cao hơn so với tĩnh mạch?",
        options: [
          "Để chứa được nhiều máu hơn",
          "Để chịu đựng áp lực rất lớn của dòng máu co bóp trực tiếp từ tim tống ra",
          "Để lọc bớt chất độc hại có trong máu",
          "Để dẫn máu đi nhanh hơn"
        ],
        answer: "Để chịu đựng áp lực rất lớn của dòng máu co bóp trực tiếp từ tim tống ra",
        annotationId: 2
      },
      veins: {
        name: "Tĩnh mạch",
        englishName: "Veins",
        role: "Hệ thống ống dẫn máu đưa dòng máu nghèo oxy và chứa nhiều chất thải CO2 trở ngược về tim để nạp lại oxy tại phổi. Tĩnh mạch chứa các van một chiều đặc biệt để ngăn dòng máu chảy ngược do trọng lực.",
        funFact: "Các van một chiều trong tĩnh mạch chi dưới hoạt động như những chiếc chốt chặn an toàn, chống lại trọng lực Trái đất để đưa máu từ chân leo ngược về tim!",
        question: "Bộ phận cấu tạo đặc biệt nào trong lòng tĩnh mạch giúp máu không bị chảy ngược xuống do trọng lực?",
        options: ["Cơ thắt tĩnh mạch", "Các sợi đàn hồi tự nhiên", "Các van một chiều", "Lớp tế bào biểu mô nhám"],
        answer: "Các van một chiều",
        annotationId: 3
      },
      capillaries: {
        name: "Mao mạch",
        englishName: "Capillaries",
        role: "Mạng lưới các mạch máu siêu nhỏ nối liền giữa động mạch và tĩnh mạch, có thành cực mỏng (chỉ 1 lớp tế bào) để tạo điều kiện lý tưởng cho việc trao đổi chất dinh dưỡng, khí oxy và CO2 giữa máu với các mô tế bào.",
        funFact: "Đường kính của mao mạch nhỏ đến mức các tế bào hồng cầu phải biến dạng hoặc đi xếp hàng đơn cực kỳ chật hẹp mới có thể lách qua được!",
        question: "Đặc điểm cấu tạo nào của mao mạch giúp chất dinh dưỡng dễ dàng trao đổi với tế bào?",
        options: [
          "Thành mạch dày và chắc chắn",
          "Lòng mạch rộng và máu chảy nhanh",
          "Thành mạch siêu mỏng chỉ cấu tạo từ một lớp tế bào biểu mô dẹt",
          "Có các van đóng mở liên tục"
        ],
        answer: "Thành mạch siêu mỏng chỉ cấu tạo từ một lớp tế bào biểu mô dẹt",
        annotationId: 4
      }
    }
  },
  respiratory: {
    id: "respiratory",
    name: "Hệ Hô Hấp",
    englishName: "Respiratory System",
    colorClass: "blue",
    bgGlow: "rgba(59, 130, 246, 0.15)",
    borderGlow: "rgba(59, 130, 246, 0.4)",
    gradient: "from-blue-500 to-indigo-600",
    textGlow: "text-blue-400",
    description: "Thực hiện chức năng trao đổi khí giữa cơ thể với môi trường bên ngoài: lấy khí oxy cung cấp cho các hoạt động sống của tế bào và đào thải khí cacbonic (CO2) ra ngoài.",
    organs: {
      nasal_cavity: {
        name: "Khoang mũi",
        englishName: "Nasal Cavity",
        role: "Nơi đầu tiên đón nhận không khí bên ngoài đi vào cơ thể. Lớp niêm mạc mũi giàu mao mạch, tiết chất nhầy kết hợp với các sợi lông mũi giúp giữ bụi bẩn, làm ẩm và sưởi ấm không khí trước khi vào sâu bên trong.",
        funFact: "Mũi của bạn không chỉ để thở, nó còn chứa khoảng 5 triệu tế bào khứu giác giúp nhận biết tới hàng chục nghìn mùi hương khác nhau!",
        question: "Vì sao các bác sĩ luôn khuyên chúng ta nên thở bằng mũi thay vì thở bằng miệng?",
        options: [
          "Thở bằng miệng làm răng bị thưa",
          "Mũi có hệ thống lông và chất nhầy giúp làm sạch, làm ấm và làm ẩm không khí bảo vệ phổi",
          "Thở bằng mũi làm giảm lượng oxy tiêu thụ",
          "Thở bằng miệng gây ra chứng đầy hơi dạ dày"
        ],
        answer: "Mũi có hệ thống lông và chất nhầy giúp làm sạch, làm ấm và làm ẩm không khí bảo vệ phổi",
        annotationId: 5
      },
      trachea: {
        name: "Khí quản",
        englishName: "Trachea",
        role: "Ống dẫn khí chính nối từ thanh quản xuống phế quản phổi, được cấu tạo từ các vòng sụn hình chữ C khuyết phía sau để giữ đường thở luôn mở rộng thông thoáng khi cơ thể chuyển động gập cổ.",
        funFact: "Niêm mạc khí quản chứa hàng triệu tế bào lông chuyển động đồng bộ như những chiếc chổi quét mini liên tục đẩy bụi và đờm ngược lên họng để khạc ra ngoài!",
        question: "Tại sao các vòng sụn ở khí quản lại có hình chữ C khuyết phía sau mà không khép kín hoàn toàn?",
        options: [
          "Để tiết kiệm canxi cho cơ thể",
          "Để thực quản nằm ngay phía sau có thể dễ dàng giãn nở khi chúng ta nuốt thức ăn lớn",
          "Để giúp khí quản co giãn dài ra khi hít thở sâu",
          "Để luồng khí di chuyển xoáy nhanh hơn"
        ],
        answer: "Để thực quản nằm ngay phía sau có thể dễ dàng giãn nở khi chúng ta nuốt thức ăn lớn",
        annotationId: 6
      },
      lungs: {
        name: "Lá phổi",
        englishName: "Lungs",
        role: "Cơ quan trao đổi khí chủ chốt gồm 2 lá xốp đàn hồi cao. Phổi chứa hàng triệu túi khí nhỏ (phế nang) được bao bọc bởi mạng lưới mao mạch dày đặc để thực hiện khuếch tán khí O2 vào máu và CO2 từ máu ra phế nang.",
        funFact: "Nếu chúng ta trải phẳng toàn bộ khoảng 300 - 500 triệu phế nang trong hai lá phổi người trưởng thành, diện tích bề mặt của chúng sẽ lớn tương đương diện tích một sân tennis (~75 m2)!",
        question: "Cơ chế vật lý chủ yếu nào giúp các chất khí O2 và CO2 trao đổi qua lại giữa phế nang và mao mạch phổi?",
        options: [
          "Cơ chế lọc cơ học áp lực cao",
          "Sự khuếch tán thụ động từ nơi có nồng độ (phân áp) chất khí cao sang nơi có nồng độ thấp",
          "Vận chuyển chủ động cần tiêu tốn năng lượng ATP của tế bào",
          "Sự thẩm thấu dòng nước"
        ],
        answer: "Sự khuếch tán thụ động từ nơi có nồng độ (phân áp) chất khí cao sang nơi có nồng độ thấp",
        annotationId: 7
      },
      diaphragm: {
        name: "Cơ hoành",
        englishName: "Diaphragm",
        role: "Một cơ vân hình vòm dẹt ngăn cách khoang ngực với khoang bụng, đóng vai trò là cơ hô hấp chính yếu. Khi cơ hoành co và hạ xuống, thể tích lồng ngực tăng lên hút không khí vào phổi (hít vào).",
        funFact: "Khi cơ hoành bị kích thích đột ngột gây ra các cơn co thắt ngoài ý muốn liên tiếp đập vào thanh quản khép kín, đó chính là hiện tượng nấc cụt!",
        question: "Cử động của cơ hoành diễn ra như thế nào khi chúng ta thực hiện động tác hít vào?",
        options: [
          "Cơ hoành giãn ra và cong vồng lên trên phía lồng ngực",
          "Cơ hoành co lại và hạ phẳng xuống phía dưới khoang bụng",
          "Cơ hoành co thắt liên tục tạo rung động",
          "Cơ hoành giữ nguyên không di chuyển"
        ],
        answer: "Cơ hoành co lại và hạ phẳng xuống phía dưới khoang bụng",
        annotationId: 8
      }
    }
  },
  digestive: {
    id: "digestive",
    name: "Hệ Tiêu Hóa",
    englishName: "Digestive System",
    colorClass: "amber",
    bgGlow: "rgba(245, 158, 11, 0.15)",
    borderGlow: "rgba(245, 158, 11, 0.4)",
    gradient: "from-amber-500 to-orange-600",
    textGlow: "text-amber-400",
    description: "Thực hiện biến đổi thức ăn về mặt cơ học và hóa học thành các chất dinh dưỡng đơn giản mà cơ thể có thể hấp thụ được qua thành ruột non vào máu nuôi tế bào, đồng thời đào thải các chất không tiêu hóa được ra ngoài dưới dạng phân.",
    organs: {
      esophagus: {
        name: "Thực quản",
        englishName: "Esophagus",
        role: "Ống cơ dài khoảng 25cm dẫn thức ăn từ họng xuống dạ dày nhờ hoạt động co bóp cơ nhịp nhàng lan truyền gọi là nhu động thực quản.",
        funFact: "Lực co bóp nhu động của cơ thực quản rất mạnh mẽ và định hướng một chiều, giúp thức ăn đi vào dạ dày ngay cả khi bạn ăn uống trong tư thế trồng cây chuối lộn ngược đầu!",
        question: "Lực chính đẩy thức ăn di chuyển từ họng xuống dạ dày dọc theo chiều dài thực quản là gì?",
        options: [
          "Trọng lực kéo thức ăn rơi tự do xuống dưới",
          "Lực hút chân không từ dạ dày",
          "Lực đẩy nhu động từ sự co bóp tuần tự của các lớp cơ thành thực quản",
          "Áp suất luồng khí hít vào thở ra"
        ],
        answer: "Lực đẩy nhu động từ sự co bóp tuần tự của các lớp cơ thành thực quản",
        annotationId: 9
      },
      stomach: {
        name: "Dạ dày",
        englishName: "Stomach",
        role: "Túi cơ lớn hình chữ J phình to nhất hệ tiêu hóa. Thực hiện nhào trộn mạnh mẽ thức ăn cơ học và tiết dịch vị chứa axit Clohidric (HCl) và enzyme pepsin để bắt đầu tiêu hóa hóa học protein.",
        funFact: "Môi trường axit HCl trong dạ dày cực mạnh (pH từ 1.5 - 2.0), đủ sức hòa tan cả một chiếc lưỡi dao cạo bằng kim loại mỏng chỉ trong vài giờ!",
        question: "Thành dạ dày tự bảo vệ trước sức tàn phá dữ dội của axit HCl và enzyme tiêu hóa protein (Pepsin) bằng cơ chế nào?",
        options: [
          "Bằng một lớp màng chất nhầy (Mucus) giàu ion kiềm liên tục được tiết ra phủ trên bề mặt",
          "Bằng các tế bào biểu mô có tính kháng axit vĩnh cửu không thể bị phá hủy",
          "Dạ dày liên tục tiết nước để pha loãng axit ngay khi tiết ra",
          "Nhờ chất béo trong thức ăn bọc kín thành dạ dày"
        ],
        answer: "Bằng một lớp màng chất nhầy (Mucus) giàu ion kiềm liên tục được tiết ra phủ trên bề mặt",
        annotationId: 10
      },
      liver: {
        name: "Gan và Mật",
        englishName: "Liver & Gallbladder",
        role: "Gan là nhà máy hóa chất khổng lồ của cơ thể, thải độc tố, lưu trữ glycogen và sản xuất dịch mật. Dịch mật được lưu trữ tập trung ở túi mật rồi đổ vào ruột non để nhũ tương hóa chất béo giúp tiêu hóa lipid dễ dàng.",
        funFact: "Gan có khả năng tái tạo tế bào vô cùng kỳ diệu, nếu bạn phẫu thuật cắt bỏ đi tới 75% thể tích gan khỏe mạnh, nó có thể tự mọc lại kích thước ban đầu chỉ sau vài tuần!",
        question: "Dịch mật do gan sản xuất có vai trò sinh học cực kỳ quan trọng nào đối với quá trình tiêu hóa ở ruột non?",
        options: [
          "Phân giải trực tiếp chất xơ",
          "Nhũ tương hóa lipid (biến chất béo thành các hạt nhỏ li ti) giúp enzyme lipase dễ dàng thủy phân",
          "Tiêu diệt toàn bộ vi khuẩn có hại bám trên thức ăn",
          "Trung hòa lượng đường thừa trong ruột"
        ],
        answer: "Nhũ tương hóa lipid (biến chất béo thành các hạt nhỏ li ti) giúp enzyme lipase dễ dàng thủy phân",
        annotationId: 11
      },
      pancreas: {
        name: "Tuyến Tụy",
        englishName: "Pancreas",
        role: "Tuyến hỗn hợp đặc biệt nằm phía sau dạ dày. Tiết dịch tụy chứa đầy đủ các nhóm enzyme mạnh mẽ đổ vào ruột non, đồng thời tiết hormone insulin và glucagon trực tiếp vào máu để điều hòa nồng độ đường huyết.",
        funFact: "Dù có kích thước nhỏ gọn chỉ bằng bàn tay, nhưng tuyến tụy là cơ quan 'kép' nắm giữ cả sinh mệnh tiêu hóa (ngoại tiết) và cân bằng năng lượng đường huyết (nội tiết) của cơ thể!",
        question: "Cơ quan nào sản sinh ra hormone Insulin giúp tế bào hấp thụ glucose từ máu, làm giảm lượng đường huyết?",
        options: ["Gan", "Thận", "Tuyến tụy", "Dạ dày"],
        answer: "Tuyến tụy",
        annotationId: 12
      },
      small_intestine: {
        name: "Ruột non",
        englishName: "Small Intestine",
        role: "Đoạn ống dài 6 mét gấp nếp nhiều lần, là nơi diễn ra triệt để nhất tất cả các hoạt động tiêu hóa hóa học cuối cùng và hấp thụ hầu như toàn bộ chất dinh dưỡng hữu ích vào máu và hệ bạch huyết.",
        funFact: "Thành trong của ruột non được bao phủ bởi hàng triệu nếp gấp và lông cực nhỏ (lông ruột), giúp tăng tổng diện tích bề mặt tiếp xúc hấp thụ lên gấp 600 lần so với ống trơn!",
        question: "Tại sao ruột non lại là nơi hấp thụ chất dinh dưỡng hiệu quả nhất trong toàn bộ ống tiêu hóa?",
        options: [
          "Vì ruột non có lớp cơ thành mạch co bóp mạnh nhất",
          "Vì thức ăn được giữ ở ruột non lâu nhất (khoảng vài ngày)",
          "Nhờ có chiều dài lớn (khoảng 6m) và bề mặt trong có vô số nếp gấp, lông ruột làm tăng diện tích tiếp xúc khổng lồ",
          "Vì ruột non chứa axit đậm đặc hơn dạ dày"
        ],
        answer: "Nhờ có chiều dài lớn (khoảng 6m) và bề mặt trong có vô số nếp gấp, lông ruột làm tăng diện tích tiếp xúc khổng lồ",
        annotationId: 13
      },
      large_intestine: {
        name: "Ruột già",
        englishName: "Large Intestine",
        role: "Ống cơ lớn dài khoảng 1.5 mét bao quanh ruột non. Nhận chất bã thức ăn còn lại, thực hiện hấp thụ triệt để lượng nước và muối khoáng dư thừa, đồng thời là môi trường cho hàng tỷ lợi khuẩn lên men chất xơ, tạo phân.",
        funFact: "Số lượng vi khuẩn cộng sinh trong ruột già của bạn lớn hơn gấp 10 lần tổng số tế bào cấu tạo nên toàn bộ cơ thể của chính bạn!",
        question: "Chức năng sinh lý chủ yếu của ruột già đối với hệ tiêu hóa là gì?",
        options: [
          "Tiết enzyme phân giải nốt chất đạm",
          "Hấp thụ lại nước, muối khoáng từ chất bã thức ăn và cô đặc chất thải để tạo thành phân",
          "Nhũ tương hóa các chất béo còn sót lại",
          "Bơm máu đi nuôi các cơ bụng"
        ],
        answer: "Hấp thụ lại nước, muối khoáng từ chất bã thức ăn và cô đặc chất thải để tạo thành phân",
        annotationId: 14
      }
    }
  },
  nervous: {
    id: "nervous",
    name: "Hệ Thần Kinh",
    englishName: "Nervous System",
    colorClass: "purple",
    bgGlow: "rgba(168, 85, 247, 0.15)",
    borderGlow: "rgba(168, 85, 247, 0.4)",
    gradient: "from-purple-500 to-fuchsia-600",
    textGlow: "text-purple-400",
    description: "Nhận biết, xử lý thông tin từ môi trường bên ngoài cũng như bên trong cơ thể, đưa ra các mệnh lệnh điều hòa phối hợp hoạt động của tất cả các cơ quan bộ phận giúp cơ thể thích nghi tối ưu.",
    organs: {
      brain: {
        name: "Bộ Não",
        englishName: "Brain",
        role: "Trung tâm điều khiển tối cao, nơi xử lý cảm giác, tư duy, ngôn ngữ, ký ức và chỉ đạo các hành vi tự chủ hoặc vô thức thông qua hàng tỷ neuron liên kết cực kỳ phức tạp.",
        funFact: "Mặc dù não bộ chỉ chiếm khoảng 2% tổng trọng lượng cơ thể người, nhưng nó lại tiêu thụ tới hơn 20% tổng lượng oxy và năng lượng nuôi dưỡng của toàn cơ thể!",
        question: "Bộ phận nào của não bộ chịu trách nhiệm chính trong việc giữ thăng bằng cơ thể và điều hòa phối hợp các cử động vận động phức tạp?",
        options: ["Đại não (Cerebrum)", "Tiểu não (Cerebellum)", "Hành não (Brainstem)", "Não trung gian"],
        answer: "Tiểu não (Cerebellum)",
        annotationId: 15
      },
      spinal_cord: {
        name: "Tủy sống",
        englishName: "Spinal Cord",
        role: "Cột mô thần kinh dài nằm chạy dọc bên trong ống cột sống, là đường truyền dẫn thông tin hai chiều cực kỳ quan trọng giữa não bộ với các cơ quan ngoại vi và là trung ương của nhiều phản xạ không điều kiện.",
        funFact: "Tủy sống vô cùng nhạy bén và có thể tự đưa ra quyết định xử lý phản xạ rụt tay tức thì khi vô tình chạm phải vật nóng bỏng mà không cần phải chờ đợi luồng tín hiệu chạy lên não phê duyệt!",
        question: "Phản xạ tự động rụt tay lại ngay lập tức khi ngón tay chạm vào gai nhọn là loại phản xạ gì?",
        options: [
          "Phản xạ có điều kiện (học tập được)",
          "Phản xạ không điều kiện (phản xạ sinh tủy bẩm sinh)",
          "Hoạt động co cơ tự phát không thông qua thần kinh",
          "Hành vi suy nghĩ có chủ ý"
        ],
        answer: "Phản xạ không điều kiện (phản xạ sinh tủy bẩm sinh)",
        annotationId: 16
      },
      nerves: {
        name: "Dây thần kinh",
        englishName: "Nerves",
        role: "Các sợi cáp sinh học phân nhánh khắp cơ thể, truyền dẫn các xung điện thần kinh cực nhanh từ các cơ quan thụ cảm về trung ương (não, tủy) và truyền lệnh vận động ngược trở lại các cơ và tuyến.",
        funFact: "Tốc độ dẫn truyền xung điện thần kinh dọc theo các sợi trục neuron bọc myelin có thể đạt vận tốc tối đa lên tới 400 km/h - nhanh hơn cả siêu xe đua công thức 1!",
        question: "Tế bào chuyên hóa làm đơn vị cấu tạo và chức năng cơ bản cấu thành nên toàn bộ hệ thần kinh là tế bào nào?",
        options: ["Tế bào cơ vân", "Tế bào neuron (tế bào thần kinh)", "Tế bào biểu bì", "Tế bào tủy xương"],
        answer: "Tế bào neuron (tế bào thần kinh)",
        annotationId: 17
      }
    }
  },
  skeletal: {
    id: "skeletal",
    name: "Hệ Xương Khớp",
    englishName: "Skeletal System",
    colorClass: "emerald",
    bgGlow: "rgba(16, 185, 129, 0.15)",
    borderGlow: "rgba(16, 185, 129, 0.4)",
    gradient: "from-emerald-500 to-teal-600",
    textGlow: "text-emerald-400",
    description: "Tạo nên bộ khung nâng đỡ định hình toàn bộ cơ thể, bảo vệ các cơ quan nội tạng mềm yếu bên trong khỏi chấn động (não, tim, phổi) và làm điểm bám vững chắc cho cơ vân hoạt động tạo ra cử động di chuyển.",
    organs: {
      skull: {
        name: "Xương sọ",
        englishName: "Skull",
        role: "Khung xương cứng cáp vòm cung bao quanh đầu, đóng vai trò như chiếc mũ bảo hiểm sinh học vĩnh cửu bao bọc che chở hoàn hảo cho bộ não tinh vi và nâng đỡ cấu trúc khuôn mặt.",
        funFact: "Hộp sọ của trẻ sơ sinh cấu tạo gồm nhiều mảnh xương rời khớp động (có các khoảng trống gọi là thóp) để đầu dễ chui ra khi sinh và giúp não bộ có không gian nở rộng tối đa!",
        question: "Các khớp nối liên kết giữa các mảnh xương sọ ở người trưởng thành thuộc loại khớp xương nào?",
        options: ["Khớp động (như khớp gối)", "Khớp bán động (như đốt sống)", "Khớp bất động", "Khớp xoay tự do"],
        answer: "Khớp bất động",
        annotationId: 18
      },
      spine: {
        name: "Cột sống",
        englishName: "Spine / Vertebrae",
        role: "Trục xương trung tâm nâng đỡ cơ thể đứng thẳng, cấu tạo từ 33 - 34 đốt sống xếp chồng lên nhau xen kẽ bởi các đĩa đệm giảm chấn, tạo thành ống rỗng an toàn bảo vệ tủy sống chạy bên trong.",
        funFact: "Cột sống người có hình dáng cong chữ S kép đặc trưng với 4 điểm uốn sinh lý, hoạt động như một chiếc lò xo giảm chấn cực tốt bảo vệ bộ não khi di chuyển chạy nhảy!",
        question: "Cột sống của con người có mấy điểm cong sinh lý tự nhiên giúp phân tán lực tác động và giữ thăng bằng?",
        options: ["2 điểm cong", "3 điểm cong", "4 điểm cong (cổ, ngực, thắt lưng, cùng)", "Không có điểm cong nào"],
        answer: "4 điểm cong (cổ, ngực, thắt lưng, cùng)",
        annotationId: 19
      },
      ribcage: {
        name: "Lồng ngực",
        englishName: "Rib Cage",
        role: "Khung xương hình lồng cấu tạo bởi xương ức phía trước, các xương sườn vòm xung quanh bám vào đốt sống ngực phía sau. Bảo vệ tim, phổi và co giãn linh hoạt hỗ trợ hô hấp.",
        funFact: "Xương sườn của con người cực kỳ dẻo dai đàn hồi, khớp nối với xương ức bằng các sụn sườn mềm dẻo để lồng ngực có thể phồng lên xẹp xuống hàng vạn lần mỗi ngày khi hít thở!",
        question: "Lồng ngực người trưởng thành có bao nhiêu đôi xương sườn chính bám vòng quanh?",
        options: ["10 đôi xương sườn", "12 đôi xương sườn", "14 đôi xương sườn", "16 đôi xương sườn"],
        answer: "12 đôi xương sườn",
        annotationId: 20
      },
      limbs: {
        name: "Xương chi (Tay & Chân)",
        englishName: "Limb Bones",
        role: "Hệ thống các xương dài đòn bẩy (như xương đùi, xương cánh tay) kết nối linh hoạt bằng khớp động giúp cơ thể thực hiện các động tác cầm nắm, đứng thẳng, đi lại và chạy nhảy.",
        funFact: "Xương đùi (Femur) là xương lớn nhất, dài nhất và có khả năng chịu lực nén ép siêu việt nhất cơ thể người, cứng cáp chịu tải tương đương với cột bê tông đúc!",
        question: "Khớp xương ở đầu gối, khuỷu tay giúp các xương quay quanh một trục linh hoạt thuộc nhóm khớp nào?",
        options: ["Khớp bất động", "Khớp bán động", "Khớp động", "Khớp sụn cố định"],
        answer: "Khớp động",
        annotationId: 21
      }
    }
  },
  excretory: {
    id: "excretory",
    name: "Hệ Bài Tiết",
    englishName: "Excretory System",
    colorClass: "pink",
    bgGlow: "rgba(236, 72, 153, 0.15)",
    borderGlow: "rgba(236, 72, 153, 0.4)",
    gradient: "from-pink-500 to-rose-600",
    textGlow: "text-pink-400",
    description: "Lọc bỏ các chất độc hại, chất thải sinh ra trong quá trình trao đổi chất của tế bào ra khỏi dòng máu, điều hòa lượng nước, muối khoáng giúp duy trì nồng độ nội môi ổn định của cơ thể.",
    organs: {
      kidneys: {
        name: "Quả Thận",
        englishName: "Kidneys",
        role: "Hai cơ quan hình hạt đậu nằm sát thành sau khoang bụng. Hoạt động liên tục lọc dòng máu chảy qua để thu giữ chất thải ure, axit uric dư thừa, cô đặc thành nước tiểu sơ cấp rồi nước tiểu chính thức đưa xuống bàng quang.",
        funFact: "Mỗi ngày hai quả thận nhỏ bé lọc sạch khoảng 180 lít chất lỏng từ máu, nhưng cơ thể chỉ thải ra khoảng 1.5 - 2 lít nước tiểu chính thức, phần lớn nước sạch được tái hấp thụ hoàn toàn!",
        question: "Đơn vị chức năng cơ bản đảm nhận toàn bộ vai trò lọc máu và hình thành nước tiểu của thận được gọi là gì?",
        options: ["Nephron (Đơn vị thận)", "Neuron (Tế bào thần kinh)", "Nang phế nang", "Tế bào gan"],
        answer: "Nephron (Đơn vị thận)",
        annotationId: 22
      },
      bladder: {
        name: "Bàng quang",
        englishName: "Urinary Bladder",
        role: "Túi cơ rỗng có thành co giãn cực tốt nằm ở vùng hạ vị. Đóng vai trò làm bể chứa nước tiểu tạm thời liên tục dẫn từ thận xuống qua ống dẫn niệu trước khi thải ra ngoài qua ống đái.",
        funFact: "Bàng quang có lớp cơ trơn và niêm mạc chuyển tiếp đặc biệt cho phép nó căng giãn phình to để chứa an toàn từ 500ml đến gần 1 lít nước tiểu mà không bị nứt vỡ thành mạch!",
        question: "Thành bàng quang cấu tạo chủ yếu từ loại cơ nào giúp nó co bóp tống nước tiểu ra ngoài theo phản xạ tự động?",
        options: ["Cơ vân (như cơ tay)", "Cơ tim", "Cơ trơn (co bóp vô thức)", "Khung sụn mềm"],
        answer: "Cơ trơn (co bóp vô thức)",
        annotationId: 23
      }
    }
  }
};

const DIAGNOSTIC_CASES = [
  {
    symptoms: "Bệnh nhân (nam, 45 tuổi) đau dữ dội vùng hạ sườn phải, lan ra sau lưng. Da mặt và tròng mắt có biểu hiện vàng nhẹ. Nước tiểu sẫm màu. Bệnh nhân có tiền sử ăn nhiều đồ dầu mỡ, ít vận động.",
    suspectOrgan: "liver",
    systemId: "digestive",
    organName: "Gan và Mật (Mật bị tắc nghẽn hoặc Viêm gan)",
    medicalAdvice: "Dịch mật bị tắc nghẽn (do sỏi mật hoặc viêm gan) làm sắc tố mật tràn vào máu gây vàng da, vàng mắt và nước tiểu đậm màu. Cần hạn chế ăn mỡ động vật và đi khám siêu âm gan mật ngay."
  },
  {
    symptoms: "Bệnh nhân (nữ, 18 tuổi) đột ngột cảm thấy ngực bị thắt nghẹn, khó thở dữ dội, đặc biệt là khi thở ra nghe thấy tiếng khò khè rất rõ. Cơn khó thở xuất hiện ngay sau khi bệnh nhân dọn dẹp phòng kho chứa đầy bụi bặm.",
    suspectOrgan: "lungs",
    systemId: "respiratory",
    organName: "Phổi / Phế quản (Cơn hen suyễn cấp tính)",
    medicalAdvice: "Đây là biểu hiện của cơn hen suyễn (co thắt phế quản phổi do dị ứng bụi). Cần sử dụng ngay ống hít giãn phế quản cắt cơn và tránh xa các tác nhân gây dị ứng như bụi, phấn hoa, lông thú nuôi."
  },
  {
    symptoms: "Bệnh nhân (nam, 50 tuổi) thường xuyên có cảm giác nóng rát dữ dội ở vùng thượng vị (dưới mũi ức), cảm giác ợ chua, buồn nôn tăng lên nhiều sau khi ăn đồ chua cay hoặc khi thức khuya, căng thẳng đầu óc do công việc áp lực.",
    suspectOrgan: "stomach",
    systemId: "digestive",
    organName: "Dạ dày (Viêm loét dạ dày tá tràng)",
    medicalAdvice: "Axit HCl trong dạ dày tiết ra quá nhiều phá hủy lớp màng nhầy bảo vệ gây viêm loét niêm mạc. Tránh ăn đồ chua cay, không thức khuya, giảm stress và dùng thuốc trung hòa axit theo đơn bác sĩ."
  },
  {
    symptoms: "Bệnh nhân (nữ, 35 tuổi) bị đau nhức âm ỉ vùng thắt lưng, kèm theo tiểu buốt, tiểu rắt, mỗi lần đi tiểu rất ít và nước tiểu có màu hồng nhạt (tiểu ra máu nhẹ).",
    suspectOrgan: "kidneys",
    systemId: "excretory",
    organName: "Quả Thận (Sỏi thận hoặc Viêm đường tiết niệu)",
    medicalAdvice: "Sỏi thận hình thành do tích tụ khoáng chất làm tổn thương niêm mạc đường dẫn niệu gây tiểu ra máu và tiểu buốt. Cần uống đủ từ 2 lít nước mỗi ngày để hỗ trợ thận lọc tốt và bào mòn sỏi tự nhiên."
  },
  {
    symptoms: "Bệnh nhân (nam, 60 tuổi) đột ngột cảm thấy tim đập thình thịch, đánh trống ngực dồn dập ngay cả khi đang nằm nghỉ ngơi. Đôi lúc nhịp tim vọt lên trên 110 lần/phút kèm theo mệt mỏi, hụt hơi, chóng mặt nhẹ.",
    suspectOrgan: "heart",
    systemId: "circulatory",
    organName: "Tim (Rối loạn nhịp tim / Rung nhĩ)",
    medicalAdvice: "Tim gặp hiện tượng phát xung điện bất thường gây co bóp rối loạn, giảm hiệu suất bơm máu. Bệnh nhân cần nghỉ ngơi, tránh các chất kích thích như cà phê, rượu bia và đến chuyên khoa tim mạch đo điện tâm đồ (ECG)."
  },
  {
    symptoms: "Bệnh nhân (nam, 15 tuổi) bị ngã khi đá bóng. Bệnh nhân không thể cử động được ngón tay cái, vùng khớp cổ tay sưng to tức thì, biến dạng nhẹ và đau buốt nhói khi chạm vào vùng xương nhô ra.",
    suspectOrgan: "limbs",
    systemId: "skeletal",
    organName: "Xương chi - Tay (Rạn nứt xương hoặc Trật khớp cổ tay)",
    medicalAdvice: "Có khả năng tổn thương nứt rạn xương chi hoặc trật khớp động cổ tay. Cần cố định tạm thời cổ tay bằng nẹp mềm, chườm đá giảm sưng và nhanh chóng chụp X-quang để bác sĩ chỉnh xương."
  }
];

export function CompleteAnatomySimulation({ onBack }: { onBack: () => void }) {
  // Navigation & States
  const [activeSystemId, setActiveSystemId] = useState<string>("circulatory");
  const [selectedOrganKey, setSelectedOrganKey] = useState<string>("heart");
  
  // Right panel modes: 'study' (Học tập), 'diagnostic' (Bác sĩ chẩn đoán), 'quiz' (Trắc nghiệm nhanh)
  const [panelMode, setPanelMode] = useState<'study' | 'diagnostic' | 'quiz'>('study');
  
  // Custom states for interactive 3D
  const [viewerApi, setViewerApi] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeAnnotation, setActiveAnnotation] = useState<number | null>(null);

  // Diagnostic mode states
  const [currentDiagIndex, setCurrentDiagIndex] = useState<number>(0);
  const [diagSelectedOrgan, setDiagSelectedOrgan] = useState<string | null>(null);
  const [showDiagFeedback, setShowDiagFeedback] = useState<boolean>(false);
  const [diagScore, setDiagScore] = useState<number>(0);
  const [diagStreak, setDiagStreak] = useState<number>(0);

  // Standard Quiz states (specific to selected organ)
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [showQuizFeedback, setShowQuizFeedback] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load Sketchfab dynamic API
  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    const initSketchfab = () => {
      if (!(window as any).Sketchfab) return;
      const client = new (window as any).Sketchfab('1.12.1', iframeRef.current);
      
      client.init('c904a5a65ae145a0bc535645c7e693af', {
        success: (api: any) => {
          api.start();
          api.addEventListener('viewerready', () => {
            setViewerApi(api);
            
            // Listen to clicks on 3D elements to auto select organs
            api.addEventListener('click', (info: any) => {
              if (info.instanceID) {
                api.getNodeMap((err: any, nodes: any) => {
                  if (!err && nodes) {
                    const node = nodes[info.instanceID];
                    if (node && node.name) {
                      const nodeName = node.name.toLowerCase();
                      handle3DNodeClick(nodeName);
                    }
                  }
                });
              }
            });

            // Listen to Sketchfab annotation selection
            api.addEventListener('annotationSelect', (index: number) => {
              if (index >= 0) {
                setActiveAnnotation(index);
                // Find organ mapping with annotationId
                mapAnnotationToOrgan(index + 1);
              }
            });
          });
        },
        error: () => {
          console.error('Không thể kết nối đến Sketchfab Viewer API.');
        },
        autostart: 1,
        transparent: 1,
        ui_controls: 1,
        ui_infos: 0,
        ui_watermark: 0,
        annotations_visible: 1
      });
    };

    if ((window as any).Sketchfab) {
      initSketchfab();
    } else {
      script = document.createElement('script');
      script.src = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";
      script.async = true;
      script.onload = initSketchfab;
      document.body.appendChild(script);
    }

    return () => {
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Map clicked 3D node names to our local organs
  const handle3DNodeClick = (nodeName: string) => {
    // Basic search across all organs
    for (const sysKey of Object.keys(SYSTEMS_DATA)) {
      const sys = SYSTEMS_DATA[sysKey];
      for (const organKey of Object.keys(sys.organs)) {
        const organ = sys.organs[organKey];
        if (nodeName.includes(organKey) || 
            nodeName.includes(organ.name.toLowerCase()) || 
            nodeName.includes(organ.englishName.toLowerCase())) {
          setActiveSystemId(sysKey);
          setSelectedOrganKey(organKey);
          setPanelMode('study');
          resetQuizState();
          return;
        }
      }
    }
  };

  // Map Sketchfab annotation ID (1-indexed) to local organ
  const mapAnnotationToOrgan = (annId: number) => {
    for (const sysKey of Object.keys(SYSTEMS_DATA)) {
      const sys = SYSTEMS_DATA[sysKey];
      for (const organKey of Object.keys(sys.organs)) {
        const organ = sys.organs[organKey];
        if (organ.annotationId === annId) {
          setActiveSystemId(sysKey);
          setSelectedOrganKey(organKey);
          setPanelMode('study');
          resetQuizState();
          return;
        }
      }
    }
  };

  // Move camera to selected organ annotation on 3D model
  const focus3DOrgan = (annotationId?: number) => {
    if (viewerApi && annotationId !== undefined) {
      viewerApi.gotoAnnotation(annotationId - 1, {
        preventCameraAnimation: false,
        preventCameraMove: false
      });
    }
  };

  // Handles changing selected organ from UI
  const handleOrganSelect = (sysId: string, organKey: string) => {
    setActiveSystemId(sysId);
    setSelectedOrganKey(organKey);
    setPanelMode('study');
    resetQuizState();
    
    const organ = SYSTEMS_DATA[sysId].organs[organKey];
    if (organ && organ.annotationId) {
      focus3DOrgan(organ.annotationId);
    }
  };

  // Handles switching systems
  const handleSystemSelect = (sysId: string) => {
    setActiveSystemId(sysId);
    const organKeys = Object.keys(SYSTEMS_DATA[sysId].organs);
    const firstOrganKey = organKeys[0];
    setSelectedOrganKey(firstOrganKey);
    setPanelMode('study');
    resetQuizState();

    const organ = SYSTEMS_DATA[sysId].organs[firstOrganKey];
    if (organ && organ.annotationId) {
      focus3DOrgan(organ.annotationId);
    }
  };

  // Fullscreen support
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Standard Quiz helpers
  const resetQuizState = () => {
    setSelectedQuizOption(null);
    setShowQuizFeedback(false);
  };

  const handleQuizSubmit = (opt: string) => {
    setSelectedQuizOption(opt);
    setShowQuizFeedback(true);
    const activeOrgan = SYSTEMS_DATA[activeSystemId].organs[selectedOrganKey];
    if (opt === activeOrgan.answer) {
      setQuizScore(prev => prev + 10);
    }
  };

  // Diagnostic mode helpers
  const handleDiagSelect = (organKey: string) => {
    setDiagSelectedOrgan(organKey);
    setShowDiagFeedback(true);
    const currentCase = DIAGNOSTIC_CASES[currentDiagIndex];
    if (organKey === currentCase.suspectOrgan) {
      setDiagScore(prev => prev + 20);
      setDiagStreak(prev => prev + 1);
    } else {
      setDiagStreak(0);
    }
  };

  const nextDiagnosticCase = () => {
    setDiagSelectedOrgan(null);
    setShowDiagFeedback(false);
    setCurrentDiagIndex((prev) => (prev + 1) % DIAGNOSTIC_CASES.length);
  };

  const activeSystem = SYSTEMS_DATA[activeSystemId];
  const activeOrgan = activeSystem.organs[selectedOrganKey];

  return (
    <div ref={containerRef} className="w-full h-screen bg-khtn8-pastel flex flex-col lg:flex-row font-sans text-slate-800 overflow-hidden select-none">
      {/* 3D Model Area (Left Column / Main) */}
      <div className="flex-1 relative bg-transparent p-4 flex flex-col h-1/2 lg:h-full">
        {/* Floating Headers */}
        <div className="absolute top-6 left-6 z-40 flex flex-wrap gap-3 items-center">
          <button 
            onClick={onBack} 
            className="p-3 rounded-2xl bg-white/80 hover:bg-white text-slate-700 backdrop-blur-xl transition-all shadow-md border border-slate-200 hover:scale-105 active:scale-95 group"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div className="bg-white/80 backdrop-blur-xl px-4 py-2 rounded-2xl border border-slate-200 flex items-center gap-2.5 shadow-sm text-slate-800">
            <HeartPulse className="w-5 h-5 text-rose-500 animate-pulse" />
            <span className="font-extrabold text-slate-800 tracking-wide uppercase text-xs sm:text-sm">Giải Phẫu Cơ Thể Người 3D</span>
          </div>

          <button 
            onClick={toggleFullscreen}
            className="p-3 rounded-2xl bg-white/80 hover:bg-white text-slate-700 backdrop-blur-xl transition-all shadow-sm border border-slate-200"
            title="Toàn màn hình"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>

        {/* Dynamic 3D Viewer Container */}
        <div className="w-full h-full rounded-4xl overflow-hidden border border-slate-200 shadow-xl bg-white/50 relative mt-16 flex-1">
          <iframe 
            ref={iframeRef}
            title="Complete Human Anatomy" 
            src="https://sketchfab.com/models/c904a5a65ae145a0bc535645c7e693af/embed?autostart=1&preload=1&ui_controls=0&ui_infos=0&ui_watermark=0&transparent=1"
            className="w-full h-full border-none bg-radial-gradient"
            allow="autoplay; fullscreen; xr-spatial-tracking; accelerometer; gyroscope; vr"
          />

          {/* Quick System Pill Selector Overlay */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2 p-3.5 bg-white/80 backdrop-blur-2xl rounded-3xl border border-slate-200 w-[92%] max-w-4xl shadow-lg overflow-x-auto">
            {Object.values(SYSTEMS_DATA).map((sys) => {
              const isActive = activeSystemId === sys.id;
              return (
                <button
                  key={sys.id}
                  onClick={() => handleSystemSelect(sys.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all border whitespace-nowrap uppercase tracking-wider ${
                    isActive
                    ? `bg-linear-to-r ${sys.gradient} border-white/10 text-white shadow-md scale-105`
                    : 'bg-white/80 border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-white'
                  }`}
                >
                  {sys.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right AI Assistant & Learning panel */}
      <div className="w-full lg:w-[480px] bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col shadow-2xl z-20 h-1/2 lg:h-full overflow-hidden">
        {/* Header Block */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 relative">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-4 ring-cyan-500/10">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800 tracking-tight uppercase">Trợ lý Giải Phẫu AI</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-extrabold text-emerald-500 tracking-wider uppercase">Giáo sư Y khoa 4.0</span>
              </div>
            </div>
          </div>
          <p className="text-slate-600 text-xs leading-relaxed font-medium">
            "Chào bạn! Hãy khám phá từng hệ cơ quan tinh vi trên cơ thể người, hoặc thử tài khám chữa bệnh trong chế độ Thám tử Y khoa nhé!"
          </p>
          <Sparkles className="absolute top-4 right-4 w-4 h-4 text-cyan-400/30" />
        </div>

        {/* Tab Selection */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex gap-2">
          <button
            onClick={() => setPanelMode('study')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border ${
              panelMode === 'study'
              ? 'bg-white border-slate-200 text-slate-800 shadow-xs font-black'
              : 'bg-transparent border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Học tập
          </button>
          
          <button
            onClick={() => setPanelMode('quiz')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border ${
              panelMode === 'quiz'
              ? 'bg-white border-slate-200 text-slate-800 shadow-xs font-black'
              : 'bg-transparent border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Đố vui
          </button>

          <button
            onClick={() => setPanelMode('diagnostic')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border ${
              panelMode === 'diagnostic'
              ? 'bg-white border-slate-200 text-slate-800 shadow-xs font-black'
              : 'bg-transparent border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <ShieldAlert className="w-4 h-4" /> Lâm sàng
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/30 text-slate-800">
          <AnimatePresence mode="wait">
            
            {/* 1. STUDY MODE */}
            {panelMode === 'study' && (
              <motion.div
                key="study"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* System Intro Card */}
                <div className="p-5 rounded-2xl border bg-white relative overflow-hidden shadow-xs" style={{ borderColor: activeSystem.borderGlow }}>
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10" style={{ backgroundColor: activeSystem.borderGlow }} />
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-slate-50 border border-slate-200 ${activeSystem.textGlow}`}>
                    {activeSystem.englishName}
                  </span>
                  <h3 className="text-xl font-black text-slate-800 mt-2 mb-2 flex items-center gap-2">
                    <Activity className={`w-5 h-5 ${activeSystem.textGlow}`} /> {activeSystem.name}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed font-medium">
                    {activeSystem.description}
                  </p>
                </div>

                {/* Organ Badges Grid */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Chọn cơ quan để quan sát:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(activeSystem.organs).map(([key, organ]) => {
                      const isSelected = selectedOrganKey === key;
                      return (
                        <button
                          key={key}
                          onClick={() => handleOrganSelect(activeSystemId, key)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isSelected
                            ? 'bg-white border-slate-300 shadow-xs'
                            : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700'
                          }`}
                        >
                          <p className={`text-xs font-black ${isSelected ? activeSystem.textGlow : 'text-slate-700'}`}>{organ.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{organ.englishName}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Organ Details */}
                <div className="p-6 rounded-[1.75rem] border border-slate-200 bg-white space-y-4 shadow-xs">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Cấu tạo & Chức năng:</span>
                    <h3 className={`text-2xl font-black mt-1 ${activeSystem.textGlow}`}>{activeOrgan.name}</h3>
                  </div>

                  <p className="text-slate-700 text-xs leading-relaxed font-medium">
                    {activeOrgan.role}
                  </p>

                  <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Bạn có biết?
                    </h5>
                    <p className="text-slate-600 text-xs leading-relaxed italic font-medium">
                      "{activeOrgan.funFact}"
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. ORGAN SPECIFIC QUIZ */}
            {panelMode === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="p-5 rounded-2xl bg-white border border-slate-200 flex justify-between items-center shadow-xs">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Điểm số ôn tập:</span>
                  </div>
                  <span className="text-lg font-black text-amber-500">{quizScore} ⭐</span>
                </div>

                {/* Question Block */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-purple-500" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-500">Câu hỏi ôn tập {activeOrgan.name}:</span>
                  </div>
                  <h3 className="text-slate-800 font-extrabold leading-snug text-sm sm:text-base">
                    "{activeOrgan.question}"
                  </h3>

                  <div className="grid grid-cols-1 gap-2.5 pt-2">
                    {activeOrgan.options.map((opt, idx) => {
                      const isSelected = selectedQuizOption === opt;
                      const isCorrect = opt === activeOrgan.answer;
                      let btnStyle = "bg-white border-slate-200 hover:border-purple-400 hover:bg-purple-50/20 text-slate-700";
                      
                      if (showQuizFeedback) {
                        if (isCorrect) {
                          btnStyle = "bg-emerald-50 border-emerald-300 text-emerald-700 font-bold shadow-xs";
                        } else if (isSelected) {
                          btnStyle = "bg-rose-50 border-rose-300 text-rose-700 font-bold shadow-xs";
                        } else {
                          btnStyle = "bg-slate-50 border-slate-100 text-slate-400";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={showQuizFeedback}
                          onClick={() => handleQuizSubmit(opt)}
                          className={`w-full p-4 rounded-xl border text-left transition-all text-xs font-bold ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback Panel */}
                <AnimatePresence>
                  {showQuizFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-5 rounded-2xl border shadow-sm ${
                        selectedQuizOption === activeOrgan.answer
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-rose-50 border-rose-200 text-rose-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        {selectedQuizOption === activeOrgan.answer 
                          ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          : <XCircle className="w-5 h-5 text-rose-600" />
                        }
                        <h4 className="font-extrabold uppercase text-xs">
                          {selectedQuizOption === activeOrgan.answer ? "Xuất sắc! +10 điểm" : "Chưa chính xác rồi!"}
                        </h4>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed italic font-medium">
                        "{activeOrgan.funFact}"
                      </p>
                      <button 
                        onClick={resetQuizState}
                        className="mt-4 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Thử lại / Trả lời lại
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* 3. CLINICAL DIAGNOSTIC GAME */}
            {panelMode === 'diagnostic' && (
              <motion.div
                key="diagnostic"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Score Tracker */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 flex justify-between items-center shadow-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Kinh nghiệm:</span>
                    <span className="text-sm font-black text-cyan-600">{diagScore} XP</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 flex justify-between items-center shadow-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Chuỗi đúng:</span>
                    <span className="text-sm font-black text-orange-500">🔥 {diagStreak}</span>
                  </div>
                </div>

                {/* Patient Case Sheet */}
                <div className="p-6 rounded-4xl bg-white border border-slate-200 relative overflow-hidden space-y-4 shadow-sm">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl" />
                  
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-600">Hồ sơ bệnh án lâm sàng:</span>
                  </div>

                  <p className="text-slate-800 text-xs sm:text-sm font-bold leading-relaxed">
                    "{DIAGNOSTIC_CASES[currentDiagIndex].symptoms}"
                  </p>

                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Chẩn đoán cơ quan nghi vấn mắc bệnh:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Let students select from a pool of candidate organs */}
                      {Object.keys(activeSystem.organs).map((key) => {
                        const organ = activeSystem.organs[key];
                        const isSelected = diagSelectedOrgan === key;
                        const isCorrect = key === DIAGNOSTIC_CASES[currentDiagIndex].suspectOrgan;
                        
                        let btnStyle = "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-700";
                        
                        if (showDiagFeedback) {
                          if (isCorrect) {
                            btnStyle = "bg-emerald-50 border-emerald-300 text-emerald-700 font-bold shadow-xs";
                          } else if (isSelected) {
                            btnStyle = "bg-rose-50 border-rose-300 text-rose-700 font-bold shadow-xs";
                          } else {
                            btnStyle = "bg-slate-50 border-slate-100 text-slate-400";
                          }
                        }

                        return (
                          <button
                            key={key}
                            disabled={showDiagFeedback}
                            onClick={() => handleDiagSelect(key)}
                            className={`p-3 rounded-xl border text-center text-xs font-black uppercase tracking-wider transition-all ${btnStyle}`}
                          >
                            {organ.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Diagnostic Feedback */}
                <AnimatePresence>
                  {showDiagFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-6 rounded-3xl border shadow-md ${
                        diagSelectedOrgan === DIAGNOSTIC_CASES[currentDiagIndex].suspectOrgan
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {diagSelectedOrgan === DIAGNOSTIC_CASES[currentDiagIndex].suspectOrgan 
                          ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          : <XCircle className="w-5 h-5 text-rose-600" />
                        }
                        <h4 className="font-black uppercase text-xs">
                          {diagSelectedOrgan === DIAGNOSTIC_CASES[currentDiagIndex].suspectOrgan 
                            ? "KẾT LUẬN LÂM SÀNG CHÍNH XÁC!" 
                            : "CHẨN ĐOÁN LÂM SÀNG CHƯA ĐÚNG!"
                          }
                        </h4>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Bệnh lý nghi ngờ:</span>
                          <span className="text-xs font-bold text-slate-800">{DIAGNOSTIC_CASES[currentDiagIndex].organName}</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Phân tích y khoa & Lời khuyên:</span>
                          <p className="text-xs text-slate-600 leading-relaxed italic font-medium">
                            "{DIAGNOSTIC_CASES[currentDiagIndex].medicalAdvice}"
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={nextDiagnosticCase}
                        className="mt-5 w-full py-3.5 bg-linear-to-r from-cyan-500 to-indigo-500 hover:scale-[1.02] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md"
                      >
                        Khám bệnh nhân tiếp theo
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-slate-200 bg-white grid grid-cols-2 gap-4">
          <button 
            onClick={() => setPanelMode('quiz')}
            className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl transition-all text-xs font-black uppercase tracking-widest shadow-sm ${
              panelMode === 'quiz'
              ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-200'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <BrainCircuit className="w-4 h-4" /> Câu Đố
          </button>
          
          <button 
            onClick={() => setPanelMode('diagnostic')}
            className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl transition-all text-xs font-black uppercase tracking-widest shadow-sm ${
              panelMode === 'diagnostic'
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-200'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Stethoscope className="w-4 h-4" /> Khám bệnh
          </button>
        </div>
      </div>
    </div>
  );
}
