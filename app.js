var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

  io.set('log level', 1);

var port = process.env.PORT || 3000;
app.listen(port);


function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


function handler (req, res) {

	var filePath = req.url;

	if (filePath == '/') {
		filePath = './view/index.html';
	} else {
		filePath = './view/' + req.url;
	}

	var extname = filePath.substr(filePath.lastIndexOf('.') + 1);
	var contentType = 'text/html';

	switch (extname) {
		case 'js':
		contentType = 'text/javascript';
		break;
		case 'css':
		contentType = 'text/css';
		break;
		case 'png':
		contentType = 'image';
		break;
	}

	fs.readFile(filePath, function(err, content) {
		if (err) {
			res.writeHead(500);
			return res.end('Problem while loading page');
		} else {
			res.writeHead(200, { 'Content-Type': contentType });
			return res.end(content, 'utf-8');
		}
	});
}

function log(s, socket) {
	var m_names = new Array("January", "February", "March", 
				"April", "May", "June", "July", "August", "September", 
				"October", "November", "December");

	var d = new Date();
	var curDate = d.getDate();
	var curMonth = d.getMonth();
	var curYear = d.getFullYear();
	var curHour = d.getHours();
	var curMin = d.getMinutes();
	var curSec = d.getSeconds();
	var date = curDate + '-' + m_names[curMonth] + '-' + curYear + ' ' + curHour + ':' + curMin + ':' + curSec + ' - ';

	var ipPort = socket.address + ':' + socket.port + ' - ';

	var logpath = "./BootyLoops.log";
	var fs = require('fs');
	
	s = s.toString().replace(/\r\n|\r/g, '\n');
	console.log('\t' + date + ipPort + s);

	var fd = fs.openSync(logpath, 'a+', 0666);
	fs.writeSync(fd, '\t' + date + ipPort + s + '\n');
	fs.closeSync(fd);
}


var id = -1;	

var musics = {};
var clients = {};

musics = [
{ 'id' : guidGenerator(), 'title': "Drum 01", 'sound': "s0" },
{ 'id' : guidGenerator(), 'title': "Drum 02", 'sound': "s1" },
{ 'id' : guidGenerator(), 'title': "Drum 04", 'sound': "s3" },
{ 'id' : guidGenerator(), 'title': "Drum 05", 'sound': "s4" },
{ 'id' : guidGenerator(), 'title': "Drum 06", 'sound': "s5" },
{ 'id' : null			, 'title': null		, 'sound': null },
{ 'id' : null			, 'title': null		, 'sound': null },
{ 'id' : null			, 'title': null		, 'sound': null },
{ 'id' : null			, 'title': null		, 'sound': null },
{ 'id' : null			, 'title': null		, 'sound': null },
{ 'id' : guidGenerator(), 'title': "Deep 14", 'sound': "s13" },
{ 'id' : guidGenerator(), 'title': "Deep 13", 'sound': "s12" },
{ 'id' : guidGenerator(), 'title': "Deep 13", 'sound': "s12" },
{ 'id' : null			, 'title': null		, 'sound': null },
{ 'id' : guidGenerator(), 'title': "House 12", 'sound': "s11" },
{ 'id' : guidGenerator(), 'title': "Toms 09", 'sound': "s8" },
{ 'id' : guidGenerator(), 'title': "Toms 09", 'sound': "s8" },
{ 'id' : null			, 'title': null		, 'sound': null },
{ 'id' : guidGenerator(), 'title': "Tops 10", 'sound': "s9" },
{ 'id' : guidGenerator(), 'title': "Tops 09", 'sound': "s8" },
{ 'id' : guidGenerator(), 'title': "Muffle 17", 'sound': "s16" },
{ 'id' : null			, 'title': null		, 'sound': null },
{ 'id' : guidGenerator(), 'title': "Vocal 16", 'sound': "s15" },
{ 'id' : null			, 'title': null		, 'sound': null },
{ 'id' : null			, 'title': null		, 'sound': null }
];

modifiers = [
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null},
{ 'info' : null, 'id' : null}
];

var rowMax = 10;
var colMax = 10;

grid = { 'colNumber' : 5 ,
 'rowNumber' : 5};

io.sockets.on('connection', function (socket) {
	
	function sendMessage(type, content, broadcast) {
		if (clients[socket.id] != "Anonymous") {
			if (arguments.length > 2) {
				var type = arguments[0];
				var content = arguments[1];
				var broadcast = arguments[2];

				if (broadcast == true) {
					socket.broadcast.emit('message', {'type': type, 'content': content});
				}
				socket.emit('message', {'type': type, 'content': content});		
			}
		}
	}

	function printMusics() {
		// Following function allow debugging with proper display
		for (var row = 0; row < rowNumber; row++) {
			var music = '';

			for (var col = 0; col < colNumber; col++) {
				var i = col + (row * musics.length / rowNumber);

				if (musics[i].id != null) {
					music += musics[i].title + '\t\t\t';
				}
				else {
					music += 'null \t\t\t';
				}
			}
		}
	}

	function refreshData() {
		io.sockets.emit('update', {'musics': musics, 'modifiers': modifiers, 'grid': grid});
	}

	/*
	 * *******************************************************
	 *
	 * Management of Users connected to the server and their name.
	 *
	 * Validation of the client's name in order to avoid having
	 * multiple client with the same name.
	 *
	 * *******************************************************
	 */
	clients[socket.id] = 'Anonymous';

	socket.on('disconnect', function() {
		if (clients[socket.id] !== undefined && clients[socket.id] != "Anonymous") {
			sendMessage('warning', clients[socket.id] + ' has disconnected', true);
			log(clients[socket.id] + ' has disconnected', socket.handshake.address);

			if (clients[socket.id] !== undefined) {
				delete clients[socket.id];
			}
	
			io.sockets.emit('connections', clients);
			io.sockets.emit('userleft', socket.id);
		}
		
	});
	
	socket.on('validateName', function(name) {
		var flag = 0;

		for (var key in clients) {
			if ((clients[key] == name && key != socket.id) || name == "Anonymous") {
				flag = 1;
				socket.emit('nameInvalid');
				break;
			}
		}

		if (flag == 0) {
			clients[socket.id] = name;

			sendMessage('chatInfo', 'The collaborative group gains strength! (' + name + ' connected)', true);
			sendMessage('chatInfo', 'Successfully connected to server!', false);
			log('The collaborative group gains strength! (' + name + ' connected)', socket.handshake.address);

			io.sockets.emit('connections', clients);
		}
	});

	/*
	 * *******************************************************
	 *
	 * Sending the lastest version of the music list to clients
	 *
	 * *******************************************************
	 */
	socket.on('needUpdate', function(data) {
		log('Update of music requested for: ' + clients[socket.id], socket.handshake.address);
		socket.emit('update', {'musics': musics, 'modifiers': modifiers, 'grid': grid});
	});

	
	
	/*
	 * *******************************************************
	 *
	 * Management of Used list: Addition/Deletion of elements
	 *
	 * *******************************************************
	 */
	socket.on('insertNew', function(sample) {
		if (musics[sample.index] !== undefined && musics[sample.index].id == null) {
			var title = sample.newValue.title;

			musics[sample.index] = { id: guidGenerator(), title: sample.newValue.title, sound: sample.newValue.sound };
			modifiers[sample.index] = { info: 'Item added by: ' + clients[socket.id], id: socket.id};

			refreshData();

			sendMessage('info', title + ' successfully added by ' + clients[socket.id] + '.', true);
			log(title + ' successfully added by ' + clients[socket.id] + '.', socket.handshake.address);
		}
		else {
			sendMessage('error', 'Cannot overwrite music, please remove it before.', false);
			log('Cannot overwrite music, please remove it before. (' + clients[socket.id] + ')', socket.handshake.address);
		}
	});

	socket.on('removeUsed', function(id) {
        console.log("going to remove " + id);
		if (musics[id] !== undefined && musics[id].id != null) {
            console.log("removing " + id);
			var title = musics[id].title;

			musics[id].id = musics[id].title = musics[id].sound = null;
			modifiers[id] = { info: title + ' previously removed by: ' + clients[socket.id], id: socket.id};

			refreshData();

			sendMessage('info', title + ' successfully removed by  ' + clients[socket.id] + '.', true);
			log(title + ' successfully removed by  ' + clients[socket.id] + '.', socket.handshake.address);
		}
		else {
			sendMessage('error', 'Cannot remove an empty sample!', false);
			log('Cannot remove an empty sample! (' + clients[socket.id] + ')', socket.handshake.address);
		}
	});

	/*
	 * *******************************************************
	 *
	 * Handling the different chat message in here
	 * As no save in database, chat message are directly broadcasted
	 * to all the other clients connected on the platform
	 *
	 * *******************************************************
	 */
	socket.on('chatEvent', function (msg) {
		socket.broadcast.emit('message', {type:'chatInfo', content:'New message in chat!'});
		socket.broadcast.emit('chat', msg);
		log('New message in chat by: ' + clients[socket.id], socket.handshake.address);
	});
	
	/** Mouse move **/
	
	socket.on('move', function (data) {
		data.id = socket.id;
		socket.broadcast.emit('movemouse', data);
	});
});
