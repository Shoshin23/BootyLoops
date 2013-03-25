/*
 * *******************************************************
 *
 * Creation of the list of samples available to the user in
 * a JSON format.
 * Also setting the name of the server the user will be connected to
 * as well as its name.
 * Name getting should be replaced in later released by a login system
 *
 * *******************************************************
 */

var samples = {};
var server = window.location.hostname; // Change this by the IP address of the server or its DN

samples = [
{ 'id' : 0 , 'title': "Drum 01", 'sound' : "s0" },
{ 'id' : 1 , 'title': "Drum 02", 'sound' : "s1" },
{ 'id' : 2 , 'title': "Drum 03",'sound' : "s2" },
{ 'id' : 3 , 'title': "Drum 04",'sound' : "s3" },
{ 'id' : 4 , 'title': "Drum 05",'sound' : "s4" },
{ 'id' : 5 , 'title': "Drum 06",'sound' : "s5" },
{ 'id' : 6 , 'title': "Toms 07",'sound' : "s6" },
{ 'id' : 7 , 'title': "Toms 08",'sound' : "s7" },
{ 'id' : 8 , 'title': "Toms 09",'sound' : "s8" },
{ 'id' : 9 , 'title': "Toms 10",'sound' : "s9" },
{ 'id' : 10 , 'title': "SHM 11",'sound' : "s10" },
{ 'id' : 11 , 'title': "House 12",'sound' : "s11" },
{ 'id' : 12 , 'title': "Deep 13",'sound' : "s12" },
{ 'id' : 13 , 'title': "Deep 14",'sound' : "s13" },
{ 'id' : 14 , 'title': "Vocal 15",'sound' : "s14" },
{ 'id' : 15 , 'title': "Vocal 16",'sound' : "s15" },
{ 'id' : 16 , 'title': "Muffle 17",'sound' : "s16" }
];

var name = getName(false);



var socket = io.connect(server); //heroku

var currentMusic = {};
var grid = {};

// Validation of the client's name with the server
socket.emit('validateName', name);
$('#username').text(name);
socket.on('nameInvalid', function() {
	name = getName(true);
	socket.emit('validateName', name);
	$('#username').text(name);
});

// Requesting new list of music
socket.emit('needUpdate', null);

socket.on('update', function(data) {
	var musics = data.musics;
	var modifiers = data.modifiers;
	var elem = $('#used');
	
	currentMusic = musics;
	grid = data.grid;
	
	elem.empty();
	
	if ($("#indicator li").length == 0){
		for(var x = 0; x < grid.colNumber; x++) {		
			$('#indicator').append('<li class="span2"></li>');		
		}
	}
	for(var x = 0; x < grid.rowNumber; x++) {		
		elem.append('<div class="row-fluid" id="mrow-' + x + '"></div>');		
	}
	
	
	var currRow = 0;
	$.each(musics, function(i, music) {
		// Image link to delete music containing the index of the music to remove
		var linkDel = '<a class="del"  href="javascript:void(0)" onclick="remove('+ i +');"></a>';
		if (modifiers[i].info != null && modifiers[i].id != null) {
			var title = modifiers[i].info + '\n' + 'Session #id: ' + modifiers[i].id;
		}
		else {
			var title = 'No information concerning this sample.';
		}
		
		if( i%grid.colNumber == 0 | i == 0)
			elem = $('#mrow-'+currRow++);
				
		if (musics[i].id == null) {
			elem.append($('<li class="span2 col-' + i%grid.colNumber + '" id=' + i + ' title="' + title + '">').append('</li>'));
		}
		else {
			elem.append($('<li class="span2 col-' + i%grid.colNumber + '" id=' + i +  ' title="' + title + '">').text(musics[i].title).append(linkDel + '</li>'));
		}
	});

});

$.each(samples, function(i, sample) {
	var linkPreview = '<a> <div class="preview" id="previewicon-'+i+'" href="#" onclick="playPreview('+i+')"> </div> </a>';
	$('#samples').append($('<li id=' + samples[i].id + '>').text(samples[i].title).append('</li>' + linkPreview));
});	


var dragFrom = null;
var idSample = -1;

$("#samples").sortable({
	helper: "clone",
	start: function(event, ui) {
		idSample = ui.item.attr('id');
		dragFrom = ui.item.index();
		ui.item.remove();
	},
	update: function(event, ui) {
		var elementTo = $(getElementUnderMouse());

		if (elementTo.closest("ul").attr('id') == 'used') {
			for (var i = 0; i < samples.length; i++) {
				if (samples[i].id == idSample) {
					socket.emit('insertNew', {'newValue': samples[i], 'index': elementTo.attr('id')});
				}
			}
	    }
		dragFrom = null;
	},
	change: function(event, ui) {
		var to = ui.placeholder.index();

		dragFrom = to;
	},
	beforeStop: function(event, ui) {
		ui.placeholder.before(ui.item);
	}
});
		
$("#samples").disableSelection();



socket.on('chat', function(message) {
	$('#chat').val($('#chat').val() + '[' + getTime() + '] ' + message);
	goToEnd();
});

$('#outgoingChatMessage').keypress(function(event) {
	if(event.which == 13) {
		var newtext = name + ': ' + $('#outgoingChatMessage').val() + '\n';

		event.preventDefault();
		socket.emit('chatEvent', newtext);
		$('#outgoingChatMessage').val('');
		$('#chat').val($('#chat').val() + '[' + getTime() + '] ' + newtext);
		goToEnd();
	}
});



socket.on('message', function(text) {
	var color = 'black';

	if (text.type != 'chatInfo' && text.type != 'info' &&
	    text.type != 'error' && text.type != 'warning') {
		text.content = 'Bad interpretation of server communication';
	}

	if (text.type == 'chatInfo') {color = 'blue';}
	else if (text.type == 'info') {color = 'green';}
	else if (text.type == 'error' || text.type == 'warning') {color = 'red';}

	$('#log code').animate({opacity:0}, function() {
		$('#log code').text(text.content)
		.css('color', color)
		.animate({opacity:1});
	});
});

socket.on('disconnect', function(text) {
	$('#log code').css('color', 'blue');
	$('#log code').animate({opacity:0}, function() {
		$('#log code').text("Disconnect from the server")
		.animate({opacity:1});
	});


	socket.emit('disconnect');
});


/*
 * *******************************************************
 *
 * Management of displaying who's online, who isn't.
 *
 * *******************************************************
 */

socket.on('connections', function(clients) {
	var userList = '';
	var count = 0;

	for (var key in clients) {
		if (clients[key] !== undefined && clients[key] != "Anonymous") {
			count++;
			userList += '<p>' + clients[key];
			userList += '</p>';
		}
	}

	$('#users h1').replaceWith('<h1>Users (' + count + ')</h1>');
	$('#userList p').remove();
	$('#userList').append(userList);
	
	$('#userList').animate({opacity:0}, function() {
		$('#userList')
		.css('color', 'grey')
		.animate({opacity:1});
	});

});

/**Preview of files **/

/*
 * Function getting called when someone click on the preview button
 * The index of the element is passed to the function 
 */
 
var previewPlaying = false;
var previewSound;

function playPreview(id) {
    if(previewPlaying) {
        previewSound.stop();
        $('.preview').css('background','url(../images/play_normal.png) no-repeat');
        previewPlaying = false;
        return;
    }
    if (!stopped) {
        alert("Please stop main playback (by pressing spacebar) to preview the sample");
    } else {
        previewPlaying = true;

        $("#previewicon-" + id).css('background','url(../images/play_pressed.png) no-repeat');
        previewSound = soundManager.getSoundById(samples[id].sound);
        previewSound.play({
            autoLoad: true,
            onfinish:function() {
                previewPlaying = false;
                $("#previewicon-" + id).css('background','url(../images/play_normal.png) no-repeat');
            }
        });
    }
}

function remove(id) {
    socket.emit('removeUsed', id);
}
