import React, { Component } from "react";

class App extends Component {
  UNSAFE_componentWillMount = () => {
    // to Login component
    this.props.history.push("/Login");
  };
  render() {
    return <div></div>;
  }
}

export default App;
