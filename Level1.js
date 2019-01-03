let Game = {}
Game.Level1 = function(game) {

}

Game.Level1.prototype = {

  // Global variables
    score: 0,
    scoreText: '',
    platforms: '',
    chocolates: '',
    cursors: '',
    player: '',
    fire: '',

     firePositions: [
      {
        x: 246,
        y: 316
      },{
        x: 250,
        y: 505
      },{
        x: 440,
        y: 416
      }
    ],

 create:function() {

  game.physics.startSystem(Phaser.Physics.ARCADE)

  game.add.sprite(0, 0, 'sky')


  platforms = game.add.group()

  platforms.enableBody = true

  let ground = platforms.create(0, game.world.height - 64, 'ground')
  ground.scale.setTo(2, 2)
  ground.body.immovable = true

  let ledge = platforms.create(400, 450, 'ground')
  ledge.body.immovable = true

  fires = game.add.group()
  fires.enableBody = true


firePositions.forEach(pos => {
  fires.create(pos.x, pos.y, 'fire')
})

  ledge = platforms.create(-75, 350, 'ground')
  ledge.body.immovable = true

  player = game.add.sprite(32, game.world.height - 150, 'ninja')
  game.physics.arcade.enable(player)
  player.body.bounce.y = 0.2
  player.body.gravity.y = 800
  player.body.collideWorldBounds = true

  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);


  chocolates = game.add.group()
  chocolates.enableBody = true

  for(var i = 0; i < 12; i++) {
    let chocolate = chocolates.create(i * 70, 0, 'chocolate')
    chocolate.body.gravity.y = 1000
    chocolate.body.bounce.y = 0.3 + Math.random() * 0.2
  }

  scoreText = game.add.text(16, 16, '', {fontSize: '32px', fill: '#b1572c'})

  cursors = game.input.keyboard.createCursorKeys()

},

 update:function() {
  player.body.velocity.x = 0

  game.physics.arcade.collide(player, platforms)
  game.physics.arcade.collide(chocolates, platforms)
  game.physics.arcade.overlap(player, chocolates, collectChocolate, null, this)
  game.physics.arcade.overlap(player, fires, killPlayer)



  if (cursors.left.isDown) {
    player.body.velocity.x = -150
    player.animations.play('left')
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 150
    player.animations.play('right')
  } else {
    player.animations.stop()
}

  if(cursors.up.isDown && player.body.touching.down) {
    player.body.velocity.y = - 400
  }

  if (score === 12) {
    alert('You are the ultimate chocolate ninja!\nBe careful not to get a sugar overdose now!')
    score = 0
    restart()
  }
},

 killPlayer:function(player, fire) {
  alert('Game Over\nEat more chocolate to do better next time, ninja!')
  score = 0
  restart()
},

 collectChocolate:function(player, chocolate) {
  chocolate.kill()

  score += 1
  scoreText.text = 'Chocolate Bars: ' + score
},

restart:function() {
  this.create()
}

}
