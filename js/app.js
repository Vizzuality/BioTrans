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

    // Big switch
    $(".switch a").on("click", function(e) {
        e.preventDefault();

        var $a = $(this);

        $(".bkg").animate({left: $(this).position().left }, 100, function() {
            $(".switch").find("a").removeClass("selected");
            $a.addClass("selected");   
            if ($(this).position().left != 0) {
                $(".collection-list li.mine").animate({opacity:.2}, { duration: 100});
            } else {
                $(".collection-list li.mine").animate({opacity:1}, { duration: 100});
            }
        }); 
    });

    // Small switch
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

    var timeLifePage = 0;

    $(".time-life li.previous a").on("click", function(e) {
        e.preventDefault();

        timeLifePage++;

        $(".time-life li.page"+(timeLifePage - 1)+".previous, .time-life-graf li.page"+(timeLifePage -1)+".previous").fadeOut(150, function() {
            $(this).remove();
            $(".time-life li.page"+timeLifePage+".hidden, .time-life-graf li.page"+timeLifePage+".hidden").fadeIn(150);
        });
    });

});



