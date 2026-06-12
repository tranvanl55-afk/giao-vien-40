import { useState } from 'react';

export function useViewMode() {
  const [viewMode, setViewMode] = useState<'modern' | 'gamified'>(() => {
    try {
      return (localStorage.getItem('gv40_view_mode') as 'modern' | 'gamified') || 'gamified';
    } catch {
      return 'gamified';
    }
  });

  const toggleViewMode = () => {
    const nextMode = viewMode === 'modern' ? 'gamified' : 'modern';
    setViewMode(nextMode);
    try {
      localStorage.setItem('gv40_view_mode', nextMode);
    } catch {}
  };

  return { viewMode, toggleViewMode };
}
