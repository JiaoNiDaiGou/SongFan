import React, { Component } from "react";
import { connect } from "react-redux";
import DropIn from "braintree-web-drop-in-react";
import { initOrder, selectDishes } from "../actions/actions";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import InputMask from "react-input-mask";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = theme => ({
  main: {
    maxWidth: 400,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10
  },
  table: {
    marginLeft: "auto",
    marginRight: "auto"
  },
  textField: {
    marginLeft: 10,
    marginRight: 10,
    width: "95%"
  },
  placeOrderButton: {
    margin: theme.spacing.unit,
    backgroundColor: "green",
    marginLeft: "auto",
    marginRight: "right"
  },
  requestPaymentMethodButton: {
    margin: theme.spacing.unit,
    marginLeft: "auto",
    marginRight: "right"
  },
  dishQuantityCell: {
    maxWidth: 40,
    maxHeight: 30,
    textAlign: "right",
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  confirmModal: {
    top: "50%",
    left: "50%",
    transform: `translate(-50%, -50%)`,
    position: "absolute",
    width: theme.spacing.unit * 30,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    display: "flex",
    alignItems: "center"
  },
  confirmProgress: {
    margin: theme.spacing.unit * 2
  }
});

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2
});

class Cart extends Component {
  instance = null;

  constructor(props) {
    super(props);
    this.state = {
      customerPhone: "",
      customerPhoneInvalid: false,
      paymentMethodRequestable: false,
      paymentMethodSelected: false,
      paymentMethodType: "",
      paymentMethodDetails: null,
      confirmModalOpen: false
    };
    this.requestPaymentMethod = this.requestPaymentMethod.bind(this);
    this.onCustomerPhoneChange = this.onCustomerPhoneChange.bind(this);
    this.onNoPaymentMethodRequestable = this.onNoPaymentMethodRequestable.bind(
      this
    );
    this.onPaymentMethodRequestable = this.onPaymentMethodRequestable.bind(
      this
    );
    this.onPaymentOptionSelected = this.onPaymentOptionSelected.bind(this);
    this.onDishQuantityChange = this.onDishQuantityChange.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
  }

  readyToRender() {
    var { menu, braintreeClientToken, selectedDishes } = this.props;
    return (
      !!menu &&
      !!braintreeClientToken &&
      !!selectedDishes &&
      Object.keys(selectedDishes).length > 0
    );
  }

  componentDidMount() {
    if (!this.readyToRender()) {
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
    var { selectedDishes, menu, initOrder } = this.props;
    var {
      customerPhone,
      paymentMethodRequestable,
      paymentMethodSelected,
      paymentMethodType,
      paymentMethodDetails
    } = this.state;

    if (!this.readyToRender()) {
      console.log("how can you get here");
      return;
    }

    // validate phone
    if (!customerPhone) {
      console.error("customerPhone is required");
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

    this.setState({
      confirmModalOpen: true
    });

    var dishes = {};
    Object.entries(selectedDishes).forEach(([key, val]) => {
      dishes[key] = val.quantity;
    });

    var request = {
      customer: {
        phone: {
          countryCode: "1",
          phone: customerPhone
        }
      },
      menuId: menu.id,
      dishes: dishes,
      paymentType: paymentMethodType,
      paymentNonce: paymentMethodDetails.nonce
    };

    var callback = () => {
      this.setState({
        confirmModalOpen: false
      });
      this.props.history.push("/Receipt");
    };

    initOrder(request, callback);
  }

  onCustomerPhoneChange(e) {
    this.setState({
      customerPhone: e.target.value
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

  onDishQuantityChange(e) {
    var dishId = e.currentTarget.dataset.dishid;
    var quantityStr = e.target.value;
    var quantity = !!quantityStr ? parseInt(quantityStr) : 0;
    if (quantity < 0) {
      console.log("bad quantity");
      return;
    }
    var { selectedDishes, selectDishes } = this.props;
    selectedDishes[dishId].quantity = quantity;
    selectDishes(selectedDishes);
    this.setState({});
  }

  render() {
    var { classes } = this.props;
    if (!this.readyToRender()) {
      return <div />;
    }
    return (
      <div className={classes.main}>
        {this.renderConfirmModal()}
        {this.renderSelectedDishes()}
        {this.renderCustomerInfo()}
        {this.renderBraintreeDropin()}
        {this.renderPlaceOrderButtons()}
      </div>
    );
  }

  renderSelectedDishes() {
    var { selectedDishes, classes } = this.props;

    if (!selectedDishes || Object.keys(selectedDishes).length === 0) {
      return <div>no dishes</div>;
    }

    var rows = Object.entries(selectedDishes).map(([key, val]) => val);

    var totalPriceBeforeTax = rows
      .map(t => t.price.value * t.quantity)
      .reduce((a, b) => a + b);

    var totalQuantity = rows.map(t => t.quantity).reduce((a, b) => a + b);

    var totalTax = totalPriceBeforeTax * 0.098;

    var totalPriceAfterTax = totalPriceBeforeTax + totalTax;

    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>名称</TableCell>
            <TableCell numeric>单价</TableCell>
            <TableCell numeric>数量</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.dish.id}>
              <TableCell component="th" scope="row">
                {row.dish.name}
              </TableCell>
              <TableCell numeric>
                {priceFormatter.format(row.price.value)}
              </TableCell>
              <TableCell numeric>
                <input
                  type="number"
                  data-dishid={row.dish.id}
                  value={row.quantity}
                  className={classes.dishQuantityCell}
                  onChange={this.onDishQuantityChange}
                />
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>总计</TableCell>
            <TableCell numeric>
              {priceFormatter.format(totalPriceBeforeTax)}
            </TableCell>
            <TableCell numeric>{totalQuantity}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>税</TableCell>
            <TableCell numeric>{priceFormatter.format(totalTax)}</TableCell>
            <TableCell />
          </TableRow>
          <TableRow>
            <TableCell>加税总计</TableCell>
            <TableCell numeric>
              {priceFormatter.format(totalPriceAfterTax)}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  renderCustomerInfo() {
    const mask = "\\(999\\) 999 - 9999";
    var { classes } = this.props;
    var { customerPhone } = this.state;
    return (
      <div>
        <InputMask
          mask={mask}
          value={customerPhone}
          onChange={this.onCustomerPhoneChange}
        >
          {inputProps => (
            <TextField
              {...inputProps}
              type="tel"
              label="电话"
              className={classes.textField}
              placeholder={mask}
              margin="normal"
              variant="outlined"
            />
          )}
        </InputMask>
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
    var { classes } = this.props;
    var { paymentMethodRequestable, paymentMethodSelected } = this.state;
    if (paymentMethodRequestable && paymentMethodSelected) {
      return (
        <Button
          variant="contained"
          color="primary"
          className={classes.placeOrderButton}
          onClick={this.placeOrder}
        >
          下单
        </Button>
      );
    } else {
      return (
        <Button
          variant="contained"
          color="primary"
          className={classes.requestPaymentMethodButton}
          onClick={this.requestPaymentMethod}
        >
          确认支付方式
        </Button>
      );
    }
  }

  renderConfirmModal() {
    var { confirmModalOpen } = this.state;
    var { classes } = this.props;

    if (confirmModalOpen) {
      return (
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={confirmModalOpen}
        >
          <div className={classes.confirmModal}>
            <CircularProgress className={classes.confirmProgress} />
            <Typography variant="h6">正在下单</Typography>
          </div>
        </Modal>
      );
    } else {
      return <div />;
    }
  }
}

const mapStateToProps = (state, ownProps) => ({
  menu: state.main.menu,
  selectedDishes: state.main.selectedDishes,
  braintreeClientToken: state.main.braintreeClientToken
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  initOrder: (request, callback) => dispatch(initOrder(request, callback)),
  selectDishes: selectedDishes => dispatch(selectDishes(selectedDishes))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Cart));
