// src/components/games/Room.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMultiplayer } from '../../context/MultiplayerContext';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

export const Room = () => {
  const { roomId: paramRoomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { joinRoom, roomId, isHost, gameState, startGame, player } = useMultiplayer();
  const [loading, setLoading] = useState(true);

  // Join the room on mount
  useEffect(() => {
    if (!paramRoomId) return;
    const init = async () => {
      try {
        await joinRoom(paramRoomId);
        setLoading(false);
      } catch (e) {
        console.error(e);
        // If join fails, go back to lobby
        navigate('/lobby');
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramRoomId]);

  // Host can start the game when at least one other player is present
  const canStart = isHost && gameState && (gameState.players?.length ?? 0) > 1;

  const handleStart = async () => {
    await startGame();
    // Navigate to actual game component
    navigate(`/room/${roomId}/play`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900/90 text-white">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
          <Star className="w-12 h-12 text-yellow-400" />
        </motion.div>
        <p className="ml-4">Đang kết nối phòng...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900/90 text-white p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800/70 backdrop-blur-md rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl border border-white/10"
      >
        <Star className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
        <h2 className="text-2xl font-black mb-2 text-orange-300">Phòng {roomId}</h2>
        <p className="mb-4 text-slate-300">Bạn đã vào phòng. Chờ người khác tham gia...</p>
        {isHost && (
          <button
            onClick={handleStart}
            disabled={!canStart}
            className="px-6 py-3 bg-linear-to-r from-green-600 to-emerald-500 rounded-xl font-bold hover:from-green-500 hover:to-emerald-400 transition-colors disabled:opacity-50"
          >
            {canStart ? 'Bắt đầu Đua Ngôi Sao' : 'Chờ người chơi...'}
          </button>
        )}
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-sm underline"
        >
          Thoát và quay lại
        </button>
      </motion.div>
    </div>
  );
};
