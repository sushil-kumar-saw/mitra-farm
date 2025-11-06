import React, { useState, useEffect, useRef } from 'react';
import { Search, BookOpen, Video, FileText, MessageCircle, Send, X, ChevronRight, Leaf, Recycle, TrendingUp, Users, Award, Clock } from 'lucide-react';

const FarmMitraLearningHub = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', content: 'Hello! I\'m the FarmMitra AI Assistant. Ask me anything about agricultural waste management and valorization!' }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpen },
    { id: 'waste-management', name: 'Waste Management', icon: Recycle },
    { id: 'valorization', name: 'Valorization', icon: TrendingUp },
    { id: 'carbon-farming', name: 'Carbon Farming', icon: Leaf },
    { id: 'marketplace', name: 'Marketplace Guide', icon: Users },
    { id: 'certification', name: 'Certification', icon: Award }
  ];

const learningContent = [
  {
    id: 1,
    title: 'From Rice Husk Ash to Silica Gold: How India’s Hidden Waste is Transformed',
    category: 'waste-management',
    type: 'video',
    duration: '≈ 8 minutes',
    difficulty: 'Intermediate',
    description: 'See how rice husk ash is converted into high-value silica for cement, rubber and building materials.',
    thumbnail: '🌾',
    content: 'Explains the industrial process of converting rice husk ash into silica and other valuable materials.',
    tags: ['rice-husk', 'silica', 'waste-valorization'],
    link: 'https://www.youtube.com/watch?v=yMqfp_kBbV4'
  },
  {
    id: 2,
    title: 'Make Products from Waste Rice Husk: Biodegradable Plates & Cups',
    category: 'waste-management',
    type: 'video',
    duration: '≈ 6 minutes',
    difficulty: 'Beginner',
    description: 'Demonstration of converting rice husk waste into biodegradable plates and cups.',
    thumbnail: '🌿',
    content: 'Video shows how rice husk waste is repurposed into eco-friendly disposable tableware.',
    tags: ['rice-husk', 'biodegradable', 'product-design'],
    link: 'https://www.youtube.com/watch?v=d1ATcOMHTSI'
  },
  {
    id: 3,
    title: 'How to Earn Money from Waste Rice Husk | Converting Waste Agricultural Biomass',
    category: 'waste-management',
    type: 'video',
    duration: '≈ 10 minutes',
    difficulty: 'Beginner',
    description: 'Entrepreneurial video on setting up a project converting rice husk into value products like particleboard.',
    thumbnail: '📦',
    content: 'Shows step-by-step how rice husk can be used to produce particle boards and generate income.',
    tags: ['rice-husk', 'entrepreneurship', 'particleboard'],
    link: 'https://www.youtube.com/watch?v=sfWKaMQvQzA'
  },
  {
    id: 4,
    title: 'From Waste to Resources: Amazing Process Recycling Bagasse',
    category: 'valorization',
    type: 'video',
    duration: '≈ 7 minutes',
    difficulty: 'Intermediate',
    description: 'Explores the recycling process of sugarcane bagasse as part of circular economy solutions.',
    thumbnail: '🎋',
    content: 'Detailed look at bagasse recycling and the production of value-added materials.',
    tags: ['bagasse', 'circular-economy', 'valorization'],
    link: 'https://www.youtube.com/watch?v=_9XcFkELn9g'
  },
  {
    id: 5,
    title: 'Environmental Benefits of Using Sugarcane Bagasse By-products',
    category: 'valorization',
    type: 'video',
    duration: '≈ 5 minutes',
    difficulty: 'Beginner',
    description: 'Short video discussing how bagasse-based by-products reduce environmental impact in India.',
    thumbnail: '🌱',
    content: 'Shows case studies of bagasse utilization and its environmental effects.',
    tags: ['bagasse', 'environment', 'by-product'],
    link: 'https://www.youtube.com/watch?v=KIBXXsJO4D8'
  },
  {
    id: 6,
    title: 'Rice Husk to Particle Board Business in India | Low Cost Mill Setup',
    category: 'waste-management',
    type: 'video',
    duration: '≈ 9 minutes',
    difficulty: 'Intermediate',
    description: 'Business-model video for converting rice husk into particle board in India.',
    thumbnail: '🏭',
    content: 'Walkthrough of setting up a mini mill, machinery, and cost structure for rice-husk particle boards.',
    tags: ['rice-husk', 'business-model', 'manufacturing'],
    link: 'https://www.youtube.com/watch?v=ttLE5b2zZsk'
  },
  {
    id: 7,
    title: 'How Plates Made From Sugarcane Could Help India’s Plastic Problem',
    category: 'valorization',
    type: 'video',
    duration: '≈ 8 minutes',
    difficulty: 'Beginner',
    description: 'Video on making sugarcane bagasse plates as eco-friendly alternatives to plastic disposables.',
    thumbnail: '🍽️',
    content: 'Demonstrates manufacturing of disposable plates from sugarcane bagasse waste and their benefits.',
    tags: ['bagasse', 'eco-friendly', 'plastic-alternative'],
    link: 'https://www.youtube.com/watch?v=HcqCWiGyDvw'
  },
  {
    id: 8,
    title: 'Sugarcane Byproducts Industry – Business Opportunities & Value Chains',
    category: 'marketplace',
    type: 'video',
    duration: '≈ 11 minutes',
    difficulty: 'Intermediate',
    description: 'Business insight into the sugarcane by-products industry and value-chain opportunities.',
    thumbnail: '💼',
    content: 'Video covers how sugarcane by-products create new business streams beyond sugar production.',
    tags: ['sugarcane', 'by-products', 'business'],
    link: 'https://www.youtube.com/watch?v=rjnAGO2y5uc'
  },
  {
    id: 9,
    title: 'Nature Files: Bagasse – A Cost-Efficient Energy Source',
    category: 'carbon-farming',
    type: 'video',
    duration: '≈ 6 minutes',
    difficulty: 'Beginner',
    description: 'Short film explaining how sugarcane bagasse is used as a renewable energy source in India.',
    thumbnail: '⚡',
    content: 'Illustrates power generation from bagasse and how it can reduce carbon footprints.',
    tags: ['bagasse', 'energy', 'renewable'],
    link: 'https://www.youtube.com/watch?v=SDmgkBy12uY'
  },
  {
    id: 10,
    title: 'Turning Rice Waste into Organic Fertilizer in East Africa',
    category: 'valorization',
    type: 'video',
    duration: '≈ 7 minutes',
    difficulty: 'Beginner',
    description: 'Documentary-style video showing farmers turning rice husk waste into compost and fertilizer in Kenya.',
    thumbnail: '🌍',
    content: 'Highlights how rice husk waste can be converted into organic fertilizer and used in farming in East Africa.',
    tags: ['rice-husk', 'organic-fertilizer', 'farm-impact'],
    link: 'https://www.youtube.com/watch?v=B1CpC7JXiEk'
  }
];

  const filteredContent = learningContent.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

const handleSendMessage = async () => {
  if (!currentMessage.trim()) return;

  const userMessage = currentMessage;
  setChatMessages(prev => [...prev, { type: 'user', content: userMessage }]);
  setCurrentMessage('');
  setIsTyping(true);

  try {
    // Correct Google Gemini API endpoint
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyBP3hEm_U58xDtkrI8UlAkjS7AxIZk3yZc',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are FarmMitra, a friendly AI assistant that helps farmers with agriculture, crops, soil, fertilizers, irrigation, weather, and government farming schemes.
- If the user greets you (like "hi", "hello", "hey"), respond warmly and introduce yourself, e.g.:
  "Hello! 👋 I’m FarmMitra, your farming assistant. How can I help you today?"
- If the user says "help", explain briefly what you can do (for example: "I can answer questions about crops, soil health, irrigation, fertilizers, or government schemes.").
- If the query is unrelated to farming or small talk, politely redirect the user by saying:
  "I can best assist with farming-related questions. Could you please ask something related to crops, soil, or agriculture?"
- Keep answers short, clear, and easy to understand for farmers.
- Always be polite, encouraging, and helpful.

User query: "${userMessage}"`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // Extract Gemini's response
    if (
      data &&
      data.candidates &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0].text
    ) {
      const botResponse = data.candidates[0].content.parts[0].text.trim();
      setChatMessages(prev => [...prev, { type: 'bot', content: botResponse }]);
    } else {
      setChatMessages(prev => [
        ...prev,
        { type: 'bot', content: 'Sorry, I can only assist with farming-related queries.' },
      ]);
    }
  } catch (error) {
    console.error('Error fetching response from Gemini API:', error);
    setChatMessages(prev => [
      ...prev,
      { type: 'bot', content: 'There was an error processing your request. Please try again later.' },
    ]);
  } finally {
    setIsTyping(false);
  }
};


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const getTypeIcon = (type) => {
    switch(type) {
      case 'video': return Video;
      case 'tutorial': return BookOpen;
      case 'guide': return FileText;
      default: return BookOpen;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 100%)',
      minHeight: '100vh',
      color: '#1f2937'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
        color: 'white',
        padding: '2rem 0',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '0.5rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            🌱 FarmMitra Learning Hub
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            Transform Agricultural Waste into Wealth - Complete Knowledge Center
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Search Bar */}
        <div style={{ 
          position: 'relative', 
          marginBottom: '2rem',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <Search style={{ 
            position: 'absolute', 
            left: '1rem', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#6b7280' 
          }} size={20} />
          <input
            type="text"
            placeholder="Search topics, tutorials, guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3rem',
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              background: 'transparent'
            }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '0.75rem', 
          marginBottom: '2rem',
          justifyContent: 'center'
        }}>
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: activeCategory === category.id ? '#065f46' : 'white',
                  color: activeCategory === category.id ? 'white' : '#374151',
                  border: '2px solid',
                  borderColor: activeCategory === category.id ? '#065f46' : '#e5e7eb',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  transform: activeCategory === category.id ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: activeCategory === category.id ? '0 4px 15px rgba(6,95,70,0.3)' : '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                <Icon size={16} />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Stats Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {[
            { icon: '📚', number: '50+', label: 'Learning Modules' },
            { icon: '👨‍🌾', number: '10,000+', label: 'Farmers Trained' },
            { icon: '💰', number: '₹2.5Cr+', label: 'Revenue Generated' },
            { icon: '🌍', number: '15,000T', label: 'CO₂ Saved' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.25rem' }}>
                {stat.number}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Learning Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {filteredContent.map(item => {
            const TypeIcon = getTypeIcon(item.type);
            return (
              <div
                key={item.id}
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid #f3f4f6',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    fontSize: '2rem',
                    background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                    padding: '0.75rem',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.thumbnail}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <TypeIcon size={16} color="#059669" />
                      <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'capitalize' }}>
                        {item.type}
                      </span>
                    </div>
                    <h3 style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: '600', 
                      color: '#1f2937',
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      {item.title}
                    </h3>
                  </div>
                </div>

                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '0.9rem', 
                  lineHeight: '1.5',
                  marginBottom: '1rem'
                }}>
                  {item.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={14} color="#6b7280" />
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{item.duration}</span>
                  </div>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    fontWeight: '500',
                    color: getDifficultyColor(item.difficulty),
                    background: `${getDifficultyColor(item.difficulty)}20`,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '10px'
                  }}>
                    {item.difficulty}
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  {item.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '0.75rem',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '10px',
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

               <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ textDecoration: 'none' }}
              >
                <button
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  Start Learning
                  <ChevronRight size={16} />
                </button>
              </a>
              </div>
            );
          })}
        </div>

        {filteredContent.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              No Results Found
            </h3>
            <p style={{ color: '#6b7280' }}>
              Please adjust your search terms or try selecting a different category.
            </p>
          </div>
        )}

        {/* Success Stories Section */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem',
            textAlign: 'center',
            color: '#1f2937'
          }}>
            🏆 Success Stories
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              {
                name: 'Rajesh Kumar',
                location: 'Punjab',
                story: 'Converted 50 tons of rice husk into biofuel pellets, earning ₹4.5 lakhs additional income annually',
                increase: '+300% income'
              },
              {
                name: 'Meera Patel',
                location: 'Gujarat',
                story: 'Started organic compost business from sugarcane bagasse, now supplies to 200+ farms',
                increase: '+₹8L revenue'
              },
              {
                name: 'Suresh Reddy',
                location: 'Telangana',
                story: 'Earned ₹2.3 lakhs in carbon credits by preventing crop residue burning',
                increase: '+₹2.3L credits'
              }
            ].map((story, index) => (
              <div key={index} style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                padding: '1.5rem',
                borderRadius: '15px',
                border: '1px solid #dcfce7'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.25rem',
                    fontWeight: 'bold'
                  }}>
                    {story.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>{story.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{story.location}</div>
                  </div>
                </div>
                <p style={{ color: '#374151', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1rem' }}>
                  {story.story}
                </p>
                <div style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {story.increase}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        {chatOpen ? (
          <div style={{
            width: '350px',
            height: '500px',
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            border: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Chat Header */}
            <div style={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: 'white',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageCircle size={20} />
                <span style={{ fontWeight: '600' }}>FarmMitra AI Assistant</span>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    maxWidth: '80%',
                    padding: '0.75rem 1rem',
                    borderRadius: '15px',
                    backgroundColor: message.type === 'user' ? '#059669' : '#f3f4f6',
                    color: message.type === 'user' ? 'white' : '#1f2937',
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}>
                    {message.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '15px',
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280',
                    fontSize: '0.9rem'
                  }}>
                    AI is typing...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div style={{
              padding: '1rem',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: '0.5rem'
            }}>
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about waste valorization..."
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim()}
                style={{
                  padding: '0.75rem',
                  background: currentMessage.trim() ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : '#e5e7eb',
                  color: currentMessage.trim() ? 'white' : '#9ca3af',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: currentMessage.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setChatOpen(true)}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(5,150,105,0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(5,150,105,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(5,150,105,0.4)';
            }}
          >
            <MessageCircle size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default FarmMitraLearningHub;