var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  } 
};
const playerReductionRatio = 1 / 5;
var game = new Phaser.Game(config);
function preload() {
  this.load.image('playground', 'assets/playground.jpeg');
  this.load.image('player_blue', 'assets/player_blue.png');
  this.load.image('player_red', 'assets/player_red.png');
  this.load.image('ball', 'assets/ball.png');
  this.load.image('gate_bar', 'assets/gate_bar.jpeg');
}
function create() {
  var self = this;
  console.log('gamerId:')
  this.socket = io();
  this.socket.on('currentGamer', function (gamers) {
    Object.keys(gamers).forEach(function (id) {
        console.log('player was created')
      console.log(gamers[id].gamerId)
      console.log(self.socket.id)
      // createPlayers(self, self.socket.id)
      if (gamers[id].gamerId === self.socket.id) {
        //addPlayer(self, players[id]);
        createPlayers(self, gamers[id])
        var first_gamer_id = gamers[id]
      }
      else {
        createPlayers(self, gamers[id])
        }
      });
    })
    this.socket.on('newGamer', function (gamerInfo) {
      createOtherPlayers(self, gamerInfo);
    });
    this.socket.on('disconnect', function (gamerId) {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (gamerId === otherGamer.gamerId) {
          otherPlayer.destroy();
        }
      });
    });
    // console.log('gamerId:' + gamers[socket.id].gamerId);
    // console.log('socketId:' + self.socket.id);
    // console.log('gamer HR Id:'+ gamers[socket.id].gamerHRId)
    // if(gamers[socket.id].gamerId === self.socket.id && gamers[socket.id].gamerHRId === 0) {
    //   console.log('red player')
    //   createPlayers(self, gamers[id])
    // }
    // if(gamers[socket.id].gamerId === self.socket.id && gamers[socket.id].gamerHRId === 1) {
    //   console.log('blue player')
    //   createPlayers(self, gamers[id])
    // }
}
function update() {}

function createPlayers(self, gamerInfo) {
  var imageName = gamerInfo.gamerColor;
  var positions = gamerInfo.positions;
  var rotation = gamerInfo.rotation;
  var players = self.physics.add.group();
  for (var i = 0; i < positions.length; ++i) {
      var player = self.physics.add.sprite(positions[i][0], positions[i][1], imageName);
      player.displayHeight = player.height * playerReductionRatio;
      player.displayWidth = player.width * playerReductionRatio;
      player.angle = player.angle + rotation;
      players.add(player);
      player.setImmovable();
      //players.setCollideWorldBounds(true);
  }
  players.onWorldBounds = false;
  return players;
}
function createOtherPlayers(self, gamerInfo) {
  var imageName = gamerInfo.gamerColor;
  var positions = gamerInfo.positions;
  var rotation = gamerInfo.rotation;
  var players = self.physics.add.group();
  for (var i = 0; i < positions.length; ++i) {
      var player = self.physics.add.sprite(positions[i][0], positions[i][1], imageName);
      player.displayHeight = player.height * playerReductionRatio;
      player.displayWidth = player.width * playerReductionRatio;
      player.angle = player.angle + rotation;
      players.add(player);
      player.setImmovable();
      //players.setCollideWorldBounds(true);
  }
  players.onWorldBounds = false;
  //self.otherPlayer.add(players)
  return players;
}

