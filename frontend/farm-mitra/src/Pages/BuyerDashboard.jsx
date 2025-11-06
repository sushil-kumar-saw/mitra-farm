import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Leaf, TrendingUp, ShoppingCart, Bell, User, BarChart3, Settings,
  Star, Heart
} from 'lucide-react';
import ButtonList from '../components/AnalyticButton';

const LogoutButton = () => (
  <button style={{
    padding: '8px 16px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }}>
    Logout
  </button>
);

const BuyerDashboard = () => {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [carbonSaved, setCarbonSaved] = useState(0);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [activeTrans, setActiveTrans] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    const timer1 = setInterval(() => setCarbonSaved(prev => (prev < 2845 ? prev + 47 : 2845)), 50);
    const timer2 = setInterval(() => setTotalPurchases(prev => (prev < 156 ? prev + 3 : 156)), 80);
    const timer3 = setInterval(() => setActiveTrans(prev => (prev < 23 ? prev + 1 : 23)), 120);
    const loadingTimer = setTimeout(() => setIsLoading(false), 1500);

    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
      clearInterval(timer3);
      clearTimeout(loadingTimer);
    };
  }, []);

 const wasteListings = [
  { id: 1, farmer: "Rajesh Kumar", location: "Punjab, IN", wasteType: "Rice Husk", quantity: "500 kg", price: "₹15/kg", carbonSaving: "2.3 tons CO₂", image: "./public/images/istockphoto-607884592-612x612.jpg", rating: 4.8, distance: "12 km", freshness: "2 days ago", tags: ["Organic","Premium"] },
  { id: 2, farmer: "Priya Sharma", location: "Haryana, IN", wasteType: "Wheat Straw", quantity: "750 kg", price: "₹12/kg", carbonSaving: "3.1 tons CO₂", image: "./public/images/wheat-straw.jpg", rating: 4.9, distance: "8 km", freshness: "1 day ago", tags: ["Bulk","Quality"] },
  { id: 3, farmer: "Amit Patel", location: "Gujarat, IN", wasteType: "Sugarcane Bagasse", quantity: "1200 kg", price: "₹18/kg", carbonSaving: "4.7 tons CO₂", image: "./public/images/sugar-cane.jpg", rating: 4.7, distance: "25 km", freshness: "3 hours ago", tags: ["Fresh","Bulk"] },
  { id: 4, farmer: "Sunita Verma", location: "Uttar Pradesh, IN", wasteType: "Cotton Stalks", quantity: "400 kg", price: "₹10/kg", carbonSaving: "1.5 tons CO₂", image: "./public/images/cotton.jpg", rating: 4.3, distance: "18 km", freshness: "5 hours ago", tags: ["Organic"] },
  { id: 5, farmer: "Karan Singh", location: "Rajasthan, IN", wasteType: "Corn Cob", quantity: "600 kg", price: "₹14/kg", carbonSaving: "2.0 tons CO₂", image: "./public/images/corn.jpg", rating: 4.5, distance: "10 km", freshness: "1 day ago", tags: ["Quality","Bulk"] },
  { id: 6, farmer: "Neha Joshi", location: "Punjab, IN", wasteType: "Rice Husk", quantity: "650 kg", price: "₹16/kg", carbonSaving: "2.8 tons CO₂", image: "./public/images/istockphoto-607884592-612x612.jpg", rating: 4.6, distance: "15 km", freshness: "3 days ago", tags: ["Premium"] },
  { id: 7, farmer: "Vikram Malhotra", location: "Haryana, IN", wasteType: "Wheat Straw", quantity: "800 kg", price: "₹13/kg", carbonSaving: "3.3 tons CO₂", image: "./public/images/wheat-straw.jpg", rating: 4.8, distance: "9 km", freshness: "2 days ago", tags: ["Bulk"] },
  { id: 8, farmer: "Meena Gupta", location: "Gujarat, IN", wasteType: "Sugarcane Bagasse", quantity: "1100 kg", price: "₹17/kg", carbonSaving: "4.2 tons CO₂", image: "./public/images/sugar-cane.jpg", rating: 4.4, distance: "28 km", freshness: "4 hours ago", tags: ["Fresh"] },
  { id: 9, farmer: "Ramesh Yadav", location: "Uttar Pradesh, IN", wasteType: "Cotton Stalks", quantity: "450 kg", price: "₹11/kg", carbonSaving: "1.7 tons CO₂", image: "./public/images/cotton.jpg", rating: 4.1, distance: "20 km", freshness: "6 hours ago", tags: ["Organic"] },
  { id: 10, farmer: "Anjali Desai", location: "Rajasthan, IN", wasteType: "Corn Cob", quantity: "550 kg", price: "₹13/kg", carbonSaving: "1.8 tons CO₂", image: "./public/images/corn.jpg", rating: 4.6, distance: "11 km", freshness: "2 days ago", tags: ["Quality"] },
  { id: 11, farmer: "Suresh Patil", location: "Maharashtra, IN", wasteType: "Rice Husk", quantity: "700 kg", price: "₹15/kg", carbonSaving: "3.0 tons CO₂", image: "./public/images/istockphoto-607884592-612x612.jpg", rating: 4.7, distance: "14 km", freshness: "1 day ago", tags: ["Organic","Premium"] },
  { id: 12, farmer: "Pooja Reddy", location: "Telangana, IN", wasteType: "Wheat Straw", quantity: "900 kg", price: "₹14/kg", carbonSaving: "3.5 tons CO₂", image: "./public/images/wheat-straw.jpg", rating: 4.9, distance: "7 km", freshness: "3 days ago", tags: ["Bulk","Quality"] },
  { id: 13, farmer: "Manoj Kumar", location: "Bihar, IN", wasteType: "Sugarcane Bagasse", quantity: "1150 kg", price: "₹19/kg", carbonSaving: "5.0 tons CO₂", image: "./public/images/sugar-cane.jpg", rating: 4.8, distance: "22 km", freshness: "2 hours ago", tags: ["Fresh","Bulk"] },
  { id: 14, farmer: "Kavita Singh", location: "Jharkhand, IN", wasteType: "Cotton Stalks", quantity: "500 kg", price: "₹12/kg", carbonSaving: "1.9 tons CO₂", image: "./public/images/cotton.jpg", rating: 4.2, distance: "17 km", freshness: "5 hours ago", tags: ["Organic"] },
  { id: 15, farmer: "Rohit Sharma", location: "Madhya Pradesh, IN", wasteType: "Corn Cob", quantity: "650 kg", price: "₹15/kg", carbonSaving: "2.1 tons CO₂", image: "./public/images/corn.jpg", rating: 4.5, distance: "13 km", freshness: "1 day ago", tags: ["Bulk","Quality"] },
  { id: 16, farmer: "Sanjay Joshi", location: "Punjab, IN", wasteType: "Rice Husk", quantity: "520 kg", price: "₹16/kg", carbonSaving: "2.5 tons CO₂", image: "./public/images/istockphoto-607884592-612x612.jpg", rating: 4.6, distance: "12 km", freshness: "3 days ago", tags: ["Premium"] },
  { id: 17, farmer: "Neelam Verma", location: "Haryana, IN", wasteType: "Wheat Straw", quantity: "780 kg", price: "₹13/kg", carbonSaving: "3.2 tons CO₂", image: "./public/images/wheat-straw.jpg", rating: 4.7, distance: "8 km", freshness: "1 day ago", tags: ["Bulk"] },
  { id: 18, farmer: "Ajay Patel", location: "Gujarat, IN", wasteType: "Sugarcane Bagasse", quantity: "1250 kg", price: "₹18/kg", carbonSaving: "4.8 tons CO₂", image: "./public/images/sugar-cane.jpg", rating: 4.5, distance: "26 km", freshness: "4 hours ago", tags: ["Fresh"] },
  { id: 19, farmer: "Sheetal Yadav", location: "Uttar Pradesh, IN", wasteType: "Cotton Stalks", quantity: "480 kg", price: "₹11/kg", carbonSaving: "1.6 tons CO₂", image: "./public/images/cotton.jpg", rating: 4.3, distance: "19 km", freshness: "6 hours ago", tags: ["Organic"] },
  { id: 20, farmer: "Deepak Desai", location: "Rajasthan, IN", wasteType: "Corn Cob", quantity: "580 kg", price: "₹14/kg", carbonSaving: "1.9 tons CO₂", image: "./public/images/corn.jpg", rating: 4.4, distance: "10 km", freshness: "2 days ago", tags: ["Quality"] }
];

  const filterOptions = [
    { id:'rice-husk', label:'Rice Husk' },
    { id:'wheat-straw', label:'Wheat Straw' },
    { id:'sugarcane', label:'Sugarcane Bagasse' },
    { id:'cotton-stalks', label:'Cotton Stalks' },
    { id:'corn-cob', label:'Corn Cob' }
  ];

  const toggleFilter = (id) =>
    setSelectedFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  if (isLoading) return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      <Leaf size={48} style={{ color: '#16a34a', marginBottom: '16px' }} />
      <h2 style={{ marginBottom: '16px', color: '#334155' }}>Loading FarmMitra...</h2>
      <div style={{
        width: '200px',
        height: '4px',
        backgroundColor: '#e2e8f0',
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#16a34a',
          animation: 'loading 2s ease-in-out infinite'
        }} />
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );

  const filteredListings = wasteListings.filter(listing => {
    if (selectedFilters.length > 0) {
      const mapping = {
        'rice-husk': 'Rice Husk',
        'wheat-straw': 'Wheat Straw',
        'sugarcane': 'Sugarcane Bagasse',
        'cotton-stalks': 'Cotton Stalks',
        'corn-cob': 'Corn Cob'
      };
      if (!selectedFilters.some(f => listing.wasteType === mapping[f])) return false;
    }
    const q = searchQuery.toLowerCase();
    if (q && !(
      listing.wasteType.toLowerCase().includes(q) ||
      listing.farmer.toLowerCase().includes(q) ||
      listing.location.toLowerCase().includes(q)
    )) return false;
    return true;
  });

  const favoriteListings = wasteListings.filter(listing => favorites.has(listing.id));

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#16a34a',
    color: 'white',
    padding: '16px 24px'
  };

  const logoSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const statCardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const navTabsStyle = {
    display: 'flex',
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
    padding: '0 24px'
  };

  const tabButtonStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 24px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    borderBottom: isActive ? '2px solid #16a34a' : '2px solid transparent',
    color: isActive ? '#16a34a' : '#64748b'
  });

  const marketplaceLayoutStyle = {
    display: 'flex',
    gap: '24px',
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto'
  };

  const sidebarStyle = {
    width: '280px',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    height: 'fit-content',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const listingsSectionStyle = {
    flex: 1
  };

  const searchContainerStyle = {
    position: 'relative',
    marginBottom: '24px'
  };

  const searchInputStyle = {
    width: '100%',
    padding: '12px 12px 12px 40px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px'
  };

  const listingsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px'
  };

  const listingCardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease',
    cursor: 'pointer'
  };

  const listingImageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  };

  const listingDetailsStyle = {
    padding: '16px'
  };

  const favoriteButtonStyle = (isFavorited) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: isFavorited ? '#ef4444' : '#16a34a',
    color: 'white',
    marginTop: '12px'
  });

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={logoSectionStyle}>
          <Leaf size={24} />
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>FarmMitra</span>
          <span style={{ 
            backgroundColor: 'rgba(255,255,255,0.2)', 
            padding: '4px 8px', 
            borderRadius: '4px', 
            fontSize: '12px' 
          }}>
            Buyer Portal
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{ 
            backgroundColor: 'transparent', 
            border: 'none', 
            color: 'white', 
            cursor: 'pointer',
            position: 'relative'
          }}>
            <Bell size={24} />
            <span style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '8px',
              height: '8px',
              backgroundColor: '#ef4444',
              borderRadius: '50%'
            }} />
          </button>
          <ButtonList/>
          <LogoutButton />
        </div>
      </header>

      <div style={statsGridStyle}>
        {[{
          label: 'Carbon Saved',
          value: carbonSaved.toLocaleString(),
          unit: 'tons CO₂ equivalent',
          icon: Leaf,
          color: '#16a34a'
        }, {
          label: 'Total Purchases',
          value: totalPurchases,
          unit: 'successful transactions',
          icon: ShoppingCart,
          color: '#3b82f6'
        }, {
          label: 'Active Deals',
          value: activeTrans,
          unit: 'ongoing negotiations',
          icon: TrendingUp,
          color: '#f59e0b'
        }].map(({ label, value, unit, icon: Icon, color }) => (
          <div key={label} style={statCardStyle}>
            <div>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>{label}</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}>
                {value}
              </p>
              <p style={{ color: '#64748b', fontSize: '12px' }}>{unit}</p>
            </div>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: `${color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Icon size={24} style={{ color }} />
            </div>
          </div>
        ))}
      </div>

      <nav style={navTabsStyle}>
        {[
          { id: 'marketplace', label: 'Marketplace', icon: Search },
          { id: 'orders', label: 'My Orders', icon: ShoppingCart },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={tabButtonStyle(activeTab === tab.id)}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {activeTab === 'marketplace' && (
        <div style={marketplaceLayoutStyle}>
          <aside style={sidebarStyle}>
            <h3 style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginBottom: '24px',
              color: '#1e293b'
            }}>
              <Filter size={20} /> Filters
            </h3>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontWeight: 'bold', 
                marginBottom: '12px',
                color: '#374151'
              }}>
                Waste Type
              </label>
              {filterOptions.map(({ id, label }) => (
                <label key={id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginBottom: '8px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(id)}
                    onChange={() => toggleFilter(id)}
                    style={{ marginRight: '8px' }}
                  />
                  {label}
                </label>
              ))}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontWeight: 'bold', 
                marginBottom: '12px',
                color: '#374151'
              }}>
                Distance
              </label>
              <select style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}>
                <option>Any distance</option>
                <option>Within 10 km</option>
                <option>Within 25 km</option>
                <option>Within 50 km</option>
              </select>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontWeight: 'bold', 
                marginBottom: '12px',
                color: '#374151'
              }}>
                Price Range
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="number" 
                  placeholder="Min" 
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                />
                <input 
                  type="number" 
                  placeholder="Max" 
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                />
              </div>
            </div>
          </aside>

          <section style={listingsSectionStyle}>
            <div style={searchContainerStyle}>
              <Search 
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} 
                size={20} 
              />
              <input
                type="text"
                placeholder="Search agricultural waste..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={searchInputStyle}
              />
            </div>

            {filteredListings.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', fontSize: '18px' }}>
                No listings found.
              </p>
            ) : (
              <div style={listingsGridStyle}>
                {filteredListings.map(listing => (
                  <div 
                    key={listing.id} 
                    style={listingCardStyle}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    <img 
                      src={listing.image} 
                      alt={listing.wasteType} 
                      style={listingImageStyle}
                    />
                    <div style={listingDetailsStyle}>
                      <h4 style={{ marginBottom: '12px', color: '#1e293b' }}>
                        {listing.wasteType}
                      </h4>
                      <p style={{ marginBottom: '4px', fontSize: '14px' }}>
                        <strong>Farmer:</strong> {listing.farmer}
                      </p>
                      <p style={{ marginBottom: '4px', fontSize: '14px' }}>
                        <strong>Location:</strong> {listing.location}
                      </p>
                      <p style={{ marginBottom: '4px', fontSize: '14px' }}>
                        <strong>Quantity:</strong> {listing.quantity}
                      </p>
                      <p style={{ marginBottom: '4px', fontSize: '14px' }}>
                        <strong>Price:</strong> {listing.price}
                      </p>
                      <p style={{ marginBottom: '4px', fontSize: '14px' }}>
                        <strong>Carbon Saving:</strong> {listing.carbonSaving}
                      </p>
                      <p style={{ marginBottom: '4px', fontSize: '14px' }}>
                        <strong>Distance:</strong> {listing.distance} km
                      </p>
                      <p style={{ marginBottom: '4px', fontSize: '14px' }}>
                        <strong>Freshness:</strong> {listing.freshness}
                      </p>
                      <p style={{ 
                        marginBottom: '4px', 
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <strong>Rating:</strong> {listing.rating} 
                        <Star size={14} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                      </p>
                      <button 
                        style={favoriteButtonStyle(favorites.has(listing.id))}
                        onClick={() => toggleFavorite(listing.id)}
                      >
                        <Heart size={16} />
                        {favorites.has(listing.id) ? 'Remove Order' : 'Add to Order'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {activeTab === 'orders' && (
        <section style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '24px', color: '#1e293b' }}>My Orders (Favorites)</h2>
          {favoriteListings.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '18px' }}>
              You have no favorite listings yet.
            </p>
          ) : (
            <div style={listingsGridStyle}>
              {favoriteListings.map(listing => (
                <div key={listing.id} style={listingCardStyle}>
                  <img 
                    src={listing.image} 
                    alt={listing.wasteType} 
                    style={listingImageStyle}
                  />
                  <div style={listingDetailsStyle}>
                    <h4 style={{ marginBottom: '12px', color: '#1e293b' }}>
                      {listing.wasteType}
                    </h4>
                    <p style={{ marginBottom: '4px', fontSize: '14px' }}>
                      <strong>Farmer:</strong> {listing.farmer}
                    </p>
                    <p style={{ marginBottom: '4px', fontSize: '14px' }}>
                      <strong>Location:</strong> {listing.location}
                    </p>
                    <p style={{ marginBottom: '4px', fontSize: '14px' }}>
                      <strong>Quantity:</strong> {listing.quantity}
                    </p>
                    <p style={{ marginBottom: '4px', fontSize: '14px' }}>
                      <strong>Price:</strong> {listing.price}
                    </p>
                    <p style={{ marginBottom: '4px', fontSize: '14px' }}>
                      <strong>Carbon Saving:</strong> {listing.carbonSaving}
                    </p>
                    <p style={{ marginBottom: '4px', fontSize: '14px' }}>
                      <strong>Distance:</strong> {listing.distance} km
                    </p>
                    <p style={{ marginBottom: '4px', fontSize: '14px' }}>
                      <strong>Freshness:</strong> {listing.freshness}
                    </p>
                    <p style={{ 
                      marginBottom: '4px', 
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <strong>Rating:</strong> {listing.rating} 
                      <Star size={14} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                    </p>
                    <button 
                      style={favoriteButtonStyle(true)}
                      onClick={() => toggleFavorite(listing.id)}
                    >
                      <Heart size={16} />
                      Remove Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default BuyerDashboard;