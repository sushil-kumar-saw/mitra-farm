import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Leaf, 
  DollarSign, 
  Package, 
  Calendar,
  Download,
  RefreshCw,
  Target,
  Award,
  MapPin,
  Users
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';

const BuyerAnalytics = () => {
  const [dateRange, setDateRange] = useState('3months');
  const [activeMetric, setActiveMetric] = useState('spending');
  const [loading, setLoading] = useState(false);

  // Sample data
  const monthlySpending = [
    { month: 'Jan', amount: 45000, orders: 12, carbon: 35 },
    { month: 'Feb', amount: 52000, orders: 15, carbon: 42 },
    { month: 'Mar', amount: 48000, orders: 13, carbon: 38 },
    { month: 'Apr', amount: 61000, orders: 18, carbon: 48 },
    { month: 'May', amount: 58000, orders: 16, carbon: 45 }
  ];

  const wasteTypeDistribution = [
    { name: 'Rice Husk', value: 35, amount: 125000, color: '#10B981' },
    { name: 'Wheat Straw', value: 28, amount: 98000, color: '#3B82F6' },
    { name: 'Sugarcane Bagasse', value: 22, amount: 77000, color: '#F59E0B' },
    { name: 'Cotton Stalks', value: 15, amount: 52500, color: '#EF4444' }
  ];

  const carbonImpactData = [
    { month: 'Jan', saved: 35, target: 40 },
    { month: 'Feb', saved: 42, target: 45 },
    { month: 'Mar', saved: 38, target: 42 },
    { month: 'Apr', saved: 48, target: 50 },
    { month: 'May', saved: 45, target: 48 }
  ];

  const topFarmers = [
    { name: 'Rajesh Kumar', location: 'Punjab', orders: 8, amount: 45000, rating: 4.9, carbonSaved: 12.5 },
    { name: 'Priya Sharma', location: 'Haryana', orders: 6, amount: 38000, rating: 4.8, carbonSaved: 10.2 },
    { name: 'Amit Patel', location: 'Gujarat', orders: 5, amount: 42000, rating: 4.9, carbonSaved: 11.8 },
    { name: 'Sunita Devi', location: 'Rajasthan', orders: 4, amount: 28000, rating: 4.7, carbonSaved: 8.3 }
  ];

  const kpiCards = [
    {
      title: 'Total Spending',
      value: '₹2,64,000',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'blue',
      description: 'Last 3 months'
    },
    {
      title: 'Carbon Saved',
      value: '208 tons',
      change: '+18.2%',
      trend: 'up',
      icon: Leaf,
      color: 'green',
      description: 'CO₂ equivalent'
    },
    {
      title: 'Orders Completed',
      value: '74',
      change: '+8.1%',
      trend: 'up',
      icon: Package,
      color: 'purple',
      description: 'Successful transactions'
    },
    {
      title: 'Average Price',
      value: '₹14.2/kg',
      change: '-3.5%',
      trend: 'down',
      icon: Target,
      color: 'orange',
      description: 'Cost efficiency improved'
    }
  ];

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your purchasing patterns and environmental impact</p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <button 
              onClick={refreshData}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((kpi, index) => {
            // For Tailwind dynamic classes, must handle with caution or use fixed classes:
            // Here we will map colors manually:
            const bgColors = {
              blue: 'bg-blue-100',
              green: 'bg-green-100',
              purple: 'bg-purple-100',
              orange: 'bg-orange-100',
            };
            const textColors = {
              blue: 'text-blue-600',
              green: 'text-green-600',
              purple: 'text-purple-600',
              orange: 'text-orange-600',
            };
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${bgColors[kpi.color]} rounded-xl w-12 h-12 flex items-center justify-center`}>
                    <kpi.icon className={`${textColors[kpi.color]} w-6 h-6`} />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm font-medium ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{kpi.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 mb-1">{kpi.value}</p>
                  <p className="text-sm text-gray-600">{kpi.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{kpi.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Spending Trends */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Spending Trends</h3>
              <div className="flex space-x-2">
                {['spending', 'orders', 'carbon'].map(metric => (
                  <button
                    key={metric}
                    onClick={() => setActiveMetric(metric)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      activeMetric === metric 
                        ? 'bg-green-100 text-green-700' 
                        : 'text-gray-600 hover:text-green-600'
                    }`}
                  >
                    {metric === 'spending' ? 'Amount' : metric === 'orders' ? 'Orders' : 'Carbon'}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlySpending}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [
                    activeMetric === 'spending' ? `₹${value.toLocaleString()}` :
                    activeMetric === 'orders' ? `${value} orders` :
                    `${value} tons CO₂`,
                    activeMetric === 'spending' ? 'Spending' :
                    activeMetric === 'orders' ? 'Orders' : 'Carbon Saved'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey={activeMetric === 'spending' ? 'amount' : activeMetric === 'orders' ? 'orders' : 'carbon'}
                  stroke="#10B981" 
                  fill="#D1FAE5" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 7 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Waste Type Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Waste Type Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={wasteTypeDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {wasteTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => {
                    const data = wasteTypeDistribution.find(w => w.name === name);
                    return [`${data.amount.toLocaleString()} kg`, name];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Carbon Impact & Top Farmers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Carbon Impact Line Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Carbon Impact vs Target</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={carbonImpactData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="saved" stroke="#10B981" strokeWidth={3} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey="target" stroke="#3B82F6" strokeWidth={3} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Farmers Table */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Top Farmers</h3>
            <table className="w-full table-auto text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-3 text-sm font-semibold text-gray-600">Name</th>
                  <th className="py-2 px-3 text-sm font-semibold text-gray-600">Location</th>
                  <th className="py-2 px-3 text-sm font-semibold text-gray-600">Orders</th>
                  <th className="py-2 px-3 text-sm font-semibold text-gray-600">Amount</th>
                  <th className="py-2 px-3 text-sm font-semibold text-gray-600">Rating</th>
                  <th className="py-2 px-3 text-sm font-semibold text-gray-600">Carbon Saved (tons)</th>
                </tr>
              </thead>
              <tbody>
                {topFarmers.map((farmer, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-green-50 transition-colors">
                    <td className="py-3 px-3 text-gray-800 font-medium">{farmer.name}</td>
                    <td className="py-3 px-3 text-gray-600">{farmer.location}</td>
                    <td className="py-3 px-3 text-gray-600">{farmer.orders}</td>
                    <td className="py-3 px-3 text-gray-800 font-semibold">₹{farmer.amount.toLocaleString()}</td>
                    <td className="py-3 px-3 text-gray-600">{farmer.rating}</td>
                    <td className="py-3 px-3 text-gray-800 font-semibold">{farmer.carbonSaved.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerAnalytics;
