import { useState } from 'react';
import { User } from '../../App';
import { NavigationItem } from '../Dashboard';
import { DataTable } from '../DataTable';
import { Download, Package } from 'lucide-react';
import { SettingsView } from '../SettingsView';
import { InventoryView } from '../InventoryView';
import { ShipmentView } from '../ShipmentView';
import { PharmacyOrderDetailView } from '../PharmacyOrderDetailView';

interface PharmacyViewProps {
  activeNav: NavigationItem;
  user: User;
}

export function PharmacyView({ activeNav, user }: PharmacyViewProps) {
  const [viewingOrderId, setViewingOrderId] = useState<string | null>(null);

  if (viewingOrderId) {
    return (
      <PharmacyOrderDetailView
        user={user}
        orderId={viewingOrderId}
        onBack={() => setViewingOrderId(null)}
      />
    );
  }

  if (activeNav === 'home') {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome, {user.name}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage orders and fulfillment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Pending Orders
              </h3>
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">3</p>
            <p className="text-xs text-orange-600 mt-1">Needs processing</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                In Transit
              </h3>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">7</p>
            <p className="text-xs text-gray-500 mt-1">On delivery</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Delivered Today
              </h3>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">15</p>
            <p className="text-xs text-green-600 mt-1">All on time</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                This Month
              </h3>
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">342</p>
            <p className="text-xs text-green-600 mt-1">+8% from last month</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Orders
          </h2>
          <div className="space-y-3">
            {[
              {
                orderId: '#5678',
                patient: 'Emma Schmidt',
                prescription: 'Finasteride 1mg',
                status: 'pending',
                time: '30 min ago',
              },
              {
                orderId: '#5677',
                patient: 'Max Weber',
                prescription: 'Tretinoin cream 0.05%',
                status: 'processing',
                time: '1 hour ago',
              },
              {
                orderId: '#5676',
                patient: 'Lisa Müller',
                prescription: 'Vitamin D3 supplements',
                status: 'shipped',
                time: '2 hours ago',
              },
            ].map((order) => (
              <div
                key={order.orderId}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {order.orderId}
                    </span>
                    <span className="text-sm text-gray-600">
                      {order.patient}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600">
                      {order.prescription}
                    </span>
                    <span className="text-xs text-gray-400">
                      • {order.time}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      order.status === 'pending'
                        ? 'bg-orange-50 text-orange-700'
                        : order.status === 'processing'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-green-50 text-green-700'
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                  <button
                    onClick={() => setViewingOrderId(order.orderId)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeNav === 'orders') {
    const columns = [
      { key: 'orderId', label: 'ORDER ID' },
      { key: 'patient', label: 'PATIENT' },
      { key: 'prescription', label: 'PRESCRIPTION' },
      { key: 'date', label: 'DATE' },
      { key: 'status', label: 'STATUS' },
      { key: 'priority', label: 'PRIORITY' },
    ];

    const data = [
      {
        id: '1',
        orderId: '#5678',
        patient: 'Emma Schmidt',
        patientAvatar: 'ES',
        prescription: 'Finasteride 1mg - 90 days',
        date: 'Apr 2, 2026',
        status: 'pending',
        priority: 'high',
      },
      {
        id: '2',
        orderId: '#5677',
        patient: 'Max Weber',
        patientAvatar: 'MW',
        prescription: 'Tretinoin cream 0.05%',
        date: 'Apr 2, 2026',
        status: 'processing',
        priority: 'medium',
      },
      {
        id: '3',
        orderId: '#5676',
        patient: 'Lisa Müller',
        patientAvatar: 'LM',
        prescription: 'Vitamin D3 supplements',
        date: 'Apr 2, 2026',
        status: 'shipped',
        priority: 'low',
      },
      {
        id: '4',
        orderId: '#5675',
        patient: 'Tom Fischer',
        patientAvatar: 'TF',
        prescription: 'Minoxidil 5% solution',
        date: 'Apr 1, 2026',
        status: 'delivered',
        priority: 'medium',
      },
      {
        id: '5',
        orderId: '#5674',
        patient: 'Anna Becker',
        patientAvatar: 'AB',
        prescription: 'Sertraline 50mg',
        date: 'Apr 1, 2026',
        status: 'delivered',
        priority: 'high',
      },
    ];

    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">All Orders</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage prescription orders and fulfillment
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Export</span>
          </button>
        </div>

        <DataTable columns={columns} data={data} showAvatar onRowClick={(row) => setViewingOrderId(row.orderId)} />
      </div>
    );
  }

  if (activeNav === 'inventory') {
    return <InventoryView user={user} />;
  }

  if (activeNav === 'tracking') {
    return <ShipmentView user={user} />;
  }

  if (activeNav === 'settings') {
    return <SettingsView user={user} />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        {activeNav.toUpperCase()}
      </h1>
      <p className="text-gray-600 mt-2">Content for {activeNav}</p>
    </div>
  );
}