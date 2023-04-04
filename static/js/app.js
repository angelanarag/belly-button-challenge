// Set the URL for the JSON data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
 
// Use the D3 library to read and display the data in the samples.json
d3.json(url).then(function(data) {console.log(data);}).catch(error => {console.error(error);});

// After reviewing the data, to display each individual's demographic on the dashboard, you need to access the 'metadata' objects array from samples.json
// The metadata array has the id, ethnicity, gender, age, location, wfreq
// The below function will use the metadata array to get the demographics with the matching id value in the parameter
function myMetadata(subject) {
  d3.json(url).then((data) => {
    // Declare metadata as a constant variable from the metadata array in the json file 
    const metadata = data.metadata;
    // Filter the metadata with the subject ID no. 
    let resultArray = metadata.filter(subjectSample => subjectSample.id == subject);
    // Assign first (and only) element of that array from resultArray to the result variable
    let result = resultArray[0];
    // Display the demographic information inside the panel with id of `#sample-metadata`
    let PANEL = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    // Append new tags for each key-value in the metadata.
    for (key in result){
      PANEL.append("h6").text(`${key}: ${result[key]}`);
    };
  // Handle any errors
  }).catch(error => {console.error(error);});
}

// Using the sample_values from samples, create the bar and bubble chart
function myGraphs(subject) {
  d3.json(url).then((data) => {
    // Declare samples as a constant variable from the samples array in the json file
    const samples = data.samples;
    // Filter the data with the subject ID no. 
    let resultArray = samples.filter(subjectSample => subjectSample.id == subject);
    // Assign first (and only) element of that array from resultArray to the result variable
    let result = resultArray[0];
    // Declare other variables to be used for the charts
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;
    

    // Create the top 10 bacteria cultures found bar chart for each subject ID no selected
    // Use reverse() function to display the top 10 bacteria cultures in descending order
    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    const barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];
    // Create the bar chart layout 
    const barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    // Display the bar chart
    Plotly.newPlot("bar", barData, barLayout);

    // Create the bubble chart of the bacteria cultures for each subject ID no selected
    const bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];
    // Create the bubble chart layout
    const bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };
    // Display the bubble chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
 
  }).catch(error => {console.error(error);});
}

// The below function will assign a test subject ID no for the dashboard
function init() {
  // This is the code on the index.html file <select id="selDataset" onchange="optionChanged(this.value)"></select>
  let dropdown = d3.select("#selDataset");
  // Use the names array from sample.json to the populate drop-down in the Test Subject ID No
  d3.json(url).then((data) => {
    let subjectIds = data.names;
    for (let i = 0; i < subjectIds.length; i++){
      dropdown
        .append("option")
        .text(subjectIds[i])
        .property("value", subjectIds[i]);
    };
    // Use the first ID from the sample to populate the dashboard - both the Demographic info and the charts
    const firstID = subjectIds[0];
    myGraphs(firstID);
    myMetadata(firstID);
  }).catch(error => {console.error(error);});
}

// When a new subject ID is chosen, update the dashboard
function optionChanged(newSubject) {
  // Fetch new data each time a new sample is selected
  myMetadata(newSubject);
  myGraphs(newSubject);
}
// Initialize the dashboard
init();