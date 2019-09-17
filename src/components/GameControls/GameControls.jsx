import React from "react";
import styles from "./styles.module.css";
import Button from "components/GUI/Button/Button.jsx";
import SwitchButton from "components/GUI/SwitchButton/SwitchButton.jsx";
import Game from "game";

const GameControls = () => {
  return (
    <div className={styles.GameControls}>
      <div className={styles.header}>General</div>
      <div className={styles.buttonCont}>
        <SwitchButton>
          <Button onClick={() => Game.stop()}>Stop</Button>
          <Button onClick={() => Game.continue()}>Continue</Button>
        </SwitchButton>
        <Button onClick={() => Game.restart()}>Restart</Button>
      </div>
      <div className={styles.header}>Draw</div>
      <div className={styles.buttonCont}>
        <Button onClick={() => Game.clear()}>Clear</Button>
      </div>
    </div>
  );
};

export default GameControls;
