import { useState, useEffect } from 'react';
import { SubCategory } from '../data';

const HOT_TOOLS_KEY = 'gv40_hot_tools';

export interface ToolUsageRecord {
  subId: string;
  catId: string;
  subTitle: string;
  logoUrl?: string;
  contentUrl?: string;
  count: number;
  lastUsed: number;
}

export function useHotTools() {
  const [hotTools, setHotTools] = useState<ToolUsageRecord[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HOT_TOOLS_KEY);
      if (stored && JSON.parse(stored).length > 0) {
        setHotTools(JSON.parse(stored));
      } else {
        const defaultHotTools: ToolUsageRecord[] = [
          {
            subId: 'phieu-bai-hoc',
            catId: 'on-tap',
            subTitle: 'Tạo Phiếu Bài Học (Sketchnote)',
            logoUrl: 'https://img.icons8.com/fluency/96/notebook.png',
            count: 24,
            lastUsed: Date.now() - 3600000 * 2
          },
          {
            subId: 'mindmap-app',
            catId: 'on-tap',
            subTitle: 'Tạo Sơ Đồ Tư Duy Bằng AI',
            logoUrl: 'https://img.icons8.com/fluency/96/mind-map.png',
            count: 18,
            lastUsed: Date.now() - 3600000 * 4
          },
          {
            subId: 'ai-chatgpt',
            catId: 'ai-tool',
            subTitle: 'ChatGPT',
            logoUrl: 'https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128',
            contentUrl: 'https://chatgpt.com',
            count: 15,
            lastUsed: Date.now() - 3600000 * 6
          },
          {
            subId: 'ai-gemini',
            catId: 'ai-tool',
            subTitle: 'Google Gemini',
            logoUrl: 'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128',
            contentUrl: 'https://gemini.google.com',
            count: 12,
            lastUsed: Date.now() - 3600000 * 8
          },
          {
            subId: 'ai-claude',
            catId: 'ai-tool',
            subTitle: 'Claude AI',
            logoUrl: 'https://www.google.com/s2/favicons?domain=claude.ai&sz=128',
            contentUrl: 'https://claude.ai',
            count: 10,
            lastUsed: Date.now() - 3600000 * 10
          }
        ];
        setHotTools(defaultHotTools);
        localStorage.setItem(HOT_TOOLS_KEY, JSON.stringify(defaultHotTools));
      }
    } catch {}
  }, []);

  const recordToolUsage = (sub: SubCategory, catId: string) => {
    setHotTools(prev => {
      const existing = prev.find(t => t.subId === sub.id);
      let updated: ToolUsageRecord[];
      if (existing) {
        updated = prev.map(t => t.subId === sub.id
          ? { ...t, count: t.count + 1, lastUsed: Date.now() }
          : t
        );
      } else {
        updated = [...prev, {
          subId: sub.id,
          catId,
          subTitle: sub.title,
          logoUrl: sub.logoUrl,
          contentUrl: sub.contentUrl,
          count: 1,
          lastUsed: Date.now()
        }];
      }
      localStorage.setItem(HOT_TOOLS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { hotTools, recordToolUsage };
}
