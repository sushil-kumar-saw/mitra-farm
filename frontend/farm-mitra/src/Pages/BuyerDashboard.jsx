import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Leaf, TrendingUp, ShoppingCart, Bell, User, BarChart3, Settings,
  Heart, MessageCircle, CreditCard
} from 'lucide-react';
import ButtonList from '../components/AnalyticButton';
import LogoutButton from '../components/Logout';

// Helper function to get default image path for waste type
const getDefaultImage = (wasteType) => {
  if (!wasteType) return '/images/istockphoto-607884592-612x612.jpg';
  
  const type = wasteType.toLowerCase().trim();
  
  // Map to actual image files in public/images folder
  if (type.includes('rice husk') || type === 'rice husk' || type.includes('rice')) {
    return '/images/istockphoto-607884592-612x612.jpg'; // Generic rice/wheat image
  }
  if (type.includes('wheat straw') || type === 'wheat straw' || type.includes('wheat')) {
    return '/images/wheat-straw.jpg';
  }
  if (type.includes('sugarcane bagasse') || type.includes('bagasse') || type.includes('sugarcane')) {
    return '/images/sugar-cane.jpg';
  }
  if (type.includes('cotton stalks') || type.includes('cotton')) {
    return '/images/cotton.jpg';
  }
  if (type.includes('corn cob') || type.includes('corn')) {
    return '/images/corn.jpg';
  }
  
  // Default fallback
  return '/images/istockphoto-607884592-612x612.jpg';
};

// Helper function to normalize image path
const normalizeImagePath = (imagePath) => {
  if (!imagePath) return getDefaultImage('');
  
  // Convert database paths to frontend paths
  if (typeof imagePath === 'string') {
    if (imagePath.includes('./public/images/')) {
      return imagePath.replace('./public/images/', '/images/');
    }
    if (imagePath.includes('public/images/')) {
      return imagePath.replace('public/images/', '/images/');
    }
    // If it's already a valid path (starts with / or http), use it
    if (imagePath.startsWith('/') || imagePath.startsWith('http')) {
      return imagePath;
    }
    // If it's an emoji, return default
    if (imagePath === '🌾' || imagePath === '🎋' || imagePath === '🌿' || imagePath === '🌽') {
      return getDefaultImage('');
    }
  }
  
  return imagePath;
};

const BuyerDashboard = () => {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [carbonSaved, setCarbonSaved] = useState(0);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [activeTrans, setActiveTrans] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [cart, setCart] = useState([]); // Items in checkout cart
  const [wasteListings, setWasteListings] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [error, setError] = useState("");
  const [buyingListingId, setBuyingListingId] = useState(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [selectedListingForInquiry, setSelectedListingForInquiry] = useState(null);
  const [inquiryMessage, setInquiryMessage] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  // Fetch buyer dashboard stats
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/buyer/dashboard/stats`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch stats: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.stats) {
        setCarbonSaved(data.stats.carbonSaved || 0);
        setTotalPurchases(data.stats.totalPurchases || 0);
        setActiveTrans(data.stats.activeTransactions || 0);
        // Clear error if successful
        setError(prev => prev.includes('stats') ? '' : prev);
      } else {
        setError(prev => prev.includes('stats') ? prev : (data.message || 'Failed to load dashboard stats'));
      }
    } catch (err) {
      console.error('Error fetching buyer stats:', err);
      setError(`Failed to load dashboard stats: ${err.message}`);
    }
  };

  // Fetch marketplace listings
  const fetchMarketplaceListings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/buyer/marketplace`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch listings: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.listings) {
        // Transform API data to match component format
        const transformedListings = (data.listings || []).map((listing, idx) => {
          // Normalize image path
          let imageUrl = normalizeImagePath(listing.image);
          
          // If still not a valid path, use default based on waste type
          if (!imageUrl || (!imageUrl.startsWith('/') && !imageUrl.startsWith('http'))) {
            imageUrl = getDefaultImage(listing.wasteType);
          }
          
          return {
            id: listing._id || idx + 1,
            _id: listing._id,
            farmer: listing.farmerName || (listing.farmerId?.name || listing.farmer || 'Unknown Farmer'),
            location: listing.location || 'Not specified',
            wasteType: listing.wasteType || 'Unknown',
            quantity: listing.quantity || 'N/A',
            price: listing.price || 'N/A',
            carbonSaving: listing.carbonSaving || listing.co2Footprint || '0 kg CO₂',
            image: imageUrl,
            freshness: listing.createdAt ? new Date(listing.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) : 'Unknown',
            tags: listing.tags || [],
            description: listing.description || '',
            category: listing.category || '',
            expectedProcess: listing.expectedProcess || '',
            inquiries: listing.inquiries || 0,
            status: listing.status || 'Active'
          };
        });
        setWasteListings(transformedListings);
        // Clear error if successful
        setError(prev => prev.includes('marketplace') ? '' : prev);
        console.log(`✅ Loaded ${transformedListings.length} marketplace listings`);
      } else {
        setError(prev => prev.includes('marketplace') ? prev : (data.message || 'Failed to load marketplace listings'));
      }
    } catch (err) {
      console.error('Error fetching marketplace listings:', err);
      setError(`Failed to load marketplace listings: ${err.message}`);
    }
  };

  // Fetch purchases
  const fetchPurchases = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/buyer/purchases`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch purchases: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPurchases(data.purchases || []);
        // Clear error if successful
        setError(prev => prev.includes('purchases') ? '' : prev);
        console.log(`✅ Loaded ${data.purchases?.length || 0} purchases`);
      } else {
        setError(prev => prev.includes('purchases') ? prev : (data.message || 'Failed to load purchases'));
      }
    } catch (err) {
      console.error('Error fetching purchases:', err);
      setError(`Failed to load purchases: ${err.message}`);
    }
  };

  // Fetch inquiries
  const fetchInquiries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/buyer/inquiries`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch inquiries: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setInquiries(data.inquiries || []);
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(''); // Clear any previous errors
      try {
        await Promise.all([fetchStats(), fetchMarketplaceListings(), fetchPurchases(), fetchInquiries()]);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Add to cart
  const addToCart = (listing) => {
    if (cart.find(item => item._id === listing._id)) {
      alert('Item already in cart!');
      return;
    }
    setCart([...cart, listing]);
    alert('Added to cart!');
  };

  // Remove from cart
  const removeFromCart = (listingId) => {
    setCart(cart.filter(item => item._id !== listingId));
  };

  // Handle purchase from cart
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
        // Remove from cart
        removeFromCart(listingId);
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

  // Handle inquiry submission
  const handleSubmitInquiry = async () => {
    if (!inquiryMessage.trim() || !selectedListingForInquiry) return;

    try {
      const response = await fetch(`${API_BASE_URL}/buyer/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          listingId: selectedListingForInquiry._id,
          message: inquiryMessage
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send inquiry');
      }

      const data = await response.json();
      
      if (data.success) {
        setShowInquiryModal(false);
        setInquiryMessage('');
        setSelectedListingForInquiry(null);
        await fetchInquiries();
        alert('Inquiry sent successfully!');
      }
    } catch (err) {
      console.error('Error sending inquiry:', err);
      setError(err.message || 'Failed to send inquiry');
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
    objectFit: 'cover',
    backgroundColor: '#e8f5e8'
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
          { id: 'favorites', label: 'Favorites', icon: Heart },
          { id: 'checkout', label: 'Checkout', icon: CreditCard, badge: cart.length },
          { id: 'inquiries', label: 'My Inquiries', icon: MessageCircle },
          { id: 'orders', label: 'My Purchases', icon: ShoppingCart },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={tabButtonStyle(activeTab === tab.id)}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
            {tab.badge > 0 && (
              <span style={{
                backgroundColor: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                marginLeft: '8px'
              }}>
                {tab.badge}
              </span>
            )}
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

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                <Leaf size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p>Loading marketplace listings...</p>
              </div>
            ) : error && error.includes('marketplace') ? (
              <div style={{ textAlign: 'center', padding: '48px', color: '#dc2626' }}>
                <p style={{ marginBottom: '8px', fontWeight: '500' }}>⚠️ {error}</p>
                <button 
                  onClick={() => {
                    setError('');
                    fetchMarketplaceListings();
                  }}
                  style={{ ...favoriteButtonStyle(false), backgroundColor: '#16a34a', color: 'white', marginTop: '16px' }}
                >
                  Retry
                </button>
              </div>
            ) : filteredListings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                <Search size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>No listings found</p>
                <p>Try adjusting your filters or check back later for new listings.</p>
              </div>
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
                      onError={(e) => {
                        // Fallback to default image if image fails to load
                        e.target.src = '/images/istockphoto-607884592-612x612.jpg';
                      }}
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
                        <strong>Listed on:</strong> {listing.freshness}
                      </p>
                      {listing.description && listing.description.trim() && (
                        <p style={{ marginBottom: '4px', fontSize: '13px', color: '#6b7280', fontStyle: 'italic', marginTop: '8px' }}>
                          {listing.description}
                        </p>
                      )}
                      {listing.category && listing.category.trim() && (
                        <p style={{ marginBottom: '4px', fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                          Category: {listing.category}
                        </p>
                      )}
                      {listing.expectedProcess && listing.expectedProcess.trim() && (
                        <p style={{ marginBottom: '4px', fontSize: '12px', color: '#9ca3af' }}>
                          Process: {listing.expectedProcess}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button 
                        style={favoriteButtonStyle(favorites.has(listing.id))}
                          onClick={() => {
                            toggleFavorite(listing.id);
                            handleInquire(listing.id);
                          }}
                      >
                        <Heart size={16} />
                          {favorites.has(listing.id) ? '❤️' : '🤍'}
                        </button>
                        <button 
                          style={{
                            ...favoriteButtonStyle(false),
                            backgroundColor: '#3b82f6',
                            flex: 1
                          }}
                          onClick={() => {
                            setSelectedListingForInquiry(listing);
                            setShowInquiryModal(true);
                          }}
                        >
                          <MessageCircle size={16} />
                          Inquire
                        </button>
                      </div>
                      <button 
                        style={{
                          ...favoriteButtonStyle(false),
                          backgroundColor: '#16a34a',
                          marginTop: '8px',
                          width: '100%'
                        }}
                        onClick={() => addToCart(listing)}
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {activeTab === 'favorites' && (
        <section style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '24px', color: '#1e293b' }}>My Favorites</h2>
          {favoriteListings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
              <Heart size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>No favorites yet</p>
              <p>Add products to favorites from the marketplace!</p>
            </div>
          ) : (
            <div style={listingsGridStyle}>
              {favoriteListings.map(listing => (
                <div key={listing.id} style={listingCardStyle}>
                  <img 
                    src={listing.image || getDefaultImage(listing.wasteType)} 
                    alt={listing.wasteType} 
                    style={listingImageStyle}
                    onError={(e) => {
                      e.target.src = '/images/istockphoto-607884592-612x612.jpg';
                    }}
                  />
                  <div style={listingDetailsStyle}>
                    <h4 style={{ marginBottom: '12px', color: '#1e293b' }}>{listing.wasteType}</h4>
                    <p style={{ marginBottom: '4px', fontSize: '14px' }}><strong>Farmer:</strong> {listing.farmer}</p>
                    <p style={{ marginBottom: '4px', fontSize: '14px' }}><strong>Price:</strong> {listing.price}</p>
                    <p style={{ marginBottom: '4px', fontSize: '14px' }}><strong>Quantity:</strong> {listing.quantity}</p>
                    <button 
                      style={{
                        ...favoriteButtonStyle(false),
                        backgroundColor: '#16a34a',
                        marginTop: '12px',
                        width: '100%'
                      }}
                      onClick={() => addToCart(listing)}
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'checkout' && (
        <section style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '24px', color: '#1e293b' }}>Checkout ({cart.length} items)</h2>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
              <ShoppingCart size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>Your cart is empty</p>
              <p>Add products from the marketplace to checkout!</p>
            </div>
          ) : (
            <div>
              <div style={listingsGridStyle}>
                {cart.map(listing => (
                  <div key={listing._id || listing.id} style={listingCardStyle}>
                    <div style={{
                      ...listingImageStyle,
                      display: 'flex',
                      backgroundColor: '#e8f5e8',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px'
                    }}>
                      {listing.image || '🌾'}
                    </div>
                    <div style={listingDetailsStyle}>
                      <h4 style={{ marginBottom: '12px', color: '#1e293b' }}>{listing.wasteType}</h4>
                      <p style={{ marginBottom: '4px', fontSize: '14px' }}><strong>Farmer:</strong> {listing.farmer}</p>
                      <p style={{ marginBottom: '4px', fontSize: '14px' }}><strong>Price:</strong> {listing.price}</p>
                      <p style={{ marginBottom: '4px', fontSize: '14px' }}><strong>Quantity:</strong> {listing.quantity}</p>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button 
                          style={{
                            ...favoriteButtonStyle(false),
                            backgroundColor: '#ef4444',
                            flex: 1
                          }}
                          onClick={() => removeFromCart(listing._id || listing.id)}
                        >
                          Remove
                        </button>
                        <button 
                          style={{
                            ...favoriteButtonStyle(false),
                            backgroundColor: '#16a34a',
                            flex: 1
                          }}
                          onClick={() => handlePurchase(listing._id || listing.id)}
                          disabled={buyingListingId === (listing._id || listing.id)}
                        >
                          {buyingListingId === (listing._id || listing.id) ? 'Processing...' : 'Buy Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {activeTab === 'inquiries' && (
        <section style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '24px', color: '#1e293b' }}>My Inquiries</h2>
          {inquiries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
              <MessageCircle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>No inquiries yet</p>
              <p>Send inquiries to farmers about their products from the marketplace!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {inquiries.map(inquiry => (
                <div key={inquiry._id} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>
                        {inquiry.listingId?.wasteType || 'Unknown Product'}
                    </h4>
                      <p style={{ fontSize: '14px', color: '#6b7280' }}>
                        Farmer: {inquiry.farmerId?.name || inquiry.farmerName || 'Unknown'}
                      </p>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      fontSize: '12px',
                      borderRadius: '12px',
                      backgroundColor: inquiry.status === 'Pending' ? '#fef3c7' : inquiry.status === 'Replied' ? '#dbeafe' : '#dcfce7',
                      color: inquiry.status === 'Pending' ? '#92400e' : inquiry.status === 'Replied' ? '#1d4ed8' : '#166534'
                    }}>
                      {inquiry.status}
                    </span>
                  </div>
                  <p style={{ marginBottom: '12px', color: '#374151' }}>{inquiry.message}</p>
                  {inquiry.replies && inquiry.replies.length > 0 && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                      <h5 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Farmer's Reply:</h5>
                      {inquiry.replies.map((reply, idx) => (
                        <div key={idx} style={{ marginBottom: '8px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                          <p style={{ fontSize: '14px', color: '#374151' }}>{reply.message}</p>
                          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                            - {reply.authorName} ({new Date(reply.createdAt).toLocaleDateString()})
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '12px' }}>
                    Sent: {new Date(inquiry.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
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
                  <img 
                    src={purchase.listingId?.image ? normalizeImagePath(purchase.listingId.image) : getDefaultImage(purchase.wasteType)} 
                    alt={purchase.wasteType} 
                    style={listingImageStyle}
                    onError={(e) => {
                      e.target.src = '/images/istockphoto-607884592-612x612.jpg';
                    }}
                  />
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

      {/* Inquiry Modal */}
      {showInquiryModal && selectedListingForInquiry && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '16px', color: '#1e293b' }}>
              Send Inquiry: {selectedListingForInquiry.wasteType}
            </h3>
            <p style={{ marginBottom: '16px', color: '#6b7280', fontSize: '14px' }}>
              Farmer: {selectedListingForInquiry.farmer}
            </p>
            <textarea
              value={inquiryMessage}
              onChange={(e) => setInquiryMessage(e.target.value)}
              placeholder="Ask the farmer about this product..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                marginBottom: '16px',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button 
                onClick={() => {
                  setShowInquiryModal(false);
                  setInquiryMessage('');
                  setSelectedListingForInquiry(null);
                }}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitInquiry}
                disabled={!inquiryMessage.trim()}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: inquiryMessage.trim() ? '#16a34a' : '#9ca3af',
                  color: 'white',
                  cursor: inquiryMessage.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Send Inquiry
                    </button>
                  </div>
                </div>
            </div>
      )}
    </div>
  );
};

export default BuyerDashboard;