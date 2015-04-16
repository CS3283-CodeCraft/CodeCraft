var mySocket = io({'force new connection': true})

var socketTest = angular.module('socketTest', []);

socketTest.controller('SocketCtrl', function ($scope) {

	$scope.username = 'default';
	$scope.shareboxId = 'shareboxid';
	$scope.socketClients = {}
	$scope.socketList = []

	var socket = mySocket;

	mySocket.on('SOCKET_CONTROL_UPDATE', function(msg){
    	$scope.socketClients = msg;
    	$scope.$apply();
  	});

	$scope.createRoom = function(){
		socket.emit('JOIN_SHAREBOX', {
			id: $scope.username,
			room: $scope.shareboxId,
		})
	};

	$scope.leaveRoom = function(){
		socket.emit('LEAVE_SHAREBOX', {
			id: $scope.username,
			room: $scope.shareboxId,
		})
	};

	$scope.selectSocket = function(index){
		socket = $scope.socketList[index].socket
		$scope.username = $scope.socketList[index].id
	}

	$scope.dummyLeaveRoom = function(index){
		var dummy = $scope.socketList[index].socket
		dummy.emit('LEAVE_SHAREBOX', {
			id: $scope.socketList[index].id,
			room: $scope.shareboxId,
		})
	}

	$scope.dummyReject = function(index){
		var dummy = $scope.socketList[index].socket
		dummy.emit('INVITE_REJECT', {
			id: $scope.socketList[index].id,
			room: $scope.shareboxId,
		})
	}

	$scope.removeFromRoom = function(index){
		socket.emit('REMOVE_USER', {
			room: $scope.shareboxId,
			removeId: $scope.socketList[index].id
		})
	}

	$scope.addDummyToRoom = function(i){
		socket.emit('ADD_USER', {
			ownerId: $scope.username,
			room: $scope.shareboxId,
			inviteId: $scope.socketList[i].id
		})
		var s = $scope.socketList[i].socket
		s.emit('INVITE_ACCEPT', {
			id: $scope.socketList[i].id,
			room: $scope.shareboxId,
		})
		s.emit('JOIN_SHAREBOX', {
			room: $scope.shareboxId,
			id: $scope.socketList[i].id
		})
	}

	$scope.joinAllSocket = function(){
		for (var i = $scope.socketList.length - 1; i >= 0; i--) {
			mySocket.emit('ADD_USER', {
				ownerId: $scope.username,
				room: $scope.shareboxId,
				inviteId: $scope.socketList[i].id
			})
			var s = $scope.socketList[i].socket
			s.emit('INVITE_ACCEPT', {
				id: $scope.socketList[i].id,
				room: $scope.shareboxId,
			})
			s.emit('JOIN_SHAREBOX', {
				room: $scope.shareboxId,
				id: $scope.socketList[i].id
			})
		};

	}

	$scope.dummyCreateRoom = function(index){
		var dummy = $scope.socketList[index].socket
		dummy.emit('JOIN_SHAREBOX', {
			id: $scope.socketList[index].id,
			room: $scope.shareboxId,
		})
	}

	$scope.dummyDisconnect = function(index){
		var dummy = $scope.socketList[index].socket
		dummy.disconnect();
	}
	$scope.dummyConnect = function(index){
		var dummy = $scope.socketList[index].socket
		dummy.connect();
	}

	$scope.createSockets = function(amount){
		for (var i = amount - 1; i >= 0; i--) {
			var dummy = io({'force new connection': true})
			var user = {
				socket: dummy,
				id: "dummy_" + i
			}
			$scope.socketList.push(user);
		};
	}

	$scope.refresh = function(){
		mySocket.emit('SOCKET_CONTROL_REQUEST_UPDATE');
	}


});