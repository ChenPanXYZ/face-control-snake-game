const log = console.log
let game
let test
let startButton
let restartButton
let face
let direction
let loading
let gameover


let stateCheck = setInterval(() => {
  if (document.readyState === 'complete' && direction) {
    clearInterval(stateCheck)
    startButton = document.getElementById("start-button")
    restartButton = document.getElementById("restart-button")
    loading = document.getElementById("loading")
    gameover = document.getElementById("gameover")
    loading.style.display = "block"
    startButton.style.display = "block"
    loading.style.display = "none"
    game = new Game()

    startButton.addEventListener("click", function(){ 
      game.start()
      restartButton.style.display = "none"
      startButton.style.display = "none"
    })

    restartButton.addEventListener("click", function(){ 
      game = new Game()
      game.start()
      restartButton.style.display = "none"
      gameover.style.display = "none"
    })
  }
}, 100);

class Game {
  constructor() {
    this.canvas = document.getElementById("game-box")
    this.ctx = this.canvas.getContext("2d")

    // Screens
    this.gameArea = document.getElementById("game-box")
    

    this.snake = []

    this.snakeNextDirection = 1

    this.snakeDirection


    this.snakeSpeed = 150 //defaultSpeed

    this.food = {x: 0, y: 0}

    this.score

    this.wall

    this.scoreElement = document.getElementById("score-value");


  }

  showScreen(option) {
    switch(option) {
      case 0: this.gameArea.style.display = "block"
    }
  }

  changeScore(value) {
    this.scoreElement.innerHTML = String(value)
  }

  addFood() {
    this.food.x = Math.floor(Math.random() * ((this.canvas.width / 10) - 1));
    this.food.y = Math.floor(Math.random() * ((this.canvas.height / 10) - 1));
    for(let i = 0; i < this.snake.length; i++){
        if(this.checkBlock(this.food.x, this.food.y, this.snake[i].x, this.snake[i].y)){
            this.addFood();
        }
    }
  }

  checkBlock(x, y, _x, _y) {
    return ((_x-1) <= x && x <= (_x+1) && (_y-1) <= y && y <= (_y+1)) ? true : false;
  }

  changeDirection(key) {
    if(key == 38 && this.snakeDirection != 2){
      this.snakeNextDirection = 0;
    }
    else{
      if (key == 39 && this.snakeDirection != 3){
        this.snakeNextDirection = 1;
      }
      else{
        if (key == 40 && this.snakeDirection != 0){
          this.snakeNextDirection = 2;
        }
        else{
          if(key == 37 && this.snakeDirection != 1){
            this.snakeNextDirection = 3;
          } 
        } 
      } 
    }
  }


  activeDot(x, y){
    this.ctx.fillStyle = "#4D5139";
    this.ctx.fillRect(x * 10, y * 10, 10, 10);
  }



  running() {

    document.body.addEventListener("keydown", e => {
      e = e || window.event;
      this.changeDirection(e.keyCode)
    })



    let _x = this.snake[0].x
    let _y = this.snake[0].y
    this.snakeDirection = this.snakeNextDirection

    // In the future I might allow the users to choose to control snake by face or kekboard, but for now, only face control is supported.

    // switch(this.snakeDirection){
    //   case 0: _y--; break;
    //   case 1: _x++; break;
    //   case 2: _y++; break;
    //   case 3: _x--; break;
    // }
    let dir_x = direction['x'] - 320;
    let dir_y = direction['y'] - 320;
    let length = Math.sqrt(Math.pow(dir_x,2) + Math.pow(dir_y,2));
    dir_x = dir_x / length;
    dir_y = dir_y / length;
    _x += -dir_x;
    _y += dir_y;
    this.snake.pop();
    this.snake.unshift({x: _x, y: _y});


    if (this.snake[0].x < 0 || this.snake[0].x > this.canvas.width / 10 || this.snake[0].y < 0 || this.snake[0].y > this.canvas.height / 10){
      gameover.style.display = "block"
      restartButton.style.display = "block"
      return
    }


    if(this.checkBlock(this.snake[0].x, this.snake[0].y, this.food.x, this.food.y)){
      this.snake[this.snake.length] = {x: this.snake[0].x, y: this.snake[0].y};
      this.score += 1;
      this.changeScore(this.score);
      this.addFood();
      this.activeDot(this.food.x, this.food.y);
    }

    this.ctx.beginPath()
    this.ctx.fillStyle = "#fffffb"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    for(let i = 0; i < this.snake.length; i++){
      this.activeDot(this.snake[i].x, this.snake[i].y);
    }
    
    
    this.activeDot(this.food.x, this.food.y);


    setTimeout(this.running.bind(this), this.snakeSpeed)
  }

  start() {
    log("Game is now on!")
    this.showScreen(0)
    this.gameArea.focus()
    for(let i = 4; i >= 0; i--) {
      this.snake.push({x: i, y: 15});
    }
    log(this.snake)

    this.snakeNextDirection = 1

    this.score = 0

    this.changeScore(this.score)
    
    this.addFood();

    this.canvas.addEventListener("keydown", event => {
      if (event.isComposing || event.keyCode === 229) {
        return;
      }
    });

   this.running()

  }
}

let video
let poseNet
let poses = []
let skeletons = []

function setup() {
    let cnv =createCanvas(640, 480)
    cnv.class("face-detector")
    cnv.id("face-detector")
    video = createCapture(VIDEO)
    video.size(width, height)
    
    // Create a new poseNet method with a single detection
    poseNet = ml5.poseNet(video, modelReady);
    // This sets up an event that fills the global variable "poses"
    // with an array every time new poses are detected
    poseNet.on('pose', function (results) {
      if(results[0]) {
        poses = results;
        direction = poses[0].pose.keypoints[0].position;
        //console.log(direction['x']);
      }
    })
    // Hide the video element, and just show the canvas
    video.hide()
}

function modelReady() {
    console.log("Model Loaded!");
}

function draw() {
    image(video, 0, 0, width, height);

    // We can call both functions to draw all keypoints and the skeletons
    //drawKeypoints();
    //drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {if (window.CP.shouldStopExecution(0)) break;
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {if (window.CP.shouldStopExecution(1)) break;
        // A keypoint is an object describing a body part (like rightArm or leftShoulder)
        let keypoint = poses[i].pose.keypoints[j];
        // Only draw an ellipse is the pose probability is bigger than 0.2
        if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
        }
    }window.CP.exitedLoop(1);
    }window.CP.exitedLoop(0);
}

// A function to draw the skeletons
function drawSkeleton() {
    // Loop through all the skeletons detected
    for (let i = 0; i < poses.length; i++) {if (window.CP.shouldStopExecution(2)) break;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < poses[i].skeleton.length; j++) {if (window.CP.shouldStopExecution(3)) break;
        let partA = poses[i].skeleton[j][0];
        let partB = poses[i].skeleton[j][1];
        stroke(255, 0, 0);
        line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }window.CP.exitedLoop(3);
    }window.CP.exitedLoop(2);
}