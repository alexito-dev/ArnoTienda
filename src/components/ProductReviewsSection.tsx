import React from 'react';
import { Star, CheckCircle2, ThumbsUp, ShieldCheck } from 'lucide-react';

interface Review {
  id: string;
  userName: string;
  country: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

const REVIEWS_DATA: Review[] = [
  {
    id: 'rev-1',
    userName: 'Carlos M.',
    country: 'Perú',
    rating: 5,
    date: 'Hace 2 días',
    comment: 'Activación instantánea. Recibí mi clave y en menos de 2 minutos ya tenía el plan funcionando. Excelente servicio.',
    verified: true,
  },
  {
    id: 'rev-2',
    userName: 'Alejandro R.',
    country: 'México',
    rating: 5,
    date: 'Hace 5 días',
    comment: 'Muy confiable. Llevo 3 meses usando la cuenta y nunca ha tenido caídas. Recomendado al 100%.',
    verified: true,
  },
  {
    id: 'rev-3',
    userName: 'Mariana S.',
    country: 'Colombia',
    rating: 5,
    date: 'Hace 1 semana',
    comment: 'El soporte por WhatsApp me ayudó al instante con la configuración en mi celular. Muy atentos.',
    verified: true,
  },
  {
    id: 'rev-4',
    userName: 'David P.',
    country: 'Perú',
    rating: 5,
    date: 'Hace 2 semanas',
    comment: 'Buen precio y garantía real. Tuve una duda y me la resolvieron de inmediato.',
    verified: true,
  },
];

export const ProductReviewsSection: React.FC = () => {
  return (
    <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6 shadow-xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
        <div>
          <h3 className="text-base font-black text-[var(--color-text)] flex items-center space-x-2">
            <span>Opiniones Verificadas de Compradores</span>
          </h3>
          <span className="text-xs text-[var(--color-text-muted)] font-semibold">
            Calificación Promedio: 4.9 / 5.0 basada en más de 3,400 ventas
          </span>
        </div>

        <div className="flex items-center space-x-1 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REVIEWS_DATA.map((review) => (
          <div
            key={review.id}
            className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-[var(--color-text)]">{review.userName}</span>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-[var(--color-text-muted)]">
                  {review.country}
                </span>
              </div>
              <span className="text-[10px] text-[var(--color-text-muted)]">{review.date}</span>
            </div>

            <div className="flex items-center space-x-1 text-amber-400">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
              {review.verified && (
                <span className="ml-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Compra Verificada</span>
                </span>
              )}
            </div>

            <p className="text-[11px] text-[var(--color-text)] font-medium leading-relaxed">
              "{review.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
