class InfoToast extends React.Component {
  constructor(props) { // expects render (bool), type (string), message (string) and onClose (handler function)
    super(props);
    this.onTransition = this.onTransition.bind(this);
  }
  componentWillUpdate(newProps) {
    clearTimeout(this.statusRemoveTimeout);
    if (newProps.render) {
      this.isActive = true;
    } else {
      this.height = "0px";
    }
    if (this.isActive && this.height == "0px" && newProps.render) {
      setTimeout(() => {
        this.height = "120px";
        this.forceUpdate();
      }, 0)
    }
    newProps.type == "error" ? this.color = "#9e2525" : this.color = "#1933b7";
  }
  componentDidUpdate() { // all the stuff that doesnt need to be in render
    if (this.props.type == "info") {
      this.statusRemoveTimeout = setTimeout(() => {
        this.props.onClose("InfoToast");
      }, 5000)
    }
  }
  onTransition() {
    if (this.height == "0px") {
      this.isActive = false;
      this.forceUpdate();
    }
  }
  render() {
    if (this.isActive) {
      return (
        <div id="info_toast" className="info_toast" style={{ color: this.color, height: this.height }} onTransitionEnd={this.onTransition}>
          <div style={{ padding: "35px 0 0 0" }}>{this.props.message}</div>
        </div>
      )
    } else return null;
  }
}