/**
 * main application file with routing and ajax content changing
 */


// using sammy framework for simple routing, nothing much more at the moment 
var app = $.sammy(function () {

  var partialsDir = "partials/",
    storiesDir = "stories/",
    pageClass = "page-";

  // TODO set previous and next link text and locations based on route

  // unified ajax call to fetch the content
  var loadContent = function (page, callback) {
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
    $("main nav").find("a[href$='" + story + "']").addClass("active");
    $("#story").load(storiesDir + story + ".html", function () {
    });
  };

  this.get("#/intro", function () {
    loadContent("intro");
  });
  this.get("#/teknologia", function () {
    loadContent("teknologia");
  });
  this.get("#/teknologia/:story", function () {
    var story = this.params['story'];
    loadContent("teknologia-tarinat", function () {
      loadStory(story);
    });
  });

  this.get("#/laki", function () {
    loadContent("laki");
  });
  this.get("#/jakamistalous", function () {
    loadContent("jakamistalous");
  });
  this.get("#/liitteet", function () {
    loadContent("liitteet");
  });

  // redirect landing page to intro
  this.get("", function () {
    window.location.hash = "#/intro";
  });

});

$(function () {
  app.run();
});