import React from 'react';
import { Category, CategoryId, SortOption } from '../types/store';
import { ArrowUpDown, Flame, Tag, Star, DollarSign } from 'lucide-react';

interface Props {
  categories: Category[];
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
  totalProductsCount: number;
}

export const CategoryFilter: React.FC<Props> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedSort,
  onSelectSort,
  totalProductsCount,
}) => {
  return (
    <div className="mb-6 space-y-4 select-none">
      {/* Title & Sorting Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[var(--color-text)] tracking-tight">
            Catálogo de Claves & Licencias Digitales
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] font-medium mt-0.5">
            {totalProductsCount} ofertas digitales verificadas disponibles
          </p>
        </div>

        {/* Eneba Sorting Selector Dropdown */}
        <div className="flex items-center space-x-2 bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-1.5 rounded-2xl shadow-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#847CB8]" />
          <span className="text-xs font-bold text-[var(--color-text-muted)]">Ordenar por:</span>
          <select
            value={selectedSort}
            onChange={(e) => onSelectSort(e.target.value as SortOption)}
            className="bg-transparent text-xs font-bold text-[var(--color-text)] focus:outline-none cursor-pointer"
          >
            <option value="featured">Destacados</option>
            <option value="bestsellers">Más Vendidos</option>
            <option value="discount">Mayor Descuento %</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="rating">Mejor Calificados</option>
          </select>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-[#847CB8] text-white border-[#847CB8] shadow-xs'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
