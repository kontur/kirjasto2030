/**
 * navigation components
 */
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