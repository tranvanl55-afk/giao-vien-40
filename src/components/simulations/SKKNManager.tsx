import React, { useState, useEffect } from 'react';
import { 
  FileText, UploadCloud, Trash2, Eye, Download, X, 
  AlertCircle, CheckCircle2, Lock, Loader2, Filter, Search
} from 'lucide-react';
import { db, storage, auth } from '../../firebase';
import { 
  ref, uploadBytes, getDownloadURL, deleteObject 
} from 'firebase/storage';
import { 
  collection, addDoc, deleteDoc, doc, query, where, orderBy, onSnapshot 
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

interface SKKNDoc {
  id: string;
  title: string;
  pdfUrl: string;
  storagePath: string;
  category: string;
  subCategoryId: string;
  fileName: string;
  fileSize: number;
  uploadedAt: any;
  uploadedBy: string;
  uploadedByEmail: string;
}

interface SKKNManagerProps {
  subCategoryId: string;
  categoryTitle: string;
}

export default function SKKNManager({ subCategoryId, categoryTitle }: SKKNManagerProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [docs, setDocs] = useState<SKKNDoc[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<string>('');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');

  // Preview state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch documents real-time
  useEffect(() => {
    setLoading(true);
    // Fetch all docs for this subcategory or general SKKN category
    const q = query(
      collection(db, 'skkn_docs'),
      where('subCategoryId', '==', subCategoryId),
      orderBy('uploadedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedDocs: SKKNDoc[] = [];
      snapshot.forEach((doc) => {
        fetchedDocs.push({ id: doc.id, ...doc.data() } as SKKNDoc);
      });
      setDocs(fetchedDocs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching SKKN docs: ", error);
      // Fallback query if index is not ready yet
      const fallbackQuery = query(
        collection(db, 'skkn_docs'),
        where('subCategoryId', '==', subCategoryId)
      );
      onSnapshot(fallbackQuery, (snapshot) => {
        const fetchedDocs: SKKNDoc[] = [];
        snapshot.forEach((doc) => {
          fetchedDocs.push({ id: doc.id, ...doc.data() } as SKKNDoc);
        });
        // Sort manually in memory
        fetchedDocs.sort((a, b) => {
          const t1 = a.uploadedAt?.seconds || 0;
          const t2 = b.uploadedAt?.seconds || 0;
          return t2 - t1;
        });
        setDocs(fetchedDocs);
        setLoading(false);
      }, (fallbackError) => {
        console.error("Error in fallback query: ", fallbackError);
        setLoading(false);
      });
    });

    return () => unsubscribe();
  }, [subCategoryId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setUploadError('Chỉ hỗ trợ định dạng tệp tin PDF (.pdf)');
        setFile(null);
        return;
      }
      if (selectedFile.size > 15 * 1024 * 1024) { // 15MB limit
        setUploadError('Dung lượng tệp vượt quá giới hạn (Tối đa 15MB)');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setUploadError('');
      if (!title) {
        setTitle(selectedFile.name.replace(/\.pdf$/i, ''));
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) { setUploadError('Bạn cần đăng nhập để tải lên tài liệu.'); return; }
    if (!file) { setUploadError('Vui lòng chọn một tệp PDF.'); return; }
    if (!title.trim()) { setUploadError('Vui lòng nhập tiêu đề tài liệu.'); return; }

    setIsUploading(true);
    setUploadError('');
    setUploadSuccess(false);
    setUploadProgress(0);
    setUploadStep('Đang chuẩn bị...');

    try {
      const cleanFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const storagePath = `skkn/${subCategoryId}/${cleanFileName}`;
      const fileRef = ref(storage, storagePath);

      setUploadStep('Đang tải PDF lên Firebase Storage (vui lòng chờ)...');
      setUploadProgress(30);

      // uploadBytes = single multipart POST, no PUT, no CORS issue
      const snapshot = await uploadBytes(fileRef, file, { contentType: 'application/pdf' });

      setUploadProgress(85);
      setUploadStep('Đang lấy đường dẫn...');
      const downloadUrl = await getDownloadURL(snapshot.ref);

      setUploadProgress(93);
      setUploadStep('Đang lưu vào cơ sở dữ liệu...');
      await addDoc(collection(db, 'skkn_docs'), {
        title: title.trim(),
        pdfUrl: downloadUrl,
        storagePath,
        category: categoryTitle,
        subCategoryId,
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date(),
        uploadedBy: currentUser.displayName || 'Giáo viên',
        uploadedByEmail: currentUser.email || ''
      });

      setUploadProgress(100);
      setUploadStep('✅ Đã hoàn thành!');
      setTitle('');
      setFile(null);
      setUploadSuccess(true);
      const fileInput = document.getElementById('pdf-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      setTimeout(() => { setUploadSuccess(false); setUploadProgress(null); setUploadStep(''); }, 4000);

    } catch (err: any) {
      console.error('Upload error:', err);
      let msg = err.message || 'Lỗi không xác định.';
      if (err.code === 'storage/unauthorized') msg = '⛔ Lỗi 403 – Storage Rules chưa cho phép ghi. Kiểm tra Firebase Console → Storage → Rules.';
      else if (err.code === 'storage/quota-exceeded') msg = '⛔ Dung lượng Storage đã đầy.';
      else if (err.code === 'permission-denied') msg = '⛔ Firestore từ chối quyền ghi.';
      setUploadError(msg);
      setUploadProgress(null);
      setUploadStep('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (docId: string, storagePath: string) => {
    if (!currentUser) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài liệu này không? Hành động này không thể hoàn tác.')) return;
    try {
      if (storagePath) {
        const fileRef = ref(storage, storagePath);
        await deleteObject(fileRef).catch(() => {});
      }
      await deleteDoc(doc(db, 'skkn_docs', docId));
    } catch (err: any) {
      console.error("Error deleting document:", err);
      alert('Không thể xóa tài liệu: ' + err.message);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Gần đây';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Filter and search logic
  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="w-full flex flex-col space-y-6 text-slate-800 animate-in fade-in duration-300">
      
      {/* TRÌNH XEM PDF INLINE (MODAL OVERLAY) */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            {/* Header Preview */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-600">
                <FileText className="w-5 h-5" />
                <span className="font-bold truncate max-w-md md:max-w-xl text-sm md:text-base text-slate-800">{previewTitle}</span>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href={previewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 text-slate-700 hover:text-slate-900"
                >
                  <Download className="w-4 h-4" /> Mở trong tab mới
                </a>
                <button 
                  onClick={() => { setPreviewUrl(null); setPreviewTitle(''); }}
                  className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            {/* Content Preview */}
            <div className="flex-1 bg-white relative">
              <iframe
                src={`${previewUrl}#toolbar=1`}
                className="w-full h-full border-none"
                title={previewTitle}
              />
            </div>
          </div>
        </div>
      )}

      {/* THÔNG TIN CHUNG */}
      <div className="relative overflow-hidden bg-linear-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 rounded-3xl p-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 shadow-md">
        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {categoryTitle}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 font-heading">
            Hệ Thống Đăng Tải & Lưu Trữ PDF
          </h2>
          <p className="text-xs leading-relaxed text-slate-500 max-w-2xl font-medium">
            Nơi giáo viên chia sẻ, quản lý và lưu trữ các đề tài, bài kiểm tra, giáo án và tài liệu học tập chất lượng cao dưới dạng tệp PDF tiêu chuẩn.
          </p>
        </div>
      </div>

      {/* GRID CHÍNH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PANEL TRÁI: FORM UPLOAD (1 Cột) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-blue-500/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <UploadCloud className="w-6 h-6 text-orange-500" />
              <h2 className="text-lg font-black text-slate-800 tracking-tight">TẢI TÀI LIỆU LÊN</h2>
            </div>

            {currentUser ? (
              // Bảng điều khiển upload cho Admin/Giáo viên đã đăng nhập
              <form onSubmit={handleUpload} className="space-y-4">
                {uploadError && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2 text-xs text-red-600">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                    <p className="leading-normal font-medium">{uploadError}</p>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-2 text-xs text-emerald-600 animate-bounce">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                    <p className="leading-normal font-medium">Đã đăng tải và lưu trữ tài liệu thành công!</p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Tiêu đề tài liệu:</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ví dụ: Đổi mới phương pháp dạy KHTN 6..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Chọn tệp PDF:</label>
                  <div className="relative border border-dashed border-slate-300 hover:border-orange-500/50 bg-slate-50 rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-orange-50/50 group">
                    <input
                      id="pdf-file-input"
                      type="file"
                      required
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-orange-500 mx-auto mb-2 transition-colors" />
                    <p className="text-[10.5px] font-bold text-slate-500 group-hover:text-slate-700 truncate">
                      {file ? file.name : 'Nhấp để duyệt tệp tin PDF'}
                    </p>
                    <p className="text-[9px] text-slate-400 mt-1">Hỗ trợ tệp PDF tối đa 15MB</p>
                  </div>
                </div>

                {isUploading && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                      <span className="flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin text-orange-500" />
                        {uploadStep || 'Đang xử lý...'}
                      </span>
                      <span>{uploadProgress ?? 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 transition-all duration-500"
                        style={{ width: `${uploadProgress ?? 0}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-3 mt-2 rounded-xl bg-slate-800 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang thực hiện...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      Bắt đầu tải lên
                    </>
                  )}
                </button>
              </form>
            ) : (
              // Trạng thái khóa khi chưa đăng nhập
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                  <Lock className="w-5 h-5 text-orange-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-700">Giới hạn tải lên</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                    Vui lòng Đăng nhập tài khoản giáo viên của bạn ở thanh điều hướng trên cùng để có quyền đăng tải tài liệu mới.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PANEL PHẢI: DANH SÁCH FILE PDF (2 Cột) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm min-h-[500px] flex flex-col">
            
            {/* Search and Header */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="relative flex-1 max-w-md glowing-search rounded-xl">
                <div className="glowing-search-inner h-full flex relative rounded-xl bg-slate-50">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                    <Search className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm tài liệu đã đăng..."
                    className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none text-xs font-bold text-slate-700 placeholder-slate-400 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Filter className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Tổng số: {filteredDocs.length} tài liệu</span>
              </div>
            </div>

            {/* DANH SÁCH TÀI LIỆU */}
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-450">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-2" />
                <p className="text-xs font-semibold">Đang cập nhật danh mục tài liệu từ cơ sở dữ liệu...</p>
              </div>
            ) : filteredDocs.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-500 space-y-3">
                <FileText className="w-16 h-16 opacity-20 text-slate-400" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400">Chưa tìm thấy tài liệu phù hợp</p>
                  <p className="text-[10px] max-w-sm mx-auto leading-normal text-slate-500">
                    Hãy là người đầu tiên đăng tải tài liệu hữu ích của bạn lên hệ thống để lưu trữ lâu dài.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 content-start">
                {filteredDocs.map((docItem) => (
                  <div 
                    key={docItem.id}
                    className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-4.5 transition-all flex flex-col justify-between gap-4 shadow-sm group"
                  >
                    <div className="space-y-2">
                      {/* Cột thông tin cơ bản */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-100 text-orange-500 group-hover:scale-105 group-hover:text-orange-600 transition-all">
                          <FileText className="w-6 h-6" />
                        </div>
                        <h4 className="text-xs font-black leading-snug text-slate-800 flex-1 line-clamp-2">
                          {docItem.title}
                        </h4>
                      </div>

                      {/* Thông tin mô tả kích thước, ngày đăng */}
                      <div className="pt-2 grid grid-cols-2 gap-2 text-[9.5px] text-slate-500 font-semibold border-t border-slate-100">
                        <div>
                          <span className="block text-slate-500 text-[8.5px] uppercase">Dung lượng tệp</span>
                          {formatBytes(docItem.fileSize)}
                        </div>
                        <div>
                          <span className="block text-slate-500 text-[8.5px] uppercase">Ngày tải lên</span>
                          {formatDate(docItem.uploadedAt)}
                        </div>
                        <div className="col-span-2 truncate">
                          <span className="block text-slate-500 text-[8.5px] uppercase">Người gửi</span>
                          {docItem.uploadedBy} ({docItem.uploadedByEmail || 'Giáo viên'})
                        </div>
                      </div>
                    </div>

                    {/* Nút hành động */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => { setPreviewUrl(docItem.pdfUrl); setPreviewTitle(docItem.title); }}
                        className="flex-1 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-600 hover:text-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> Xem trước
                      </button>
                      
                      <a
                        href={docItem.pdfUrl}
                        download={docItem.fileName}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 transition-all cursor-pointer flex items-center justify-center"
                        title="Tải tệp tin về máy"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>

                      {/* Chỉ hiện nút xóa nếu người dùng đã đăng nhập */}
                      {currentUser && (
                        <button
                          onClick={() => handleDelete(docItem.id, docItem.storagePath)}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-100 text-red-500 hover:text-red-600 transition-all cursor-pointer flex items-center justify-center"
                          title="Xóa tài liệu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
