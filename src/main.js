//Name: Alan Lu
//Title: Rocket Patrol Winter DLC: Interstellar
//Time Worked: 8
//Mods: 
// Create a new scrolling tile sprite for the background (1 point)
// Create 4 new explosion effects and randomize which one plays on impact (3 points)
// Display the time remaining in seconds on the screen (3 points)
// Implement parallax scrolling for the background (3 points)
// Create a new enemy spaceship type (w/ new artwork) thats smaller, moves faster, and is worth more points (5 points)
// Implement a new timing/scoring mechanism that adds time for successful hits and subtracts time on misses (5 points)


let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config)

//set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3

//reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT