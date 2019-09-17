import React from "react";

const SwitchButton = props => {
  // This is a custom Container component which renders a new
  // button in order they are passed as children after each click.
  // After the cycle is complete, the first button is rendered
  const [activeChild, setActiveChild] = React.useState(0);
  let activeChildProp = props.children[activeChild];

  const updateActiveChild = () => {
    activeChild + 1 < props.children.length
      ? setActiveChild(activeChild + 1)
      : setActiveChild(0);
  };

  return (
    <div onClick={updateActiveChild}>
      {activeChildProp}
    </div>
  );
};

export default SwitchButton;
