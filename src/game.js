export const Game = {
  canvas: document.getElementById("game-canvas"),
  get canvas_ctx() {return this.canvas.getContext("2d")},
  seed: Math.round(Math.random() * 1000000),
  aliveCells: [],
  cellWidth: 5,
  isStarted: false,
  speed: 10,
  isFrozen: false, // this is used to freeze the game when opening a new game prompt

  newGame(newSeed) {
    this.seed = this.rand(newSeed);
    this.start();
  },

  start() {
    this.startTimeout();
    this.aliveCells = [];
    this.readyCanvas();
    this.setSpeed(this.speed);

    this.pixelRange = 30;
    let canvasW = parseInt(this.canvas.getAttribute("width"));
    let canvasH = parseInt(this.canvas.getAttribute("height"));
    for (let i = 0; i < 300; i++) {
      let randX = Math.floor(this.rand(this.seed + i) * this.pixelRange);
      let randY = Math.floor(this.rand(this.seed + 100 + i) * this.pixelRange);
      let x = this.getX(canvasW / 2) + randX - (this.pixelRange / 2);
      let y = this.getY(canvasH / 2) + randY - (this.pixelRange / 2);
      let cell = { x: x, y: y };
      this.aliveCells.push(cell);
    }

    // HARDCODED FOR TESTING
    // let cell = { x: 1, y: 1 };
    // let cell2 = new Cell(40, 21);
    // let cell3 = new Cell(40, 22);
    // this.aliveCells.push(cell);
    // HARDCODED FOR TESTING

    this.drawCells();
    this.isStarted = true;
  },

  update() {
    if (!this.isStarted && !this.isFrozen) return;
    let dead = [];
    let revived = [];

    // VV revive eligible ded cells
    this.aliveCells.forEach(aliveCell => {
      for (let x = aliveCell.x - 1; x < aliveCell.x + 2; x++) {
        for (let y = aliveCell.y - 1; y < aliveCell.y + 2; y++) {
          let cell = { x: x, y: y };
          if (this.getBoyzInDaHood(cell) === 3 && !this.isAlive(cell) && !this.isInList(cell, revived)) {
            revived.push(cell);
          }
        }
      }
    });

    // VV kill cells that have bad amount of neighbours
    for (let i = 0; i < this.aliveCells.length; i++) {
      let cell = this.aliveCells[i];
      let boyz = this.getBoyzInDaHood(cell);
      if (boyz > 3 || boyz < 2) {
        dead.push(i);
      }
    }

    // VV Update lists
    let timer = 0; // this was done for optimisation
    dead.forEach(index => {
      this.aliveCells.splice(index - timer, 1);
      timer++;
    });
    this.aliveCells = this.aliveCells.concat(revived);

    this.drawCells();
  },

  readyCanvas() {
    if (!this.isStarted) return;
    this.canvas_ctx.fillStyle = '#969696';
    this.canvas_ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

    // VV generate grid
    this.canvas_ctx.fillStyle = '#646464';
    for (let i = 0; i < this.canvas.clientWidth; i += this.cellWidth + 1) {
      this.canvas_ctx.fillRect(i, 0, 1, this.canvas.clientHeight); // didnt use lines cuz of reasons
    }

    for (let i = 0; i < this.canvas.clientHeight; i += this.cellWidth + 1) {
      this.canvas_ctx.fillRect(0, i, this.canvas.clientWidth, 1); // didnt use lines cuz of reasons
    }

    // VV old way of genrating the grid, very slow
    // this.canvas_ctx.fillStyle = '#969696';
    // for (let w = 0; w < this.canvas.clientWidth; w += 6) {
    //   for (let h = 0; h < this.canvas.clientHeight; h += 6) {
    //     this.canvas_ctx.fillRect(w + 1, h + 1, 5, 5);
    //   }
    // }
  },

  drawCells() {
    this.canvas_ctx.fillStyle = '#272727';
    this.aliveCells.forEach(cell => {
      this.canvas_ctx.fillRect(cell.x * (this.cellWidth + 1) + 1, cell.y * (this.cellWidth + 1) + 1, 5, 5);
    });
  },

  getBoyzInDaHood(cell) { // getNeighbours() :D
    let count = 0;
    for (let x = cell.x - 1; x < cell.x + 2; x++) {
      for (let y = cell.y - 1; y < cell.y + 2; y++) {
        // eslint isa sometimes a bit too picky
        // eslint-disable-next-line no-loop-func
        this.aliveCells.forEach(elem => {
          if (cell.x !== x || cell.y !== y) {
            if (elem.x === x && elem.y === y) {
              count++;
            }
          }
        });
      }
    }
    return count;
  },

  setSpeed(newSpeed) {
    this.speed = newSpeed;
    this.startTimeout();
  },

  startTimeout() {
    clearInterval(this.speedLoop);
    let speed = 1000 / this.speed;
    this.speedLoop = setInterval(() => {
      this.readyCanvas();
      this.update();
    }, speed);
  },

  stopTimeout() {
    clearInterval(this.speedLoop);
  },

  getX(coord) { // transfer pixels to grid row
    return Math.floor(coord / (this.cellWidth + 1)) + 1;
  },

  getY(coord) { // transfer pixels to grid column
    return Math.floor(coord / (this.cellWidth + 1)) + 1;
  },

  stop() { // oh my what could this possibly do??
    if (!this.isStarted) return; else {
      this.isStarted = false;
      this.stopTimeout();
    }
  },

  continue() {
    if (this.isStarted) return; else {
      this.isStarted = true;
      this.startTimeout();
    }
  },
  
  togglePause() {
    if (this.isStarted) this.stop(); else this.continue();
  },

  restart() {
    this.stop();
    this.start();
  },

  isAlive(cell) { // just a lil bit easier to use than the bottom one
    let isAlive = false;
    this.aliveCells.forEach(arrayCell => {
      if (arrayCell.x === cell.x && arrayCell.y === cell.y) {
        isAlive = true;
      }
    });
    return isAlive;
  },

  isInList(cell, arr) {
    let contains = false;
    arr.forEach(arrayCell => {
      if (arrayCell.x === cell.x && arrayCell.y === cell.y) {
        contains = true;
      }
    });
    return contains;
  },

  rand(seed) {
    var x = Math.sin(seed) * 1000000;
    return x - Math.floor(x);
  }
}