// Read in JSON data for the Demographic Info Panel
function buildPanel(sample) {
    d3.json("/../data/samples.json").then((incomingData) => {
        var panel = d3.select("#sample-metadata");
        panel.html("");

        var metadata = incomingData.metadata;

        var data = metadata.filter(d => d.id.toString() === sample)[0];
        console.log(data)

        Object.entries(data).forEach(([key, value]) => {
            var row = panel.append("p");
            row.text(`${key}: ${value}`);
        });
    });
};

// Function to build charts
function buildCharts(sample) {
    d3.json("/../data/samples.json").then((incomingData) => {
        
        // Create variables for the data
        var samples = incomingData.samples.filter(d => d.id.toString() === sample)[0];
        var sample_values = samples.sample_values;
        var otu_ids = samples.otu_ids;
        var otu_labels = samples.otu_labels;

        // Build-a-bar
        var trace1 = {
            type: "bar",
            x: sample_values.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
            marker: {
                color: 'rgb(204, 0, 0)'
            },
            hovertext: otu_labels.slice(0, 10).reverse(),
            orientation: "h"
        };

        var data = [trace1];

        var layout = {
            title: "Top 10 OTU",
            autosize: true,
        };

        Plotly.newPlot("bar", data, layout);

        // Bubble
        var trace2 = {
            x: otu_ids,
            y: sample_values,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids
            },
            text: otu_labels
        };

        var data2 = [trace2];

        var layout2 = {
            xaxis: {title: "OTU ID"},
            height: 600,
            autosize: true,
        }

        Plotly.newPlot("bubble", data2, layout2);
    });
}

// Function to refresh when new sample is selected
function optionChanged(sample) {
    buildPanel(sample);
    buildCharts(sample);
};

// Function for intial data
function init() {
    var dropdown = d3.select("#selDataset");

    d3.json("/../data/samples.json").then((incomingData) => {
        var names = incomingData.names;
        names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        buildPanel(names[0]);
        buildCharts(names[0]);
    });
};

init();