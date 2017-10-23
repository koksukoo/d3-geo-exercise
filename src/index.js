import { scaleLinear } from "d3-scale";
import { geoMercator, geoPath, geoCentroid } from 'd3-geo';
import { select } from 'd3-selection';
import { queue } from 'd3-queue';
import * as topojson from 'topojson-client';
import * as R from 'ramda';

import jsonWorldMap from './countries.quantized.topo.json';
import jsonFinland from './finland.json';

// Note that select is a dom-method!

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


const drawMap = (countries, traffic) => {
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

    // draw arcs for yearly traffic data
    traffic.map(years => {
      R.keys(years).map(i => {
        years[i].map(({country}) => {
          const fromCountry = R.find(R.pathEq(['properties', 'NAME'], country))(geoData);
          const toCountry = R.find(R.pathEq(['properties', 'NAME'], 'Finland'))(geoData);
          const coordinates = [
            fromCountry.centroid,
            toCountry.centroid
          ];

          let line = svg.append('path')
            .datum(coordinates)
            .attr('d', c => {
              const d = {source: c[0], target: c[1]};
              const dx = d.target[0] - d.source[0];
              const dy = d.target[1] - d.source[1];
              const dr = Math.sqrt(dx * dx + dy * dy);
              return `M${d.source[0]},${d.source[1]}A${dr},${dr} 0 0,1 ${d.target[0]},${d.target[1]}`;
            })
            .attr('class', 'arc')
            .exit();
        });
      });
    });

}

drawMap(jsonWorldMap, jsonFinland);


