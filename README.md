# 🐜 Ant Colony Optimization TSP Solver

<div align="center">

![Ant Logo](https://img.icons8.com/fluency/96/000000/ant.png)

**Advanced Traveling Salesman Problem Solver with Weight-Aware Cost Optimization**

*Intelligent Route Planning with Weather Impact, Supply Management & Stress Factors*

[![Flask](https://img.shields.io/badge/Flask-2.0+-green?logo=flask)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-18.0+-blue?logo=react)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue?logo=python)](https://www.python.org/)
[![NumPy](https://img.shields.io/badge/NumPy-1.21+-orange?logo=numpy)](https://numpy.org/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#%EF%B8%8F-architecture)
- [Features](#-features)
- [Live Demo](#-live-demo)
- [System Components](#-system-components)
- [Technology Stack](#%EF%B8%8F-technology-stack)
- [Getting Started](#-getting-started)
- [Algorithm Explained](#-algorithm-explained)
- [API Documentation](#-api-documentation)
- [User Interface](#-user-interface)

---

## 🎯 Overview

The **Ant Colony Optimization TSP Solver** is a sophisticated web application that solves the Traveling Salesman Problem using bio-inspired ant colony optimization. Unlike traditional TSP solvers, this system incorporates real-world factors like weather conditions, supply weight management, and delivery stress to provide practical route optimization for logistics and delivery scenarios.

### Key Capabilities

- 🐜 **Bio-Inspired Algorithm** - Mimics ant pheromone behavior for optimal pathfinding
- 🌦️ **Weather Integration** - Dynamic weather conditions affect travel costs
- 📦 **Weight-Aware Optimization** - Progressive weight reduction as deliveries are made
- 💪 **Stress Factor Modeling** - Accumulated stress based on cargo weight over distance
- 🎨 **Interactive Visualization** - Real-time animated ant movement along optimized routes
- 📊 **Dynamic Demand Generation** - Realistic city demand patterns (100-250 units)
- 🔄 **Iterative Improvement** - Tracks convergence over multiple iterations

---

## 🏗️ Architecture

The system follows a modern client-server architecture with real-time visualization:

```
┌─────────────────────────────────────────────────────────┐
│                  Presentation Layer                     │
│         (React + Canvas API + Lucide Icons)            │
│           Animated TSP Visualization                    │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                Application Layer                        │
│          Flask REST API with NumPy Engine               │
│    (ACO Algorithm + Weight-Aware Cost Function)        │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                   Data Layer                            │
│         CSV Distance Matrices + In-Memory State         │
│      (City Distances, Weather Maps, Demand Data)       │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **File Upload** → User uploads CSV distance matrix
2. **Weather Generation** → Random weather assigned to each city
3. **API Request** → React sends problem data to Flask backend
4. **ACO Execution** → Python runs ant colony optimization with weight-aware cost
5. **Path Optimization** → Iterative pheromone updates find best route
6. **Response** → Optimal path, cost, and demand data returned
7. **Animation** → Ant visually traverses the solution path on canvas

---

## ✨ Features

### 🐜 Advanced ACO Algorithm
- **Pheromone Management**: Dynamic trail updates with evaporation (ρ = 0.5)
- **Heuristic Balance**: Configurable α (pheromone importance) and β (distance importance)
- **Multi-Ant Simulation**: 3 concurrent ants per iteration for diverse exploration
- **Probabilistic Selection**: Weighted random city selection based on pheromone × heuristic
- **Convergence Tracking**: Best path recorded across 10 iterations

### 📦 Weight-Aware Cost Optimization
**Revolutionary Cost Model**
```
Total Cost = Σ (Distance + Accumulated_Stress × Stress_Factor)
```

**How It Works**
1. **Initial Load**: Ant carries total supply weight for all cities
2. **Progressive Delivery**: Weight decreases after each city visit
3. **Stress Accumulation**: Heavier loads increase cumulative stress
4. **Segment Cost**: Each edge cost = distance + stress contribution
5. **Realistic Simulation**: Mimics real-world delivery vehicle constraints

**Configurable Parameters**
- **Supply Weight**: kg per demand unit (default: 0.1 kg/unit)
- **Stress Factor**: Stress multiplier (default: 0.1)
- **Fine-Tuning**: Adjust balance between distance and weight impact

### 🌦️ Weather Impact System
**Four Weather Types**
- ☀️ **Sunny** (Impact: +1) - Optimal conditions
- ☁️ **Cloudy** (Impact: +2) - Slight visibility reduction
- 🌧️ **Rainy** (Impact: +4) - Wet roads, slower travel
- ⛈️ **Stormy** (Impact: +6) - Hazardous conditions

**Dynamic Weather Matrix**
- Random assignment per city
- Affects travel costs between all city pairs
- Visual indicators with color-coded icons
- Randomizable for scenario testing

### 🎨 Stunning Visualization
**Interactive Canvas**
- **City Nodes**: Circular nodes with weather backgrounds
- **Demand Labels**: Yellow tags showing delivery units
- **Path Tracing**: Green lines for traversed routes
- **Animated Ant**: Detailed 3D-style ant sprite with:
  - Segmented body (abdomen, thorax, head)
  - Articulated legs with joints
  - Antennae with curves
  - Blue delivery cap
  - Cargo box on back
  - Shadow effects

**Layout**
- Circular arrangement of cities
- 200px radius for optimal viewing
- 800×600 canvas with gradient background
- Smooth 30-step interpolation between cities

### 📊 Real-Time Statistics
**Supply Information Panel**
- Total supply across all cities
- Per-unit weight configuration
- Total cargo weight calculation
- City-specific demand breakdown

**Results Display**
- Best path cost (distance + stress)
- Complete route sequence
- Iteration-by-iteration improvement tracking
- Visual convergence feedback

### 🎛️ User Controls
- **CSV Upload**: Custom distance matrix input
- **Start Button**: Initialize optimization run
- **Update Button**: Regenerate weather and re-solve
- **Parameter Sliders**: Adjust supply weight & stress factor
- **Backend Toggle**: Switch between Python API and JavaScript (API only currently)

---

## 🌐 Live Demo

**Try the application locally by following the [Getting Started](#-getting-started) guide!**

Default URLs after setup:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5005`

---

## 🧩 System Components

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Backend API** | Flask | ACO algorithm execution |
| **Optimization Engine** | NumPy | Matrix operations & calculations |
| **Frontend UI** | React | Interactive user interface |
| **Visualization** | HTML5 Canvas | Path animation rendering |
| **Icons** | Lucide React | Weather & UI icons |
| **Data Input** | CSV Parser | Distance matrix parsing |

---

## 🛠️ Technology Stack

### Backend
- **Flask** - Lightweight Python web framework with CORS support
- **NumPy** - High-performance numerical computing for matrix operations
- **Python 3.8+** - Core programming language
- **csv module** - CSV file parsing

### Frontend
- **React 18** - Component-based UI library
- **HTML5 Canvas** - 2D graphics rendering for visualization
- **Lucide React** - Beautiful icon set for weather indicators
- **Vanilla CSS** - Gradient styling with modern effects

### Algorithm
- **Ant Colony Optimization** - Metaheuristic optimization algorithm
- **Pheromone Model** - Probabilistic trail-following mechanism
- **Greedy Heuristic** - Distance-based city preference

### Development Tools
- **Git** - Version control
- **npm** - JavaScript package manager
- **pip** - Python package manager
- **Postman** - API testing

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js 14+ and npm
- pip (Python package manager)
- Git

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/ant-colony-visualizer.git
   cd ant-colony-visualizer
   ```

2. **Set Up Backend (Flask)**
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate (Windows)
   venv\Scripts\activate
   
   # Activate (Mac/Linux)
   source venv/bin/activate
   
   # Install dependencies
   pip install flask flask-cors numpy
   ```

3. **Set Up Frontend (React)**
   ```bash
   # Install Node dependencies (package.json)
   npm install
   
   # Dependencies include:
   # - react, react-dom
   # - lucide-react (icons)
   # - testing libraries
   ```

4. **Prepare Sample Data**
   
   Create a CSV file `cities.csv` with distance matrix:
   ```csv
   City,City1,City2,City3,City4,City5
   City1,0,10,15,20,25
   City2,10,0,35,25,30
   City3,15,35,0,30,20
   City4,20,25,30,0,15
   City5,25,30,20,15,0
   ```

5. **Run the Backend Server**
   ```bash
   python api.py
   ```
   Server will start on `http://localhost:5005`

6. **Run the Frontend Application**
   ```bash
   npm start
   ```
   Application will open at `http://localhost:3000`

### Initial Usage

1. **Upload CSV**: Click "Upload CSV" and select your distance matrix file
2. **Configure Parameters** (optional):
   - Supply Weight: 0.01 - 1.0 kg/unit
   - Stress Factor: 0.01 - 1.0
3. **Start Optimization**: Click "Start" to run ACO algorithm
4. **Watch Animation**: Observe the ant traversing the optimal path
5. **Analyze Results**: Review total cost and route sequence

---

## 🧮 Algorithm Explained

### Ant Colony Optimization Overview

ACO is inspired by the foraging behavior of real ants:

1. **Pheromone Trails**: Ants deposit pheromones on paths
2. **Evaporation**: Trails gradually fade over time
3. **Reinforcement**: Shorter paths accumulate stronger pheromones
4. **Convergence**: Colony converges on optimal solution

### Weight-Aware Cost Function

**Traditional TSP**: Only considers distance
```
Cost = Distance(A→B) + Distance(B→C) + ... + Distance(Z→A)
```

**Our Enhanced Model**: Factors in cargo weight and stress
```
Cost = Σ [Distance(i→j) + (Accumulated_Stress × Stress_Factor)]

Where:
- Accumulated_Stress += Current_Weight_On_Segment
- Current_Weight = Total_Supply - Delivered_So_Far
- Total_Supply = Σ City_Demands × Supply_Weight
```

**Example Calculation**

Cities: A(150u), B(200u), C(180u)  
Supply Weight: 0.1 kg/unit  
Stress Factor: 0.1  
Distances: A-B=10, B-C=15, C-A=12

```
Total Supply = (150 + 200 + 180) × 0.1 = 53 kg

Segment A→B:
  Weight = 53 kg
  Stress += 53 → Stress = 53
  Cost = 10 + (53 × 0.1) = 15.3

Segment B→C:
  Weight = 53 - 20 = 33 kg (delivered 200u at B)
  Stress += 33 → Stress = 86
  Cost = 15 + (86 × 0.1) = 23.6

Segment C→A:
  Weight = 33 - 18 = 15 kg
  Stress += 15 → Stress = 101
  Cost = 12 + (101 × 0.1) = 22.1

Total Cost = 15.3 + 23.6 + 22.1 = 61.0
```

### Algorithm Pseudocode

```python
function ANT_COLONY_OPTIMIZATION(distance_matrix, weather_map):
    # Initialize
    pheromone = matrix of ones
    best_path = None
    best_cost = infinity
    
    # Generate city demands
    city_demand = random(100, 250) for each city
    
    # Add weather impact to distances
    distance_matrix += weather_matrix
    
    # Main loop
    for iteration in 1 to n_iterations:
        all_paths = []
        
        # Simulate ants
        for ant in 1 to n_ants:
            path = construct_path(pheromone, distance_matrix)
            cost = calculate_weight_aware_cost(path, distance_matrix, 
                                               city_demand, supply_weight, 
                                               stress_factor)
            all_paths.append((path, cost))
            
            if cost < best_cost:
                best_cost = cost
                best_path = path
        
        # Update pheromones
        pheromone *= (1 - evaporation_rate)
        for path, cost in all_paths:
            for edge in path:
                pheromone[edge] += Q / cost
    
    return best_path, best_cost

function CONSTRUCT_PATH(pheromone, distance_matrix):
    start_city = random_city()
    path = [start_city]
    unvisited = all_cities - start_city
    
    while unvisited:
        current = path.last()
        
        # Calculate probabilities
        for city in unvisited:
            pheromone_factor = pheromone[current][city] ^ alpha
            heuristic_factor = (1 / distance_matrix[current][city]) ^ beta
            probability[city] = pheromone_factor * heuristic_factor
        
        # Normalize and select
        probabilities /= sum(probabilities)
        next_city = weighted_random_choice(unvisited, probabilities)
        
        path.append(next_city)
        unvisited.remove(next_city)
    
    return path
```

### Parameter Tuning Guide

**Alpha (α)**: Pheromone importance
- High α → Trust pheromone trails more
- Low α → Explore more freely
- Default: 1

**Beta (β)**: Distance heuristic importance
- High β → Prefer closer cities
- Low β → Less greedy selection
- Default: 2

**Rho (ρ)**: Evaporation rate
- High ρ → Trails fade quickly (more exploration)
- Low ρ → Trails persist longer (more exploitation)
- Default: 0.5

**Q**: Pheromone deposit quantity
- Scales pheromone intensity
- Default: 1

---

## 📌 API Documentation

### Health Check

**GET /api/health**
- Returns server status
- Response:
  ```json
  {
    "status": "healthy",
    "message": "Flask server is running!"
  }
  ```

### Solve TSP

**POST /api/solve**

**Request Body**:
```json
{
  "csv_data": "City,City1,City2...\nCity1,0,10,15...",
  "weather_map": {
    "0": 1,
    "1": 4,
    "2": 2
  },
  "supply_weight": 0.1,
  "stress_factor": 0.1
}
```

**Response**:
```json
{
  "success": true,
  "cities": ["City1", "City2", "City3", "City4", "City5"],
  "best_path": [0, 3, 1, 4, 2],
  "best_length": 67.85,
  "city_demand": {
    "0": 150,
    "1": 200,
    "2": 180,
    "3": 130,
    "4": 220
  },
  "total_supply": 880,
  "supply_weight": 0.1,
  "stress_factor": 0.1,
  "iterations": [
    {
      "iteration": 1,
      "best_length": 85.2,
      "best_path": [0, 1, 2, 3, 4]
    },
    {
      "iteration": 2,
      "best_length": 72.4,
      "best_path": [0, 3, 1, 4, 2]
    },
    ...
  ]
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "No CSV data provided"
}
```

---

## 🎨 User Interface

### Layout Overview

**Left Sidebar (360px)**
- Gradient purple-pink header with ant emoji
- CSV upload button with icon
- Parameter configuration panel
  - Supply weight input (number)
  - Stress factor input (number)
- Control buttons
  - Start (green gradient)
  - Update (orange gradient, randomizes weather)
- Backend toggle checkbox
- Supply info panel (when data loaded)
  - Total supply units
  - Unit weight
  - Total cargo weight
- Cities list with weather icons and demand badges
- Results panel (when solved)
  - Total cost
  - Complete route sequence

**Main Canvas Area (800×600)**
- White background with rounded borders
- Circular city layout with:
  - Weather-colored halos (40px radius)
  - Blue gradient city circles (25px)
  - White city name labels
  - Yellow demand unit labels
- Green path lines connecting visited cities
- Animated ant sprite with:
  - Realistic body segments
  - Moving legs
  - Delivery cap
  - Cargo box
  - Drop shadow

### Responsive Design
- Sidebar scrollable for many cities
- Canvas centered in flex container
- Gradient backgrounds throughout
- Box shadows for depth
- Smooth transitions on hover

### Color Palette
- **Primary**: `#667eea` → `#764ba2` (purple-pink gradient)
- **Success**: `#10b981` → `#059669` (green gradient)
- **Warning**: `#f59e0b` → `#d97706` (orange gradient)
- **Background**: `rgba(255, 255, 255, 0.95)` (frosted glass)
- **Text**: `#374151` (dark gray)

---

## 📁 Project Structure

```
ant-colony-visualizer/
│
├── 📁 build/                          # Production build output
│   └── static/                        # Compiled CSS, JS, media files
│
├── 📁 node_modules/                   # Node.js dependencies (648 KB)
│
├── 📁 public/                         # Static assets
│   ├── favicon.ico                    # App icon (4 KB)
│   ├── index.html                     # HTML template (2 KB)
│   ├── logo192.png                    # PWA icon (6 KB)
│   ├── logo512.png                    # PWA icon (10 KB)
│   ├── manifest.json                  # PWA manifest (1 KB)
│   └── robots.txt                     # SEO crawler rules (1 KB)
│
├── 📁 src/                            # React source code
│   ├── App.css                        # Component styles (1 KB)
│   ├── App.js                         # Main React component (25 KB)
│   │   ├── File upload handling
│   │   ├── Canvas rendering logic
│   │   ├── Ant animation engine
│   │   ├── Weather visualization
│   │   ├── AJAX API calls
│   │   └── State management
│   ├── App.test.js                    # Unit tests (1 KB)
│   ├── index.css                      # Global styles (1 KB)
│   ├── index.js                       # React entry point (1 KB)
│   ├── logo.svg                       # React logo (3 KB)
│   ├── reportWebVitals.js             # Performance monitoring (1 KB)
│   └── setupTests.js                  # Test configuration (1 KB)
│
├── 📄 .gitignore                      # Git exclusions (1 KB)
├── 📄 api.py                          # Flask backend server (9 KB)
│   ├── Distance matrix parsing
│   ├── ACO algorithm implementation
│   ├── Weight-aware cost function
│   ├── Weather impact integration
│   ├── Demand generation
│   └── REST API endpoints
│
├── 📄 package.json                    # Node.js dependencies (1 KB)
├── 📄 package-lock.json               # Dependency lock file (648 KB)
└── 📄 README.md                       # This file
```

### Key Files Explained

**api.py (9 KB)** - Flask Backend
- HTTP endpoints for ACO optimization
- NumPy-based matrix operations
- Weather impact calculations
- CSV parsing utilities
- Weight-aware cost function
- Pheromone update logic

**src/App.js (25 KB)** - React Frontend
- Main application component
- Canvas-based visualization
- Ant animation with 30-step interpolation
- File upload and CSV parsing
- Real-time state updates
- Weather icon rendering (Lucide React)

**public/index.html (2 KB)** - HTML Template
- Single-page application shell
- Meta tags for SEO and PWA
- Root div mount point

**package.json (1 KB)** - Dependencies
- React 18+
- Lucide React (icons)
- Testing libraries
- Build scripts

---

## 🔬 Algorithm Performance

### Complexity Analysis

**Time Complexity**: O(n² × ants × iterations)
- n: Number of cities
- Default: O(n² × 3 × 10) = O(30n²)

**Space Complexity**: O(n²)
- Distance matrix: n×n
- Pheromone matrix: n×n
- Weather matrix: n×n

### Scalability

| Cities | Iterations | Time (approx) | Use Case |
|--------|-----------|---------------|----------|
| 5-10   | 10        | <1 second     | Demo/Testing |
| 10-20  | 20        | 1-3 seconds   | Small logistics |
| 20-50  | 50        | 5-15 seconds  | City delivery |
| 50-100 | 100       | 30-60 seconds | Regional routing |

### Optimization Tips

1. **Reduce Iterations**: For quick results, use 5-10 iterations
2. **Fewer Ants**: Single ant per iteration for speed
3. **Parameter Tuning**: Higher β for greedy (faster) solutions
4. **Preprocessing**: Cache weather matrix calculations

---

## 🚀 Advanced Features

### CSV Format Flexibility
- **Square Matrix**: First column is city names, rest is distances
- **Symmetric**: Handles both symmetric and asymmetric matrices
- **Headers**: Automatically extracts city names from row 0
- **Validation**: Skips malformed rows gracefully

### Weather Randomization
- **Update Button**: Regenerates weather without re-uploading CSV
- **Consistent Icons**: Sunny, Cloudy, Rainy, Stormy with unique colors
- **Visual Feedback**: Halo circles around cities show weather type

### Animation System
- **30 Steps**: Smooth interpolation between cities
- **50ms Delay**: Configurable animation speed
- **Path Memory**: Visited segments turn green permanently
- **Ant State**: Position tracked as (from_city, to_city, progress)

### Parameter Sensitivity
- **Supply Weight**: Lower = less impact (0.01-0.1 recommended)
- **Stress Factor**: Lower = less stress accumulation (0.05-0.2 optimal)
- **Interactive Tuning**: Change values and re-run to compare results

---

## 🐛 Known Issues & Limitations

1. **JavaScript Mode**: Not implemented, must use Python backend
2. **Large Matrices**: 100+ cities may cause browser lag during animation
3. **CSV Format**: Assumes specific structure, limited error messages
4. **No Path Export**: Cannot save best route to file
5. **Single Solution**: Doesn't show top-k best paths
6. **Weather Static**: Weather doesn't change during animation (future: dynamic)

---

## 🔮 Future Enhancements

### Planned Features
- [ ] **Multiple Algorithms**: Genetic Algorithm, Simulated Annealing comparison
- [ ] **Path Export**: Download optimal route as CSV/JSON
- [ ] **Historical Tracking**: Compare runs and parameters
- [ ] **3D Visualization**: WebGL rendering for larger problems
- [ ] **Real-Time Weather API**: Fetch actual weather conditions
- [ ] **Multi-Depot Support**: Multiple starting warehouses
- [ ] **Time Windows**: Delivery deadline constraints
- [ ] **Capacity Constraints**: Vehicle load limits
- [ ] **Interactive Editing**: Drag cities, adjust distances manually
- [ ] **Mobile Responsive**: Touch-friendly controls

### Algorithmic Improvements
- [ ] **Adaptive Parameters**: Auto-tune α, β, ρ based on convergence
- [ ] **Parallel Ants**: Multi-threaded execution for speed
- [ ] **Local Search**: 2-opt refinement after ACO
- [ ] **Hybrid Approach**: ACO + Nearest Neighbor initialization
- [ ] **Dynamic Pheromone**: Adaptive evaporation rates

---

## 📚 Research & References

### Academic Papers
1. Dorigo, M., & Gambardella, L. M. (1997). "Ant Colony System: A Cooperative Learning Approach to the Traveling Salesman Problem"
2. Stützle, T., & Hoos, H. H. (2000). "MAX–MIN Ant System"
3. López-Ibáñez, M., et al. (2016). "The Irace Package: Iterated Racing for Automatic Algorithm Configuration"

### Useful Resources
- [ACO Tutorial](https://en.wikipedia.org/wiki/Ant_colony_optimization_algorithms)
- [TSP Benchmarks](http://comopt.ifi.uni-heidelberg.de/software/TSPLIB95/)
- [Visualization Examples](https://www.redblobgames.com/pathfinding/a-star/introduction.html)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingAlgorithm`)
3. Commit your changes (`git commit -m 'Add hybrid ACO-GA approach'`)
4. Push to the branch (`git push origin feature/AmazingAlgorithm`)
5. Open a Pull Request

### Coding Standards
- Python: Follow PEP 8, type hints encouraged
- JavaScript/React: ESLint rules, functional components
- Comments: Document algorithm steps clearly
- Testing: Add unit tests for new cost functions

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Ant Colony Research Community** - For groundbreaking metaheuristic algorithms
- **NumPy Team** - For high-performance numerical computing
- **React Team** - For making UI development enjoyable
- **Flask Community** - For the minimalist web framework
- **Lucide Icons** - For beautiful, consistent iconography

---

## 📞 Support

For questions, issues, or suggestions:

- **Email**: retajashraf512@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/Retaj512/Salesman-Problem-ACO-/issues)
- **Project Path**: `MY PROJECTS/My Python/Smart System project/ant-colony-visualizer`

---

<div align="center">

**Built with 🐜 for Logistics Optimization**

⭐ Star this repo if you found it helpful! ⭐

</div>
