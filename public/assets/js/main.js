/*! kirjasto2030 - v0.0.0 - 2015-04-01
* Copyright (c) 2015 ;*/
// using sammy framework for simple routing, nothing much more at the moment 
var app = $.sammy(function () {

  var partialsDir = "partials/",
    pageClass = "page-";

  // unified ajax call to fetch the content
  var loadContent = function (page) {
    $("main")
      .addClass("transition")
      .load(partialsDir + page + ".html", function () {
        $("main")
          .removeAttr("class")
          .addClass(pageClass + page);
      });
  };

  this.get("#/intro", function () {
    loadContent("intro");
  });
  this.get("#/teknologia", function () {
    loadContent("teknologia");
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