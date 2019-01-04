// let Game = {}
//
// Game.Boot = function(game) {
//
// }
//
// Game.Boot.prototype = {
//   init:function() {
//
//   }
// }

let Game = {

}

Game.MainMenu = function(game) {

}

let titlescreen
let title

Game.MainMenu.prototype = {
  preload: function() {
    // Load & Define our game assets
    game.load.image('sky', 'assets/sky.png')
    game.load.image('ground', 'assets/platform.png')
    game.load.image('chocolate', 'assets/chocolate.png')
    game.load.image('titlescreen', 'assets/titlescreen.png')
    game.load.image('button', 'assets/buttoncandy.png')
    game.load.image('background', 'assets/background2.png')
    game.load.image('starfield', 'assets/starfield.png')
    game.load.spritesheet('fire', 'assets/fire.png', 38, 36)
    game.load.spritesheet('ninja', 'assets/ninja.png', 32, 48)


    game.state.add('MainMenu', Game.MainMenu)
    game.state.add('Level1', Game.Level1)
    game.state.add('Level2', Game.Level2)
    game.state.add('Level3', Game.Level3)
    game.state.start('MainMenu')
    console.log(game.add)
  },

  create:function(game) {
    console.log(this)

    titlescreen = game.add.sprite(game.world.centerX, game.world.centerY - 192, 'titlescreen')
    titlescreen.anchor.setTo(0.5,0.5)

    title = game.add.text(game.world.centerY, 30, 'CHOCOLATE NINJA', {fontSize: '32px', fill: '#b1572c'})

    this.createButton(game, "PLAY", game.world.centerX, game.world.centerY + 32,
    249, 54, function() {
      game.state.start('Level1')
    })

    // let button1 = game.add.button(400, 400, 'button', () => {game.state.start('Level1')}, this, 2,1,0)
    // button1.anchor.setTo(0.5,1.1)
    // button1.scale.setTo(0.5,0.5)
    // console.log(game.world.centerX)
    let input = game.add.inputField(10, 90)
  },

  update:function(game) {

  },

   createButton:function(game, string, x, y, w, h, callback) {
    let button1 = game.add.button(x, y, 'button', callback, this, 2,1,0)

    button1.anchor.setTo(0.5,0.5)
    button1.width = w
    button1.height = h

    let txt = game.add.text(button1.x, button1.y, string, {font: "14px Arial",
    fill:"#fff", align:"center"})

    txt.anchor.setTo(0.5,0.5)
    console.log(button1)
    console.log(this)
  }

}

const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload: preload,
  init: function () {

        //Load the plugin
        this.game.phaserInput = this.game.plugins.add(PhaserInput.Plugin);
    }
})

  function preload () {
    game.state.add('MainMenu', Game.MainMenu)
    game.state.add('Level1', Game.Level1)
    game.state.add('Level2', Game.Level2)
    game.state.start('MainMenu')

    console.log(PhaserInput)
  }

  Game.Level1 = function(game) {

  }

  Game.Level1.prototype = {

    // Global variables
      score: 0,
      level: 1,
      scoreText: '',
      platforms: '',
      chocolates: '',
      cursors: '',
      player: '',
      fire: '',
      bg: '',
      starfield: '',

       firePositions: [
        {
          x: 140,
          y: 316
        },{
          x: 250,
          y: 505
        },{
          x: 490,
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


    this.firePositions.forEach(pos => {
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

    for(var i = 0; i < 4; i++) {
      let chocolate = chocolates.create(i * 210, 0, 'chocolate')
      chocolate.body.gravity.y = 1000
      chocolate.body.bounce.y = 0.3 + Math.random() * 0.2
    }

    scoreText = game.add.text(16, 16, 'Chocolate Bars: ' + this.score, {fontSize: '32px', fill: '#b1572c'})

    cursors = game.input.keyboard.createCursorKeys()

  },

   update:function() {
    player.body.velocity.x = 0

    game.physics.arcade.collide(player, platforms)
    game.physics.arcade.collide(chocolates, platforms)
    game.physics.arcade.overlap(player, chocolates, this.collectChocolate, null, this)
    game.physics.arcade.overlap(player, fires, this.killPlayer)



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

    if (this.score === 4 && this.level === 1) {
      alert('Level 1 Complete\nEnjoy all the dopamine from the chocolate!')
      console.log(this.score)
      this.level += 1
      game.state.start('Level2')
    } else if (this.score === 12  && this.level === 2) {
      alert('Level 2 Complete\nBe careful not to get a sugar overdose now!')
      this.level += 1
      game.state.start('Level3')
    } else if (this.score === 24 && this.level === 3) {
      alert('Level 3 Complete\nYou are the ultimate chocolate ninja!')
      game.state.start('MainMenu')
    }

  },

   killPlayer: (player, fire) => {
    alert('Game Over\nEat more chocolate to do better next time, ninja!')
    this.score = 0
    console.log(game)
    game.state.start('MainMenu')
  },

   collectChocolate:function(player, chocolate) {
    chocolate.kill()
    this.score += 1
    scoreText.text = 'Chocolate Bars: ' + this.score
  },

  // restart: () => {
  //   game.state.start('Level1')
  // }

  }

  Game.Level2 = function(game) {

  }

  Game.Level2.prototype = {

    // Global variables
      score: 4,
      level: 2,
      scoreText: '',
      platforms: '',
      chocolates: '',
      cursors: '',
      player: '',
      fire: '',

       firePositions: [
        {
          x: 160,
          y: 316
        },{
          x: 270,
          y: 505
        },{
          x: 470,
          y: 416
        }
      ],

      self: this,

   create:function() {

    game.physics.startSystem(Phaser.Physics.ARCADE)

    game.stage.backgroundColor = '#000000';

    this.bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    this.bg.fixedToCamera = true;

    platforms = game.add.group()

    platforms.enableBody = true

    let ground = platforms.create(0, game.world.height - 64, 'ground')
    ground.scale.setTo(2, 2)
    ground.body.immovable = true

    let ledge = platforms.create(400, 450, 'ground')
    ledge.body.immovable = true

    fires = game.add.group()
    fires.enableBody = true


    this.firePositions.forEach(pos => {
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

    for(var i = 0; i < 8; i++) {
      let chocolate = chocolates.create(i * 102, 0, 'chocolate')
      chocolate.body.gravity.y = 1000
      chocolate.body.bounce.y = 0.3 + Math.random() * 0.2
    }

    scoreText = game.add.text(16, 16, 'Chocolate Bars: ' + this.score, {fontSize: '32px', fill: '#b1572c'})

    cursors = game.input.keyboard.createCursorKeys()

  },

   update:function() {
    player.body.velocity.x = 0

    game.physics.arcade.collide(player, platforms)
    game.physics.arcade.collide(chocolates, platforms)
    game.physics.arcade.overlap(player, chocolates, this.collectChocolate, null, this)
    game.physics.arcade.overlap(player, fires, this.killPlayer)



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

    if (this.score === 4 && this.level === 1) {
      alert('Level 1 Complete\nThe chocolate has released dopamin for you!')
      console.log(this.score)
      this.level += 1
      game.state.start('Level2')
    } else if (this.score === 12  && this.level === 2) {
      alert('Level 2 Complete\nBe careful not to get a sugar overdose now!')
      this.level += 1
      game.state.start('Level3')
    } else if (this.score === 24 && this.level === 3) {
      alert('Level 3 Complete\nYou are the ultimate chocolate ninja!')
      game.state.start('MainMenu')
    }

  },

   killPlayer: (player, fire) => {
    alert('Game Over\nEat more chocolate to do better next time, ninja!')
    this.score = 0
    console.log(game)
    game.state.start('MainMenu')
  },

   collectChocolate:function(player, chocolate) {
    chocolate.kill()
    this.score += 1
    scoreText.text = 'Chocolate Bars: ' + this.score
  },

  // restart: () => {
  //   game.state.start('Level1')
  // }

  }

  Game.Level3 = function(game) {

  }

  Game.Level3.prototype = {

    // Global variables
      score: 12,
      level: 3,
      scoreText: '',
      platforms: '',
      chocolates: '',
      cursors: '',
      player: '',
      fire: '',

       firePositions: [
        {
          x: 243,
          y: 316
        },{
          x: 290,
          y: 505
        },{
          x: 443,
          y: 416
        }
      ],

      self: this,

   create:function() {

    game.physics.startSystem(Phaser.Physics.ARCADE)

    this.starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    platforms = game.add.group()

    platforms.enableBody = true

    let ground = platforms.create(0, game.world.height - 64, 'ground')
    ground.scale.setTo(2, 2)
    ground.body.immovable = true

    let ledge = platforms.create(400, 450, 'ground')
    ledge.body.immovable = true

    fires = game.add.group()
    fires.enableBody = true


    this.firePositions.forEach(pos => {
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

    scoreText = game.add.text(16, 16, 'Chocolate Bars: ' + this.score, {fontSize: '32px', fill: '#b1572c'})

    cursors = game.input.keyboard.createCursorKeys()

  },

   update:function() {
    this.starfield.tilePosition.y += 1;
    player.body.velocity.x = 0

    game.physics.arcade.collide(player, platforms)
    game.physics.arcade.collide(chocolates, platforms)
    game.physics.arcade.overlap(player, chocolates, this.collectChocolate, null, this)
    game.physics.arcade.overlap(player, fires, this.killPlayer)



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

    if (this.score === 4 && this.level === 1) {
      alert('Level 1 Complete\nThe chocolate has released dopamin for you!')
      console.log(this.score)
      this.level += 1
      game.state.start('Level2')
    } else if (this.score === 12  && this.level === 2) {
      alert('Level 2 Complete\nBe careful not to get a sugar overdose now!')
      this.level += 1
      game.state.start('Level3')
    } else if (this.score === 24 && this.level === 3) {
      alert('Level 3 Complete\nYou are the ultimate chocolate ninja!')
      game.state.start('MainMenu')
    }

  },

   killPlayer: (player, fire) => {
    alert('Game Over\nEat more chocolate to do better next time, ninja!')
    this.score = 0
    console.log(game)
    game.state.start('MainMenu')
  },

   collectChocolate:function(player, chocolate) {
    chocolate.kill()
    this.score += 1
    scoreText.text = 'Chocolate Bars: ' + this.score
  },

  // restart: () => {
  //   game.state.start('Level1')
  // }

  }
