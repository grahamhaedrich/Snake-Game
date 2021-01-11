//defining game constants
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const SNAKE_COLOR = "green";
const FOOD_COLOR = "red";
const TOTAL_SQUARES = 900;
const SQUARE_DIM = 30;
const BOARD_DIM = 30;

let direction;
let snake = [];
let score = 1;
let difficulty;
let time_interval;

function getDifficulty(difficulty)
{
  if(difficulty == 1) //easy
      time_interval = 150;
  else if(difficulty == 2) //medium
      time_interval = 110;
  else if(difficulty == 3) //hard
      time_interval = 80;
  else if(difficulty == 4) //expert
      time_interval = 50;
  else if(difficulty == 5) //god
      time_interval = 30;

  document.getElementById("display").style.display = 'none';

  init();
}

function init()
{
  //adding event listener for arrow keys
  document.addEventListener("keydown", function(e) {
    snakeDirection(e);
  });

  function snakeDirection(e) {
    let key_code = e.keyCode;
    if(key_code == 37 && direction != "RIGHT") //left key code
      direction = "LEFT";
    else if(key_code == 38 && direction != "DOWN") //up key code
      direction = "UP";
    else if(key_code == 39 && direction != "LEFT") //right key code
      direction = "RIGHT";
    else if(key_code == 40 && direction != "UP") //down key code
      direction = "DOWN";
  }

  //generate random empty square
  function randomSquare()
  {
    let row = SQUARE_DIM * Math.floor(Math.random() * (BOARD_DIM));
    let col = SQUARE_DIM * Math.floor(Math.random() * (BOARD_DIM));

    for(let length = 0; length < snake.length; length++) //make sure its empty
    {
      if(row == snake[length].row && col == snake[length].col)
        randomSquare();
    }
    return [row, col];
  }

  //starting snake position
  let snake_start = randomSquare();
  snake[0] = {
    row: snake_start[0], //row
    col: snake_start[1] //col
  }

  //starting food square
  let food_square = randomSquare();
  let food = {
    row: food_square[0],
    col: food_square[1]
  }

  function gameOver(snake, snake_head) {
    if(score == TOTAL_SQUARES)
    {
      alert("GAME WON! CONGRATULATIONS");
      return true;
    }
    else if(snake_head.row < -SQUARE_DIM || snake_head.row > (SQUARE_DIM * BOARD_DIM) || //if snake hits edge
       snake_head.col < -SQUARE_DIM || snake_head.col > (SQUARE_DIM * BOARD_DIM))
    {
      alert("GAME OVER! RELOAD TO PLAY AGAIN. SCORE: " + score);
      return true;
    }
    else
    {
      for(let length = 0; length < snake.length; length++) //if snake hits itself
      {
        if(snake_head.row == snake[length].row && snake_head.col == snake[length].col)
        {
          alert("GAME OVER! RELOAD TO PLAY AGAIN. SCORE: " + score);
          return true;
        }
      }
    }
    return false; //game
  }

  function drawScore() {
      ctx.font = "50px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(score, 50, 50, 50);
  }


  function draw() {

    //black background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 900, 900);

    //drawing snake
    for(let length = 0; length < snake.length; length++)
    {
      ctx.fillStyle = SNAKE_COLOR; //green snake blocks
      ctx.fillRect(snake[length].row, snake[length].col, SQUARE_DIM, SQUARE_DIM);

      ctx.strokeStyle = "black"; //black border around snake
      ctx.strokeRect(snake[length].row, snake[length].col, SQUARE_DIM, SQUARE_DIM);
    }

    //drawing food
    ctx.fillStyle = FOOD_COLOR;
    ctx.fillRect(food.row, food.col, SQUARE_DIM, SQUARE_DIM);

    //current snake head
    let snake_row = snake[0].row;
    let snake_col = snake[0].col;
  console.log(time_interval);
    //adjust snake position according to arrow key direction pressed
    if(direction == "UP")
      snake_col -= SQUARE_DIM;
    if(direction == "DOWN")
      snake_col += SQUARE_DIM;
    if(direction == "RIGHT")
      snake_row += SQUARE_DIM;
    if(direction == "LEFT")
      snake_row -= SQUARE_DIM;

    //if snake head is on food
    if(snake_row == food.row && snake_col == food.col)
    {
      score++;
      //place another piece of food
      food_square = randomSquare();
      food = {
        row: food_square[0],
        col: food_square[1]
      }
    }
    else
      snake.pop(); //remove old snake head

    let new_snake_head = { //new snake head with adjusted position
      row: snake_row,
      col: snake_col
    }

    if(gameOver(snake, new_snake_head))
    {
      clearInterval(game); //stop calling draw function
      location.reload();
    }


    snake.unshift(new_snake_head); //add new head wit adjusted location to the snake
    drawScore(); //display game score
  }

  let game = setInterval(draw, time_interval); //every 150ms call draw function
}
