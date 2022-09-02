const canvas = document.getElementById('canvas');
const width = 500;
const height = 500;
const app = new PIXI.Application({
	width,
	height,
	view: canvas
});

const cellSize = 25;
let move = 'up';
let running = false;
let score = 0;

window.addEventListener('keydown', (e) => {
	if (!running && score !== -1) {
		running = true;
		document.querySelector('.start').style.display = 'none';
		document.querySelector('.message').innerText = 'Score: 0';
	}

	switch (e.key.toLowerCase()) {
		case 'w':
		case 'arrowup':
			move = 'up';
			break;
		case 's':
		case 'arrowdown':
			move = 'down';
			break;
		case 'a':
		case 'arrowleft':
			move = 'left';
			break;
		case 'd':
		case 'arrowright':
			move = 'right';
			break;
	}
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
		this.g = new PIXI.Graphics();
		app.stage.addChild(this.g);
	}

	update() {
		for (let i = this.list.length - 1; i > 0; i--) {
			if (this.list[0].x === this.list[i].x && this.list[0].y === this.list[i].y) gameOver();

			this.list[i].x = this.list[i - 1].x;
			this.list[i].y = this.list[i - 1].y;
		}

		if (move === 'up') this.list[0].y -= 1;
		else if (move === 'down') this.list[0].y += 1;
		else if (move === 'left') this.list[0].x -= 1;
		else if (move === 'right') this.list[0].x += 1;

		if (
			this.list[0].x < 0 ||
			this.list[0].x > width / cellSize ||
			this.list[0].y < 0 ||
			this.list[0].y > width / cellSize
		)
			gameOver();
	}

	draw() {
		this.g.clear();

		for (let i = 0; i < this.list.length; i++) {
			this.g.beginFill(i === 0 ? 0x90e0ff : 0xafefff);
			this.g.drawRect(cellSize * this.list[i].x, cellSize * this.list[i].y, cellSize, cellSize);
			this.g.endFill();
		}
	}
}

const snake = new Snake(10, 10);

class Apple {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.g = new PIXI.Graphics();
		app.stage.addChild(this.g);
	}

	update() {
		if (this.x / cellSize === snake.list[0].x && this.y / cellSize === snake.list[0].y) {
			snake.list.push({
				x: snake.list[snake.list.length - 1].x,
				y: snake.list[snake.list.length - 1].y
			});

			this.x = Math.floor(Math.random() * (width / cellSize)) * cellSize;
			this.y = Math.floor(Math.random() * (width / cellSize)) * cellSize;

			score++;
			document.querySelector('.message').innerText = 'Score: ' + score;
		}
	}

	draw() {
		this.g.clear();
		this.g.beginFill(0xff0000);
		this.g.drawRect(this.x, this.y, cellSize, cellSize);
		this.g.endFill();
	}
}

const apple = new Apple(
	Math.floor(Math.random() * (width / cellSize)) * cellSize,
	Math.floor(Math.random() * (width / cellSize)) * cellSize
);

function gameOver() {
	document.querySelector('.message').style.display = 'block';
	document.querySelector(
		'.message'
	).innerHTML = `<h3>GAME OVER!</h3>Score: <strong>${score}</strong><br /><button onclick="location.reload()">Restart</button>`;

	canvas.style.display = 'none';

	running = false;
	score = -1;
}

const FPS = app.ticker.FPS;
let delta = 0;
app.ticker.add(() => {
	if (running) {
		delta += 6;

		if (delta > FPS) {
			snake.update();
			snake.draw();

			apple.update();
			apple.draw();
			delta = 0;
		}
	}
});
