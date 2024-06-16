//Socket.io calls tutorial: https://www.youtube.com/watch?v=ZKEqqIO7n-k 

import {io} from 'socket.io-client'
var roomID = sessionStorage.getItem("roomID");
var playerFile = sessionStorage.getItem("playerFile");

const socket = io('http://66.71.53.162:3001')
//const socket = io('http://localhost:3001')
socket.on("connect", () => {
   console.log('You connected with id: ${socket.id}')
   sessionStorage.setItem("roomID", '');

})

//console.log(roomID);
var form = document.getElementById('joinRoomForm')

//var isInvalidRoom = false;
form.addEventListener('submit', function(event){
    event.preventDefault();
    var playerName = document.getElementById('playerName').value
    var roomNumber = document.getElementById('roomNumber').value

    sessionStorage.setItem("roomID", roomNumber);   //?change the value saved to the roomID entered by user
    sessionStorage.setItem("playerFile", playerName);

    //get locally stored value of isHost
    sessionStorage.getItem("isHost");
    if(isHost==='false'){
        sessionStorage.getItem("roomNumber");
        console.log('roomNumber from joingame.js'+ roomNumber);
        socket.emit('check-room-exists',roomNumber);
    }
})



socket.on("room-status", message => {
    
    console.log(message);
    if(message === 'exists'){
        console.log("inside client - join game rrrrrrr")
        window.location="http://66.71.53.162:1234/lobby.html";
    }else if(message === 'notexists'){
        console.log('Invlaid Room')
    } else if(message === 'roomfull'){
        console.log('Room is full')
    }
    //window.location="http://localhost:1234/joingame.html";
    //isInvalidRoom = true;
})