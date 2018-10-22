import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";

class Receipt extends Component {
  componentDidMount() {
    var { order } = this.props;
    if (!order) {
      this.props.history.push("/");
    }
  }

  render() {
    var { order } = this.props;
    return <div>{JSON.stringify(order)}</div>;
  }
}

const mapStateToProps = (state, ownProps) => ({
  order: state.main.order
});

export default connect(mapStateToProps)(Receipt);
