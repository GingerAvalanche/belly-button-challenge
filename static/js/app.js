let samples;

d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(j => {
    samples = j;
    let dropdown = d3.select("#selDataset");
    j.names.forEach(s => dropdown.insert("option").attr("value", s).text(s));
});