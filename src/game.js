const Game = {
  canvas: undefined, // will be initialized later
  get canvasCTX() { return this.canvas.getContext("2d") },
  seed: window.location.pathname.split("/")[1] || Math.round(Math.random() * 1000000),
  aliveCells: [],
  CW: 4, // cell width
  isStarted: false,
  speed: 10,
  isPaused: false, // this is used to freeze the game when opening a new game prompt

  newGame(newSeed) {
    this.seed = this.rand(newSeed);
    this.start();
  },

  start() {
    if (this.canvas == undefined) this.canvas = document.getElementById("gameCanvas");
    this.isStarted = true;
    this.startTimeout();
    this.clear();
    this.resetCanvas();
    this.setSpeed(this.speed);

    this.PIXELRANGE = 30;
    let canvasW = parseInt(this.canvas.getAttribute("width"));
    let canvasH = parseInt(this.canvas.getAttribute("height"));
    for (let i = 0; i < 300; i++) {
      let randX = Math.floor(this.rand(this.seed + i) * this.PIXELRANGE);
      let randY = Math.floor(this.rand(this.seed + 100 + i) * this.PIXELRANGE);
      let x = this.getX(canvasW / 2) + randX - (this.PIXELRANGE / 2);
      let y = this.getY(canvasH / 2) + randY - (this.PIXELRANGE / 2);
      let cell = { x: x, y: y };
      this.aliveCells.push(cell);
    }
    this.drawCells();
  },

  update() {
    if (!this.isStarted && this.isPaused) return;
    let dead = [];
    let revived = [];

    // VV mark eligible ded cells
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

    // VV mark cells that have bad amount of neighbours
    for (let i = 0; i < this.aliveCells.length; i++) {
      let cell = this.aliveCells[i];
      let boyz = this.getBoyzInDaHood(cell);
      if (boyz > 3 || boyz < 2) {
        dead.push(cell);
      }
    }

    // VV Update lists
    dead.forEach(cell => {
      this.killCell(cell);
    });
    revived.forEach(cell => {
      this.reviveCell(cell);
    })

    // this.drawCells();
  },

  resetCanvas() {
    if (this.isPaused) return;
    this.canvasCTX.fillStyle = '#969696';
    this.canvasCTX.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

    // VV generate grid
    this.canvasCTX.fillStyle = '#646464';
    for (let i = 0; i < this.canvas.clientWidth; i += this.CW + 1) {
      this.canvasCTX.fillRect(i, 0, 1, this.canvas.clientHeight); // didnt use lines cuz of reasons
    }

    for (let i = 0; i < this.canvas.clientHeight; i += this.CW + 1) {
      this.canvasCTX.fillRect(0, i, this.canvas.clientWidth, 1); // didnt use lines cuz of reasons
    }
  },

  clear() {
    // VV had to lose roference the original array because when I modify it,
    //    it shortens and not all cells get deleted
    [...this.aliveCells].forEach(cell => {
      this.killCell(cell)
    });
    // this.update();
  },

  drawCells() {
    this.canvasCTX.fillStyle = '#272727';
    this.aliveCells.forEach(cell => {
      this.canvasCTX.fillRect(cell.x * (this.CW + 1) + 1, cell.y * (this.CW + 1) + 1, this.CW, this.CW);
    });
  },

  drawCell(cell) {
    this.canvasCTX.fillStyle = '#272727';
    this.canvasCTX.fillRect(cell.x * (this.CW + 1) + 1, cell.y * (this.CW + 1) + 1, this.CW, this.CW);
  },

  eraseCell(cell) {
    this.canvasCTX.fillStyle = '#969696';
    this.canvasCTX.fillRect(cell.x * (this.CW + 1) + 1, cell.y * (this.CW + 1) + 1, this.CW, this.CW);
  },

  reviveCellAtPx(xPix, yPix) {
    let x = this.getX(xPix);
    let y = this.getY(yPix);
    this.reviveCell({ x: x, y: y });
  },

  reviveCell(cell) {
    if (this.isAlive(cell)) return;
    this.aliveCells.push(cell);
    this.drawCell(cell)
  },

  killCellAtPx(xPix, yPix) {
    let x = this.getX(xPix);
    let y = this.getY(yPix);
    this.killCell({ x: x, y: y });
  },

  killCell(cell) {
    if (!this.isAlive(cell)) return;
    this.aliveCells.splice(this.isAlive(cell) - 1, 1);
    this.eraseCell(cell);
  },

  toggleCellByPx(xPix, yPix) {
    let x = this.getX(xPix);
    let y = this.getY(yPix);
    if (this.isAlive(cell)) {
      this.killCell(x, y);
    } else {
      this.reviveCell(x, y);
    }
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
      // this.resetCanvas();
      this.update();
    }, speed);
  },

  stopTimeout() {
    clearInterval(this.speedLoop);
  },

  getX(coord) { // transfer pixels to grid row
    return Math.floor(coord / (this.CW + 1));
  },

  getY(coord) { // transfer pixels to grid column
    return Math.floor(coord / (this.CW + 1));
  },

  stop() { // oh my what could this possibly do??
    if (this.isPaused) return; else {
      this.isPaused = false;
      this.stopTimeout();
    }
  },

  continue() {
    if (this.isPaused) return; else {
      this.isPaused = true;
      this.startTimeout();
    }
  },

  togglePause() {
    if (this.isPaused) this.continue(); else this.stop();
  },

  restart() {
    this.stop();
    this.start();
  },

  isAlive(cell) { // just a lil bit easier to use than the bottom one
    let findings = this.aliveCells.findIndex(liveCell => {
      if (liveCell.x === cell.x && liveCell.y === cell.y) return true;
      return false;
    })
    return findings + 1;
  },

  isInList(cell, arr) {
    for (let i = 0; i < arr.length; i++) {
      const arrayCell = arr[i];
      if (arrayCell.x === cell.x && arrayCell.y === cell.y) {
        return i + 1;
      }
    }
    return false;
  },

  rand(seed) {
    var x = Math.sin(seed) * 1000000;
    return x - Math.floor(x);
  }
}

export default Game;
