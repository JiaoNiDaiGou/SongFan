import React, { Component } from "react";
import Menu from "./component/Menu";
import Cart from "./component/Cart";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Menu} />
          <Route path="/menu" component={Menu} />
          <Route path="/cart" component={Cart} />
        </div>
      </Router>
    );
  }
}

export default App;
