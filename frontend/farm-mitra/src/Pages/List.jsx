import React, { useState } from "react";

const AgriculturalWasteAnalyzer = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [location, setLocation] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiKey, setApiKey] = useState("");

  // Sample data for demonstration (in real app, this would come from AI)
  const sampleAnalysis = {
    "rice straw": {
      category: "crop residue",
      mspPrice: "₹2-4 per kg",
      expectedProcess: "Composting, Biogas production, Paper manufacturing",
      co2Footprint: "0.8 kg CO2/kg",
      description: "High cellulose content, excellent for paper and biogas"
    },
    "wheat straw": {
      category: "crop residue", 
      mspPrice: "₹3-5 per kg",
      expectedProcess: "Animal feed, Mushroom cultivation, Biofuel",
      co2Footprint: "0.7 kg CO2/kg",
      description: "Good fiber content, suitable for feed and fuel"
    },
    "sugarcane bagasse": {
      category: "processing waste",
      mspPrice: "₹1-2 per kg", 
      expectedProcess: "Paper production, Biofuel, Building materials",
      co2Footprint: "0.3 kg CO2/kg",
      description: "High energy content, excellent for industrial use"
    },
    "fruit peels": {
      category: "fruit waste",
      mspPrice: "₹5-8 per kg",
      expectedProcess: "Composting, Pectin extraction, Animal feed",
      co2Footprint: "1.2 kg CO2/kg", 
      description: "Rich in nutrients, good for value-added products"
    },
    "vegetable waste": {
      category: "vegetable waste",
      mspPrice: "₹3-6 per kg",
      expectedProcess: "Composting, Biogas, Organic fertilizer",
      co2Footprint: "1.5 kg CO2/kg",
      description: "High moisture content, ideal for composting"
    }
  };

  const analyzeWithSampleData = () => {
    const desc = description.toLowerCase();
    let matchedData = null;
    
    // Simple keyword matching for demo
    for (const [key, data] of Object.entries(sampleAnalysis)) {
      if (desc.includes(key.split(' ')[0]) || desc.includes(key)) {
        matchedData = data;
        break;
      }
    }
    
    // Fallback for unmatched descriptions
    if (!matchedData) {
      matchedData = {
        category: "others",
        mspPrice: "₹2-5 per kg",
        expectedProcess: "Composting, Biogas production",
        co2Footprint: "1.0 kg CO2/kg",
        description: "General agricultural waste processing"
      };
    }

    // Calculate total values based on amount
    const amountNum = parseFloat(amount) || 0;
    const co2Total = (parseFloat(matchedData.co2Footprint) * amountNum).toFixed(2);
    
    return {
      ...matchedData,
      totalCo2Footprint: `${co2Total} kg CO2`,
      estimatedValue: `₹${(amountNum * 3.5).toFixed(2)} - ₹${(amountNum * 6).toFixed(2)}`,
      processingRecommendation: getProcessingRecommendation(matchedData.category, amountNum)
    };
  };

  const getProcessingRecommendation = (category, amount) => {
    if (amount < 100) return "Small scale: Home composting or local biogas unit";
    if (amount < 1000) return "Medium scale: Community processing or local industry partnership";
    return "Large scale: Industrial processing or bulk sale to processing units";
  };

  const handleAnalyze = async () => {
    if (!description || !amount) {
      setError("Please enter description and amount");
      return;
    }
    
    setError("");
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      try {
        const analysis = analyzeWithSampleData();
        setResult(analysis);
      } catch (e) {
        setError("Analysis failed: " + e.message);
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  const handleRealAIAnalysis = async () => {
    if (!apiKey) {
      setError("Please enter your OpenAI API key");
      return;
    }
    
    if (!description || !amount) {
      setError("Please enter description and amount");
      return;
    }

    setError("");
    setLoading(true);

    const prompt = `
    Analyze this agricultural waste:
    Description: "${description}"
    Amount: ${amount} kg
    ${location ? `Location: ${location}` : ''}
    
    Provide analysis in JSON format:
    {
      "category": "crop residue|fruit waste|vegetable waste|processing waste|others",
      "mspPrice": "price range in ₹",
      "expectedProcess": "recommended processing methods",
      "co2Footprint": "kg CO2 per kg waste",
      "totalCo2Footprint": "total CO2 for given amount",
      "estimatedValue": "estimated market value range",
      "processingRecommendation": "scale-appropriate processing advice"
    }
    `;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error.message || "OpenAI API error");
        return;
      }

      const text = data.choices[0].message.content;
      
      try {
        const parsed = JSON.parse(text);
        setResult(parsed);
      } catch {
        setError("Failed to parse AI response");
      }
    } catch (e) {
      setError("Request failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      padding: '32px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#166534',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '1.1rem'
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '32px'
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      resize: 'vertical',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box'
    },
    inputRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px'
    },
    buttonContainer: {
      display: 'flex',
      gap: '16px'
    },
    button: {
      flex: 1,
      backgroundColor: '#16a34a',
      color: 'white',
      fontWeight: '600',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.2s'
    },
    buttonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    },
    apiSection: {
      borderTop: '1px solid #e5e7eb',
      paddingTop: '16px',
      marginTop: '16px'
    },
    detailsToggle: {
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      color: '#2563eb',
      marginBottom: '16px'
    },
    apiButton: {
      width: '100%',
      backgroundColor: '#2563eb',
      color: 'white',
      fontWeight: '600',
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
      marginTop: '12px'
    },
    error: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626',
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '14px'
    },
    resultContainer: {
      background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)',
      border: '1px solid #bbf7d0',
      borderRadius: '12px',
      padding: '24px'
    },
    resultTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#166534',
      marginBottom: '16px'
    },
    resultGrid: {
      display: 'grid',
      gap: '16px'
    },
    resultCard: {
      backgroundColor: 'white',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
    },
    resultLabel: {
      fontSize: '12px',
      color: '#6b7280',
      marginBottom: '4px'
    },
    resultValue: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#374151'
    },
    infoBox: {
      backgroundColor: '#eff6ff',
      border: '1px solid #bfdbfe',
      borderRadius: '8px',
      padding: '16px',
      fontSize: '13px'
    },
    infoTitle: {
      fontWeight: '600',
      color: '#1e40af',
      marginBottom: '8px'
    },
    infoList: {
      color: '#1d4ed8',
      paddingLeft: '16px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            🌾 Agricultural Waste AI Analyzer
          </h1>
          <p style={styles.subtitle}>
            Get intelligent insights about your agricultural waste processing potential
          </p>
        </div>

        <div style={styles.gridContainer}>
          <div style={styles.formContainer}>
            <div>
              <label style={styles.label}>
                Waste Description *
              </label>
              <textarea
                rows={4}
                style={styles.textarea}
                placeholder="Describe your agricultural waste (e.g., rice straw, fruit peels, sugarcane bagasse...)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            <div style={styles.inputRow}>
              <div>
                <label style={styles.label}>
                  Amount (kg) *
                </label>
                <input
                  type="number"
                  style={styles.input}
                  placeholder="1000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
              
              <div>
                <label style={styles.label}>
                  Location (optional)
                </label>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="City, State"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
            </div>

            <div style={styles.buttonContainer}>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                style={{
                  ...styles.button,
                  ...(loading ? styles.buttonDisabled : {})
                }}
                onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#15803d')}
                onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#16a34a')}
              >
                {loading ? "🔄 Analyzing..." : "🤖 Demo Analysis"}
              </button>
            </div>

           
          </div>

          <div>
            {error && (
              <div style={styles.error}>
                ❌ {error}
              </div>
            )}

            {result && (
              <div style={styles.resultContainer}>
                <h3 style={styles.resultTitle}>
                  📊 Analysis Results
                </h3>
                
                <div style={styles.resultGrid}>
                  <div style={styles.resultCard}>
                    <div style={styles.resultLabel}>Category</div>
                    <div style={{ ...styles.resultValue, color: '#059669', textTransform: 'capitalize' }}>
                      🏷️ {result.category}
                    </div>
                  </div>

                  <div style={styles.resultCard}>
                    <div style={styles.resultLabel}>Market Price Range</div>
                    <div style={{ ...styles.resultValue, color: '#2563eb' }}>
                      💰 {result.mspPrice}
                    </div>
                  </div>

                  <div style={styles.resultCard}>
                    <div style={styles.resultLabel}>Processing Methods</div>
                    <div style={{ ...styles.resultValue, fontSize: '14px', color: '#374151' }}>
                      ⚙️ {result.expectedProcess}
                    </div>
                  </div>

                  <div style={styles.resultCard}>
                    <div style={styles.resultLabel}>CO₂ Footprint</div>
                    <div style={{ ...styles.resultValue, color: '#ea580c' }}>
                      🌍 {result.totalCo2Footprint || result.co2Footprint}
                    </div>
                  </div>

                  {result.estimatedValue && (
                    <div style={styles.resultCard}>
                      <div style={styles.resultLabel}>Estimated Total Value</div>
                      <div style={{ ...styles.resultValue, color: '#059669' }}>
                        💵 {result.estimatedValue}
                      </div>
                    </div>
                  )}

                  {result.processingRecommendation && (
                    <div style={styles.resultCard}>
                      <div style={styles.resultLabel}>Processing Recommendation</div>
                      <div style={{ ...styles.resultValue, fontSize: '14px', color: '#374151' }}>
                        💡 {result.processingRecommendation}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriculturalWasteAnalyzer;