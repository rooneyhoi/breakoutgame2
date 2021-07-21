// Global variables
let userScore = 0;
const brickRowCount = 9;
const brickColumnCount = 5

// Get the play ground div
const playGround = document.getElementById("playGround");
playGround.width = 800;
playGround.height = 600;

// Create ball object
const ball = {
  x: playGround.width / 2,
  y: playGround.height / 2,
  w: 20,
  h: 20,
  size: 10, // radius of the ball
  speed: 4,
  dx: 2, // speed base on the X asis
  dy: -2 // speed base on the Y asis
}

// Create paddle object
const paddle = {
  x: playGround.width / 2 - 40, // because paddle width = 80
  y: playGround.height -20,
  w: 180,
  h: 10,
  speed: 8,
  dx: 0
}

// Create bricks object
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true
}

// Create the bricks wall array
const bricks = [];
for(let i = 0; i < brickRowCount; i++){
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++){
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = {x, y, ...brickInfo}; // using Spread operator    
  }
}

function drawBricks(){
  bricks.forEach(column => {
    column.forEach(brick => {
      let brickItems = document.createElement("div");
      brickItems.classList.add('brick');
      brickItems.style.left = brick.x + 'px';
      brickItems.style.top = brick.y + 'px';
      brickItems.style.background = brick.visible ? '#964B00' : 'transparent';
      playGround.appendChild(brickItems);
    })
  })
}

function drawPaddle(){
  const paddleDiv = document.createElement("div");
  paddleDiv.className = "paddle";
  paddleDiv.style.width = paddle.w + 'px';
  paddleDiv.style.height = paddle.h + 'px';
  paddleDiv.style.left = paddle.x + 'px';
  paddleDiv.style.top = paddle.y + 'px';
  playGround.appendChild(paddleDiv);
}

function drawBall(){
  const ballDiv = document.createElement("div");
  ballDiv.className = "ball";
  ballDiv.style.width = ball.w + 'px';
  ballDiv.style.height = ball.h + 'px';
  ballDiv.style.left = ball.x + 'px';
  ballDiv.style.top = ball.y + 'px';
  playGround.appendChild(ballDiv);
}

function drawScore(){
  const score = document.createElement("span")
  score.className = 'score';
  score.textContent = 'Score: ' + userScore.toString();
  playGround.appendChild(score);
}

function moveBall(){
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Detect the canvas wall collision (right and left side)
  if (ball.x + ball.w > playGround.width || ball.x < 0){
    ball.dx *= -1; // ball.dx = ball.dx * -1 (this is to go back)
  }

  // Detect the canvas wall collision (top and bottom side)
  if (ball.y + ball.h > playGround.height || ball.y < 0){
    ball.dy *= -1; // ball.dx = ball.dx * -1 (this is to go back)
  }
  
  // Detect if the ball hit the paddle
  if (
      ball.x + ball.w > paddle.x && 
      ball.x < paddle.x + paddle.w && 
      ball.y + ball.h > paddle.y){
    ball.dy = -ball.speed;
    console.log (ball.x + ball.w, paddle.x);
    // console.log (ball.y + ball.h, paddle.y);
    
  }
  
  // Detect if the ball hit the bricks
  bricks.forEach(column => {
    column.forEach(brick => {
      if(brick.visible){
        if(
          ball.x + ball.w > brick.x && // left side of the brick
          ball.x < brick.x + brick.w && // right side of the brick
          ball.y + ball.h > brick.y  && // top of the brick
          ball.y < brick.y + brick.h // bottom of the brick
        ){
          breakBrick(brick);
        }
      }
    })
  })

  // Detect if the ball hit the bottom of the canvas - game over & restart
  // Remember the canvas's drawing is start from the top
  if (ball.y + ball.h > playGround.height) {
    alert("GAME OVER, RESTART!");
    userScore = 0;
    showAllBricks();
    paddle.w = 180;
  }
}

function breakBrick(brick){
  ball.dy *= -1; 
  brick.visible = false;
  increaseScore();
}

function increaseScore(){
  userScore++;

  // Challenge the player by reducing the paddle size
  if (userScore >= 20){
    paddle.w = 80;
  }

  // If all bricks are broken, the show all the bricks again
  if(userScore % (brickRowCount * brickColumnCount) === 0){
    showAllBricks(); 
  }
}

// Reset all bricks visible again
function showAllBricks(){
  bricks.forEach(column => {
    column.forEach(brick => {brick.visible = true;}
    )
  })
}

// Move paddle inside the canvas
function movePaddle(){
  paddle.x += paddle.dx;  

  // Check if hit the right corner of the canvas
  if (paddle.x + paddle.w >= playGround.width){
    paddle.x = playGround.width - paddle.w - 1;
  }

  // Check if the paddle hit the left corner of the canvas
  if (paddle.x < 1){
    paddle.x = 1;
  }
}

// Check if the player presses Arrow Left of Right
function keyUp(e){
  console.log(e.key);
  if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft'){
    paddle.dx = 0;
  }
}

// Check if the player stops using button Arrow Left or Right
function keyDown(e){
  console.log(e.key);
  if (e.key === 'Right' || e.key === 'ArrowRight'){
    paddle.dx = paddle.speed;
    console.log (paddle.w, paddle.x);
  } else if (e.key === 'Left' || e.key === 'ArrowLeft'){
    paddle.dx = -paddle.speed;
  }
}

// Draw all the basic things
function draw(){  
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

function removeAllChildNodes() {
  while (playGround.firstChild) {
      playGround.removeChild(playGround.firstChild);
  }
}

// Update canvas drawing and adding animation
function update(){

  removeAllChildNodes();
  movePaddle();
  moveBall();
  draw();

  // Tells the browser that to perform an animation and requests that the browser calls a specified function to update an animation before the next repaint.
  requestAnimationFrame(update);
}

update();

// Handle keyboard event
document.addEventListener('keyup', keyUp);
document.addEventListener('keydown', keyDown);

// Adding the mouse
document.addEventListener('mousemove', mouseMoveHandler, false);
playGround.addEventListener('touchstart', handleTouchStart, false);
playGround.addEventListener('touchmove', handleTouchMove, false);

function mouseMoveHandler(e) {
  const relativeX = e.clientX - playGround.offsetLeft;
  if(relativeX > 0 && relativeX < playGround.width) {
      paddle.x = relativeX - paddle.w/2;
  }
}

function handleTouchMove(e) {
  console.log('touch move')
  const relativeX = e.clientX - playGround.offsetLeft;
  if(relativeX > 0 && relativeX < playGround.width) {
      paddle.x = relativeX - paddle.w/2;
  }
}

function handleTouchStart(e) {
  console.log('touch start')
  const relativeX = e.clientX - playGround.offsetLeft;
  if(relativeX > 0 && relativeX < playGround.width) {
      paddle.x = relativeX - paddle.w/2;
  }
}