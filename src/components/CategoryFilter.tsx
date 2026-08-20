import React from 'react';
import { 
  Sparkles, 
  Smartphone, 
  Tv, 
  Shirt, 
  ShoppingBag, 
  Car, 
  Baby, 
  Sparkle,
  SlidersHorizontal
} from 'lucide-react';
import { Category, CategoryId } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: CategoryId;
  onSelectCategory: (categoryId: CategoryId) => void;
  priceSort: 'featured' | 'price_asc' | 'price_desc' | 'rating';
  onPriceSortChange: (sort: 'featured' | 'price_asc' | 'price_desc' | 'rating') => void;
  onlyExpressLuanda: boolean;
  onToggleExpressLuanda: () => void;
  totalProductsCount: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  priceSort,
  onPriceSortChange,
  onlyExpressLuanda,
  onToggleExpressLuanda,
  totalProductsCount,
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone className="w-4 h-4" />;
      case 'Tv':
        return <Tv className="w-4 h-4" />;
      case 'Shirt':
        return <Shirt className="w-4 h-4" />;
      case 'Sparkle':
        return <Sparkle className="w-4 h-4" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-4 h-4" />;
      case 'Car':
        return <Car className="w-4 h-4" />;
      case 'Baby':
        return <Baby className="w-4 h-4" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white border-b border-stone-200 sticky top-[73px] z-30 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Horizontal Category Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none scroll-smooth">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-btn-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-sm scale-[1.02]'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900 border border-stone-200'
                }`}
              >
                <span className={isSelected ? 'text-amber-300' : 'text-stone-600'}>
                  {getCategoryIcon(cat.icon)}
                </span>
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isSelected ? 'bg-red-700 text-white' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {cat.itemCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sub-bar: Sorting & Quick Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 mt-1 border-t border-stone-100 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span className="text-stone-500 font-medium">
              Mostrando <strong className="text-stone-900">{totalProductsCount}</strong> produtos disponíveis em Luanda
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Express Luanda Toggle */}
            <button
              onClick={onToggleExpressLuanda}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                onlyExpressLuanda
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-stone-100 text-stone-600 border-stone-200 hover:text-stone-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${onlyExpressLuanda ? 'bg-amber-500 animate-pulse' : 'bg-stone-400'}`} />
              <span>Entrega Rápida 24h Luanda</span>
            </button>

            {/* Sort Filter */}
            <div className="flex items-center gap-1.5 bg-stone-100 border border-stone-200 rounded-2xl px-3 py-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
              <select
                id="sort-select"
                value={priceSort}
                onChange={(e) => onPriceSortChange(e.target.value as any)}
                aria-label="Ordenar produtos"
                className="bg-transparent text-xs text-stone-800 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-white text-stone-800">Destaques Luanda</option>
                <option value="price_asc" className="bg-white text-stone-800">Menor Preço (Kz)</option>
                <option value="price_desc" className="bg-white text-stone-800">Maior Preço (Kz)</option>
                <option value="rating" className="bg-white text-stone-800">Mais Bem Avaliados</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
