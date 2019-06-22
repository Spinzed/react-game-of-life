let game;

function setup() {
  createCanvas(window.outerWidth, window.innerHeight);
  document.addEventListener("contextmenu", () => { // prevents opening of cntxt menu
    event.preventDefault();
  });
  frameRate(60);
  game = new Game(Math.random() * 100);
  game.start();
}

function mousePressed() {
  if (game.isFrozen) return;
  if (mouseButton == "left") {
    game.restart();
  }
  if (mouseButton == "right") {
    game.togglePause();
  }
}