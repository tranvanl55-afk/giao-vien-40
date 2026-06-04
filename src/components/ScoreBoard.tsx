import React from 'react';
import { useUserProgress } from '../context/UserProgressContext';
import { Award } from 'lucide-react';

// Determine badge level based on points
const getBadgeLevel = (points: number) => {
  if (points >= 1000) return { label: 'Gold', color: 'bg-yellow-400' };
  if (points >= 500) return { label: 'Silver', color: 'bg-gray-300' };
  return { label: 'Bronze', color: 'bg-orange-300' };
};

export const ScoreBoard: React.FC = () => {
  const { points } = useUserProgress();
  const { label, color } = getBadgeLevel(points);

  return (
    <div className="flex items-center space-x-3 p-2 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-xl shadow-sm">
      <Award className="w-6 h-6 text-yellow-500" />
      <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
        {points} pts
      </span>
      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${color} text-gray-800`}> {label} </span>
    </div>
  );
};
