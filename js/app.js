var showCompleted = false;

$(function() {

  // Check if transcribe element exists
  $('div.transcribing.regular').transcriber({
    test: 'test'
  });

  $('div.transcribing.sernac').transcriberSernac({
    test: 'test'
  });

  $(".collection-list li").on("mouseenter", function() {
    $(this).find(".translucent-box").stop().animate({top:0}, { duration: 200, easing: "easeInOutExpo" });
  });

  $(".collection-list li").on("mouseleave", function() {
    $(this).find(".translucent-box").stop().animate({top:"160px"}, { duration: 200, easing: "easeInOutExpo" });
  });

  // Big switch (shows/hides your collections)
  $(".switch a").on("click", function(e) {
    e.preventDefault();

    var $a = $(this);

    $(".bkg").animate({left: $(this).position().left }, 100, function() {
      $(".switch").find("a").removeClass("selected");
      $a.addClass("selected");
      if ($(this).position().left != 0) {
        if (showCompleted) {
          $(".collection-list li.completed:not(.mine)").animate({opacity:.2}, { duration: 100});
        } else $(".collection-list li:not(.mine)").animate({opacity:.2}, { duration: 100});
      } else {
        if (showCompleted) {
          $(".collection-list li.completed:not(.mine)").animate({opacity:1}, { duration: 100});
        } else $(".collection-list li:not(.mine)").animate({opacity:1}, { duration: 100});
      }

    });
  });

  // Small switch (shows completed collections)
  $("span.switch").on("click", function(e) {
    e.preventDefault();

    var $a = $(this);

    if ($(this).hasClass("selected")) {
      $(this).html($(this).attr('data-selected'));
      showCompleted = true;
      $(".collection-list li:not(.completed)").animate({opacity:.2}, { duration: 100});
    } else {
      showCompleted = false;
      $(this).html($(this).attr('data-show'));
      $(".collection-list li:not(.completed)").animate({opacity:1}, { duration: 100});
    }
    $(this).toggleClass("selected");
  });

  var timeLifePage = 0;

  $(".time-life").find("li:nth-child(2n+1)").addClass("odd");

  $(".time-life li.previous a").on("click", function(e) {
    e.preventDefault();

    timeLifePage++;

    $(".time-life li.page"+(timeLifePage - 1)+".previous, .time-life-graf li.page"+(timeLifePage -1)+".previous").fadeOut(150, function() {
      $(this).remove();
      $(".time-life li.page"+timeLifePage+".hidden, .time-life-graf li.page"+timeLifePage+".hidden").fadeIn(150);
      $(".time-life").find("li").removeClass("odd");
      $(".time-life").find("li:nth-child(2n+1)").addClass("odd");
    });
  });

});

