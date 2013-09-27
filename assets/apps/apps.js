var chat = {
	host:'localhost',
	port:'8080',
	connection:null,
	user:{
		name:'',
		email:''
	},
	callback:null,
	init:function(callback)
	{
		this.connection = new WebSocket('ws://'+this.host+':'+this.port);
		this.callback = callback;
		this.connection.onopen = this.onOpen;
		this.connection.onmessage = this.onMessage;
		this.connection.onerror = this.onError;
		this.connection.onclose = this.onClose;
	},
	onOpen:function(event)
	{
		chat.callback.apply(this, [chat.connection.readyState]);
	},
	onMessage:function(event)
	{

	},
	onError:function()
	{

	},
	/**
	* @param object data: data that will be passed to send 
	*/
	send:function(data)
	{
		data = JSON.stringify(data);
		this.connection.send(data);
		return this;
	},
	onClose:function()
	{

	}
}



$(function(){

		var input = $('#input'),
			box = $('#box'),
			me = this;


	chat.onMessage = function(e) {
		var data = JSON.parse(e.data);
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

	chat.onError = function(e)
	{
		alert('Couldn\'t connect to the server');
	}
	chat.init(function(connected){
		input.find('.form-control').keypress(function(event) {
			if ( event.which == 13  && event.shiftKey == false) {
				var data = {
					"username":chat.username,
					"action":"message",
					"message":$(this).val(),
					"date":new Date().toISOString()
				}
				chat.send(data);
				$(this).val('')
				event.preventDefault();
			}
		});

		$("#btn-socket").addClass('btn-primary').removeAttr('disabled').text('Click to Join').click(function(){
			var that = $(this);
			chat.username = prompt("Please enter your name:", "Web socket Noob");

			if (chat.username) {
				isConnected = true;
				var data = {
					"username":chat.username,
					"action":"join",
					"message":chat.username+" gabung nih",
					"date":new Date().toISOString()
				}
				chat.send(data);

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
		});
	});
	$('#btn-socket').attr({'disabled':'disabled'}).text('waiting server connection');
});