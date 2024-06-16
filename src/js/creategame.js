//Socket.io calls tutorial: https://www.youtube.com/watch?v=ZKEqqIO7n-k 

import {io} from 'socket.io-client'
const socket = io('http://66.71.53.162:3001')
//const socket = io('http://localhost:3001')
socket.on("connect", () => {
   console.log('You connected with id: ${socket.id}')
   sessionStorage.setItem("roomID", '');

})

var isHost = sessionStorage.getItem("isHost");
var roomID = sessionStorage.getItem("roomID");
var playerFile = sessionStorage.getItem("playerFile");
//sessionStorage.setItem("roomID", false);

var form = document.getElementById('createRoomForm')
form.addEventListener('submit', function(event){
    //event.preventDefault()

    var player_name = document.getElementById('playerName').value
    var roomNumber = document.getElementById('roomNumber').value

    sessionStorage.setItem("roomID", roomNumber);  
    sessionStorage.setItem("playerFile", player_name);
    
    sessionStorage.setItem("isHost", true);

    socket.emit('check-room-exists',roomNumber);
})

socket.on("room-status", message => {
    
    if(message === 'exists'){
        window.location="http://66.71.53.162:1234/lobby.html";
    }else if(message === 'notexists'){
        console.log('Invlaid Room')
    }
    //window.location="http://localhost:1234/joingame.html";
    //isInvalidRoom = true;
})

