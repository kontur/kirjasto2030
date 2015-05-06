/*! kirjasto2030 - v0.0.0 - 2015-05-06
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
    "intro": [false, ['#/teknologia', 'Teknologia']],
    "teknologia": [["#/intro", "Intro"], ["#/laki", "Laki"]],
    "teknologia-tarinat": [["#/teknologia", "Teknologia"], ["#/laki", "Laki"]],
    "laki": [["#/teknologia", "Teknologia"], ["#/yhteiskunta", "Yhteiskunta"]],
    "laki-tarinat": [["#/laki", "Laki"], ["#/yhteiskunta", "Yhteiskunta"]],
    "yhteiskunta": [["#/laki", "Laki"]],
    "yhteiskunta-tarinat": [["#/yhteiskunta", "Yhteiskunta"]]

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

  $("body").on("click", ".button-left-bottom, .button-right-bottom", function () {
    $("body").animate({
      "scrollTop": 0
    }, 500);
  });
});
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

    if ($("main").hasClass("page-intro") && $("body").width() > $("#width-30em").width()) {
      var scrollPercent = ($("body").scrollTop()) / ($("main").height() - $("body").height());

      console.log(scrollPercent);

      $("#intro").css('margin-left', scrollPercent * -100 + "%");
      $("#timeline").css('margin-left', scrollPercent * -75 + "%");
      $("#timeline-line").css('margin-left', (1 - scrollPercent) * 20 + "%");

      if (scrollPercent > 0.5) {
        $("#timeline").removeClass("collapsed");
        $(".timeline-event").addClass("visible");
        setLeftButton("#/intro", "Intro");
      } else {
        $("#timeline").addClass("collapsed");
        $(".timeline-event").removeClass("visible");
        setLeftButton(false);
      }
    }

  });

  $("main").on("click", "#timeline", function () {
    console.log(parseInt($("#timeline").css("margin-left")));
    if (parseInt($("#timeline").css("margin-left")) < 50) {
      $("body").animate({
        "scrollTop": $(document).height()
      }, 1500, function () {
        setLeftButton("#/intro", "Intro");
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