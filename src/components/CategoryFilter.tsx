import React from 'react';
import { Category, CategoryId, SortOption } from '../types/store';
import { ArrowUpDown } from 'lucide-react';

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
    <div className="mb-8 space-y-4 select-none">
      {/* Title & Sorting Controls Bar */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1C21] tracking-tight">
            Catálogo Digital
          </h2>
          <p className="text-xs text-[#726C82] font-medium mt-1">
            {totalProductsCount} productos con entrega inmediata y garantía oficial
          </p>
        </div>

        {/* Sorting Dropdown with accessible label */}
        <div className="flex items-center space-x-2 bg-white border border-[#E9E9F5] px-4 py-2 rounded-full shadow-xs focus-within:ring-2 focus-within:ring-[#847CB8]/30">
          <label htmlFor="sort-catalog-select" className="flex items-center space-x-1.5 text-xs font-semibold text-[#726C82] cursor-pointer">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#847CB8]" aria-hidden="true" focusable="false" />
            <span>Ordenar:</span>
          </label>
          <select
            id="sort-catalog-select"
            aria-label="Criterio de ordenación del catálogo"
            value={selectedSort}
            onChange={(e) => onSelectSort(e.target.value as SortOption)}
            className="bg-transparent text-xs font-bold text-[#1E1C21] focus:outline-none cursor-pointer"
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

      {/* Category Pills Navigation in Arno Signature Lila */}
      <nav aria-label="Filtro por categorías de catálogo" className="flex items-center space-x-2.5 overflow-x-auto pb-1 scrollbar-none pt-2">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#847CB8] focus-visible:ring-offset-2 ${
                isActive
                  ? 'bg-[#847CB8] text-white border-[#847CB8] shadow-md shadow-[#847CB8]/25 scale-105'
                  : 'bg-white text-[#726C82] hover:text-[#1E1C21] border-[#E9E9F5] hover:border-[#847CB8]/50 shadow-xs'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
