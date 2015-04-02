var socket = io()

function sendInvitation(){
	socket.emit('ADD_USER', {id: 123, room: 123 })
	console.log('test')
}