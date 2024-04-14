import datetime
from flask import Flask, request, render_template, send_from_directory,jsonify, send_file
import csv
import os
import pandas as pd
from werkzeug.utils import secure_filename
import matplotlib.pyplot as plt

app = Flask(__name__, static_url_path='/static')

@app.route('/', methods=['get', 'post'])
def home():
    if request.method == 'POST':
        f = request.files['file']
        filename = secure_filename(f.filename)
        f.save(os.path.join('static', filename))
        # Get selected parameters from the form
        x_param = request.form['firstParameter']
        y_param = request.form['secondParameter']
       # Generate insights graph
        graph_path = generate_insights_graph(os.path.join('static', filename), x_param, y_param)
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
    # Save the graph in the static directory
    graph_path = os.path.join('static', generate_unique_filename('insights_graph.png'))
    plt.savefig(graph_path)
    plt.close()
    return graph_path

# Function to generate unique filename
def generate_unique_filename(filename):
    return f"{filename.split('.')[0]}_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.png"

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/download_insights/<path:filename>')
def download_insights(filename):
    return send_file(filename, as_attachment=True)

if __name__ == '__main__':
    app.run(host="localhost", port=int(5000))
