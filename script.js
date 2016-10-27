// set up
var width = '100%'
var height = '100%'

var vpWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var vpHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) ;

var projection = d3.geo.mercator()
  .translate([950,500])
  .scale(200);

var path = d3.geo.path()
  .projection(projection);

var svg = d3.select('#map')
  .append('svg')
  .attr('width', '100%')

// Set background color
svg.append('rect')
  .attr('width', width)
  .attr('height', height)
  .attr('fill', '#2b77f2')
  // .call(zoom);

d3.select(window).on("resize", resizeWindow);

// Tooltip
var div = d3.select('body').append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0);

var map = svg.append('g');

// Map of earth
d3.json('https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-50m.json', function(json) {
  map.selectAll('path')
    .data(topojson.feature(json, json.objects.countries).features)
    .enter()
    .append('path')
    .attr('fill', '#25dbcf')
    .attr('stroke', '#266D98')
    .attr('d', path);
    //.call(zoom)
});

// Data points
d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json', function(json) {

  var metSizes = json.features.map(function(d){
    return Number(d.properties.mass)
  }).sort(sortInt)

  // get 75th and 25th percentile of masses
  var _25Percentile = metSizes[Math.floor(metSizes.length * .25)];
  var _75Percentile = metSizes[Math.floor(metSizes.length * .75)];

  var meteorScale = d3.scale.linear()
          .domain([_25Percentile, _75Percentile])
          .range([10, vpHeight / 10]);

  // color range
  var colors = [
    "#00FF00",
    "#33ff00",
    "#66ff00",
    "#99ff00",
    "#ccff00",
    "#FFFF00",
    "#FFCC00",
    "#ff9900",
    "#ff6600",
    "#FF3300",
    "#FF0000"
  ]

  var colorScale = d3.scale.quantile()
    .domain([_25Percentile, _75Percentile])
    .range(colors);

  var meteorites = svg.append("g")
    .selectAll('path')
      .data(json.features)
      .enter()
        .append('circle')
        .attr('cx', function(d){
          return projection([d.properties.reclong, d.properties.reclat])[0];
        })
        .attr('cy', function(d){
          return projection([d.properties.reclong, d.properties.reclat])[1];
        })
        .attr('r', 5)
        .style('fill', function(d, i){
          return colorScale(d.properties.mass)
        })


  // Initialize map size
  resizeWindow();

  // legend
  var ordinal = d3.scale.ordinal()
  .domain(["smaller", "", "larger"])
  .range(["#00FF00", "#FFFF00", "#FF0000"]);

  svg.append("g")
  .attr("class", "legendOrdinal")
  .attr("transform", "translate(20,20)");

  var legendOrdinal = d3.legend.color()
    .shape("path", d3.svg.symbol().type("circle").size(150)())
    .shapePadding(10)
    .scale(ordinal);

  svg.select(".legendOrdinal")
    .call(legendOrdinal);
});

function sortInt(a,b) {
    return a - b;
}

// Resize map on window resize
function resizeWindow() {
  d3.selectAll("g").attr("transform", "scale(" + $("#map").width()/1900 + ")");
  $("svg").height($("#map").width()/2);
}
