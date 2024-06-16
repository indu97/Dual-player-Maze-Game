/*
list of references: 
1.Maze game logic reference: https://medium.com/codex/build-a-maze-game-with-vanilla-javascript-part-1-of-2-ddfd35e84e93 
2.Socket.io calls tutorial: https://www.youtube.com/watch?v=ZKEqqIO7n-k 
*/


import {io} from 'socket.io-client'
var roomID = sessionStorage.getItem("roomID");
var localSocketID = sessionStorage.getItem("localSocketID");
var playersList = JSON.parse(sessionStorage.getItem("localPlayersList"));
var playerSockets = [];    //Array for storing socket ids of all players
var gameOver = false; 
var winner = '';
var ipAddress = '';
// //Read from file 
// const fs = require('fs');

// fs.readFile('IP.txt', 'utf8', (err, IP) => {
//    if(err){
//       console.error(err);
//       return;
//    }
//    console.log(IP);
//    ipAddress = IP;
// })

//socket
const socket = io('http://66.71.53.162:3001') 
//const socket = io('http://10.32.108.167:3001')
//const socket = io('http://'+ ipAddress + ':3001');

socket.on("connect", () => {
   console.log('You connected with id: ${socket.id}')
   console.log('socket.id', socket.id);
   console.log('localsocketid: ', localSocketID);
   socket.emit("join-game", roomID);
}) 

socket.on("game-over", (playerID) => {
   let body = document.querySelector('body');
   gameOver = true; 
   if(winner == ''){
      winner = playerID;
      console.log('Winner is: ', playerID);
      body.className = 'gameover';
      if(playerID == localSocketID ){
         window.alert("You win");
      }else{
         window.alert("You lose");
      }
   }
})


//Reference tutorial [1]
let levels = [];

levels[0] = {
   map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1],
      [1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1],
      [1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1]
    ],
    //modified this to accomodate multi players
    players: {},
    goal: {
      x: 9,
      y: 0
    },
  theme:'default'
};

//game DOM 
function Game(id, level) {
  
  this.el = document.getElementById(id);
  
  this.tileTypes = ['floor','wall','monster'];
  
  this.tileDim = 32;
  
  // inherit the level's properties: map, player start, goal start.
  this.map = level.map;
  this.theme = level.theme;
  this.players = playersList;
  //this.players = {...level.players};
  console.log('this.players: ', this.players);
  this.goal = {...level.goal};
}

Game.prototype.populateMap = function() {
  
  this.el.className = 'game-container ' + this.theme;
  
  let tiles = document.getElementById('tiles');
  
  for (var y = 0; y < this.map.length; ++y) {
    
    for (var x = 0; x < this.map[y].length; ++x) {
              
           let tileCode = this.map[y][x];
       
           let tileType = this.tileTypes[tileCode];
       
           let tile = this.createEl(x, y, tileType);
       
           tiles.appendChild(tile); // add to tile layer
     }
  }
}

//added by me to populate multiple players on the map
Game.prototype.populatePlayers = function() {
   var i = 4
   var j = 0;
   for (var player in playersList) {
      i = i + 2;
      this.players[player] = {
            x: i,
            y: 19
      };
   }
   console.log('players: ', this.players);
}

Game.prototype.createEl = function(x,y,type) {
   // create one tile.
  let el = document.createElement('div');
       
  // two class names: one for tile, one or the tile type.
  el.className = type;
  
  // set width and height of tile based on the passed-in dimensions.
  el.style.width = el.style.height = this.tileDim + 'px';
  
  // set left positions based on x coordinate.
  el.style.left = x*this.tileDim + 'px';
  
  // set top position based on y coordinate.
  el.style.top = y*this.tileDim + 'px';
      
  return el;
}
Game.prototype.placeSpriteGoal = function(type) {
  
   //localSocketID = 'eRvSIPbxf_cdLR6tAABP';
   let x;
   let y;
  // syntactic sugar

   x = this[type].x;
   y = this[type].y;
  
  // reuse the createTile function
  let sprite  = this.createEl(x,y,type);
  
  sprite.id = type;
  
  // set the border radius of the sprite.
  sprite.style.borderRadius = this.tileDim + 'px';
  
  // get half the difference between tile and sprite.
  
  // grab the layer
  let layer = this.el.querySelector('#sprites');
  
  layer.appendChild(sprite);
  
  return sprite;
}

//modified to place multiple players on the board
Game.prototype.placeSpritePlayer = function(type, playerID) {
  
   //localSocketID = 'eRvSIPbxf_cdLR6tAABP';
   let x;
   let y;

   x = this.players[playerID].x;
   y = this.players[playerID].y;
 
  // reuse the createTile function
  let sprite  = this.createEl(x,y,type);
  
  sprite.id = type;
  
  // set the border radius of the sprite.
  sprite.style.borderRadius = this.tileDim + 'px';
  
  // grab the layer
  let layer = this.el.querySelector('#sprites');
  
  layer.appendChild(sprite);
  
  return sprite;
}

 Game.prototype.sizeUp = function() {
  
  // inner container so that text can be below it
  let map  = this.el.querySelector('.game-map');
  
  // inner container, height. Need this.map
  map.style.height = this.map.length * this.tileDim + 'px';
   
  map.style.width = this.map[0].length * this.tileDim + 'px';
 }

 //socket emit to let server know the player's move
Game.prototype.movePlayer = function(event, playerID) {
  
  event.preventDefault();

  var x = this.players[playerID].x;
  var y = this.players[playerID].y;
  socket.emit("update-move",event.keyCode,localSocketID,roomID);
  console.log("Client says move made by: ", localSocketID);
}

Game.prototype.updatePosition = function(keyCode, playerID) {
   if (keyCode < 37 || keyCode > 40) {
      return;
  }
   switch (keyCode) {
   
        case 37:
        this.moveLeft(playerID);
        break;
        
        case 38:
        this.moveUp(playerID);
        break;
        
        case 39:
        this.moveRight(playerID);
        break;
       
        case 40:
        this.moveDown(playerID);
        break;
    }
}


//added socket call to let server to know there is a winner
//modified access methods for this.players
Game.prototype.checkGoal = function() {
  
    let body = document.querySelector('body');
  
    if (this.players[localSocketID].y == this.goal.y &&         
        this.players[localSocketID].x == this.goal.x) {
        body.className = 'success';
        console.log('game over');
        socket.emit('game-winner', roomID, localSocketID);
     }
     else {
        body.className = '';
     }
  
}
Game.prototype.keyboardListener = function() {
  
  document.addEventListener('keydown', event => {

      if(!gameOver){
         this.movePlayer(event, localSocketID);
         this.checkGoal();
      }
  });
}

/* movement helpers */
//modified the below 6 functions to allow multiple players
Game.prototype.moveLeft = function(playerID) {   
  
   if (this.players[playerID].x == 0) {
       return;
   }
  
   let nextTile = this.map[this.players[playerID].y][this.players[playerID].x - 1];
   if (nextTile == 1) {
       return;
   }
    
   this.players[playerID].x -=1;
   
   this.updateHoriz(playerID);
}
Game.prototype.moveUp = function(playerID) {    
  
   if (this.players[playerID].y == 0) {
        return;
   }
   let nextTile = this.map[this.players[playerID].y-1][this.players[playerID].x];
   if (nextTile ==1) {
        return;
   }
    
   this.players[playerID].y -=1;
   
   this.updateVert(playerID);
}
Game.prototype.moveRight = function(playerID) {   
  
   if (this.players[playerID].x == this.map[this.players[playerID].y].length - 1) {
        return;
   }
   let nextTile = this.map[this.players[playerID].y][this.players[playerID].x + 1];
        
   if (nextTile == 1) {
        return;
   }
    
   this.players[playerID].x +=1;
   
   this.updateHoriz(playerID);
}
Game.prototype.moveDown = function(playerID) {   
  
   if (this.players[playerID].y == this.map.length - 1) {
        return;
   }
   let nextTile = this.map[this.players[playerID].y+1][this.players[playerID].x];
  
   if (nextTile == 1) {
        return;
   }
    
   this.players[playerID].y +=1;
   
   this.updateVert(playerID);
}

/* dom update helpers */

Game.prototype.updateHoriz = function(playerID) {      
   this.players[playerID].el.style.left = this.players[playerID].x * this.tileDim+ 'px';    
};

Game.prototype.updateVert = function(playerID) {
   this.players[playerID].el.style.top = this.players[playerID].y * this.tileDim+ 'px'; 
};

// socket call for listening to opponent's moves
Game.prototype.listenOpponents = function (keyCode, playerID) {
   this.updatePosition(keyCode, playerID)
}


/* initialization */
let myGame;

function init() {
   myGame = new Game('game-container-1',levels[0]);
    
   myGame.populateMap();
   
   myGame.populatePlayers();
  
   myGame.sizeUp();
  
   myGame.placeSpriteGoal('goal');

   var count = 2;
   for(var playerID in playersList) {
      var type = 'player' + count;
      console.log('type: ', type)
      if(playerID != localSocketID){
         myGame.players[playerID].el = myGame.placeSpritePlayer(type, playerID);
         count += 1;
      }
   }
   myGame.players[localSocketID].el = myGame.placeSpritePlayer("player1", localSocketID);

   myGame.keyboardListener();
}

init();

//added by me
socket.on("opponent-update", (keyCode, playerID) => {
  myGame.listenOpponents(keyCode, playerID);
})