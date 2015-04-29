/**
 * main application file with routing and ajax content changing
 */


// using sammy framework for simple routing, nothing much more at the moment 
var app = $.sammy(function () {

  var partialsDir = "partials/",
    storiesDir = "stories/",
    pageClass = "page-";


  var routesConfig = {
    "intro": [[false], ['#/teknologia', 'Teknologia']],
    "teknologia": [["#/intro", "Intro"], ["#/laki", "Laki"]],
    "teknologia-tarinat": [["#/teknologia", "Teknologia"], ["#/laki", "Laki"]]
  };


  // helpers
  //========

  // unified ajax call to fetch the content
  var loadContent = function (page, callback) {
    console.log("loadContent", page, typeof callback === "function");
    $("main")
      .addClass("transition")
      .load(partialsDir + page + ".html", function () {
        $("main")
          .removeAttr("class")
          .addClass(pageClass + page);
        if (typeof callback === "function") {
          callback();
        }
      });
  };

  var loadStory = function (story) {
    console.log("loadStory?", story);
    $("main nav").find("a[href$='" + story + "']").addClass("active");
    $("#story").load(storiesDir + story + ".html", function () {
    });
  };

  var setButtons = function (prev, next) {
    $(".button-left-bottom").attr('href', prev[0]).find("span").html(prev[1]);
    $(".button-right-bottom").attr('href', next[0]).find("span").html(next[1]);
  };

  var defaultAction = function () {
    var page = this.params["page"];
    var story = this.params["story"];

    console.log(page, story);

    if (routesConfig.hasOwnProperty(page)) {
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
      this.redirect("#/intro");
    }
  };


  // routes
  // ======

  //this.get("#/:page", function () { defaultAction.call(this); });
  this.get("#/:page", defaultAction);

  this.get("#/:page/:story", defaultAction);
/*
  this.get("#/teknologia", function () {
    loadContent("teknologia");
    setButtons(["#/intro", "Intro"], ["#/laki", "Laki"]);
  });
  this.get("#/teknologia/:story", function () {
    var story = this.params['story'];
    loadContent("teknologia-tarinat", function () {
      loadStory(story);
    });
    setButtons(["#/teknologia", "Teknologia"], ["#/laki", "Laki"]);
  });

  this.get("#/laki", function () {
    loadContent("laki");
  });
  this.get("#/jakamistalous", function () {
    loadContent("jakamistalous");
  });

 */
  this.get("#/liitteet", function () {
    loadContent("liitteet");
    setButtons(["#/teknologia", "Teknologia"], ["#/laki", "Laki"]);
  });
  // redirect landing page to intro
  this.get("", function () {
    this.redirect("#/intro");
  });

});

$(function () {
  app.run();
});