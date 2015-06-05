/*! kirjasto2030 - v0.0.0 - 2015-06-05
* Copyright (c) 2015 ;*/
// using sammy framework for simple routing, nothing much more at the moment 
var app = $.sammy(function () {

  var partialsDir = "partials/",
    storiesDir = "stories/",
    pageClass = "page-";

  // js is loaded and executes, stop animating
  $("body").removeClass("loading");


  // configuration of routes, index means a route exists, the array of arrays defines the two linear bottom buttons'
  // href and label
  // NOTE routes that are not as indexes in this object will redirect to index
  var routesConfig = {
    "etusivu": [false, ['#/teknologia', 'Teknologia']],
    "teknologia": [["#/etusivu", "Edellinen"], ["#/laki", "Laki"]],
    "teknologia-tarinat": [["#/teknologia", "Edellinen"], ["#/laki", "Laki"]],
    "laki": [["#/teknologia", "Edellinen"], ["#/yhteiskunta", "Yhteiskunta"]],
    "laki-tarinat": [["#/laki", "Edellinen"], ["#/yhteiskunta", "Yhteiskunta"]],
    "yhteiskunta": [["#/laki", "Edellinen"]],
    "yhteiskunta-tarinat": [["#/yhteiskunta", "Edellinen"]],
    "raportti": [["#/etusivu", "Edellinen"], false],
    "toimijaverkosto": [["#/etusivu", "Edellinen"], false]
  };


  // helpers
  //========

  /**
   * unified ajax call to fetch the content
   * @param page is the file in the "partials" directory - .html extension
   */
  var loadContent = function (page, callback) {
    console.log("loadContent", page, typeof callback === "function");
    var transitionStart = new Date().getTime();
    $("body").addClass("loading");
    $("main").addClass("transition");

    // the "transition" animation takes 200ms to fade out, then 200ms to fade in
    // make sure we wait those 200ms, then animate, and take at least 200 ms to animate smoothly,
    // even if the animation goes faster
    setTimeout(function () {
      $("main").load(partialsDir + page + ".html", function () {

        // if the loading did by itself take longer than 200ms, transition "right away"
        var delay = (new Date().getTime() - transitionStart) - 200;
        delay = delay > 200 ? 0 : delay;

        setTimeout(function () {
          $("body").removeClass("loading");

          // add a "page-xxx" class to <main> for page specific css references
          $("main").removeAttr("class").addClass(pageClass + page);
          $("#pages a.current").removeClass("current");
          $("#pages a[href$='" + page + "'").addClass("current");
          if (typeof callback === "function") {
            callback();
          }
        }, delay);
      });

    }, 200);

    // programmatically scroll to top
    $("body").animate({
      "scrollTop": 0
    }, 500);
  };


  /**
   * loads a story from the "stories" directory, where @param is the name of the file - .html extension
   * @param story
   */
  var loadStory = function (story) {
    console.log("loadStory?", story);
    $("main nav").find("a[href$='" + story + "']").addClass("active");
    $("#story").load(storiesDir + story + ".html", function () {
    });
  };


  /**
   *
   * @param prev array with href and label text OR false to hide button
   * @param next array with href and label text OR false to hide button
   *
   */
  var setButtons = function (prev, next) {
    try {
      if (prev === false) {
        throw new Error("No button location and label provided, hide button");
      }
      $(".button-left-bottom").attr('href', prev[0]).fadeIn()
        .find("span").html(prev[1]);
    } catch (e) {
      $(".button-left-bottom").fadeOut();
    }

    try {
      if (next === false) {
        throw new Error("No button location and label provided, hide button");
      }
      $(".button-right-bottom").attr('href', next[0]).fadeIn()
        .find("span").html(next[1]);
    } catch (e) {
      $(".button-right-bottom").fadeOut();
    }
  };

  var defaultAction = function () {
    var page = this.params["page"];
    var story = this.params["story"];

    console.log(page, story);

    if (routesConfig.hasOwnProperty(page)) {
      console.log("scripts?", routesConfig[page][2]);

      if (story !== "undefined") {
        loadContent(page, function () {
          console.log("hello callback");
          loadStory(story);
        });
      } else {
        loadContent(page);
      }
      setButtons(routesConfig[page][0], routesConfig[page][1]);
    } else {
      this.redirect("#/etusivu");
    }
  };


  // routes
  // ======

  //this.get("#/:page", function () { defaultAction.call(this); });
  this.get("#/:page", defaultAction);
  this.get("#/:page/:story", defaultAction);
  this.get("#/liitteet", function () {
    loadContent("liitteet");
    setButtons(["#/teknologia", "Teknologia"], ["#/laki", "Laki"]);
  });
  // redirect landing page to intro
  this.get("", function () {
    this.redirect("#/etusivu");
  });

});

$(function () {
  app.run();

  $("body").on("click", ".button-left-bottom, .button-right-bottom", function () {
    $("body").animate({
      "scrollTop": 0
    }, 500);
  });
});
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
$(function () {
  var $nav = $("#page-navigation"),
      $pages = $nav.find("#pages"),
      $button = $(".button-menu");

  $button.on("click", toggleNav);
  $pages.on("click", "a", closeNav);
  $(".button-left-bottom, .button-right-bottom").on("click", closeNav);

  function toggleNav() {
    $nav.toggleClass("open");
  }

  function closeNav() {
    $nav.removeClass("open");
  }
});
$(function () {

  $(document).on("scroll", function () {

    // for simplicity's sake this listeners is attached either way
    // but only really do anything costly when we're on the intro page
    // TODO maybe this could be checked from the sammyjs instance straight instead of reading the DOM class here

    if ($("main").hasClass("page-etusivu") && $("body").width() > $("#width-30em").width()) {
      var scrollPercent = ($("body").scrollTop()) / ($("main").height() - $("body").height());
      $("#intro").css('margin-left', scrollPercent * -100 + "%");
      $("#timeline").css('margin-left', scrollPercent * -75 + "%");
      $("#timeline-line").css('margin-left', (1 - scrollPercent) * 5 + "%");

      if (scrollPercent > 0.5) {
        $("#timeline").removeClass("collapsed");
        $(".timeline-event").addClass("visible");
        setLeftButton("#/etusivu", "Etusivu");
      } else {
        $("#timeline").addClass("collapsed");
        $(".timeline-event").removeClass("visible");
        setLeftButton(false);
      }
    }

  });

  $("main").on("click", "#timeline", function () {
    if (parseInt($("#timeline").css("margin-left")) < 50) {
      $("body").animate({
        "scrollTop": $(document).height()
      }, 1500, function () {
        setLeftButton("#/etusivu", "Etusivu");
        $("#timeline").removeClass("collapsed");
      });
    }
  });


  function setLeftButton(href, label) {
    try {
      if (href === false || label === "undefined") {
        throw new Error("Hide button");
      }
      $(".button-left-bottom").attr('href', href).fadeIn()
        .find("span").html(label);
    } catch (e) {
      $(".button-left-bottom").fadeOut();
    }
  }

});