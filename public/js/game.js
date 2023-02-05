var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      //gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  } 
};
const playerReductionRatio = 1 / 5;
var currentPlayers;
let cursors
const worldPlayerBoundaryDistance = 30;
const playerVelocity = 160;
var game = new Phaser.Game(config);
function preload() {
  this.load.image('playground', 'assets/playground.jpeg');
  this.load.image('player_blue', 'assets/player_blue.png');
  this.load.image('player_red', 'assets/player_red.png');
  this.load.image('ball', 'assets/ball.png');
  this.load.image('gate_bar', 'assets/gate_bar.jpeg');
}
function create() {
  cursors = this.input.keyboard.createCursorKeys();
  var self = this;
  var otherGamerPlayers;
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
        currentPlayers = createPlayers(self, gamers[id])
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
}

function update() {
  //handleKeyboardInput()
  cursors = this.input.keyboard.createCursorKeys();
  handleKeyboardInput(cursors.up, cursors.down, currentPlayers);
  // handleKeyboardInput(keyW, keyS, bluePlayers);
}

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
      // players.setCollideWorldBounds(true);
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
  self.otherGamerPlayers = players
  return players;
}

function handleKeyboardInput(cursorsUp, cursorsDown, players) {
  if (cursorsUp.isDown
      // https://phaser.discourse.group/t/how-do-i-make-a-group-collide-with-world-bounds/2448
      // I tried to set boundaries by //player.body.setCollideWorldBounds(true);
      // but it does set bonds to individual members of group - i.e. first player hits edge, but others
      // are still moving until they hit edge too
      // additional note: setColliderWorldBounds need to be set AFTER player is added to group
      && players.getChildren()[1].y > worldPlayerBoundaryDistance
  ) {
      players.setVelocityY(-playerVelocity);
  }
  else if (cursorsDown.isDown
      && players.getChildren()[2].y < config.height - worldPlayerBoundaryDistance
  ) {
      players.setVelocityY(playerVelocity);
  }
  else if (cursorsUp.isUp) {
      console.log(typeof(players) == null)
      console.log(typeof(players))
      players.setVelocityY(0);
  }
   else if (cursorsDown.isUp) {
       players.setVelocityY(0);
   }

}
