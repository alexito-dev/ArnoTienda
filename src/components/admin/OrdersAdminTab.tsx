import React, { useState, useEffect } from 'react';
import { StoreOrder, StoreOrderItem } from '../../types/store';
import { api } from '../../services/api';
import {
  Search,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  Key,
  MessageCircle,
  FileText,
  User,
  Filter
} from 'lucide-react';

interface Props {
  showToast: (msg: string) => void;
}

export const OrdersAdminTab: React.FC<Props> = ({ showToast }) => {
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completado' | 'pendiente' | 'reembolsado'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);

  // Edit Key Modal
  const [editingOrder, setEditingOrder] = useState<StoreOrder | null>(null);
  const [manualKeyInput, setManualKeyInput] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    const data = await api.fetchOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleRetryDispatch = async (orderId: string) => {
    setDispatchingId(orderId);
    const res = await api.dispatchOrder(orderId);
    if (res.success) {
      showToast('Despacho completado exitosamente con la API del proveedor');
      loadOrders();
    } else {
      showToast(res.error || 'Error al conectar con la API del proveedor');
    }
    setDispatchingId(null);
  };

  const handleSaveManualKey = async () => {
    if (!editingOrder) return;
    const updatedItems = editingOrder.items.map((item, idx) => {
      if (idx === 0) {
        return {
          ...item,
          activationKey: manualKeyInput,
          providerStatus: 'entregado' as const,
        };
      }
      return item;
    });

    const success = await api.updateOrder(editingOrder.id, {
      fulfillmentStatus: 'entregado',
      status: 'completado',
      items: updatedItems,
      notes: 'Clave digital asignada manualmente por el administrador',
    });

    if (success) {
      showToast(`Clave digital guardada para la orden ${editingOrder.id}`);
      setEditingOrder(null);
      loadOrders();
    } else {
      showToast('Error al actualizar la orden');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some((it) => it.productName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenuePEN = orders
    .filter((o) => o.status === 'completado')
    .reduce((acc, o) => acc + (o.totalPEN || 0), 0);

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200">
      {/* Top Header & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[var(--color-text-muted)] font-semibold">Total Facturado</span>
            <div className="text-2xl font-black text-emerald-500 mt-1">
              S/ {totalRevenuePEN.toFixed(2)} PEN
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-500">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[var(--color-text-muted)] font-semibold">Pedidos Registrados</span>
            <div className="text-2xl font-black text-[var(--color-text)] mt-1">{orders.length}</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#847CB8]/15 text-[#847CB8]">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[var(--color-text-muted)] font-semibold">Entregas Exitosas</span>
            <div className="text-2xl font-black text-blue-400 mt-1">
              {orders.filter((o) => o.fulfillmentStatus === 'entregado').length}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/15 text-blue-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[var(--color-text-muted)] font-semibold">Pendientes / Revisión</span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {orders.filter((o) => o.fulfillmentStatus !== 'entregado').length}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="flex items-center bg-white/5 border border-[var(--color-border)] rounded-2xl px-3.5 py-2 w-full md:w-80">
          <Search className="w-4 h-4 text-[var(--color-text-muted)] mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por cliente, orden o producto..."
            className="w-full bg-transparent text-xs text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none font-semibold"
          />
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'completado', 'pendiente', 'reembolsado'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black capitalize transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#847CB8] text-white shadow-xs'
                  : 'bg-white/5 hover:bg-white/10 text-[var(--color-text-muted)]'
              }`}
            >
              {st === 'all' ? 'Todos los Pedidos' : st}
            </button>
          ))}

          <button
            onClick={loadOrders}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--color-text)] transition cursor-pointer"
            title="Recargar Pedidos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-[var(--color-border)] text-[var(--color-text-muted)] font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Orden / Fecha</th>
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">Productos Adquiridos</th>
                <th className="py-3.5 px-4">Proveedor / Origen</th>
                <th className="py-3.5 px-4">Método de Pago</th>
                <th className="py-3.5 px-4">Total PEN</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] font-semibold text-[var(--color-text)]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[var(--color-text-muted)] font-medium">
                    No se encontraron pedidos registrados con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const firstItem: StoreOrderItem | undefined = o.items[0];
                  const isDispatching = dispatchingId === o.id;

                  return (
                    <tr key={o.id} className="hover:bg-white/5 transition">
                      <td className="py-4 px-4 font-mono font-bold">
                        <div className="text-[var(--color-text)]">{o.id}</div>
                        <div className="text-[10px] text-[var(--color-text-muted)] font-normal">{o.createdAt ? new Date(o.createdAt).toLocaleString('es-PE') : 'Reciente'}</div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-extrabold text-[var(--color-text)] flex items-center space-x-1.5">
                          <User className="w-3.5 h-3.5 text-[#847CB8]" />
                          <span>{o.customerName}</span>
                        </div>
                        {o.customerEmail && (
                          <div className="text-[11px] text-[var(--color-text-muted)] truncate max-w-[160px]">
                            {o.customerEmail}
                          </div>
                        )}
                        {o.customerPhone && (
                          <a
                            href={`https://wa.me/${o.customerPhone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(o.customerName)},%20te%20escribimos%20de%20ArnoTienda%20respecto%20a%20tu%20orden%20${o.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center space-x-1 text-[10px] text-emerald-400 font-extrabold hover:underline mt-0.5"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {o.items.map((it, idx) => (
                            <div key={idx} className="flex flex-col space-y-0.5">
                              <span className="font-bold text-xs text-[var(--color-text)]">
                                {it.quantity}x {it.productName}
                              </span>
                              {it.activationKey && (
                                <div className="flex items-center space-x-1 font-mono text-[10px] text-amber-300">
                                  <Key className="w-3 h-3 shrink-0" />
                                  <span className="truncate max-w-[150px]">{it.activationKey}</span>
                                  <button
                                    onClick={() => handleCopy(it.activationKey, `${o.id}-${idx}`)}
                                    className="p-1 text-[var(--color-text-muted)] hover:text-white transition cursor-pointer"
                                    title="Copiar Clave"
                                  >
                                    {copiedKey === `${o.id}-${idx}` ? (
                                      <Check className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-xl bg-purple-500/15 text-purple-400 font-bold text-[10px] uppercase">
                          {firstItem?.providerId || 'BunaiStore API'}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-xl bg-white/5 border border-[var(--color-border)] text-xs font-extrabold text-[var(--color-text)]">
                          {o.paymentMethod || 'Yape / Plin'}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-mono font-black text-emerald-500 text-sm">
                        S/ {o.totalPEN.toFixed(2)}
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase ${
                          o.fulfillmentStatus === 'entregado'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {o.fulfillmentStatus === 'entregado' ? 'Entregado' : 'Pendiente Despacho'}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleRetryDispatch(o.id)}
                            disabled={isDispatching}
                            className="p-2 rounded-xl bg-[#847CB8]/15 hover:bg-[#847CB8]/30 text-[#847CB8] transition cursor-pointer"
                            title="Reintentar Despacho con API"
                          >
                            <RotateCcw className={`w-3.5 h-3.5 ${isDispatching ? 'animate-spin' : ''}`} />
                          </button>

                          <button
                            onClick={() => {
                              setEditingOrder(o);
                              setManualKeyInput(firstItem?.activationKey || '');
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-[var(--color-text)] transition cursor-pointer"
                          >
                            Editar Clave
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Key Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-[var(--color-text)] flex items-center space-x-2">
              <Key className="w-5 h-5 text-[#847CB8]" />
              <span>Gestionar Clave Digital - Orden {editingOrder.id}</span>
            </h3>

            <p className="text-xs text-[var(--color-text-muted)]">
              Introduce las credenciales, enlace de activación o clave oficial que el cliente visualizará en su Bóveda y en su Comprobante de Compra.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[var(--color-text-muted)]">
                Clave o Cuenta Asignada:
              </label>
              <textarea
                rows={3}
                value={manualKeyInput}
                onChange={(e) => setManualKeyInput(e.target.value)}
                placeholder="Ejemplo: usuario@correo.com:Password123 o Clave de Activación Oficial"
                className="w-full p-3 rounded-2xl bg-white/10 border border-[var(--color-border)] text-xs font-mono font-bold text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setEditingOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[var(--color-text-muted)] transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveManualKey}
                className="px-5 py-2.5 rounded-xl bg-[#847CB8] hover:bg-[#6F66A8] text-white text-xs font-black transition cursor-pointer shadow-md"
              >
                Guardar y Confirmar Entrega
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
