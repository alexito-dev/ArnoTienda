import React, { useState } from 'react';
import { ChevronDown, Check, X, Shield, Sparkles } from 'lucide-react';

export const PlanComparisonTable: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-14 mb-10 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md overflow-hidden select-none">
      {/* Accordion Trigger Banner */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full p-6 flex items-center justify-between hover:bg-[var(--color-surface-hover)] transition cursor-pointer text-left"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#847CB8]/15 text-[#847CB8] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[var(--color-text)]">
              Tabla Comparativa Completa de Planes
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] font-medium">
              Compara las características, modelos integrados y límites de cada suscripción
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-[#847CB8]">
          <span>{open ? 'Ocultar comparativa' : 'Ver comparativa'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Expanded Table */}
      {open && (
        <div className="p-6 border-t border-[var(--color-border)] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-text-muted)] uppercase tracking-wider font-extrabold text-[10px]">
                <th className="py-3 px-4">Característica</th>
                <th className="py-3 px-4 text-center">Copilot ($9)</th>
                <th className="py-3 px-4 text-center">Vision ($19)</th>
                <th className="py-3 px-4 text-center text-[#847CB8]">Pro ($29) ★</th>
                <th className="py-3 px-4 text-center">Teams ($79)</th>
                <th className="py-3 px-4 text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]/50 text-[var(--color-text)] font-medium">
              <tr>
                <td className="py-3 px-4 font-bold">Modelos de IA Incluidos</td>
                <td className="py-3 px-4 text-center">Claude 4.6 & GPT-4o</td>
                <td className="py-3 px-4 text-center">Claude Vision & DALL-E 3</td>
                <td className="py-3 px-4 text-center font-bold text-[#847CB8]">Todos + Claude Opus 5</td>
                <td className="py-3 px-4 text-center">Todos los modelos</td>
                <td className="py-3 px-4 text-center">Instancias Dedicadas</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">Integración en VS Code & JetBrains</td>
                <td className="py-3 px-4 text-center text-emerald-500 font-bold">✓ Incluido</td>
                <td className="py-3 px-4 text-center text-zinc-400">Sólo API</td>
                <td className="py-3 px-4 text-center text-emerald-500 font-bold">✓ Incluido</td>
                <td className="py-3 px-4 text-center text-emerald-500 font-bold">✓ Incluido</td>
                <td className="py-3 px-4 text-center text-emerald-500 font-bold">✓ Personalizable</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">Análisis de Imágenes & OCR</td>
                <td className="py-3 px-4 text-center text-zinc-400">—</td>
                <td className="py-3 px-4 text-center text-emerald-500 font-bold">✓ Ilimitado</td>
                <td className="py-3 px-4 text-center text-emerald-500 font-bold">✓ Incluido</td>
                <td className="py-3 px-4 text-center text-emerald-500 font-bold">✓ Incluido</td>
                <td className="py-3 px-4 text-center text-emerald-500 font-bold">✓ Incluido</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">Búsqueda Web en Vivo</td>
                <td className="py-3 px-4 text-center text-zinc-400">—</td>
                <td className="py-3 px-4 text-center text-emerald-500 font-bold">✓ Incluido</td>
                <td className="py-3 px-4 text-center text-emerald-500 font-bold">✓ Incluido</td>
                <td className="py-3 px-4 text-center text-emerald-500 font-bold">✓ Incluido</td>
                <td className="py-3 px-4 text-center text-emerald-500 font-bold">✓ Incluido</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">Gestión de Equipos & SSO</td>
                <td className="py-3 px-4 text-center text-zinc-400">—</td>
                <td className="py-3 px-4 text-center text-zinc-400">—</td>
                <td className="py-3 px-4 text-center text-zinc-400">—</td>
                <td className="py-3 px-4 text-center text-emerald-500 font-bold">✓ Hasta 25 usuarios</td>
                <td className="py-3 px-4 text-center text-emerald-500 font-bold">✓ Usuarios ilimitados</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">Garantía SLA de Uptime</td>
                <td className="py-3 px-4 text-center">99.9%</td>
                <td className="py-3 px-4 text-center">99.9%</td>
                <td className="py-3 px-4 text-center font-bold text-[#847CB8]">99.95%</td>
                <td className="py-3 px-4 text-center">99.95%</td>
                <td className="py-3 px-4 text-center font-bold text-emerald-500">99.99% Dedicado</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
