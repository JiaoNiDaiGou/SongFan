import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { loadMenu, getClientToken, selectDishes } from "../actions/actions";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.goToCart = this.goToCart.bind(this);
  }

  componentDidMount() {
    var { loadMenu, getClientToken } = this.props;
    loadMenu();
    getClientToken();
  }

  goToCart(e) {
    var dishId = e.currentTarget.dataset.dishid;
    this.props.selectDishes([dishId]);
    this.props.history.push("/Cart");
  }

  render() {
    var { menu } = this.props;
    if (menu) {
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

const mapStateToProps = (state, ownProps) => ({
  menu: state.main.menu
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadMenu: () => dispatch(loadMenu()),
  getClientToken: () => dispatch(getClientToken()),
  selectDishes: selectedDishIds => dispatch(selectDishes(selectedDishIds))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Menu));
