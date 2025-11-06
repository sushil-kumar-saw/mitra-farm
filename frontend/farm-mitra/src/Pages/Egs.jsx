import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadialBarChart, RadialBar, Tooltip, Legend } from 'recharts';
import { Download, Leaf, TrendingUp, Users, Award, Calendar, Target, Globe, Factory, Truck, FileText, Filter } from 'lucide-react';

const ESGReportsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [animatedValues, setAnimatedValues] = useState({
    carbonSaved: 0,
    transactions: 0,
    farmers: 0,
    wasteProcessed: 0,
    revenue: 0
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const actualValues = {
    carbonSaved: 24500,
    transactions: 156,
    farmers: 89,
    wasteProcessed: 3420,
    revenue: 89650000
  };

  const esgData = {
    monthlyCarbon: [
      { month: 'Jan', carbon: 1800, transactions: 12, farmers: 8, revenue: 5200000 },
      { month: 'Feb', carbon: 2100, transactions: 15, farmers: 12, revenue: 6800000 },
      { month: 'Mar', carbon: 2800, transactions: 18, farmers: 14, revenue: 8200000 },
      { month: 'Apr', carbon: 3200, transactions: 22, farmers: 16, revenue: 9800000 },
      { month: 'May', carbon: 2950, transactions: 19, farmers: 13, revenue: 8900000 },
      { month: 'Jun', carbon: 3450, transactions: 25, farmers: 18, revenue: 11200000 },
      { month: 'Jul', carbon: 3800, transactions: 28, farmers: 21, revenue: 12500000 },
      { month: 'Aug', carbon: 2600, transactions: 17, farmers: 11, revenue: 7800000 },
      { month: 'Sep', carbon: 3100, transactions: 20, farmers: 15, revenue: 9200000 },
      { month: 'Oct', carbon: 3650, transactions: 26, farmers: 19, revenue: 10800000 },
      { month: 'Nov', carbon: 4200, transactions: 31, farmers: 24, revenue: 13900000 },
      { month: 'Dec', carbon: 4850, transactions: 35, farmers: 28, revenue: 15600000 }
    ],
    wasteCategories: [
      { name: 'Rice Husk', value: 35, amount: 1197, color: '#22c55e', co2: 8575 },
      { name: 'Wheat Straw', value: 28, amount: 958, color: '#16a34a', co2: 6860 },
      { name: 'Sugarcane Bagasse', value: 22, amount: 752, color: '#15803d', co2: 5390 },
      { name: 'Cotton Stalks', value: 15, amount: 513, color: '#166534', co2: 3675 }
    ],
    impactMetrics: [
      { category: 'Environmental', score: 85, target: 90, color: '#22c55e' },
      { category: 'Social', score: 78, target: 85, color: '#3b82f6' },
      { category: 'Governance', score: 92, target: 95, color: '#8b5cf6' }
    ],
    regionalData: [
      { region: 'Punjab', farmers: 28, waste: 980, co2: 7840, color: '#22c55e' },
      { region: 'Haryana', farmers: 21, waste: 756, co2: 6048, color: '#16a34a' },
      { region: 'UP', farmers: 18, waste: 684, co2: 5472, color: '#15803d' },
      { region: 'Rajasthan', farmers: 12, waste: 432, co2: 3456, color: '#166534' },
      { region: 'MP', farmers: 10, waste: 368, co2: 2944, color: '#14532d' }
    ],
    trends: [
      { year: '2021', carbonSaved: 8200, wasteProcessed: 1200, farmers: 25 },
      { year: '2022', carbonSaved: 14600, wasteProcessed: 2100, farmers: 48 },
      { year: '2023', carbonSaved: 19800, wasteProcessed: 2850, farmers: 67 },
      { year: '2024', carbonSaved: 24500, wasteProcessed: 3420, farmers: 89 }
    ]
  };

  // Animation effect
  useEffect(() => {
    setIsAnimating(true);
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;

    const animate = () => {
      for (let i = 0; i <= steps; i++) {
        setTimeout(() => {
          const progress = i / steps;
          setAnimatedValues({
            carbonSaved: Math.floor(actualValues.carbonSaved * progress),
            transactions: Math.floor(actualValues.transactions * progress),
            farmers: Math.floor(actualValues.farmers * progress),
            wasteProcessed: Math.floor(actualValues.wasteProcessed * progress),
            revenue: Math.floor(actualValues.revenue * progress)
          });
        }, i * stepTime);
      }
    };

    const timer = setTimeout(animate, 500);
    return () => clearTimeout(timer);
  }, [selectedPeriod]);

  // Real PDF download function
  const downloadESGReport = () => {
    const reportData = {
      companyName: "Your Company Name",
      reportPeriod: selectedPeriod,
      generatedDate: new Date().toLocaleDateString(),
      metrics: animatedValues,
      summary: `This ESG report demonstrates our commitment to sustainable agriculture practices through the FarmMitra platform. During ${selectedPeriod}, we successfully diverted ${animatedValues.wasteProcessed.toLocaleString()} tons of agricultural waste from burning, preventing ${animatedValues.carbonSaved.toLocaleString()} kg of CO₂ emissions while supporting ${animatedValues.farmers} farming families across India.`
    };

    // Create PDF content as HTML
    const pdfContent = `
      <html>
        <head>
          <title>ESG Impact Report - ${selectedPeriod}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #22c55e; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { color: #22c55e; font-size: 24px; font-weight: bold; }
            .metric { display: inline-block; width: 200px; text-align: center; margin: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .metric-value { font-size: 32px; font-weight: bold; color: #22c55e; }
            .metric-label { color: #666; margin-top: 10px; }
            .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0; }
            .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🌱 FarmMitra</div>
            <h1>ESG Impact Report</h1>
            <p>Period: ${reportData.reportPeriod} | Generated: ${reportData.generatedDate}</p>
          </div>
          
          <div class="metrics">
            <div class="metric">
              <div class="metric-value">${reportData.metrics.carbonSaved.toLocaleString()}</div>
              <div class="metric-label">kg CO₂ Saved</div>
            </div>
            <div class="metric">
              <div class="metric-value">${reportData.metrics.transactions}</div>
              <div class="metric-label">Transactions</div>
            </div>
            <div class="metric">
              <div class="metric-value">${reportData.metrics.farmers}</div>
              <div class="metric-label">Farmers Supported</div>
            </div>
            <div class="metric">
              <div class="metric-value">${reportData.metrics.wasteProcessed.toLocaleString()}</div>
              <div class="metric-label">Tons Processed</div>
            </div>
          </div>
          
          <div class="summary">
            <h2>Executive Summary</h2>
            <p>${reportData.summary}</p>
          </div>
          
          <div class="footer">
            <p>This report was generated automatically by the FarmMitra ESG Dashboard</p>
          </div>
        </body>
      </html>
    `;

    // Create and download the PDF
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FarmMitra-ESG-Report-${selectedPeriod}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const styles = {
    container: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      backgroundColor: '#f8fffe',
      minHeight: '100vh',
      color: '#1f2937'
    },
    header: {
      background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)',
      color: 'white',
      padding: '2rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    },
    headerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
      opacity: 0.1
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '800',
      marginBottom: '0.5rem',
      position: 'relative',
      zIndex: 1
    },
    subtitle: {
      fontSize: '1.1rem',
      opacity: 0.9,
      position: 'relative',
      zIndex: 1
    },
    controls: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1400px',
      margin: '2rem auto',
      padding: '0 2rem'
    },
    periodSelector: {
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center'
    },
    periodButton: {
      padding: '0.5rem 1rem',
      border: '2px solid #d1fae5',
      borderRadius: '8px',
      backgroundColor: 'white',
      color: '#065f46',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '0.9rem',
      fontWeight: '500'
    },
    activePeriod: {
      backgroundColor: '#065f46',
      color: 'white',
      borderColor: '#065f46'
    },
    downloadButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      backgroundColor: '#dc2626',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(220,38,38,0.3)'
    },
    main: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 2rem 2rem'
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    metricCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '2rem',
      textAlign: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #f0f9f0',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },
    metricIcon: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem',
      fontSize: '1.5rem'
    },
    metricValue: {
      fontSize: '2.5rem',
      fontWeight: '800',
      marginBottom: '0.5rem',
      background: 'linear-gradient(135deg, #065f46, #22c55e)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    metricLabel: {
      color: '#6b7280',
      fontSize: '0.95rem',
      fontWeight: '500'
    },
    chartSection: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '2rem',
      marginBottom: '2rem'
    },
    chartCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #f0f9f0'
    },
    chartTitle: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#065f46',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    trendsSection: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
      marginBottom: '2rem'
    },
    impactGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem'
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{ margin: 0, fontWeight: '600', color: '#1f2937' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '4px 0 0 0', color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerOverlay}></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Leaf size={32} />
          <h1 style={styles.title}>FarmMitra ESG Impact Report</h1>
        </div>
        <p style={styles.subtitle}>
          Sustainable Agriculture • Carbon Impact • Social Responsibility
        </p>
      </header>

      <div style={styles.controls}>
        <div style={styles.periodSelector}>
          <span style={{ marginRight: '1rem', fontWeight: '600', color: '#374151' }}>Report Period:</span>
          {['2021', '2022', '2023', '2024'].map(year => (
            <button
              key={year}
              style={{
                ...styles.periodButton,
                ...(selectedPeriod === year ? styles.activePeriod : {})
              }}
              onClick={() => setSelectedPeriod(year)}
            >
              {year}
            </button>
          ))}
        </div>
        
        <button
          style={styles.downloadButton}
          onClick={downloadESGReport}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
        >
          <Download size={18} />
          Download Report
        </button>
      </div>

      <main style={styles.main}>
        {/* Key Metrics */}
        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <div style={{ ...styles.metricIcon, backgroundColor: '#dcfce7', color: '#166534' }}>
              <Leaf size={24} />
            </div>
            <div style={styles.metricValue}>
              {animatedValues.carbonSaved.toLocaleString()}
            </div>
            <div style={styles.metricLabel}>kg CO₂ Emissions Prevented</div>
          </div>
          
          <div style={styles.metricCard}>
            <div style={{ ...styles.metricIcon, backgroundColor: '#dbeafe', color: '#1e40af' }}>
              <TrendingUp size={24} />
            </div>
            <div style={styles.metricValue}>
              {animatedValues.transactions}
            </div>
            <div style={styles.metricLabel}>Sustainable Transactions</div>
          </div>
          
          <div style={styles.metricCard}>
            <div style={{ ...styles.metricIcon, backgroundColor: '#fef3c7', color: '#d97706' }}>
              <Users size={24} />
            </div>
            <div style={styles.metricValue}>
              {animatedValues.farmers}
            </div>
            <div style={styles.metricLabel}>Farmers Empowered</div>
          </div>
          
          <div style={styles.metricCard}>
            <div style={{ ...styles.metricIcon, backgroundColor: '#e0e7ff', color: '#5b21b6' }}>
              <Factory size={24} />
            </div>
            <div style={styles.metricValue}>
              {animatedValues.wasteProcessed.toLocaleString()}
            </div>
            <div style={styles.metricLabel}>Tons Waste Processed</div>
          </div>
          
          <div style={styles.metricCard}>
            <div style={{ ...styles.metricIcon, backgroundColor: '#fce7f3', color: '#be185d' }}>
              <Target size={24} />
            </div>
            <div style={styles.metricValue}>
              ₹{(animatedValues.revenue / 10000000).toFixed(1)}Cr
            </div>
            <div style={styles.metricLabel}>Revenue Generated</div>
          </div>
        </div>

        {/* Main Charts */}
        <div style={styles.chartSection}>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <TrendingUp size={20} />
              Monthly Carbon Impact Trend
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={esgData.monthlyCarbon}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f9f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="carbon" 
                  stroke="#22c55e" 
                  fill="url(#carbonGradient)" 
                  strokeWidth={3}
                />
                <defs>
                  <linearGradient id="carbonGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <Globe size={20} />
              Waste Categories Distribution
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={esgData.wasteCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({name, value}) => `${value}%`}
                >
                  {esgData.wasteCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trends and Regional Data */}
        <div style={styles.trendsSection}>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <Calendar size={20} />
              Year-over-Year Growth
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={esgData.trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f9f0" />
                <XAxis dataKey="year" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="carbonSaved" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="farmers" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <Award size={20} />
              ESG Performance Scores
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart data={esgData.impactMetrics} innerRadius="30%" outerRadius="90%">
                <RadialBar dataKey="score" cornerRadius={10} fill="#22c55e" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Impact */}
        <div style={styles.impactGrid}>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <Truck size={20} />
              Regional Impact Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={esgData.regionalData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f9f0" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="region" type="category" stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="co2" fill="#22c55e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <FileText size={20} />
              Impact Summary
            </h3>
            <div style={{ padding: '1rem 0' }}>
              {esgData.wasteCategories.map((category, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>{category.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                      {category.amount} tons processed
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '700', color: category.color }}>
                      {category.co2.toLocaleString()} kg
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                      CO₂ prevented
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ESGReportsDashboard;