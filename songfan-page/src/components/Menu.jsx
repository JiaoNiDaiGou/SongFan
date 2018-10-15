import React, { Component } from "react";
import { callBackend } from "../backend.js";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { loadMenu } from "../actions/actions";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.goToCart = this.goToCart.bind(this);
    this.state = {
      menu: null
    };
  }

  componentDidMount() {
    callBackend("GET", "/api/menus/a").then(res => {
      this.setState({
        menu: res
      });
    });
  }

  goToCart(e) {
    var dishId = e.currentTarget.dataset.dishid;
    console.log("order: " + dishId);
    this.props.history.push("/Cart?dishid=" + dishId);
  }

  render() {
    var menu = this.state.menu;
    if (!!menu) {
      var menuItems = menu.menuEntries.map(t => {
        return (
          <div key={t.dish.id}>
            <div>{t.dish.id}</div>
            <div>{t.dish.name}</div>
            <img
              style={{ width: "200px", height: "150px" }}
              alt="what?"
              src={
                "https://storage.googleapis.com/x-media/" + t.dish.mediaIds[0]
              }
            />
            <button data-dishid={t.dish.id} onClick={this.goToCart}>
              Order
            </button>
          </div>
        );
      });
      return <div>{menuItems}</div>;
    } else {
      return <div>Loading Menu</div>;
    }
  }
}

const mapStateToProps = (state, ownProps) => ({});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onLoadMenu: () => dispatch(loadMenu())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Menu));
