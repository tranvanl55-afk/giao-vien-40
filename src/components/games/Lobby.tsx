// src/components/games/Lobby.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMultiplayer } from '../../context/MultiplayerContext';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

export const Lobby = () => {
  const navigate = useNavigate();
  const { createRoom, roomId, isHost } = useMultiplayer();
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const id = await createRoom([]); // empty questions for now, will use default later
      navigate(`/room/${id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900/90 text-white p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800/70 backdrop-blur-md rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl border border-white/10"
      >
        <Star className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
        <h1 className="text-3xl font-black mb-4 text-yellow-300">Phòng Đua Ngôi Sao</h1>
        <p className="mb-6 text-slate-300">
          Tạo một phòng để mời bạn bè tham gia và bắt đầu cuộc đua trả lời câu hỏi.
        </p>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-500 rounded-xl font-bold hover:from-purple-500 hover:to-pink-400 transition-colors disabled:opacity-50"
        >
          {creating ? 'Đang tạo...' : 'Tạo Phòng'}
        </button>
      </motion.div>
    </div>
  );
};
