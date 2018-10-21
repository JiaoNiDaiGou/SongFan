import React, { Component } from "react";
import { connect } from "react-redux";

class Receipt extends Component {
  render() {
    var { order } = this.props;
    return <div>{JSON.stringify(order)}</div>;
  }
}

const mapStateToProps = (state, ownProps) => ({
  order: state.main.order
});

export default connect(mapStateToProps)(Receipt);
