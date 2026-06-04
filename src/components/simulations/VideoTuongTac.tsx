import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Play, Pause, RotateCcw, Plus, Trash2, Edit3, 
  CheckCircle2, XCircle, AlertCircle, Save, FolderOpen, Download, 
  Upload as UploadIcon, Eye, Settings, HelpCircle, ChevronRight, 
  Check, Info, Sparkles, RefreshCw, Maximize, Minimize, Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getGeminiClient, getGeminiApiKey } from '../../lib/gemini';

// ----------------------------------------------------
// ĐỊNH NGHĨA PHÂN LOẠI CÂU HỎI
// ----------------------------------------------------
type QuestionType = 'single-choice' | 'multiple-choices' | 'fill-blank' | 'true-false';

interface Question {
  id: string;
  time: number; // thời điểm xuất hiện câu hỏi (giây)
  type: QuestionType;
  prompt: string;
  options: string[]; // các lựa chọn đối với trắc nghiệm
  correctAnswer: string | number | number[]; // index đáp án đúng (hoặc chữ đối với điền khuyết)
  explain: string; // Giải thích khi trả lời xong
}

interface InteractiveLecture {
  id: string;
  title: string;
  youtubeUrl: string;
  questions: Question[];
}

// ----------------------------------------------------
// BÀI GIẢNG ĐỀ MẪU BAN ĐẦU: Hệ Mặt Trời 101 (National Geographic)
// ----------------------------------------------------
const DEFAULT_LECTURE: InteractiveLecture = {
  id: 'solar-system-101',
  title: 'Khám Phá Hệ Mặt Trời - Khoa Học Vũ Trụ',
  youtubeUrl: 'https://www.youtube.com/watch?v=U7T25eD4p9Q', // Solar System 101
  questions: [
    {
      id: 'q1',
      time: 15,
      type: 'true-false',
      prompt: 'Mặt Trời chiếm hơn 99% khối lượng của toàn bộ Hệ Mặt Trời. Đúng hay Sai?',
      options: ['Đúng', 'Sai'],
      correctAnswer: 0, // Đúng
      explain: 'Chính xác! Mặt Trời chiếm khoảng 99.86% tổng khối lượng của toàn bộ Hệ Mặt Trời.'
    },
    {
      id: 'q2',
      time: 42,
      type: 'single-choice',
      prompt: 'Hành tinh nào trong Hệ Mặt Trời có kích thước nhỏ nhất và gần Mặt Trời nhất?',
      options: ['Sao Kim (Venus)', 'Sao Thủy (Mercury)', 'Sao Hỏa (Mars)', 'Sao Thổ (Saturn)'],
      correctAnswer: 1, // Sao Thủy
      explain: 'Sao Thủy (Mercury) là hành tinh nhỏ nhất và nằm gần Mặt Trời nhất trong Hệ Mặt Trời.'
    },
    {
      id: 'q3',
      time: 75,
      type: 'fill-blank',
      prompt: 'Điền vào chỗ trống: Hành tinh nào trong Hệ Mặt Trời được gọi tên là "Hành tinh Đỏ"?',
      options: [],
      correctAnswer: 'sao hỏa', // Hỗ trợ lowercase so sánh
      explain: 'Đáp án đúng là "Sao Hỏa" (hoặc "Mars"). Sắt oxit phong phú trên bề mặt của nó tạo nên màu đỏ đặc trưng.'
    },
    {
      id: 'q4',
      time: 110,
      type: 'multiple-choices',
      prompt: 'Những hành tinh nào sau đây được phân loại là "Hành tinh khí khổng lồ" (Gas Giants)? (Chọn tất cả các đáp án đúng)',
      options: ['Trái Đất', 'Sao Mộc (Jupiter)', 'Sao Thổ (Saturn)', 'Sao Thiên Vương (Uranus)'],
      correctAnswer: [1, 2], // Sao Mộc và Sao Thổ là Gas Giants (Thiên Vương/Hải Vương là Ice Giants, tuy nhiên đôi khi vẫn gộp chung hoặc ở đây chọn 2 đáp án rõ nhất)
      explain: 'Sao Mộc và Sao Thổ cấu tạo chủ yếu từ hydro và heli nên được gọi là các hành tinh khí khổng lồ.'
    }
  ]
};

const LOCAL_STORAGE_KEY = 'interactive_lectures';

export function VideoTuongTac({ onBack }: { onBack: () => void }) {
  // Trạng thái bài giảng
  const [lectureTitle, setLectureTitle] = useState(DEFAULT_LECTURE.title);
  const [youtubeUrl, setYoutubeUrl] = useState(DEFAULT_LECTURE.youtubeUrl);
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_LECTURE.questions);
  
  // Trạng thái Player
  const [videoId, setVideoId] = useState(() => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = DEFAULT_LECTURE.youtubeUrl.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : DEFAULT_LECTURE.youtubeUrl;
    return id.length === 11 ? id : '';
  });
  const [player, setPlayer] = useState<any>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Trạng thái các chế độ
  const [mode, setMode] = useState<'design' | 'student'>('design');
  const [savedLectures, setSavedLectures] = useState<InteractiveLecture[]>([]);
  const [showSavedList, setShowSavedList] = useState(false);

  // Trạng thái tạo câu hỏi mới
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [qTime, setQTime] = useState(0);
  const [qType, setQType] = useState<QuestionType>('single-choice');
  const [qPrompt, setQPrompt] = useState('');
  const [qOptions, setQOptions] = useState<string[]>(['', '']);
  const [qCorrectSingle, setQCorrectSingle] = useState<number>(0);
  const [qCorrectMulti, setQCorrectMulti] = useState<number[]>([]);
  const [qCorrectFill, setQCorrectFill] = useState<string>('');
  const [qExplain, setQExplain] = useState('');

  // Trạng thái trả lời câu hỏi tương tác (Học sinh)
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [studentSingleAns, setStudentSingleAns] = useState<number | null>(null);
  const [studentMultiAns, setStudentMultiAns] = useState<number[]>([]);
  const [studentFillAns, setStudentFillAns] = useState('');
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  
  // Quản lý các câu hỏi đã trả lời xong để không chặn lại nữa
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<Set<string>>(new Set());

  // Refs điều khiển
  const playerRef = useRef<any>(null);
  const checkTimeInterval = useRef<NodeJS.Timeout | null>(null);

  // Toàn màn hình
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Trạng thái AI generate
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleAIGenerate = async () => {
    if (!youtubeUrl) {
      alert("Vui lòng nhập link YouTube trước khi quét!");
      return;
    }
    
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      alert("Tài khoản của bạn yêu cầu cấu hình Gemini API Key để sử dụng tính năng này!");
      return;
    }

    setIsGeneratingAI(true);
    try {
      const client = getGeminiClient();
      const prompt = `Bạn là một chuyên gia giáo dục xuất sắc. Hãy quét và phân tích video YouTube tại đường link sau: ${youtubeUrl}.
(Nếu bạn không thể xem trực tiếp video, hãy đọc URL và suy luận nội dung dựa trên tiêu đề/chủ đề của video).
Nhiệm vụ của bạn là tạo ra một bài giảng tương tác bằng cách đặt ra từ 4 đến 6 câu hỏi trắc nghiệm sẽ hiện ra ở các mốc thời gian khác nhau trong video. Hãy phân bổ thời gian (giây) một cách hợp lý xuyên suốt từ 15s đến cuối video (khoảng 300s).

Hỗ trợ các loại câu hỏi (type): 
- "single-choice" (trắc nghiệm 1 đáp án)
- "multiple-choices" (trắc nghiệm nhiều đáp án)
- "true-false" (đúng sai)
- "fill-blank" (điền khuyết)

Bạn BẮT BUỘC trả về ĐÚNG MỘT MẢNG JSON, không giải thích gì thêm, với cấu trúc CHÍNH XÁC như sau:
[
  {
    "id": "q1",
    "time": 25,
    "type": "single-choice",
    "prompt": "Câu hỏi là gì?",
    "options": ["A", "B", "C", "D"], // với fill-blank thì mảng rỗng []
    "correctAnswer": 0, // index đáp án đúng (từ 0). multiple-choices là mảng vd [0,1]. fill-blank là chuỗi vd "sao hỏa". true-false là 0 (Đúng) hoặc 1 (Sai).
    "explain": "Giải thích chi tiết ngắn gọn tại sao lại chọn đáp án này."
  }
]
`;
      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3
        }
      });

      if (response.text) {
         const generatedQuestions = JSON.parse(response.text);
         const newQs = generatedQuestions.map((q: any) => ({
           ...q,
           id: `ai-${Date.now()}-${Math.random().toString(36).substring(2,9)}`
         }));
         setQuestions(prev => {
            const combined = [...prev, ...newQs];
            return combined.sort((a, b) => a.time - b.time);
         });
         alert("✨ Chà! AI đã tạo thành công các câu hỏi tương tác từ video!");
      }
    } catch (error: any) {
      console.error(error);
      alert("Oops! Có lỗi khi dùng AI quét video: " + error.message);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error("Lỗi bật toàn màn hình:", err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => console.error("Lỗi tắt toàn màn hình:", err));
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // ----------------------------------------------------
  // TRÍCH XUẤT YOUTUBE VIDEO ID TỪ URL
  // ----------------------------------------------------
  const extractVideoId = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : url;
    return id.length === 11 ? id : '';
  };

  useEffect(() => {
    setVideoId(extractVideoId(youtubeUrl));
  }, [youtubeUrl]);

  // Load danh sách bài giảng đã lưu từ localStorage
  useEffect(() => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      try {
        setSavedLectures(JSON.parse(data));
      } catch (e) {}
    }
  }, []);

  // ----------------------------------------------------
  // KHỞI TẠO GOOGLE YOUTUBE IFRAME PLAYER API
  // ----------------------------------------------------
  useEffect(() => {
    const containerId = mode === 'design' ? 'yt-iframe-player-design' : 'yt-iframe-player-student';
    
    // Hàm khởi tạo Player
    const initYTPlayer = () => {
      if (!videoId || videoId.length !== 11) return;

      // Phá hủy player cũ nếu có
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (e) {}
      }

      // Check if container exists in DOM
      const container = document.getElementById(containerId);
      if (!container) return;

      const newPlayer = new (window as any).YT.Player(containerId, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: mode === 'design' ? 1 : 0, // Ẩn điều khiển ở chế độ học sinh để chống tua qua câu hỏi
          rel: 0,
          modestbranding: 1,
          fs: 1,
          disablekb: mode === 'student' ? 1 : 0 // Khóa phím tắt bàn phím ở chế độ học sinh
        },
        events: {
          onReady: (event: any) => {
            setPlayer(event.target);
            setPlayerReady(true);
            setDuration(event.target.getDuration());
          },
          onStateChange: (event: any) => {
            // Tốc độ cập nhật trạng thái phát
            const state = event.data;
            if (state === (window as any).YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else {
              setIsPlaying(false);
            }
          }
        }
      });
      playerRef.current = newPlayer;
    };

    // Kiểm tra xem script API đã được tải chưa
    if (!(window as any).YT) {
      const existingTag = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (!existingTag) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      (window as any).onYouTubeIframeAPIReady = () => {
        initYTPlayer();
      };
    } else {
      initYTPlayer();
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (e) {}
      }
      setPlayer(null);
      setPlayerReady(false);
      setIsPlaying(false);
      if (checkTimeInterval.current) {
        clearInterval(checkTimeInterval.current);
      }
    };
  }, [videoId, mode]);

  // ----------------------------------------------------
  // VÒNG LẶP THEO DÕI THỜI GIAN THỰC ĐỂ CHẶN PHÁT (100ms)
  // ----------------------------------------------------
  useEffect(() => {
    if (checkTimeInterval.current) {
      clearInterval(checkTimeInterval.current);
    }

    if (playerReady && player) {
      checkTimeInterval.current = setInterval(() => {
        try {
          const time = Math.floor(player.getCurrentTime());
          setCurrentTime(time);

          // Nếu đang ở chế độ Học sinh, kiểm tra chặn câu hỏi tương tác
          if (mode === 'student') {
            // Tìm xem có câu hỏi nào tại giây này chưa được trả lời không
            const matchQ = questions.find(q => 
              time === q.time && !answeredQuestionIds.has(q.id)
            );

            if (matchQ && (!activeQuestion || activeQuestion.id !== matchQ.id)) {
              // Phát hiện mốc câu hỏi -> Dừng video và kích hoạt overlay
              player.pauseVideo();
              setActiveQuestion(matchQ);
              
              // Reset câu trả lời
              setStudentSingleAns(null);
              setStudentMultiAns([]);
              setStudentFillAns('');
              setAnswerSubmitted(false);
            }

            // Nếu đang hiển thị câu hỏi hoạt động mà học sinh cố tình bấm Play, bắt dừng lại tiếp
            if (activeQuestion && player.getPlayerState() === (window as any).YT.PlayerState.PLAYING) {
              player.pauseVideo();
            }
          }
        } catch (e) {}
      }, 100);
    }

    return () => {
      if (checkTimeInterval.current) {
        clearInterval(checkTimeInterval.current);
      }
    };
  }, [player, playerReady, mode, questions, answeredQuestionIds, activeQuestion]);

  // Điều khiển Player
  const handlePlayPause = () => {
    if (!playerReady || !player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      // Nếu học sinh chưa trả lời xong câu hỏi tại giây hiện tại, không cho phát
      const time = Math.floor(player.getCurrentTime());
      const hasUnresolvedQ = questions.some(q => time === q.time && !answeredQuestionIds.has(q.id));
      if (mode === 'student' && hasUnresolvedQ) {
        const unresolved = questions.find(q => time === q.time && !answeredQuestionIds.has(q.id));
        if (unresolved) {
          setActiveQuestion(unresolved);
          return;
        }
      }
      player.playVideo();
    }
  };

  const handleSeek = (seconds: number) => {
    if (!playerReady || !player) return;
    player.seekTo(seconds, true);
    setCurrentTime(seconds);
    
    // Nếu tua ở chế độ học sinh, xóa các câu hỏi sau mốc thời gian đó ra khỏi danh sách đã trả lời
    if (mode === 'student') {
      const remainingAnswered = new Set<string>();
      answeredQuestionIds.forEach(id => {
        const q = questions.find(item => item.id === id);
        if (q && q.time <= seconds) {
          remainingAnswered.add(id);
        }
      });
      setAnsweredQuestionIds(remainingAnswered);
    }
  };

  const handleSeekToQuestion = (q: Question) => {
    handleSeek(q.time);
  };

  // Định dạng mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // ----------------------------------------------------
  // QUẢN LÝ CÂU HỎI THIẾT KẾ (DESIGN)
  // ----------------------------------------------------
  const handleAddQuestionAtCurrentTime = () => {
    if (!playerReady || !player) return;
    const time = Math.floor(player.getCurrentTime());
    
    // Tạm dừng video để chèn
    player.pauseVideo();
    
    setEditingQuestionId('new');
    setQTime(time);
    setQPrompt('');
    setQType('single-choice');
    setQOptions(['Lựa chọn 1', 'Lựa chọn 2']);
    setQCorrectSingle(0);
    setQCorrectMulti([]);
    setQCorrectFill('');
    setQExplain('');
  };

  const handleEditQuestion = (q: Question) => {
    setEditingQuestionId(q.id);
    setQTime(q.time);
    setQType(q.type);
    setQPrompt(q.prompt);
    setQOptions([...q.options]);
    setQExplain(q.explain);
    
    if (q.type === 'fill-blank') {
      setQCorrectFill(q.correctAnswer as string);
    } else if (q.type === 'multiple-choices') {
      setQCorrectMulti([...(q.correctAnswer as number[])]);
    } else {
      setQCorrectSingle(q.correctAnswer as number);
    }
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleAddOptionField = () => {
    if (qOptions.length >= 6) return;
    setQOptions(prev => [...prev, `Lựa chọn ${prev.length + 1}`]);
  };

  const handleRemoveOptionField = (index: number) => {
    if (qOptions.length <= 2) return;
    setQOptions(prev => prev.filter((_, idx) => idx !== index));
    // Cập nhật lại đáp án đúng trắc nghiệm đơn nếu bị vượt quá index
    if (qCorrectSingle >= qOptions.length - 1) {
      setQCorrectSingle(0);
    }
  };

  const handleOptionTextChange = (index: number, val: string) => {
    setQOptions(prev => {
      const clone = [...prev];
      clone[index] = val;
      return clone;
    });
  };

  const handleToggleMultiChoiceCorrect = (index: number) => {
    setQCorrectMulti(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index].sort();
      }
    });
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qPrompt.trim()) return;

    let ans: any = qCorrectSingle;
    let finalOptions = qOptions;

    if (qType === 'fill-blank') {
      ans = qCorrectFill.trim().toLowerCase();
      finalOptions = [];
    } else if (qType === 'multiple-choices') {
      ans = qCorrectMulti;
    } else if (qType === 'true-false') {
      ans = qCorrectSingle;
      finalOptions = ['Đúng', 'Sai'];
    }

    const savedQ: Question = {
      id: editingQuestionId === 'new' ? `q-${Date.now()}` : editingQuestionId!,
      time: qTime,
      type: qType,
      prompt: qPrompt.trim(),
      options: finalOptions,
      correctAnswer: ans,
      explain: qExplain.trim()
    };

    setQuestions(prev => {
      let filtered = prev.filter(item => item.id !== savedQ.id);
      // Đảm bảo không trùng mốc giây
      filtered = filtered.filter(item => item.time !== savedQ.time);
      // Sắp xếp tăng dần theo thời gian phát
      return [...filtered, savedQ].sort((a, b) => a.time - b.time);
    });

    setEditingQuestionId(null);
    confetti({
      particleCount: 40,
      spread: 30,
      colors: ['#22d3ee', '#3b82f6']
    });
  };

  // ----------------------------------------------------
  // TRẢ LỜI CÂU HỎI TRONG CHẾ ĐỘ HỌC SINH
  // ----------------------------------------------------
  const handleStudentSubmitAnswer = () => {
    if (!activeQuestion) return;

    let correct = false;

    if (activeQuestion.type === 'fill-blank') {
      const userAns = studentFillAns.trim().toLowerCase();
      const correctAns = (activeQuestion.correctAnswer as string).toLowerCase();
      correct = userAns === correctAns;
    } else if (activeQuestion.type === 'multiple-choices') {
      const correctIdxs = activeQuestion.correctAnswer as number[];
      if (studentMultiAns.length === correctIdxs.length) {
        correct = studentMultiAns.every(val => correctIdxs.includes(val));
      }
    } else {
      // trắc nghiệm đơn hoặc đúng/sai
      correct = studentSingleAns === activeQuestion.correctAnswer;
    }

    setIsAnswerCorrect(correct);
    setAnswerSubmitted(true);

    if (correct) {
      // Pháo hoa nhỏ chúc mừng
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.6 }
      });
      // Đưa vào danh sách đã hoàn thành
      setAnsweredQuestionIds(prev => new Set([...prev, activeQuestion.id]));
    }
  };

  const handleStudentContinueVideo = () => {
    setActiveQuestion(null);
    setAnswerSubmitted(false);
    // Cho phép chạy tiếp
    if (player) {
      player.playVideo();
    }
  };

  // ----------------------------------------------------
  // LƯU & TẢI FILE BÀI GIẢNG DẠNG LOCAL STORAGE/JSON
  // ----------------------------------------------------
  const handleSaveLectureToStorage = () => {
    if (!lectureTitle.trim() || !youtubeUrl.trim()) return;

    const newLect: InteractiveLecture = {
      id: `lect-${Date.now()}`,
      title: lectureTitle.trim(),
      youtubeUrl: youtubeUrl.trim(),
      questions: questions
    };

    // Đọc danh sách cũ
    let oldList = [...savedLectures];
    // Loại bỏ nếu trùng tiêu đề hoặc ghi đè
    oldList = oldList.filter(item => item.title !== newLect.title);
    const updated = [newLect, ...oldList];

    setSavedLectures(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    confetti({
      particleCount: 50,
      spread: 40,
      colors: ['#10b981', '#34d399']
    });

    alert('Đã lưu bài giảng tương tác thành công vào bộ nhớ trình duyệt!');
  };

  const handleLoadLecture = (lect: InteractiveLecture) => {
    setLectureTitle(lect.title);
    setYoutubeUrl(lect.youtubeUrl);
    setQuestions(lect.questions);
    setAnsweredQuestionIds(new Set());
    setActiveQuestion(null);
    setShowSavedList(false);

    confetti({
      particleCount: 30,
      spread: 20
    });
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      title: lectureTitle,
      youtubeUrl: youtubeUrl,
      questions: questions
    }, null, 2));
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${lectureTitle.replace(/\s+/g, '_')}_tuong_tac.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.title && parsed.youtubeUrl && Array.isArray(parsed.questions)) {
          setLectureTitle(parsed.title);
          setYoutubeUrl(parsed.youtubeUrl);
          setQuestions(parsed.questions);
          setAnsweredQuestionIds(new Set());
          setActiveQuestion(null);
          confetti({
            particleCount: 60,
            spread: 40
          });
          alert('Nhập cấu hình bài giảng từ JSON thành công!');
        } else {
          alert('Cấu trúc file JSON không hợp lệ! Vui lòng kiểm tra lại.');
        }
      } catch (err) {
        alert('Lỗi đọc file JSON! Đảm bảo định dạng chuẩn UTF-8.');
      }
    };
    reader.readAsText(file);
  };

  // Trả về tiến trình hoàn thành trắc nghiệm ở chế độ học sinh
  const studentProgressPercentage = questions.length > 0 
    ? (answeredQuestionIds.size / questions.length) * 100 
    : 0;

  return (
    <div 
      ref={containerRef}
      className={`w-full font-sans text-slate-100 flex flex-col overflow-hidden relative transition-all duration-300 ${
        isFullscreen 
          ? 'h-screen w-screen bg-slate-950 p-4 md:p-6 z-40' 
          : 'min-h-[calc(100vh-80px)] bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl'
      }`}
    >
      
      {/* 1. HEADER CHÍNH */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-6 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm md:text-base font-black text-white tracking-tight uppercase flex items-center gap-2">
              <Play className="w-5 h-5 text-indigo-400 animate-pulse animate-duration-1000" />
              Video Bài Giảng Tương Tác
            </h1>
            <p className="text-[9px] md:text-[10px] text-orange-500 font-bold uppercase tracking-widest leading-none mt-1">
              Dạy học tích cực
            </p>
          </div>
        </div>

        {/* CHUYỂN ĐỔI CHẾ ĐỘ SÁNG TẠO / HỌC SINH */}
        <div className="flex items-center gap-2">
          {/* Tải thư viện mẫu */}
          <button
            onClick={() => setShowSavedList(!showSavedList)}
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer text-xs font-bold"
            title="Tải bài giảng đã lưu"
          >
            <FolderOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Bài giảng cũ</span>
          </button>

          {/* Toàn màn hình */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer text-xs font-bold"
            title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}</span>
          </button>

          <div className="h-8 w-px bg-slate-800"></div>

          <div className="flex items-center p-1 bg-slate-950/80 border border-slate-800 rounded-2xl">
            <button
              onClick={() => {
                setMode('design');
                setActiveQuestion(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === 'design' 
                  ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Settings className="w-3.5 h-3.5" /> Thiết kế
            </button>
            <button
              onClick={() => {
                setMode('student');
                setAnsweredQuestionIds(new Set());
                setActiveQuestion(null);
                if (player) player.seekTo(0, true);
              }}
              className={`px-3 py-1.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === 'student' 
                  ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Học sinh
            </button>
          </div>
        </div>
      </header>

      {/* 2. KHU VỰC THÂN CHÍNH (ĐIỀU HƯỚNG THEO CHẾ ĐỘ) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* ==================================================== */}
        {/* A. GIAO DIỆN CHẾ ĐỘ THIẾT KẾ (DESIGN MODE) */}
        {/* ==================================================== */}
        {mode === 'design' && (
          <>
            {/* CỘT TRÁI: VIDEO PLAYER & TIMELINE CHÈN */}
            <div className="flex-1 flex flex-col p-6 border-b lg:border-b-0 lg:border-r border-slate-800/80 space-y-5 overflow-y-auto custom-scrollbar">
              
              {/* CẤU HÌNH LIÊN KẾT LINK YOUTUBE */}
              <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-2xl space-y-3.5 text-left">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Cấu hình bài giảng gốc</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Tiêu đề bài giảng</label>
                    <input 
                      type="text"
                      value={lectureTitle}
                      onChange={(e) => setLectureTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 px-3 py-2 rounded-xl text-xs font-bold text-white outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Link video YouTube</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="Dán link youtube tại đây..."
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        className="flex-1 w-full bg-slate-950 border border-slate-800 focus:border-orange-500 px-3 py-2 rounded-xl text-xs font-bold text-white outline-none transition-all"
                      />
                      <button 
                        onClick={handleAIGenerate} 
                        disabled={isGeneratingAI} 
                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-colors shrink-0 shadow-lg shadow-indigo-500/20"
                        title="Quét link YouTube và tự động tạo câu hỏi bằng AI"
                      >
                        {isGeneratingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        <span className="hidden sm:inline">Quét AI</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* KHUNG HIỂN THỊ VIDEO YOUTUBE NỔI */}
              <div className="relative aspect-video w-full max-w-3xl mx-auto rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-black">
                <div id="yt-iframe-player-design" className="w-full h-full"></div>
              </div>

              {/* TIMELINE NÂNG CAO ĐỂ CHÈN CÂU HỎI */}
              <div className="bg-slate-900/40 p-4 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <button
                    onClick={handleAddQuestionAtCurrentTime}
                    disabled={!playerReady}
                    className="px-4 py-2 bg-linear-to-r from-orange-500 to-amber-500 disabled:opacity-40 text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Chèn câu hỏi tại {formatTime(currentTime)}
                  </button>
                </div>

                {/* Progress bar tùy chỉnh biểu diễn các chấm câu hỏi */}
                <div className="relative h-4 flex items-center select-none group">
                  {/* Thanh trượt nền */}
                  <div className="absolute inset-x-0 h-1.5 bg-slate-800 rounded-full"></div>
                  
                  {/* Tiến trình video đã phát */}
                  <div 
                    className="absolute left-0 h-1.5 bg-orange-500 rounded-full pointer-events-none"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  ></div>

                  {/* Chấm tròn định vị câu hỏi */}
                  {questions.map((q) => (
                    <div
                      key={q.id}
                      onClick={() => handleSeek(q.time)}
                      className="absolute w-3.5 h-3.5 -ml-1.5 rounded-full bg-orange-400 border border-white hover:scale-130 shadow-md cursor-pointer transition-transform z-10"
                      style={{ left: `${duration > 0 ? (q.time / duration) * 100 : 0}%` }}
                      title={`Câu hỏi: ${q.prompt} (${formatTime(q.time)})`}
                    ></div>
                  ))}

                  {/* Thanh trượt tương tác */}
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="absolute inset-x-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Kéo thanh trượt hoặc phát video và nhấn "Chèn câu hỏi" để đặt câu hỏi tương tác vào mốc giây bạn muốn.</span>
                </div>
              </div>

              {/* LƯU / XUẤT CẤU HÌNH */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={handleSaveLectureToStorage}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-emerald-400" />
                  Lưu vào trình duyệt
                </button>

                <div className="flex gap-2">
                  {/* Nhập JSON */}
                  <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[10px] font-bold uppercase rounded-xl flex items-center gap-1 cursor-pointer">
                    <UploadIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Nhập JSON</span>
                    <input 
                      type="file" 
                      accept=".json" 
                      className="hidden" 
                      onChange={handleImportJSON} 
                    />
                  </label>

                  {/* Xuất JSON */}
                  <button
                    onClick={handleExportJSON}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[10px] font-bold uppercase rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                    Xuất cấu hình JSON
                  </button>
                </div>
              </div>

            </div>

            {/* CỘT PHẢI: FORM CHỈNH SỬA CÂU HỎI HOẶC DANH SÁCH */}
            <div className="w-full lg:w-[400px] p-6 overflow-y-auto custom-scrollbar flex flex-col shrink-0 text-left bg-slate-900/40">
              
              {/* 1. NẾU ĐANG CHỈNH SỬA / TẠO CÂU HỎI MỚI */}
              {editingQuestionId !== null ? (
                <form onSubmit={handleSaveQuestion} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-orange-400 flex items-center gap-1">
                      <Plus className="w-4 h-4" />
                      {editingQuestionId === 'new' ? 'Thêm câu hỏi mới' : 'Chỉnh sửa câu hỏi'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingQuestionId(null)}
                      className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Mốc thời gian */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Mốc thời gian (giây)</label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={qTime}
                        onChange={(e) => setQTime(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 px-3 py-1.5 rounded-lg text-xs font-bold text-white outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Định dạng</label>
                      <span className="w-full bg-slate-950/60 border border-slate-800/80 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 block text-center leading-normal">
                        {formatTime(qTime)}
                      </span>
                    </div>
                  </div>

                  {/* Thể loại câu hỏi */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Loại câu hỏi tương tác</label>
                    <select
                      value={qType}
                      onChange={(e) => {
                        const newType = e.target.value as QuestionType;
                        setQType(newType);
                        if (newType === 'true-false') {
                          setQOptions(['Đúng', 'Sai']);
                        } else if (newType === 'fill-blank') {
                          setQOptions([]);
                        } else {
                          setQOptions(['Lựa chọn 1', 'Lựa chọn 2']);
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 px-3 py-2 rounded-xl text-xs font-bold text-white outline-none"
                    >
                      <option value="single-choice">Trắc nghiệm một đáp án đúng</option>
                      <option value="multiple-choices">Trắc nghiệm nhiều đáp án đúng</option>
                      <option value="fill-blank">Điền từ vào chỗ trống</option>
                      <option value="true-false">Câu hỏi Đúng / Sai</option>
                    </select>
                  </div>

                  {/* Nội dung câu hỏi */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Nội dung câu hỏi</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Nhập nội dung câu hỏi..."
                      value={qPrompt}
                      onChange={(e) => setQPrompt(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-200 outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {/* DANH SÁCH LỰA CHỌN & CHỌN ĐÁP ÁN ĐÚNG */}
                  {qType === 'fill-blank' ? (
                    /* A. ĐỐI VỚI ĐIỀN KHUYẾT */
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Từ khóa đáp án đúng</label>
                      <input
                        type="text"
                        required
                        placeholder="Nhập đáp án chính xác..."
                        value={qCorrectFill}
                        onChange={(e) => setQCorrectFill(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 px-3 py-2 rounded-xl text-xs font-bold text-white outline-none"
                      />
                      <span className="text-[9px] text-slate-500 block leading-tight">Lưu ý: Hệ thống so khớp không phân biệt chữ hoa, chữ thường và khoảng trắng đầu cuối.</span>
                    </div>
                  ) : qType === 'true-false' ? (
                    /* B. ĐỐI VỚI ĐÚNG / SAI */
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Đáp án đúng</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setQCorrectSingle(0)}
                          className={`py-2 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                            qCorrectSingle === 0 
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          ĐÚNG
                        </button>
                        <button
                          type="button"
                          onClick={() => setQCorrectSingle(1)}
                          className={`py-2 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                            qCorrectSingle === 1 
                              ? 'bg-red-500/20 border-red-500 text-red-300' 
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          SAI
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* C. ĐỐI VỚI TRẮC NGHIỆM ĐƠN / NHIỀU ĐÁP ÁN */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Danh sách lựa chọn</label>
                        {qOptions.length < 6 && (
                          <button
                            type="button"
                            onClick={handleAddOptionField}
                            className="text-[9px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5"
                          >
                            <Plus className="w-3 h-3" /> Thêm lựa chọn
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        {qOptions.map((opt, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {/* Checkbox / Radio chọn đáp án đúng */}
                            {qType === 'multiple-choices' ? (
                              <input
                                type="checkbox"
                                checked={qCorrectMulti.includes(index)}
                                onChange={() => handleToggleMultiChoiceCorrect(index)}
                                className="w-4 h-4 accent-orange-500 shrink-0 cursor-pointer"
                                title="Đánh dấu đáp án đúng"
                              />
                            ) : (
                              <input
                                type="radio"
                                name="correct-radio"
                                checked={qCorrectSingle === index}
                                onChange={() => setQCorrectSingle(index)}
                                className="w-4 h-4 accent-orange-500 shrink-0 cursor-pointer"
                                title="Đánh dấu đáp án đúng"
                              />
                            )}

                            {/* Ô gõ text option */}
                            <input
                              type="text"
                              required
                              placeholder={`Lựa chọn ${index + 1}`}
                              value={opt}
                              onChange={(e) => handleOptionTextChange(index, e.target.value)}
                              className="flex-1 bg-slate-950 border border-slate-800 focus:border-orange-500 px-3 py-1.5 rounded-lg text-xs text-white outline-none"
                            />

                            {/* Xóa lựa chọn */}
                            {qOptions.length > 2 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveOptionField(index)}
                                className="p-1 hover:bg-slate-800 text-slate-500 hover:text-red-400 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <span className="text-[8px] text-slate-500 block leading-tight">Đánh dấu tích tròn/vuông bên cạnh lựa chọn tương ứng làm đáp án đúng.</span>
                    </div>
                  )}

                  {/* Giải thích câu hỏi */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Giải thích / Gợi ý (Sau khi trả lời)</label>
                    <textarea
                      rows={2}
                      placeholder="Gợi ý/kiến thức bổ sung khi học sinh nộp bài..."
                      value={qExplain}
                      onChange={(e) => setQExplain(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-200 outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {/* Nút lưu */}
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingQuestionId(null)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-linear-to-r from-orange-500 to-amber-500 text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> Lưu câu hỏi
                    </button>
                  </div>

                </form>
              ) : (
                /* 2. HIỂN THỊ DANH SÁCH CÂU HỎI ĐÃ CHÈN */
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1 border-b border-slate-800 pb-3">
                    <HelpCircle className="w-4.5 h-4.5 text-cyan-400" />
                    Danh sách câu hỏi tương tác ({questions.length})
                  </h3>

                  {questions.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 space-y-2 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
                      <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="text-xs font-bold">Chưa có câu hỏi nào được chèn.</p>
                      <p className="text-[10px] text-slate-600">Phát video đến mốc thời gian và nhấn nút để chèn câu hỏi.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
                      {questions.map((q, idx) => (
                        <div 
                          key={q.id}
                          onClick={() => handleSeekToQuestion(q)}
                          className="p-3 bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800 rounded-xl cursor-pointer group transition-all text-left flex items-start gap-2.5"
                        >
                          {/* Số thứ tự câu hỏi */}
                          <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center text-[10px] font-black shrink-0">
                            #{idx + 1}
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] text-orange-400 font-black">
                                Mốc giây: {formatTime(q.time)}
                              </span>
                              <span className="text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700/50">
                                {q.type === 'fill-blank' ? 'Điền khuyết' : q.type === 'true-false' ? 'Đúng/Sai' : 'Trắc nghiệm'}
                              </span>
                            </div>

                            <p className="text-[11px] font-bold text-white truncate mt-1">{q.prompt}</p>
                            
                            <div className="mt-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditQuestion(q);
                                }}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-cyan-400 transition-colors flex items-center justify-center"
                                title="Sửa câu hỏi"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteQuestion(q.id);
                                }}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-red-400 transition-colors flex items-center justify-center"
                                title="Xóa câu hỏi"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </>
        )}

        {/* ==================================================== */}
        {/* B. GIAO DIỆN CHẾ ĐỘ TRẢI NGHIỆM HỌC SINH (STUDENT MODE) */}
        {/* ==================================================== */}
        {mode === 'student' && (
          <div className="flex-1 flex flex-col items-center justify-start p-6 relative overflow-y-auto custom-scrollbar bg-slate-950 space-y-4">
            
            {/* TIÊU ĐỀ LỚP HỌC */}
            <div className="w-full max-w-3xl flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 z-10">
              <div className="text-left">
                <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest block mb-0.5">Tiêu đề bài học</span>
                <h2 className="text-base font-black text-white">{lectureTitle}</h2>
              </div>

              {/* Tiến trình hoàn thành câu hỏi */}
              {questions.length > 0 && (
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-left shadow-md shrink-0">
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Tiến trình</span>
                    <span className="text-xs font-black text-white">{answeredQuestionIds.size} / {questions.length} Câu hỏi</span>
                  </div>
                  <div className="w-24 h-2.5 bg-slate-950 border border-slate-800 rounded-full overflow-hidden shrink-0">
                    <div 
                      className="h-full bg-linear-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                      style={{ width: `${studentProgressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* TRÌNH PHÁT VIDEO CHÍNH CÓ SPOTLIGHT */}
            <div className="relative aspect-video w-full max-w-3xl rounded-3xl overflow-hidden border-2 border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-black z-10 group">
              <div id="yt-iframe-player-student" className="w-full h-full"></div>

              {/* CÁC ĐIỂM DỪNG TƯƠNG TÁC PHỦ TRÊN THANH BAR CỦA VIDEO */}
              <div className="absolute bottom-0 inset-x-0 h-1 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center pointer-events-none">
                <div 
                  className="h-full bg-cyan-400"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                ></div>
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className={`absolute w-2 h-2 rounded-full -ml-1 border border-white ${
                      answeredQuestionIds.has(q.id) ? 'bg-emerald-400' : 'bg-orange-500'
                    }`}
                    style={{ left: `${duration > 0 ? (q.time / duration) * 100 : 0}%` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* OVERLAY KHI TRÚNG MỐC CÂU HỎI TƯƠNG TÁC (Đưa ra ngoài aspect-video để tránh lỗi z-index & kích thước hiển thị) */}
            {activeQuestion && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
                <div className="bg-slate-900 border border-slate-700/80 p-6 rounded-3xl shadow-2xl max-w-lg w-full text-left space-y-4 max-h-[90%] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
                  
                  {/* Tiêu đề Box */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">Câu hỏi tương tác xuất hiện</h4>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-slate-800 border border-slate-700 text-cyan-400">
                      Mốc: {formatTime(activeQuestion.time)}
                    </span>
                  </div>

                  {/* Câu hỏi */}
                  <h3 className="text-sm md:text-base font-black text-white leading-relaxed">
                    {activeQuestion.prompt}
                  </h3>

                  {/* LỰA CHỌN CỦA HỌC SINH THEO TỪNG LOẠI CÂU HỎI */}
                  <div className="space-y-2.5 py-2">
                    {activeQuestion.type === 'fill-blank' ? (
                      /* A. ĐIỀN KHUYẾT */
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          disabled={answerSubmitted}
                          placeholder="Nhập câu trả lời của bạn..."
                          value={studentFillAns}
                          onChange={(e) => setStudentFillAns(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 disabled:opacity-60 px-4 py-2.5 rounded-xl text-xs font-bold text-white outline-none transition-all"
                        />
                      </div>
                    ) : activeQuestion.type === 'multiple-choices' ? (
                      /* B. NHIỀU ĐÁP ÁN ĐÚNG */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {activeQuestion.options.map((opt, idx) => {
                          const isChecked = studentMultiAns.includes(idx);
                          return (
                            <button
                              key={idx}
                              type="button"
                              disabled={answerSubmitted}
                              onClick={() => {
                                setStudentMultiAns(prev => 
                                  prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
                                );
                              }}
                              className={`px-4 py-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                                isChecked 
                                  ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-md' 
                                  : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-950'
                              }`}
                            >
                              <span className={`w-4 h-4 rounded-md border inline-flex items-center justify-center mr-2 text-[10px] font-black shrink-0 ${
                                isChecked ? 'bg-cyan-400 border-cyan-300 text-slate-950' : 'border-slate-700'
                              }`}>
                                {isChecked && '✓'}
                              </span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      /* C. TRẮC NGHIỆM ĐƠN / ĐÚNG SAI */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {activeQuestion.options.map((opt, idx) => (
                          <button
                            key={idx}
                            type="button"
                            disabled={answerSubmitted}
                            onClick={() => setStudentSingleAns(idx)}
                            className={`px-4 py-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                              studentSingleAns === idx 
                                ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-md' 
                                : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-950'
                            }`}
                          >
                            <span className={`w-3.5 h-3.5 rounded-full border inline-flex items-center justify-center mr-2 ${
                              studentSingleAns === idx ? 'bg-cyan-400 border-cyan-300 text-slate-950 scale-110' : 'border-slate-700'
                            }`}>
                              {studentSingleAns === idx && '•'}
                            </span>
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* HIỂN THỊ PHẢN HỒI KẾT QUẢ ĐÚNG / SAI */}
                  {answerSubmitted && (
                    <div className={`p-4 rounded-2xl border text-left animate-in zoom-in-95 duration-200 flex items-start gap-3 ${
                      isAnswerCorrect 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                        : 'bg-red-500/10 border-red-500/30 text-red-300'
                    }`}>
                      {isAnswerCorrect ? (
                        <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-6 h-6 shrink-0 text-red-400 mt-0.5" />
                      )}
                      <div className="text-xs">
                        <h5 className="font-black text-sm">
                          {isAnswerCorrect ? 'Câu trả lời hoàn toàn chính xác!' : 'Đáp án chưa chính xác!'}
                        </h5>
                        <p className="mt-1 opacity-90 leading-relaxed font-medium">
                          {isAnswerCorrect 
                            ? (activeQuestion.explain || 'Bạn đã mở khóa thành công phân đoạn video tiếp theo.')
                            : 'Vui lòng suy nghĩ lại và thử chọn phương án khác để tiếp tục bài giảng.'
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {/* NÚT THAO TÁC NỘP BÀI / CHẠY TIẾP */}
                  <div className="flex justify-end pt-2 border-t border-slate-800">
                    {!answerSubmitted ? (
                      <button
                        onClick={handleStudentSubmitAnswer}
                        disabled={
                          activeQuestion.type === 'fill-blank' 
                            ? !studentFillAns.trim() 
                            : activeQuestion.type === 'multiple-choices'
                              ? studentMultiAns.length === 0
                              : studentSingleAns === null
                        }
                        className="px-6 py-2.5 bg-linear-to-r from-cyan-500 to-blue-500 disabled:opacity-40 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
                      >
                        Nộp câu trả lời
                      </button>
                    ) : (
                      isAnswerCorrect ? (
                        <button
                          onClick={handleStudentContinueVideo}
                          className="px-6 py-2.5 bg-linear-to-r from-emerald-500 to-teal-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
                        >
                          Tiếp tục xem bài giảng
                        </button>
                      ) : (
                        <button
                          onClick={() => setAnswerSubmitted(false)}
                          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                        >
                          Thử chọn lại
                        </button>
                      )
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* THANH ĐIỀU KHIỂN VIDEO CỦA HỌC SINH (CHỐNG TUA QUÁ CÂU HỎI CHƯA GIẢI QUYẾT) */}
            <div className="w-full max-w-3xl mt-5 bg-slate-900 border border-slate-800 p-4 rounded-3xl flex items-center justify-between shadow-lg z-10">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayPause}
                  disabled={!playerReady}
                  className="p-3 bg-linear-to-r from-cyan-500 to-blue-500 text-white rounded-2xl shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <div className="text-left font-mono">
                  <span className="text-xs font-bold text-white block">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-sans font-bold leading-none mt-0.5 block">
                    {isPlaying ? 'Đang phát bài giảng' : 'Tạm dừng bài giảng'}
                  </span>
                </div>
              </div>

              {/* Thông tin cảnh báo chặn tua */}
              <div className="text-right text-[10px] text-slate-500 max-w-xs leading-tight hidden sm:block">
                <span>Chế độ học sinh khóa tua video qua các mốc câu hỏi tương tác để kiểm tra khả năng tập trung tiếp thu bài.</span>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ==================================================== */}
      {/* C. MODAL DANH SÁCH BÀI GIẢNG ĐÃ LƯU (2D OVERLAY) */}
      {/* ==================================================== */}
      {showSavedList && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-md w-full relative text-left">
            <button 
              className="absolute top-4 right-4 p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-all"
              onClick={() => setShowSavedList(false)}
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-800">
              <FolderOpen className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-black text-white">Danh sách bài giảng đã lưu</h3>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {/* Bản mặc định */}
              <div
                onClick={() => {
                  setLectureTitle(DEFAULT_LECTURE.title);
                  setYoutubeUrl(DEFAULT_LECTURE.youtubeUrl);
                  setQuestions(DEFAULT_LECTURE.questions);
                  setAnsweredQuestionIds(new Set());
                  setActiveQuestion(null);
                  setShowSavedList(false);
                  confetti({ particleCount: 30, spread: 20 });
                }}
                className="p-3 bg-slate-950/40 hover:bg-slate-950 border border-slate-800/80 hover:border-cyan-500/50 rounded-xl cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="text-left min-w-0 flex-1">
                  <h4 className="text-xs font-black text-white truncate">{DEFAULT_LECTURE.title}</h4>
                  <p className="text-[9px] text-orange-400 font-bold mt-1">Bài giảng mặc định mẫu • {DEFAULT_LECTURE.questions.length} Câu hỏi</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>

              {savedLectures.map((lect) => (
                <div
                  key={lect.id}
                  onClick={() => handleLoadLecture(lect)}
                  className="p-3 bg-slate-950/40 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="text-left min-w-0 flex-1">
                    <h4 className="text-xs font-black text-white truncate">{lect.title}</h4>
                    <p className="text-[9px] text-cyan-400 font-bold mt-1">Cá nhân lưu trữ • {lect.questions.length} Câu hỏi</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {/* Xóa bài giảng khỏi bộ nhớ */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const filtered = savedLectures.filter(item => item.id !== lect.id);
                        setSavedLectures(filtered);
                        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
                      }}
                      className="p-1 hover:bg-slate-800 rounded-md text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      title="Xóa bài giảng"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              ))}

              {savedLectures.length === 0 && (
                <p className="text-[10px] text-slate-500 italic py-4 text-center">Chưa có bài giảng cá nhân tự thiết kế nào được lưu.</p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowSavedList(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
