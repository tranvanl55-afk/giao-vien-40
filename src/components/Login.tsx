import React, { useState } from 'react';
import { User, Calendar, Briefcase, Key, Mail, Lock, Eye, EyeOff, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const translations = {
  vi: {
    title: "GIÁO VIÊN 4.0",
    subtitle: "Trạm Vũ trụ Tri thức",
    loginHeader: "Đăng nhập trạm",
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
    btnLogin: "🚀 Đăng nhập ngay",
    btnReg: "✨ Đăng ký tham gia",
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
    langToggle: "English"
  },
  en: {
    title: "TEACHER 4.0",
    subtitle: "Knowledge Space Station",
    loginHeader: "Station Login",
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
    btnLogin: "🚀 Login Now",
    btnReg: "✨ Register to Join",
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
    langToggle: "Tiếng Việt"
  }
};

export function Login() {
  const { loginWithEmail, registerWithEmail } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Initialize lang from cookie if present
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
    // Reload to apply translation
    window.location.reload();
  };

  const t = translations[lang];

  // Auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");

  // Registration form state
  const [fullName, setFullName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [role, setRole] = useState("Học sinh");
  const [referralCode, setReferralCode] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus("");
    
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
      console.error('Lỗi Firebase chi tiết:', error.code);
      setErrorStatus(t.loginFail);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (referralCode !== "29010912") {
      setErrorStatus(t.invalidRef);
      return;
    }

    if (email.trim() !== "tranvanl55@gmail.com" && !geminiApiKey.trim()) {
      setErrorStatus(t.geminiReqReg);
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

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 w-full animate-in fade-in duration-500 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(https://img.upanhnhanh.com/2bded7feeacd8904b3be05666ecd7c3e)' }}
    >
      {/* Background overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/30 -z-10"></div>

      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-120 h-120 bg-cyan-400/40 rounded-full blur-[120px] animate-pulse -z-10"></div>
      <div className="absolute bottom-1/4 -right-20 w-120 h-120 bg-fuchsia-500/40 rounded-full blur-[120px] animate-pulse delay-700 -z-10"></div>
      
      {/* Title section */}
      <div className="text-center w-full flex flex-col items-center mb-4 md:mb-6 px-2 relative z-10 shrink-0">
        <div className="mb-1 md:mb-2 max-w-full">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-cyan-300 via-blue-400 to-fuchsia-500 uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] whitespace-nowrap italic py-1 md:py-2 pr-2">
            {t.title}
          </h1>
        </div>
        <p className="text-cyan-300 font-bold text-xs sm:text-sm md:text-base tracking-[0.2em] md:tracking-[0.3em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">{t.subtitle}</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full max-w-[900px] relative z-10 px-4">
        {/* Left side: Login Form */}
        <div className="w-full max-w-[400px] shrink-0 space-y-4 md:space-y-6">
          <div className="bg-white/3 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-2xl rounded-4xl p-6 md:p-8 transition-all duration-300 flex flex-col items-center border-t-white/20 relative">
          
          {/* Language Toggle */}
          <button 
            onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
            className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg border border-white/10"
          >
            <Globe className="w-3.5 h-3.5" />
            {t.langToggle}
          </button>

          {errorStatus && (
            <div className="w-full mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center font-bold mt-4">
              {errorStatus}
            </div>
          )}

          {!isRegistering ? (
             <form onSubmit={handleLogin} className={`w-full animate-in fade-in duration-300 space-y-4 ${errorStatus ? '' : 'mt-4'}`}>
                <div className="mb-4 text-center">
                  <h2 className="text-xl font-bold text-white mb-1">{t.loginHeader}</h2>
                  <p className="text-slate-400 text-xs text-center">{t.loginDesc}</p>
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 md:w-5 md:h-5" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-10 md:pl-12 pr-4 text-sm md:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 md:w-5 md:h-5" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-10 md:pl-12 pr-12 text-sm md:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {email.trim() && email.trim() !== "tranvanl55@gmail.com" && (
                  <div className="relative animate-in slide-in-from-top-2 duration-300">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 md:w-5 md:h-5" />
                    <input 
                      type="password" 
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      placeholder={t.geminiPlaceholder}
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-10 md:pl-12 pr-4 text-sm md:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium"
                      required
                    />
                    <div className="text-right mt-1.5">
                      <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[10px] md:text-xs text-cyan-400 hover:text-cyan-300 underline font-medium">
                        {lang === 'vi' ? 'Hướng dẫn lấy API Key miễn phí' : 'How to get free API Key'}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 text-slate-300 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700/50 bg-slate-900/50 text-cyan-500 focus:ring-cyan-500/50" 
                    />
                    <span className="group-hover:text-cyan-400 transition-colors">{t.rememberMe}</span>
                  </label>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-linear-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl py-3 px-4 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {t.btnLogin}
                </button>
             </form>
          ) : (
            <form onSubmit={handleRegister} className={`space-y-4 w-full animate-in fade-in duration-300 ${errorStatus ? '' : 'mt-4'}`}>
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">{t.regHeader}</h2>
                <p className="text-slate-400 text-sm">{t.regDesc}</p>
              </div>

              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.fullName}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordReq}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium"
                  required
                />
              </div>

              {email.trim() && email.trim() !== "tranvanl55@gmail.com" && (
                <div className="relative animate-in slide-in-from-top-2 duration-300">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="password" 
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder={t.geminiReq}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium"
                    required
                  />
                  <div className="text-right mt-1.5">
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[10px] md:text-xs text-cyan-400 hover:text-cyan-300 underline font-medium">
                      {lang === 'vi' ? 'Hướng dẫn lấy API Key miễn phí' : 'How to get free API Key'}
                    </a>
                  </div>
                </div>
              )}

              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="number" 
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  placeholder={t.birthYear}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium"
                  required
                />
              </div>

              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-4 text-slate-100 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium appearance-none cursor-pointer"
                  required
                >
                  <option value="Học sinh" className="bg-slate-800">{t.roleStudent}</option>
                  <option value="Giáo viên" className="bg-slate-800">{t.roleTeacher}</option>
                  <option value="Phụ huynh" className="bg-slate-800">{t.roleParent}</option>
                </select>
              </div>

              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder={t.refCode}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-linear-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-2xl p-3.5 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all outline-none focus:ring-2 focus:ring-indigo-500 mt-2"
              >
                {t.btnReg}
              </button>
            </form>
          )}

          <div className="mt-8 text-center text-slate-400 text-sm">
            {!isRegistering ? (
              <>{t.noAccount} <button onClick={() => { setIsRegistering(true); setErrorStatus(""); }} className="text-cyan-400 font-bold hover:underline">{t.regHeader}</button></>
            ) : (
              <>{t.hasAccount} <button onClick={() => { setIsRegistering(false); setErrorStatus(""); }} className="text-cyan-400 font-bold hover:underline">{t.btnLogin.replace('🚀', '').trim()}</button></>
            )}
          </div>
        </div>
        </div>

        {/* Right side: Illustration Image */}
        <div className="hidden md:flex flex-1 justify-center items-center w-full max-w-[450px] p-6">
          <img 
            src="https://img.upanhnhanh.com/00afa9d589729f2306a7bef9535464af" 
            alt="Giáo viên 4.0 illustration" 
            className="w-full h-auto max-h-[80vh] object-contain drop-shadow-[0_0_30px_rgba(34,211,238,0.3)] animate-in zoom-in duration-700 hover:scale-105 transition-transform" 
          />
        </div>
      </div>
    </div>
  );
}
