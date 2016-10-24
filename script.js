d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json", function(data){

  // stubbed data for testing
//   var data = {
// 	"nodes": [
// 		{ "country": "East Timor", "code": "tl" },
// 		{ "country": "Canada", "code": "ca" },
// 	],
// 	"links": [
// 		{ "target": 0, "source": 1 },
// 	]
// }

  var margin = { top: 30, right: 30, bottom: 70, left:70 }

  var vpWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 200;
  var vpHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 100 ;

  var height = vpHeight - margin.top - margin.bottom,
      width = vpWidth - margin.left - margin.right

  var projection = d3.geoEquirectangular()
    .scale(height / Math.PI)
    .translate([width / 2, height / 2]);

  var path = d3.geoPath()
      .projection(projection);

  var graticule = d3.geoGraticule();

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

  svg.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path);

}) // end callback
