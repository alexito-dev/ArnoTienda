import React, { useState, useEffect } from 'react';
import { X, Upload, Check, Image as ImageIcon, Tag, DollarSign, Sparkles, Shield, Pencil } from 'lucide-react';
import { Product, CategoryId } from '../../types/store';
import { CATEGORIES } from '../../data/products';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaveProduct: (product: Product) => void;
  productToEdit: Product | null;
}

export const ProductFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSaveProduct,
  productToEdit,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    subtitle: 'Licencia Digital',
    category: 'multimodal',
    badge: 'OFERTA',
    regionBadge: 'GLOBAL KEY',
    canActivateInCountry: true,
    discountPercent: 50,
    numericPrice: 6.64,
    numericOriginalPrice: 13.30,
    headerBg: 'purple',
    iconType: 'spark',
    description: '',
    checklist: ['Acceso completo garantizado', 'Entrega instantánea', 'Soporte técnico 24/7'],
    imageUrl: '',
    sellerName: 'ArnoAI Official',
    sellerRating: 4.9,
    sellerFeedbackPercent: 99.8,
    sellerSales: 3420,
    shieldIncluded: true,
  });

  const [penPrice, setPenPrice] = useState<number>(24.9);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit);
      setImagePreview(productToEdit.imageUrl || '');
      setPenPrice(Math.round(productToEdit.numericPrice * 3.75 * 10) / 10);
    } else {
      setFormData({
        name: '',
        subtitle: 'Licencia Digital',
        category: 'multimodal',
        badge: 'OFERTA',
        regionBadge: 'GLOBAL KEY',
        canActivateInCountry: true,
        discountPercent: 50,
        numericPrice: 6.64,
        numericOriginalPrice: 13.30,
        headerBg: 'purple',
        iconType: 'spark',
        description: 'Acceso completo a herramientas avanzadas de IA.',
        checklist: ['Acceso completo garantizado', 'Entrega instantánea', 'Soporte técnico 24/7'],
        imageUrl: '',
        sellerName: 'ArnoAI Official',
        sellerRating: 4.9,
        sellerFeedbackPercent: 99.8,
        sellerSales: 3420,
        shieldIncluded: true,
      });
      setImagePreview('');
      setPenPrice(24.9);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData((prev) => ({ ...prev, imageUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const numPrice = Number(formData.numericPrice) || 6.64;
    const numOrig = Number(formData.numericOriginalPrice) || numPrice * 2;
    const penVal = penPrice || Math.round(numPrice * 3.75 * 10) / 10;

    const finalProduct: Product = {
      id: productToEdit ? productToEdit.id : `prod-${Date.now()}`,
      name: formData.name.trim(),
      subtitle: formData.subtitle || 'Licencia Digital',
      category: (formData.category as CategoryId) || 'multimodal',
      badge: formData.badge || 'OFERTA',
      regionBadge: formData.regionBadge || 'GLOBAL KEY',
      canActivateInCountry: true,
      discountPercent: Number(formData.discountPercent) || 50,
      priceDisplay: numPrice.toFixed(2),
      originalPriceDisplay: numOrig.toFixed(2),
      yearlyPriceDisplay: numPrice.toFixed(2),
      originalYearlyPriceDisplay: numOrig.toFixed(2),
      priceUnit: `USD / S/ ${penVal.toFixed(2)} PEN`,
      numericPrice: numPrice,
      numericYearlyPrice: numPrice,
      numericOriginalPrice: numOrig,
      sellerName: formData.sellerName || 'ArnoAI Official',
      sellerRating: 4.9,
      sellerFeedbackPercent: 99.8,
      sellerSales: 3420,
      shieldIncluded: true,
      headerBg: formData.headerBg || 'purple',
      iconType: formData.iconType || 'spark',
      description: formData.description || 'Licencia y clave digital de acceso oficial.',
      checklist: formData.checklist || ['Entrega inmediata', 'Soporte 24/7'],
      modelsIncluded: ['AI Suite', 'Fast Access'],
      specs: [
        { label: 'Formato', value: 'Clave Digital / Cuenta Privada' },
        { label: 'Garantía', value: 'Garantía Total 100%' },
        { label: 'Región', value: 'Global (Perú & Internacional)' },
      ],
      idealFor: 'Profesionales, desarrolladores y estudiantes.',
      activationKeySample: `G2A-ARNO-${Date.now().toString().slice(-6)}-KEY`,
      imageUrl: formData.imageUrl || imagePreview || '',
      isActive: true,
    };

    onSaveProduct(finalProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <div>
            <h2 className="text-lg font-black text-[var(--color-text)] flex items-center space-x-2">
              {productToEdit ? <Pencil className="w-4 h-4 text-[#847CB8]" /> : <Sparkles className="w-4 h-4 text-[#847CB8]" />}
              <span>{productToEdit ? 'Editar Producto' : 'Nuevo Producto'}</span>
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Gestiona precios, ofertas, categorías e imagen de portada completa.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/10 hover:bg-black/20 text-[var(--color-text)] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-semibold">
          {/* Row 1: Name & Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[var(--color-text-muted)] mb-1">Nombre Comercial *</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ej. Gemini AI Pro (18 Meses)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
              />
            </div>

            <div>
              <label className="block text-[var(--color-text-muted)] mb-1">Subtítulo / Formato</label>
              <input
                type="text"
                value={formData.subtitle || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Ej. Licencia Digital / Suscripción"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
              />
            </div>
          </div>

          {/* Row 2: Category & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[var(--color-text-muted)] mb-1">Categoría</label>
              <select
                value={formData.category || 'multimodal'}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as CategoryId }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
              >
                {CATEGORIES.filter((c) => c.id !== 'todos').map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#121214] text-white">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[var(--color-text-muted)] mb-1">Distintivo / Badge</label>
              <select
                value={formData.badge || 'OFERTA'}
                onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
              >
                <option value="MÁS VENDIDO" className="bg-[#121214] text-white">MÁS VENDIDO</option>
                <option value="TOP VENTAS" className="bg-[#121214] text-white">TOP VENTAS</option>
                <option value="OFERTA FLASH" className="bg-[#121214] text-white">OFERTA FLASH</option>
                <option value="PROMO 2X1" className="bg-[#121214] text-white">PROMO 2X1</option>
                <option value="RECOMENDADO" className="bg-[#121214] text-white">RECOMENDADO</option>
              </select>
            </div>
          </div>

          {/* Row 3: Prices & Discount */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[var(--color-text-muted)] mb-1">Precio en USD ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.numericPrice || 0}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setFormData((prev) => ({ ...prev, numericPrice: val }));
                  setPenPrice(Math.round(val * 3.75 * 10) / 10);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
              />
            </div>

            <div>
              <label className="block text-[var(--color-text-muted)] mb-1">Precio en Soles (S/ PEN)</label>
              <input
                type="number"
                step="0.10"
                value={penPrice}
                onChange={(e) => setPenPrice(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
              />
            </div>

            <div>
              <label className="block text-[var(--color-text-muted)] mb-1">Descuento (%)</label>
              <input
                type="number"
                value={formData.discountPercent || 0}
                onChange={(e) => setFormData((prev) => ({ ...prev, discountPercent: parseInt(e.target.value) }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
              />
            </div>
          </div>

          {/* Row 4: Image Cover Upload */}
          <div className="space-y-2 pt-2 border-t border-[var(--color-border)]">
            <label className="block text-[var(--color-text)] font-extrabold flex items-center space-x-1.5">
              <ImageIcon className="w-4 h-4 text-[#847CB8]" />
              <span>Imagen de Portada Completa (600 x 750 px)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              {/* File input button */}
              <label className="p-4 rounded-2xl bg-white/5 border border-dashed border-[var(--color-border)] hover:border-[#847CB8] transition cursor-pointer flex flex-col items-center justify-center text-center space-y-1">
                <Upload className="w-6 h-6 text-[#847CB8]" />
                <span className="text-[11px] font-bold text-[var(--color-text)]">Subir Archivo Local</span>
                <span className="text-[9px] text-[var(--color-text-muted)]">PNG, JPG, WebP</span>
                <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
              </label>

              {/* Direct URL input */}
              <div className="sm:col-span-2">
                <label className="block text-[var(--color-text-muted)] mb-1 text-[11px]">
                  O ingresa un enlace URL de imagen directo:
                </label>
                <input
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, imageUrl: e.target.value }));
                    setImagePreview(e.target.value);
                  }}
                  placeholder="https://ejemplo.com/portada.webp"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
                />
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-3 p-2 rounded-2xl bg-black/20 border border-white/10 flex items-center space-x-3">
                <img src={imagePreview} alt="Preview" className="w-16 h-20 object-cover rounded-xl shadow-md border border-white/20" />
                <div>
                  <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Portada lista</span>
                  </span>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                    Se mostrará a pantalla completa en la tarjeta.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[var(--color-text-muted)] mb-1">Descripción Corta</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Explicación detallada del producto y beneficios..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-black/10 hover:bg-black/20 text-[var(--color-text)] font-bold transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#847CB8] hover:bg-[#6F66A8] text-white font-extrabold shadow-md transition cursor-pointer flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Producto</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
