import { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export const useOnboardingTour = () => {
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Only run on the client, and only if it hasn't been seen
    const hasSeenTour = localStorage.getItem('has_seen_tour');
    if (hasSeenTour) return;

    // We delay the tour slightly to allow the DOM (and Framer Motion animations) to render
    const timer = setTimeout(() => {
      startTour();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const startTour = () => {
    setHasStarted(true);
    const driverObj = driver({
      showProgress: true,
      animate: true,
      doneBtnText: 'Hoàn thành',
      nextBtnText: 'Tiếp theo',
      prevBtnText: 'Quay lại',
      onDestroyStarted: () => {
        if (!driverObj.hasNextStep() || confirm('Bạn có chắc chắn muốn bỏ qua hướng dẫn không?')) {
          localStorage.setItem('has_seen_tour', 'true');
          driverObj.destroy();
          setHasStarted(false);
        }
      },
      steps: [
        {
          popover: {
            title: '✨ Chào mừng đến với Trạm Vũ Trụ Tri Thức!',
            description: 'Hãy dành 1 phút để tôi hướng dẫn bạn cách khám phá thế giới khoa học đầy thú vị này nhé.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '#tour-thi-nghiem',
          popover: {
            title: '🧪 Phòng Thực hành Ảo 3D',
            description: 'Khám phá các bài giảng, mô phỏng 3D và thí nghiệm tương tác thực tế của các khối lớp Khoa học tự nhiên.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#tour-ai-tool',
          popover: {
            title: '🤖 Kho Công cụ AI',
            description: 'Truy cập hàng chục công cụ Trí tuệ nhân tạo khổng lồ phục vụ cho việc học tập và nghiên cứu.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#tour-tro-choi',
          popover: {
            title: '🎮 Góc Giải trí',
            description: 'Học mà chơi, chơi mà học! Tham gia các trò chơi giáo dục để củng cố kiến thức một cách thú vị.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#tour-skkn',
          popover: {
            title: '👩‍🏫 Sổ tay Giáo viên',
            description: 'Nơi tổng hợp các Sáng kiến kinh nghiệm và công cụ quản lý chuyên môn dành riêng cho thầy cô.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#tour-on-tap',
          popover: {
            title: '📝 Kho Ôn tập & Sơ đồ tư duy',
            description: 'Công cụ vẽ sơ đồ tư duy Mindmap và các phiếu bài học giúp hệ thống hóa kiến thức.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#tour-search-bar',
          popover: {
            title: '🔍 Tìm kiếm siêu tốc',
            description: 'Bạn cần tìm một bài học hay công cụ cụ thể? Gõ từ khóa vào đây để mở ra ngay lập tức.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#tour-hot-tools',
          popover: {
            title: '🔥 Xu hướng nổi bật',
            description: 'Nơi vinh danh các bài học, công cụ đang được cộng đồng học sinh trải nghiệm nhiều nhất.',
            side: 'top',
            align: 'start'
          }
        }
      ]
    });

    driverObj.drive();
  };

  return { startTour, hasStarted };
};
