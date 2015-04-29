/*! kirjasto2030 - v0.0.0 - 2015-04-30
* Copyright (c) 2015 ;*/
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
$(function () {
  var $nav = $("#page-navigation"),
      $pages = $nav.find("#pages"),
      $button = $(".button-menu");

  $button.on("click", toggleNav);
  $pages.on("click", "a", closeNav);

  function toggleNav() {
    $nav.toggleClass("open");
  }

  function closeNav() {
    $nav.removeClass("open");
  }
});

$(function () {

  $(document).on("scroll", function () {
    var scrollPercent = ($("body").scrollTop()) / ($("main").height()- $("body").height());

    console.log(scrollPercent);

    $("#intro").css('margin-left', scrollPercent * -100  + "%");
    $("#timeline").css('margin-left', scrollPercent * -75  + "%");
    $("#timeline-line").css('margin-left', (1 - scrollPercent) * 20 + "%");

    if (scrollPercent > 0.5) {
      $(".timeline-event").addClass("visible");
    } else {
      $(".timeline-event").removeClass("visible");
    }


  });

});