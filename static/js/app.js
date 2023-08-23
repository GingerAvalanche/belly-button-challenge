let samples;
let colorScales = ['YlOrRd', 'YlGnBu', 'RdBu', 'Portland', 'Picnic', 'Jet', 'Hot', 'Greys', 'Greens', 'Electric', 'Earth', 'Bluered', 'Blackbody'];

function restyleBarChart(sample) {
    let top_ten_otus = getSampleObjectArray(sample)
        .sort((a, b) => b.sample_value - a.sample_value)
        .slice(0, 10);

    trace = {
        x: [top_ten_otus.map(o => o.sample_value).reverse()],
        y: [top_ten_otus.map(o => `OTU ${o.otu_id}`).reverse()]
    };

    Plotly.restyle("bar", trace);
}

function restyleBubbleChart(sample) {
    trace = {
        x: [sample.otu_ids],
        y: [sample.sample_values],
        text: [sample.otu_labels],
        marker: {
            color: sample.otu_ids,
            colorscale: colorScales[Math.floor(Math.random() * colorScales.length)],
            size: sample.sample_values
        }
    };

    Plotly.restyle("bubble", trace);
}

function updateDemographicInfo(metadata) {
    let p = "<p>";
    for (let key in metadata) {
        p += `${key}: ${metadata[key]}<br>`;
    }
    p += "</p>";
    d3.select("#sample-metadata").html(p);
}

function optionChanged(newOption) {
    let newSample = samples.samples.find(s => s.id == newOption);
    restyleBarChart(newSample);
    restyleBubbleChart(newSample);
    updateDemographicInfo(samples.metadata.find(m => m.id == newOption));
}

function getSampleObjectArray(sample) {
    return sample["otu_ids"].map((el, idx) => {
        return { otu_id: el, sample_value: sample["sample_values"][idx] }
    });
}

d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(j => {
    samples = j;
    let dropdown = d3.select("#selDataset");
    j.names.forEach(s => dropdown.insert("option").attr("value", s).text(s));
    let firstSample = j.samples.slice(0, 1)[0];

    Plotly.newPlot("bar", [{ type: 'bar', orientation: 'h' }]);
    restyleBarChart(firstSample);

    Plotly.newPlot("bubble", [{ mode: 'markers' }]);
    restyleBubbleChart(firstSample);

    updateDemographicInfo(j.metadata[0]);
});