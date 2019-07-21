let p5 = require("p5")
import Game from './game.js'

let game;

let s = (sk) => {
  sk.setup = () => {
    sk.createCanvas(window.outerWidth, window.innerHeight);
    document.addEventListener("contextmenu", () => { // prevents opening of cntxt menu
      event.preventDefault();
    });
    sk.frameRate(60);
    game = new Game(sk, Math.round(Math.random() * 1000000));
  }
  sk.draw = () => {
    game.readyCanvas();
    game.update();
  } 
  // VV I'll reimplement this when I figure how, I dont have fucking nerves to do it rn
  // sk.mousePressed = () => {
  //   if (game.isFrozen) return;
  //   if (mouseButton == "left") {
  //     game.restart();
  //   }
  //   if (mouseButton == "right") {
  //     game.togglePause();
  //   }
  // }
}

const P5 = new p5(s);

export { game as Game }