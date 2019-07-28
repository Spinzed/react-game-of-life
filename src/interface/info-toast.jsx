import React from "react";

export default class InfoToast extends React.Component {
  constructor(props) { // expects render (bool), type (string), message (string) and onClose (handler function)
    super(props);
    this.onTransition = this.onTransition.bind(this);
    this.height = 0;
    this.colors = {
      info: "#1933b7",
      error: "#6f0505"
    }
  }
  onTransition() {
    if (this.height === 0) {
      this.isShown = false;
      this.isRetracting = false;
      this.forceUpdate();
    }
  }
  componentWillUpdate(newProps) {
    this.oldProps = this.props;
    clearTimeout(this.statusRemoveTimeout);
    if (newProps.render) {
      if (this.isRetracting) {
        this.isOnHold = true;
      } else {
        this.isShown = true;
      }
    } else {
      this.height = 0;
      if (this.isShown) this.isRetracting = true;
    }
    newProps.type === "error" ? this.currentColor = this.colors.error :
      this.currentColor = this.colors.info;
  }
  componentDidUpdate() { // all the  stuff that doesnt need to be in render
    if (this.props.render) {
      if (this.height === 0) {
        setTimeout(() => {
          this.height = 100;
          this.forceUpdate();
        }, 0)
      }
    }
    if (this.props.type === "info") {
      this.statusRemoveTimeout = setTimeout(() => {
        this.props.onClose("InfoToast");
      }, 5000)
    }
  }
  render() {
    let currentProps = {};
    this.isRetracting ? currentProps = this.oldProps : currentProps = this.props;
    if (this.isShown) {
      return (
        <div id="info_toast" className="info_toast" style={{ color: this.currentColor, height: this.height + "px" }} onTransitionEnd={this.onTransition}>
          <p>{currentProps.message}</p>
        </div>
      )
    } else return null;
  }
}