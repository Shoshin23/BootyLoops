function getName(used) {
    var name;
    do {
        if (used == false) {
            name = $.trim(prompt("Please enter your name (10 char. max.)"));
        } else {
            name = $.trim(prompt("Error name already in use, please choose another one. (10 char. max.)"));
        }
    } while (name.length > 10);
    if (name == "") {
        name = "Anonymous";
    }
    return name;
}

function getTime() {
    var time, currentTime = new Date, hours = currentTime.getHours(), minutes = currentTime.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    time = hours + ":" + minutes + " ";
    if (hours > 11) {
        time += "PM";
    } else {
        time += "AM";
    }
    return time;
}

function goToEnd() {
    var chat = $("#chat");
    chat.scrollTop(chat[0].scrollHeight - chat.height());
}