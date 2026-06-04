import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Trophy, Medal, Star, ShieldAlert, Award, FileText, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

interface UserRank {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  postsCount: number;
  skknCount: number;
  points: number;
}

interface LeaderboardProps {
  onBack: () => void;
}

export function Leaderboard({ onBack }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<UserRank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        // 1. Fetch all users
        const usersSnap = await getDocs(collection(db, 'users'));
        const usersList: any[] = [];
        usersSnap.forEach(docSnap => {
          usersList.push({ uid: docSnap.id, ...docSnap.data() });
        });

        // 2. Fetch all posts to count per user
        const postsSnap = await getDocs(collection(db, 'community_posts'));
        const postsPerUser: Record<string, number> = {};
        postsSnap.forEach(docSnap => {
          const data = docSnap.data();
          const uid = data.userId;
          if (uid) {
            postsPerUser[uid] = (postsPerUser[uid] || 0) + 1;
          }
        });

        // 3. Fetch all SKKN to count per user email
        const skknSnap = await getDocs(collection(db, 'skkn_docs'));
        const skknPerEmail: Record<string, number> = {};
        skknSnap.forEach(docSnap => {
          const data = docSnap.data();
          const email = data.uploadedByEmail;
          if (email) {
            skknPerEmail[email] = (skknPerEmail[email] || 0) + 1;
          }
        });

        // 4. Map users with their aggregated stats
        const ranked: UserRank[] = usersList.map(u => {
          const postsCount = postsPerUser[u.uid] || 0;
          const skknCount = skknPerEmail[u.email] || 0;
          const points = postsCount * 10 + skknCount * 25;

          return {
            uid: u.uid,
            displayName: u.displayName || 'Giáo viên ẩn danh',
            email: u.email || '',
            photoURL: u.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            postsCount,
            skknCount,
            points
          };
        });

        // Sort by points descending, then by posts count
        ranked.sort((a, b) => b.points - a.points || b.postsCount - a.postsCount);
        setLeaderboard(ranked);
      } catch (err) {
        console.error("Error fetching leaderboard data: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  // Split Top 3 and other ranks
  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  // Get color for top badges
  const getTopBadgeStyles = (index: number) => {
    switch (index) {
      case 0:
        return {
          bg: 'bg-gradient-to-br from-yellow-400 to-amber-500',
          text: 'text-black',
          border: 'border-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.4)]',
          crown: 'text-yellow-400',
          medal: '🏆'
        };
      case 1:
        return {
          bg: 'bg-gradient-to-br from-slate-350 to-slate-500',
          text: 'text-white',
          border: 'border-slate-300 shadow-[0_0_20px_rgba(203,213,225,0.2)]',
          crown: 'text-slate-300',
          medal: '🥈'
        };
      case 2:
        return {
          bg: 'bg-gradient-to-br from-amber-600 to-amber-800',
          text: 'text-white',
          border: 'border-amber-700 shadow-[0_0_20px_rgba(217,119,6,0.15)]',
          crown: 'text-amber-600',
          medal: '🥉'
        };
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col pt-4 animate-in fade-in duration-500">
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-indigo-900 hover:text-orange-600 mb-8 px-5 py-2.5 bg-white/40 hover:bg-white/60 rounded-full border border-white/60 transition-all backdrop-blur-md w-fit shadow-sm group cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold tracking-wide">Quay lại Trang Chủ</span>
      </button>

      {/* Main Header Card */}
      <div className="relative overflow-hidden bg-linear-to-br from-indigo-950/80 to-slate-900/90 border border-white/10 rounded-3xl p-8 mb-10 shadow-2xl flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_60%)] pointer-events-none" />
        
        <div className="space-y-3 text-center md:text-left flex-1 relative z-10">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-xs font-black uppercase tracking-wider text-cyan-400">
              Bảng vàng danh dự 🌟
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-white font-heading">
            BẢNG XẾP HẠNG <br className="hidden md:block"/>
            <span className="text-yellow-400">GIÁO VIÊN TÍCH CỰC</span>
          </h2>
          <p className="text-sm leading-relaxed text-slate-350 max-w-xl font-medium">
            Vinh danh những đóng góp xuất sắc của các thầy cô giáo trong việc chia sẻ sáng kiến kinh nghiệm (25đ) và chia sẻ bài viết cộng đồng (10đ).
          </p>
        </div>

        <div className="w-24 h-24 md:w-32 md:h-32 bg-yellow-400/10 rounded-full flex items-center justify-center border border-yellow-400/20 relative z-10 shrink-0 shadow-[0_0_50px_rgba(234,179,8,0.1)]">
          <Trophy className="w-12 h-12 md:w-16 md:h-16 text-yellow-400 animate-bounce" />
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-indigo-900">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mb-4" />
          <p className="text-sm font-black uppercase tracking-widest">Đang tính toán điểm xếp hạng...</p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/60 border border-white/10 rounded-3xl max-w-lg mx-auto w-full p-8 space-y-4">
          <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-xl font-extrabold text-white">Chưa có dữ liệu xếp hạng</h3>
          <p className="text-sm text-slate-400">Hiện tại chưa có giáo viên nào hoạt động hoặc đóng góp dữ liệu lên hệ thống.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Top 3 Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto px-4">
            
            {/* Top 2 - Second Place */}
            {topThree[1] && (() => {
              const styles = getTopBadgeStyles(1)!;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`order-2 md:order-1 p-6 bg-slate-900/60 border ${styles.border} rounded-3xl flex flex-col items-center text-center relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 md:h-[300px] justify-center`}
                >
                  <div className="absolute top-2 right-3 text-4xl">{styles.medal}</div>
                  <div className="relative">
                    <img 
                      src={topThree[1].photoURL} 
                      alt="" 
                      className="w-20 h-20 rounded-full border-4 border-slate-400 object-cover shadow-lg"
                    />
                  </div>
                  <h3 className="text-lg font-black text-white mt-4 truncate max-w-[200px]">{topThree[1].displayName}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{topThree[1].email}</p>
                  
                  <div className="flex gap-4 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-white/10 pt-4 w-full justify-center">
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3 text-cyan-400" /> {topThree[1].postsCount}</span>
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3 text-emerald-400" /> {topThree[1].skknCount}</span>
                  </div>

                  <div className="mt-4 px-4 py-1.5 rounded-full bg-slate-800 text-cyan-400 font-extrabold text-xs tracking-wider">
                    {topThree[1].points} Điểm
                  </div>
                </motion.div>
              );
            })()}

            {/* Top 1 - Champion */}
            {topThree[0] && (() => {
              const styles = getTopBadgeStyles(0)!;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`order-1 md:order-2 p-8 bg-indigo-950/40 border ${styles.border} rounded-[2.5rem] flex flex-col items-center text-center relative overflow-hidden group hover:scale-105 transition-all duration-300 md:h-[350px] justify-center z-10`}
                >
                  <div className="absolute top-3 right-4 text-5xl animate-bounce">{styles.medal}</div>
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-yellow-400 to-amber-500" />
                  
                  <div className="relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl text-yellow-400">👑</div>
                    <img 
                      src={topThree[0].photoURL} 
                      alt="" 
                      className="w-24 h-24 rounded-full border-4 border-yellow-400 object-cover shadow-xl"
                    />
                  </div>
                  
                  <h3 className="text-xl font-black text-white mt-4 truncate max-w-[220px] flex items-center gap-1">
                    {topThree[0].displayName}
                    <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-yellow-400/80 font-black uppercase tracking-wider mt-1">{topThree[0].email}</p>
                  
                  <div className="flex gap-4 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-white/10 pt-4 w-full justify-center">
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3 text-cyan-400" /> {topThree[0].postsCount}</span>
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3 text-emerald-400" /> {topThree[0].skknCount}</span>
                  </div>

                  <div className="mt-4 px-6 py-2 rounded-full bg-linear-to-r from-yellow-400 to-amber-500 text-black font-black text-sm tracking-widest uppercase shadow-md shadow-yellow-500/20">
                    {topThree[0].points} Điểm
                  </div>
                </motion.div>
              );
            })()}

            {/* Top 3 - Third Place */}
            {topThree[2] && (() => {
              const styles = getTopBadgeStyles(2)!;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`order-3 p-6 bg-slate-900/60 border ${styles.border} rounded-3xl flex flex-col items-center text-center relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 md:h-[300px] justify-center`}
                >
                  <div className="absolute top-2 right-3 text-4xl">{styles.medal}</div>
                  <div className="relative">
                    <img 
                      src={topThree[2].photoURL} 
                      alt="" 
                      className="w-20 h-20 rounded-full border-4 border-amber-600 object-cover shadow-lg"
                    />
                  </div>
                  <h3 className="text-lg font-black text-white mt-4 truncate max-w-[200px]">{topThree[2].displayName}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{topThree[2].email}</p>
                  
                  <div className="flex gap-4 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-white/10 pt-4 w-full justify-center">
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3 text-cyan-400" /> {topThree[2].postsCount}</span>
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3 text-emerald-400" /> {topThree[2].skknCount}</span>
                  </div>

                  <div className="mt-4 px-4 py-1.5 rounded-full bg-slate-800 text-amber-500 font-extrabold text-xs tracking-wider">
                    {topThree[2].points} Điểm
                  </div>
                </motion.div>
              );
            })()}

          </div>

          {/* Remaining Ranks Table List */}
          {remaining.length > 0 && (
            <div className="max-w-5xl mx-auto bg-slate-900/40 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider mb-2">Bảng tổng hợp xếp hạng</h3>
              
              <div className="divide-y divide-white/5">
                {remaining.map((item, idx) => (
                  <div 
                    key={item.uid}
                    className="py-4 flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank Number */}
                      <span className="w-6 text-center text-sm font-black text-slate-500 group-hover:text-cyan-400 transition-colors">
                        #{idx + 4}
                      </span>
                      {/* Avatar */}
                      <img 
                        src={item.photoURL} 
                        className="w-10 h-10 rounded-full border border-white/10 object-cover" 
                        alt=""
                      />
                      {/* Name */}
                      <div>
                        <h4 className="text-sm font-extrabold text-white group-hover:text-yellow-400 transition-colors">{item.displayName}</h4>
                        <p className="text-[10px] text-slate-500 font-bold">{item.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      {/* Stats */}
                      <div className="hidden sm:flex gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {item.postsCount} bài</span>
                        <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {item.skknCount} SKKN</span>
                      </div>
                      
                      {/* Points */}
                      <div className="px-4 py-1.5 rounded-xl bg-slate-950 font-black text-xs text-cyan-400 tracking-wide">
                        {item.points}đ
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
