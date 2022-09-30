const $canvas = document.getElementById("canvas");
const $score = document.getElementById("score");
const $gOMask = document.getElementById("game-over-mask");
const $mobileBtns = document.querySelectorAll(".mobile-controls button");

const c = $canvas.getContext("2d");

const SQUARES_LIMIT = 25;
const boxSize = canvas.width / SQUARES_LIMIT;

const initialSnakeY = Math.floor(SQUARES_LIMIT / 2);

const initialSnakePos = [
   { x: 3, y: initialSnakeY }, //snake head pos
   { x: 2, y: initialSnakeY }, //snake tail pos
];

let snake = [...initialSnakePos];
let direction = { x: 1, y: 0 };
let gameInterval = null;
let food = null;
let keyController = 0;
let score = 0;
let isChangingDirec = false;
let isSnakeMoving = false;

document.addEventListener("DOMContentLoaded", () => {
   if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
         navigator.userAgent
      )
   ) {
      document.querySelector(".mobile-controls").classList.remove("d-none");
   }

   food = getFoodPos();
   main();
});

document.addEventListener("keydown", ({ key }) => {
   setGame(key);

   if ($gOMask.classList.contains("active")) key === "Enter" && restartGame();
});

$mobileBtns.forEach((btn) => {
   btn.addEventListener("click", () => {
      const { move } = btn.dataset;

      setGame(move);
   });
});

$gOMask.querySelector("button").addEventListener("click", () => restartGame());

const main = () => {
   isChangingDirec = false;

   drawGameBoard();

   const snakeX = snake[0].x + direction.x;
   const snakeY = snake[0].y + direction.y;

   const newHead = { x: snakeX, y: snakeY };

   const isXlimit = snakeX < 0 || snakeX > SQUARES_LIMIT - 1;
   const isYlimit = snakeY < 0 || snakeY > SQUARES_LIMIT - 1;

   const isSelfCollided = snake.some(({ x, y }) => x === snakeX && y === snakeY);

   if (isSelfCollided || isYlimit || isXlimit) {
      clearInterval(gameInterval);
      $gOMask.classList.add("active");
   }

   snake.unshift(newHead);

   if (!(snakeX === food.x && snakeY === food.y)) return snake.pop();

   score++;
   $score.textContent = `Score: ${score}`;
   food = getFoodPos();
};

const setGame = (direc) => {
   if (direc === "ArrowUp" || direc === "ArrowRight" || direc === "ArrowDown")
      isSnakeMoving = true;

   if (isSnakeMoving) changeDirection(direc);

   if (keyController < 2 && isSnakeMoving) keyController++;

   if (keyController === 1 && isSnakeMoving) gameInterval = setInterval(main, 100);
};

const drawGameBoard = () => {
   for (let i = 0; i < SQUARES_LIMIT; i++) {
      for (let j = 0; j < SQUARES_LIMIT; j++) {
         drawBox(i * boxSize, j * boxSize, ["#1F2937", "#263445"][(i + j) % 2]);
      }
   }

   snake.forEach(({ x, y }) => drawSnakeParts(x, y));

   drawBox(food.x * boxSize, food.y * boxSize, "#E33F32"); //drawing food
};

const changeDirection = (key) => {
   if (isChangingDirec) return; //prevent snake from going reversing
   isChangingDirec = true;

   const goingUp = direction.y === -1;
   const goingRight = direction.x === 1;
   const goingDown = direction.y === 1;
   const goingLeft = direction.x === -1;

   setSnakePos(key, "ArrowUp", goingDown, 0, -1);
   setSnakePos(key, "ArrowRight", goingLeft, 1, 0);
   setSnakePos(key, "ArrowDown", goingUp, 0, 1);
   setSnakePos(key, "ArrowLeft", goingRight, -1, 0);
};

const drawSnakeParts = (x, y) => drawBox(x * boxSize, y * boxSize, "#2D8BD3");

const setSnakePos = (key, keyPressed, counterDirec, x, y) => {
   if (key === keyPressed && !counterDirec) {
      direction.x = x;
      direction.y = y;
   }
};

const getFoodPos = () => {
   let randomPos = { x: getBoardRandomPos(), y: getBoardRandomPos() };

   // checking if the food pos is not equal to snake pos
   while (snake.some(({ x, y }) => x === randomPos.x && y === randomPos.y))
      randomPos = { x: getBoardRandomPos(), y: getBoardRandomPos() };

   return randomPos;
};

const getBoardRandomPos = () => Math.floor(Math.random() * SQUARES_LIMIT);

const drawBox = (x, y, color) => {
   c.beginPath();
   c.fillStyle = color;
   c.fillRect(x, y, boxSize, boxSize);
};

const restartGame = () => {
   snake = [...initialSnakePos];
   isSnakeMoving = false;
   isChangingDirec = false;
   gameInterval = null;
   keyController = 0;
   score = 0;
   $score.textContent = "Score: ";
   direction = { x: 1, y: 0 };

   food = getFoodPos();
   $gOMask.classList.remove("active");
   main();
};
