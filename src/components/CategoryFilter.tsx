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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5FB] tracking-tight">
            Catálogo Digital
          </h2>
          <p className="text-xs text-[#B6AFCA] font-medium mt-1">
            {totalProductsCount} productos con entrega inmediata y garantía oficial
          </p>
        </div>

        {/* Sorting Dropdown with explicit accessible label */}
        <div className="flex items-center space-x-2 bg-[#1E1C21] border border-white/10 px-4 py-2 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-[#746CAE]">
          <label htmlFor="sort-catalog-select" className="flex items-center space-x-1.5 text-xs font-semibold text-[#B6AFCA] cursor-pointer">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#847CB8]" aria-hidden="true" focusable="false" />
            <span>Ordenar:</span>
          </label>
          <select
            id="sort-catalog-select"
            aria-label="Criterio de ordenación del catálogo"
            value={selectedSort}
            onChange={(e) => onSelectSort(e.target.value as SortOption)}
            className="bg-transparent text-xs font-bold text-[#F5F5FB] focus:outline-none cursor-pointer"
          >
            <option value="featured" className="bg-[#1E1C21] text-white">Destacados</option>
            <option value="bestsellers" className="bg-[#1E1C21] text-white">Más Vendidos</option>
            <option value="discount" className="bg-[#1E1C21] text-white">Mayor Descuento %</option>
            <option value="price-asc" className="bg-[#1E1C21] text-white">Precio: Menor a Mayor</option>
            <option value="price-desc" className="bg-[#1E1C21] text-white">Precio: Mayor a Menor</option>
            <option value="rating" className="bg-[#1E1C21] text-white">Mejor Calificados</option>
          </select>
        </div>
      </div>

      {/* Category Pills Navigation (Accessible role="tablist") */}
      <nav aria-label="Filtro por categorías de catálogo" className="flex items-center space-x-2.5 overflow-x-auto pb-1 scrollbar-none pt-2">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#746CAE] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171519] ${
                isActive
                  ? 'bg-[#746CAE] text-white border-[#746CAE] shadow-md shadow-[#746CAE]/25 scale-105'
                  : 'bg-[#1E1C21] text-[#B6AFCA] hover:text-[#F5F5FB] border-white/10 hover:border-white/20'
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
