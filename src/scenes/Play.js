class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    create() {
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)

        //parallax planets
        this.planets = this.add.tileSprite(0, 0, 640, 480, 'planets').setOrigin(0, 0)

        //green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0)
        //white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)

        //add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)

        //add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0)
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0)

        //add speedy ship
        this.fship = new Fastship(this, game.config.width + borderUISize*6, borderUISize*3.4, 'fastship', 0, 50).setOrigin(0, 0)

        //define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

        //initialize score
        this.p1Score = 0

        //display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig)

        //GAME OVER flag
        this.gameOver = false

        //60-second play clock
        scoreConfig.fixedWidth = 0
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart', scoreConfig).setOrigin(0.5)
            this.gameOver = true
        }, null, this)

        //display time
        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 140
        }
        this.timeLeft = this.add.text(borderUISize + borderPadding*40, borderUISize + borderPadding*2, this.clock, timeConfig)
    }

    update() {
        //check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart()
        }
        // Calculate remaining time in seconds
        let remainingTimeInSeconds = Math.ceil((this.clock.delay - this.clock.elapsed) / 1000);

        // Update the text to display remaining time
        this.timeLeft.setText('Time:' + remainingTimeInSeconds);


        this.starfield.tilePositionX -= 4
        this.planets.tilePositionX -= 2

        if(!this.gameOver) {
            this.p1Rocket.update()     
            this.ship01.update()
            this.ship02.update()
            this.ship03.update()
            this.fship.update()
        }

        //check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset()
            this.clock.delay += 5000
            this.shipExplode(this.ship03)
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset()
            this.clock.delay += 5000
            this.shipExplode(this.ship02)
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset()
            this.clock.delay += 5000
            this.shipExplode(this.ship01)
        }
        if (this.checkCollision(this.p1Rocket, this.fship)) {
            this.p1Rocket.reset()
            this.clock.delay += 5000
            this.shipExplode(this.fship)
        } 
        if (this.p1Rocket.y <= borderUISize * 3 + borderPadding + 1 && this.clock.delay >= 3000) { 
            this.clock.delay -= 3000
            this.p1Rocket.reset()
        }
        if (this.p1Rocket.y <= borderUISize * 3 + borderPadding + 1 && this.clock.delay <= 3000) { 
            this.clock.delay = 0
            this.p1Rocket.reset()

        }
        
    }

    checkCollision(rocket, ship) {
        //simple AABB checking
        if (rocket.x < ship.x + ship.width && 
          rocket.x + rocket.width > ship.x && 
          rocket.y < ship.y + ship.height &&
          rocket.height + rocket.y > ship. y) {
          return true
        } else {
          return false
        }
    }

    shipExplode(ship) {
        //temporarily hide ship
        ship.alpha = 0
        //create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode')
        boom.on('animationcomplete', () => {
          ship.reset()
          ship.alpha = 1
          boom.destroy()
        })
        //score add and text update
        this.p1Score += ship.points
        this.scoreLeft.text = this.p1Score
        
        let rng = Math.floor(Math.random() * 5) + 1;
        if (rng == 1) {
            this.sound.play('sfx-explosion')
        }
        else if (rng == 2) {
            this.sound.play('sfx-explosion2')
        }
        else if (rng == 3) {
            this.sound.play('sfx-explosion3')
        }
        else if (rng == 4) {
            this.sound.play('sfx-explosion4')
        }
        else if (rng == 5) {
            this.sound.play('sfx-explosion5')
        }
    }
}