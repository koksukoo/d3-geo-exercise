import { scaleLinear } from "d3-scale";
import { geoMercator, geoPath, geoCentroid } from 'd3-geo';
import { select } from 'd3-selection';
import { queue } from 'd3-queue';
import * as topojson from 'topojson-client';
import jsonWorldMap from './countries.quantized.topo.json';

// Obs! select is a dom-method

let geoData;
const width = 950;
const height = 700;

const projection = geoMercator().scale(150).translate([width / 2, height / 1.5]);
const path = geoPath().pointRadius(2).projection(projection);
const svg = select('#map')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
let group = svg.append('g');


const loaded = (countries) => {
    // load map data to array
    geoData = topojson.feature(countries, countries.objects.countries).features;
    // append centroids for each country
    geoData.map(d => {
        d.centroid = projection(geoCentroid(d));
    });

    // draw countries
    group.attr('class', 'countries')
        .selectAll('path.country')
        .data(geoData)
        .enter()
        .append('path')
        .attr('id', (d) => d.properties.NAME)
        .attr('d', path)
        .exit();

    // draw centroids of countries
    group.selectAll('path.centroid')
       .data(geoData)
       .enter()
       .append('circle')
       .classed('centroid', true)
       .attr('cx', d => d.centroid[0])
       .attr('cy', d => d.centroid[1])
       .attr('r', '2')
       .exit();

}

loaded(jsonWorldMap);


