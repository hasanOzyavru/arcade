// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    let randomNumber = Math.floor(Math.random()*3);
    let randomPositionY = [62, 145, 228][randomNumber]; // Select one of the 3 positions randomly
    this.x = 0;                                         // enemy always starts from left
    this.y = randomPositionY;                           // enemy starts from randomly selected y position
    this.speed = Math.random()*100+100;                 // enemy created has random speed
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += dt * this.speed;                          // Once created, enemy move in +x direction
                                                        // based on time elapsed and speed assigned. 
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x>505) {                                   // To prevent allEnemies array not to grow up
        allEnemies.splice(0,1);                         // disappearing enemy is removed from array
    }
    player.collisionYes(allEnemies);                    // Function for player enemy collision check and act
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    Enemy.call(this,this.x,this.y);                     // Player inherits the constructor from Enemy
    this.sprite = 'images/char-boy.png';
    this.counter = 0;                                   // new attribute of player, number of moves in
}                                                       // enemy zone, reset if game over or if returned
                                                        // back to safe area
Player.prototype = Object.create(Enemy.prototype);      // Player adds Enemy prototype into its chain

let moveX = 202;
let moveY = 319;                                        //initial location for player

Player.prototype.update = function() {                  //update player position
    this.x = moveX;
    this.y = moveY;
    player.ifGameOver();                                //check and act if game is over
}

Player.prototype.collisionYes = function (objArray) {   //check and act if one of the enemies hit player
    for (obj of objArray) {
        if (Math.abs(this.x-obj.x)<50 && Math.abs(this.y-obj.y)<50) {
            moveX = 202;                                //move to original position
            moveY = 319;
            this.counter = 0;                           //reset move counter
            moveDisplay.textContent = this.counter;     
        }
    }
    
}
let isGameOver = false;                                 //this is to disable arrow keys when game is over
Player.prototype.ifGameOver = function (){              //when target is reached with no hit
    if (this.y<5) {
        moveX = 202;                                    //player to original position
        moveY = 319;
        clearInterval(clr);                             //stop creating enemies
        isGameOver = true;
        allEnemies.splice(0,allEnemies.length);         //clear allEnemies array
        player.displayResult();                         //display the result
    }    
}

Player.prototype.handleInput = function(keyPressed) {
    if (!isGameOver){                                   //if game goes on keys are active
        switch (keyPressed) {                           //move player to a new location based on arrow
            case 'up' :                                 //key pressed
                if (this.y > 50) {
                    moveY -= 83;
                }           
                break;
            case 'down' :
                if (this.y < 400) {
                    moveY += 83;
                }
                break;
            case 'left' : 
                if (this.x > 0) {
                    moveX -= 101;
                }
                break;
            case 'right' :
                if (this.x < 400) {
                    moveX += 101;
                }
        } 
        if (moveY > 50 && moveY < 250) {                //counter is active only in dangerous zone
            moveDisplay.textContent = player.moveCounter();
         } else if (moveY>250){                         //counter resets if player returns without reaching
            this.counter = 0;                           //target
            moveDisplay.textContent = this.counter;
        }
    }
    
};

Player.prototype.moveCounter = function() {             //counts the moves in dangerous zone
    return this.counter += 1; 
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const comboLevel = document.querySelector("#level");    //level of difficulty is selected
if (window.name === "") {window.name = 1000;}
comboLevel.onchange = function () {                     //window.name stores the selected time
    if (comboLevel.selectedIndex === 1) {               //to be available in next start
        window.name = 750;
    }else if (comboLevel.selectedIndex === 2){
        window.name = 2000;
    }else {
        window.name = 1000;
    }
}

if (window.name === "750") {                            //next start will display the last saves 
    comboLevel.options[1].selected = true;              //difficulty level
} else if (window.name === "2000"){
    comboLevel.options[2].selected = true;
}


var allEnemies = [];                                    //enemies are created and stored in an array
var clr = setInterval(function(){
    var enemy = new Enemy();
    allEnemies.push(enemy);
}, window.name);

var player = new Player();                              //a player is created

const moveDisplay = document.querySelector(".moves");   //display number of moves in dangerous zone
let numberOfMoves = 0;


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

const restartGame = document.querySelector(".restart");     //Restart by restart button
restartGame.addEventListener("click", function(){ 
    document.location.href = "";
});

const yesRestartGame = document.querySelector(".yes");      //Restart by pressing Yes on modal 
yesRestartGame.addEventListener("click", function(){
    document.location.href = "";
});

const noRestartGame = document.querySelector(".no");        //No to restart request
noRestartGame.addEventListener("click", function(){
    const modal = document.querySelector(".modal");
    modal.className ="modal";
});

Player.prototype.displayResult = function() {               //Display the result 
    const declareResult = document.querySelector(".score-move");
    declareResult.textContent = `CONGRATULATIONS! You have made ${this.counter} moves 
    without collision and reach the target`;
    const modal = document.querySelector(".modal");
    modal.className ="modal open";
}

