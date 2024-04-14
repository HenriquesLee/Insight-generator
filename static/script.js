document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('csvFileInput').addEventListener('change', processFile);
});

function processFile() {
    const file = document.getElementById('csvFileInput').files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = e.target.result.split('\n');
        const columnHeadings = data[0].split(',');
        const columnHeadingsElement = document.getElementById('columnHeadings');
        columnHeadingsElement.innerHTML = '';
        const listContainer = document.createElement('ul');
        columnHeadings.forEach(function(heading) {
            const listItem = document.createElement('li');
            listItem.textContent = heading;
            listItem.style.border = '1px solid black';
            listItem.style.padding = '3px 5px';
            listItem.style.fontSize = '12px';
            listContainer.appendChild(listItem);
        });
        columnHeadingsElement.appendChild(listContainer);
        const firstParameterSelect = document.getElementById('firstParameter');
        const secondParameterSelect = document.getElementById('secondParameter');
        columnHeadings.forEach(function(heading) {
            firstParameterSelect.innerHTML += '<option value="' + heading + '">' + heading + '</option>';
            secondParameterSelect.innerHTML += '<option value="' + heading + '">' + heading + '</option>';
        });
    };
    reader.readAsText(file);
}

function generateInsights() {
    const firstParameter = document.getElementById('firstParameter').value;
    const secondParameter = document.getElementById('secondParameter').value;
  
    if (firstParameter === secondParameter) {
        alert('Please select two different parameters.');
        return;
    }
    // Make AJAX request to Flask backend with selected parameters
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                const insightsGraphElement = document.getElementById('insightsGraph');
                insightsGraphElement.innerHTML = '<img src="' + response.graph_url + '" alt="Insights Graph">';
                // Add download link for the insights graph
                insightsGraphElement.innerHTML += '<br><a href="/download_insights/' + response.graph_url.split('/').pop() + '">Download Insights Graph</a>';
            } else {
                alert('Error generating insights.');
            }
        }
    };
    // Update insightsGraph with the generated insights
    xhr.open('POST', '/');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ firstParameter: firstParameter, secondParameter: secondParameter }));
}
