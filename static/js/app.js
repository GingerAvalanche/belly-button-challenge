let samples;
const colorScales = ['YlOrRd', 'YlGnBu', 'RdBu', 'Portland', 'Picnic', 'Jet', 'Hot', 'Greys', 'Greens', 'Electric', 'Earth', 'Bluered', 'Blackbody'];
const arrowStyle = "<polygon fill='rgb(131,3,8)' points='-7,0 -2,120 2,120 7,0' transform='rotate({0})' />";

// From @fearphage on StackOverflow: https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
        ;
        });
    };
}

function restyleBarChart(sample) {
    let top_ten_otus = getSampleObjectArray(sample)
        .sort((a, b) => b.sample_value - a.sample_value)
        .slice(0, 10);

    trace = {
        x: [top_ten_otus.map(o => o.sample_value).reverse()],
        y: [top_ten_otus.map(o => `OTU ${o.otu_id}`).reverse()],
        text: [top_ten_otus.map(o => o.otu_label)]
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
        p += `${key}: ${metadata[key] ?? 0}<br>`;
    }
    p += "</p>";
    d3.select("#sample-metadata").html(p);
}

function restyleGauge(metadata) {
    d3.select("#gauge-arrow").html(arrowStyle.format(90 + 20 * (metadata["wfreq"] ?? 0)));
}

function optionChanged(newOption) {
    let newSample = samples.samples.find(s => s.id == newOption);
    restyleBarChart(newSample);
    restyleBubbleChart(newSample);
    let metadata = samples.metadata.find(m => m.id == newOption)
    updateDemographicInfo(metadata);
    restyleGauge(metadata);
}

function getSampleObjectArray(sample) {
    return sample["otu_ids"].map((el, idx) => {
        return {
            otu_id: el,
            sample_value: sample["sample_values"][idx],
            otu_label: sample["otu_labels"][idx]
        }
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

    Plotly.newPlot("gauge", [
        {
            domain: { x: [0, 1], y: [0, 1] },
            type: 'indicator',
            mode: 'gauge',
            title: { text: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week' },
            gauge: {
                axis: {
                    nticks: 10,
                    range: [null, 9],
                    ticks: ''
                },
                bar: { color: 'rgba(0,0,0,0)' },
                steps: [
                    { range: [0, 1], color: 'rgb(248,243,236)' },
                    { range: [1, 2], color: 'rgb(244,241,229)' },
                    { range: [2, 3], color: 'rgb(233,230,202)' },
                    { range: [3, 4], color: 'rgb(229,231,239)' },
                    { range: [4, 5], color: 'rgb(213,228,157)' },
                    { range: [5, 6], color: 'rgb(183,204,146)' },
                    { range: [6, 7], color: 'rgb(140,191,136)' },
                    { range: [7, 8], color: 'rgb(138,187,143)' },
                    { range: [8, 9], color: 'rgb(133,180,138)' },
                ]
            }
        }]);
    d3.select("#gauge").select(".trace").select(".angular").insert("g").html("<circle cx='0' cx='0' r='5' fill='rgb(131,3,8)' />");
    d3.select("#gauge").select(".trace").select(".angular").insert("g").attr("id", "gauge-arrow").html(arrowStyle.format("90"));
    restyleGauge(j.metadata[0]);
});