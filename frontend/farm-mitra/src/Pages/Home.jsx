import React, { useEffect } from 'react';
import './Homepage.css';

const Homepage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const animateCounter = (element, target) => {
      let current = 0;
      const increment = target / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = Math.floor(target);
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current);
        }
      }, 16);
    };

    const animateCounters = () => {
      document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        animateCounter(el, target);
      });
    };

    const loadStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/stats/platform`);
        const data = await response.json();

        animateCounter(document.querySelector('[data-target="1200"]'), data.activeFarmers);
        animateCounter(document.querySelector('[data-target="150"]'), data.co2Saved);
        animateCounter(document.querySelector('[data-target="25"]'), data.revenueMillions);
      } catch (error) {
        console.error('Stats loading error:', error);
        animateCounters(); // fallback
      }
    };

    const setupScrollAnimations = () => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.section-header, .feature-card').forEach(el => observer.observe(el));
    };

    const setupNavbarScroll = () => {
      window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      });
    };

    const initPage = () => {
      setTimeout(() => {
        document.getElementById('loadingOverlay')?.classList.add('hidden');
      }, 1000);

      setTimeout(() => {
        animateCounters();
        setupScrollAnimations();
        setupNavbarScroll();
        loadStats();
      }, 1500);
    };

    initPage();

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) loadStats();
    });
  }, []);

  const handleAuth = () => {
    window.location.href = '/auth/login';
  };

  return (
    <>
      <div className="loading-overlay" id="loadingOverlay">
        <div className="loader"></div>
      </div>

      <nav id="navbar">
        <div className="nav-content">
          <a href="#" className="logo">🌾 FarmMitra</a>
          <ul className="nav-links">
            <li><a href="#" onClick={handleAuth}>login</a></li>
          </ul>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-bg"></div>
          <div className="hero-content">
            <div className="hero-text">
              <h1>Transform Agricultural Waste into Value</h1>
              <p className="hero-subtitle">
                Connect with eco-conscious buyers, turn waste into wealth, and contribute to a sustainable future.
                AI-powered matching ensures fair pricing and maximum environmental impact.
              </p>
              <div className="cta-buttons">
                <a href="farmer-dashboard.html" className="btn btn-primary">👨‍🌾 Start as Farmer</a>
                <a href="marketplace.html" className="btn btn-secondary">🏢 Browse as Buyer</a>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number" data-target="1200">0</span>
                  <span className="stat-label">Active Farmers</span>
                </div>
                <div className="stat">
                  <span className="stat-number" data-target="150">0</span>
                  <span className="stat-label">Tons CO₂ Saved</span>
                </div>
                <div className="stat">
                  <span className="stat-number" data-target="25">0</span>
                  <span className="stat-label">Million Revenue</span>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="visual-circle">
                <div className="visual-icon">🌱</div>
              </div>
              <div className="floating-elements">
                <div className="floating-element">🌾</div>
                <div className="floating-element">💰</div>
                <div className="floating-element">🌍</div>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="section-header">
            <h2 className="section-title">Why Choose FarmMitra?</h2>
            <p className="section-subtitle">
              Our AI-powered platform creates meaningful connections between farmers and buyers 
              while maximizing environmental impact and economic returns.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3 className="feature-title">AI-Powered Matching</h3>
              <p className="feature-description">
                Intelligent algorithms connect farmers with the right buyers, suggest optimal pricing,
                and identify the best valorization pathways for agricultural waste.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3 className="feature-title">Fair Market Pricing</h3>
              <p className="feature-description">
                Dynamic pricing ensures farmers get fair value while buyers access competitive
                rates for sustainable raw materials.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3 className="feature-title">Carbon Impact Tracking</h3>
              <p className="feature-description">
                Every transaction calculates CO₂ savings, helping businesses meet ESG goals
                and farmers contribute to environmental sustainability.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Homepage;