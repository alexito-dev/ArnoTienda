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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Catálogo Digital
          </h2>
          <p className="text-xs text-zinc-400 font-medium mt-1">
            {totalProductsCount} productos con entrega inmediata y garantía oficial
          </p>
        </div>

        {/* Minimalist Sorting Dropdown */}
        <div className="flex items-center space-x-2 bg-zinc-900/90 border border-zinc-800/80 px-4 py-2 rounded-full shadow-sm">
          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs font-semibold text-zinc-400">Ordenar:</span>
          <select
            value={selectedSort}
            onChange={(e) => onSelectSort(e.target.value as SortOption)}
            className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
          >
            <option value="featured" className="bg-zinc-900 text-white">Destacados</option>
            <option value="bestsellers" className="bg-zinc-900 text-white">Más Vendidos</option>
            <option value="discount" className="bg-zinc-900 text-white">Mayor Descuento %</option>
            <option value="price-asc" className="bg-zinc-900 text-white">Precio: Menor a Mayor</option>
            <option value="price-desc" className="bg-zinc-900 text-white">Precio: Mayor a Menor</option>
            <option value="rating" className="bg-zinc-900 text-white">Mejor Calificados</option>
          </select>
        </div>
      </div>

      {/* Category Pills Bar (Minimalist Monochrome / High-Contrast) */}
      <div className="flex items-center space-x-2.5 overflow-x-auto pb-1 scrollbar-none pt-2">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-white text-zinc-950 shadow-md scale-105'
                  : 'bg-zinc-900/90 text-zinc-400 hover:text-white border border-zinc-800/80 hover:border-zinc-700'
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
