import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { LESSON_REGISTRY, GenericLessonView, MultiplayerComponents } from '../config/lessonRegistry';
const { Lobby, Room, StarRaceGame } = MultiplayerComponents;
import { QUIZ_GAMES } from '../config/constants';
import { categories } from '../data';
import { CatLoader } from './CatLoader';
import { DEFAULT_GAME_QUESTIONS } from '../data/defaultGameQuestions';

const GameConfigScreen = lazy(() => import('./games/GameConfigScreen').then(m => ({ default: m.GameConfigScreen })));

// Lấy câu hỏi từ ngân hàng, dùng câu hỏi mặc định nếu chưa có
const getGameQuestions = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('gamehub_questions') || '[]');
    return stored.length > 0 ? stored : DEFAULT_GAME_QUESTIONS;
  } catch {
    return DEFAULT_GAME_QUESTIONS;
  }
};

interface LessonRendererProps {
  activeSimulationId: string;
  onExit: () => void;
  onExitToCategory: () => void;
  onExitToSubcategory: () => void;
  onGoToBank: () => void;
}

/**
 * Dynamic lesson/simulation renderer.
 * Replaces the 60+ ternary chain in App.tsx with a registry-based lookup.
 */
export const LessonRenderer: React.FC<LessonRendererProps> = ({
  activeSimulationId,
  onExit,
  onExitToCategory,
  onExitToSubcategory,
  onGoToBank,
}) => {
  const [configuredQuestions, setConfiguredQuestions] = React.useState<any[] | null>(null);
  const entry = LESSON_REGISTRY[activeSimulationId];

  // Trường hợp 1: Game cần cấu hình câu hỏi trước khi chơi
  if (QUIZ_GAMES[activeSimulationId] && !configuredQuestions) {
    const gameConfig = QUIZ_GAMES[activeSimulationId];
    return (
      <Suspense fallback={<CatLoader />}>
        <GameConfigScreen
          gameTitle={gameConfig.title}
          gameDescription={gameConfig.description}
          gameRules={gameConfig.rules}
          onStart={(qs: any[]) => setConfiguredQuestions(qs)}
          onBack={onExitToCategory}
          onGoToBank={onGoToBank}
        />
      </Suspense>
    );
  }

  // Trường hợp 2: Simulation/game có trong registry
  if (entry) {
    const Component = entry.component;
    const handleBack = entry.backTarget === 'category' ? onExitToCategory : onExitToSubcategory;

    // Mindmap fullscreen wrapper
    if (entry.fullscreenWrapper) {
      return (
        <div className="fixed inset-0 w-screen h-screen z-9998 bg-slate-900">
          <button 
            onClick={handleBack} 
            className="absolute top-4 left-4 z-9999 p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white shadow-lg"
          >
            Quay lại
          </button>
          <Component />
        </div>
      );
    }

    // Games cần questions prop
    if (entry.needsQuestions) {
      const Comp = Component as any;
      return <Comp questions={configuredQuestions || getGameQuestions()} onBack={onExit} />;
    }

    // Action Quiz Game - cần initialQuestions đặc biệt
    if (activeSimulationId === 'action-quiz-game') {
      const Comp = Component as any;
      return (
        <Comp 
          initialQuestions={configuredQuestions ? configuredQuestions.map((q: any, i: number) => ({ id: i, question: q.text, options: q.options, correctAnswer: q.answer })) : undefined} 
          onBack={onExit} 
        />
      );
    }

    // World Explorer Game - cần initialQuestions
    if (activeSimulationId === 'world-explorer-game') {
      const Comp = Component as any;
      return <Comp initialQuestions={configuredQuestions || undefined} onBack={onExit} />;
    }

    // Tất cả simulation/game còn lại
    const Comp = Component as any;
    return <Comp onBack={handleBack} />;
  }

  // Trường hợp 3: Fallback - Không tìm thấy trong registry
  // Tìm thông tin bài học từ data.ts để hiển thị generic view
  let lessonTitle = "Bài học mới";
  let lessonDescription = "Nội dung bài học đang được cập nhật.";
  let categoryName = "Bài học";

  for (const cat of categories) {
    for (const sub of cat.subCategories) {
      const lesson = sub.lessons?.find(l => l.id === activeSimulationId);
      if (lesson) {
        lessonTitle = lesson.title;
        lessonDescription = lesson.description;
        categoryName = sub.title;
        break;
      }
    }
  }

  return (
    <GenericLessonView
      onBack={onExitToSubcategory}
      title={lessonTitle}
      description={lessonDescription}
      categoryName={categoryName}
    />
  );
};
