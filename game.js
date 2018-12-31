const game = new Phaser.Game(800, 600, Phaser.CANVAS, '', {
  preload: preload,
  create: create,
  update: update
})

// Global variables
  let score = 0
  let scoreText
  let platforms
  let chocolates
  let cursors
  let player

  function preload () {
    // Load & Define our game assets
    game.load.image('sky', 'assets/sky.png')
    game.load.image('ground', 'assets/platform.png')
    game.load.image('chocolate', 'assets/chocolate.png')
    game.load.spritesheet('ninja', 'assets/ninja.png', 32, 48)
  }

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE)

  game.add.sprite(0, 0, 'sky')


  platforms = game.add.group()

  platforms.enableBody = true

  let ground = platforms.create(0, game.world.height - 64, 'ground')
  ground.scale.setTo(2, 2)
  ground.body.immovable = true

  let ledge = platforms.create(400, 450, 'ground')
  ledge.body.immovable = true

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

}

function update() {
  player.body.velocity.x = 0

  game.physics.arcade.collide(player, platforms)
  game.physics.arcade.collide(chocolates, platforms)
  game.physics.arcade.overlap(player, chocolates, collectChocolate, null, this)


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
}

function collectChocolate (player, chocolate) {
  chocolate.kill()

  score += 1
  scoreText.text = 'Chocolate Bars: ' + score
}

function restart() {
  create()
}
