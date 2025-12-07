import React, { useState, useEffect, useRef } from 'react';
import { Upload, Play, RefreshCw, Cloud, CloudRain, Sun, CloudDrizzle, Package, TrendingUp } from 'lucide-react';

function App() {
  const [csvData, setCsvData] = useState(null);
  const [cities, setCities] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [bestPath, setBestPath] = useState([]);
  const [bestCost, setBestCost] = useState(0);
  const [antPosition, setAntPosition] = useState(null);
  const [visitedPath, setVisitedPath] = useState([]);
  const [WeatherMatrix, setWeatherMatrix] = useState([]);
  const [weatherMap, setWeatherMap] = useState({});
  const [cityDemand, setCityDemand] = useState({});
  const [totalSupply, setTotalSupply] = useState(0);
  const [supplyWeight, setSupplyWeight] = useState(0.1);
  const [stressFactor, setStressFactor] = useState(0.1);
  const [apiUrl] = useState('http://localhost:5005');
  const [useApi, setUseApi] = useState(true);
  const canvasRef = useRef(null);

  const weatherTypes = {
    1: { name: 'sunny', icon: Sun, color: '#FFA500' },
    2: { name: 'cloudy', icon: Cloud, color: '#A0A0A0' },
    4: { name: 'rainy', icon: CloudRain, color: '#4A90E2' },
    6: { name: 'stormy', icon: CloudDrizzle, color: '#6B7280' }
  };

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    const cityNames = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',');
      if (row.length < 2) continue;
      cityNames.push(row[0].trim());
    }

    return cityNames;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const cityNames = parseCSV(text);
        setCities(cityNames);
        setCsvData(text);
        
        const weather = {};
        const weatherValues = [1, 2, 4, 6];
        cityNames.forEach((city, idx) => {
          weather[idx] = weatherValues[Math.floor(Math.random() * weatherValues.length)];
        });
        setWeatherMap(weather);
      };
      reader.readAsText(file);
    }
  };

  const runACO = async () => {
    if (!csvData) return;

    setIsRunning(true);
    setBestPath([]);
    setBestCost(0);
    setVisitedPath([]);
    setCityDemand({});
    setTotalSupply(0);
    setWeatherMatrix([]);

    if (useApi) {
      try {
        const response = await fetch(`${apiUrl}/api/solve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            csv_data: csvData,
            weather_map: weatherMap,
            supply_weight: supplyWeight,
            stress_factor: stressFactor
          })
        });

        const result = await response.json();
        
        if (result.success) {
          setBestPath(result.best_path);
          setBestCost(result.best_length.toFixed(2));
          setCityDemand(result.city_demand);
          setTotalSupply(result.total_supply);
          setWeatherMatrix(result.weather_matrix || []);
          animateAnt(result.best_path);
        } else {
          alert('Error: ' + result.error);
          setIsRunning(false);
        }
      } catch (error) {
        alert('Failed to connect to Python backend. Make sure Flask server is running on port 5005.');
        setIsRunning(false);
      }
    } else {
      alert('JavaScript-only mode not implemented. Please use Python backend.');
      setIsRunning(false);
    }
  };

  const animateAnt = async (path) => {
    const fullPath = [...path, path[0]];
    setVisitedPath([]);
    
    for (let i = 0; i < fullPath.length - 1; i++) {
      const from = fullPath[i];
      const to = fullPath[i + 1];
      
      const steps = 30;
      for (let step = 0; step <= steps; step++) {
        const progress = step / steps;
        setAntPosition({ from, to, progress });
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      setVisitedPath(prev => [...prev, { from, to }]);
    }
    
    setIsRunning(false);
  };

  const getCityPosition = (index) => {
    const n = cities.length;
    const radius = 200;
    const angle = (index / n) * 2 * Math.PI - Math.PI / 2;
    return {
      x: 400 + radius * Math.cos(angle),
      y: 300 + radius * Math.sin(angle)
    };
  };

  const getAntPosition = () => {
    if (!antPosition) return null;
    const fromPos = getCityPosition(antPosition.from);
    const toPos = getCityPosition(antPosition.to);
    return {
      x: fromPos.x + (toPos.x - fromPos.x) * antPosition.progress,
      y: fromPos.y + (toPos.y - fromPos.y) * antPosition.progress
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || cities.length === 0) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 800, 600);

    // Draw visited paths
    visitedPath.forEach(({ from, to }) => {
      const fromPos = getCityPosition(from);
      const toPos = getCityPosition(to);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(fromPos.x, fromPos.y);
      ctx.lineTo(toPos.x, toPos.y);
      ctx.stroke();
    });

    // Draw cities
    cities.forEach((city, idx) => {
      const pos = getCityPosition(idx);
      const weather = weatherTypes[weatherMap[idx]];
      
      // Weather background
      ctx.fillStyle = weather.color + '40';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 45, 0, 2 * Math.PI);
      ctx.fill();

      // City circle
      const gradient = ctx.createRadialGradient(pos.x, pos.y, 5, pos.x, pos.y, 25);
      gradient.addColorStop(0, '#60a5fa');
      gradient.addColorStop(1, '#2563eb');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 25, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 3;
      ctx.stroke();

      // City name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.fillText(city, pos.x, pos.y + 5);
      ctx.shadowBlur = 0;

      // Display demand if available
      if (cityDemand[idx]) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`${cityDemand[idx]}u`, pos.x, pos.y + 55);
      }
    });

    // Draw ant
    if (antPosition) {
      const pos = getAntPosition();
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(pos.x, pos.y + 20, 20, 8, 0, 0, 2 * Math.PI);
      ctx.fill();

      const abdomenGradient = ctx.createRadialGradient(pos.x - 8, pos.y + 4, 3, pos.x - 8, pos.y + 4, 14);
      abdomenGradient.addColorStop(0, '#3a3a3a');
      abdomenGradient.addColorStop(1, '#1a1a1a');
      ctx.fillStyle = abdomenGradient;
      ctx.beginPath();
      ctx.ellipse(pos.x - 8, pos.y + 4, 12, 14, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.ellipse(pos.x - 12, pos.y, 6, 8, 0, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = 0.8;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        const segY = pos.y + i * 3.5;
        const segWidth = 12 * (1 - Math.abs(i) / 3);
        ctx.ellipse(pos.x - 8, segY, segWidth, 1.8, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }

      ctx.strokeStyle = '#0a0a0a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(pos.x - 8, pos.y + 4, 12, 14, 0, 0, 2 * Math.PI);
      ctx.stroke();

      const thoraxGradient = ctx.createRadialGradient(pos.x + 6, pos.y, 2, pos.x + 6, pos.y, 11);
      thoraxGradient.addColorStop(0, '#2a2a2a');
      thoraxGradient.addColorStop(1, '#0f0f0f');
      ctx.fillStyle = thoraxGradient;
      ctx.beginPath();
      ctx.ellipse(pos.x + 6, pos.y, 10, 12, 0, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = '#0a0a0a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(pos.x + 6, pos.y, 10, 12, 0, 0, 2 * Math.PI);
      ctx.stroke();

      const headGradient = ctx.createRadialGradient(pos.x + 16, pos.y - 4, 1, pos.x + 16, pos.y - 4, 8);
      headGradient.addColorStop(0, '#3a3a3a');
      headGradient.addColorStop(1, '#1a1a1a');
      ctx.fillStyle = headGradient;
      ctx.beginPath();
      ctx.arc(pos.x + 16, pos.y - 4, 8, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = '#0a0a0a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(pos.x + 16, pos.y - 4, 8, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 105, 180, 0.6)';
      ctx.beginPath();
      ctx.ellipse(pos.x + 9, pos.y - 2, 2.5, 1.8, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(pos.x + 23, pos.y - 2, 2.5, 1.8, 0, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(pos.x + 14, pos.y - 11);
      ctx.quadraticCurveTo(pos.x + 8, pos.y - 24, pos.x + 5, pos.y - 32);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x + 18, pos.y - 11);
      ctx.quadraticCurveTo(pos.x + 24, pos.y - 24, pos.x + 27, pos.y - 32);
      ctx.stroke();

      ctx.save();
      ctx.translate(pos.x + 16, pos.y - 13);
      ctx.rotate(0.05);
      
      const capGradient = ctx.createRadialGradient(-1, -1, 2, 0, 0, 10);
      capGradient.addColorStop(0, '#7dd3fc');
      capGradient.addColorStop(0.5, '#3b82f6');
      capGradient.addColorStop(1, '#1e40af');
      ctx.fillStyle = capGradient;
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#0c1c2a';
      ctx.beginPath();
      ctx.ellipse(0, 4, 11, 3.5, 0, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, 2 * Math.PI);
      ctx.stroke();
      
      ctx.restore();

      // Ant legs
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      
      const frontLegPositions = [
        { startX: -8, startY: 4, endX: -14, endY: 20 },
        { startX: 2, startY: 8, endX: 2, endY: 24 },
        { startX: 12, startY: 4, endX: 18, endY: 20 }
      ];
      
      frontLegPositions.forEach((leg, idx) => {
        ctx.beginPath();
        ctx.moveTo(pos.x + leg.startX, pos.y + leg.startY);
        ctx.quadraticCurveTo(
          pos.x + leg.startX + (leg.endX - leg.startX) * 0.5,
          pos.y + leg.startY + (leg.endY - leg.startY) * 0.4,
          pos.x + leg.endX,
          pos.y + leg.endY
        );
        ctx.stroke();

        ctx.fillStyle = '#0a0a0a';
        ctx.beginPath();
        ctx.arc(
          pos.x + leg.startX + (leg.endX - leg.startX) * 0.6,
          pos.y + leg.startY + (leg.endY - leg.startY) * 0.6,
          1,
          0,
          2 * Math.PI
        );
        ctx.fill();
      });

      // Cargo box
      const boxX = pos.x - 22;
      const boxY = pos.y - 14;
      const boxWidth = 24;
      const boxHeight = 14;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(boxX + 1, boxY + boxHeight + 1, boxWidth, 3);

      const boxGradient = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxHeight);
      boxGradient.addColorStop(0, '#d4a574');
      boxGradient.addColorStop(1, '#a0826d');
      ctx.fillStyle = boxGradient;
      ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

      ctx.strokeStyle = '#6b5d52';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(boxX + 2, boxY + 1, boxWidth - 4, 2);

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(boxX, boxY + (i + 1) * 3);
        ctx.lineTo(boxX + boxWidth, boxY + (i + 1) * 3);
        ctx.stroke();
      }

      ctx.strokeStyle = '#8b7355';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(boxX + 5, boxY - 2);
      ctx.lineTo(boxX + 5, boxY + boxHeight + 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(boxX + boxWidth - 5, boxY - 2);
      ctx.lineTo(boxX + boxWidth - 5, boxY + boxHeight + 2);
      ctx.stroke();
    }
  }, [cities, antPosition, visitedPath, weatherMap, cityDemand]);

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white' 
    }}>
      <div style={{ 
        width: '360px', 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '28px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '18px',
        borderRight: '2px solid rgba(255, 255, 255, 0.3)',
        overflowY: 'auto',
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🐜 ← Our Salesman
        </h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '10px', 
            padding: '14px 18px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px', 
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s',
            border: 'none'
          }}>
            <Upload size={22} />
            <span style={{ fontSize: '15px', fontWeight: '600' }}>Upload CSV</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>

          <div style={{ 
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderRadius: '12px', 
            padding: '14px',
            border: '2px solid rgba(102, 126, 234, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
                Supply Weight (kg/unit)
              </label>
              <input
                type="number"
                step="0.01"
                value={supplyWeight}
                onChange={(e) => setSupplyWeight(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '2px solid rgba(102, 126, 234, 0.3)',
                  fontSize: '14px',
                  color: '#374151',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
                Stress Factor
              </label>
              <input
                type="number"
                step="0.01"
                value={stressFactor}
                onChange={(e) => setStressFactor(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '2px solid rgba(102, 126, 234, 0.3)',
                  fontSize: '14px',
                  color: '#374151',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <button
            onClick={runACO}
            disabled={!csvData || isRunning}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '10px', 
              padding: '14px 18px', 
              background: !csvData || isRunning ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              cursor: !csvData || isRunning ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              boxShadow: !csvData || isRunning ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.3s'
            }}
          >
            <Play size={22} />
            <span>{isRunning ? 'Running...' : 'Start'}</span>
          </button>

          <button
            onClick={() => {
              setVisitedPath([]);
              setAntPosition(null);
              setBestPath([]);
              setBestCost(0);
              
              const weather = {};
              const weatherValues = [1, 2, 4, 6];
              cities.forEach((city, idx) => {
                weather[idx] = weatherValues[Math.floor(Math.random() * weatherValues.length)];
              });
              setWeatherMap(weather);
              
              runACO();
            }}
            disabled={!csvData || isRunning}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '10px', 
              padding: '14px 18px', 
              background: !csvData || isRunning ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              cursor: !csvData || isRunning ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              boxShadow: !csvData || isRunning ? 'none' : '0 4px 15px rgba(245, 158, 11, 0.4)',
              transition: 'all 0.3s'
            }}
          >
            <RefreshCw size={22} />
            <span>Update</span>
          </button>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          borderRadius: '12px', 
          padding: '14px', 
          fontSize: '14px',
          border: '2px solid rgba(102, 126, 234, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              checked={useApi}
              onChange={(e) => setUseApi(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label style={{ fontWeight: '600', color: '#374151' }}>Use Python Backend</label>
          </div>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
            {useApi ? '✓ Connected to Flask API' : '⚠️ JavaScript only'}
          </div>
        </div>

        {totalSupply > 0 && (
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
            borderRadius: '12px', 
            padding: '16px',
            border: '2px solid rgba(251, 191, 36, 0.3)'
          }}>
            <h3 style={{ 
              fontWeight: '700', 
              marginBottom: '10px', 
              color: '#d97706', 
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Package size={18} />
              Supply Info
            </h3>
            <div style={{ fontSize: '14px', color: '#374151', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>Total Supply: <strong>{totalSupply} units</strong></div>
              <div>Unit Weight: <strong>{supplyWeight} kg</strong></div>
              <div>Total Weight: <strong>{(totalSupply * supplyWeight).toFixed(2)} kg</strong></div>
            </div>
          </div>
        )}

        {cities.length > 0 && (
          <>
            <div style={{ marginTop: '8px' }}>
              <h3 style={{ fontWeight: '700', marginBottom: '10px', color: '#374151', fontSize: '16px' }}>
                Weather Matrix
              </h3>
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
                borderRadius: '12px', 
                padding: '16px', 
                fontSize: '13px',
                border: '2px solid rgba(102, 126, 234, 0.15)',
                fontFamily: 'monospace'
              }}>
                <div style={{ 
                  color: '#667eea',
                  fontSize: '20px',
                  marginBottom: '-8px',
                  marginLeft: '-2px',
                  fontWeight: 'bold'
                }}>⎡</div>
                
                <div style={{ 
                  paddingLeft: '12px', 
                  paddingRight: '12px',
                  background: 'white',
                  borderRadius: '8px',
                  padding: '12px',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  {WeatherMatrix.length > 0 ? (
                    WeatherMatrix.map((row, rowIdx) => (
                      <div key={rowIdx} style={{
                        display: 'flex',
                        gap: '12px',
                        marginBottom: '6px',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        {row.map((value, colIdx) => {
                          const isDiagonal = rowIdx === colIdx;
                          const weather = Object.entries(weatherTypes).find(([val]) => parseInt(val) === value)?.[1] || weatherTypes[1];
                          
                          return (
                            <span key={colIdx} style={{ 
                              minWidth: '32px',
                              textAlign: 'center',
                              color: isDiagonal ? '#d1d5db' : weather.color,
                              fontWeight: '700',
                              opacity: isDiagonal ? 0.4 : 1
                            }}>
                              {value}
                            </span>
                          );
                        })}
                      </div>
                    ))
                  ) : (
                    <div style={{ color: '#9ca3af', textAlign: 'center', padding: '20px' }}>
                      Run the solver to see the weather matrix
                    </div>
                  )}
                </div>

                <div style={{ 
                  color: '#667eea',
                  fontSize: '20px',
                  marginTop: '-8px',
                  marginLeft: '-2px',
                  fontWeight: 'bold'
                }}>⎣</div>

                <div style={{ 
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '2px solid rgba(102, 126, 234, 0.2)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px'
            }}>
              {Object.entries(weatherTypes).map(([value, weather]) => {
                const WeatherIcon = weather.icon;
                return (
                  <div key={value} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#374151',
                    fontSize: '12px',
                    background: 'white',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: `2px solid ${weather.color}40`
                  }}>
                    <WeatherIcon size={16} color={weather.color} strokeWidth={2.5} />
                    <span style={{ fontWeight: '600' }}>{weather.name} = {value}</span>
                  </div>
                );
              })}
            </div>

            <div style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '2px solid rgba(102, 126, 234, 0.2)',
              color: '#6b7280',
              fontSize: '11px',
              maxHeight: '100px',
              overflowY: 'auto',
              background: 'white',
              borderRadius: '8px',
              padding: '10px'
            }}>
              <div style={{ fontWeight: '700', marginBottom: '6px', color: '#374151' }}>City Index:</div>
              {cities.map((city, idx) => (
                <div key={idx} style={{ marginBottom: '3px' }}>
                  <span style={{ color: '#667eea', fontWeight: '700' }}>[{idx}]</span> = {city}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '8px' }}>
          <h3 style={{ fontWeight: '700', marginBottom: '10px', color: '#374151', fontSize: '16px' }}>
            Cities ({cities.length})
          </h3>
          <div style={{ 
            maxHeight: '180px', 
            overflowY: 'auto', 
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
            borderRadius: '12px', 
            padding: '14px', 
            fontSize: '14px',
            border: '2px solid rgba(102, 126, 234, 0.15)'
          }}>
            {cities.map((city, idx) => {
              const weather = weatherTypes[weatherMap[idx]];
              const WeatherIcon = weather.icon;
              return (
                <div key={idx} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  color: '#374151',
                  fontWeight: '500'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <WeatherIcon size={18} color={weather.color} strokeWidth={2.5} />
                    <span>{city}</span>
                  </div>
                  {cityDemand[idx] && (
                    <span style={{ 
                      fontSize: '12px', 
                      background: '#fef3c7',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      color: '#d97706',
                      fontWeight: '600'
                    }}>
                      {cityDemand[idx]}u
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </>
    )}

    {bestPath.length > 0 && (
      <div style={{ 
        marginTop: '8px', 
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)',
        borderRadius: '12px', 
        padding: '18px',
        border: '2px solid rgba(16, 185, 129, 0.3)'
      }}>
        <h3 style={{ fontWeight: '700', marginBottom: '12px', color: '#059669', fontSize: '16px' }}>
          ✨ Results
        </h3>
        <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <span style={{ color: '#6b7280', fontWeight: '600' }}>Total Cost:</span>
            <span style={{ 
              marginLeft: '10px', 
              fontWeight: 'bold', 
              color: '#059669',
              fontSize: '18px'
            }}>
              {bestCost}
            </span>
          </div>
          <div>
            <span style={{ color: '#6b7280', fontWeight: '600' }}>Path:</span>
            <div style={{ 
              marginTop: '6px', 
              fontSize: '12px', 
              background: 'white',
              borderRadius: '8px', 
              padding: '10px', 
              maxHeight: '140px', 
              overflowY: 'auto',
              color: '#374151',
              fontWeight: '500',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              {bestPath.map(idx => cities[idx]).join(' → ')} → {cities[bestPath[0]]}
            </div>
          </div>
        </div>
      </div>
    )}
  </div>

  <div style={{ 
    flex: 1, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: '20px'
  }}>
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ 
        border: '3px solid rgba(255, 255, 255, 0.3)', 
        borderRadius: '16px', 
        background: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}
    />
  </div>
</div>
  );
}

export default App;
