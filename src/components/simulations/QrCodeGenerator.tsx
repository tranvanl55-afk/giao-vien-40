import React, { useState, useRef, useCallback } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { ArrowLeft, X, Download, QrCode, Sliders, Palette } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export function QrCodeGenerator({ onBack }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [fgColor, setFgColor] = useState('#1a1a2e');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(240);
  const qrRef = useRef<HTMLDivElement>(null);

  const hasContent = inputValue.trim().length > 0;

  const handleDownload = useCallback(() => {
    if (!hasContent) return;
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    // Create a padded, high-res version for download
    const padding = 32;
    const exportSize = size + padding * 2;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = exportSize;
    exportCanvas.height = exportSize;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, exportSize, exportSize);
    ctx.drawImage(canvas, padding, padding, size, size);

    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  }, [hasContent, size, bgColor]);

  return (
    <div
      className="qr-root"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fff8f0 0%, #fff3e0 50%, #ffecd2 100%)',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Header ── */}
      <header style={{
        background: 'linear-gradient(90deg, #f78c00 0%, #ff6b35 100%)',
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        boxShadow: '0 4px 20px rgba(247,140,0,0.35)',
        flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: 10,
            padding: '8px 10px',
            cursor: 'pointer',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.35)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
        >
          <ArrowLeft size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <QrCode size={26} color="#fff" />
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, lineHeight: 1.2 }}>
              Tạo Mã QR
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              Chuyển URL / văn bản thành mã QR tức thì
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '32px 16px 48px',
        gap: 28,
        flexWrap: 'wrap',
      }}>

        {/* ── Left Panel: Controls ── */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: 28,
          boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
          width: '100%',
          maxWidth: 420,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}>

          {/* Input */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 8, letterSpacing: '0.03em' }}>
              🔗 Nhập URL hoặc văn bản
            </label>
            <div style={{ position: 'relative' }}>
              <textarea
                id="qr-input"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="https://example.com hoặc bất kỳ nội dung nào..."
                rows={4}
                style={{
                  width: '100%',
                  borderRadius: 12,
                  border: `2px solid ${hasContent ? '#f78c00' : '#e5e7eb'}`,
                  padding: '12px 44px 12px 14px',
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: '#111827',
                  outline: 'none',
                  resize: 'vertical',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#f78c00')}
                onBlur={e => (e.currentTarget.style.borderColor = hasContent ? '#f78c00' : '#e5e7eb')}
              />
              {inputValue && (
                <button
                  onClick={() => setInputValue('')}
                  title="Xóa"
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: 6,
                    padding: '4px 6px',
                    cursor: 'pointer',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div style={{ marginTop: 6, fontSize: 12, color: '#9ca3af' }}>
              {inputValue.length} ký tự
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #f0f0f0, transparent)' }} />

          {/* Color options */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, fontWeight: 600, fontSize: 13, color: '#374151' }}>
              <Palette size={15} />
              Màu sắc
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              <label style={{ flex: 1, cursor: 'pointer' }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Màu mã QR</div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 10,
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: fgColor,
                    border: '2px solid #e5e7eb',
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 13, fontFamily: 'monospace', color: '#374151' }}>{fgColor}</span>
                  <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)}
                    style={{ opacity: 0, position: 'absolute', width: 0, height: 0 }} />
                </div>
                <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)}
                  style={{ display: 'block', width: '100%', height: 32, border: 'none', borderRadius: 8, cursor: 'pointer', marginTop: 6 }} />
              </label>

              <label style={{ flex: 1, cursor: 'pointer' }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Màu nền</div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 10,
                  cursor: 'pointer',
                }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: bgColor,
                    border: '2px solid #e5e7eb',
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 13, fontFamily: 'monospace', color: '#374151' }}>{bgColor}</span>
                </div>
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                  style={{ display: 'block', width: '100%', height: 32, border: 'none', borderRadius: 8, cursor: 'pointer', marginTop: 6 }} />
              </label>
            </div>
          </div>

          {/* Size Slider */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13, color: '#374151' }}>
                <Sliders size={15} />
                Kích thước
              </div>
              <span style={{
                background: 'linear-gradient(90deg, #f78c00, #ff6b35)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 12,
                padding: '2px 10px',
                borderRadius: 20,
              }}>{size}px</span>
            </div>
            <input
              type="range"
              min={150}
              max={350}
              value={size}
              onChange={e => setSize(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#f78c00',
                cursor: 'pointer',
                height: 6,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
              <span>150px</span>
              <span>350px</span>
            </div>
          </div>

          {/* Download Button */}
          <button
            id="qr-download-btn"
            onClick={handleDownload}
            disabled={!hasContent}
            style={{
              background: hasContent
                ? 'linear-gradient(90deg, #f78c00 0%, #ff6b35 100%)'
                : '#e5e7eb',
              color: hasContent ? '#fff' : '#9ca3af',
              border: 'none',
              borderRadius: 12,
              padding: '14px 20px',
              fontSize: 15,
              fontWeight: 700,
              cursor: hasContent ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s',
              boxShadow: hasContent ? '0 4px 20px rgba(247,140,0,0.4)' : 'none',
              transform: 'translateY(0)',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => { if (hasContent) e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Download size={18} />
            Tải mã QR (PNG)
          </button>
        </div>

        {/* ── Right Panel: QR Preview ── */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: 32,
          boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          minWidth: 300,
          minHeight: 360,
        }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#374151', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Xem trước
          </div>

          <div
            ref={qrRef}
            style={{
              padding: 20,
              background: bgColor,
              borderRadius: 16,
              boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s',
              border: '1px solid #f0f0f0',
            }}
          >
            {hasContent ? (
              <QRCodeCanvas
                value={inputValue}
                size={size}
                fgColor={fgColor}
                bgColor={bgColor}
                level="H"
                marginSize={0}
              />
            ) : (
              <div style={{
                width: size,
                height: size,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                color: '#d1d5db',
              }}>
                <QrCode size={64} strokeWidth={1} />
                <div style={{ fontSize: 13, textAlign: 'center', color: '#9ca3af', maxWidth: 180 }}>
                  Nhập URL hoặc văn bản để tạo mã QR
                </div>
              </div>
            )}
          </div>

          {hasContent && (
            <div style={{
              fontSize: 12,
              color: '#9ca3af',
              textAlign: 'center',
              maxWidth: 260,
              wordBreak: 'break-all',
              padding: '8px 12px',
              background: '#f9fafb',
              borderRadius: 8,
              border: '1px solid #f0f0f0',
            }}>
              {inputValue.length > 60 ? inputValue.slice(0, 60) + '…' : inputValue}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
