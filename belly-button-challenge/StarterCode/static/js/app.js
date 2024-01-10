// Declares a constant variable named url and assigns it a string value. This string represents the URL from which you're fetching JSON data.
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";



// Uses d3.json() to fetch JSON data from a specified URL and logs the loaded data to the console.
d3.json(url).then(function(data) {
   console.log("Loaded JSON data:", data);
});


//To summarize, this code block fetches JSON data from the specified URL using D3,
//extracts the "names" property from the loaded data, and assigns it to the variable names.
//The use of .then ensures that the code inside the callback function is executed once the JSON data is successfully loaded.
//This asynchronous pattern is similar in concept to a Promise or a callback 
//and is commonly used in web development when dealing with asynchronous operations like data fetching.



// Initialize the panel at start up 
function start() {

    // Use D3 to select the dropdown menu.
    //This line uses D3.js to select the HTML element with the ID "selDataset" and assigns it to the variable dropdownMenu.
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names and populate the drop-down selector
    d3.json(url).then((data) => {
        
        // extracts the "names" property from the loaded data, and assigns it to a variable named names.
        let names = data.names;

        // Add  samples to dropdown menu.This is using the forEach method to iterate over each element in the "names" array.
        // The forEach method is a built-in JavaScript method that allows you to execute a provided function once for each array element.
        // This iterates over each element in the names array, where each element is referred to as id. For each id, the code inside the block is executed.
        // (id) => { ... }: This is an arrow function used as the callback function for each iteration.
        // It takes an id as a parameter, representing each element in the "names" array.

        names.forEach((id) => {

            // Log the value of "id" for each iteration of the loop
            console.log(id);

            // Dropdown Option Creation.
            // This line appends an <option> element to the dropdownMenu for each id in the names array.
            // In the context of a dropdown menu, each option represents a choice that the user can select.
            dropdownMenu.append("option")
            .text(id) // Sets the text content of the <option> element to the value of the current id. This is what will be displayed in the dropdown menu.
            .property("value",id);//  Sets the value attribute of the <option> element to the value of the current id. 
        });

        // Setting up the initial visualization of the application
        // Set the first sample from the list
        let sample_one = names[0];

        // Log the value of sample_one
        console.log(sample_one);

        // Build the initial plots
        demographicInfo(sample_one);
        barChart(sample_one);
        bubbleChart(sample_one);
        

    });
};

// Function that populates metadata info
function demographicInfo(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all metadata from the loaded JSON data
        let metadata = data.metadata;

        // This line filters the metadata based on the selected sample.
        // The filter function is used to find elements in the metadata array where the id property matches the provided sample.
        // The result is stored in the variable value.
        let value = metadata.filter(result => result.id == sample);

        // Log the array of metadata objects after they have been filtered
        console.log(value)

        // Get the first index from the array
        let valueData = value[0];

        // Clear the existing content inside the #sample-metadata element
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to the panel.
        //Used to iterate over the key-value pairs of the valueData object.
        Object.entries(valueData).forEach(([key,value]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);
            // This line uses D3.js to select the HTML element with the ID "sample-metadata" and appends an <h5> element to it.
            // The .text(${key}: ${value}) part sets the text content of the <h5> element to a string formed by concatenating the key and value, separated by a colon. 
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Function that builds the bar chart
function barChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all sample data. This line extracts the samples property from the loaded JSON data (data).
        // It assumes that the JSON structure has a property named samples, which is an array containing information related to the samples.
        let sampleInfo = data.samples;
        // Now, the variable sampleInfo contains an array of sample data.


        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);

        // Set top ten items to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Set up the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Setup the layout
        let layout = {
            title: "Top 10 OTUs Found"
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Function that builds the bubble chart
function bubbleChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        
        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);
        
        // Set up the trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Set up the layout
        let layout = {
            title: "Samples Of Bacteria",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Function that updates panel when sample is changed
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    demographicInfo(value);
    barChart(value);
    bubbleChart(value);
    
};

// Call the initialize function
start();