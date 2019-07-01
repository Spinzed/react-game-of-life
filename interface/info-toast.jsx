class InfoToast extends React.Component {
  constructor(props) { // expects render (bool), type (string), message (string) and onClose (handler function)
    super(props);
    this.onTransition = this.onTransition.bind(this);
  }
  componentWillUpdate(newProps) {
    this.oldProps = this.props;
    clearTimeout(this.statusRemoveTimeout);
    if (newProps.render) {
      if (this.isRetracting) {
        this.isOnHold = true;
      } else {
        this.isActive = true;
        if (this.height == "0px") {
          setTimeout(() => {
            this.height = "120px";
            this.forceUpdate();
          }, 0)
        }
      }
    } else {
      this.height = "0px";
      this.isActive ? this.isRetracting = true : null;
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
      this.isRetracting = false;
      this.forceUpdate();
    }
  }
  render() {
    let currentProps = {};
    this.isRetracting ? currentProps = this.oldProps : currentProps = this.props;
    if (this.isActive) {
      return (
        <div id="info_toast" className="info_toast" style={{ color: this.color, height: this.height }} onTransitionEnd={this.onTransition}>
          <p>{currentProps.message}</p>
        </div>
      )
    } else return null;
  }
}