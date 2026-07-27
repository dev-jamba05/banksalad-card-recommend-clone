'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import type { AppNotification } from '@/types';

const typeConfig: Record<AppNotification['type'], { bg: string; border: string; text: string; icon: string }> = {
  success: { bg: '#e6f7ef', border: '#00ba71', text: '#00804e', icon: '✓' },
  error:   { bg: '#fff0f0', border: '#ef4444', text: '#dc2626', icon: '✕' },
  info:    { bg: '#eff6ff', border: '#3b82f6', text: '#1d4ed8', icon: 'i' },
  warning: { bg: '#fffbeb', border: '#f59e0b', text: '#b45309', icon: '!' },
};

export default function NotificationContainer() {
  const { state: appState } = useApp();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-full max-w-xs pointer-events-none">
      <AnimatePresence>
        {appState.notifications.map((n) => {
          const cfg = typeConfig[n.type];
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              className="flex items-start gap-3 p-4 rounded-xl shadow-lg pointer-events-auto"
              style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text }}
            >
              <span className="font-bold text-sm flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: cfg.border, color: '#fff' }}>
                {cfg.icon}
              </span>
              <p className="text-sm flex-1 leading-snug">{n.message}</p>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
