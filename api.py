from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import io
import csv
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

weather = {"sunny": 1, "rainy": 4, "cloudy": 2, "stormy": 6}

def parse_csv_data(csv_text):
    """Parse CSV text data"""
    cities = []
    distance_matrix = []
    
    reader = csv.reader(io.StringIO(csv_text))
    header = next(reader)
    
    for row in reader:
        if len(row) < 2:
            continue
        cities.append(row[0])
        distance_matrix.append([float(x.strip()) for x in row[1:]])
    
    return cities, np.array(distance_matrix)

def calculate_path_length(path, distance_matrix):
    """Basic path length calculation (legacy support)"""
    length = 0
    for i in range(len(path) - 1):
        length += distance_matrix[path[i], path[i+1]]
    length += distance_matrix[path[-1], path[0]]
    return length

def calculate_weight_aware_cost(path, distance_matrix, city_demand, supply_weight, stress_factor=0.1):
    """
    Calculate the total cost of a path considering weight and stress.
    - Ant starts with ALL total supply weight
    - As it visits each city, it drops the demand for that city
    - Weight progressively decreases (lighter load)
    - Stress accumulates based on weight carried on each segment
    Cost = sum of (distance + stress_accumulated_on_segment)
    """
    total_cost = 0
    stress = 0
    
    # Calculate total initial weight
    total_demand = sum(city_demand.values())
    
    # Calculate weight at each segment (before visiting that city)
    weights_at_segment = []
    current_weight = total_demand * supply_weight
    for i in range(len(path)):
        weights_at_segment.append(current_weight)
        # After visiting this city, drop its demand
        current_weight -= city_demand[path[i]] * supply_weight
    
    # Calculate cost for each segment
    for i in range(len(path)):
        current_city = path[i]
        next_city = path[(i + 1) % len(path)]
        distance = distance_matrix[current_city, next_city]
        
        # Weight carried on this segment (before dropping at next city)
        weight_on_segment = weights_at_segment[i]
        
        # Stress increases based on weight carried
        stress += weight_on_segment
        
        # Cost for this segment: distance + stress contribution
        segment_cost = distance + (stress * stress_factor)
        total_cost += segment_cost
    
    return total_cost

def select_next_city(current_city, allowed, pheromone, distance_matrix, alpha, beta):
    pheromone_values = pheromone[current_city, allowed] ** alpha
    distances = distance_matrix[current_city, allowed]
    heuristic = (1.0 / distances) ** beta
    probabilities = pheromone_values * heuristic
    probabilities /= probabilities.sum()
    next_city = np.random.choice(allowed, p=probabilities)
    return next_city

def ant_colony_optimization(distance_matrix, weather_map, n_ants=3, n_iterations=10, 
                           alpha=1, beta=2, rho=0.5, Q=1, supply_weight=0.1, stress_factor=0.1):
    n_cities = distance_matrix.shape[0]
    
    # Generate city demands
    demand = np.random.choice(np.arange(100, 250, 10), size=n_cities)
    city_demand = {i: int(demand[i]) for i in range(n_cities)}
    total_supply = int(np.sum(demand))
    
    # Build weather impact matrix
    distance_matrix = distance_matrix.astype(float)
    weather_values = list(weather.values())
    weather_matrix = np.array(random.choices(weather_values, k=n_cities * n_cities)).reshape((n_cities, n_cities))
    weather_matrix[np.diag_indices(n_cities)] = 0
    
    # Add weather impact to distance matrix
    distance_matrix = distance_matrix + weather_matrix
    
    pheromone = np.ones((n_cities, n_cities))
    best_path = None
    best_length = float('inf')
    
    iteration_data = []
    
    for iteration in range(n_iterations):
        all_paths = []
        all_lengths = []
        
        for ant in range(n_ants):
            start_city = random.randint(0, n_cities - 1)
            path = [start_city]
            allowed = list(range(n_cities))
            allowed.remove(start_city)
            
            while allowed:
                current_city = path[-1]
                next_city = select_next_city(current_city, allowed, pheromone, 
                                            distance_matrix, alpha, beta)
                path.append(next_city)
                allowed.remove(next_city)
            
            # Use weight-aware cost calculation
            length = calculate_weight_aware_cost(path, distance_matrix, city_demand, 
                                                supply_weight, stress_factor)
            all_paths.append(path)
            all_lengths.append(length)
            
            if length < best_length:
                best_length = length
                best_path = path
        
        # Update pheromones
        pheromone *= (1 - rho)
        for path, length in zip(all_paths, all_lengths):
            for i in range(len(path) - 1):
                pheromone[path[i], path[i+1]] += Q / length
                pheromone[path[i+1], path[i]] += Q / length
            pheromone[path[-1], path[0]] += Q / length
            pheromone[path[0], path[-1]] += Q / length
        
        iteration_data.append({
            'iteration': iteration + 1,
            'best_length': float(best_length),
            'best_path': best_path
        })
    
    return best_path, float(best_length), iteration_data, city_demand, total_supply, weather_matrix

@app.route('/')
def home():
    return jsonify({
        'message': 'Ant Colony TSP API with Weight-Aware Cost',
        'endpoints': {
            'health': '/api/health',
            'solve': '/api/solve (POST)'
        }
    })

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Flask server is running!'})

@app.route('/api/solve', methods=['POST', 'OPTIONS'])
def solve_tsp():
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        print("Received request to /api/solve")
        data = request.json
        csv_text = data.get('csv_data')
        weather_map = data.get('weather_map', {})
        
        # Get optional parameters with defaults
        supply_weight = data.get('supply_weight', 0.1)
        stress_factor = data.get('stress_factor', 0.1)
        
        if not csv_text:
            return jsonify({'success': False, 'error': 'No CSV data provided'}), 400
        
        weather_map = {int(k): v for k, v in weather_map.items()}
        cities, distance_matrix = parse_csv_data(csv_text)
        
        best_path, best_length, iteration_data, city_demand, total_supply, weather_matrix = ant_colony_optimization(
            distance_matrix, weather_map, n_ants=3, n_iterations=10, 
            alpha=1, beta=2, rho=0.5, Q=1, 
            supply_weight=supply_weight, stress_factor=stress_factor
        )
        
        # Convert numpy types to Python types
        return jsonify({
            'success': True,
            'cities': cities,
            'best_path': [int(x) for x in best_path],
            'best_length': float(best_length),
            'city_demand': {int(k): int(v) for k, v in city_demand.items()},
            'total_supply': int(total_supply),
            'supply_weight': float(supply_weight),
            'stress_factor': float(stress_factor),
            'weather_matrix': weather_matrix.tolist(),  # Return the actual weather matrix
            'iterations': [{
                'iteration': int(item['iteration']),
                'best_length': float(item['best_length']),
                'best_path': [int(x) for x in item['best_path']]
            } for item in iteration_data]
        })
    
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == '__main__':
    print("=" * 50)
    print("Starting Enhanced Flask Server...")
    print("Features: Weight-Aware Cost, City Demands, Stress Factor")
    print("Server will run on: http://localhost:5005")
    print("Health check: http://localhost:5005/api/health")
    print("=" * 50)
    app.run(debug=True, port=5005, host='0.0.0.0')