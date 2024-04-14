import datetime
from flask import Flask, request, render_template, send_from_directory, jsonify
import os
import pandas as pd
from werkzeug.utils import secure_filename
import matplotlib.pyplot as plt

app = Flask(__name__, static_url_path='/static')

@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        # Check if the POST request has the file part
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'})

        file = request.files['file']
        # If user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            return jsonify({'error': 'No selected file'})

        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join('static', filename)
            file.save(file_path)

            # Get selected parameters from the form
            x_param = request.form['firstParameter']
            y_param = request.form['secondParameter']

            # Generate insights graph
            graph_path = generate_insights_graph(file_path, x_param, y_param)
            return jsonify({'graph_url': graph_path})

    return render_template('index.html')

def generate_insights_graph(filename, x_param, y_param):
    # Read the CSV file into a pandas DataFrame
    data = pd.read_csv(filename, encoding='latin1')
    # Group the data by x_param and calculate the average of y_param for each group
    average_data = data.groupby(x_param)[y_param].mean().reset_index()
    # Plot the graph
    plt.plot(average_data[x_param], average_data[y_param], marker='o', linestyle='-')
    plt.xlabel(x_param)
    plt.ylabel(y_param)
    plt.title(f'Average {y_param} by {x_param}')
    plt.grid(True)
    # Save the graph directly in the static directory
    graph_filename = generate_unique_filename('insights_graph.png')
    graph_path = os.path.join('static', graph_filename)
    plt.savefig(graph_path)
    plt.close()
    return graph_path

def generate_unique_filename(filename):
    return f"{filename.split('.')[0]}_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.png"

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(host="localhost", port=5000)
