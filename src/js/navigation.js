/**
 * navigation components
 */
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