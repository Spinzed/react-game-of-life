let game;

function setup() {
  createCanvas(window.outerWidth, window.innerHeight);
  document.addEventListener("contextmenu", () => { // prevents opening of cntxt menu
    event.preventDefault();
  });
  frameRate(60);
  game = new Game();
  game.start();
}

function mousePressed() {
  if (mouseButton == "left") {
    game.restart();
  }
  if (mouseButton == "right") {
    game.togglePause();
  }
}