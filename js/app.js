$(document).ready(function() {
    // Check if transcribe element exists
    $('div.transcribing').transcriber({
        test: 'test'
    });

    $(".translucent-box").on("mouseenter", function() {
        $(this).stop().animate({top:0}, { duration: 200, easing: "easeInOutExpo" });
    });

    $(".translucent-box").on("mouseleave", function() {
        $(this).stop().animate({top:"160px"}, { duration: 200, easing: "easeInOutExpo" });
    });

    $(".switch a").on("click", function(e) {
        e.preventDefault();

        var $a = $(this);
        $(".bkg").animate({right: 120 - $(this).position().left }, 100, function() {
            $(".switch").find("a").removeClass("selected");
            $a.addClass("selected");   
            if ($(this).position().left == 0) {
                $(".collection-list li.mine").animate({opacity:.2}, { duration: 100});
            } else {
                $(".collection-list li.mine").animate({opacity:1}, { duration: 100});
            }
        }); 
    });

    $("span.switch").on("click", function(e) {
        e.preventDefault();

        var $a = $(this);
            if ($(this).hasClass("selected")) {
                $(this).toggleClass("selected");
                $(".collection-list li.completed").animate({opacity:.2}, { duration: 100});
            } else {
                $(this).toggleClass("selected");
                $(".collection-list li.completed").animate({opacity:1}, { duration: 100});
            }
    });

});
