import React, { useState, useEffect, useCallback } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Share2,
  Image as ImageIcon,
  Tag,
  PlusCircle,
  Sparkles,
  Search,
  Users,
  Award,
  ArrowLeft,
  Bookmark,
  MoreHorizontal,
  CheckCircle2,
  BookOpen,
  Loader2,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

// ─── Kiểu dữ liệu ─────────────────────────────────────────────────────────────

interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  userRole: string;
  content: string;
  timestamp: string;
}

interface Post {
  id: string;
  userName: string;
  userAvatar: string;
  userRole: string;
  userId: string;
  isVerified?: boolean;
  content: string;
  image?: string;
  tags: string[];
  likes: number;
  likedBy: string[]; // uid của người đã like
  comments: Comment[];
  createdAt: Timestamp | null;
  timestamp: string;
}

interface CommunityPageProps {
  onBack: () => void;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const formatTimestamp = (ts: Timestamp | null): string => {
  if (!ts) return 'Vừa xong';
  const date = ts.toDate();
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Vừa xong';
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} giờ trước`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD} ngày trước`;
  return date.toLocaleDateString('vi-VN');
};

// ─── Component ────────────────────────────────────────────────────────────────

export function CommunityPage({ onBack }: CommunityPageProps) {
  const { currentUser } = useAuth();
  const currentUserName = currentUser?.displayName || 'Tài khoản';
  const currentUserEmail = currentUser?.email || '';
  const currentUserUid = currentUser?.uid || 'anonymous';
  const currentUserAvatar =
    currentUser?.photoURL ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

  // ─── Realtime Posts State ─────────────────────────────────────────────────
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  // ─── Form State ───────────────────────────────────────────────────────────
  const [newPostText, setNewPostText] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTagFilter, setSelectedTagFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ─── Comment States ───────────────────────────────────────────────────────
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // ─── Subscribe Firestore realtime ─────────────────────────────────────────
  useEffect(() => {
    const q = query(collection(db, 'community_posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: Post[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            userName: data.userName ?? 'Ẩn danh',
            userAvatar: data.userAvatar ?? '',
            userRole: data.userRole ?? 'Thành viên',
            userId: data.userId ?? '',
            isVerified: data.isVerified ?? false,
            content: data.content ?? '',
            image: data.image ?? undefined,
            tags: data.tags ?? [],
            likes: data.likes ?? 0,
            likedBy: data.likedBy ?? [],
            comments: data.comments ?? [],
            createdAt: data.createdAt ?? null,
            timestamp: formatTimestamp(data.createdAt ?? null),
          };
        });
        setPosts(fetched);
        setLoadingPosts(false);
        setPostsError(null);
      },
      (err) => {
        console.error('[CommunityPage] Firestore error:', err);
        setPostsError('Không thể tải bài đăng. Vui lòng thử lại.');
        setLoadingPosts(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // ─── Story Categories (Instagram style) ──────────────────────────────────
  const stories = [
    { name: 'KHTN 6', gradient: 'from-pink-500 to-rose-500', count: 12 },
    { name: 'Vật Lý', gradient: 'from-cyan-500 to-blue-600', count: 24 },
    { name: 'Hóa Học', gradient: 'from-purple-600 to-indigo-600', count: 18 },
    { name: 'Sinh Học', gradient: 'from-emerald-500 to-teal-500', count: 15 },
    { name: 'STEM', gradient: 'from-amber-500 to-orange-600', count: 32 },
    { name: 'Sáng kiến', gradient: 'from-blue-600 to-cyan-500', count: 8 },
  ];

  const activeCommunities = [
    { name: 'Hội Giáo Viên Khoa Học Số', members: 'Cộng đồng mở', icon: Users, color: 'text-cyan-400 bg-cyan-500/10' },
    { name: 'Góc Học Tập STEM Sáng Tạo', members: 'Đang hoạt động', icon: Award, color: 'text-amber-400 bg-amber-500/10' },
    { name: 'Chia Sẻ Giáo Án & SKKN KHTN', members: 'Chia sẻ tài liệu', icon: BookOpen, color: 'text-emerald-400 bg-emerald-500/10' },
  ];

  // ─── Đếm bài đăng theo tag ────────────────────────────────────────────────
  const getTagCount = (tagName: string) =>
    posts.filter((p) => p.tags.some((t) => t.toLowerCase() === tagName.toLowerCase())).length;

  // ─── Like / Unlike ────────────────────────────────────────────────────────
  const handleLike = useCallback(
    async (postId: string, currentLikedBy: string[]) => {
      const hasLiked = currentLikedBy.includes(currentUserUid);
      const postRef = doc(db, 'community_posts', postId);
      try {
        await updateDoc(postRef, {
          likes: increment(hasLiked ? -1 : 1),
          likedBy: hasLiked ? arrayRemove(currentUserUid) : arrayUnion(currentUserUid),
        });

        // Add notification if liking (and not liking own post)
        if (!hasLiked) {
          const post = posts.find(p => p.id === postId);
          if (post && post.userId !== currentUserUid) {
            await addDoc(collection(db, 'notifications'), {
              userId: post.userId,
              senderName: currentUserName,
              senderAvatar: currentUserAvatar,
              type: 'like',
              message: `${currentUserName} đã thích bài viết của bạn.`,
              read: false,
              createdAt: serverTimestamp()
            });
          }
        }
      } catch (e) {
        console.error('[CommunityPage] Like error:', e);
      }
    },
    [currentUserUid, currentUserName, currentUserAvatar, posts]
  );

  // ─── Thêm bình luận ───────────────────────────────────────────────────────
  const handleAddComment = useCallback(
    async (postId: string) => {
      if (!commentInput.trim() || commentSubmitting) return;
      setCommentSubmitting(true);
      const newComment: Comment = {
        id: `c-${Date.now()}`,
        userName: currentUserName,
        userAvatar: currentUserAvatar,
        userRole: 'Thành viên cộng đồng học tập',
        content: commentInput.trim(),
        timestamp: 'Vừa xong',
      };
      try {
        await updateDoc(doc(db, 'community_posts', postId), {
          comments: arrayUnion(newComment),
        });

        // Add notification (and not commenting own post)
        const post = posts.find(p => p.id === postId);
        if (post && post.userId !== currentUserUid) {
          await addDoc(collection(db, 'notifications'), {
            userId: post.userId,
            senderName: currentUserName,
            senderAvatar: currentUserAvatar,
            type: 'comment',
            message: `${currentUserName} đã bình luận bài viết của bạn.`,
            read: false,
            createdAt: serverTimestamp()
          });
        }

        setCommentInput('');
      } catch (e) {
        console.error('[CommunityPage] Comment error:', e);
      } finally {
        setCommentSubmitting(false);
      }
    },
    [commentInput, commentSubmitting, currentUserName, currentUserAvatar, currentUserUid, posts]
  );

  // ─── Tạo bài đăng mới ────────────────────────────────────────────────────
  const handleCreatePost = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newPostText.trim() || isSubmitting) return;
      setIsSubmitting(true);

      const tagsArray = newPostTags
        .split(',')
        .map((t) => t.trim().replace('#', ''))
        .filter((t) => t.length > 0);

      try {
        await addDoc(collection(db, 'community_posts'), {
          userName: currentUserName,
          userAvatar: currentUserAvatar,
          userRole: 'Giáo viên / Học viên',
          userId: currentUserUid,
          isVerified: false,
          content: newPostText.trim(),
          image: newPostImage.trim() || null,
          tags: tagsArray.length > 0 ? tagsArray : ['CộngĐồngSố'],
          likes: 0,
          likedBy: [],
          comments: [],
          createdAt: serverTimestamp(),
        });

        // Add broadcast notification for a new post
        await addDoc(collection(db, 'notifications'), {
          userId: 'all',
          senderName: currentUserName,
          senderAvatar: currentUserAvatar,
          type: 'post',
          message: `${currentUserName} vừa đăng một bài viết mới trong Cộng đồng.`,
          read: false,
          createdAt: serverTimestamp()
        });

        setNewPostText('');
        setNewPostTags('');
        setNewPostImage('');
      } catch (e) {
        console.error('[CommunityPage] Create post error:', e);
        alert('Không thể đăng bài. Vui lòng thử lại!');
      } finally {
        setIsSubmitting(false);
      }
    },
    [newPostText, newPostTags, newPostImage, isSubmitting, currentUserName, currentUserAvatar, currentUserUid]
  );

  // ─── Xóa bài đăng (chỉ chủ bài) ──────────────────────────────────────────
  const handleDeletePost = useCallback(
    async (postId: string) => {
      if (!confirm('Bạn có chắc muốn xóa bài đăng này không?')) return;
      try {
        await deleteDoc(doc(db, 'community_posts', postId));
      } catch (e) {
        console.error('[CommunityPage] Delete error:', e);
      }
    },
    []
  );

  // ─── Lọc bài đăng ────────────────────────────────────────────────────────
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag =
      selectedTagFilter === 'all' ||
      post.tags.some((t) => t.toLowerCase() === selectedTagFilter.toLowerCase());
    return matchesSearch && matchesTag;
  });

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="w-full flex-1 flex flex-col pt-2 max-w-7xl mx-auto px-4 md:px-6 select-none animate-in fade-in duration-500">

      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 hover:border-orange-400 transition-all text-white group shadow-sm flex items-center justify-center shrink-0"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white font-heading drop-shadow-sm flex items-center gap-2">
              Cộng Đồng Học Tập Số
              <Sparkles className="w-6 h-6 text-orange-500 animate-pulse" />
            </h2>
            <p className="text-cyan-400 mt-1 font-bold text-xs md:text-sm uppercase tracking-wider">
              Kết nối tri thức • Chia sẻ tài nguyên khoa học
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết, chủ đề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white/10 focus:bg-white/20 border border-white/10 focus:border-orange-500 rounded-full text-white placeholder-slate-400 text-sm font-semibold outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Stories / Tag bar */}
      <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] mb-6">
        <div className="flex gap-4 md:gap-6 py-2 px-1 min-w-max">
          {/* All */}
          <div
            onClick={() => setSelectedTagFilter('all')}
            className="flex flex-col items-center cursor-pointer group transition-transform hover:scale-105"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center p-0.5 border-2 transition-colors ${selectedTagFilter === 'all' ? 'border-orange-500 bg-orange-500/10' : 'border-slate-700 bg-slate-800'}`}>
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <span className="text-xs font-bold text-slate-300 mt-2 group-hover:text-orange-400 transition-colors">Tất cả</span>
          </div>

          {stories.map((story, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedTagFilter(story.name)}
              className="flex flex-col items-center cursor-pointer group transition-transform hover:scale-105"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center p-[2.5px] bg-linear-to-tr ${story.gradient} hover:scale-110 transition-transform`}>
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border-2 border-slate-950 overflow-hidden">
                  <span className="text-[10px] font-black text-white text-center px-1 leading-tight tracking-tighter uppercase">{story.name}</span>
                </div>
              </div>
              <span className={`text-xs font-bold mt-2 group-hover:text-white transition-colors ${selectedTagFilter === story.name ? 'text-orange-400 font-extrabold' : 'text-slate-300'}`}>
                #{story.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-20">

        {/* ── Left / Center Feed ── */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* Create Post Box */}
          <form onSubmit={handleCreatePost} className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-cyan-500 via-orange-500 to-fuchsia-500"></div>

            <div className="flex gap-4">
              <img src={currentUserAvatar} alt="My avatar" className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500/50 shadow-sm shrink-0" />
              <div className="flex-1">
                <textarea
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder={`Chào ${currentUserName}, hôm nay bạn muốn chia sẻ kiến thức khoa học gì thế?`}
                  rows={3}
                  className="w-full bg-slate-950/40 border border-slate-800/80 focus:border-cyan-500/80 rounded-2xl p-4 text-white text-sm placeholder-slate-400 outline-none resize-none transition-all focus:ring-1 focus:ring-cyan-500/20 leading-relaxed"
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Thêm tag (cách nhau bằng dấu phẩy, ví dụ: KHTN, VậtLý)"
                  value={newPostTags}
                  onChange={(e) => setNewPostTags(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/30 border border-slate-800/80 focus:border-cyan-500/80 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
              <div className="flex-1 relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Dán link ảnh minh họa (tùy chọn)"
                  value={newPostImage}
                  onChange={(e) => setNewPostImage(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/30 border border-slate-800/80 focus:border-cyan-500/80 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-bold">Hãy cùng chia sẻ kiến thức tích cực!</span>
              <button
                type="submit"
                disabled={isSubmitting || !newPostText.trim()}
                className="px-5 py-2 rounded-full bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 shadow-md hover:shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <span>Đăng bài</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Posts Feed */}
          <div className="flex flex-col gap-6">
            {/* Loading state */}
            {loadingPosts && (
              <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                <p className="text-slate-400 text-sm font-bold">Đang tải bài đăng...</p>
              </div>
            )}

            {/* Error state */}
            {postsError && !loadingPosts && (
              <div className="text-center py-16 bg-rose-950/20 border border-rose-800/40 rounded-3xl">
                <p className="text-rose-400 font-extrabold text-sm mb-1">{postsError}</p>
                <p className="text-slate-500 text-xs">Kiểm tra kết nối mạng và thử lại.</p>
              </div>
            )}

            {/* Empty state */}
            {!loadingPosts && !postsError && filteredPosts.length === 0 && (
              <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl">
                <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400 font-extrabold text-sm mb-1">Không tìm thấy bài viết nào phù hợp</p>
                <p className="text-slate-500 text-xs font-semibold">Hãy thử tìm kiếm từ khóa khác hoặc tạo bài viết mới nhé!</p>
              </div>
            )}

            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post) => {
                const hasLiked = post.likedBy.includes(currentUserUid);
                const isOwner = post.userId === currentUserUid;

                return (
                  <motion.article
                    key={post.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col"
                  >
                    {/* Author block */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <img src={post.userAvatar} alt={post.userName} className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow-sm" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-extrabold text-white">{post.userName}</span>
                            {post.isVerified && <CheckCircle2 className="w-4 h-4 text-cyan-400" fill="currentColor" />}
                          </div>
                          <span className="text-[10px] text-orange-500 font-bold">{post.userRole}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-bold">{post.timestamp}</span>
                        {isOwner && (
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                            title="Xóa bài đăng"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-sm text-slate-200 leading-relaxed mb-4 text-left whitespace-pre-wrap">{post.content}</p>

                    {/* Image */}
                    {post.image && (
                      <div className="w-full rounded-2xl overflow-hidden border border-slate-800/60 bg-slate-950 mb-4 select-none relative group max-h-[400px]">
                        <img src={post.image} alt="Post attachment" className="w-full h-full object-cover max-h-[400px] transition-transform duration-500 group-hover:scale-102" />
                        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none"></div>
                      </div>
                    )}

                    {/* Hashtags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, i) => (
                        <span
                          key={i}
                          onClick={() => setSelectedTagFilter(tag)}
                          className="text-[10px] font-extrabold text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded-full hover:border-cyan-400 transition-all cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions bar */}
                    <div className="border-y border-slate-800/80 py-2.5 flex items-center justify-between text-slate-400 text-xs">
                      {/* Like */}
                      <button
                        onClick={() => handleLike(post.id, post.likedBy)}
                        className={`flex items-center gap-1.5 font-extrabold transition-all active:scale-80 hover:text-red-500 group`}
                      >
                        <motion.div animate={{ scale: hasLiked ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.3 }}>
                          <Heart className={`w-5 h-5 transition-colors ${hasLiked ? 'text-red-500 fill-red-500' : 'text-slate-400 group-hover:text-red-500'}`} />
                        </motion.div>
                        <span className={hasLiked ? 'text-red-500' : ''}>{post.likes} Yêu thích</span>
                      </button>

                      {/* Comment */}
                      <button
                        onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                        className={`flex items-center gap-1.5 font-extrabold hover:text-cyan-400 transition-colors ${activeCommentPostId === post.id ? 'text-cyan-400' : ''}`}
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments.length} Bình luận</span>
                      </button>

                      {/* Bookmark */}
                      <button className="flex items-center gap-1 font-extrabold hover:text-orange-400 transition-colors">
                        <Bookmark className="w-5 h-5" />
                        <span className="hidden sm:inline">Lưu trữ</span>
                      </button>

                      {/* Share */}
                      <button
                        onClick={() => navigator.clipboard.writeText(window.location.href).then(() => alert('Đã sao chép liên kết!'))}
                        className="flex items-center gap-1.5 font-extrabold hover:text-white transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                        <span className="hidden sm:inline">Chia sẻ</span>
                      </button>
                    </div>

                    {/* Comments */}
                    <AnimatePresence>
                      {activeCommentPostId === post.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden flex flex-col"
                        >
                          {post.comments.length > 0 && (
                            <div className="flex flex-col gap-3.5 mt-4 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                              {post.comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3 bg-slate-950/20 border border-slate-800/40 p-3 rounded-2xl items-start">
                                  <img src={comment.userAvatar} alt={comment.userName} className="w-8 h-8 rounded-full object-cover border border-slate-800 shadow-sm shrink-0" />
                                  <div className="flex-1 min-w-0 text-left">
                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                      <span className="text-xs font-bold text-white truncate">{comment.userName}</span>
                                      <span className="text-[9px] text-slate-500 shrink-0">{comment.timestamp}</span>
                                    </div>
                                    <p className="text-[10px] text-orange-500/80 font-bold mb-1 leading-none">{comment.userRole}</p>
                                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Write comment */}
                          <div className="flex gap-3 mt-4 items-center">
                            <img src={currentUserAvatar} alt="My avatar" className="w-8 h-8 rounded-full object-cover border border-slate-700 shadow-sm shrink-0" />
                            <div className="flex-1 flex gap-2">
                              <input
                                type="text"
                                placeholder="Viết phản hồi của bạn..."
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }}
                                className="flex-1 bg-slate-950/40 border border-slate-800/80 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all focus:ring-1 focus:ring-cyan-500/20"
                              />
                              <button
                                onClick={() => handleAddComment(post.id)}
                                disabled={commentSubmitting}
                                className="p-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white hover:scale-105 active:scale-95 transition-all shadow-md shrink-0 flex items-center justify-center disabled:opacity-50"
                              >
                                {commentSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* User Stats Card */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-5 shadow-lg text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-20 bg-linear-to-br from-cyan-600 to-blue-800 opacity-60"></div>
            <div className="relative mt-8 flex flex-col items-center">
              <img src={currentUserAvatar} alt="User big avatar" className="w-16 h-16 rounded-full border-4 border-slate-900 object-cover shadow-md" />
              <h3 className="text-base font-extrabold text-white mt-3 flex items-center gap-1 justify-center">
                {currentUserName}
                <CheckCircle2 className="w-4 h-4 text-cyan-400" fill="currentColor" />
              </h3>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">{currentUserEmail}</p>

              <div className="grid grid-cols-3 gap-2 w-full mt-6 pt-4 border-t border-slate-800/80">
                <div className="flex flex-col items-center">
                  <span className="text-sm font-extrabold text-white">{posts.filter(p => p.userId === currentUserUid).length}</span>
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Bài đăng</span>
                </div>
                <div className="flex flex-col items-center border-x border-slate-800/80">
                  <span className="text-sm font-extrabold text-white">{posts.filter(p => p.likedBy.includes(currentUserUid)).length}</span>
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Đã thích</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-extrabold text-white">{posts.filter(p => p.userId === currentUserUid).reduce((a, p) => a + p.likes, 0)}</span>
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Lượt thích</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Communities */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col text-left">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-500" />
              Cộng Đồng Đang Hoạt Động
            </h3>
            <div className="flex flex-col gap-4">
              {activeCommunities.map((comm, idx) => {
                const CommIcon = comm.icon;
                return (
                  <div key={idx} className="flex gap-3 items-center group cursor-pointer">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${comm.color} shrink-0 transition-transform group-hover:scale-105`}>
                      <CommIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold text-slate-200 group-hover:text-cyan-400 transition-colors truncate">{comm.name}</p>
                      <p className="text-[10px] text-slate-500 font-bold">{comm.members}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="w-full mt-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500 hover:text-orange-500 font-bold text-xs text-slate-300 transition-all flex items-center justify-center space-x-2">
              <PlusCircle className="w-4 h-4" />
              <span>Khám phá thêm nhóm</span>
            </button>
          </div>

          {/* Trending Tags */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col text-left">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-bounce" />
              Xu Hướng Khoa Học Số
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { label: '#STEM_KHTN', tags: ['STEM', 'KHTN'] },
                { label: '#ĐịnhLuậtNewton', tags: ['Newton'] },
                { label: '#EsteThủyPhân', tags: ['Este'] },
                { label: '#MôPhỏngVậtLý', tags: ['VậtLý'] },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center text-xs">
                  <span
                    className="font-extrabold text-slate-400 hover:text-white cursor-pointer"
                    onClick={() => setSelectedTagFilter(item.tags[0])}
                  >
                    {item.label}
                  </span>
                  <span className="text-[10px] text-slate-600 font-black">
                    {item.tags.reduce((s, t) => s + getTagCount(t), 0)} bài viết
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
