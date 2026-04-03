import { useState } from 'react';
import { User } from '../App';
import { Package, Truck, MapPin, Clock, CheckCircle } from 'lucide-react';

interface ShipmentViewProps {
  user: User;
}

interface Shipment {
  id: string;
  orderId: string;
  patientName: string;
  patientAddress: string;
  items: {
    name: string;
    quantity: number;
  }[];
  status: 'pending' | 'packed' | 'shipped' | 'in-transit' | 'delivered';
  trackingNumber?: string;
  carrier?: string;
  shippedDate?: string;
  estimatedDelivery?: string;
  deliveredDate?: string;
  priority: 'standard' | 'express' | 'urgent';
}

export function ShipmentView({ user }: ShipmentViewProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'shipped' | 'delivered'>('all');

  const shipments: Shipment[] = [
    {
      id: 'SH-001',
      orderId: '#5678',
      patientName: 'Emma Schmidt',
      patientAddress: 'Hauptstraße 45, 10115 Berlin',
      items: [
        { name: 'Finasteride 1mg', quantity: 30 },
        { name: 'Vitamin D3 1000 IU', quantity: 60 },
      ],
      status: 'in-transit',
      trackingNumber: 'DHL1234567890DE',
      carrier: 'DHL Express',
      shippedDate: '2026-04-01',
      estimatedDelivery: '2026-04-03',
      priority: 'express',
    },
    {
      id: 'SH-002',
      orderId: '#5677',
      patientName: 'Max Weber',
      patientAddress: 'Goethestraße 12, 80336 München',
      items: [
        { name: 'Tretinoin Cream 0.05%', quantity: 1 },
      ],
      status: 'shipped',
      trackingNumber: 'DHL0987654321DE',
      carrier: 'DHL',
      shippedDate: '2026-04-02',
      estimatedDelivery: '2026-04-04',
      priority: 'standard',
    },
    {
      id: 'SH-003',
      orderId: '#5676',
      patientName: 'Lisa Müller',
      patientAddress: 'Friedrichstraße 78, 20095 Hamburg',
      items: [
        { name: 'Vitamin D3 1000 IU', quantity: 90 },
      ],
      status: 'delivered',
      trackingNumber: 'DHL5555666677DE',
      carrier: 'DHL',
      shippedDate: '2026-03-28',
      estimatedDelivery: '2026-03-31',
      deliveredDate: '2026-03-31',
      priority: 'standard',
    },
    {
      id: 'SH-004',
      orderId: '#5679',
      patientName: 'Tom Fischer',
      patientAddress: 'Karlstraße 23, 50667 Köln',
      items: [
        { name: 'Minoxidil 5% Solution', quantity: 2 },
      ],
      status: 'packed',
      priority: 'express',
    },
    {
      id: 'SH-005',
      orderId: '#5680',
      patientName: 'Anna Becker',
      patientAddress: 'Mozartstraße 56, 60311 Frankfurt',
      items: [
        { name: 'Sertraline 50mg', quantity: 30 },
        { name: 'Ibuprofen 400mg', quantity: 20 },
      ],
      status: 'pending',
      priority: 'urgent',
    },
  ];

  const filteredShipments = shipments.filter(shipment => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return shipment.status === 'pending' || shipment.status === 'packed';
    if (filterStatus === 'shipped') return shipment.status === 'shipped' || shipment.status === 'in-transit';
    if (filterStatus === 'delivered') return shipment.status === 'delivered';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'packed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'in-transit':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">Urgent</span>;
      case 'express':
        return <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded">Express</span>;
      default:
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">Standard</span>;
    }
  };

  const pendingCount = shipments.filter(s => s.status === 'pending' || s.status === 'packed').length;
  const shippedCount = shipments.filter(s => s.status === 'shipped' || s.status === 'in-transit').length;
  const deliveredCount = shipments.filter(s => s.status === 'delivered').length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Shipment Tracking</h1>
        <p className="text-sm text-gray-600 mt-1">
          Monitor and manage order shipments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Pending Shipment</h3>
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{pendingCount}</p>
          <p className="text-xs text-yellow-600 mt-1">Ready to ship</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">In Transit</h3>
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{shippedCount}</p>
          <p className="text-xs text-orange-600 mt-1">On the way</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Delivered Today</h3>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{deliveredCount}</p>
          <p className="text-xs text-green-600 mt-1">Successfully delivered</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Avg. Delivery Time</h3>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">2.3</p>
          <p className="text-xs text-gray-500 mt-1">Days</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Shipments
            <span className="ml-2 text-xs">{shipments.length}</span>
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterStatus === 'pending'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
            {pendingCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-yellow-500 text-white rounded text-xs">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilterStatus('shipped')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterStatus === 'shipped'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            In Transit
            {shippedCount > 0 && <span className="ml-2 text-xs">{shippedCount}</span>}
          </button>
          <button
            onClick={() => setFilterStatus('delivered')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterStatus === 'delivered'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Delivered
            {deliveredCount > 0 && <span className="ml-2 text-xs">{deliveredCount}</span>}
          </button>
        </div>

        {/* Shipments List */}
        <div className="space-y-4">
          {filteredShipments.map((shipment) => (
            <div
              key={shipment.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {shipment.patientName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{shipment.patientName}</h3>
                      <span className="text-sm text-gray-500">{shipment.orderId}</span>
                      {getPriorityBadge(shipment.priority)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{shipment.patientAddress}</span>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                    shipment.status
                  )}`}
                >
                  {shipment.status === 'in-transit' ? 'In Transit' : shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                </span>
              </div>

              {/* Items */}
              <div className="mb-4 pl-16">
                <p className="text-sm font-medium text-gray-700 mb-2">Items:</p>
                <div className="space-y-1">
                  {shipment.items.map((item, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      • {item.name} × {item.quantity}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracking Information */}
              {shipment.trackingNumber && (
                <div className="pl-16 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">Tracking Number</p>
                      <p className="font-medium text-gray-900">{shipment.trackingNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Carrier</p>
                      <p className="font-medium text-gray-900">{shipment.carrier}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Shipped Date</p>
                      <p className="font-medium text-gray-900">{shipment.shippedDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">
                        {shipment.status === 'delivered' ? 'Delivered' : 'Est. Delivery'}
                      </p>
                      <p className="font-medium text-gray-900">
                        {shipment.status === 'delivered' ? shipment.deliveredDate : shipment.estimatedDelivery}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Track Package
                    </button>
                    <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Print Label
                    </button>
                    {shipment.status !== 'delivered' && (
                      <button className="px-4 py-2 text-sm bg-[#5B6FF8] text-white rounded-lg hover:bg-[#4A5FE7] transition-colors">
                        Update Status
                      </button>
                    )}
                  </div>
                </div>
              )}

              {!shipment.trackingNumber && (
                <div className="pl-16 pt-4 border-t border-gray-100">
                  <button className="px-4 py-2 text-sm bg-[#5B6FF8] text-white rounded-lg hover:bg-[#4A5FE7] transition-colors">
                    Generate Shipping Label
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
