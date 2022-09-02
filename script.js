const canvas = document.getElementById('canvas');
const width = 500;
const height = 500;
const app = new PIXI.Application({
	width,
	height,
	view: canvas
});

const cellSize = 25;
let move = 'w';
let running = false;

window.addEventListener('keydown', (e) => {
	if (!running) {
		running = true;
		document.querySelector('.start').style.display = 'none';
	}

	move = e.key.toLowerCase();
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
			if (this.list[0].x === this.list[i].x && this.list[0].y === this.list[i].y) {
				gameOver();
			}

			this.list[i].x = this.list[i - 1].x;
			this.list[i].y = this.list[i - 1].y;
		}

		if (move === 'w') {
			this.list[0].y -= 1;
		} else if (move === 's') {
			this.list[0].y += 1;
		} else if (move === 'a') {
			this.list[0].x -= 1;
		} else if (move === 'd') {
			this.list[0].x += 1;
		}

		if (
			this.list[0].x < 0 ||
			this.list[0].x > width / cellSize ||
			this.list[0].y < 0 ||
			this.list[0].y > width / cellSize
		) {
			gameOver();
		}
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
	running = false;

	document.querySelector('.message').style.display = 'block';
	document.querySelector('.message').innerHTML = `GAME OVER!<br />Score: ${
		snake.list.length - 1
	}<br /><button onclick="location.reload()">Restart</button>`;

	canvas.style.display = 'none';
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
