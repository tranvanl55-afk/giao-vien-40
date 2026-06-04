import React from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Callback để quay lại trang trước khi gặp lỗi */
  onBack?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * ErrorBoundary bắt lỗi runtime từ các simulation/game lazy-loaded
 * Hiển thị màn hình phục hồi đẹp thay vì crash toàn bộ app
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    // Log lỗi để debug — có thể tích hợp Sentry sau
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50 p-6">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-500/10 blur-[120px] rounded-full" />
          </div>

          <div className="relative max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 shadow-2xl text-center">
            {/* Icon */}
            <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-black text-white mb-2 font-heading">
              Ối! Có lỗi xảy ra
            </h2>
            <p className="text-slate-400 text-sm font-medium mb-6 leading-relaxed">
              Một phần của ứng dụng gặp sự cố không mong đợi. Hãy thử tải lại hoặc quay về trang chủ.
            </p>

            {/* Error detail (chỉ hiện trong dev) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-left">
                <p className="text-red-400 text-xs font-mono font-bold mb-1">
                  {this.state.error.name}
                </p>
                <p className="text-slate-400 text-xs font-mono leading-relaxed break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {this.props.onBack && (
                <button
                  onClick={() => {
                    this.handleReset();
                    this.props.onBack?.();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white rounded-xl font-bold text-sm transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </button>
              )}
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-500/20"
              >
                <RefreshCw className="w-4 h-4" />
                Thử lại
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
