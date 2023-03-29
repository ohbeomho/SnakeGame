const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cellSize = 25;

let currentMove = 'up';
let moveQueue = [];
let started = false;
let score = 0;

window.addEventListener('keydown', (e) => {
  if (!started) {
    started = true;

    document.querySelector('.input').style.display = 'none';
    startGame(document.getElementById('difficulty').value);
  }

  let key = e.key.toLowerCase();

  if ((key === 'arrowup' || key === 'w') && currentMove !== 'down') currentMove = 'up';
  if ((key === 'arrowdown' || key === 's') && currentMove !== 'up') currentMove = 'down';
  if ((key === 'arrowleft' || key === 'a') && currentMove !== 'right') currentMove = 'left';
  if ((key === 'arrowright' || key === 'd') && currentMove !== 'left') currentMove = 'right';

  moveQueue.push(currentMove);
});

class Snake {
  constructor(x, y) {
    this.list = [
      {
        x,
        y
      },
      {
        x,
        y: y - 1
      }
    ];
  }

  update() {
    const head = this.list[0];

    for (let i = this.list.length - 1; i > 0; i--) {
      if (head.x === this.list[i].x && head.y === this.list[i].y) gameOver();

      this.list[i].x = this.list[i - 1].x;
      this.list[i].y = this.list[i - 1].y;
    }

    const move = (m) => {
      if (m === 'up') head.y -= 1;
      else if (m === 'down') head.y += 1;
      else if (m === 'left') head.x -= 1;
      else if (m === 'right') head.x += 1;
    }

    if (moveQueue.length >= 2) {
      moveQueue.slice(0, moveQueue.length - 1).forEach(move);
    }

    moveQueue = [];
    move(currentMove);

    if (head.x >= canvas.width / cellSize) head.x = 0;
    else if (head.x < 0) head.x = canvas.width / cellSize;
    else if (head.y >= canvas.height / cellSize) head.y = 0;
    else if (head.y < 0) head.y = canvas.height / cellSize;
  }

  draw() {
    for (let i = 0; i < this.list.length; i++) {
      ctx.fillStyle = i === 0 ? 'rgb(144, 224, 255)' : 'rgb(175, 239, 255)';
      ctx.fillRect(cellSize * this.list[i].x, cellSize * this.list[i].y, cellSize, cellSize);
    }
  }
}

const snake = new Snake(10, 10);

class Apple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  update() {
    if (this.x / cellSize === snake.list[0].x && this.y / cellSize === snake.list[0].y) {
      snake.list.push({
        x: snake.list[snake.list.length - 1].x,
        y: snake.list[snake.list.length - 1].y
      });

      this.x = Math.floor(Math.random() * (canvas.width / cellSize)) * cellSize;
      this.y = Math.floor(Math.random() * (canvas.width / cellSize)) * cellSize;

      score++;
    }
  }

  draw() {
    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.fillRect(this.x, this.y, cellSize, cellSize);
  }
}

const apple = new Apple(
  Math.floor(Math.random() * (canvas.width / cellSize)) * cellSize,
  Math.floor(Math.random() * (canvas.width / cellSize)) * cellSize
);

let gameLoop;

function gameOver() {
  clearInterval(gameLoop);

  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < snake.list.length; i++) {
      ctx.fillStyle = 'rgb(180, 0, 0)';
      ctx.fillRect(cellSize * snake.list[i].x, cellSize * snake.list[i].y, cellSize, cellSize);
    }
  }, 800);
  setTimeout(() => {
    const restartButton = document.createElement('button');
    restartButton.innerText = 'Restart';
    restartButton.addEventListener('click', () => location.reload());
    document.body.appendChild(restartButton);

    ctx.fillStyle = 'white';
    ctx.font = '50px Segoe UI Black';
    ctx.fillText('GAME OVER', 10, 60);
    ctx.font = '20px Segoe UI Semibold';
    ctx.fillText('Score: ' + score, 10, 120);
  }, 1900);
}

function startGame(difficulty) {
  const fps = difficulty === 'easy' ? 6 : difficulty === 'normal' ? 10 : 20;

  gameLoop = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.update();
    snake.draw();

    apple.update();
    apple.draw();

    ctx.fillStyle = 'white';
    ctx.font = '16px Segoe UI Light';
    ctx.fillText('Score: ' + score, 10, 20);
  }, 1000 / fps);
}
