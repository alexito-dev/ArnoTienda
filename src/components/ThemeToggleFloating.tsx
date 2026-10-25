import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface Props {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const ThemeToggleFloating: React.FC<Props> = ({
  theme,
  onToggleTheme,
}) => {
  return (
    <div className="fixed bottom-5 right-18 z-40">
      <Tooltip content={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'} position="left">
        <button
          onClick={onToggleTheme}
          className="p-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition cursor-pointer flex items-center justify-center"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-400" />
          )}
        </button>
      </Tooltip>
    </div>
  );
};
