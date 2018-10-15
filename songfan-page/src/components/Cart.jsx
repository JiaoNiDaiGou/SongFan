import React, { Component } from "react";
import queryString from "query-string";
import { callBackend } from "../backend.js";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dishId: "",
      comboId: "",
      customerPhone: "",
      customerEmail: "",
      comments: ""
    };
  }

  componentDidMount() {
    var params = queryString.parse(this.props.location.search);
    this.setState({
      dishId: params.dishId,
      comboId: params.comboId
    })
  }

  render() {
    
    var order = this.props.order;
    // return <div>{order.dish.name}</div>;
    return <div>hello world</div>;
  }
}

export default Cart;
