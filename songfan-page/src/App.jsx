import React, { Component } from "react";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import Receipt from "./components/Receipt";
import "./App.css";
import { Provider } from "react-redux";
import { history, store } from "./actions/store";
import { Router, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <div>
            <Route exact path="/" component={Menu} />
            <Route path="/menu" component={Menu} />
            <Route path="/cart" component={Cart} />
            <Route path="/Receipt" component={Receipt} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
