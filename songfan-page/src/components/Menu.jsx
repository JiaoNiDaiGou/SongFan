import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { loadMenu, getClientToken, selectDishes } from "../actions/actions";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import red from "@material-ui/core/colors/red";
import CardActionArea from "@material-ui/core/CardActionArea";
import Button from "@material-ui/core/Button";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Modal from "@material-ui/core/Modal";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

const styles = theme => ({
  card: {
    maxWidth: 400,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  actions: {
    display: "flex"
  },
  avatar: {
    backgroundColor: red[500]
  },
  button: {
    // backgroundColor: "green"
  },
  loadingModal: {
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
  loadingProgress: {
    margin: theme.spacing.unit * 2
  },
  cart: {
    position: "fixed",
    top: 10,
    right: 10,
    zIndex: 99
  },
  cartBadge: {
    position: "absolute",
    top: 7,
    right: -15,
    // The border color match the background color.
    border: `2px solid ${
      theme.palette.type === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[900]
    }`
  },
  goToCartButton: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 5,
    marginButton: 10,
    backgroundColor: "green"
  }
});

class Menu extends Component {
  constructor(props) {
    super(props);
    this.goToCart = this.goToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.quickGoToCart = this.quickGoToCart.bind(this);
  }

  componentDidMount() {
    var { loadMenu, getClientToken } = this.props;
    loadMenu();
    getClientToken();
  }

  addToCart(e) {
    var { menu, selectedDishes } = this.props;
    var dishId = e.currentTarget.dataset.dishid;
    var entry = menu.menuEntries.find(t => t.dish.id === dishId);
    if (!entry) {
      return;
    }
    entry = Object.assign({}, entry, { quantity: 1 });
    selectedDishes[dishId] = entry;
    this.props.selectDishes(selectedDishes);

    this.setState({});
  }

  removeFromCart(e) {
    var { selectedDishes } = this.props;
    var dishId = e.currentTarget.dataset.dishid;
    delete selectedDishes[dishId];
    this.props.selectDishes(selectedDishes);

    this.setState({});
  }

  quickGoToCart(e) {
    var { menu, selectedDishes } = this.props;
    var dishId = e.currentTarget.dataset.dishid;
    var entry = menu.menuEntries.find(t => t.dish.id === dishId);
    if (!entry) {
      return;
    }
    entry = Object.assign({}, entry, { quantity: 1 });
    selectedDishes[dishId] = entry;
    this.props.selectDishes(selectedDishes);

    this.props.history.push("/Cart");
  }

  goToCart(e) {
    this.props.history.push("/Cart");
  }

  render() {
    var { menu } = this.props;
    if (menu) {
      return (
        <div>
          {this.renderCartIcon()}
          {menu.menuEntries.map(t => this.renderMenuEntry(t))}
          {this.renderGoToCartButton()}
        </div>
      );
    } else {
      return this.renderLoadingModal();
    }
  }

  renderLoadingModal() {
    var { classes } = this.props;
    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={true}
        >
          <div className={classes.loadingModal}>
            <CircularProgress className={classes.loadingProgress} />
            <Typography variant="h6">正在加载菜单</Typography>
          </div>
        </Modal>
      </div>
    );
  }

  renderGoToCartButton() {
    var { classes } = this.props;
    return (
      <Button
        className={classes.goToCartButton}
        variant="contained"
        size="medium"
        color="primary"
        onClick={this.goToCart}
      >
        CheckOut
      </Button>
    );
  }

  renderCartIcon() {
    var { classes, selectedDishes } = this.props;
    var totalQuantity = 0;
    if (selectedDishes && Object.keys(selectedDishes).length > 0) {
      console.log("totalQuantity");
      totalQuantity = Object.entries(selectedDishes)
        .map(([key, val]) => val.quantity)
        .reduce((a, b) => a + b);
    }

    return (
      <IconButton aria-label="Cart" className={classes.cart}>
        <Badge
          badgeContent={totalQuantity}
          color="primary"
          classes={{ badge: classes.cartBadge }}
        >
          <ShoppingCartIcon fontSize="large" />
        </Badge>
      </IconButton>
    );
  }

  renderMenuEntry(entry) {
    var { classes, selectedDishes } = this.props;
    var dish = entry.dish;
    dish.avatar = "M";
    var dishImg = "https://storage.googleapis.com/x-media/" + dish.mediaIds[0];
    var price = entry.price;
    var inCart =
      !!selectedDishes && Object.keys(selectedDishes).includes(dish.id);

    return (
      <Card className={classes.card} key={dish.id}>
        <CardHeader
          avatar={
            <Avatar aria-label="Recipe" className={classes.avatar}>
              {dish.avatar}
            </Avatar>
          }
          title={
            <Typography variant="h6">
              {dish.name}
            </Typography>
          }
          subheader={"$" + price.value}
        />
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={dishImg}
            title={dish.name}
          />
          <CardContent>
            <Typography component="p">{dish.description}</Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          {inCart ? (
            <Button
              className={classes.button}
              variant="contained"
              size="small"
              color="secondary"
              data-dishid={dish.id}
              onClick={this.removeFromCart}
            >
              已加入购物车
            </Button>
          ) : (
            <Button
              className={classes.button}
              variant="contained"
              size="small"
              color="primary"
              data-dishid={dish.id}
              onClick={this.addToCart}
            >
              加入购物车
            </Button>
          )}

          <Button
            className={classes.button}
            variant="contained"
            size="small"
            color="primary"
            data-dishid={dish.id}
            onClick={this.quickGoToCart}
          >
            快速下单
          </Button>
        </CardActions>
      </Card>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  menu: state.main.menu,
  selectedDishes: state.main.selectedDishes
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadMenu: () => dispatch(loadMenu()),
  getClientToken: () => dispatch(getClientToken()),
  selectDishes: selectedDishes => dispatch(selectDishes(selectedDishes))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(Menu)));
