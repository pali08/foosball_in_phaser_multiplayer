var config = {
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          debug: false
      }
  },
};
var bluePlayers;
var redPlayers;
var player;
var gameOver = false;
var keyW;
let keyS;
var ball;
const playerShift = 40;
const worldPlayerBoundaryDistance = 30;
const playerVelocity = 160;
const playerReductionRatio = 1 / 5;
const gateBarWidth = 9;
var scoreTextBlue;
var scoreTextRed;
var scoreBlue = 0;
var scoreRed = 0;
var gateBarBlue;
var gateBarRed;


var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
//var io = require('socket.io').listen(server);
var gamer_number = 0;

var gamers = {}

app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  // if (gamer_number > 1) {
  //   console.log('too many players')
  //   return
  // }
  console.log('a user connected');
  
  if (gamer_number == 0) { 
    console.log('gamer 0')
    gamers[socket.id] ={positions: [[playerShift, config.height / 2],
      [config.width / 4 + playerShift, config.height / 3],
      [config.width / 4 + playerShift, config.height * 2 / 3]],
      rotation: 90, gamerId: socket.id, gamerHRId: gamer_number, gamerColor: 'player_red'}
      // socket.emit('blueGamer', gamers)
      // socket.broadcast.emit('redGamer', gamers[socket.id])
  // gamer_number++;
  }
  if (gamer_number ==1) {
    console.log('gamer 1')
    gamers[socket.id] = {positions: [[config.width - playerShift, config.height / 2],
      [config.width * 3 / 4 - playerShift, config.height / 3],
      [config.width * 3 / 4 - playerShift, config.height * 2 / 3]],
      rotation: -90, gamerId: socket.id, gamerHRId: gamer_number, gamerColor: 'player_blue'}
      // socket.emit('redGamer', gamers)
      // socket.broadcast.emit('blueGamer', gamers[socket.id])
    }

      // send the players object to the new player
  socket.emit('currentGamer', gamers);
  // update all other players of the new player
  socket.broadcast.emit('newGamer', gamers[socket.id]);

  gamer_number++;

  socket.on('disconnect', function () {
    console.log('user is out');
    delete gamers[socket.id];
    gamer_number--;
    // emit a message to all players to remove this player
    // io.emit('disconnect', socket.id);
  });
});

server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});
