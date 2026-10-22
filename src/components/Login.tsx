import React, { useState } from 'react';
import { User, Calendar, Briefcase, Key, Mail, Lock, Eye, EyeOff, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const translations = {
  vi: {
    title: "GIÁO VIÊN 4.0",
    subtitle: "Trạm Vũ trụ Tri thức",
    loginHeader: "Đăng nhập",
    loginDesc: "Điền thông tin để tiếp nhận tín hiệu",
    emailPlaceholder: "Email của bạn",
    passwordPlaceholder: "Mật khẩu",
    geminiPlaceholder: "Gemini API Key của bạn (AIzaSy...)",
    geminiReqLogin: "Tài khoản này yêu cầu nhập Gemini API Key để tiếp tục sử dụng các tính năng AI!",
    geminiReqReg: "Tài khoản này yêu cầu nhập Gemini API Key để đăng ký và sử dụng các tính năng AI!",
    loginFail: "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu!",
    regFail: "Đăng ký thất bại. Email có thể đã tồn tại hoặc mật khẩu quá ngắn!",
    invalidRef: "Mã giới thiệu không đúng!",
    rememberMe: "Ghi nhớ đăng nhập",
    btnLogin: "ĐĂNG NHẬP",
    btnReg: "ĐĂNG KÝ",
    regHeader: "Đăng ký tham gia",
    regDesc: "Trạm vũ trụ cập nhật thông tin",
    fullName: "Họ và tên",
    passwordReq: "Mật khẩu (ít nhất 6 ký tự)",
    birthYear: "Năm sinh (VD: 2005)",
    roleStudent: "Học sinh",
    roleTeacher: "Giáo viên",
    roleParent: "Phụ huynh",
    refCode: "Mã giới thiệu (Bắt buộc)",
    geminiReq: "Gemini API Key (Bắt buộc)",
    noAccount: "Chưa có tài khoản?",
    hasAccount: "Đã có tài khoản?",
    langToggle: "English",
    // Overlay panel
    welcomeBack: "Chào mừng trở lại!",
    welcomeBackDesc: "Đăng nhập để tiếp tục hành trình khám phá tri thức cùng Giáo viên 4.0",
    signInBtn: "ĐĂNG NHẬP",
    helloFriend: "Xin chào bạn!",
    helloFriendDesc: "Đăng ký tài khoản để bắt đầu hành trình học tập thú vị cùng chúng tôi",
    signUpBtn: "ĐĂNG KÝ",
    validationError: "Vui lòng điền đầy đủ tất cả các trường bắt buộc!",
    orDivider: "hoặc",
    googleLogin: "Đăng nhập bằng Google",
    googleReg: "Đăng ký bằng Google",
    googleNotRegistered: "Tài khoản Google này chưa được đăng ký. Vui lòng chuyển sang mục Đăng ký, nhập mã giới thiệu rồi chọn \"Đăng ký bằng Google\".",
    googleGeminiReq: "Vui lòng nhập Gemini API Key vào ô bên dưới rồi bấm lại nút Google.",
    googleRefReq: "Vui lòng nhập đúng Mã giới thiệu trước khi đăng ký bằng Google!",
    googleFail: "Đăng nhập Google thất bại. Vui lòng thử lại!",
    googlePopupBlocked: "Trình duyệt đã chặn cửa sổ đăng nhập Google. Vui lòng cho phép popup và thử lại.",
    googleDomain: "Tên miền này chưa được cấp phép đăng nhập Google trong Firebase (Authorized domains).",
    googleProviderOff: "Đăng nhập Google chưa được bật trong Firebase Authentication.",
    googleExists: "Email này đã được đăng ký bằng mật khẩu. Vui lòng đăng nhập bằng email và mật khẩu.",
  },
  en: {
    title: "TEACHER 4.0",
    subtitle: "Knowledge Space Station",
    loginHeader: "Sign In",
    loginDesc: "Enter details to receive signal",
    emailPlaceholder: "Your email",
    passwordPlaceholder: "Password",
    geminiPlaceholder: "Your Gemini API Key (AIzaSy...)",
    geminiReqLogin: "This account requires a Gemini API Key to continue using AI features!",
    geminiReqReg: "This account requires a Gemini API Key to register and use AI features!",
    loginFail: "Login failed. Please check your email and password!",
    regFail: "Registration failed. Email may already exist or password is too short!",
    invalidRef: "Invalid referral code!",
    rememberMe: "Remember login",
    btnLogin: "SIGN IN",
    btnReg: "SIGN UP",
    regHeader: "Register to Join",
    regDesc: "Space station updates info",
    fullName: "Full Name",
    passwordReq: "Password (min 6 characters)",
    birthYear: "Birth Year (e.g. 2005)",
    roleStudent: "Student",
    roleTeacher: "Teacher",
    roleParent: "Parent",
    refCode: "Referral Code (Required)",
    geminiReq: "Gemini API Key (Required)",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    langToggle: "Tiếng Việt",
    welcomeBack: "Welcome Back!",
    welcomeBackDesc: "Sign in to continue your knowledge journey with Teacher 4.0",
    signInBtn: "SIGN IN",
    helloFriend: "Hello, Friend!",
    helloFriendDesc: "Register an account to start your amazing learning journey with us",
    signUpBtn: "SIGN UP",
    validationError: "Please fill in all required fields!",
    orDivider: "or",
    googleLogin: "Sign in with Google",
    googleReg: "Sign up with Google",
    googleNotRegistered: "This Google account is not registered yet. Please go to Sign Up, enter the referral code, then choose \"Sign up with Google\".",
    googleGeminiReq: "Please enter your Gemini API Key below, then click the Google button again.",
    googleRefReq: "Please enter a valid referral code before signing up with Google!",
    googleFail: "Google sign-in failed. Please try again!",
    googlePopupBlocked: "The browser blocked the Google sign-in popup. Please allow popups and try again.",
    googleDomain: "This domain is not authorized for Google sign-in in Firebase (Authorized domains).",
    googleProviderOff: "Google sign-in is not enabled in Firebase Authentication.",
    googleExists: "This email is already registered with a password. Please sign in with email and password.",
  }
};

export function Login() {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, loginWithGoogleCredential } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [googleNeedsKey, setGoogleNeedsKey] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [lang, setLangState] = useState<'vi' | 'en'>(() => {
    return document.cookie.includes('googtrans=/vi/en') ? 'en' : 'vi';
  });

  const setLang = (newLang: 'vi' | 'en') => {
    setLangState(newLang);
    if (newLang === 'en') {
      document.cookie = "googtrans=/vi/en; path=/";
      document.cookie = `googtrans=/vi/en; domain=${location.hostname}; path=/`;
    } else {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${location.hostname}; path=/;`;
    }
    window.location.reload();
  };

  const t = translations[lang];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [role, setRole] = useState("Học sinh");

  const switchToRegister = () => {
    setIsRegistering(true);
    setErrorStatus("");
  };

  const switchToLogin = () => {
    setIsRegistering(false);
    setErrorStatus("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus("");

    // Validate all required fields
    if (!email.trim() || !password.trim()) {
      setErrorStatus(t.validationError);
      return;
    }

    if (email.trim() !== "tranvanl55@gmail.com" && !geminiApiKey.trim()) {
      setErrorStatus(t.geminiReqLogin);
      return;
    }

    try {
      await loginWithEmail(email, password);
      if (email.trim() !== "tranvanl55@gmail.com") {
        localStorage.setItem('user_gemini_api_key', geminiApiKey.trim());
      }
    } catch (error: any) {
      console.error('Lỗi Firebase chi tiết:', error.code, error.message);
      if (error.code === 'auth/invalid-api-key' || error.code === 'auth/api-key-not-found' || error.message?.includes('API key')) {
        setErrorStatus("Khóa Firebase API Key không hợp lệ hoặc đã bị xóa. Vui lòng kiểm tra lại cấu hình Firebase!");
      } else if (error.code === 'auth/too-many-requests') {
        setErrorStatus("Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau ít phút.");
      } else {
        setErrorStatus(t.loginFail);
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    if (!fullName.trim() || !email.trim() || !password.trim() || !birthYear.trim()) {
      setErrorStatus(t.validationError);
      return;
    }

    if (email.trim() !== "tranvanl55@gmail.com" && !geminiApiKey.trim()) {
      setErrorStatus(t.validationError);
      return;
    }

    setErrorStatus("");
    try {
      await registerWithEmail(email, password, fullName, {
        birthYear,
        role: lang === 'en' ? (role === 'Student' ? 'Học sinh' : role === 'Teacher' ? 'Giáo viên' : 'Phụ huynh') : role,
      });
      if (email.trim() !== "tranvanl55@gmail.com") {
        localStorage.setItem('user_gemini_api_key', geminiApiKey.trim());
      }
    } catch (error: any) {
      console.error('Lỗi Firebase chi tiết:', error.code);
      setErrorStatus(t.regFail);
    }
  };

  const ADMIN_EMAIL = "tranvanl55@gmail.com";
  const GOOGLE_CLIENT_ID = "55853613187-5ikc7j1cmcn4d64onvea7jlb23pkc7t1.apps.googleusercontent.com";

  // Xử lý đăng nhập trực tiếp từ Google Identity Services (bỏ qua hoàn toàn __/auth/handler)
  const handleCredentialResponse = async (response: any) => {
    if (!response?.credential) return;
    setErrorStatus("");
    const typedKey = geminiApiKey.trim();
    const storedKey = localStorage.getItem('user_gemini_api_key') || "";

    setGoogleLoading(true);
    try {
      await loginWithGoogleCredential(response.credential, {
        additionalData: {
          birthYear: birthYear.trim() || null,
          role: role || 'Học sinh',
          provider: 'google',
        },
        validate: (userEmail) => {
          if (userEmail?.toLowerCase() !== ADMIN_EMAIL && !typedKey && !storedKey) {
            return 'auth/gemini-required';
          }
          return null;
        },
      });
      if (typedKey) {
        localStorage.setItem('user_gemini_api_key', typedKey);
      }
    } catch (error: any) {
      console.error('Lỗi đăng nhập Google Credential:', error);
      if (error.code === 'auth/gemini-required') {
        setGoogleNeedsKey(true);
        setErrorStatus(t.googleGeminiReq);
      } else {
        setErrorStatus(t.googleFail);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    const initGsi = () => {
      const g = (window as any).google;
      if (!g?.accounts?.id) return;

      try {
        g.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        const targetId = isRegistering ? 'gsi-btn-register' : 'gsi-btn-login';
        const btnContainer = document.getElementById(targetId);
        if (btnContainer) {
          btnContainer.innerHTML = '';
          g.accounts.id.renderButton(btnContainer, {
            theme: 'outline',
            size: 'large',
            width: 320,
            text: isRegistering ? 'signup_with' : 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
          });
        }
      } catch (err) {
        console.warn('GSI render warning:', err);
      }
    };

    initGsi();
    const timer = setInterval(() => {
      if ((window as any).google?.accounts?.id) {
        initGsi();
        clearInterval(timer);
      }
    }, 300);

    return () => clearInterval(timer);
  }, [isRegistering, lang, geminiApiKey, birthYear, role]);

  const handleGoogle = async (mode: 'login' | 'register') => {
    setErrorStatus("");

    // Nếu Google Identity Services đã nạp, ưu tiên mở Google One Tap prompt
    const g = (window as any).google;
    if (g?.accounts?.id) {
      g.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback sang Firebase popup thông thường nếu người dùng từ chối prompt
          runFirebasePopup();
        }
      });
      return;
    }

    await runFirebasePopup();
  };

  const runFirebasePopup = async () => {
    const typedKey = geminiApiKey.trim();
    const storedKey = localStorage.getItem('user_gemini_api_key') || "";

    setGoogleLoading(true);
    try {
      await loginWithGoogle({
        allowNewUser: true,
        additionalData: {
          birthYear: birthYear.trim() || null,
          role: role || 'Học sinh',
          provider: 'google',
        },
        validate: (userEmail) => {
          if (userEmail?.toLowerCase() !== ADMIN_EMAIL && !typedKey && !storedKey) {
            return 'auth/gemini-required';
          }
          return null;
        },
      });
      if (typedKey) {
        localStorage.setItem('user_gemini_api_key', typedKey);
      }
    } catch (error: any) {
      console.error('Lỗi đăng nhập Google:', error.code, error.message);
      switch (error.code) {
        case 'auth/gemini-required':
          setGoogleNeedsKey(true);
          setErrorStatus(t.googleGeminiReq);
          break;
        case 'auth/google-not-registered':
          setErrorStatus(t.googleNotRegistered);
          break;
        case 'auth/popup-closed-by-user':
        case 'auth/cancelled-popup-request':
          break;
        case 'auth/popup-blocked':
          setErrorStatus(t.googlePopupBlocked);
          break;
        case 'auth/unauthorized-domain':
          setErrorStatus(t.googleDomain);
          break;
        case 'auth/operation-not-allowed':
          setErrorStatus(t.googleProviderOff);
          break;
        case 'auth/account-exists-with-different-credential':
          setErrorStatus(t.googleExists);
          break;
        default:
          setErrorStatus(t.googleFail);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const needsGeminiLogin = googleNeedsKey || (email.trim() && email.trim() !== ADMIN_EMAIL);
  const needsGeminiReg = googleNeedsKey || (email.trim() && email.trim() !== ADMIN_EMAIL);

  const GoogleIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/>
    </svg>
  );

  const renderGoogleButton = (mode: 'login' | 'register') => (
    <>
      <div className="flex items-center gap-3 my-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">{t.orDivider}</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Nút đăng nhập chính thức từ Google (Không qua trung gian firebaseapp.com/__/auth/handler) */}
      <div id={`gsi-btn-${mode}`} className="w-full flex justify-center mb-1 min-h-[44px]" />

      {/* Nút đăng nhập dự phòng */}
      <button
        id={`google-${mode}-btn`}
        type="button"
        onClick={() => handleGoogle(mode)}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 font-semibold text-xs rounded-xl py-2 shadow-xs hover:bg-slate-100 transition-all disabled:opacity-60"
      >
        {googleLoading ? (
          <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-violet-500 rounded-full animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        {mode === 'login' ? `${t.googleLogin} (Cách 2)` : `${t.googleReg} (Cách 2)`}
      </button>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-[#0a0520]">
      {/* Tiled background: nhiều hàng chồng nhau để che đường tím */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0"
            style={{
              top: `${i * 290}px`,
              height: '340px',
              backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fimg11.gif?alt=media&token=dcb79c5d-ad0a-4333-ad1e-fd0147adbe21)',
              backgroundRepeat: 'repeat-x',
              backgroundSize: 'auto 340px',
              backgroundPosition: 'top left',
              zIndex: i,          /* hàng dưới đè lên hàng trên */
            }}
          />
        ))}
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" style={{ zIndex: 20 }} />

      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] animate-pulse" style={{ zIndex: 21 }} />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-violet-500/20 rounded-full blur-[120px] animate-pulse delay-700" style={{ zIndex: 21 }} />


      {/* Language Toggle */}
      <button
        onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
        className="absolute top-5 right-5 z-50 flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm"
      >
        <Globe className="w-3.5 h-3.5" />
        {t.langToggle}
      </button>

      {/* Title */}
      <div className="relative z-30 text-center mb-6">
        <h1 className="font-heading text-4xl sm:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-cyan-300 via-blue-400 to-fuchsia-500 uppercase italic drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] pr-2">
          {t.title}
        </h1>
        <p className="text-cyan-300 font-bold text-xs tracking-[0.3em] uppercase mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          {t.subtitle}
        </p>
      </div>

      {/* Sliding Container */}
      <div className="relative z-30 w-full max-w-200 min-h-135 bg-white rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.5)] overflow-hidden flex">

        {/* ===== SIGN IN FORM (left side) ===== */}
        <div
          className="absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-8 py-10 transition-all duration-700 ease-in-out"
          style={{
            transform: isRegistering ? 'translateX(-100%)' : 'translateX(0)',
            opacity: isRegistering ? 0 : 1,
            pointerEvents: isRegistering ? 'none' : 'auto',
            zIndex: isRegistering ? 1 : 5,
          }}
        >
          <h2 className="text-2xl font-black text-slate-800 mb-1">{t.loginHeader}</h2>
          <p className="text-slate-400 text-xs mb-5 text-center">{t.loginDesc}</p>

          {errorStatus && !isRegistering && (
            <div className="w-full mb-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs text-center font-semibold">
              {errorStatus}
            </div>
          )}

          <form onSubmit={handleLogin} className="w-full space-y-3" noValidate>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {needsGeminiLogin && (
              <div className="space-y-1">
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder={t.geminiPlaceholder}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 transition-all"
                  />
                </div>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-right text-[10px] text-violet-500 hover:text-violet-700 underline"
                >
                  {lang === 'vi' ? 'Hướng dẫn lấy API Key miễn phí' : 'How to get free API Key'}
                </a>
              </div>
            )}

            <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-violet-500 focus:ring-violet-400"
              />
              {t.rememberMe}
            </label>

            <button
              type="submit"
              className="w-full bg-linear-to-r from-violet-600 to-indigo-600 text-white font-black text-sm rounded-xl py-3 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 transition-all tracking-widest mt-1"
            >
              {t.btnLogin}
            </button>
          </form>

          <div className="w-full">{renderGoogleButton('login')}</div>

          {/* Mobile switch */}
          <p className="mt-5 text-xs text-slate-500 md:hidden">
            {t.noAccount}{' '}
            <button onClick={switchToRegister} className="text-violet-600 font-bold hover:underline">
              {t.regHeader}
            </button>
          </p>
        </div>

        {/* ===== SIGN UP FORM (right side, hidden by default) ===== */}
        <div
          className="absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-8 py-6 overflow-y-auto transition-all duration-700 ease-in-out"
          style={{
            transform: isRegistering ? 'translateX(0)' : 'translateX(100%)',
            opacity: isRegistering ? 1 : 0,
            pointerEvents: isRegistering ? 'auto' : 'none',
            zIndex: isRegistering ? 5 : 1,
          }}
        >
          <h2 className="text-2xl font-black text-slate-800 mb-1">{t.regHeader}</h2>
          <p className="text-slate-400 text-xs mb-4 text-center">{t.regDesc}</p>

          {errorStatus && isRegistering && (
            <div className="w-full mb-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs text-center font-semibold">
              {errorStatus}
            </div>
          )}

          <form onSubmit={handleRegister} className="w-full space-y-2.5" noValidate>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t.fullName}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 transition-all"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordReq}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 transition-all"
              />
            </div>

            {needsGeminiReg && (
              <div className="space-y-1">
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder={t.geminiReq}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 transition-all"
                  />
                </div>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-right text-[10px] text-violet-500 hover:text-violet-700 underline"
                >
                  {lang === 'vi' ? 'Hướng dẫn lấy API Key miễn phí' : 'How to get free API Key'}
                </a>
              </div>
            )}

            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="number"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                placeholder={t.birthYear}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 transition-all"
              />
            </div>

            <div className="relative">
              <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 z-10" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 transition-all appearance-none cursor-pointer"
              >
                <option value="Học sinh">{t.roleStudent}</option>
                <option value="Giáo viên">{t.roleTeacher}</option>
                <option value="Phụ huynh">{t.roleParent}</option>
              </select>
            </div>



            <button
              type="submit"
              className="w-full bg-linear-to-r from-violet-600 to-indigo-600 text-white font-black text-sm rounded-xl py-3 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 transition-all tracking-widest mt-1"
            >
              {t.btnReg}
            </button>
          </form>

          <div className="w-full">{renderGoogleButton('register')}</div>

          {/* Mobile switch */}
          <p className="mt-4 text-xs text-slate-500 md:hidden">
            {t.hasAccount}{' '}
            <button onClick={switchToLogin} className="text-violet-600 font-bold hover:underline">
              {t.btnLogin}
            </button>
          </p>
        </div>

        {/* ===== OVERLAY PANEL (sliding violet panel) ===== */}
        <div
          className="hidden md:block absolute top-0 w-1/2 h-full transition-all duration-700 ease-in-out z-10"
          style={{
            left: isRegistering ? '0%' : '50%',
          }}
        >
          {/* Violet gradient background */}
          <div className="absolute inset-0 bg-linear-to-br from-violet-700 via-purple-600 to-indigo-700 rounded-none">
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-white/10" />
            <div className="absolute top-1/3 left-1/4 w-24 h-24 rounded-full bg-white/5" />
          </div>

          {/* Panel content */}
          <div className="relative h-full flex flex-col items-center justify-center px-10 text-white text-center z-10">
            {!isRegistering ? (
              /* Showing on right → prompt to Register */
              <div className="space-y-5 animate-in fade-in duration-500">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fimg17.gif?alt=media&token=1dc73ed3-0e3e-46f9-909a-568a963d118c"
                  alt=""
                  className="w-36 h-36 object-contain mx-auto drop-shadow-[0_8px_24px_rgba(255,255,255,0.3)]"
                />
                <h3 className="text-2xl font-black leading-tight">{t.helloFriend}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{t.helloFriendDesc}</p>
                <button
                  onClick={switchToRegister}
                  className="mt-2 px-10 py-2.5 rounded-full border-2 border-white text-white font-black text-sm tracking-widest hover:bg-white hover:text-violet-700 transition-all duration-300"
                >
                  {t.signUpBtn}
                </button>
              </div>
            ) : (
              /* Showing on left → prompt to Sign In */
              <div className="space-y-5 animate-in fade-in duration-500">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fimg17.gif?alt=media&token=1dc73ed3-0e3e-46f9-909a-568a963d118c"
                  alt=""
                  className="w-36 h-36 object-contain mx-auto drop-shadow-[0_8px_24px_rgba(255,255,255,0.3)]"
                />
                <h3 className="text-2xl font-black leading-tight">{t.welcomeBack}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{t.welcomeBackDesc}</p>
                <button
                  onClick={switchToLogin}
                  className="mt-2 px-10 py-2.5 rounded-full border-2 border-white text-white font-black text-sm tracking-widest hover:bg-white hover:text-violet-700 transition-all duration-300"
                >
                  {t.signInBtn}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Placeholder divs to set min-height on both halves */}
        <div className="w-1/2 min-h-135 invisible" aria-hidden="true" />
        <div className="w-1/2 min-h-135 invisible" aria-hidden="true" />
      </div>
    </div>
  );
}
