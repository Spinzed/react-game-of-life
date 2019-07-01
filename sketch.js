let game;

function setup() {
  createCanvas(window.outerWidth, window.innerHeight);
  document.addEventListener("contextmenu", () => { // prevents opening of cntxt menu
    event.preventDefault();
  });
  frameRate(60);
  game = new Game(round(Math.random() * 1000000));
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