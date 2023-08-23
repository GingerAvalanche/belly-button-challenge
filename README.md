# Homework 14 - D3 and Plotly

## Description

This app retrieves a set of sample data from a homework server and uses it to create various graphs/plots. Each subject has its own set of graphs, which can be displayed by selecting that subject from the dropdown menu.

### Notes

I decided to randomly choose a color scale for the bubble graph from those listed in the Plotly doc examples, each time the subject is changed. I couldn't decide on one to use, so I figured, why not use them all?

I couldn't figure out how to add a needle to the gauge, so to recreate that I ended up making my own svg and inserting it into the gauge. Not ideal, but it works. And, if I'm being totally honest, it's probably more efficient than Plotly is, since updating it just involves retrieving the needle node and setting the new shape inside it. It's definitely not a scalable solution, though. I'd be interested in figuring out if the needle is part of Plotly, because I couldn't find a reference to it anywhere in the docs for either the JS or Python libs.

### Source

C-like string format prototype copied from user @fearphage on StackOverflow: https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
