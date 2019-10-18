import shapes from "./shapes";

const Game = {
  canvas: undefined, // will be initialized later
  get canvasCTX() { return this.canvas.getContext("2d") },
  seed: window.location.pathname.split("/")[1] || Math.round(Math.random() * 1000000),
  aliveCells: [],
  previewCells: [],
  isStarted: false,
  isPaused: false, // this is used to freeze the game when opening a new game prompt
  CW: 4, // cell width
  speed: 20,
  generation: 0,

  newGame(newSeed) {
    this.seed = this.rand(newSeed);
    this.start();
  },

  start() {
    if (this.canvas == undefined) this.canvas = document.getElementById("gameCanvas");
    this.isStarted = true;
    this.isPaused = false;
    this.generation = 0;
    this.startInterval();
    this.clear();
    this.resetCanvas();
    this.setSpeed(this.speed);

    this.generateGrid();
    this.drawCells();
  },

  update() {
    if (!this.isStarted && this.isPaused) return;
    let dead = [];
    let revived = [];

    // VV mark eligible ded cells
    for (let x = 0; x < this.aliveCells.length; x++) {
      const row = this.aliveCells[x];
      if (row === undefined) continue;
      for (let y = 0; y < row.length; y++) {
        const yVal = row[y];
        for (let checkX = x - 1; checkX < x + 2; checkX++) {
          for (let checkY = yVal - 1; checkY < yVal + 2; checkY++) {
            let cell = { x: checkX, y: checkY };
            if (this.isInList(cell, revived)) continue;
            if (this.getBoyzInDaHood(cell) === 3 && !this.isAlive(cell)) {
              if (revived[checkX] === undefined) revived[checkX] = [];
              revived[checkX].push(checkY);
            }
          }
        }
      }
    }

    // VV mark cells that have bad amount of neighbours
    for (let x = 0; x < this.aliveCells.length; x++) {
      const row = this.aliveCells[x];
      if (row === undefined) continue;
      for (let y = 0; y < row.length; y++) {
        let cell = { x: x, y: row[y] };
        let boyz = this.getBoyzInDaHood(cell);
        if (boyz > 3 || boyz < 2) {
          if (dead[x] === undefined) dead[x] = [];
          dead[x].push(row[y]);
        }
      }
    }

    // VV Update lists
    for (let x = 0; x < dead.length; x++) {
      const row = dead[x];
      if (row === undefined) continue;
      for (let y = 0; y < row.length; y++) {
        let cell = { x: x, y: row[y] }
        this.killCell(cell);
      }
    }
    for (let x = 0; x < revived.length; x++) {
      const row = revived[x];
      if (row === undefined) continue;
      for (let y = 0; y < row.length; y++) {
        let cell = { x: x, y: row[y] }
        this.reviveCell(cell);
      }
    }

    this.generation++;
    // this.drawCells();
  },

  generateGrid() {
    this.PIXELRANGE = 30;
    let canvasW = parseInt(this.canvas.getAttribute("width"));
    let canvasH = parseInt(this.canvas.getAttribute("height"));
    for (let i = 0; i < 300; i++) {
      let randX = Math.floor(this.rand(this.seed + i) * this.PIXELRANGE);
      let randY = Math.floor(this.rand(this.seed + 100 + i) * this.PIXELRANGE);
      let x = this.getX(canvasW / 2) + randX - (this.PIXELRANGE / 2);
      let y = this.getY(canvasH / 2) + randY - (this.PIXELRANGE / 2);
      if (this.aliveCells[x] === undefined) this.aliveCells[x] = [];
      this.aliveCells[x].push(y)
    }
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
    let copy = [...this.aliveCells];
    for (let i = 0; i < copy.length; i++) {
      if (copy[i] === undefined) continue;
      copy[i] = [...copy[i]];
    }
    for (let x = 0; x < copy.length; x++) {
      const row = copy[x];
      if (row === undefined) continue;
      for (let y = 0; y < row.length; y++) {
        let cell = { x: x, y: row[y] }
        this.killCell(cell);
        // this.aliveCells[x].splice(y, 1)
      }
    }
    // this.update();
  },

  drawCells() {
    this.canvasCTX.fillStyle = '#272727';
    for (let x = 0; x < this.aliveCells.length; x++) {
      const row = this.aliveCells[x];
      if (row === undefined) continue;
      for (let y = 0; y < row.length; y++) {
        let cell = { x: x, y: row[y] }
        this.canvasCTX.fillRect(cell.x * (this.CW + 1) + 1, cell.y * (this.CW + 1) + 1, this.CW, this.CW);
      }
    }
  },

  drawCell(cell) {
    if (this.isInList(cell, this.previewCells)) return;
    this.canvasCTX.fillStyle = '#272727';
    this.canvasCTX.fillRect(cell.x * (this.CW + 1) + 1, cell.y * (this.CW + 1) + 1, this.CW, this.CW);
  },

  eraseCell(cell) {
    if (this.isInList(cell, this.previewCells)) return;
    this.canvasCTX.fillStyle = '#969696';
    this.canvasCTX.fillRect(cell.x * (this.CW + 1) + 1, cell.y * (this.CW + 1) + 1, this.CW, this.CW);
  },

  reviveCell(cell) {
    if (this.isAlive(cell)) return;
    if (this.aliveCells[cell.x] === undefined) this.aliveCells[cell.x] = [];
    this.aliveCells[cell.x].push(cell.y);
    this.drawCell(cell)
  },

  killCell(cell) {
    if (!this.isAlive(cell)) return;
    this.aliveCells[cell.x].splice(this.isAlive(cell) - 1, 1);
    if (this.aliveCells[cell.x].toString() === "") this.aliveCells[cell.x] = undefined;
    this.eraseCell(cell);
  },

  toggleCell(x, y) {
    if (this.isAlive(cell)) {
      this.killCell(x, y);
    } else {
      this.reviveCell(x, y);
    }
  },

  loadShape(shapeName, x, y) { // loads the shape into the this.previewCells array
    this.eraseShape();
    shapes.forEach(shape => {
      if (shape.name === shapeName) {
        shape.cells.forEach(cell => {
          let targetX = x + cell[0];
          let targetY = y + cell[1];

          if (this.previewCells[targetX] === undefined)
            this.previewCells[targetX] = [];
          if (!this.previewCells[targetX].includes(targetY))
            this.previewCells[targetX].push(targetY);
        });
      }
    });
    this.drawShape();
  },

  drawShape() { // draws the shape in the canvas
    // no futher optimizations needed because this isnt called as often
    this.previewCells.forEach((row, x) => {
      row.forEach(y => {
        let cell = { x: x, y: y };
        this.canvasCTX.fillStyle = "#083577";
        this.canvasCTX.fillRect(cell.x * (this.CW + 1) + 1, cell.y * (this.CW + 1) + 1, this.CW, this.CW);
      })
    });
  },

  eraseShape() { // deletes the shape from the canvas
    // VV This had to be done because it won't recolor the cell if it is in this.previewCells
    //  array so it has to be cleared first. Losing the reference is not necesary since it checks
    //  for values rather than references
    let copy = [...this.previewCells];
    copy.map(row => row != undefined ? [...row] : null);
    this.previewCells = [];

    copy.forEach((row, x) => {
      if (row === undefined) return;
      row.forEach(y => {
        let cell = { x: x, y: y };
        this.isAlive(cell) ? this.drawCell(cell) : this.eraseCell(cell);
      })
    });
  },

  applyShape() { // stamp the shape onto the array
    this.previewCells.forEach((row, x)=> {
      row.forEach(y => {
        let cell = { x: x, y: y };
        this.reviveCell(cell);
      })
    });
  },

  getBoyzInDaHood(cell) { // getNeighbours() :D
    let count = 0;
    for (let x = cell.x - 1; x < cell.x + 2; x++) {
      if (this.aliveCells[x] === undefined) continue;
      for (let y = cell.y - 1; y < cell.y + 2; y++) {
        if (cell.x == x && cell.y == y) continue;
        this.aliveCells[x].includes(y) && count++;
      }
    }
    return count;
  },

  setSpeed(newSpeed) {
    this.speed = newSpeed;
    this.startInterval();
  },

  startInterval() {
    clearInterval(this.speedLoop);
    let speed = 1000 / this.speed;
    this.speedLoop = setInterval(() => {
      // this.resetCanvas();
      this.update();
    }, speed);
  },

  stopInterval() {
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
      this.isPaused = true;
      this.stopInterval();
    }
  },

  continue() {
    if (!this.isPaused) return; else {
      this.isPaused = false;
      this.startInterval();
    }
  },

  togglePause() {
    if (this.isPaused) this.continue(); else this.stop();
  },

  restart() { // basically just an alias of this.start()
    this.clear();
    this.generateGrid();
  },

  isAlive(cell) { // just a lil bit easier to use than the bottom one
    if (this.aliveCells[cell.x] === undefined) return false;
    let findings = this.aliveCells[cell.x].findIndex(y => y === cell.y);
    return findings + 1;
  },

  isInList(cell, arr) {
    if (arr[cell.x] !== undefined && arr[cell.x].includes(cell.y)) return true;
    return false;
  },

  checkAlive() { // for debugging purposes
    let alive = [];
    for (let x = 0; x < this.aliveCells.length; x++) {
      const row = this.aliveCells[x];
      if (row === undefined) continue;
      for (let y = 0; y < row.length; y++) {
        let cell = { x: x, y: row[y] }
        alive.push(cell);
      }
    }
    return alive;
  },

  rand(seed) {
    var x = Math.sin(seed) * 1000000;
    return x - Math.floor(x);
  }
}

export default Game;
