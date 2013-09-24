$(function(){
	var conn,
		isConnected = false,
		username,input = $('#input'),
			box = $('#box')

	// input.append('<input class="form-control " type="text" placeholder="Type a message..."/>')
	input.find('.form-control').keypress(function(event) {
		if ( event.which == 13  && event.shiftKey == false) {
			var data = {
				"username":username,
				"action":"message",
				"message":$(this).val(),
				"date":new Date().toISOString()
			}
			conn.send(JSON.stringify(data));
			$(this).val('')
			event.preventDefault();
		}
	})
	$("#btn-socket").click(function(){
		var that = $(this);
		username = prompt("Please enter your name:", "Web socket Noob");

		if (username) {
			var host = location.hostname;
			conn = new WebSocket('ws://'+host+':8080');

			conn.onopen = function(e) {
				// Connection is established
				isConnected = true;
				var data = {
					"username":username,
					"action":"join",
					"message":username+" gabung nih",
					"date":new Date().toISOString()
				}
				conn.send(JSON.stringify(data));

				// Create simple interface for input

				// Create quit button
				that.replaceWith($('<button id="btn-socket-out" class="btn btn-primary btn-danger"><i class="glyphicon glyphicon-trash"></i></button>'))
				$("#btn-socket-out").click(function(){
					location.reload()
				})

				// Put the user into text input
				input.find('.input-block-level').focus()
				$('.chat-area .overlay').fadeOut(500);
			}

			// conn.send('join.'+username+' joining the awesomeness');
			conn.onmessage = function(e) {
				var data = JSON.parse(e.data);
				console.log(e.data);
				console.log(data);
				var type=data.action,
					username = data.username,
					message=data.message,
					date = data.date;

				var msgContainer = $('<div/>').addClass('msg-container'),
					dateContainer = $('<div/>').addClass('date').attr('title',date),
					msgContent = $('<div/>').addClass('msg-content');

				
				dateContainer.html(date).timeago();
				msgContent.append('<div><strong>'+username+'</strong></div> '+message);

				if (type == "join") {
				    msgContainer.addClass('joining').append(msgContent, dateContainer)
				} else if (type == "message") {
					msgContainer.addClass('message').append(msgContent, dateContainer)
				} else if (type == "left") {
					msgContainer.addClass('left').append(msgContent, dateContainer)
				} else {
				    msgContainer.addClass('error').append(msgContent)
				}
				box.append(msgContainer);
			}
			conn.onclose = function(e){
				var data = {
					"username":username,
					"action":"join",
					"message":username+" ngilang entah kemana"
				}
				conn.send(JSON.stringify(data));
				conn.close();
			}

			conn.onerror = function(e)
			{
				alert('Couldn\'t connect to the server');
			}
		}
	})
});