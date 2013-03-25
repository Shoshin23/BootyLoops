var stopped = true;

$(function() {
	//Spacebar shortcut
    $(document).keypress(function(e) {
        if (document.activeElement === document.body) {
            if (e.which && e.which == 32 || e.keyCode && e.keyCode == 32 && !ChatHasFocus) {
                togglePlay();
                return false;
            } else {
                return true;
            }
        }
    });
	
	//Button functions
    $("#playbutton").click(function() {
        togglePlay();
        return false;
    });
    $("#stopbutton").click(function() {
        stopped = false;
        togglePlay();
        return false;
    });
	
    function togglePlay() {
        var $elem;
        if (previewPlaying) {
            alert("Sample preview is currently running");
            return;
        }
        $("#stopbutton, #playbutton").toggleClass("btn hidden");
        if (stopped) {
            stopped = false;
            sequencer.play();
        } else {
            stopped = true;
            sequencer.stop();
        }
		//Play + Stop animations
        $elem = $("#player").children(":first");
        $elem.stop().show().animate({
            marginTop: "75px",
            marginLeft: "-175px",
            width: "350px",
            height: "350px",
            opacity: "0"
        }, function() {
            $(this).css({
                width: "100px",
                height: "100px",
                "margin-left": "-50px",
                "margin-top": "-50px",
                opacity: "1",
                display: "none"
            });
        });
        $elem.parent().append($elem);
    }
});