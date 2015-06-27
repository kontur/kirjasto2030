/**
 * main application file with routing and ajax content changing
 */


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
    "teknologia": [["#/etusivu", "Etusivu"], ["#/laki", "Laki"]],
    "teknologia-tarinat": [["#/teknologia", "Teknologia"], ["#/laki", "Laki"]],
    "laki": [["#/teknologia", "Teknologia"], ["#/yhteiskunta", "Yhteiskunta"]],
    "laki-tarinat": [["#/laki", "Laki"], ["#/yhteiskunta", "Yhteiskunta"]],
    "yhteiskunta": [["#/laki", "Laki"]],
    "yhteiskunta-tarinat": [["#/yhteiskunta", "Yhteiskunta"]],
    "raportti": [["#/etusivu", "Etusivu"], false],
    "toimijaverkosto": [["#/etusivu", "Etusivu"], false]
  };


  // helpers
  //========

  /**
   * unified ajax call to fetch the content
   * @param page is the file in the "partials" directory - .html extension
   */
  var loadContent = function (page, callback) {
    //console.log("loadContent", page, typeof callback === "function");
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
          highlightReadStories();
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
    //console.log("loadStory?", story);
    $("main nav").find("a[href$='" + story + "']").addClass("active");
    $("#story").load(storiesDir + story + ".html", function () {
      markStoryRead(story);
      highlightReadStories();
    });
  };


  /**
   * helper to store in session which stories have been visited already
   * @param story
   */
  var markStoryRead = function (story) {
    var s = window.sessionStorage;
    if (s) {
      if (!s.getItem(story)) {
          s.setItem(story, true);
      }
    }
  };


  /**
   * helper to check if a story by string @story has been marked as read already
   * @param story
   * @returns {boolean}
   */
  var hasReadStory = function (story) {
    var s = window.sessionStorage;
    if (s) {
      return s.getItem(story) ? true : false;
    }
    return false;
  };



  var highlightReadStories = function () {
    var s = window.sessionStorage;
    if (s) {
      // TODO is could do with some optimizing
      // looping through all sessionStorage items and blindly assuming them
      // to be a link string for which to look (on any page) is not ideal
      //
      // maybe first: check against a know story names
      // then: compile a jquery collection with only relevant looking links (i.e. has "#/xxx-tarinat" string)
      // then: highlight
      for (var i = 0; i < s.length; i++) {
        $("a[href$='" + s.key(i) + "']").addClass("read");
      }
    }
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

    //console.log(page, story);

    if (routesConfig.hasOwnProperty(page)) {
      //console.log("scripts?", routesConfig[page][2]);

      if (story !== "undefined") {
        loadContent(page, function () {
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