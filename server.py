import json
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
from flask import request

app = Flask(__name__)


# ROUTES
data = 0
with open('static/data.json', 'r') as f:
    data = json.load(f)
    f.close()
@app.route('/')
def home():
    return render_template('home.html', data=data)   

@app.route('/add', methods=['GET', 'POST'])
def add():  
    with open('static/data.json', 'r') as f:
        data = json.load(f)
        f.close()
    if request.method == 'POST':
        try:
            # Get the JSON data from the request
            player_data = request.get_json()
            # Append the new player data to the existing data
            new_player_id = str(player_data['player_id'])
            data[new_player_id] = player_data
            # Write the sorted data back to the JSON file
            with open('static/data.json', 'w') as f:
                sorted_data = {k: data[k] for k in sorted(data, key=lambda x: int(x))}
                json.dump(sorted_data, f, indent=4)
            # For demonstration purposes, let's just print the player data
            print("New player added:")
            # You can send a response back to the client if needed
            return jsonify(data=data)
        except Exception as e:
            # Handle any exceptions that occur during file writing
            print("Error:", e)
            return jsonify(error="An error occurred while adding the player.")
    
    # You can send a response back to the client if needed
    return render_template('add.html')

@app.route('/search', methods=['GET'])
def search():
    with open('static/data.json', 'r') as f:
        data = json.load(f)
        f.close()
    query = request.args.get('query', '')
    if not query:
        return render_template('search.html', results=[], query=query)

    matching_results = []
    for key in data:
        item = data[key] 
        if query.strip().lower() in item['name'].lower():
            matching_results.append(item)
        if query.strip().lower() in item['team'].lower():
            if item not in matching_results:
                matching_results.append(item)
        if query.lower() in item['position'].lower() or ((len(query) > 2) and query.strip().lower() in item['position_full'].lower()):
            if item not in matching_results:
                matching_results.append(item)

    return render_template('search.html', results=matching_results, query=query)

@app.route('/view/<id>', methods=['GET'])
def view(id= None):
    with open('static/data.json', 'r') as f:
        data = json.load(f)
        f.close()
    global player
 
    player= data[id]

    return render_template('view.html', player=player)

@app.route('/edit/<id>', methods=['GET', 'POST'])
def edit(id= None):
    with open('static/data.json', 'r') as f:
        data = json.load(f)
        f.close()
    global player
    
    player= data[id]

    if request.method == 'POST':
        try:
            # Get the JSON data from the request
            player_data = request.get_json()
            # Append the new player data to the existing data
            data[id] = player_data
            print(data["2"])
            # Write the sorted data back to the JSON file
            with open('static/data.json', 'w') as f:
                sorted_data = {k: data[k] for k in sorted(data, key=lambda x: int(x))}
                json.dump(sorted_data, f, indent=4)
            # For demonstration purposes, let's just print the player data
            print("Edit Made:")
            # You can send a response back to the client if needed
            return jsonify(data=data)
        except Exception as e:
            # Handle any exceptions that occur during file writing
            print("Error:", e)
            return jsonify(error="An error occurred while editing the player.")

    return render_template('edit.html', player=player)

if __name__ == '__main__':
   app.run(debug = True)