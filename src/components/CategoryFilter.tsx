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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E9E9F5] tracking-tight">
            Catálogo Digital
          </h2>
          <p className="text-xs text-[#9A93AC] font-medium mt-1">
            {totalProductsCount} productos con entrega inmediata y garantía oficial
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-2 bg-[#1E1C21] border border-white/10 px-4 py-2 rounded-full shadow-sm">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#847CB8]" />
          <span className="text-xs font-semibold text-[#9A93AC]">Ordenar:</span>
          <select
            value={selectedSort}
            onChange={(e) => onSelectSort(e.target.value as SortOption)}
            className="bg-transparent text-xs font-bold text-[#E9E9F5] focus:outline-none cursor-pointer"
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

      {/* Category Pills Bar in Arno Signature Purple */}
      <div className="flex items-center space-x-2.5 overflow-x-auto pb-1 scrollbar-none pt-2">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-[#847CB8] text-white border-[#847CB8] shadow-md shadow-[#847CB8]/25 scale-105'
                  : 'bg-[#1E1C21] text-[#9A93AC] hover:text-[#E9E9F5] border-white/10 hover:border-white/20'
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
