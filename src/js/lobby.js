//Socket.io calls tutorial: https://www.youtube.com/watch?v=ZKEqqIO7n-k 

import {io} from 'socket.io-client'

var isHost = sessionStorage.getItem("isHost");
var roomID = sessionStorage.getItem("roomID");
var playerFile = sessionStorage.getItem("playerFile");
var playersList = [];
var disabledButtonFlag = true; //true by default

var disabledButton = document.getElementById('startGame');


//socket
//const socket = io('http://localhost:3001')
const socket = io('http://66.71.53.162:3001')
socket.on("connect", () => {
   console.log('You connected with id: ${socket.id}')

   //get locally stored value of isHost
   sessionStorage.getItem("isHost");
   sessionStorage.setItem("localSocketID", socket.id);
   console.log('localsocketid: ', sessionStorage.getItem("localSocketID"))
    if(isHost==='true'){
        disabledButtonFlag = false;
        console.log(isHost);
        socket.emit('create-room',roomID,socket.id,playerFile);
   }else{
    sessionStorage.getItem("roomID");
        console.log(roomID);
        socket.emit('join-room',roomID,socket.id,playerFile);
   }
   if(disabledButtonFlag){
        disabledButton.disabled = "disabled";
    } 
})

socket.on("players-list", players => {
    console.log('players:  ',players);
    playersList = players; 
    sessionStorage.setItem("localPlayersList", JSON.stringify(players));
    console.log('local players: ',JSON.parse(sessionStorage.getItem("localPlayersList")));
})

socket.on("room-not-exists", message => {
    console.log(message);
})

socket.on("created-room", message => {
    console.log(message);
})

socket.on("game-started", roomId => {
    //window.alert("You can start the game now!");
    console.log("inside client - game started");
    window.location="http://66.71.53.162:1234/game.html";
})

function startGameClick() {
    //alert("You clicked the button start Game!");
    console.log("client - start server")
    socket.emit("start-game", roomID);
}
var startbutton = document.getElementById("startGame");   
startbutton.onclick = startGameClick;

function getHostClick() {
    //alert("You clicked the button start Game!");
    console.log('localsocketid: ', sessionStorage.getItem("localSocketID"))
}
var getHostbutton = document.getElementById("getHost");   
getHostbutton.onclick = getHostClick;
