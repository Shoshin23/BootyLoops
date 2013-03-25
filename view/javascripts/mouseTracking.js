function ratelimit(fn, ms) {
    var last = (new Date).getTime();
    return function() {
        var now = (new Date).getTime();
        if (now - last > ms) {
            last = now;
            fn.apply(null, arguments);
        }
    };
}

/**
 * Retrieves the percentage movements of the mouse from the client
 */
$(document).mousemove(ratelimit(function(e) {
    socket.emit("move", {
        id: null,
        x: (e.pageX / $(window).width() * 100).toFixed(2),
        y: (e.pageY / $(window).height() * 100).toFixed(2)
    });
}, 40));

/**
 * Addition of the mouse if not present and movement if it is
 */
socket.on("movemouse", function(mouse) {
    if ($("#mouse_" + mouse["id"]).length == 0) {
        $("body").append('<span class="mouse" id="mouse_' + mouse["id"] + '"></span>').fadeIn();
    }
    $("#mouse_" + mouse["id"]).css({
        left: mouse["x"] + "%",
        top: mouse["y"] + "%"
    });
});

/**
 * Removal of the mouse upon disconnect
 */
socket.on("userleft", function(id) {
    $("#mouse_" + id).fadeOut("200", function() {
        $(this).remove();
    });
});