
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