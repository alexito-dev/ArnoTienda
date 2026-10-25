import React, { useState } from 'react';
import { HelpCircle, MessageSquare, FileText, X, ChevronRight, Shield } from 'lucide-react';
import { Tooltip } from './Tooltip';

export const HelpFloatingButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <Tooltip content="Centro de Ayuda y Soporte" position="left">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-11 h-11 rounded-full bg-[#1E1C21] dark:bg-[#E9E9F5] text-white dark:text-[#1E1C21] shadow-2xl flex items-center justify-center transition cursor-pointer hover:scale-105"
        >
          {open ? <X className="w-5 h-5" /> : <span className="font-bold text-base font-mono">?</span>}
        </button>
      </Tooltip>

      {/* Popover Help Panel */}
      {open && (
        <div className="absolute bottom-14 right-0 w-72 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-150 select-none">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-[var(--color-border)]">
            <HelpCircle className="w-5 h-5 text-[#847CB8]" />
            <div>
              <h4 className="text-xs font-extrabold text-[var(--color-text)]">Soporte ArnoTienda</h4>
              <p className="text-[10px] text-[var(--color-text-muted)]">Asistencia y activación de licencias 24/7</p>
            </div>
          </div>

          <div className="py-2 space-y-1 text-xs">
            <button
              onClick={() => {
                alert('Atención al cliente en línea: Soporte disponible en chat@arno.services');
                setOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--color-surface-hover)] transition cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <MessageSquare className="w-4 h-4 text-[#847CB8]" />
                <span className="font-medium text-[var(--color-text)]">Chat con un especialista</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            </button>

            <button
              onClick={() => {
                alert('Documentación de API y licencias disponible en https://ia.arno.services/docs');
                setOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--color-surface-hover)] transition cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-[var(--color-text-muted)]" />
                <span className="font-medium text-[var(--color-text)]">Guía de activación</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
