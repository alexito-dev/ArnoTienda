import React, { useState } from 'react';
import { MessageCircle, X, Send, ShieldCheck, HelpCircle } from 'lucide-react';

export const WhatsAppSupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userQuery, setUserQuery] = useState('');

  const handleOpenWhatsApp = () => {
    const defaultText = userQuery.trim()
      ? `Hola, necesito soporte con ArnoTienda: ${encodeURIComponent(userQuery.trim())}`
      : 'Hola, me gustaría consultar sobre una licencia o suscripción digital en ArnoTienda.';
    
    const whatsappUrl = `https://wa.me/51900000000?text=${defaultText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setUserQuery('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      {/* Expanded Quick Chat Box */}
      {isOpen && (
        <div className="mb-3 w-80 rounded-3xl bg-[#121214] border border-white/15 text-white shadow-2xl p-5 space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-xs block">Soporte WhatsApp ArnoAI</span>
                <span className="text-[10px] text-emerald-400 font-bold block">En línea • Respuesta instantánea</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-300 text-[11px] leading-relaxed">
              ¿Tienes alguna duda sobre la activación o métodos de pago? Escríbenos directamente por WhatsApp.
            </div>

            <textarea
              rows={2}
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Escribe tu consulta aquí..."
              className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-400 resize-none font-medium"
            />
          </div>

          <button
            onClick={handleOpenWhatsApp}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs transition cursor-pointer flex items-center justify-center space-x-2 shadow-md"
          >
            <Send className="w-4 h-4" />
            <span>Iniciar Chat en WhatsApp</span>
          </button>
        </div>
      )}

      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl transition-transform hover:scale-105 cursor-pointer flex items-center space-x-2 font-black text-xs border border-white/20"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline">Soporte 24/7</span>
        </button>
      )}
    </div>
  );
};
