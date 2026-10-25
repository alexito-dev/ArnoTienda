import React from 'react';
import { CategoryId } from '../types/store';
import { Code, Bot, Sparkles, Percent, Package, Key, Users } from 'lucide-react';

interface Props {
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
}

export const G2ACategoryThumbnails: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const items = [
    { id: 'ide', label: 'VS Code & IDE', icon: Code, color: 'bg-[#847CB8]' },
    { id: 'multimodal', label: 'Claude 4.6 & Visión', icon: Bot, color: 'bg-[#FF66C4]' },
    { id: 'bundle', label: 'Gemini 2.0 Pro', icon: Sparkles, color: 'bg-[#5C5399]' },
    { id: 'todos', label: '-80% Ofertas Flash', icon: Percent, color: 'bg-red-600' },
    { id: 'bundle', label: 'Master Bundles', icon: Package, color: 'bg-[#847CB8]' },
    { id: 'dev', label: 'API Keys', icon: Key, color: 'bg-zinc-800' },
    { id: 'equipos', label: 'Equipos & Teams', icon: Users, color: 'bg-[#A7D792]' },
  ];

  return (
    <div className="mb-8 select-none">
      <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
        {items.map((item, idx) => {
          const isActive = selectedCategory === item.id;
          const IconComponent = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectCategory(item.id as CategoryId)}
              className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl border transition cursor-pointer shrink-0 font-extrabold text-xs shadow-xs ${
                isActive
                  ? 'bg-[#847CB8] text-white border-[#847CB8]'
                  : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg ${item.color} text-white flex items-center justify-center`}>
                <IconComponent className="w-3.5 h-3.5" />
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
