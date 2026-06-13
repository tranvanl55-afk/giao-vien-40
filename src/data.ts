import { 
  Flask, ClipboardText, BookOpenText, GameController, Robot, Lightbulb, Atom, 
  RocketLaunch, ArrowDown, Wrench, Sun, Lightning, Hexagon, Target, Drop, Wind,
  PersonSimpleRun, BowlFood, Scales, Presentation, Brain, Network, Leaf
} from '@phosphor-icons/react';


export interface SubCategory {
  id: string;
  title: string;
  description: string;
  contentUrl?: string; // for iframe integrations
  logoUrl?: string; // for AI tools logos
  colorClass?: string; // for individual colorful cards
  embedDocs?: { title: string; url: string }[];
  lessons?: {
    id: string;
    title: string;
    description: string;
    icon: any; // Lucide icon
    logoUrl?: string; // For 3D icons
    theme: "blue" | "orange" | "purple" | "green" | "red";
  }[];
  group?: string; // category group for filtering
}

export interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: any; // Lucide icon
  logoUrl?: string; // For 3D icons
  colorClass: string;
  subCategories: SubCategory[];
}

export const categories: Category[] = [
  {
    id: "thi-nghiem",
    title: "Thí nghiệm mô phỏng",
    subtitle: "Phòng thực hành ảo 3D",
    icon: Flask,
    logoUrl: "/images/thi-nghiem-mo-phong-transparent.png",
    colorClass: "from-blue-400 via-cyan-500 to-indigo-600",
    subCategories: [
      { 
        id: "khtn-6", 
        title: "Khoa học tự nhiên 6", 
        description: "Thực hành ảo Vật lý, Hóa học, Sinh học lớp 6", 
        colorClass: "hover:bg-blue-500/20 hover:border-blue-500/50", 
        logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2FKHTN_6-removebg-preview.png?alt=media&token=0caabd3c-3353-475e-966d-e316da281e70",
        lessons: [
          {
            id: "te-bao",
            title: "Mô Phỏng Tế Bào 3D",
            description: "Khám phá và tương tác cấu tạo của tế bào động vật, tế bào thực vật, và tế bào nhân sơ.",
            icon: Hexagon,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Ft%E1%BA%BF_b%C3%A0o-removebg-preview.png?alt=media&token=4cb4429b-c29e-44d3-84ec-0bf227417149",
            theme: "green"
          },
          {
            id: "vi-khuan",
            title: "Mô Phỏng Hình Dạng Vi Khuẩn",
            description: "Tìm hiểu các loại hình dạng phổ biến của vi khuẩn trong tự nhiên qua mô hình 3D tương tác.",
            icon: Atom,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fvi_khu%E1%BA%A9n-removebg-preview.png?alt=media&token=4ae8827b-2d26-4a62-94ab-09cb85933d26",
            theme: "blue"
          },
          {
            id: "virus",
            title: "Mô Phỏng Virus 3D",
            description: "Tìm hiểu các dạng hình học của virus trong tự nhiên và giải phẫu cấu trúc phân tử của virus Corona.",
            icon: Atom,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fvirus-removebg-preview.png?alt=media&token=6a67f47d-9fb5-4c38-b4e9-b9e865e1c9f2",
            theme: "red"
          },
          {
            id: "nguyen-sinh-vat",
            title: "Mô Phỏng Nguyên Sinh Vật",
            description: "Quan sát cấu trúc chuỗi tảo lam tự dưỡng và tập tính săn mồi của trùng cỏ Didinium đơn bào.",
            icon: Atom,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fngueyen_sinh_v%E1%BA%ADt-removebg-preview.png?alt=media&token=59c9dc24-d4a8-4069-b1ad-c105859cad4f",
            theme: "purple"
          },
          {
            id: "bieu-dien-luc",
            title: "Mô Phỏng Biểu Diễn Lực",
            description: "Thực hành từng bước biểu diễn lực: chọn loại lực, độ lớn lực và vẽ mũi tên biểu diễn theo tỉ xích.",
            icon: Scales,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fbi%E1%BB%83u_di%E1%BB%85n_l%E1%BB%B1c-removebg-preview.png?alt=media&token=8b21498a-18f0-4634-83e1-755720cb6dbc",
            theme: "orange"
          },
          {
            id: "chuyen-the",
            title: "Sự Chuyển Thể Của Chất",
            description: "Quan sát trực tiếp ở mức độ phân tử: từ thể rắn (băng) → lỏng (nước) → khí (hơi nước) khi thay đổi nhiệt độ từ -50°C đến 150°C.",
            icon: Atom,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fchueyenr%20th%E1%BB%83%20rmg.png?alt=media&token=f4ee1c33-ae73-49fa-b7c2-89635b1e212c",
            theme: "blue"
          },
          {
            id: "he-mat-troi",
            title: "Hệ Mặt Trời 3D",
            description: "Khám phá hệ Mặt Trời 3D tương tác: xem quỹ đạo 8 hành tinh, tăng tốc thời gian và tìm hiểu thông tin từng hành tinh.",
            icon: Sun,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fh%E1%BB%87%20m%E1%BA%B7t%20tr%E1%BB%9Di%20rmg.png?alt=media&token=22792d5c-32b2-4e74-9947-269a114a2476",
            theme: "orange"
          },
          {
            id: "tach-hon-hop",
            title: "Phân Tách Hỗn Hợp",
            description: "Chọn đúng dụng cụ thực hành (giấy lọc, phễu chiết, nam châm, bay hơi) để tách 4 loại hỗn hợp khác nhau.",
            icon: Drop,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Ft%C3%A1ch-removebg-preview.png?alt=media&token=06be9f5c-d19d-4c46-9fbf-cc508ec07ba7",
            theme: "green"
          }
        ]
      },
      { 
        id: "khtn-7", 
        title: "Khoa học tự nhiên 7", 
        description: "Thực hành ảo Vật lý, Hóa học, Sinh học lớp 7", 
        colorClass: "hover:bg-cyan-500/20 hover:border-cyan-500/50",
        logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2FKHTN%207.png?alt=media&token=77f9ba10-9436-4eda-b88f-4c7ebb03267a",
        lessons: [
          {
            id: "bang-tuan-hoan",
            title: "Bảng Tuần Hoàn Thông Minh",
            description: "Khám phá bảng tuần hoàn hóa học tương tác với chi tiết từng nguyên tố.",
            icon: Hexagon,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2FB%E1%BA%A3ng_tu%E1%BA%A7n_ho%C3%A0n-removebg-preview.png?alt=media&token=bd88a3a1-21c1-4e05-8bfd-3ffd3209ab4c",
            theme: "green"
          },
          {
            id: "lien-ket-ion",
            title: "Liên Kết Ion 3D",
            description: "Mô phỏng tương tác quá trình hình thành liên kết ion (NaCl, MgO).",
            icon: Target,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fion-removebg-preview.png?alt=media&token=7459a940-6811-48ce-ad0f-1988e45aed21",
            theme: "orange"
          },
          {
            id: "lien-ket-cong-hoa-tri",
            title: "Liên Kết Cộng Hóa Trị",
            description: "Mô phỏng quá trình dùng chung electron tạo liên kết cộng hóa trị.",
            icon: Target,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fc%E1%BB%99ng_h%C3%B3a_tr%E1%BB%8B-removebg-preview.png?alt=media&token=b182fb54-d377-46f0-8f64-5c4317683759",
            theme: "blue"
          },
          {
            id: "do-thi-quang-duong",
            title: "Đồ Thị Quãng Đường",
            description: "Thực hành từng bước vẽ đồ thị quãng đường - thời gian từ bảng số liệu.",
            icon: Target,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2F%C4%91%E1%BB%93_th%E1%BB%8B-removebg-preview.png?alt=media&token=d7b0ef59-9c0d-4999-888b-83d53a89d9bb",
            theme: "purple"
          },
          {
            id: "bong-toi-nua-toi",
            title: "Bóng Tối & Bóng Nửa Tối",
            description: "Mô phỏng sự hình thành bóng tối và bóng nửa tối đằng sau vật cản sáng.",
            icon: Sun,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fb%C3%B3ng_t%E1%BB%91i-removebg-preview.png?alt=media&token=6e4aec24-3d11-4cc3-8fd5-d778653c5773",
            theme: "orange"
          },
          {
            id: "kien-tao-nguyen-tu",
            title: "Kiến Tạo Nguyên Tử",
            description: "Tự tay lắp ráp Proton, Neutron và Electron để xây dựng nguyên tử. Mô hình Bohr tự động cập nhật theo số hạt được thêm vào.",
            icon: Atom,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fki%E1%BA%BFn%20t%E1%BA%A1o%20rmg.png?alt=media&token=034345ea-d2b1-4595-973a-917855f3c642",
            theme: "purple"
          },
          {
            id: "phan-xa-anh-sang",
            title: "Phản Xạ Ánh Sáng",
            description: "Điều chỉnh góc gương và hướng laser để quan sát tia phản xạ. Kiểm chứng Định luật phản xạ ánh sáng: góc tới = góc phản xạ.",
            icon: Lightning,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fph%E1%BA%A3n_x%E1%BA%A1-removebg-preview.png?alt=media&token=0abe9394-c287-4a30-a066-5b7576a521fd",
            theme: "orange"
          },
          {
            id: "quang-hop",
            title: "Quang Hợp & Hô Hấp",
            description: "Điều chỉnh cường độ ánh sáng, lượng CO₂ và nước để quan sát tốc độ quang hợp thay đổi theo thời gian thực trên mô phỏng lá cây.",
            icon: Leaf,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fquang_h%C6%A1pk-removebg-preview.png?alt=media&token=dc0e7437-ac7c-49db-8e66-1bbb98a6ca98",
            theme: "green"
          }
        ]
      },
      { 
        id: "khtn-8", 
        title: "Khoa học tự nhiên 8", 
        description: "Thực hành ảo Vật lý, Hóa học, Sinh học lớp 8", 
        colorClass: "hover:bg-indigo-500/20 hover:border-indigo-500/50", 
        logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fkhtn8-removebg-preview.png?alt=media&token=d14c2b32-d682-450a-9dfb-2d7b8c5fcf68",
        lessons: [
          {
            id: "cac-he-co-quan",
            title: "Các Hệ Cơ Quan Trong Cơ Thể Người",
            description: "Khám phá cấu tạo tích hợp của các hệ cơ quan (Hệ tuần hoàn, hệ hô hấp, hệ tiêu hóa, hệ thần kinh...) qua mô hình giải phẫu 3D.",
            icon: Atom,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fc%C6%A1_th%E1%BB%83_ng%C6%B0%E1%BB%9Di-removebg-preview.png?alt=media&token=9568b511-2d33-44dc-a31c-5a4567379639",
            theme: "purple"
          },
          {
            id: "moi-truong-trong-co-the",
            title: "Môi trường trong cơ thể",
            description: "Mô phỏng sự trao đổi chất qua dịch mô, mao mạch máu và bạch huyết.",
            icon: Drop,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fmoi_tr%C6%B0%E1%BB%9Dng_trong-removebg-preview.png?alt=media&token=af0b780e-71ff-4c85-ba27-13154bd74926",
            theme: "red"
          },
          {
            id: "he-ho-hap",
            title: "Hệ Hô Hấp",
            description: "Khám phá cấu tạo, chức năng và các bệnh lý hệ hô hấp cùng Bác sĩ Nhí AI.",
            icon: Wind,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fh%E1%BB%87_h%C3%B4_h%E1%BA%A5p-removebg-preview.png?alt=media&token=81555987-8264-4b7c-8365-1c7e69a50c85",
            theme: "blue"
          },
          {
            id: "he-van-dong",
            title: "Hệ Vận Động",
            description: "Khám phá hệ cơ và xương người qua mô hình 3D sinh động.",
            icon: PersonSimpleRun,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fh%E1%BB%87_v%E1%BA%ADn_%C4%91%C3%B4ng-removebg-preview.png?alt=media&token=e306ad6e-5ba1-4b43-9e2c-7c107a021761",
            theme: "green"
          },
          {
            id: "he-tieu-hoa",
            title: "Hệ Tiêu Hóa",
            description: "Tìm hiểu quá trình biến đổi thức ăn và hấp thụ dinh dưỡng.",
            icon: BowlFood,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fh%E1%BB%87_ti%C3%AAu_h%C3%B3a-removebg-preview.png?alt=media&token=f2a37f28-bb39-494a-abf0-976d3be2bd03",
            theme: "orange"
          },
          {
            id: "so-do-mach-dien",
            title: "Sơ Đồ Mạch Điện Ảo",
            description: "Thực hành kéo thả lắp ráp mạch điện ảo, tự động giải mạch điện theo định luật Ôm thời gian thực.",
            icon: Lightning,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fs%C6%A1_%C4%91%E1%BB%93_m%E1%BA%A1ch_%C4%91i%E1%BB%87n-removebg-preview.png?alt=media&token=0289a52f-0be3-4c28-a477-70425735e081",
            theme: "blue"
          },
          {
            id: "dinh-luat-bao-toan-khoi-luong",
            title: "Định Luật Bảo Toàn Khối Lượng 3D",
            description: "Thực hành ảo cân đo đong đếm các phản ứng hóa học hệ kín và hệ hở để hiểu sâu về Định luật bảo toàn khối lượng.",
            icon: Scales,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2F%C4%91%E1%BB%8Bnh_lu%E1%BA%ADt-removebg-preview.png?alt=media&token=c749ff6e-c321-41ff-a19d-15dc04b44719",
            theme: "purple"
          },
          {
            id: "luc-day-archimedes",
            title: "Lực Đẩy Archimedes",
            description: "Thả các vật liệu vào chất lỏng khác nhau và quan sát lực nổi. Dùng lực kế ảo đo lực đẩy Archimedes để kiểm chứng định luật.",
            icon: Drop,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fl%E1%BB%B1c_%C4%91%E1%BA%A9y-removebg-preview.png?alt=media&token=672a3380-cf01-431a-aa77-0c7f55e3b1b1",
            theme: "blue"
          },
          {
            id: "don-bay-rong-roc",
            title: "Đòn Bẩy & Ròng Rọc",
            description: "Mô phỏng đòn bẩy bập bênh (di chuyển điểm tựa) và hệ thống ròng rọc cố định/động để khám phá nguyên lý lợi lực cơ học.",
            icon: Scales,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2F%C4%91%C3%B2n_b%E1%BA%A9y-removebg-preview.png?alt=media&token=dbe4d0e2-35e1-4876-9862-53706eeaf90d",
            theme: "orange"
          },
          {
            id: "co-xuong-khop",
            title: "Cơ - Xương - Khớp",
            description: "Click vào cơ nhị đầu và tam đầu để xem hoạt động co/duỗi cơ, chuyển động xương và nguyên lý cơ đối kháng trong cánh tay người.",
            icon: PersonSimpleRun,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fc%C6%A1_x%C6%B0%C6%A1ng_kh%E1%BB%9Bp-removebg-preview.png?alt=media&token=80d57e1a-7522-44e0-b1aa-36754a0aeaf1",
            theme: "red"
          }
        ]
      },
      { 
        id: "khtn-9", 
        title: "Khoa học tự nhiên 9", 
        description: "Thực hành ảo Vật lý, Hóa học, Sinh học lớp 9", 
        colorClass: "hover:bg-purple-500/20 hover:border-purple-500/50",
        logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fkhtn9-rmg.png?alt=media&token=1c8a9a2a-9a44-45c5-992f-5f6aac95e2f0",
        lessons: [
          {
            id: "co-nang",
            title: "Cơ Năng",
            description: "Khám phá sự chuyển hóa giữa Động năng và Thế năng trong chuyển động rơi tự do.",
            icon: ArrowDown,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fc%C6%A1_n%C4%83ng-removebg-preview.png?alt=media&token=cc5d37b2-9526-4caf-9176-73a6de82b232",
            theme: "blue"
          },
          {
            id: "cong-suat",
            title: "Công & Công Suất",
            description: "Tìm hiểu khái niệm Công cơ học và Công suất thông qua mô phỏng vận hành cần cẩu.",
            icon: Wrench,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fc%C3%B4ng-removebg-preview.png?alt=media&token=63e3a497-2cf6-439e-94d9-fc821ea2491e",
            theme: "orange"
          },
          {
            id: "khuc-xa",
            title: "Khúc Xạ Ánh Sáng",
            description: "Mô phỏng đường đi của tia sáng qua các môi trường và hiện tượng Phản xạ toàn phần.",
            icon: Sun,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fkh%C3%BAc_x%E1%BA%A1-removebg-preview.png?alt=media&token=013f6996-144a-4225-afb1-1aba9cd8ccbb",
            theme: "purple"
          },
          {
            id: "dong-dien",
            title: "Dòng Điện Không Đổi",
            description: "Lắp ráp mạch điện nối tiếp, song song và đo đạc các thông số U, I, R trực quan.",
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fd%C3%B2ng_%C4%91i%E1%BB%87n-removebg-preview%20(1).png?alt=media&token=b90e56da-ffe8-4a9d-a843-d489b525c611",
            icon: Lightning,
            theme: "green"
          },
          {
            id: "cam-ung",
            title: "Cảm Ứng Điện Từ",
            description: "Khám phá hiện tượng sinh ra dòng điện xoay chiều khi thay đổi từ thông qua cuộn dây.",
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fc%E1%BA%A3m_%E1%BB%A9ng-removebg-preview.png?alt=media&token=f7fa4d8e-af77-4525-8480-e7f442d7bd00",
            icon: Lightning,
            theme: "red"
          },
          {
            id: "kim-loai",
            title: "Dãy Hoạt Động Hóa Học",
            description: "Thí nghiệm phản ứng của các kim loại khác nhau với nước, axit và muối.",
            icon: Atom,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fd%C3%A3y_h%C4%91-removebg-preview.png?alt=media&token=0bda26c4-f5b6-4496-8298-da2257b46771",
            theme: "orange"
          },
          {
            id: "hop-chat-huu-co",
            title: "Cấu Tạo Hợp Chất Hữu Cơ",
            description: "Thí nghiệm mô phỏng và lắp ráp cấu tạo các hợp chất hữu cơ.",
            icon: Hexagon,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fctct-removebg-preview.png?alt=media&token=6d9b9819-a39a-4f29-8a7e-68d966154fe9",
            theme: "green"
          },
          {
            id: "thau-kinh",
            title: "Thấu Kính Quang Học",
            description: "Kéo vật thật qua tiêu điểm F của thấu kính hội tụ và phân kỳ để quan sát sự tạo ảnh thật/ảo theo công thức 1/f = 1/d + 1/d'.",
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fth%E1%BA%A5u_k%C3%ADnh-removebg-preview.png?alt=media&token=291215d3-c6ef-40bf-8baa-af97f9deed2c",
            icon: Sun,
            theme: "purple"
          },
          {
            id: "dot-bien-gen",
            title: "Đột Biến Gen",
            description: "Chủ động gây đột biến mất, thêm hoặc thay thế cặp nucleotide trên mạch ADN và quan sát hậu quả lên chuỗi mARN và Protein.",
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2F%C4%91%E1%BB%99t_bi%E1%BA%BFn-removebg-preview%20(1).png?alt=media&token=8237491f-5ace-4459-89da-328c9664c65b",
            icon: Hexagon,
            theme: "red"
          },
          {
            id: "dong-co-mot-chieu",
            title: "Cảm Ứng Điện Từ & Faraday",
            description: "Kéo nam châm vào/ra cuộn dây để sinh ra dòng điện cảm ứng. Quan sát chiều lệch của kim điện kế theo Định luật Faraday.",
            icon: Lightning,
            theme: "blue"
          }
        ]
      },
      { 
        id: "hoat-dong-trai-nghiem", 
        title: "Hoạt động trải nghiệm - Hướng nghiệp", 
        description: "Các bài mô phỏng hoạt động trải nghiệm và định hướng nghề nghiệp", 
        colorClass: "hover:bg-rose-500/20 hover:border-rose-500/50",
        logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fhdtn-removebg-preview.png?alt=media&token=12e82f80-b9d8-4a9f-b3c7-43ccc64add63",
        lessons: [
          {
            id: "dinh-huong-nghe-nghiep",
            title: "Hệ thống Đánh giá Năng lực",
            description: "Trắc nghiệm tương tác xác định nhóm nghề nghiệp phù hợp dựa trên mô hình Holland.",
            icon: Target,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2F%C4%91%C3%A1nh_gi%C3%A1_n%C4%83ng_l%E1%BB%B1c-removebg-preview.png?alt=media&token=8d025c61-0c2d-488a-aacf-6101a1154d8e",
            theme: "purple"
          },
          {
            id: "thuoc-do-cam-xuc",
            title: "Thước đo Cảm xúc Gia đình",
            description: "Trò chơi nhập vai rèn luyện kỹ năng quản lý cảm xúc và giải quyết xung đột gia đình.",
            icon: Brain,
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fth%C6%B0%E1%BB%9Bc_%C4%91o_c%E1%BA%A3m_x%C3%BAc-removebg-preview.png?alt=media&token=0b05d5cd-e8b6-4465-8e0b-217973d34a9b",
            theme: "red"
          },
          {
            id: "xu-ly-khung-hoang",
            title: "Xử lý Khủng hoảng Học đường",
            description: "Trò chuyện xử lý tình huống bạo lực mạng và xây dựng môi trường học đường tôn trọng.",
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fx%E1%BB%AD_l%C3%BD_khrung_ho%E1%BA%A3ng-removebg-preview.png?alt=media&token=36c56760-8d48-461c-8de0-a5157736e4d5",
            icon: Robot,
            theme: "blue"
          },
          {
            id: "khoi-nghiep-cong-dong",
            title: "Khởi nghiệp vì Cộng đồng",
            description: "Quản trị ngân sách, định giá và marketing cho một dự án kinh doanh tái chế bảo vệ môi trường.",
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fkh%E1%BB%9Fi_nghi%E1%BB%87p-removebg-preview.png?alt=media&token=de766bed-58da-4f6b-8b9d-be340a081d3d",
            icon: Network,
            theme: "green"
          },
          {
            id: "balo-sinh-ton",
            title: "Balo Sinh Tồn Trước Bão",
            description: "Thử thách chọn nhanh đồ dùng thiết yếu vào balo trong vòng 60 giây khi có cảnh báo thiên tai.",
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fbalo-removebg-preview.png?alt=media&token=3ecc9c8b-c6c4-4a5b-9da2-71313c7a7e47",
            icon: Leaf,
            theme: "orange"
          },
          {
            id: "thiet-ke-tuong-lai",
            title: "Thiết kế Lộ trình Tương lai",
            description: "Xây dựng kế hoạch học tập chi tiết, sắp xếp nhiệm vụ cân đối để chinh phục ước mơ nghề nghiệp.",
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fl%E1%BB%99_tr%C3%ACnh_t%C6%B0%C6%A1ng_l%E1%BA%A1i-removebg-preview.png?alt=media&token=7869ecb8-e039-4020-8885-49b88b13fd63",
            icon: Presentation,
            theme: "purple"
          }
        ]
      },
    ]
  },
  {
    id: "on-tap",
    title: "Ôn tập và kiểm tra",
    subtitle: "Ngân hàng câu hỏi & Đề thi",
    icon: ClipboardText,
    logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2F%C3%B4n_t%E1%BA%ADp-removebg-preview.png?alt=media&token=d032eaa3-4aef-4290-ae19-a05eeee7b0f6",
    colorClass: "from-emerald-400 via-green-500 to-teal-600",
    subCategories: [
      { id: "test-gk", title: "Đề thi Giữa kì", description: "Bộ đề tham khảo Khối 6, 7, 8, 9 với ma trận chi tiết", colorClass: "hover:bg-emerald-500/20 hover:border-emerald-500/50", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2F%C4%91%E1%BB%81_thi-removebg-preview.png?alt=media&token=2481e720-6fac-4189-b5dd-286b35dc301e" },
      { id: "test-ck", title: "Đề thi Cuối kì", description: "Luyện đề trắc nghiệm online chấm điểm tức thì", colorClass: "hover:bg-teal-500/20 hover:border-teal-500/50", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2F%C4%91%E1%BB%81_thi-removebg-preview.png?alt=media&token=2481e720-6fac-4189-b5dd-286b35dc301e" },
      { 
        id: "phieu-bai-hoc", 
        title: "Tạo Phiếu Bài Học (Sketchnote)", 
        description: "Dùng AI chuyển sách giáo khoa thành Sketchnote sinh động 🎨", 
        colorClass: "hover:bg-indigo-500/20 hover:border-indigo-500/50",
        logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fsketch-removebg-preview.png?alt=media&token=1e7abce3-68df-49f6-8bb1-7b7435b50e69",
      },
      { 
        id: "mindmap-app", 
        title: "Tạo Sơ Đồ Tư Duy Bằng AI", 
        description: "Phân tích ảnh tài liệu thành Sơ đồ tư duy dạng nhánh trực quan 🧠", 
        colorClass: "hover:bg-cyan-500/20 hover:border-cyan-500/50",
        logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fs%C6%A1_%C4%91%E1%BB%93_t%C6%B0_duy-removebg-preview.png?alt=media&token=9fd04832-a5a0-4d34-86fd-c85f9afdb2ae",
      },
      { 
        id: "app-tao-de", 
        title: "Tạo Đề Thi Bằng AI", 
        description: "Ôn tập vui 🚀 - Nền tảng tạo đề thi tự động từ ảnh", 
        colorClass: "hover:bg-purple-500/20 hover:border-purple-500/50",
        logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Ft%E1%BA%A1o_%C4%91%E1%BB%81_thi-removebg-preview.png?alt=media&token=a0b6c963-edc9-4777-b42c-7fb10a05ae62",
        lessons: [
          {
            id: "tao-de-kiem-tra",
            title: "Trình Sinh Đề Từ Ảnh",
            description: "Chụp ảnh sách giáo khoa, AI sẽ phân tích và tạo ngay bài kiểm tra ôn tập hiệu quả.",
            icon: RocketLaunch,
            theme: "purple"
          }
        ]
      }
    ]
  },
  {
    id: "e-learning",
    title: "E-learning",
    subtitle: "Bài giảng điện tử & Tài liệu số",
    icon: BookOpenText,
    logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2FElearning-removebg-preview.png?alt=media&token=f0117924-7d35-4238-834f-1f912f40d756",
    colorClass: "from-violet-400 via-purple-500 to-fuchsia-600",
    subCategories: [
      { id: "bg-khtn", title: "Bài giảng KHTN", description: "Kho tàng bài giảng điện tử sinh động", colorClass: "hover:bg-violet-500/20 hover:border-violet-500/50", logoUrl: "https://img.icons8.com/fluency/96/presentation.png" },
      { id: "docs-sgk", title: "Tài liệu bồi dưỡng", description: "Kho tài liệu đọc mở rộng và nâng cao", colorClass: "hover:bg-purple-500/20 hover:border-purple-500/50", logoUrl: "https://img.icons8.com/fluency/96/books.png" },
    ]
  },
  {
    id: "tro-choi",
    title: "Trò chơi học tập",
    subtitle: "Chơi để học, học để chơi",
    icon: GameController,
    logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fgame-removebg-preview.png?alt=media&token=2ed1f26a-a6ff-4e35-9772-d6727b29667f",
    colorClass: "from-pink-400 via-rose-500 to-red-600",
    subCategories: [
      { id: "game-hub", title: "Ngân hàng câu hỏi", description: "Lưu trữ câu hỏi cho các trò chơi — nhập thủ công hoặc quét ảnh bằng AI 📚", colorClass: "hover:bg-violet-500/20 hover:border-violet-500/50", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fng%C3%A2n_h%C3%A0ng_c%C3%A2u_h%E1%BB%8Fi-removebg-preview.png?alt=media&token=ac5107bb-4aab-41f8-83eb-386233738c11" },
      { id: "game-action-quiz", title: "Cùng nhau vận động", description: "Bật tung kiến thức - Trò chơi hành động trả lời câu hỏi", colorClass: "hover:bg-red-500/20 hover:border-red-500/50", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fc%C3%B9ng_nhau_v%E1%BA%ADn_%C4%91%E1%BB%99ng-removebg-preview.png?alt=media&token=40ce99ab-98ec-44cf-9c22-6a636bc4f98b",
        lessons: [
          {
            id: "action-quiz-game",
            title: "Cùng nhau vận động",
            description: "Chinh phục điểm số và tránh bẫy bằng cách trả lời thuật toán.",
            logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fc%C3%B9ng_nhau_v%E1%BA%ADn_%C4%91%E1%BB%99ng-removebg-preview.png?alt=media&token=40ce99ab-98ec-44cf-9c22-6a636bc4f98b",
            icon: RocketLaunch,
            theme: "orange"
          }
        ]
      },
      { id: "game-world-explorer", title: "Khám Phá Thế Giới", description: "Trò chơi trắc nghiệm vượt ải theo chủ đề tự nhiên", colorClass: "hover:bg-green-500/20 hover:border-green-500/50", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fkh%C3%A1m_ph%C3%A1_th%E1%BA%BF_gi%E1%BB%9Bi-removebg-preview.png?alt=media&token=348022b3-50b9-4900-a811-cc2be4764b95",
        lessons: [
          {
            id: "world-explorer-game",
            title: "Khám Phá Thế Giới",
            description: "Vượt qua các ải tự nhiên bằng cách trả lời các câu hỏi.",
            icon: RocketLaunch,
            theme: "green"
          }
        ]
      },
      { id: "game-duck-race", title: "Đua Vịt Gọi Tên", description: "Trả lời câu hỏi KHTN để vịt của bạn về đích trước 3 đối thủ! 🦆", colorClass: "hover:bg-yellow-500/20 hover:border-yellow-500/50", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2F%C4%91ua_v%E1%BB%8Bt-removebg-preview.png?alt=media&token=1a850b85-12b2-4631-93db-b865918bbcd6" },
      { id: "game-star-race", title: "Cuộc Đua Ngôi Sao", description: "2 đội cùng trả lời câu hỏi đồng thời trên 2 nửa màn hình — đội giành 10 ⭐ trước thắng!", colorClass: "hover:bg-yellow-500/20 hover:border-yellow-500/50", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fcu%E1%BB%99c_%C4%91ua_ng%C3%B4i_sao-removebg-preview.png?alt=media&token=166600dd-d3f0-47c2-8349-f25708f26bc8" },
      { id: "game-puzzle-flip", title: "Lật Mảnh Ghép", description: "Giáo viên cài ảnh bí ẩn, học sinh trả lời đúng để lật từng mảnh và đoán nội dung 🧩", colorClass: "hover:bg-fuchsia-500/20 hover:border-fuchsia-500/50", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fl%E1%BA%ADt_m%E1%BA%A3nh_gh%C3%A9p-removebg-preview.png?alt=media&token=00b1a2e0-bad6-4e40-b15a-6f50de9b14c2" },
      { id: "game-spin-wheel", title: "Vòng Quay Gọi Tên", description: "Quay vòng quay ngẫu nhiên để chọn học sinh — nhập danh sách tên và bắt đầu! 🎡", colorClass: "hover:bg-teal-500/20 hover:border-teal-500/50", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fv%C3%B2ng_quay-removebg-preview.png?alt=media&token=cb957052-3341-459f-8665-11e65b541418" },
      { id: "game-keo-co", title: "Kéo Co Kiến Thức", description: "2 đội kéo dây bằng cách trả lời câu hỏi — đội nào kéo sợi dây về phía mình trước thắng! ⚔️", colorClass: "hover:bg-red-500/20 hover:border-red-500/50", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fk%C3%A9o_co-removebg-preview.png?alt=media&token=8c7a6aa3-fc3a-4d4e-bf6d-d0d0afc3d70e" },
      { id: "game-doi-khang", title: "Game Đối Kháng", description: "Buzzer 1v1 — ai nhấn trước được trả lời, đội đạt 10 điểm trước chiến thắng! ⚡", colorClass: "hover:bg-pink-500/20 hover:border-pink-500/50", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2F%C4%91%E1%BB%91i%20kh%C3%A1ng%20rmg.png?alt=media&token=ce2db996-1841-40f8-8246-2e5d6e69190b" },
      { id: "game-chem-hoa-qua", title: "Chém Hoa Quả", description: "Click vào quả cây mang đáp án đúng để ghi điểm — sai mất tim! 🍎", colorClass: "hover:bg-green-500/20 hover:border-green-500/50", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fch%C3%A9m_tr%C3%A1i_c%C3%A2y-removebg-preview.png?alt=media&token=ff9140ef-3447-402e-9dba-8bd54ca491f1" },
      { id: "game-theo-luot", title: "Game Theo Lượt", description: "Tung xúc xắc, di chuyển trên bàn cờ 25 ô, trả lời câu hỏi để giữ vị trí — 2–4 người chơi! 🎲", colorClass: "hover:bg-amber-500/20 hover:border-amber-500/50", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fgame_theo_l%C6%B0%E1%BB%A3t-removebg-preview.png?alt=media&token=58315c4b-9201-4371-b197-82d5b7c43a8a" },
      { id: "game-quiz", title: "Đố Vui Khoa Học", description: "Trả lời câu hỏi khoa học để kích hoạt siêu năng lực vượt chướng ngại vật! Chọn avatar, 3 mạng, giới hạn thời gian cực kịch tính! 🏆", colorClass: "hover:bg-orange-500/20 hover:border-orange-500/50", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2F%C4%91%E1%BB%91_vui-removebg-preview.png?alt=media&token=b096c8f7-0557-466f-b0bc-162ba3e0c632" },
      { id: "game-crossword", title: "Ô Chữ Khoa Học", description: "Giáo viên thiết kế ô chữ, học sinh giải câu hỏi để tìm từ khóa bí ẩn! 🧩", colorClass: "hover:bg-violet-500/20 hover:border-violet-500/50", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2F%C3%B4_ch%E1%BB%AF_khoa_h%E1%BB%8Dc-removebg-preview.png?alt=media&token=f0cb135b-84bb-48e9-b8aa-fdc15afdf13a" },
      { id: "game-giai-ma-buc-tranh", title: "Giải Mã Bức Tranh", description: "Trả lời đúng câu hỏi để mở khóa từng mảnh ghép và khám phá bức tranh bí ẩn đằng sau! 🖼️", colorClass: "hover:bg-cyan-500/20 hover:border-cyan-500/50", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fgi%E1%BA%A3i_m%C3%A3_b%E1%BB%A9c_tranh-removebg-preview.png?alt=media&token=a86d2ca7-531a-4e98-8a39-ba05acc73494" },
      { id: "game-dai-duong-ma-thuat", title: "Đại Dương Ma Thuật", description: "Quản lý lớp học sinh động với những chú sứa phát sáng. Gọi tên ngẫu nhiên bằng cách giơ ngón tay trước màn hình! 🪼", colorClass: "hover:bg-blue-500/20 hover:border-blue-500/50", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2F%C4%91%E1%BA%A1i_d%C6%B0%C6%A1ng_ma_thu%E1%BA%ADt-removebg-preview.png?alt=media&token=9efe7408-bfd0-4df1-a2c2-b95256ae0ced" },
      { id: "game-ai-la-trieu-phu", title: "Ai Là Triệu Phú", description: "Vượt qua 15 câu hỏi trắc nghiệm hóc búa với sự trợ giúp của khán giả, người thân để giành giải thưởng 150 triệu! 💰", colorClass: "hover:bg-amber-500/20 hover:border-amber-500/50", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fai_l%C3%A0_tri%E1%BB%87u_ph%C3%BA-removebg-preview.png?alt=media&token=9fa001c0-9d5d-4b96-a721-0799ed5c96a8" },
    ]
  },
  {
    id: "van-ban-thong-minh",
    title: "Văn bản thông minh",
    subtitle: "Trợ lý văn bản tự động",
    icon: ClipboardText,
    logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fvbtm-removebg-preview.png?alt=media&token=7dac9928-30c7-469c-a003-5b88379495fa",
    colorClass: "from-blue-400 via-cyan-500 to-teal-600",
    subCategories: [
      { id: "skkn-nd30", title: "Định dạng văn bản ND30", description: "Tải lên tệp Word và tự động định dạng chuẩn Nghị định 30/2020/NĐ-CP về công tác văn thư — phông chữ, định lề, số ký hiệu, tiêu đề đúng quy chuẩn.", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2F%C4%91%E1%BB%8Bnh_d%E1%BA%A1ng_v%C4%83n_b%E1%BA%A3n-removebg-preview.png?alt=media&token=5f1e391c-fab2-4cb6-8e95-572c48274b50", colorClass: "hover:bg-red-500/20 hover:border-red-500/50" },
      {
        id: "giao-an-ai-tool",
        title: "Nâng Cấp Giáo Án AI",
        description: "Tích hợp Năng lực số & Năng lực AI tự động vào giáo án Word 📝",
        colorClass: "hover:bg-blue-500/20 hover:border-blue-500/50",
        logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fgi%C3%A1o_%C3%A1n-removebg-preview.png?alt=media&token=64d8584c-6e57-43ae-a27e-d47662baa0d5",
      }
    ]
  },
  {
    id: "ai-tool",
    title: "Công cụ AI",
    subtitle: "Trợ lý thông minh",
    icon: Robot,
    logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fai-removebg-preview.png?alt=media&token=75b34297-d1a8-4f5c-a879-c106e92c788f",
    colorClass: "from-orange-400 via-amber-500 to-yellow-600",
    subCategories: [
      // I. Trò chuyện, hỏi đáp
      { id: "ai-chatgpt", title: "ChatGPT", description: "Trợ lý ảo đa năng của OpenAI, hỗ trợ soạn bài và giải đáp mọi lĩnh vực.", contentUrl: "https://chatgpt.com", group: "chatbot" },
      { id: "ai-gemini", title: "Google Gemini", description: "Mô hình AI mạnh mẽ từ Google, tối ưu cho tra cứu và tích hợp hệ sinh thái Google.", contentUrl: "https://gemini.google.com", group: "chatbot" },
      { id: "ai-claude", title: "Claude", description: "AI của Anthropic với khả năng phân tích văn bản dài và viết lách tự nhiên.", contentUrl: "https://claude.ai", group: "chatbot" },
      { id: "ai-copilot", title: "Microsoft Copilot", description: "Tích hợp GPT-4 và Bing Search, hỗ trợ tìm kiếm và tạo ảnh miễn phí.", contentUrl: "https://copilot.microsoft.com", group: "chatbot" },
      { id: "ai-grok", title: "Grok", description: "AI từ xAI (Elon Musk) với khả năng truy cập thông tin thời gian thực từ X.", contentUrl: "https://grok.com", group: "chatbot" },
      { id: "ai-perplexity", title: "Perplexity AI", description: "Công cụ tìm kiếm AI cung cấp câu trả lời kèm theo nguồn trích dẫn uy tín.", contentUrl: "https://www.perplexity.ai", group: "chatbot" },
      { id: "ai-notebooklm", title: "NotebookLM", description: "Sổ tay thông minh của Google giúp tóm tắt và phân tích tài liệu cá nhân.", contentUrl: "https://notebooklm.google", group: "chatbot" },
      { id: "ai-deepseek", title: "DeepSeek", description: "Mô hình ngôn ngữ lớn tiên tiến với khả năng suy luận logic và giải quyết vấn đề phức tạp.", contentUrl: "https://chat.deepseek.com", group: "chatbot" },
      { id: "ai-meta", title: "Meta AI", description: "Trợ lý AI tích hợp từ Meta, hỗ trợ sáng tạo ý tưởng và giải đáp câu hỏi tức thì.", contentUrl: "https://www.meta.ai", group: "chatbot" },
      { id: "ai-character", title: "Character.AI", description: "Trò chuyện với các nhân vật giả lập, danh nhân hoặc tạo chatbot tùy biến của riêng bạn.", contentUrl: "https://character.ai/", group: "chatbot" },
      { id: "ai-debunkbot", title: "DebunkBot", description: "Học tập và tranh luận chống lại các thuyết âm mưu, tin giả bằng dữ liệu khoa học.", contentUrl: "https://www.debunkbot.com/", group: "chatbot" },
      { id: "ai-juji", title: "Juji AI", description: "Nền tảng tạo chatbot trợ lý ảo có khả năng phân tích tâm lý và thấu hiểu người dùng.", contentUrl: "https://juji.ai", group: "chatbot" },
      { id: "ai-poe", title: "Poe", description: "Nền tảng của Quora giúp tương tác với nhiều mô hình AI khác nhau và tự tạo chatbot riêng không cần code.", contentUrl: "https://poe.com/", group: "chatbot" },

      // II. Bài thuyết trình & Thiết kế
      { id: "ai-gamma", title: "Gamma", description: "Tạo bài trình chiếu, trang web và tài liệu chỉ từ một dòng văn bản.", contentUrl: "https://gamma.app/", group: "presentation" },
      { id: "ai-canva-magic", title: "Canva Magic Design", description: "Thiết kế slide và hình ảnh chuyên nghiệp tích hợp AI của Canva.", contentUrl: "https://www.canva.com/magic-design/", group: "presentation" },
      { id: "ai-beautiful", title: "Beautiful.AI", description: "Trình thiết kế slide tự động thông minh, tối ưu hóa bố cục slide đẹp mắt theo nội dung.", contentUrl: "https://www.beautiful.ai", group: "presentation" },
      { id: "ai-pitch", title: "Pitch", description: "Nền tảng slide thuyết trình tương tác hiện đại và chuyên nghiệp cho đội nhóm.", contentUrl: "https://pitch.com", group: "presentation" },
      { id: "ai-plus", title: "Plus AI", description: "Công cụ tạo slide và báo cáo nhanh chóng trong Google Slides bằng trí tuệ nhân tạo.", contentUrl: "https://www.plusdocs.com", group: "presentation" },
      { id: "ai-popai", title: "PopAI", description: "Trợ lý đa năng giúp chuyển văn bản, tài liệu PDF thành slide thuyết trình sinh động.", contentUrl: "https://www.popai.pro", group: "presentation" },
      { id: "ai-presentation", title: "Presentation.AI", description: "Tạo nhanh các bài thuyết trình chỉ bằng cách trả lời câu hỏi và mô tả ngắn gọn.", contentUrl: "https://www.presentation.ai", group: "presentation" },
      { id: "ai-slidesgo", title: "Slidesgo AI", description: "Tạo mẫu slide PowerPoint và Google Slides tự động theo nhiều phong cách đa dạng.", contentUrl: "https://slidesgo.com", group: "presentation" },
      { id: "ai-tome", title: "Tome", description: "Công cụ kể chuyện đa phương tiện sử dụng AI để tạo bản trình bày và trang landing page nhanh chóng.", contentUrl: "https://tome.app", group: "presentation" },
      { id: "ai-autodraw", title: "AutoDraw", description: "Công cụ vẽ tranh của Google, sử dụng AI đoán nét vẽ để biến nét phác thảo thành hình vẽ hoàn chỉnh.", contentUrl: "https://www.autodraw.com", group: "presentation" },
      { id: "ai-designcom", title: "Design.com", description: "Nền tảng thiết kế đồ họa và xây dựng thương hiệu tự động với sức mạnh AI.", contentUrl: "https://design.com", group: "presentation" },
      { id: "ai-framer", title: "Framer AI", description: "Thiết kế và xuất bản trang web tương tác, hiện đại trực tiếp từ bản vẽ thiết kế bằng AI.", contentUrl: "https://www.framer.com", group: "presentation" },
      { id: "ai-slidesgpt", title: "SlidesGPT", description: "Tạo nhanh slide thuyết trình PowerPoint và tài liệu PDF chỉ từ một dòng văn bản.", contentUrl: "https://slidesgpt.com/", group: "presentation" },

      // III. Hỗ trợ lập trình
      { id: "ai-askcodi", title: "AskCodi", description: "Trợ lý lập trình giúp viết code, tạo test case và giải thích cú pháp đa ngôn ngữ.", contentUrl: "https://www.askcodi.com", group: "programming" },
      { id: "ai-codiga", title: "Codiga", description: "Phân tích và phát hiện lỗi bảo mật của mã nguồn theo thời gian thực.", contentUrl: "https://www.codiga.io", group: "programming" },
      { id: "ai-cursor", title: "Cursor", description: "Trình biên tập mã nguồn tiên tiến tích hợp sâu AI giúp lập trình nhanh gấp nhiều lần.", contentUrl: "https://www.cursor.com", group: "programming" },
      { id: "ai-github-copilot", title: "GitHub Copilot", description: "Trợ lý lập trình đôi từ GitHub và OpenAI, gợi ý các đoạn mã thông hành thông minh ngay khi gõ.", contentUrl: "https://github.com/features/copilot", group: "programming" },
      { id: "ai-qodo", title: "Qodo AI", description: "Hỗ trợ phân tích mã nguồn, phát hiện bug và tự động viết test case toàn diện.", contentUrl: "https://www.qodo.ai", group: "programming" },
      { id: "ai-replit", title: "Replit Agent", description: "Môi trường phát triển trực tuyến tích hợp tác nhân AI hỗ trợ xây dựng và deploy ứng dụng.", contentUrl: "https://replit.com", group: "programming" },
      { id: "ai-tabnine", title: "Tabnine", description: "Công cụ tự động hoàn thành mã nguồn an toàn dựa trên AI cho các lập trình viên chuyên nghiệp.", contentUrl: "https://www.tabnine.com", group: "programming" },

      // IV. Bảng biểu & Trực quan hóa
      { id: "ai-bricks", title: "Bricks", description: "Tích hợp AI vào bảng tính để tự động hóa việc tính toán và lập báo cáo tài chính.", contentUrl: "https://bricks.co", group: "table" },
      { id: "ai-formulabot", title: "Formula Bot", description: "Chuyển mô tả tiếng Việt thành công thức Excel, Google Sheets chính xác chỉ trong tích tắc.", contentUrl: "https://formulabot.com", group: "table" },
      { id: "ai-gigasheet", title: "Gigasheet", description: "Xử lý và phân tích dữ liệu lớn trên bảng tính trực tuyến không cần code lên tới hàng tỷ hàng.", contentUrl: "https://www.gigasheet.com", group: "table" },
      { id: "ai-rows", title: "Rows AI", description: "Bảng tính thế hệ mới kết hợp sức mạnh phân tích dữ liệu tự động của ChatGPT.", contentUrl: "https://rows.com", group: "table" },
      { id: "ai-sheetai", title: "SheetAI", description: "Tiện ích mở rộng đưa AI vào Google Sheets để viết email, dịch thuật và phân tích hàng loạt.", contentUrl: "https://www.sheetai.app", group: "table" },
      { id: "ai-deckpilot", title: "Deckpilot", description: "Tự động thiết kế báo cáo dữ liệu thành các trang chiếu thuyết trình chuyên nghiệp.", contentUrl: "https://www.deckpilot.io", group: "table" },
      { id: "ai-flourish", title: "Flourish", description: "Biến các bảng dữ liệu thô thành biểu đồ động và hoạt cảnh kể chuyện tương tác tuyệt đẹp.", contentUrl: "https://flourish.studio", group: "table" },
      { id: "ai-julius", title: "Julius AI", description: "Trợ lý khoa học dữ liệu giúp phân tích, vẽ đồ thị và thống kê bảng tính bằng ngôn ngữ tự nhiên.", contentUrl: "https://julius.ai", group: "table" },

      // V. Tạo ảnh nghệ thuật
      { id: "ai-dalle", title: "DALL-E 3", description: "Hệ thống tạo hình ảnh nghệ thuật chất lượng cao từ mô tả văn bản của OpenAI.", contentUrl: "https://openai.com/dall-e", group: "image" },
      { id: "ai-midjourney", title: "Midjourney", description: "Công cụ tạo ảnh AI nghệ thuật và chi tiết bậc nhất hiện nay.", contentUrl: "https://www.midjourney.com", group: "image" },
      { id: "ai-stable-diffusion", title: "Stable Diffusion", description: "Mô hình tạo ảnh mã nguồn mở linh hoạt và mạnh mẽ.", contentUrl: "https://stablediffusionweb.com/", group: "image" },
      { id: "ai-flux", title: "FLUX.1", description: "Mô hình tạo hình ảnh mã nguồn mở thế hệ mới với độ chi tiết vượt trội và viết chữ chuẩn xác.", contentUrl: "https://fluxai.org", group: "image" },
      { id: "ai-ideogram", title: "Ideogram", description: "AI vẽ ảnh hàng đầu với khả năng hiển thị chữ viết nghệ thuật siêu chính xác và tự nhiên.", contentUrl: "https://ideogram.ai", group: "image" },
      { id: "ai-recraft", title: "Recraft AI", description: "Trình tạo ảnh nghệ thuật chuyên về đồ họa vector, icon và hình minh họa chuyên nghiệp.", contentUrl: "https://www.recraft.ai", group: "image" },
      { id: "ai-adobe-firefly", title: "Adobe Firefly", description: "Bộ công cụ sinh ảnh bản quyền của Adobe, hỗ trợ chỉnh sửa và thêm bớt chi tiết ảnh thông minh.", contentUrl: "https://firefly.adobe.com", group: "image" },
      { id: "ai-snapedit", title: "SnapEdit", description: "Chỉnh sửa ảnh, xóa vật thể và làm nét ảnh bằng AI dễ dàng.", contentUrl: "https://snapedit.app/", group: "image" },
      { id: "ai-bing-image", title: "Bing Image Creator", description: "Tạo ảnh miễn phí dựa trên công nghệ DALL-E của Microsoft.", contentUrl: "https://www.bing.com/create", group: "image" },
      { id: "ai-shakker", title: "Shakker", description: "Công cụ hỗ trợ sáng tạo hình ảnh và cảm hứng thiết kế AI.", contentUrl: "https://www.shakker.ai/", group: "image" },
      { id: "ai-craiyon", title: "Craiyon", description: "Trình tạo ảnh AI miễn phí từ văn bản, trước đây gọi là DALL-E Mini.", contentUrl: "https://www.craiyon.com/", group: "image" },
      { id: "ai-deepai", title: "Deep AI Art Generator", description: "Công cụ tạo và chỉnh sửa hình ảnh nghệ thuật nhanh chóng bằng nhiều phong cách vẽ.", contentUrl: "https://deepai.org/", group: "image" },
      { id: "ai-fotor", title: "Fotor AI Image", description: "Tạo tranh ảnh kỹ thuật số và thiết kế đồ họa tức thì từ mô tả chữ viết.", contentUrl: "https://www.fotor.com/ai-image-generator/", group: "image" },
      { id: "ai-imagine", title: "Imagine.art", description: "Trình tạo hình ảnh nghệ thuật AI sắc nét với hàng ngàn phong cách dựng hình.", contentUrl: "https://www.imagine.art/", group: "image" },
      { id: "ai-nightcafe", title: "NightCafe Creator", description: "Cộng đồng sáng tạo nghệ thuật AI nổi tiếng giúp biến ý tưởng thành tranh sơn dầu ảo.", contentUrl: "https://creator.nightcafe.studio/", group: "image" },

      // VI. Tạo Video & Âm thanh
      { id: "ai-suno", title: "Suno", description: "Sáng tác bài hát hoàn chỉnh (lời và nhạc) từ ý tưởng văn bản.", contentUrl: "https://suno.com/", group: "video" },
      { id: "ai-elevenlabs", title: "ElevenLabs", description: "Chuyển văn bản thành giọng nói (TTS) tự nhiên nhất thế giới.", contentUrl: "https://elevenlabs.io/", group: "video" },
      { id: "ai-playht", title: "Play.ht", description: "Trình tạo giọng nói AI chất lượng cao cho podcast và video.", contentUrl: "https://play.ht/", group: "video" },
      { id: "ai-descript", title: "Descript", description: "Chỉnh sửa âm thanh và video bằng cách chỉnh sửa văn bản.", contentUrl: "https://www.descript.com/", group: "video" },
      { id: "ai-pika", title: "Pika Labs", description: "Nền tảng tạo video từ văn bản và hình ảnh chuyên nghiệp.", contentUrl: "https://pika.ai/", group: "video" },
      { id: "ai-runway", title: "Runway", description: "Bộ công cụ sáng tạo video AI với nhiều tính năng điện ảnh.", contentUrl: "https://runwayml.com/", group: "video" },
      { id: "ai-synthesia", title: "Synthesia", description: "Tạo video thuyết trình với người ảo (Avatar) nói chuyện tự nhiên.", contentUrl: "https://www.synthesia.io/", group: "video" },
      { id: "ai-leonardo", title: "Leonardo.ai", description: "Nền tảng sáng tạo hình ảnh và video AI chất lượng studio.", contentUrl: "https://leonardo.ai/", group: "video" },
      { id: "ai-luma", title: "Luma Labs", description: "Tạo mô hình 3D và video chân thực từ hình ảnh 2D.", contentUrl: "https://lumalabs.ai/", group: "video" },
      { id: "ai-kling", title: "Kling AI", description: "Công cụ tạo hình ảnh và video AI tiên tiến từ Trung Quốc.", contentUrl: "https://www.klingai.com/", group: "video" },
      { id: "ai-sora", title: "Sora", description: "Siêu mô hình tạo video 1 phút từ văn bản của OpenAI.", contentUrl: "https://openai.com/index/sora/", group: "video" },
      { id: "ai-haiper", title: "Haiper AI", description: "Nền tảng tạo dựng video ngắn sinh động nhờ mô hình AI vật lý 3D tiên tiến.", contentUrl: "https://haiper.ai", group: "video" },
      { id: "ai-invideo", title: "InVideo AI", description: "Biến bất kỳ ý tưởng kịch bản nào thành video hoàn chỉnh có thuyết minh giọng AI và hình ảnh minh họa.", contentUrl: "https://invideo.io", group: "video" },
      { id: "ai-ltxstudio", title: "LTX Studio", description: "Giải pháp làm phim AI từ ý tưởng, hỗ trợ kịch bản phân cảnh và nhất quán nhân vật.", contentUrl: "https://ltx.studio", group: "video" },
      { id: "ai-animateddrawings", title: "Animated Drawings", description: "Biến các hình vẽ tay phác thảo của học sinh thành các chuyển động hoạt hình sinh động.", contentUrl: "https://sketch.metademolab.com/", group: "video" },
      { id: "ai-heygen", title: "HeyGen", description: "Nền tảng tạo video người ảo phát biểu và thuyết trình tự nhiên bậc nhất thế giới.", contentUrl: "https://www.heygen.com/", group: "video" },
      { id: "ai-udio", title: "Udio", description: "AI sáng tác nhạc chất lượng cao tương tự Suno.", contentUrl: "https://www.udio.com/", group: "video" },
      { id: "ai-viggle", title: "Viggle AI", description: "Tạo video hoạt ảnh nhân vật nhảy múa, di chuyển mượt mà từ ảnh tĩnh.", contentUrl: "https://viggle.ai/", group: "video" },
      { id: "ai-hedra", title: "Hedra", description: "Biến ảnh chân dung và file ghi âm thành video thuyết trình chân thực.", contentUrl: "https://www.hedra.com/", group: "video" },

      // VII. Email & Tự động hóa
      { id: "ai-clippit", title: "Clippit.AI", description: "Trình viết email thông minh hỗ trợ rút ngắn thời gian phản hồi thư khách hàng.", contentUrl: "https://clippit.ai", group: "email" },
      { id: "ai-friday", title: "Friday", description: "AI lên lịch trình công việc và đề xuất nội dung email chuyên nghiệp tự động.", contentUrl: "https://friday.app", group: "email" },
      { id: "ai-mailmaestro", title: "Mailmaestro", description: "Trợ lý soạn thảo email chất lượng cao tích hợp vào Outlook và Gmail.", contentUrl: "https://www.maestro.ai", group: "email" },
      { id: "ai-shortwave", title: "Shortwave", description: "Ứng dụng quản lý hộp thư email cực nhanh với sự hỗ trợ của trí tuệ nhân tạo.", contentUrl: "https://www.shortwave.com", group: "email" },
      { id: "ai-superhuman", title: "Superhuman", description: "Trải nghiệm email cao cấp, cực nhanh với trợ lý AI viết thư và tóm tắt cuộc hội thoại.", contentUrl: "https://superhuman.com", group: "email" },
      { id: "ai-integrately", title: "Integrately", description: "Kết nối và tự động hóa công việc giữa hàng ngàn ứng dụng chỉ với 1 cú click chuột.", contentUrl: "https://integrately.com", group: "email" },
      { id: "ai-make", title: "Make", description: "Thiết kế trực quan và tự động hóa các luồng công việc phức tạp không cần lập trình.", contentUrl: "https://www.make.com", group: "email" },
      { id: "ai-monday", title: "Monday.com AI", description: "Hệ điều hành công việc tích hợp AI để tối ưu hóa quản lý dự án và phân công nhiệm vụ.", contentUrl: "https://monday.com", group: "email" },
      { id: "ai-n8n", title: "n8n", description: "Nền tảng tự động hóa mã nguồn mở, cho phép tạo các kịch bản tích hợp tự do.", contentUrl: "https://n8n.io", group: "email" },
      { id: "ai-wrike", title: "Wrike AI", description: "Phần mềm quản lý công việc tối ưu hóa hiệu suất với các gợi ý công việc thông minh.", contentUrl: "https://www.wrike.com", group: "email" },
      { id: "ai-zapier", title: "Zapier", description: "Dịch vụ liên kết và tự động hóa công việc phổ biến nhất kết nối hơn 6000 ứng dụng.", contentUrl: "https://zapier.com", group: "email" },

      // VIII. Lập kế hoạch & Quản lý tri thức
      { id: "ai-calendly", title: "Calendly", description: "Nền tảng tự động hóa đặt lịch hẹn và sắp xếp cuộc họp hiệu quả.", contentUrl: "https://calendly.com", group: "planning" },
      { id: "ai-clockwise", title: "Clockwise", description: "Tự động tối ưu hóa lịch biểu cá nhân và nhóm để tạo không gian tập trung làm việc.", contentUrl: "https://www.getclockwise.com", group: "planning" },
      { id: "ai-motion", title: "Motion", description: "Sắp xếp thứ tự ưu tiên và tự động xếp lịch công việc hằng ngày bằng thuật toán AI.", contentUrl: "https://www.usemotion.com", group: "planning" },
      { id: "ai-reclaim", title: "Reclaim AI", description: "Quản lý thời gian biểu và tự động tìm giờ lý tưởng cho các thói quen lành mạnh.", contentUrl: "https://reclaim.ai", group: "planning" },
      { id: "ai-taskade", title: "Taskade AI", description: "Không gian làm việc năng suất, hỗ trợ tạo sơ đồ tư duy và robot AI đồng hành lập kế hoạch.", contentUrl: "https://www.taskade.com", group: "planning" },
      { id: "ai-trevor", title: "Trevor AI", description: "Lập lịch công việc dạng hộp thời gian kéo thả, tối ưu hóa sự tập trung hằng ngày.", contentUrl: "https://trevorai.com", group: "planning" },
      { id: "ai-copyai", title: "Copy.ai", description: "Nền tảng viết lách tự động cho các chiến dịch marketing, quảng cáo và email.", contentUrl: "https://www.copy.ai", group: "planning" },
      { id: "ai-grammarly", title: "Grammarly", description: "Trình kiểm tra lỗi chính tả, đề xuất sửa câu và tối ưu giọng điệu văn bản tiếng Anh hàng đầu.", contentUrl: "https://www.grammarly.com", group: "planning" },
      { id: "ai-jasper", title: "Jasper AI", description: "Đồng tác giả AI hỗ trợ viết bài blog, email và các nội dung sáng tạo chuyên sâu.", contentUrl: "https://www.jasper.ai", group: "planning" },
      { id: "ai-jotbot", title: "JotBot", description: "Trợ lý viết văn bản có khả năng bắt chước văn phong và giọng điệu cá nhân của bạn.", contentUrl: "https://www.jotbot.com", group: "planning" },
      { id: "ai-quarkle", title: "Quarkle", description: "Trợ lý biên kịch đồng hành giúp bạn gọt giũa và phát triển cốt truyện tiểu thuyết.", contentUrl: "https://www.quarkle.com", group: "planning" },
      { id: "ai-rytr", title: "Rytr", description: "Trợ lý AI viết lách nhanh chóng, tạo bài viết chuẩn SEO với chi phí tối ưu.", contentUrl: "https://rytr.me", group: "planning" },
      { id: "ai-mem", title: "Mem AI", description: "Ghi chú thông minh tự động kết nối và tổ chức các ý tưởng rời rạc của bạn.", contentUrl: "https://mem.ai", group: "planning" },
      { id: "ai-notion", title: "Notion AI", description: "Tích hợp trí tuệ nhân tạo trực tiếp vào không gian ghi chú, soạn thảo và quản lý tài liệu.", contentUrl: "https://www.notion.so", group: "planning" },
      { id: "ai-tettra", title: "Tettra", description: "Hệ thống wiki kiến thức nội bộ giúp lưu trữ và chia sẻ tài liệu dạy học cho tổ bộ môn.", contentUrl: "https://tettra.com", group: "planning" },
      { id: "ai-avoma", title: "Avoma", description: "Trình ghi âm cuộc họp thông minh, tự động nhận diện người nói và tóm tắt biên bản.", contentUrl: "https://www.avoma.com", group: "planning" },
      { id: "ai-equaltime", title: "Equal Time", description: "AI đo lường sự cân bằng thời lượng phát biểu trong lớp học trực tuyến và tóm tắt buổi dạy.", contentUrl: "https://www.equaltime.as", group: "planning" },
      { id: "ai-fathom", title: "Fathom", description: "Ghi âm, ghi chú tự động cuộc gọi Zoom, Teams và Google Meet miễn phí cực kỳ nhanh gọn.", contentUrl: "https://fathom.video", group: "planning" },
      { id: "ai-fireflies", title: "Fireflies", description: "AI tự động tham gia cuộc họp, ghi âm và tìm kiếm thông tin theo từ khóa trong biên bản.", contentUrl: "https://fireflies.ai", group: "planning" },
      { id: "ai-krisp", title: "Krisp", description: "Khử tiếng ồn môi trường và lọc giọng nói nhờ AI giúp giảng dạy online tập trung.", contentUrl: "https://krisp.ai", group: "planning" },
      { id: "ai-otter", title: "Otter.ai", description: "Ghi âm và chuyển đổi cuộc họp, bài giảng thành văn bản thời gian thực.", contentUrl: "https://otter.ai/", group: "planning" },
      { id: "ai-summarize", title: "Summarize.tech", description: "Tóm tắt video YouTube dài thành các ý chính trong vài giây.", contentUrl: "https://www.summarize.tech/", group: "planning" },
      { id: "ai-tldrthis", title: "TLDRThis", description: "Tóm tắt các bài báo và trang web dài thành nội dung ngắn gọn.", contentUrl: "https://www.tldrthis.com/", group: "planning" },
      { id: "ai-scholarcy", title: "Scholarcy", description: "Công cụ đọc và tóm tắt các tài liệu nghiên cứu, học thuật.", contentUrl: "https://www.scholarcy.com/", group: "planning" },
      { id: "ai-quillbot", title: "QuillBot", description: "Công cụ tóm tắt văn bản và kiểm tra ngữ pháp mạnh mẽ.", contentUrl: "https://quillbot.com/summarize", group: "planning" },
      { id: "ai-mindmeister", title: "MindMeister", description: "Vẽ sơ đồ tư duy trực tuyến, hỗ trợ cộng tác giữa nhóm.", contentUrl: "https://www.mindmeister.com/", group: "planning" },
      { id: "ai-xmind", title: "Xmind", description: "Công cụ vẽ sơ đồ tư duy chuyên nghiệp với nhiều mẫu đẹp.", contentUrl: "https://xmind.app/", group: "planning" },
      { id: "ai-whimsical", title: "Whimsical", description: "Tạo sơ đồ, quy trình và ý tưởng một cách trực quan bằng AI.", contentUrl: "https://whimsical.com/", group: "planning" },
      { id: "ai-miro", title: "Miro AI", description: "Bảng trắng kỹ thuật số tích hợp AI hỗ trợ bão não ý tưởng.", contentUrl: "https://miro.com/miro-ai/", group: "planning" },
      { id: "ai-duetai", title: "Google Workspace AI", description: "Tác nhân thông minh tích hợp vào Gmail, Docs, Slides hỗ trợ tự động hóa văn phòng.", contentUrl: "https://workspace.google.com", group: "planning" },
      { id: "ai-google-docs-write", title: "Help me write (Docs)", description: "Tính năng hỗ trợ viết lách và soạn thảo công văn tự động trực tiếp trên Google Docs.", contentUrl: "https://docs.google.com/", group: "planning" },

      // IX. Kiểm tra đánh giá & Soạn giảng
      { id: "ai-quizizz", title: "Quizizz", description: "Nền tảng kiểm tra trắc nghiệm sinh động và tương tác cao.", contentUrl: "https://quizizz.com/", group: "education" },
      { id: "ai-kahoot", title: "Kahoot!", description: "Học tập qua trò chơi và thi đấu trực tiếp trong lớp học.", contentUrl: "https://kahoot.com/", group: "education" },
      { id: "ai-gradescope", title: "GradeScope", description: "Hỗ trợ chấm bài và cung cấp phản hồi chi tiết cho học sinh.", contentUrl: "https://www.gradescope.com/", group: "education" },
      { id: "ai-schoolai", title: "SchoolAI", description: "Không gian học tập AI an toàn dành cho giáo viên và học sinh.", contentUrl: "https://schoolai.com/", group: "education" },
      { id: "ai-magicschool", title: "Magic School", description: "Trợ lý AI chuyên biệt cho giáo viên giúp soạn bài và chấm điểm.", contentUrl: "https://magicschool.ai/", group: "education" },
      { id: "ai-teachmate", title: "TeachmateAI", description: "Bộ công cụ tự động hóa công việc hành chính cho giáo viên.", contentUrl: "https://teachmateai.com/", group: "education" },
      { id: "ai-teachermatic", title: "TeacherMatic", description: "Tạo tài nguyên dạy học và bài tập từ AI cho giáo bận rộn.", contentUrl: "https://teachermatic.com/", group: "education" },
      { id: "ai-conker", title: "Conker.ai", description: "Tạo các bài kiểm tra trắc nghiệm, bài tập tự động theo tiêu chuẩn sư phạm.", contentUrl: "https://www.conker.ai/", group: "education" },
      { id: "ai-gotfeedback", title: "gotFeedback", description: "Cung cấp phản hồi cá nhân hóa và nhận xét học tập chi tiết dựa trên bài làm học sinh.", contentUrl: "https://feedback.gotlearning.com/", group: "education" },
      { id: "ai-khanmigo", title: "Khanmigo AI", description: "Gia sư ảo và trợ lý giảng dạy đắc lực phát triển bởi tổ chức Khan Academy.", contentUrl: "https://www.khanmigo.ai/", group: "education" },
      { id: "ai-diffit", title: "Diffit", description: "Tạo bài học và tài liệu giảng dạy phù hợp với mọi trình độ đọc hiểu của học sinh.", contentUrl: "https://web.diffit.me/", group: "education" },
      { id: "ai-eduaide", title: "Eduaide.Ai", description: "Trợ lý đắc lực thiết kế giáo án soạn bài và tạo hoạt động tương tác lớp học.", contentUrl: "https://www.eduaide.ai/", group: "education" },
      { id: "ai-twee", title: "Twee AI", description: "Công cụ thiết kế bài tập tiếng Anh, câu hỏi đọc hiểu và nghe dựa trên video YouTube.", contentUrl: "https://twee.com/", group: "education" },
      { id: "ai-readingcoach", title: "Reading Coach", description: "Công cụ luyện đọc hiểu cá nhân hóa miễn phí của Microsoft giúp phát triển kỹ năng đọc của học sinh.", contentUrl: "https://coach.microsoft.com/", group: "education" },
      { id: "ai-curipod", title: "Curipod", description: "Thiết kế các bài học tương tác, khảo sát ý kiến và thảo luận nhóm sinh động chỉ trong tích tắc.", contentUrl: "https://curipod.com/", group: "education" },
      { id: "ai-myviewboard", title: "myViewBoard AI", description: "Bảng tương tác thông minh hỗ trợ giáo viên tổ chức bài giảng sinh động trực quan.", contentUrl: "https://myviewboard.com/", group: "education" },
      { id: "ai-briskteaching", title: "Brisk Teaching", description: "Trợ lý AI tích hợp dưới dạng extension giúp soạn bài, chấm điểm và viết nhận xét nhanh gọn.", contentUrl: "https://www.briskteaching.com/", group: "education" },
      { id: "ai-questionwell", title: "QuestionWell", description: "Tự động thiết kế bộ câu hỏi trắc nghiệm, bài tập đọc hiểu từ văn bản đầu vào.", contentUrl: "https://www.questionwell.org/", group: "education" },
      { id: "ai-classpoint", title: "ClassPoint AI", description: "Tạo câu hỏi trắc nghiệm tương tác trực tiếp từ slide PowerPoint nhờ trí tuệ nhân tạo.", contentUrl: "https://www.classpoint.io/", group: "education" },
      { id: "ai-edpuzzle", title: "Edpuzzle AI", description: "Tự động chèn câu hỏi tương tác vào video bài giảng YouTube thông minh.", contentUrl: "https://edpuzzle.com/", group: "education" },

      // X. Kiểm tra phát hiện AI (AI Detector)
      { id: "ai-writingcheck", title: "AI Writing Check", description: "Dịch vụ phi lợi nhuận giúp giáo viên phát hiện nhanh học sinh sử dụng ChatGPT viết văn.", contentUrl: "https://aiwritingcheck.org/", group: "check-ai" },
      { id: "ai-contentatscale", title: "Content at Scale", description: "Công cụ kiểm tra văn bản AI với độ chính xác cao cho các đoạn văn dài.", contentUrl: "https://brandwell.ai/ai-content-detector/", group: "check-ai" },
      { id: "ai-copyleaks", title: "Copyleaks Detector", description: "Phát hiện đạo văn và nội dung được tạo bởi các mô hình AI lớn bao gồm cả GPT-4.", contentUrl: "https://copyleaks.com/ai-content-detector", group: "check-ai" },
      { id: "ai-crossplag", title: "Crossplag Detector", description: "Công cụ đối chiếu và quét văn bản xem có dấu hiệu tạo tự động bởi AI hay không.", contentUrl: "https://crossplag.com/ai-content-detector/", group: "check-ai" },
      { id: "ai-gptzero", title: "GPTZero", description: "Công cụ hàng đầu thế giới được thiết kế chuyên biệt để phát hiện văn bản do AI tạo ra.", contentUrl: "https://gptzero.me/", group: "check-ai" },
      { id: "ai-huggingface", title: "Hugging Face Detector", description: "Trình phát hiện văn bản GPT-2/GPT-3 mã nguồn mở được cộng đồng tin cậy.", contentUrl: "https://huggingface.co/spaces/openai/openai-detector", group: "check-ai" },
      { id: "ai-open-classifier", title: "OpenAI Text Classifier", description: "Bộ phân loại văn bản chính thức từ OpenAI giúp nhận diện nguồn gốc viết lách.", contentUrl: "https://platform.openai.com/ai-text-classifier", group: "check-ai" },
      { id: "ai-originality", title: "Originality.AI", description: "Công cụ phát hiện đạo văn và quét AI trả phí hướng đến các biên tập viên chuyên nghiệp.", contentUrl: "https://originality.ai/", group: "check-ai" },
      { id: "ai-undetectable", title: "Undetectable.AI", description: "Nhận diện văn bản AI và đề xuất viết lại câu để văn bản tự nhiên như người viết.", contentUrl: "https://undetectable.ai/", group: "check-ai" },
      { id: "ai-winston", title: "Winston A.I", description: "Công cụ phát hiện AI có độ chính xác cực cao dành riêng cho ngành giáo dục và xuất bản.", contentUrl: "https://gowinston.ai/", group: "check-ai" },
      { id: "ai-writer-detector", title: "Writer AI Detector", description: "Quét nội dung tự động để phát hiện các mẫu viết lách do máy tạo ra.", contentUrl: "https://writer.com/ai-content-detector/", group: "check-ai" },
      { id: "ai-zerogpt", title: "ZeroGPT", description: "Công cụ kiểm tra đạo văn và phát hiện ChatGPT miễn phí được đông đảo học sinh sử dụng.", contentUrl: "https://www.zerogpt.com/", group: "check-ai" },
      { id: "ai-turnitin", title: "Turnitin AI Detector", description: "Công cụ hàng đầu thế giới được sử dụng rộng rãi trong các cơ sở giáo dục để phát hiện đạo văn và văn bản tạo bởi AI.", contentUrl: "https://www.turnitin.com/", group: "check-ai" },
      { id: "ai-quillbot-detector", title: "QuillBot AI Detector", description: "Giải pháp phát hiện văn bản do AI tạo ra một cách nhanh chóng và chính xác từ hệ sinh thái QuillBot.", contentUrl: "https://quillbot.com/ai-detector", group: "check-ai" },

      // XI. Nghiên cứu & Nâng cao chuyên môn
      { id: "ai-codeorg", title: "Code.org AI", description: "Học lập trình khoa học máy tính và khám phá các bài giảng tích hợp AI cho trường phổ thông.", contentUrl: "https://code.org/", group: "research" },
      { id: "ai-colab", title: "Google Colab", description: "Môi trường thực thi code Python trực tuyến tích hợp GPU miễn phí cho nghiên cứu AI.", contentUrl: "https://colab.research.google.com/", group: "research" },
      { id: "ai-dodstem", title: "DoDSTEM", description: "Tài nguyên giáo dục Khoa học Công nghệ và STEM hàng đầu hỗ trợ giáo viên.", contentUrl: "https://dodstem.us/", group: "research" },
      { id: "ai-teachai", title: "TeachAI", description: "Tổ chức định hướng giảng dạy trí tuệ nhân tạo an toàn và hiệu quả trong trường phổ thông.", contentUrl: "https://www.teachai.org/", group: "research" },
      { id: "ai-consensus", title: "Consensus AI", description: "Công cụ tìm kiếm khoa học AI giúp trả lời câu hỏi dựa trên hàng triệu bài báo cáo học thuật.", contentUrl: "https://consensus.app/", group: "research" },
      { id: "ai-elicit", title: "Elicit", description: "Trợ lý đắc lực tìm kiếm và tổng hợp thông tin từ hàng triệu bài báo nghiên cứu khoa học.", contentUrl: "https://elicit.com/", group: "research" },
      { id: "ai-scite", title: "Scite.ai", description: "Kiểm tra trích dẫn thông minh và đánh giá mức độ tin cậy của các bài nghiên cứu.", contentUrl: "https://scite.ai/", group: "research" },
      { id: "ai-semanticscholar", title: "Semantic Scholar", description: "Công cụ tìm kiếm học thuật được hỗ trợ bởi AI giúp phân tích tài liệu chuyên sâu.", contentUrl: "https://www.semanticscholar.org/", group: "research" }
    ]
  },
  {
    id: "skkn",
    title: "Sáng kiến kinh nghiệm",
    subtitle: "Kho tàng giải pháp giáo dục",
    icon: Lightbulb,
    logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fskkn-removebg-preview.png?alt=media&token=2f5c09cb-fdf9-4ab5-a7a3-cda6c4dfc9c1",
    colorClass: "from-yellow-400 via-orange-400 to-red-500",
    subCategories: [
      { id: "skkn-generator", title: "Viết Sáng kiến kinh nghiệm", description: "Hệ thống tự động tạo và xuất báo cáo sáng kiến kinh nghiệm chuẩn", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fvi%E1%BA%BFt_skkn-removebg-preview.png?alt=media&token=ea98a5f7-d72f-45ce-8717-43ee0822725e" },
      { id: "skkn-upload", title: "Kho lưu trữ cá nhân", description: "Tải lên, quản lý và lưu trữ tài liệu PDF sáng kiến kinh nghiệm cá nhân", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fkho_skkn-removebg-preview.png?alt=media&token=e9a19bb0-c462-440b-a914-af03b1057c96" }
    ]
  },
  {
    id: "nghien-cuu",
    title: "Nghiên cứu khoa học",
    subtitle: "Đề tài & Công trình nghiên cứu",
    icon: Atom,
    logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fnckh-removebg-preview.png?alt=media&token=94da70e4-aed2-49bd-b27b-198faa6f380b",
    colorClass: "from-indigo-400 via-blue-500 to-cyan-600",
    subCategories: [
      { id: "nc-sp", title: "Nghiên cứu Sư phạm", description: "Khảo sát tâm lý & Động lực học tập học sinh", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fnghi%C3%AAn%20c%E1%BB%A9u%20s%C6%B0%20ph%E1%BA%A1m.png?alt=media&token=61429322-cf71-4be4-bb04-789212c55169" },
      { 
        id: "nc-ung-dung", 
        title: "KHKT Học sinh", 
        description: "Các dự án Khoa học Kỹ thuật khối THCS",
        logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fkhoa_h%E1%BB%8Dc_kt-removebg-preview.png?alt=media&token=182e688f-b155-4427-ac8c-dc131f707ab8",
        embedDocs: [
          { title: "Tài liệu 1", url: "https://docs.google.com/document/d/1t4shgATizzrGUhFHak0jm9_OacCH0tdx/preview" },
          { title: "Tài liệu 2", url: "https://docs.google.com/document/d/14zxj2a6XjIQJMIB9BwCOsHM03rdaNb48/preview" },
          { title: "Tài liệu 3", url: "https://docs.google.com/document/d/10i4XQJ0DpJx6Z7WAe4z7RG9kK5xkO4KU/preview" }
        ]
      },
      { 
        id: "nc-machine-learning", 
        title: "Machine Learning", 
        description: "Tìm hiểu cơ bản về Học máy và các ứng dụng trong nghiên cứu khoa học.", 
        logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fh%E1%BB%8Dc_m%C3%A1y-removebg-preview.png?alt=media&token=cbcd3ab9-c56b-48e5-87a0-b12c745b79d0",
        lessons: [
          {
            id: "ml-regression",
            title: "Hồi Quy Tuyến Tính (Regression)",
            description: "Khái niệm dự đoán các giá trị liên tục như điểm số, nhiệt độ, dự báo thời tiết dựa trên dữ liệu lịch sử.",
            icon: Target,
            theme: "blue"
          },
          {
            id: "ml-classification",
            title: "Phân Loại (Classification)",
            description: "Kỹ thuật huấn luyện máy tính phân biệt và gắn nhãn dữ liệu (như phân biệt email rác, phân loại ảnh chó mèo).",
            icon: Hexagon,
            theme: "orange"
          },
          {
            id: "ml-clustering",
            title: "Phân Cụm (Clustering)",
            description: "Nhóm các dữ liệu có đặc điểm tương đồng lại với nhau mà không cần dữ liệu được gán nhãn trước (Unsupervised Learning).",
            icon: Network,
            theme: "green"
          }
        ]
      },
      { 
        id: "nc-deep-learning", 
        title: "Deep Learning", 
        description: "Khám phá mạng nơ-ron nhân tạo và ứng dụng của Học sâu trong thực tế.", 
        logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fh%E1%BB%8Dc_s%C3%A2u-removebg-preview.png?alt=media&token=05d43beb-c228-4fff-b79a-b4e433912da5",
        lessons: [
          {
            id: "dl-ann",
            title: "Mạng Nơ-ron Nhân Tạo (ANN)",
            description: "Cấu trúc lấy cảm hứng từ não bộ con người, nền tảng của mọi hệ thống trí tuệ nhân tạo hiện đại.",
            icon: Brain,
            theme: "purple"
          },
          {
            id: "dl-cnn",
            title: "Thị Giác Máy Tính (CNN)",
            description: "Ứng dụng Học sâu trong việc nhận diện khuôn mặt, phân tích ảnh y tế và các xe tự lái.",
            icon: Robot,
            theme: "blue"
          },
          {
            id: "dl-nlp",
            title: "Xử Lý Ngôn Ngữ Tự Nhiên (NLP)",
            description: "Khám phá cách AI như ChatGPT đọc, hiểu và tạo ra ngôn ngữ giống con người thông qua các mô hình Transformer.",
            icon: Lightbulb,
            theme: "red"
          }
        ]
      },
    ]
  },
  {
    id: "steam",
    title: "Dạy học STEAM",
    subtitle: "Dự án thực tế & Môi trường",
    icon: RocketLaunch,
    logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fsteam-removebg-preview.png?alt=media&token=29aa2902-f6ca-4944-ad9c-a00e286e3614",
    colorClass: "from-teal-400 via-emerald-500 to-lime-600",
    subCategories: [
      { id: "steam-giao-an", title: "Xây dựng giáo án dạy học STEAM", description: "Công cụ hỗ trợ xây dựng giáo án và kế hoạch bài dạy chuẩn STEAM", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fsteam1-removebg-preview.png?alt=media&token=82e5e866-c586-40b8-8f1a-6f78baa505d8" },
      { id: "steam-du-an", title: "Dự án dạy học STEAM", description: "Thư viện các dự án thực tế và ý tưởng thiết kế mô hình STEAM", logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fsteam2-removebg-preview.png?alt=media&token=6f510d44-22ad-4e5c-865e-4eea3b47f0aa" },
    ]
  },
  {
    id: "day-hoc-tich-cuc",
    title: "Dạy học tích cực",
    subtitle: "Phương pháp & Công cụ tương tác",
    icon: Presentation,
    logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2FDHTC-removebg-preview.png?alt=media&token=6b4c8759-0629-4a91-a85c-e2ad611979f8",
    colorClass: "from-sky-400 via-indigo-500 to-purple-600",
    subCategories: [
      {
        id: "day-hoc-tich-cuc-gallery",
        title: "Triển lãm sản phẩm 3D",
        description: "Không gian 3D Panorama trưng bày các sản phẩm học tập và dự án thực tế của học sinh.",
        logoUrl: "https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fb%E1%BA%A3o%20t%C3%A0ng%20rmg.png?alt=media&token=2fc0bff7-7c8a-43d5-8cae-999ae8f9a6b9",
        lessons: [
          {
            id: "phong-tranh-panorama",
            title: "Phòng Tranh Triển Lãm 3D",
            description: "Tải ảnh sản phẩm học tập lên để phân bố và tham quan trong không gian nghệ thuật 3D Panorama tương tác.",
            icon: RocketLaunch,
            theme: "purple"
          }
        ]
      },
      {
        id: "day-hoc-tich-cuc-video",
        title: "Video bài giảng tương tác",
        description: "Chèn câu hỏi trắc nghiệm, đúng/sai, điền khuyết vào các thời điểm của video bài giảng.",
        logoUrl: "https://img.icons8.com/fluency/96/video-playlist.png",
        lessons: [
          {
            id: "video-tuong-tac",
            title: "Video Bài Giảng Tương Tác",
            description: "Chèn câu hỏi trắc nghiệm, điền khuyết vào các giai đoạn video, trả lời đúng video mới chạy tiếp.",
            icon: RocketLaunch,
            theme: "blue"
          }
        ]
      }
    ]
  }
];
