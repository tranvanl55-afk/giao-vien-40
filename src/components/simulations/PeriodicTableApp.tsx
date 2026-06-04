import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, X } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export interface PeriodicTableAppProps {
  onBack: () => void;
}

// ------------------------------------------------------------------
// Element Data
// ------------------------------------------------------------------
interface ElementData {
  number: number;
  symbol: string;
  name: string;
  mass: number;
  category: string;
  electrons: string;
  shells: number[];
  description: string;
  group: number;
  period: number;
  uses?: string;
  nameOrigin?: string;
}

const elements: ElementData[] = [
  // Period 1
  { number: 1, symbol: 'H', name: 'Hydrogen', mass: 1.008, category: 'nonmetal', electrons: '1s1', shells: [1], description: 'Hydro là phi kim đơn giản nhất, nguyên tố phổ biến nhất vũ trụ.', group: 1, period: 1, uses: 'Nhiên liệu tên lửa, pin nhiên liệu hydro, sản xuất amoniac, điện phân nước.', nameOrigin: 'Từ tiếng Hy Lạp "hydro-genes" = sinh ra nước (đặt tên vì khi đốt cháy tạo ra nước).' },
  { number: 2, symbol: 'He', name: 'Helium', mass: 4.0026, category: 'noble-gas', electrons: '1s2', shells: [2], description: 'Heli là khí hiếm siêu nhẹ, không cháy, dùng bơm khinh khí cầu.', group: 18, period: 1, uses: 'Bơm khinh khí cầu, làm lạnh MRI, làm lạnh thải siêu dẫn, laser.', nameOrigin: 'Từ thần Mặt Trời Hy Lạp "Helios" — phát hiện lần đầu trên Mặt Trời qua quang phổ.' },
  
  // Period 2
  { number: 3, symbol: 'Li', name: 'Lithium', mass: 6.94, category: 'alkali-metal', electrons: '[He] 2s1', shells: [2, 1], description: 'Liti là kim loại kiềm nhẹ nhất, dùng chế tạo pin sạc hiệu năng cao.', group: 1, period: 2, uses: 'Pin Lithium-ion (smartphone, xe điện), thuốc điều trị hưng cảm, hợp kim nhôm.', nameOrigin: 'Từ tiếng Hy Lạp "lithos" = đá — vì được tìm thấy trong khoáng sản đá.' },
  { number: 4, symbol: 'Be', name: 'Beryllium', mass: 9.0122, category: 'alkaline-earth-metal', electrons: '[He] 2s2', shells: [2, 2], description: 'Beri là kim loại kiềm thổ cứng, dùng trong hàng không vũ trụ.', group: 2, period: 2, uses: 'Hợp kim hàng không vũ trụ, cửa sổ tia X, vật liệu hạt nhân.', nameOrigin: 'Từ "beryllos" (Hy Lạp) = màu xanh biển — liên quan đến đá quý beryl (emerald).' },
  { number: 5, symbol: 'B', name: 'Boron', mass: 10.81, category: 'metalloid', electrons: '[He] 2s2 2p1', shells: [2, 3], description: 'Bo là á kim bán dẫn dùng trong sản xuất sợi thủy tinh.', group: 13, period: 2, uses: 'Thủy tinh chịu nhiệt Pyrex, thành phần thẩm phân, chất bán dẫn.', nameOrigin: 'Từ tiếng Ả Rập "Buraq" — nguồn gốc từ borax, một loại khoáng chất.' },
  { number: 6, symbol: 'C', name: 'Carbon', mass: 12.011, category: 'nonmetal', electrons: '[He] 2s2 2p2', shells: [2, 4], description: 'Carbon là cơ sở của hóa học hữu cơ và cấu trúc của mọi sự sống.', group: 14, period: 2, uses: 'Sợi carbon (máy bay, ô tô), than hoạt tính, graphite (pin, bút chì), nhiên liệu.', nameOrigin: 'Từ tiếng Latin "carbo" = than — biết từ thời cổ đại dưới dạng than đen.' },
  { number: 7, symbol: 'N', name: 'Nitrogen', mass: 14.007, category: 'nonmetal', electrons: '[He] 2s2 2p3', shells: [2, 5], description: 'Nitơ là phi kim khí trơ, chiếm 78% bầu khí quyển Trái Đất.', group: 15, period: 2, uses: 'Phân bón ure, amoniac, Nitơ lỏng bảo quản thực phẩm/sinh học, chế tạo chất nổ.', nameOrigin: 'Từ "nitron-genes" (Hy Lạp) = sinh ra đất mặn (nitre = KNO₃).' },
  { number: 8, symbol: 'O', name: 'Oxygen', mass: 15.999, category: 'nonmetal', electrons: '[He] 2s2 2p4', shells: [2, 6], description: 'Oxy là dưỡng khí thiết yếu duy trì sự hô hấp và sự cháy.', group: 16, period: 2, uses: 'Hô hấp y tế, luyện thép, xử lý nước, hàn cắt kim loại, nhiên liệu tên lửa.', nameOrigin: 'Từ "oxys-genes" (Hy Lạp) = sinh ra axit — Lavoisier đặt tên (nhưng quan niệm sai ấy).' },
  { number: 9, symbol: 'F', name: 'Fluorine', mass: 18.998, category: 'halogen', electrons: '[He] 2s2 2p5', shells: [2, 7], description: 'Flo là halogen hoạt động mạnh nhất, dùng bảo vệ men răng.', group: 17, period: 2, uses: 'Kem đánh răng (chống sâu), chất chống dính Teflon (chảo), làm lạnh HFC.', nameOrigin: 'Từ tiếng Latin "fluere" = chảy — vì fluorspar được dùng làm chất trợ chảy khi nuyện kim loại.' },
  { number: 10, symbol: 'Ne', name: 'Neon', mass: 20.180, category: 'noble-gas', electrons: '[He] 2s2 2p6', shells: [2, 8], description: 'Neon phát ra ánh sáng đỏ cam rực rỡ đặc trưng khi phóng điện.', group: 18, period: 2, uses: 'Đèn neon quảng cáo, laser He-Ne, đèn flash máy ảnh tốc độ cao.', nameOrigin: 'Từ tiếng Hy Lạp "neos" = mới — là khí mới phát hiện sau Argon.' },
  
  // Period 3
  { number: 11, symbol: 'Na', name: 'Sodium', mass: 22.990, category: 'alkali-metal', electrons: '[Ne] 3s1', shells: [2, 8, 1], description: 'Natri là kim loại kiềm phản ứng mạnh với nước tạo bazơ.', group: 1, period: 3, uses: 'Muối ăn (NaCl), xót (NaOH), thuốc muối NaHCO₃, đèn Na đường phố.', nameOrigin: 'Ký hiệu Na từ "Natrium" (Latin/Ả Rập natrun = đất kiềm). Sodium từ "soda".' },
  { number: 12, symbol: 'Mg', name: 'Magnesium', mass: 24.305, category: 'alkaline-earth-metal', electrons: '[Ne] 3s2', shells: [2, 8, 2], description: 'Magiê là kim loại kiềm thổ nhẹ, cháy với ánh sáng trắng chói lòa.', group: 2, period: 3, uses: 'Hợp kim nhẹ (máy bay, ô tô), viên bổ sung Mg, chất làm sáng pháo, miếng đánh lửa.', nameOrigin: 'Từ Magnesia — thành phố ở Hy Lạp cổ nơi tìm thấy khoáng magiesi.' },
  { number: 13, symbol: 'Al', name: 'Aluminium', mass: 26.982, category: 'post-transition-metal', electrons: '[Ne] 3s2 3p1', shells: [2, 8, 3], description: 'Nhôm là kim loại dẻo, bền nhẹ, ứng dụng phổ biến trong chế tạo vỏ lon và máy bay.', group: 13, period: 3, uses: 'Vỏ lon, giấy gói, cấu kiện máy bay, dây dẫn điện cao thế, sơn, đánh bong.', nameOrigin: 'Từ "alumen" (Latin) = phèn nhôm — chất chét bứt liều cục được dùng từ cổ đại.' },
  { number: 14, symbol: 'Si', name: 'Silicon', mass: 28.085, category: 'metalloid', electrons: '[Ne] 3s2 3p2', shells: [2, 8, 4], description: 'Silic là á kim đóng vai trò nền tảng cho chip bán dẫn và công nghệ vi điện tử.', group: 14, period: 3, uses: 'Chip bán dẫn (CPU, GPU), tấm pin mặt trời, silicone, thủy tinh, bê tông.', nameOrigin: 'Từ "silex" (Latin) = đá silic, hoặc "silicem" có nghĩa đá lửa.' },
  { number: 15, symbol: 'P', name: 'Phosphorus', mass: 30.974, category: 'nonmetal', electrons: '[Ne] 3s2 3p3', shells: [2, 8, 5], description: 'Photpho có 2 dạng thù hình chính là đỏ và trắng, dùng làm đầu que diêm.', group: 15, period: 3, uses: 'Đầu que diêm, phân bón (DAP, đơn), thành phần xương răng (apatite), chất nổ.', nameOrigin: 'Từ "phosphos" (Hy Lạp) = mang ánh sáng — dạng trắng phát sáng trong bóng tối.' },
  { number: 16, symbol: 'S', name: 'Sulfur', mass: 32.06, category: 'nonmetal', electrons: '[Ne] 3s2 3p4', shells: [2, 8, 6], description: 'Lưu huỳnh là phi kim màu vàng, thành phần cấu tạo thuốc súng và lưu hóa cao su.', group: 16, period: 3, uses: 'Axit sunfuric H₂SO₄ (quan trọng nhất), lưu hóa cao su, dược phẩm, chất diệt nấm.', nameOrigin: 'Từ "sulfur" (Latin) — tên cổ biết từ thời cổ đại, gắn với mùi đặc trưng khó chịu.' },
  { number: 17, symbol: 'Cl', name: 'Chlorine', mass: 35.45, category: 'halogen', electrons: '[Ne] 3s2 3p5', shells: [2, 8, 7], description: 'Clo là khí halogen màu vàng lục, dùng sát trùng bể bơi và tẩy trắng.', group: 17, period: 3, uses: 'Khử trùng nước máy/bể bơi, thuốc tẩy nước Javen, PVC, HCl, thuốc thú y.', nameOrigin: 'Từ "chloros" (Hy Lạp) = xanh lục vàng — màu sắc đặc trưng của khí Clo.' },
  { number: 18, symbol: 'Ar', name: 'Argon', mass: 39.95, category: 'noble-gas', electrons: '[Ne] 3s2 3p6', shells: [2, 8, 8], description: 'Argon là khí hiếm trơ, bảo vệ dây tóc bóng đèn và môi trường hàn kim loại.', group: 18, period: 3, uses: 'Bảo vệ hàn điện (MIG/TIG), bảo quản tài liệu quý, đèn Argon, làm lạnh.', nameOrigin: 'Từ "argos" (Hy Lạp) = lười biếng — vì chất này không phản ứng hóa học.' },
  
  // Period 4
  { number: 19, symbol: 'K', name: 'Potassium', mass: 39.098, category: 'alkali-metal', electrons: '[Ar] 4s1', shells: [2, 8, 8, 1], description: 'Kali là kim loại kiềm siêu mềm, cháy tạo ngọn lửa màu tím đặc trưng.', group: 1, period: 4, uses: 'Phân bón kali (quan trọng cho nông nghiệp), thuốc nổ (KNO₃), KOH, muối kali.', nameOrigin: 'K từ "Kalium" (Latin/Ả Rập "qili" = tro thực vật). Potassium từ "potash".' },
  { number: 20, symbol: 'Ca', name: 'Calcium', mass: 40.078, category: 'alkaline-earth-metal', electrons: '[Ar] 4s2', shells: [2, 8, 8, 2], description: 'Canxi cấu tạo nên xương, răng và vỏ của nhiều sinh vật biển.', group: 2, period: 4, uses: 'Bổ sung canxi (sức khỏe xương), xi măng, thạch cao, vôi, sản xuất thép.', nameOrigin: 'Từ "calx" (Latin) = vôi — được tìm trong đá vôi (CaCO₃).' },
  { number: 21, symbol: 'Sc', name: 'Scandium', mass: 44.956, category: 'transition-metal', electrons: '[Ar] 3d1 4s2', shells: [2, 8, 9, 2], description: 'Scandi là kim loại chuyển tiếp nhẹ, tăng độ bền cho các hợp kim nhôm.', group: 3, period: 4 },
  { number: 22, symbol: 'Ti', name: 'Titanium', mass: 47.867, category: 'transition-metal', electrons: '[Ar] 3d2 4s2', shells: [2, 8, 10, 2], description: 'Titan siêu bền, cực nhẹ và chống rỉ sét hoàn hảo, dùng chế tạo khớp nhân tạo.', group: 4, period: 4 },
  { number: 23, symbol: 'V', name: 'Vanadium', mass: 50.942, category: 'transition-metal', electrons: '[Ar] 3d3 4s2', shells: [2, 8, 11, 2], description: 'Vanadi gia cố thép chống ăn mòn và mài mòn cao.', group: 5, period: 4 },
  { number: 24, symbol: 'Cr', name: 'Chromium', mass: 51.996, category: 'transition-metal', electrons: '[Ar] 3d5 4s1', shells: [2, 8, 13, 1], description: 'Crom tạo độ bóng gương cho bề mặt kim loại, chống rỉ sét siêu hạng.', group: 6, period: 4 },
  { number: 25, symbol: 'Mn', name: 'Manganese', mass: 54.938, category: 'transition-metal', electrons: '[Ar] 3d5 4s2', shells: [2, 8, 13, 2], description: 'Mangan là chất khử oxy quan trọng trong quá trình luyện thép hợp kim.', group: 7, period: 4 },
  { number: 26, symbol: 'Fe', name: 'Iron', mass: 55.845, category: 'transition-metal', electrons: '[Ar] 3d6 4s2', shells: [2, 8, 14, 2], description: 'Sắt là xương sống của ngành công nghiệp xây dựng và giao thông vận tải.', group: 8, period: 4 },
  { number: 27, symbol: 'Co', name: 'Cobalt', mass: 58.933, category: 'transition-metal', electrons: '[Ar] 3d7 4s2', shells: [2, 8, 15, 2], description: 'Coban có màu xanh dương thẳm huyền bí, thành phần chính của pin Li-ion.', group: 9, period: 4 },
  { number: 28, symbol: 'Ni', name: 'Nickel', mass: 58.693, category: 'transition-metal', electrons: '[Ar] 3d8 4s2', shells: [2, 8, 16, 2], description: 'Niken dùng chế tạo thép không gỉ (Inox) và đúc tiền xu cực bền.', group: 10, period: 4 },
  { number: 29, symbol: 'Cu', name: 'Copper', mass: 63.546, category: 'transition-metal', electrons: '[Ar] 3d10 4s1', shells: [2, 8, 18, 1], description: 'Đồng là chất dẫn điện quốc dân, dùng làm lõi dây điện và nồi đồng.', group: 11, period: 4 },
  { number: 30, symbol: 'Zn', name: 'Zinc', mass: 65.38, category: 'transition-metal', electrons: '[Ar] 3d10 4s2', shells: [2, 8, 18, 2], description: 'Kẽm phủ lớp mạ kẽm bảo vệ tôn lợp và tăng hệ miễn dịch sinh học.', group: 12, period: 4 },
  { number: 31, symbol: 'Ga', name: 'Gallium', mass: 69.723, category: 'post-transition-metal', electrons: '[Ar] 3d10 4s2 3p1', shells: [2, 8, 18, 3], description: 'Gali là kim loại độc đáo tự hóa lỏng ngay trong lòng bàn tay ấm.', group: 13, period: 4 },
  { number: 32, symbol: 'Ge', name: 'Germanium', mass: 72.630, category: 'metalloid', electrons: '[Ar] 3d10 4s2 3p2', shells: [2, 8, 18, 4], description: 'Gecmani là nguyên tố á kim làm điốt phát quang và mắt kính hồng ngoại.', group: 14, period: 4 },
  { number: 33, symbol: 'As', name: 'Arsenic', mass: 74.922, category: 'metalloid', electrons: '[Ar] 3d10 4s2 3p3', shells: [2, 8, 18, 5], description: 'Asen là á kim có độc tính cực cao trong hợp chất thạch tín.', group: 15, period: 4 },
  { number: 34, symbol: 'Se', name: 'Selenium', mass: 78.971, category: 'nonmetal', electrons: '[Ar] 3d10 4s2 3p4', shells: [2, 8, 18, 6], description: 'Selen dẫn điện mạnh hơn khi có ánh sáng mặt trời chiếu vào.', group: 16, period: 4 },
  { number: 35, symbol: 'Br', name: 'Bromine', mass: 79.904, category: 'halogen', electrons: '[Ar] 3d10 4s2 3p5', shells: [2, 8, 18, 7], description: 'Brom là phi kim halogen duy nhất tồn tại ở thể lỏng màu đỏ nâu bay hơi độc.', group: 17, period: 4 },
  { number: 36, symbol: 'Kr', name: 'Krypton', mass: 83.798, category: 'noble-gas', electrons: '[Ar] 3d10 4s2 3p6', shells: [2, 8, 18, 8], description: 'Krypton nạp vào bóng đèn máy ảnh chụp chớp nhoáng siêu tốc.', group: 18, period: 4 },

  // Period 5
  { number: 37, symbol: 'Rb', name: 'Rubidium', mass: 85.468, category: 'alkali-metal', electrons: '[Kr] 5s1', shells: [2, 8, 18, 8, 1], description: 'Rubidi là kim loại kiềm phản ứng tự bốc cháy cực mạnh ngoài không khí.', group: 1, period: 5 },
  { number: 38, symbol: 'Sr', name: 'Strontium', mass: 87.62, category: 'alkaline-earth-metal', electrons: '[Kr] 5s2', shells: [2, 8, 18, 8, 2], description: 'Stronti tạo màu đỏ rực rỡ đặc trưng cho pháo hoa nghệ thuật.', group: 2, period: 5 },
  { number: 39, symbol: 'Y', name: 'Yttrium', mass: 88.906, category: 'transition-metal', electrons: '[Kr] 4d1 5s2', shells: [2, 8, 18, 9, 2], description: 'Ytri là kim loại màu bạc, ứng dụng đặc biệt tạo màu phát quang đèn LED.', group: 3, period: 5 },
  { number: 40, symbol: 'Zr', name: 'Zirconium', mass: 91.224, category: 'transition-metal', electrons: '[Kr] 4d2 5s2', shells: [2, 8, 18, 10, 2], description: 'Zirconi chống ăn mòn siêu tốt, dùng làm ống dẫn nhiên liệu hạt nhân.', group: 4, period: 5 },
  { number: 41, symbol: 'Nb', name: 'Niobium', mass: 92.906, category: 'transition-metal', electrons: '[Kr] 4d4 5s1', shells: [2, 8, 18, 12, 1], description: 'Niobi là kim loại hiếm có tính siêu dẫn đặc biệt ở nhiệt độ cực thấp.', group: 5, period: 5 },
  { number: 42, symbol: 'Mo', name: 'Molybdenum', mass: 95.95, category: 'transition-metal', electrons: '[Kr] 4d5 5s1', shells: [2, 8, 18, 13, 1], description: 'Molipden bổ sung vào thép giúp chịu nhiệt độ và áp suất cực cao.', group: 6, period: 5 },
  { number: 43, symbol: 'Tc', name: 'Technetium', mass: 98, category: 'transition-metal', electrons: '[Kr] 4d5 5s2', shells: [2, 8, 18, 13, 2], description: 'Tecneti là nguyên tố nhân tạo đầu tiên, dùng làm chất đánh dấu y khoa.', group: 7, period: 5 },
  { number: 44, symbol: 'Ru', name: 'Ruthenium', mass: 101.07, category: 'transition-metal', electrons: '[Kr] 4d7 5s1', shells: [2, 8, 18, 15, 1], description: 'Rutheni dùng phủ lên các tiếp điểm điện để chống mài mòn cơ học.', group: 8, period: 5 },
  { number: 45, symbol: 'Rh', name: 'Rhodium', mass: 102.91, category: 'transition-metal', electrons: '[Kr] 4d8 5s1', shells: [2, 8, 18, 16, 1], description: 'Rhodi là kim loại quý siêu đắt, mạ trang sức tạo vẻ sáng bóng lộng lẫy.', group: 9, period: 5 },
  { number: 46, symbol: 'Pd', name: 'Palladium', mass: 106.42, category: 'transition-metal', electrons: '[Kr] 4d10', shells: [2, 8, 18, 18], description: 'Paladi lọc các khí thải độc hại trong ống xả động cơ ô tô cực hiệu quả.', group: 10, period: 5 },
  { number: 47, symbol: 'Ag', name: 'Silver', mass: 107.87, category: 'transition-metal', electrons: '[Kr] 4d10 5s1', shells: [2, 8, 18, 18, 1], description: 'Bạc là kim loại quý dẫn điện và dẫn nhiệt đứng đầu thế giới.', group: 11, period: 5 },
  { number: 48, symbol: 'Cd', name: 'Cadmium', mass: 112.41, category: 'transition-metal', electrons: '[Kr] 4d10 5s2', shells: [2, 8, 18, 18, 2], description: 'Cadimi ứng dụng rộng rãi trong pin niken-cadimi cũ.', group: 12, period: 5 },
  { number: 49, symbol: 'In', name: 'Indium', mass: 114.82, category: 'post-transition-metal', electrons: '[Kr] 4d10 5s2 5p1', shells: [2, 8, 18, 18, 3], description: 'Indi tạo màng mỏng dẫn điện trong suốt trên kính cảm ứng điện thoại.', group: 13, period: 5 },
  { number: 50, symbol: 'Sn', name: 'Tin', mass: 118.71, category: 'post-transition-metal', electrons: '[Kr] 4d10 5s2 5p2', shells: [2, 8, 18, 18, 4], description: 'Thiếc dùng hàn vi mạch điện tử và làm vỏ hộp bảo quản thực phẩm.', group: 14, period: 5 },
  { number: 51, symbol: 'Sb', name: 'Antimony', mass: 121.76, category: 'metalloid', electrons: '[Kr] 4d10 5s2 5p3', shells: [2, 8, 18, 18, 5], description: 'Antimon được pha vào chì để tăng độ cứng cho bản cực ắc quy.', group: 15, period: 5 },
  { number: 52, symbol: 'Te', name: 'Tellurium', mass: 127.60, category: 'metalloid', electrons: '[Kr] 4d10 5s2 5p4', shells: [2, 8, 18, 18, 6], description: 'Telu nâng cao khả năng gia công cơ khí của thép và đồng hợp kim.', group: 16, period: 5 },
  { number: 53, symbol: 'I', name: 'Iodine', mass: 126.90, category: 'halogen', electrons: '[Kr] 4d10 5s2 5p5', shells: [2, 8, 18, 18, 7], description: 'I-ốt là nguyên tố halogen thể rắn thăng hoa, ngăn ngừa bướu cổ.', group: 17, period: 5 },
  { number: 54, symbol: 'Xe', name: 'Xenon', mass: 131.29, category: 'noble-gas', electrons: '[Kr] 4d10 5s2 5p6', shells: [2, 8, 18, 18, 8], description: 'Xenon nạp trong bóng đèn pha ô tô xenon cường độ chiếu sáng cực mạnh.', group: 18, period: 5 },

  // Period 6
  { number: 55, symbol: 'Cs', name: 'Caesium', mass: 132.91, category: 'alkali-metal', electrons: '[Xe] 6s1', shells: [2, 8, 18, 18, 8, 1], description: 'Xêsi cực nhạy với ánh sáng, dùng chế tạo đồng hồ nguyên tử chuẩn xác nhất hành tinh.', group: 1, period: 6 },
  { number: 56, symbol: 'Ba', name: 'Barium', mass: 137.33, category: 'alkaline-earth-metal', electrons: '[Xe] 6s2', shells: [2, 8, 18, 18, 8, 2], description: 'Bari là chất cản quang hỗ trợ đắc lực chụp X-quang hệ tiêu hóa y tế.', group: 2, period: 6 },
  { number: 57, symbol: 'La', name: 'Lanthanum', mass: 138.91, category: 'transition-metal', electrons: '[Xe] 5d1 6s2', shells: [2, 8, 18, 18, 9, 2], description: 'Lantan đứng đầu nhóm Lanthanoid, dùng chế tạo kính đặc biệt cho ống kính máy ảnh.', group: 3, period: 6 },
  { number: 72, symbol: 'Hf', name: 'Hafnium', mass: 178.49, category: 'transition-metal', electrons: '[Xe] 4f14 5d2 6s2', shells: [2, 8, 18, 32, 10, 2], description: 'Hafni hấp thụ nơtron cực tốt, dùng làm thanh điều khiển phản ứng hạt nhân.', group: 4, period: 6 },
  { number: 73, symbol: 'Ta', name: 'Tantalum', mass: 180.95, category: 'transition-metal', electrons: '[Xe] 4f14 5d3 6s2', shells: [2, 8, 18, 32, 11, 2], description: 'Tantal chống axit ăn mòn tuyệt đối, làm tụ điện siêu nhỏ cho điện thoại.', group: 5, period: 6 },
  { number: 74, symbol: 'W', name: 'Tungsten', mass: 183.84, category: 'transition-metal', electrons: '[Xe] 4f14 5d4 6s2', shells: [2, 8, 18, 32, 12, 2], description: 'Vônfram có nhiệt độ nóng chảy kỷ lục, dùng làm dây tóc bóng đèn sợi đốt.', group: 6, period: 6 },
  { number: 75, symbol: 'Re', name: 'Rhenium', mass: 186.21, category: 'transition-metal', electrons: '[Xe] 4f14 5d5 6s2', shells: [2, 8, 18, 32, 13, 2], description: 'Rheni liên kết chịu nhiệt cao, cấu thành cánh tuabin động cơ phản lực lực đẩy cao.', group: 7, period: 6 },
  { number: 76, symbol: 'Os', name: 'Osmium', mass: 190.23, category: 'transition-metal', electrons: '[Xe] 4f14 5d6 6s2', shells: [2, 8, 18, 32, 14, 2], description: 'Osmi là chất tự nhiên nặng nhất hành tinh, làm ngòi bút máy cao cấp.', group: 8, period: 6 },
  { number: 77, symbol: 'Ir', name: 'Iridium', mass: 192.22, category: 'transition-metal', electrons: '[Xe] 4f14 5d7 6s2', shells: [2, 8, 18, 32, 15, 2], description: 'Iridi siêu cứng chống gỉ, dùng làm đầu bugi ô tô siêu bền.', group: 9, period: 6 },
  { number: 78, symbol: 'Pt', name: 'Platinum', mass: 195.08, category: 'transition-metal', electrons: '[Xe] 4f14 5d9 6s1', shells: [2, 8, 18, 32, 17, 1], description: 'Bạch kim là kim loại quý trơ hóa học tuyệt đối, làm trang sức và xúc tác phòng thí nghiệm.', group: 10, period: 6 },
  { number: 79, symbol: 'Au', name: 'Gold', mass: 196.97, category: 'transition-metal', electrons: '[Xe] 4f14 5d10 6s1', shells: [2, 8, 18, 32, 18, 1], description: 'Vàng là kim loại quý có tính dát mỏng vô địch, chống xỉn màu vĩnh viễn.', group: 11, period: 6 },
  { number: 80, symbol: 'Hg', name: 'Mercury', mass: 200.59, category: 'transition-metal', electrons: '[Xe] 4f14 5d10 6s2', shells: [2, 8, 18, 32, 18, 2], description: 'Thủy ngân là kim loại lỏng duy nhất ở nhiệt độ thường, rất độc, dùng làm nhiệt kế.', group: 12, period: 6 },
  { number: 81, symbol: 'Tl', name: 'Thallium', mass: 204.38, category: 'post-transition-metal', electrons: '[Xe] 4f14 5d10 6s2 6p1', shells: [2, 8, 18, 32, 18, 3], description: 'Thali có độc tính cao, dùng trong các kính hồng ngoại quân sự đặc dụng.', group: 13, period: 6 },
  { number: 82, symbol: 'Pb', name: 'Lead', mass: 207.2, category: 'post-transition-metal', electrons: '[Xe] 4f14 5d10 6s2 6p2', shells: [2, 8, 18, 32, 18, 4], description: 'Chì nặng mềm chắn tia X và bức xạ phóng xạ, làm điện cực ắc quy chì-axit.', group: 14, period: 6 },
  { number: 83, symbol: 'Bi', name: 'Bismuth', mass: 208.98, category: 'post-transition-metal', electrons: '[Xe] 4f14 5d10 6s2 6p3', shells: [2, 8, 18, 32, 18, 5], description: 'Bismut có tính nghịch từ mạnh, là kim loại nặng ít độc tính nhất.', group: 15, period: 6 },
  { number: 84, symbol: 'Po', name: 'Polonium', mass: 209, category: 'metalloid', electrons: '[Xe] 4f14 5d10 6s2 6p4', shells: [2, 8, 18, 32, 18, 6], description: 'Poloni phát xạ hạt alpha cực mạnh, tỏa lượng nhiệt phóng xạ khổng lồ.', group: 16, period: 6 },
  { number: 85, symbol: 'At', name: 'Astatine', mass: 210, category: 'halogen', electrons: '[Xe] 4f14 5d10 6s2 6p5', shells: [2, 8, 18, 32, 18, 7], description: 'Astat là nguyên tố halogen phóng xạ siêu hiếm có mặt trên Trái Đất.', group: 17, period: 6 },
  { number: 86, symbol: 'Rn', name: 'Radon', mass: 222, category: 'noble-gas', electrons: '[Xe] 4f14 5d10 6s2 6p6', shells: [2, 8, 18, 32, 18, 8], description: 'Radon là khí hiếm phóng xạ tự nhiên giải phóng từ đất đá.', group: 18, period: 6 },

  // Period 7
  { number: 87, symbol: 'Fr', name: 'Francium', mass: 223, category: 'alkali-metal', electrons: '[Rn] 7s1', shells: [2, 8, 18, 32, 18, 8, 1], description: 'Franxi là kim loại kiềm siêu phóng xạ bất ổn định nhất bảng tuần hoàn.', group: 1, period: 7 },
  { number: 88, symbol: 'Ra', name: 'Radium', mass: 226, category: 'alkaline-earth-metal', electrons: '[Rn] 7s2', shells: [2, 8, 18, 32, 18, 8, 2], description: 'Radi phóng xạ cực mạnh phát huỳnh quang tự nhiên màu xanh huyền ảo.', group: 2, period: 7 },
  { number: 89, symbol: 'Ac', name: 'Actinium', mass: 227, category: 'transition-metal', electrons: '[Rn] 6d1 7s2', shells: [2, 8, 18, 32, 18, 9, 2], description: 'Actini đứng đầu nhóm Actinoid, phát ra luồng bức xạ cực mạnh.', group: 3, period: 7 },
  { number: 104, symbol: 'Rf', name: 'Rutherfordium', mass: 267, category: 'transition-metal', electrons: '[Rn] 5f14 6d2 7s2', shells: [2, 8, 18, 32, 32, 10, 2], description: 'Rutherfordi là nguyên tố nhân tạo siêu nặng tổng hợp trong phòng thí nghiệm.', group: 4, period: 7 },
  { number: 105, symbol: 'Db', name: 'Dubnium', mass: 268, category: 'transition-metal', electrons: '[Rn] 5f14 6d3 7s2', shells: [2, 8, 18, 32, 32, 11, 2], description: 'Dubni phân rã cực nhanh, đặt tên theo trung tâm hạt nhân Dubna của Nga.', group: 5, period: 7 },
  { number: 106, symbol: 'Sg', name: 'Seaborgium', mass: 269, category: 'transition-metal', electrons: '[Rn] 5f14 6d4 7s2', shells: [2, 8, 18, 32, 32, 12, 2], description: 'Seaborgi đặt tên vinh danh nhà hóa học hạt nhân Glenn Seaborg.', group: 6, period: 7 },
  { number: 107, symbol: 'Bh', name: 'Bohrium', mass: 270, category: 'transition-metal', electrons: '[Rn] 5f14 6d5 7s2', shells: [2, 8, 18, 32, 32, 13, 2], description: 'Bohri đặt tên tôn vinh Niels Bohr - cha đẻ mô hình nguyên tử hiện đại.', group: 7, period: 7 },
  { number: 108, symbol: 'Hs', name: 'Hassium', mass: 269, category: 'transition-metal', electrons: '[Rn] 5f14 6d6 7s2', shells: [2, 8, 18, 32, 32, 14, 2], description: 'Hassi được tổng hợp nhân tạo tại Đức bằng cách bắn phá hạt nhân chì.', group: 8, period: 7 },
  { number: 109, symbol: 'Mt', name: 'Meitnerium', mass: 278, category: 'transition-metal', electrons: '[Rn] 5f14 6d7 7s2', shells: [2, 8, 18, 32, 32, 15, 2], description: 'Meitneri đặt tên vinh danh nhà vật lý hạt nhân vĩ đại Lise Meitner.', group: 9, period: 7 },
  { number: 110, symbol: 'Ds', name: 'Darmstadtium', mass: 281, category: 'transition-metal', electrons: '[Rn] 5f14 6d9 7s1', shells: [2, 8, 18, 32, 32, 17, 1], description: 'Darmstadti phân rã cực nhanh chỉ trong phần nghìn giây.', group: 10, period: 7 },
  { number: 111, symbol: 'Rg', name: 'Roentgenium', mass: 282, category: 'transition-metal', electrons: '[Rn] 5f14 6d10 7s1', shells: [2, 8, 18, 32, 32, 18, 1], description: 'Roentgeni đặt tên kỷ niệm Röntgen - người phát hiện ra tia X-quang.', group: 11, period: 7 },
  { number: 112, symbol: 'Cn', name: 'Copernicium', mass: 285, category: 'transition-metal', electrons: '[Rn] 5f14 6d10 7s2', shells: [2, 8, 18, 32, 32, 18, 2], description: 'Copernici đặt tên theo Copernicus - cha đẻ thuyết nhật tâm vũ trụ.', group: 12, period: 7 },
  { number: 113, symbol: 'Nh', name: 'Nihonium', mass: 286, category: 'post-transition-metal', electrons: '[Rn] 5f14 6d10 7s2 7p1', shells: [2, 8, 18, 32, 32, 18, 3], description: 'Nihoni là nguyên tố siêu nặng đầu tiên được phát hiện tại châu Á (Nhật Bản).', group: 13, period: 7 },
  { number: 114, symbol: 'Fl', name: 'Flerovium', mass: 289, category: 'post-transition-metal', electrons: '[Rn] 5f14 6d10 7s2 7p2', shells: [2, 8, 18, 32, 32, 18, 4], description: 'Flerovi siêu nặng nhân tạo tổng hợp thành công tại Nga.', group: 14, period: 7 },
  { number: 115, symbol: 'Mc', name: 'Moscovium', mass: 290, category: 'post-transition-metal', electrons: '[Rn] 5f14 6d10 7s2 7p3', shells: [2, 8, 18, 32, 32, 18, 5], description: 'Moscovi là nguyên tố tổng hợp siêu nặng cực kỳ bất ổn.', group: 15, period: 7 },
  { number: 116, symbol: 'Lv', name: 'Livermori', mass: 293, category: 'post-transition-metal', electrons: '[Rn] 5f14 6d10 7s2 7p4', shells: [2, 8, 18, 32, 32, 18, 6], description: 'Livermori đặt tên theo phòng thí nghiệm Lawrence Livermore nổi tiếng của Mỹ.', group: 16, period: 7 },
  { number: 117, symbol: 'Ts', name: 'Tennessine', mass: 294, category: 'halogen', electrons: '[Rn] 5f14 6d10 7s2 7p5', shells: [2, 8, 18, 32, 32, 18, 7], description: 'Tennessine là halogen nhân tạo siêu nặng cuối cùng được tổng hợp.', group: 17, period: 7 },
  { number: 118, symbol: 'Og', name: 'Oganesson', mass: 294, category: 'noble-gas', electrons: '[Rn] 5f14 6d10 7s2 7p6', shells: [2, 8, 18, 32, 32, 18, 8], description: 'Oganesson là nguyên tố kết thúc chu kỳ 7, có số hiệu nguyên tử lớn nhất hiện nay.', group: 18, period: 7 },
];

const categoryColors: Record<string, string> = {
  'nonmetal': 'bg-green-500/20 border-green-500/50 text-green-300',
  'noble-gas': 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300',
  'alkali-metal': 'bg-rose-500/20 border-rose-500/50 text-rose-300',
  'alkaline-earth-metal': 'bg-orange-500/20 border-orange-500/50 text-orange-300',
  'metalloid': 'bg-amber-500/20 border-amber-500/50 text-amber-300',
  'halogen': 'bg-purple-500/20 border-purple-500/50 text-purple-300',
  'post-transition-metal': 'bg-blue-500/20 border-blue-500/50 text-blue-300',
  'transition-metal': 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
};

const categoryNames: Record<string, string> = {
  'nonmetal': 'Phi kim',
  'noble-gas': 'Khí hiếm',
  'alkali-metal': 'Kim loại kiềm',
  'alkaline-earth-metal': 'Kim loại kiềm thổ',
  'metalloid': 'Á kim',
  'halogen': 'Halogen',
  'post-transition-metal': 'Kim loại yếu',
  'transition-metal': 'Kim loại chuyển tiếp',
};

// --- 3D Atomic Components ---
const Nucleus = ({ protons, neutrons }: { protons: number; neutrons: number }) => {
  const particles = React.useMemo(() => {
    const list = [];
    const total = Math.min(protons + neutrons, 50); // Cap particles for performance
    for (let i = 0; i < total; i++) {
      const isProton = i < protons;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = Math.random() * 0.45;
      list.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        color: isProton ? '#ef4444' : '#3b82f6', // Bright red for protons, Bright blue for neutrons
      });
    }
    return list;
  }, [protons, neutrons]);

  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, idx) => (
        <mesh key={idx} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[0.13, 10, 10]} />
          <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={0.3} roughness={0.4} metalness={0.2} />
        </mesh>
      ))}
      <pointLight distance={4} intensity={2} color="#ffffff" />
    </group>
  );
};

const ElectronShell = ({ radius, electronCount, angleX, angleY, speed }: { radius: number; electronCount: number; angleX: number; angleY: number; speed: number }) => {
  const electronsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (electronsRef.current) {
      electronsRef.current.rotation.z = state.clock.getElapsedTime() * speed;
    }
  });

  const points = React.useMemo(() => {
    const pts = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
    }
    return pts;
  }, [radius]);

  const lineGeometry = React.useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  const lineObject = React.useMemo(() => {
    const material = new THREE.LineBasicMaterial({ color: "#ffffff", opacity: 0.4, transparent: true });
    return new THREE.Line(lineGeometry, material);
  }, [lineGeometry]);

  return (
    <group rotation={[angleX, angleY, 0]}>
      {/* Orbit Ring */}
      <primitive object={lineObject} />

      {/* Electrons */}
      <group ref={electronsRef}>
        {Array.from({ length: electronCount }).map((_, j) => {
          const angle = (j / electronCount) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <mesh key={j} position={[x, y, 0]}>
              <sphereGeometry args={[0.07, 10, 10]} />
              <meshStandardMaterial 
                color="#facc15" 
                emissive="#facc15" 
                emissiveIntensity={2.0}
                roughness={0.2} 
              />
              <pointLight distance={1.2} intensity={0.8} color="#facc15" />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};

// --- Main Atomic Component ---
const AtomicStructure = ({ shells, number, mass }: { shells: number[], number: number, mass: number }) => {
  const neutrons = Math.round(mass) - number;

  const shellConfigs = React.useMemo(() => {
    return shells.map((count, i) => {
      const radius = 1.0 + (i + 1) * 0.55;
      const angleX = (i * Math.PI) / shells.length + 0.35;
      const angleY = (i * Math.PI) / (shells.length * 1.6) + 0.25;
      const speed = 1.4 - i * 0.16;
      return { radius, count, angleX, angleY, speed };
    });
  }, [shells]);

  return (
    <div className="relative w-full h-[280px] bg-slate-950/80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center my-6">
      <Canvas camera={{ position: [0, 0, 7.0], fov: 42 }} className="w-full h-full cursor-grab active:cursor-grabbing">
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.8} />
        <pointLight position={[-5, -5, -5]} intensity={0.4} />
        
        <Nucleus protons={number} neutrons={neutrons} />
        
        {shellConfigs.map((cfg, i) => (
          <ElectronShell 
            key={i} 
            radius={cfg.radius} 
            electronCount={cfg.count} 
            angleX={cfg.angleX} 
            angleY={cfg.angleY} 
            speed={cfg.speed} 
          />
        ))}

        <OrbitControls enableZoom={true} enablePan={false} maxDistance={12} minDistance={3.5} />
      </Canvas>

      {/* Control Instruction Overlay */}
      <div className="absolute bottom-3 right-4 px-2.5 py-1 bg-black/50 backdrop-blur-md rounded-lg border border-white/5 pointer-events-none select-none">
        <span className="text-[10px] text-cyan-300/80 font-mono tracking-wider">Drag to rotate 3D • Scroll to zoom</span>
      </div>
    </div>
  );
};


export function PeriodicTableApp({ onBack }: PeriodicTableAppProps) {
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
      {/* Header */}
      <div className="p-6 md:p-8 flex items-center justify-between z-10 relative">
        <button 
          onClick={onBack} 
          className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-2 font-sans"
        >
          <ChevronLeft className="w-5 h-5" /> Trở về
        </button>
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 tracking-wider">
          Bảng Tuần Hoàn Thông Minh
        </h1>
        <div className="w-24"></div> {/* Spacer for symmetry */}
      </div>

      {/* Main Table Area */}
      <div className="flex-1 overflow-x-auto p-4 flex justify-center items-center relative z-10 pb-20">
        <div className="grid grid-cols-[18] gap-1.5 md:gap-2 w-max mx-auto" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
          {/* Group Headers - IUPAC 1-18 */}
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={`header-${i}`} style={{ gridColumnStart: i + 1, gridRowStart: 1 }} className="flex flex-col items-center justify-end text-center mb-1">
              <span className="text-[0.6rem] md:text-sm font-black text-slate-300 bg-white/5 rounded px-1">{i + 1}</span>
            </div>
          ))}

          {/* We lay out the grid: 18 columns, 7 rows */}
          {elements.map((el) => {
            // Calculate grid column and row based on group and period
            const colStart = el.group;
            const rowStart = el.period + 1;
            
            return (
              <motion.div
                key={el.number}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, zIndex: 10 }}
                onClick={() => setSelectedElement(el)}
                className={`relative w-12 h-14 md:w-16 md:h-20 lg:w-20 lg:h-24 border ${categoryColors[el.category] || 'bg-slate-800/50 border-slate-700 text-slate-300'} flex flex-col items-center justify-center cursor-pointer transition-colors hover:shadow-[0_0_15px_currentColor] rounded-md md:rounded-lg overflow-hidden backdrop-blur-md`}
                style={{ gridColumnStart: colStart, gridRowStart: rowStart }}
              >
                <span className="absolute top-1 left-1.5 text-[0.5rem] md:text-xs font-bold opacity-80">{el.number}</span>
                <span className="text-lg md:text-2xl lg:text-3xl font-black mt-2">{el.symbol}</span>
                <span className="text-[0.4rem] md:text-[0.6rem] lg:text-xs text-center leading-tight truncate w-full px-1 opacity-90 mt-auto mb-1">
                  {el.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legends */}
      <div className="flex flex-wrap justify-center gap-3 p-6 z-10 relative">
         {Object.entries(categoryNames).map(([key, name]) => (
           <div key={key} className="flex items-center gap-2">
             <div className={`w-4 h-4 rounded ${categoryColors[key]} border`}></div>
             <span className="text-sm">{name}</span>
           </div>
         ))}
      </div>

      {/* Modal Details */}
      <AnimatePresence>
        {selectedElement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedElement(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.5)] max-w-lg w-full relative overflow-hidden flex flex-col"
            >
              {/* Decorative Background Blob */}
              <div className={`absolute -top-20 -right-20 w-64 h-64 blur-[80px] rounded-full pointer-events-none opacity-30 ${categoryColors[selectedElement.category]?.split(' ')[0] || 'bg-slate-500'}`}></div>

              <button 
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/20 transition-colors font-sans"
                onClick={() => setSelectedElement(null)}
              >
                <X className="w-6 h-6 text-slate-300 hover:text-white" />
              </button>

              <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-6">
                 <div className={`w-28 h-32 rounded-2xl border-2 flex flex-col items-center justify-center shadow-xl ${categoryColors[selectedElement.category] || 'bg-slate-800/50 border-slate-700 text-slate-300'}`}>
                    <span className="text-sm font-bold opacity-80 self-start ml-2 mt-1">{selectedElement.number}</span>
                    <span className="text-6xl font-black -mt-2">{selectedElement.symbol}</span>
                 </div>
                 <div>
                    <h2 className="text-4xl font-black text-white">{selectedElement.name}</h2>
                    <p className="text-xl mt-1 opacity-80">{categoryNames[selectedElement.category]}</p>
                 </div>
              </div>

              <div className="space-y-4 text-lg">
                 <AtomicStructure shells={selectedElement.shells} number={selectedElement.number} mass={selectedElement.mass} />
                 
                 {/* Số proton, neutron, electron */}
                 <div className="grid grid-cols-3 gap-3">
                   <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-center">
                     <div className="text-xs text-red-300 font-bold uppercase tracking-wider mb-1">Proton</div>
                     <div className="text-2xl font-black text-red-400">{selectedElement.number}</div>
                   </div>
                   <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-xl text-center">
                     <div className="text-xs text-blue-300 font-bold uppercase tracking-wider mb-1">Neutron</div>
                     <div className="text-2xl font-black text-blue-400">{Math.round(selectedElement.mass) - selectedElement.number}</div>
                   </div>
                   <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-xl text-center">
                     <div className="text-xs text-yellow-300 font-bold uppercase tracking-wider mb-1">Electron</div>
                     <div className="text-2xl font-black text-yellow-400">{selectedElement.number}</div>
                   </div>
                 </div>

                 <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl border border-white/5">
                   <span className="font-bold text-slate-400">Khối lượng nguyên tử:</span>
                   <span className="font-black text-white text-xl">{selectedElement.mass}</span>
                 </div>
                 <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl border border-white/5">
                   <span className="font-bold text-slate-400">Cấu hình electron:</span>
                   <span className="font-black text-cyan-300 text-xl tracking-wider">{selectedElement.electrons}</span>
                 </div>
                 <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                   <p className="text-slate-200 leading-relaxed italic">{selectedElement.description}</p>
                 </div>

                 {selectedElement.uses && (
                   <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl">
                     <div className="text-xs text-emerald-300 font-black uppercase tracking-wider mb-2">🔧 Ứng dụng thực tế</div>
                     <p className="text-emerald-200 text-sm leading-relaxed">{selectedElement.uses}</p>
                   </div>
                 )}

                 {selectedElement.nameOrigin && (
                   <div className="bg-violet-500/10 border border-violet-500/30 p-4 rounded-xl">
                     <div className="text-xs text-violet-300 font-black uppercase tracking-wider mb-2">📖 Ý nghĩa tên</div>
                     <p className="text-violet-200 text-sm leading-relaxed">{selectedElement.nameOrigin}</p>
                   </div>
                 )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
