import { useState } from 'react';
import { User } from '../App';
import { Package, AlertTriangle, TrendingUp, Search, Plus } from 'lucide-react';

interface InventoryViewProps {
  user: User;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  stockLevel: number;
  minStockLevel: number;
  maxStockLevel: number;
  unit: string;
  price: number;
  supplier: string;
  lastRestocked: string;
  expiryDate?: string;
}

export function InventoryView({ user }: InventoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'low-stock' | 'expired-soon'>('all');

  const inventoryItems: InventoryItem[] = [
    {
      id: '1',
      name: 'Finasteride 1mg',
      category: 'Hair Loss',
      sku: 'FIN-001',
      stockLevel: 45,
      minStockLevel: 100,
      maxStockLevel: 500,
      unit: 'tablets',
      price: 0.85,
      supplier: 'Pharma Supply Co.',
      lastRestocked: '2026-03-15',
      expiryDate: '2027-12-31',
    },
    {
      id: '2',
      name: 'Tretinoin Cream 0.05%',
      category: 'Dermatology',
      sku: 'TRE-005',
      stockLevel: 28,
      minStockLevel: 50,
      maxStockLevel: 200,
      unit: 'tubes',
      price: 12.50,
      supplier: 'Derma Solutions Ltd.',
      lastRestocked: '2026-03-20',
      expiryDate: '2026-09-30',
    },
    {
      id: '3',
      name: 'Vitamin D3 1000 IU',
      category: 'Supplements',
      sku: 'VIT-D3-1000',
      stockLevel: 450,
      minStockLevel: 200,
      maxStockLevel: 1000,
      unit: 'capsules',
      price: 0.15,
      supplier: 'Wellness Distributors',
      lastRestocked: '2026-04-01',
      expiryDate: '2028-03-31',
    },
    {
      id: '4',
      name: 'Minoxidil 5% Solution',
      category: 'Hair Loss',
      sku: 'MIN-005',
      stockLevel: 12,
      minStockLevel: 30,
      maxStockLevel: 150,
      unit: 'bottles',
      price: 18.75,
      supplier: 'Pharma Supply Co.',
      lastRestocked: '2026-02-28',
      expiryDate: '2027-06-30',
    },
    {
      id: '5',
      name: 'Ibuprofen 400mg',
      category: 'Pain Relief',
      sku: 'IBU-400',
      stockLevel: 850,
      minStockLevel: 300,
      maxStockLevel: 1500,
      unit: 'tablets',
      price: 0.05,
      supplier: 'Generic Med Supply',
      lastRestocked: '2026-03-28',
      expiryDate: '2027-11-30',
    },
    {
      id: '6',
      name: 'Benzoyl Peroxide 5% Gel',
      category: 'Dermatology',
      sku: 'BPO-005',
      stockLevel: 65,
      minStockLevel: 80,
      maxStockLevel: 300,
      unit: 'tubes',
      price: 8.90,
      supplier: 'Derma Solutions Ltd.',
      lastRestocked: '2026-03-10',
      expiryDate: '2027-08-31',
    },
    {
      id: '7',
      name: 'Sertraline 50mg',
      category: 'Mental Health',
      sku: 'SER-050',
      stockLevel: 180,
      minStockLevel: 150,
      maxStockLevel: 600,
      unit: 'tablets',
      price: 0.45,
      supplier: 'Mental Health Pharma',
      lastRestocked: '2026-03-25',
      expiryDate: '2028-01-31',
    },
  ];

  const isLowStock = (item: InventoryItem) => item.stockLevel < item.minStockLevel;
  const isExpiringSoon = (item: InventoryItem) => {
    if (!item.expiryDate) return false;
    const today = new Date();
    const expiry = new Date(item.expiryDate);
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 180; // 6 months
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterCategory === 'low-stock') return matchesSearch && isLowStock(item);
    if (filterCategory === 'expired-soon') return matchesSearch && isExpiringSoon(item);
    return matchesSearch;
  });

  const lowStockCount = inventoryItems.filter(isLowStock).length;
  const expiringSoonCount = inventoryItems.filter(isExpiringSoon).length;
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.stockLevel * item.price), 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
        <p className="text-sm text-gray-600 mt-1">
          Monitor stock levels and manage medication inventory
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Items</h3>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{inventoryItems.length}</p>
          <p className="text-xs text-gray-500 mt-1">Active products</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Low Stock Alerts</h3>
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{lowStockCount}</p>
          <p className="text-xs text-orange-600 mt-1">Needs restock</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Expiring Soon</h3>
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{expiringSoonCount}</p>
          <p className="text-xs text-yellow-600 mt-1">Within 6 months</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Value</h3>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">€{totalValue.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-gray-500 mt-1">Current inventory</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterCategory === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Items
              <span className="ml-2 text-xs">{inventoryItems.length}</span>
            </button>
            <button
              onClick={() => setFilterCategory('low-stock')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterCategory === 'low-stock'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Low Stock
              {lowStockCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-orange-500 text-white rounded text-xs">
                  {lowStockCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilterCategory('expired-soon')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterCategory === 'expired-soon'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Expiring Soon
              {expiringSoonCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-yellow-500 text-white rounded text-xs">
                  {expiringSoonCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#5B6FF8] text-white text-sm font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors">
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Level</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => {
                const lowStock = isLowStock(item);
                const expiringSoon = isExpiringSoon(item);
                const stockPercentage = (item.stockLevel / item.maxStockLevel) * 100;

                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">€{item.price.toFixed(2)} per {item.unit}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-900">{item.sku}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-700">{item.category}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {item.stockLevel} {item.unit}
                          </span>
                        </div>
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              lowStock ? 'bg-orange-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {lowStock ? (
                        <span className="px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{item.expiryDate}</p>
                        {expiringSoon && (
                          <span className="text-xs text-yellow-600 flex items-center gap-1 mt-1">
                            <AlertTriangle className="w-3 h-3" />
                            Expiring soon
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-700">{item.supplier}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          Edit
                        </button>
                        <button className="px-3 py-1.5 text-sm text-white bg-[#5B6FF8] rounded-lg hover:bg-[#4A5FE7] transition-colors">
                          Restock
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
