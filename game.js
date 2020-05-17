const log = console.log
let game
let test
let startButton
let restartButton


let stateCheck = setInterval(() => {
  if (document.readyState === 'complete') {
    clearInterval(stateCheck);
    console.log("loaded")
    game = new Game()
    startButton = document.getElementById("start-button")
    restartButton = document.getElementById("restart-button")

    startButton.addEventListener("click", function(){ 
      game.start()
      restartButton.style.display = "none"
      startButton.style.display = "none"
    })

    restartButton.addEventListener("click", function(){ 
      game = new Game()
      game.start()
      restartButton.style.display = "none"
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


    this.snakeSpeed = 100 //defaultSpeed

    this.food = {x: 0, y: 0}

    this.score

    this.wall

    this.scoreElement = document.getElementById("score_value");


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
    this.ctx.fillStyle = "#FFFFFF";
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
    switch(this.snakeDirection){
      case 0: _y--; break;
      case 1: _x++; break;
      case 2: _y++; break;
      case 3: _x--; break;
    }
    this.snake.pop();
    this.snake.unshift({x: _x, y: _y});


    if (this.snake[0].x < 0 || this.snake[0].x > this.canvas.width / 10 || this.snake[0].y < 0 || this.snake[0].y > this.canvas.height / 10){
      alert("Game Over")
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
    this.ctx.fillStyle = "#000000"
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