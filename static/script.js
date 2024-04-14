document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('csvFileInput').addEventListener('change', processFile);
});

function processFile() {
    const file = document.getElementById('csvFileInput').files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = e.target.result.split('\n');
        const columnHeadings = data[0].split(',');
        const firstParameterSelect = document.getElementById('firstParameter');
        const secondParameterSelect = document.getElementById('secondParameter');
        // Clear existing options
        firstParameterSelect.innerHTML = '';
        secondParameterSelect.innerHTML = '';
        // Populate dropdown menus
        columnHeadings.forEach(function(heading) {
            const option = document.createElement('option');
            option.value = heading;
            option.textContent = heading;
            firstParameterSelect.appendChild(option.cloneNode(true));
            secondParameterSelect.appendChild(option);
        });
    };
    reader.readAsText(file);
}


function generateInsights() {
    const formData = new FormData(document.getElementById('uploadForm'));
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                const graphUrl = response.graph_url;
                document.getElementById('insightsGraph').innerHTML = '<img src="' + graphUrl + '" alt="Insights Graph">';
                // Add download link for the insights graph
                const downloadLink = document.createElement('a');
                downloadLink.href = graphUrl;
                downloadLink.download = 'insights_graph.png';
                downloadLink.textContent = 'Download Insights Graph';
                document.getElementById('insightsGraph').appendChild(downloadLink);
            } else {
                alert('Error generating insights.');
            }
        }
    };
    xhr.open('POST', '/');
    xhr.send(formData);
}
