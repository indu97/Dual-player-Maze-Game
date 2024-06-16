const { Console } = require("console");
const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
var rooms = {};
const maxPlayers = 4;
const io = require("socket.io")(3001, {
    cors: {
        origin: ['http://66.71.53.162:1234'],
    },
});


// //read ip from file
// var ipAddress = '';
// //Read from file 
// const IPfile = require('fs');

// IPfile.readFile('IP.txt', 'utf8', (err, IP) => {
//    if(err){
//       console.error(err);
//       return;
//    }
//    console.log(IP);
//    ipAddress = IP;
//    console.log('http://'+ ipAddress + ':1234');
// })

//var address = 'http://'+ ipAddress + ':1234';
// var http = require('http').createServer().listen(3001, ipAddress);

// const io = require("socket.io")(http, {
//     cors: {
//         //origin: ['http://10.32.108.167:1234'],
//         origin: ['http://'+ipAddress+':1234'],
//     },
// });
//var io = require('socket.io').listen(http);
//const io = require('socket.io')(http);

//app.listen(3000,'0.0.0.0');



app.use(express.static(path.join(__dirname, 'client/build')));

io.on("connection", (socket) => {
    var hostID = '';
    var current_room = '';
    console.log(socket.id);
    socket.on('client-server', (message,room) => {
        console.log(message)
        if(room === "") {
            io.emit('update-positions', message)
        }else {
            socket.to(room).emit('update-positions', message)
        }
        
    })

    //Server Listens for "create-room" call , then emits back the players list in the room  
    socket.on("create-room", (roomID, host_socketID, player_name) => {
        socket.join(roomID);
        hostID = host_socketID;
        rooms[roomID] = {};
        current_room = roomID;
        var players = rooms[roomID];
        players[host_socketID] = player_name;
        rooms[roomID] = players;
        console.log('rooms: ', rooms);

        //console.log('created room');
        var successMessage = roomID + ' room created!'
        io.to(host_socketID).emit("created-room",successMessage);
        io.to(roomID).emit("players-list", players);
    })

    //server listens for "join-room" call, emits back the players list
    socket.on("join-room", (roomID, player_socketID, player_name) => {
        var message = '';
        var players = rooms[roomID];
        if(rooms.hasOwnProperty(roomID)){
            console.log('room exists - server');
            socket.join(roomID);  
            players[player_socketID] = player_name;
            rooms[roomID] = players;
            message = 'exists';
        }else{
            message = 'notexists';
        }
        io.to(player_socketID).emit("room-status", message);
        io.to(roomID).emit("players-list", players);
    })

    //
    socket.on("join-game", (roomID) => {
        socket.join(roomID);
    })

    //check if the room exists and send back the status of the room
    socket.on("check-room-exists", roomID => {
        var message = '';
        var players = rooms[roomID]
        if(rooms.hasOwnProperty(roomID)){
            message = 'exists';
            if(Object.keys(players).length >= 4){
                message = "roomfull"
            }
        }else{
            message = 'notexists';
        }
        console.log("inside server - check - rooom -status")
        io.to(socket.id).emit("room-status", message);
    })

    //start the game
    socket.on("start-game", roomId => {
        console.log("isnide server - start game")
        io.to(roomId).emit("game-started", roomId);
    })

    //receive player's update and broadcast to everyone in the room
    socket.on("update-move", (keyCode, playerID, roomID) => {
        io.to(roomID).emit("opponent-update", keyCode, playerID);
    })

    //Listen for game over and broadcast it to the room
    socket.on("game-winner", (roomID, playerID) => {
        io.to(roomID).emit("game-over", playerID);
        console.log('GAME OVER! winner is: ', playerID);
    })

    //Handle disconnects
    socket.on("disconnect", () => {
        console.log("disconnected");
        var players = rooms[current_room];
        //If the host gets disconnected, the room is deleted. 
        if(hostID != ''){
            delete rooms[current_room];
            console.log('rooms atfer deletion: ' + rooms)
        }else{
            if(rooms[current_room] != null) {
                var sock = socket.id
                delete players[sock];
                rooms[current_room] = players;
            }
        }

    })
});