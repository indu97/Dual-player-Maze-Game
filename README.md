# Multi-Player Maze Game

## Introduction  
In this paper, we discuss a distributed systems implementation of a Maze Game as part of the project work for COMP 512, Advanced Operating Systems taught at Penn State Harrisburg. While there have been a number of maze games implemented to date, little of which will be discussed in section 1.5, this paper focuses on providing a distributed systems implementation of the classic maze game, using Javascript’s socket.io.

### 1.1 Problem Statement
Develop a distributed systems implementation of a Maze game, with the following rules:
• There will be a starting point and an ending point, which will be referred to as the ‘goal’ through the course of this paper.
• The maze has nn tiles, which can consist of ‘floors’ or ‘walls’.
• Players can pass through the tiles that are floor but not through the ones
that are walls.
• The goal is to reach the ending point in minimal time.
• A maximum of 4 players can join a single game, which will be referred to as
the ‘Room’ in the course of this paper.
• A player can either create a room or join an existing room.
• The player who creates a game will be referred to as the ‘Host’ in the course
of this paper.
• Both creating or joining a room will lead the player into a lobby, where they
wait for the host of the room to start the game.
• Only the host can start a game.
• Once the game starts in a room, no new player is allowed to join the room.
### 1.2 Approach to solution
The idea is to have a server client architecture that uses TCP to reliably communicate the moves made by the players to the server. The server then broadcasts the received 			‘move’ to all the players in the corresponding room, who then update each of their mazes accordingly. We have used Javascript’s socket.io, particularly socket.emit and 		socket.on calls in varied forms to broad- cast and to listen to the messages respectively. While the game logic happens within the client, the server is used for communication of the player’s moves. This architecture helped us in keeping the network traffic to the bare mini- mum, which consisted of as little as the keycode of the player’s move along with the room ID.
### 1.3 Motivation
This game idea has been inspired by two concepts. The first one is “Padma Vyuham”[1], a war formation strategy famous for being easy to get into but tricky to get out of(Just as 512’s project), which was used to surround the enemies from the Indian Mythology, “Mahabharatam”[2]. And the second is “Dangerous Dave”[3], a 1988 game by John Romero, the first ever video game we played.

### 1.4 Literature survey
Although “Gotcha (1973)”[4] is credited with being the first maze game, “Pac- Man (1980)”[5] is probably the most famous. However, the inspiration for this project came from “Dangerous Dave”[3], a 1988 game by John Romero. There have been various documentations on developing maze games, however, there’s been little work documented on developing Distributed Maze games. Thereby creating the scope for this project.

## 2 Design and Implementation details  
### 2.1 Which languages and why  
The greatest challenge we faced has been deciding the architecture of the project, majorly, which languages to work with and understanding the advan- tages and disadvantages each language posed. We had come to use HTML and CSS for creating a simple UI and Javascript for interactive functionalities such as moving the player around the maze, because it is platform independent, and has heavy documentation available[6][7][8]. The server-client communica- tion has also been written in Javascript. Javascript however, did not provide mechanisms to satisfy certain requirements, like obtaining the IP address. We have, therefore, used a simple python script to get the IP address and save it in a file, which is then read from the js scripts.  
### 2.2 TCP vs UDP  
Given the problem definition, the game requires clients to communicate their movements with the server after each keyboard event, so that they are reflected on all the players’ screens. The game, by requirement, cannot afford unreliable message passing. Therefore, Javascript’s socket.io was used for communication between server and clients.  
### 2.3 Client-Server communication model  
Client code uses a keyboard event listener to capture the moves made by the player, which is sent to the server, who then broadcasts it to every other player in the current room. Once the broadcasted move is received by the client, it updates the position of the respective player on its maze board.  
#### 2.3.1 Design decision  
Client code uses a keyboard event listener to capture the moves made by the player, which is sent to the server, who then broadcasts it to every other player in the current room. Once the broadcasted move is received by the client, it updates the position of the respective player on its maze board.  

  
## 3 Program workflow
### 3.1 UI flow
From UI perspective, The user will be landed on welcome page from where he can either choose to create a game room or join an existing game room. Both of which will lead the player into the lobby, where he will wait for the game to start. Only the host is allowed to start the game, upon which all the players are taken to the game screen.
### 3.2 Back-end flow
Below is a flowchart that describes the functionalities and connections between the javascript files.
<img width="597" alt="Screenshot 2024-06-16 at 6 57 40 PM" src="https://github.com/indu97/Dual-player-Maze-Game/assets/17349464/c28cbd57-f7d4-4c8d-aec4-e62189853d83">


## 4 Sample runs
Below is a screen capture of the game.The red bubble is the winner of the game in this screenshot, while the blue, purple and green represent the rest of the players.  
 <img width="599" alt="Screenshot 2024-06-16 at 6 59 25 PM" src="https://github.com/indu97/Dual-player-Maze-Game/assets/17349464/b7aafbda-6afe-4eb8-9f64-35c29b94f8a5">

## 5 Performance Evaluation
Majority of the data, like the game map and the calculations are done on the client’s side. The server’s responsibilities only include checking if a given room number already exists, communicating the player’s moves, and communicating the winner’s name to the corresponding room. Since the only messages passed around on the network are the keyboard moves, player IDs and the room IDs, the network traffic caused by this game is extremely low.

## 6 Conclusion
With respect to the game logic, this project can be extended to add multiple levels, and also can be extended to 3 dimensional maze space. We could add more properties such as monsters or breakable walls.However, with respect to distributed systems concepts, the current code will be able to handle most of the above extensions with little modifications.

 
## References
[1] Wikipedia contributors: Mahabharata — Wikipedia, The Free Encyclope- dia. [Online; accessed 13-April-2022] (2022). https://en.wikipedia.org/w/ index.php?title=Mahabharata&oldid=1079266245  
[2] Wikipedia contributors: Padmavyuha — Wikipedia, The Free Encyclo- pedia. https://en.wikipedia.org/w/index.php?title=Padmavyuha&oldid= 1066386172. [Online; accessed 13-April-2022] (2022)  
[3] Wikipedia contributors: Dangerous Dave — Wikipedia, The Free Ency- clopedia. https://en.wikipedia.org/w/index.php?title=Dangerous Dave& oldid=1078586673. [Online; accessed 13-April-2022] (2022)  
[4] Wikipedia contributors: Gotcha (video game) — Wikipedia, The Free Encyclopedia. https://en.wikipedia.org/w/index.php?title=Gotcha (video game)&oldid=1073432199. [Online; accessed 13-April-2022] (2022)  
[5] Wikipedia contributors: Pac-Man — Wikipedia, The Free Encyclopedia. https://en.wikipedia.org/w/index.php?title=Pac-Man&oldid= 1081301245. [Online; accessed 13-April-2022] (2022)  
[6] Karlsson, J.: Complete Guide To Node Client-Server Communication. https://medium.com/@joekarlsson/ complete-guide-to-node-client-server-communication-b156440c029 (2021)  
[7] Nevin, K.: Build a JavaScript, Part build-a-maze-game-with-vanilla-javascript-part-1-of-2-ddfd35e84e93 (2021)  
[8] WebDev, S.: Learn socket.io in 30 minutes. https://www.youtube.com/ watch?v=ZKEqqIO7n-k (2021)  
