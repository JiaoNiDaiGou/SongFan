import React, { Component } from "react";
import { connect } from "react-redux";
import DropIn from "braintree-web-drop-in-react";
import { initOrder } from "../actions/actions";

class Cart extends Component {
  instance = null;

  constructor(props) {
    super(props);
    this.state = {
      customerPhone: "",
      customerEmail: "",
      quantity: 1,
      paymentMethodRequestable: false,
      paymentMethodSelected: false,
      paymentMethodType: "",
      paymentMethodDetails: null
    };
    this.requestPaymentMethod = this.requestPaymentMethod.bind(this);
    this.onCustomerEmailChange = this.onCustomerEmailChange.bind(this);
    this.onCustomerPhoneChange = this.onCustomerPhoneChange.bind(this);
    this.onNoPaymentMethodRequestable = this.onNoPaymentMethodRequestable.bind(
      this
    );
    this.onPaymentMethodRequestable = this.onPaymentMethodRequestable.bind(
      this
    );
    this.onPaymentOptionSelected = this.onPaymentOptionSelected.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
  }

  componentDidMount() {
    var { menu, braintreeClientToken } = this.props;
    if (!menu || !braintreeClientToken) {
      this.props.history.push("/");
    }
  }

  requestPaymentMethod(e) {
    var that = this;
    this.instance.requestPaymentMethod(function(
      requestPaymentMethodErr,
      payload
    ) {
      if (requestPaymentMethodErr) {
        console.error(requestPaymentMethodErr);
      } else {
        that.setState({
          paymentMethodDetails: payload
        });
      }
    });
  }

  placeOrder(e) {
    var { selectedDishIds, menu, initOrder } = this.props;
    var {
      customerPhone,
      customerEmail,
      quantity,
      paymentMethodRequestable,
      paymentMethodSelected,
      paymentMethodType,
      paymentMethodDetails
    } = this.state;

    if (!menu || !selectedDishIds || selectedDishIds.length === 0) {
      console.log("how can you get here");
      return;
    }

    // validate phone or email
    if (!customerPhone && !customerEmail) {
      console.error("customerPhone or customerEmail is required");
      return;
    }

    // valid payment options details
    if (
      !paymentMethodRequestable ||
      !paymentMethodSelected ||
      !paymentMethodDetails ||
      !paymentMethodDetails.nonce
    ) {
      console.error("payment not finalized");
      return;
    }

    var menuEntry = menu.menuEntries.find(
      t => t.dish.id === selectedDishIds[0]
    );
    var dishes = {};
    dishes[menuEntry.dish.id] = quantity;

    var request = {
      customer: {
        phone: {
          countryCode: "1",
          phone: customerPhone
        },
        email: customerEmail
      },
      menuId: menu.id,
      dishes: dishes,
      paymentType: paymentMethodType,
      paymentNonce: paymentMethodDetails.nonce
    };

    console.log(JSON.stringify(request));
    var that = this;
    var callback = () => that.props.history.push("/Receipt");
    initOrder(request, callback);
  }

  onCustomerPhoneChange(e) {
    this.setState({
      customerPhone: e.target.value
    });
  }

  onCustomerEmailChange(e) {
    this.setState({
      customerEmail: e.target.value
    });
  }

  onPaymentOptionSelected(e) {
    console.log("onPaymentOptionSelected");
  }

  onPaymentMethodRequestable(e) {
    this.setState({
      paymentMethodRequestable: true,
      paymentMethodSelected: e.paymentMethodIsSelected,
      paymentMethodType: e.type
    });
  }

  onNoPaymentMethodRequestable(e) {
    this.setState({
      paymentMethodRequestable: false
    });
  }

  render() {
    return (
      <div>
        {this.renderDish()}
        {this.renderBraintreeDropin()}
        {this.renderPlaceOrderButtons()}
      </div>
    );
  }

  renderDish() {
    var { selectedDishIds, menu } = this.props;
    var { quantity } = this.state;

    if (!menu || !selectedDishIds || selectedDishIds.length === 0) {
      return <div>no dish selected</div>;
    }

    // TODO: single dish
    var menuEntry = menu.menuEntries.find(
      t => t.dish.id === selectedDishIds[0]
    );
    if (!menuEntry) {
      return <div>no dish selected</div>;
    }

    var dish = menuEntry.dish;
    var price = menuEntry.price;
    return (
      <div>
        <div>{dish.id}</div>
        <div>{dish.name}</div>
        <div>{dish.description}</div>
        <div>${price.value}</div>
        <div>{quantity}</div>
        <div>
          Phone
          <input onChange={this.onCustomerPhoneChange} />
        </div>
        <div>
          Email
          <input />
        </div>
      </div>
    );
  }

  renderBraintreeDropin() {
    var { braintreeClientToken } = this.props;
    if (braintreeClientToken) {
      return (
        <div>
          <DropIn
            options={{ authorization: braintreeClientToken }}
            onInstance={instance => (this.instance = instance)}
            onPaymentOptionSelected={this.onPaymentOptionSelected}
            onPaymentMethodRequestable={this.onPaymentMethodRequestable}
            onNoPaymentMethodRequestable={this.onNoPaymentMethodRequestable}
          />
        </div>
      );
    } else {
      return <div>loading client token ...</div>;
    }
  }

  renderPlaceOrderButtons() {
    var { paymentMethodRequestable, paymentMethodSelected } = this.state;
    if (paymentMethodRequestable && paymentMethodSelected) {
      return <button onClick={this.placeOrder}>下单</button>;
    } else {
      return <button onClick={this.requestPaymentMethod}>确认支付</button>;
    }
  }
}

const mapStateToProps = (state, ownProps) => ({
  menu: state.main.menu,
  selectedDishIds: state.main.selectedDishIds,
  braintreeClientToken: state.main.braintreeClientToken
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  initOrder: (request, callback) => dispatch(initOrder(request, callback))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);
