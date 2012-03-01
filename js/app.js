$(document).ready(function() {
    // Check if transcribe element exists
    $('div.transcribing').transcriber({
        test: 'test'
    });

    $(".translucent-box").on("mouseenter", function() {
        $(this).animate({top:0}, { duration: 200, easing: "easeInOutExpo" });
    });

    $(".translucent-box").on("mouseleave", function() {
        $(this).animate({top:"160px"}, { duration: 200, easing: "easeInOutExpo" });
    });
});
