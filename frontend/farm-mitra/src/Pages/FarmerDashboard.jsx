import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, Leaf, DollarSign, Package, Bell, User, Search, Filter, MapPin, Calendar, Eye, MessageCircle, BarChart3, Award, Recycle, ArrowLeft } from 'lucide-react';
import LogoutButton from '../components/Logout';
import ChatbotRedirectButton from '../components/Chatbot';
import ListRedirectButton from '../components/Lis';
import RedirectButton from '../components/Communi';
const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [carbonSaved, setCarbonSaved] = useState(0);
  const [wasteRecycled, setWasteRecycled] = useState(0);
  const [activeListings, setActiveListings] = useState(0);
  const [wasteListings, setWasteListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [location, setLocation] = useState("");
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzerError, setAnalyzerError] = useState("");

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid #e5e7eb'
    },
    headerContent: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '64px'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    logoIcon: {
      width: '32px',
      height: '32px',
      backgroundColor: '#16a34a',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    main: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '32px 16px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      padding: '24px'
    },
    tabBar: {
      display: 'flex',
      gap: '4px',
      marginBottom: '32px',
      backgroundColor: '#f3f4f6',
      borderRadius: '8px',
      padding: '4px'
    },
    tab: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: 'none',
      background: 'none'
    },
    activeTab: {
      backgroundColor: 'white',
      color: '#111827',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
    },
    inactiveTab: {
      color: '#6b7280'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      padding: '24px'
    },
    listingsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px'
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.2s'
    },
    primaryButton: {
      backgroundColor: '#16a34a',
      color: 'white'
    },
    secondaryButton: {
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: '1px solid #d1d5db'
    }
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/farmer/dashboard/stats`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      if (data.success) {
        setTotalEarnings(data.stats.totalEarnings);
        setCarbonSaved(data.stats.carbonSaved);
        setWasteRecycled(data.stats.wasteRecycled);
        setActiveListings(data.stats.activeListings);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard stats');
    }
  };

  // Fetch farmer's listings
  const fetchListings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/farmer/listings`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch listings');
      const data = await response.json();
      if (data.success) {
        // Transform API data to match component format
        const transformedListings = data.listings.map(listing => ({
          id: listing._id,
          type: listing.wasteType,
          quantity: listing.quantity,
          price: listing.price,
          location: listing.location,
          status: listing.status,
          inquiries: listing.inquiries || 0,
          co2Savings: listing.carbonSaving || listing.co2Footprint || '0 kg CO₂',
          image: listing.image || '🌾'
        }));
        setWasteListings(transformedListings);
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to load listings');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchListings()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const sampleAnalysis = {
    "rice straw": { category: "crop residue", mspPrice: "₹2-4 per kg", expectedProcess: "Composting, Biogas production", co2Footprint: "0.8 kg CO2/kg" },
    "wheat straw": { category: "crop residue", mspPrice: "₹3-5 per kg", expectedProcess: "Animal feed, Mushroom cultivation", co2Footprint: "0.7 kg CO2/kg" },
    "sugarcane bagasse": { category: "processing waste", mspPrice: "₹1-2 per kg", expectedProcess: "Paper production, Biofuel", co2Footprint: "0.3 kg CO2/kg" }
  };

  const analyzeWithSampleData = () => {
    const desc = description.toLowerCase();
    let matchedData = sampleAnalysis["rice straw"];
    for (const [key, data] of Object.entries(sampleAnalysis)) {
      if (desc.includes(key.split(' ')[0])) { matchedData = data; break; }
    }
    const amountNum = parseFloat(amount) || 0;
    const co2Total = (parseFloat(matchedData.co2Footprint) * amountNum).toFixed(2);
    return { ...matchedData, totalCo2Footprint: `${co2Total} kg CO2`, estimatedValue: `₹${(amountNum * 3.5).toFixed(2)} - ₹${(amountNum * 6).toFixed(2)}` };
  };

  const handleAnalyze = async () => {
    if (!description || !amount) { setAnalyzerError("Please enter description and amount"); return; }
    setAnalyzerError(""); setAnalyzing(true);
    setTimeout(() => {
      try { 
        const analysis = analyzeWithSampleData(); 
        setResult(analysis); 
      } catch (e) { 
        setAnalyzerError("Analysis failed"); 
      } finally { 
        setAnalyzing(false); 
      }
    }, 1500);
  };

  const addToListings = async () => {
    if (!result) return;
    try {
      const listingData = {
        wasteType: description.charAt(0).toUpperCase() + description.slice(1),
        quantity: `${amount} kg`,
        price: result.mspPrice,
        location: location || 'Not specified',
        status: 'Active',
        carbonSaving: result.totalCo2Footprint,
        co2Footprint: result.totalCo2Footprint,
        category: result.category,
        expectedProcess: result.expectedProcess,
        image: '🌱',
        description: description
      };

      const response = await fetch(`${API_BASE_URL}/farmer/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(listingData)
      });

      if (!response.ok) throw new Error('Failed to create listing');
      const data = await response.json();
      
      if (data.success) {
        // Refresh listings and stats
        await fetchListings();
        await fetchStats();
        setDescription(""); 
        setAmount(""); 
        setLocation(""); 
        setResult(null);
        setActiveTab('listings'); 
        setShowAnalyzer(false);
      }
    } catch (err) {
      console.error('Error creating listing:', err);
      setError('Failed to create listing');
    }
  };

  if (showAnalyzer) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.card, maxWidth: '800px', margin: '32px auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <button onClick={() => setShowAnalyzer(false)} style={{ ...styles.button, marginRight: '16px' }}>
              <ArrowLeft size={20} />
            </button>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#166534' }}>🌾 Waste Analyzer</h1>
          </div>
          
          <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Waste Description</label>
              <textarea 
                rows={3} 
                style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box' }} 
                placeholder="e.g., rice straw, wheat straw, sugarcane bagasse" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Amount (kg)</label>
                <input 
                  type="number" 
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box' }} 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Location</label>
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box' }} 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleAnalyze} 
            disabled={analyzing} 
            style={{ ...styles.button, ...styles.primaryButton, width: '100%', marginBottom: '16px' }}
          >
            {analyzing ? "🔄 Analyzing..." : "🤖 Analyze Waste"}
          </button>

          {analyzerError && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              {analyzerError}
            </div>
          )}

          {result && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>📊 Analysis Results</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div><strong>Category:</strong> {result.category}</div>
                <div><strong>Market Price:</strong> {result.mspPrice}</div>
                <div><strong>Processing:</strong> {result.expectedProcess}</div>
                <div><strong>CO₂ Impact:</strong> {result.totalCo2Footprint}</div>
                <div><strong>Estimated Value:</strong> {result.estimatedValue}</div>
              </div>
              <button 
                onClick={addToListings} 
                style={{ ...styles.button, backgroundColor: '#2563eb', color: 'white', marginTop: '16px' }}
              >
                ✅ Add to Listings
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <Leaf size={20} color="white" />
            </div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#166534' }}>FarmMitra</h1>
            <span style={{ fontSize: '14px', color: '#6b7280', marginLeft: '16px' }}>Farmer Dashboard</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <RedirectButton/>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ListRedirectButton/>
              <ChatbotRedirectButton/>
              <LogoutButton/>
            </div>
          </div>
        </div>
      </header>

      <div style={styles.main}>
        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
            {error}
          </div>
        )}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Welcome back ! 🌱</h2>
          <p style={{ color: '#6b7280' }}>Transform your agricultural waste into sustainable income.</p>
        </div>

        <div style={styles.statsGrid}>
          {[
            { icon: DollarSign, value: `₹${totalEarnings.toLocaleString()}`, label: 'Total Earnings', color: '#16a34a' },
            { icon: Recycle, value: `${carbonSaved.toLocaleString()} kg`, label: 'CO₂ Saved', color: '#2563eb' },
            { icon: Package, value: wasteRecycled, label: 'Tons Recycled', color: '#ea580c' },
            { icon: BarChart3, value: activeListings, label: 'Active Listings', color: '#7c3aed' }
          ].map((stat, idx) => (
            <div key={idx} style={styles.statCard}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: `${stat.color}20`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <stat.icon size={20} color={stat.color} />
                </div>
                <TrendingUp size={16} color={stat.color} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '4px' }}>{stat.value}</h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div style={styles.tabBar}>
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'listings', label: 'My Listings', icon: Package },
            { id: 'inquiries', label: 'Inquiries', icon: MessageCircle }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              style={{
                ...styles.tab,
                ...(activeTab === tab.id ? styles.activeTab : styles.inactiveTab)
              }}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'listings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>My Waste Listings</h3>
              <button 
                onClick={() => setShowAnalyzer(true)} 
                style={{ ...styles.button, ...styles.primaryButton }}
              >
                <Plus size={16} />
                <span>Add New Listing</span>
              </button>
            </div>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
                Loading listings...
              </div>
            ) : wasteListings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
                No listings yet. Create your first listing!
              </div>
            ) : (
              <div style={styles.listingsGrid}>
                {wasteListings.map(listing => (
                  <div key={listing.id} style={styles.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontSize: '2rem' }}>{listing.image}</div>
                    <span style={{ 
                      padding: '4px 8px', 
                      fontSize: '12px', 
                      fontWeight: '500', 
                      borderRadius: '12px',
                      backgroundColor: listing.status === 'Active' ? '#dcfce7' : '#f3f4f6',
                      color: listing.status === 'Active' ? '#166534' : '#374151'
                    }}>
                      {listing.status}
                    </span>
                  </div>
                  
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '12px' }}>{listing.type}</h4>
                  <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <Package size={16} />
                      <span>{listing.quantity}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <DollarSign size={16} />
                      <span>{listing.price}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <MapPin size={16} />
                      <span>{listing.location}</span>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={16} color="#9ca3af" />
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>{listing.inquiries} inquiries</span>
                    </div>
                    <button style={{ fontSize: '14px', color: '#16a34a', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}>
                      View Details
                    </button>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'overview' && (
          <div style={styles.card}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '24px' }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { icon: DollarSign, title: 'Payment Received', desc: '₹15,000 for Sugarcane Bagasse', time: '2 hours ago', color: '#16a34a' },
                { icon: MessageCircle, title: 'New Inquiry', desc: 'Green Energy Corp interested in Rice Husk', time: '5 hours ago', color: '#2563eb' },
                { icon: Leaf, title: 'Carbon Impact', desc: 'You saved 145 kg CO₂ this week!', time: '1 day ago', color: '#16a34a' }
              ].map((activity, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: `${activity.color}10`, borderRadius: '8px' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: `${activity.color}20`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <activity.icon size={20} color={activity.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '500', marginBottom: '4px' }}>{activity.title}</p>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>{activity.desc}</p>
                  </div>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div style={styles.card}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '24px' }}>Recent Inquiries</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { buyer: 'Green Energy Corp', product: 'Rice Husk - 15 tons', message: 'Interested in bulk purchase for biofuel production', time: '2 hours ago', status: 'new' },
                { buyer: 'EcoPackaging Ltd', product: 'Sugarcane Bagasse - 10 tons', message: 'Need samples for packaging material testing', time: '5 hours ago', status: 'replied' }
              ].map((inquiry, idx) => (
                <div key={idx} style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>{inquiry.buyer}</h4>
                      <p style={{ fontSize: '14px', color: '#6b7280' }}>{inquiry.product}</p>
                    </div>
                    <span style={{ 
                      padding: '4px 8px', 
                      fontSize: '12px', 
                      borderRadius: '12px',
                      backgroundColor: inquiry.status === 'new' ? '#dbeafe' : '#dcfce7',
                      color: inquiry.status === 'new' ? '#1d4ed8' : '#166534'
                    }}>
                      {inquiry.status === 'new' ? 'New' : 'Replied'}
                    </span>
                  </div>
                  <p style={{ marginBottom: '16px', color: '#374151' }}>{inquiry.message}</p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ ...styles.button, ...styles.primaryButton }}>Reply</button>
                    <button style={{ ...styles.button, ...styles.secondaryButton }}>View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;