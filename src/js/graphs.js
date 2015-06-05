/**
 * Helper function that wraps loading d3 and then executing the setup function of that d3 graph
 * @param arguments:
 *  - arguments[0] -> callback function
 *  - arguments[1+] -> callback function params
 */
function displayGraph(args) {
  // convert the passed in "args" into a actual array
  // use the javascript internal "arguments" which is an object containing the arguments
  args = Array.prototype.slice.call(arguments);

  var callback = args[0];

  if (typeof callback !== "function") {
    throw(new Error("displayGraph(), no callback provided"));
  }

  // remove the callback from the beginning of the array, then store the remaining
  // items in an array that can be passed into the callback
  args = args.slice(1, args.length);

  if (typeof d3 === "undefined") {
    $.getScript("assets/js/d3.min.js", function () {
      callback(args);
    });
  } else {
    callback(args);
  }
}



/**
 * Helper to draw node tree on the chapter pages
 */
function drawTree(options) {
  var json = options[0],
    selector = options[1];

  if (typeof selector === "undefined") {
    selector = "body";
  }

  if (typeof json === "undefined") {
    throw(new Error("drawTree(), no json provided"));
  }

  var diameter = 400;

  var tree = d3.layout.tree()
    .size([360, diameter / 4 ])
    .separation(function(a, b) { return (a.parent === b.parent ? 1 : 2) / a.depth; });

  var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

  var svg = d3.select(selector).append("svg")
    .attr("width", diameter)
    .attr("height", diameter + diameter/3)
    .append("g")
    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");


  d3.json(json, function(error, root) {
    var nodes = tree.nodes(root),
      links = tree.links(nodes);

    var link = svg.selectAll(".link")
      .data(links)
      .enter().append("path")
      .attr("class", function (d) { return "depth-" + d.source.depth + " link"; })
      .attr("d", diagonal);

    var node = svg.selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", function (d) { return "depth-" + d.depth + " node"; })
      .attr("id", function (d) { return d.name; })
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });


    node.append("circle")
      .attr("r", 4.5)
      .attr("class", "foo");

    node.append("text")
      .attr("dy", ".31em")
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
      .text(function(d) { return d.name; });
  });

  d3.select(self.frameElement).style("height", diameter - 150 + "px");

}


/**
 * Helper to draw the ANT diagram on the toimijat page
 */
function drawANT() {
  var width = $("main").width(),
    height = $("body").height();

  console.log(width, height);
  /*
   0 = valtio
   1 = laki
   3 = teknologia
   4 = markinnat
   5 = yhteiskunta?
   */

  var colors = [
    "#548ed3", // blue
    "#e95b4d", // red
    "#00f579", // green
    "#003399",
    "#ee9911"
  ];

  var svg = d3.select("main").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "ant");

  var force = d3.layout.force()
    .gravity(0.1)
    .distance(function (node) {
      var maxDistance = width / 4 * 3;
      return maxDistance * node.value / 10;
    })
    .charge(function (node) {
      var maxCharge = width / 2;
      return -maxCharge * node.value / 10;
    })
    .linkStrength(0.1)
    .friction(0.75)
    .size([width, height]);

  d3.json("data/actors.json", function (error, json) {
    force
      .nodes(json.nodes)
      .links(json.links)
      .start();

    var link = svg.selectAll(".link")
      .data(json.links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function (d) {
        return Math.sqrt(d.value) / 2;
      });

    var node = svg.selectAll(".node")
      .data(json.nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(force.drag);

    node.append("text")
      .attr("dx", "15px")
      .attr("dy", "10px")
      .text(function (d) {
        return d.name;
      });

    node.append("circle")
      .attr("r", function (d) {
        return parseInt(3 + d.value);
      })
      .style("fill", function (d) {
        return colors[d.group - 1];
      });


    force.on("tick", function () {
      link.attr("x1", function (d) {
        return d.source.x;
      })
        .attr("y1", function (d) {
          return d.source.y;
        })
        .attr("x2", function (d) {
          return d.target.x;
        })
        .attr("y2", function (d) {
          return d.target.y;
        });

      node.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    });
  });
}