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
  const [wasteListings, setWasteListings] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState("");
  const [buyingListingId, setBuyingListingId] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  // Fetch buyer dashboard stats
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/buyer/dashboard/stats`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      if (data.success) {
        setCarbonSaved(data.stats.carbonSaved);
        setTotalPurchases(data.stats.totalPurchases);
        setActiveTrans(data.stats.activeTransactions);
      }
    } catch (err) {
      console.error('Error fetching buyer stats:', err);
      setError('Failed to load dashboard stats');
    }
  };

  // Fetch marketplace listings
  const fetchMarketplaceListings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/buyer/marketplace`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch listings');
      const data = await response.json();
      if (data.success) {
        // Transform API data to match component format
        const transformedListings = data.listings.map((listing, idx) => ({
          id: listing._id || idx + 1,
          _id: listing._id,
          farmer: listing.farmerName || (listing.farmerId?.name || 'Unknown'),
          location: listing.location,
          wasteType: listing.wasteType,
          quantity: listing.quantity,
          price: listing.price,
          carbonSaving: listing.carbonSaving || listing.co2Footprint || '0 kg CO₂',
          image: listing.image || './public/images/istockphoto-607884592-612x612.jpg',
          rating: listing.rating || 4.5,
          distance: listing.distance || 'N/A',
          freshness: listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : 'Unknown',
          tags: listing.tags || []
        }));
        setWasteListings(transformedListings);
      }
    } catch (err) {
      console.error('Error fetching marketplace listings:', err);
      setError('Failed to load marketplace listings');
    }
  };

  // Fetch purchases
  const fetchPurchases = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/buyer/purchases`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch purchases');
      const data = await response.json();
      if (data.success) {
        setPurchases(data.purchases);
      }
    } catch (err) {
      console.error('Error fetching purchases:', err);
      setError('Failed to load purchases');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchStats(), fetchMarketplaceListings(), fetchPurchases()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Handle purchase
  const handlePurchase = async (listingId) => {
    if (!listingId) return;
    
    setBuyingListingId(listingId);
    try {
      const response = await fetch(`${API_BASE_URL}/buyer/purchases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ listingId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to purchase');
      }

      const data = await response.json();
      
      if (data.success) {
        // Refresh data
        await Promise.all([fetchStats(), fetchMarketplaceListings(), fetchPurchases()]);
        setError('');
        alert('Purchase successful!');
      }
    } catch (err) {
      console.error('Error purchasing:', err);
      setError(err.message || 'Failed to purchase listing');
    } finally {
      setBuyingListingId(null);
    }
  };

  // Handle inquiry/increment view count
  const handleInquire = async (listingId) => {
    try {
      await fetch(`${API_BASE_URL}/buyer/listings/${listingId}/inquire`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Error updating inquiry:', err);
    }
  };

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
      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px', margin: '16px', borderRadius: '8px' }}>
          {error}
        </div>
      )}
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
          { id: 'orders', label: 'My Purchases', icon: ShoppingCart },
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
                        onClick={() => {
                          toggleFavorite(listing.id);
                          handleInquire(listing.id);
                        }}
                      >
                        <Heart size={16} />
                        {favorites.has(listing.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                      </button>
                      <button 
                        style={{
                          ...favoriteButtonStyle(false),
                          backgroundColor: '#16a34a',
                          marginTop: '8px',
                          width: '100%'
                        }}
                        onClick={() => handlePurchase(listing._id || listing.id)}
                        disabled={buyingListingId === (listing._id || listing.id)}
                      >
                        <ShoppingCart size={16} />
                        {buyingListingId === (listing._id || listing.id) ? 'Processing...' : 'Buy Now'}
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
          <h2 style={{ marginBottom: '24px', color: '#1e293b' }}>My Purchases</h2>
          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
              {error}
            </div>
          )}
          {isLoading ? (
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '18px' }}>
              Loading purchases...
            </p>
          ) : purchases.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '18px' }}>
              You haven't made any purchases yet. Browse the marketplace to buy agricultural waste!
            </p>
          ) : (
            <div style={listingsGridStyle}>
              {purchases.map(purchase => (
                <div key={purchase._id} style={listingCardStyle}>
                  <div style={{ ...listingImageStyle, backgroundColor: '#e8f5e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
                    {purchase.listingId?.image || '🌾'}
                  </div>
                  <div style={listingDetailsStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <h4 style={{ marginBottom: '0', color: '#1e293b' }}>
                        {purchase.wasteType}
                    </h4>
                      <span style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        borderRadius: '12px',
                        backgroundColor: purchase.status === 'Completed' ? '#dcfce7' : purchase.status === 'Confirmed' ? '#dbeafe' : '#fef3c7',
                        color: purchase.status === 'Completed' ? '#166534' : purchase.status === 'Confirmed' ? '#1d4ed8' : '#92400e'
                      }}>
                        {purchase.status}
                      </span>
                    </div>
                    <p style={{ marginBottom: '4px', fontSize: '14px' }}>
                      <strong>Farmer:</strong> {purchase.farmerId?.name || purchase.listingId?.farmerName || 'Unknown'}
                    </p>
                    <p style={{ marginBottom: '4px', fontSize: '14px' }}>
                      <strong>Quantity:</strong> {purchase.quantity}
                    </p>
                    <p style={{ marginBottom: '4px', fontSize: '14px' }}>
                      <strong>Price:</strong> {purchase.price}
                    </p>
                    {purchase.totalAmount && (
                      <p style={{ marginBottom: '4px', fontSize: '14px', fontWeight: 'bold', color: '#16a34a' }}>
                        <strong>Total Amount:</strong> ₹{purchase.totalAmount.toLocaleString()}
                    </p>
                    )}
                    <p style={{ marginBottom: '4px', fontSize: '14px' }}>
                      <strong>Carbon Saving:</strong> {purchase.carbonSaving || 'N/A'}
                    </p>
                    <p style={{ marginBottom: '4px', fontSize: '12px', color: '#64748b' }}>
                      Purchased: {new Date(purchase.createdAt).toLocaleDateString()}
                    </p>
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