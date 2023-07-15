// set up URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// initial plot
function init() {
    // dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // grab names from url
    d3.json(url).then((data) => {

    let namesList = data.names;

    // iterate over above list to add ID's to dropdown menu
    namesList.forEach(name => {
        dropdownMenu
        .append("option")
        .attr("value", name)
        .text(name);
    })
  
// first ID's data is presented on page when opened
 const firstPlotId = namesList[0];
 chartCreation(firstPlotId);

 // info Box
 demographics(firstPlotId); 
})}

// have function create charts using info box data
function chartCreation(sample) {
    d3.json(url).then((data) => {
        let samplesArray = data.samples;
        let selectedSample = samplesArray.filter(sampleJSON => sampleJSON.id == sample);
        let result = selectedSample[0];
        let sampleValues = result.sample_values;
        let otuIds = result.otu_ids;
        let otuLabels = result.otu_labels;
        // set perameters and plot bar chart
        let traceBar = [
            {
                type: 'bar',
                x: sampleValues.slice(0,10).reverse(),
                y: otuIds.slice(0,10).map(id => `OTU ${id}`).reverse(),
                text: otuLabels.slice(0,10).reverse(),
                orientation: 'h'
            }];
        let layoutBar = {
            title: '',
            xaxis: {
                title: 'Sample Values'
            },
            yaxis: {
                title: 'OTU_ID'
            }
        };
         Plotly.newPlot("bar", traceBar, layoutBar);
        // parameters for bubble chart
        let traceBubble = [
            {
                x: otuIds,
                y: sampleValues,
                mode: 'markers',
                marker: {
                    size: sampleValues,
                    colorscale: 'aggrnyl',
                    color: otuIds
                },
                text: otuLabels
            }];
        let layoutBubble = {
            title: '',
                xaxis: {
                    title: 'OTU_ID'
                },
                yaxis: {
                    title: 'Sample Values'
                }
        }
        Plotly.newPlot("bubble", traceBubble, layoutBubble);
    })
}
// fills in data within the demographic box
function demographics(sample) {
    d3.json(url).then((data) => {
        let metadataArray = data.metadata;
        let selectedSample = metadataArray.filter(sampleJSON => sampleJSON.id == sample);
        let result = selectedSample[0];
        let demoBox = d3.select('#sample-metadata');
        // clears current data in box
        demoBox.html("");
                let slicedResult = Object.entries(result);
        // puts data into box
        slicedResult.forEach(keyValue => {
            demoBox.append("h6")
            .style("font-weight", "bold")
            .text(`${keyValue[0]} : ${keyValue[1]}`);
        })
    })
}

// changes functions above to reflext data of currently chosen id from dropdown box.
function optionChanged(updatedSample) {
    chartCreation(updatedSample);
    demographics(updatedSample);
}

init();