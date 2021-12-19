// Setup
var screenX = 320;
var screenY = 450;

// Color
var translucent = "rgba(0, 0, 0, 0.3)";

// Statistics
var frame = 0;
var score = 0;
var dead = false;

// Physics
var gravity = 0;

// Bird
var birdSizeX = 32;
var birdSizeY = 32;
var birdPositionX = screenX / 8;
var birdPositionY = screenY / 2;
var birdvelocity = 0;

// Pipe
var pipeAmount = 0;
var pipePositions = [];
var pipeShift = [];
var pipeSizeX = 26;
var pipeSizeY = 225;
var pipeGap = 200;
var pipeGaps = [];

function gameStart(setupLoop) {
  // When the player jumps
  document.getElementById("game").addEventListener("click", function() {
    if (!dead) {
      gravity = 0.1;
      birdvelocity = 2;
    } else {
      replay();
    }
  });

  console.log("Game Start...");
  
  // Create bird
  var bird = document.createElement("img");
  bird.src = "content/flappy_bird.png";
  bird.id = "bird";
  document.getElementById("game").appendChild(bird);

  setBirdPosition(birdPositionX, birdPositionY);
  
  document.getElementById("game").style.backgroundColor = "#0094ca";
  
  createPipe(0);
  createPipe(128);
  createPipe(256);
  
  // UI
  var scoreLabel = document.createElement("div");
  scoreLabel.id = "scoreLabel";
  scoreLabel.innerText = "Score: 0";
  scoreLabel.style.color = "white";
  scoreLabel.style.margin = "4px";
  scoreLabel.style.padding = "4px";
  scoreLabel.style.borderRadius = "4px";
  scoreLabel.style.backgroundColor = translucent;
  document.getElementById("game").appendChild(scoreLabel);
  
  // Setup game loop
  if (setupLoop) {
    setInterval(function() {
      if (!dead) {
        frame++;
        gameLoop();
      }
    }, 10);
  }
}

function gameLoop() {
  birdvelocity += -gravity;
  
    if (frame % 1280 == 0) {
      pipeGap -= 20;
    }
    
    score = Math.round(frame / (128 + (pipeSizeX)));
    
    // Update UI
    document.getElementById("scoreLabel").innerText = `Score: ${score}`;
    
    movePipes();
    
    // Check pipe collisions
    for (var i = 0; i < pipeAmount; i++) {
      if (pipePositions.length > 0) {
        // Check left
        if (birdPositionX + birdSizeX >= pipePositions[i]) {
          // Check right
          if (birdPositionX <= pipePositions[i] + pipeSizeX) {
            // Top pipe
            if (birdPositionY - birdSizeY <= (pipeGaps[i] / 2) - pipeShift[i]) {
              gameEnd();
            } else if (birdPositionY + birdSizeY >= (screenY / 2) + (pipeGaps[i] / 2) + pipeShift[i]) { // Bottom pipe
              gameEnd();
            }
          }
        }
      }
    }
    
    // Cap physics
    birdvelocity = Math.min(Math.max(birdvelocity, -30), 30);
    
    // Check collisions
    if (checkCollision(birdPositionY)) {
      birdPositionY = birdPositionY - birdvelocity;
    } else {
      gameEnd();
    }
    
    setBirdPosition(birdPositionX, birdPositionY);
}

function setPosition(id, positionX, positionY, sizeX=null, sizeY=null) {
  var style = document.getElementById(id).style;
  style.left = `${positionX}px`;
  style.top = `${positionY}px`;

  if (sizeX != null && sizeY != null) {
    style.width = `${sizeX}px`;
    style.height = `${sizeY}px`;
  }
}

function setBirdPosition(x, y) {
  setPosition("bird", x, y, birdSizeX, birdSizeY);
}

function checkCollision(y) {
  if (y < 0 - birdSizeY) {
    return false;
  } else if (y > screenY - birdSizeY) {
    return false;
  } else {
  return true;
  }
}

function gameEnd() {
  if (!dead) {
    var gameOverLabel = document.createElement("div");
    gameOverLabel.id = "gameOverLabel";
    gameOverLabel.innerText = "Game Over );";
    gameOverLabel.style.color = "red";
    gameOverLabel.style.margin = "4px";
    gameOverLabel.style.padding = "4px";
    gameOverLabel.style.borderRadius = "4px";
    gameOverLabel.style.backgroundColor = translucent;
    document.getElementById("game").appendChild(gameOverLabel);
    
    birdvelocity = 0;
    dead = true;
  }
}

function replay() {
  birdvelocity = 0;
  birdPositionY = screenY / 2;
  setBirdPosition(birdPositionX, birdPositionY);

  document.getElementById("gameOverLabel").remove();
  document.getElementById("bird").remove();
  document.getElementById("scoreLabel").remove();
  
  // Reset pipes
  for(var i = 0; i < pipeAmount; i++) {
    document.getElementById(`pipe_top_${i}`).remove();
    document.getElementById(`pipe_bottom_${i}`).remove();
  }
  pipeAmount = 0;
  pipePositions = [];
  pipeShift = [];
  pipeGap = 200;
  pipeGaps = [];
  
  score = 0;
  frame = 0;
  
  gameStart(false);
  
  dead = false;
}

function movePipes() {
  for (var i = 0; i < pipePositions.length; i++) {
    var top_id = "pipe_top_" + i;
    var bottom_id = "pipe_bottom_" + i;
    
    var x = pipePositions[i] - 1;
    
    // Move back onto the screen
    if (x < -(pipeSizeX + 32)) {
      x = screenX + pipeSizeX;
      pipeShift[i] = Math.round(Math.random(-50, 50));
      pipeGaps[i] = pipeGap;
    }
    
    setPosition(top_id, x, (screenY / 2) - pipeSizeY - (pipeGaps[i] / 2) + pipeShift[i], pipeSizeX, pipeSizeY);
    setPosition(bottom_id, x, (screenY / 2) + (pipeGaps[i] / 2) + pipeShift[i], pipeSizeX, pipeSizeY);
    
    pipePositions[i] = x;
  }
}

// Creates a top and bottom pipe
function createPipe(shiftX) {
  // Create top pipe
  var top_pipe = document.createElement("img");
  top_pipe.src = "content/pipe_top.png";
  top_pipe.id = "pipe_top_" + pipeAmount;
  document.getElementById("game").appendChild(top_pipe);

  // Create bottom pipe
  var bottom_pipe = document.createElement("img");
  bottom_pipe.src = "content/pipe_bottom.png";
  bottom_pipe.id = "pipe_bottom_" + pipeAmount;
  document.getElementById("game").appendChild(bottom_pipe);
  
  var x = screenX - pipeSizeX + shiftX;
  
  var shiftY = Math.round(Math.random(-50, 50));
  
  // Set position
  setPosition(top_pipe.id, x,(screenY / 2) - pipeSizeY - (pipeGap / 2) - shiftY, pipeSizeX, pipeSizeY);
  setPosition(bottom_pipe.id, x,(screenY / 2) + (pipeGap / 2) + shiftY, pipeSizeX, pipeSizeY);
  
  pipePositions.push(x);
  pipeShift.push(shiftY);
  pipeGaps.push(pipeGap);
  
  pipeAmount++;
}
