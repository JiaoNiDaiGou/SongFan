<template>
  <div></div>
</template>

<script>
import braintreeWebDropIn from "braintree-web-drop-in";
export default {
  name: "BraintreeDropIn",
  data() {
    return {
      options: {
        authorization: this.authorization,
        container: "#" + this.container
      },
      button: null
    };
  },
  props: [
    "authorization",
    "container",
    "submitButton",
    "paypal",
    "paypalCredit"
  ],
  methods: {
    create() {
      var componentInstance = this;
      braintreeWebDropIn.create(this.options, function(createErr, instance) {
        componentInstance.button.addEventListener("click", function() {
          instance.requestPaymentMethod(function(
            requestPaymentMethodErr,
            payload
          ) {
            componentInstance.$emit("nonce", payload.nonce);
          });
        });
      });
    }
  },
  mounted() {
    this.button = document.getElementById(this.submitButton);
    if (this.paypal) {
      this.options.paypal = this.paypal;
    }
    if (this.paypalCredit) {
      this.options.paypalCredit = this.paypalCredit;
    }
    if (this.applePay) {
      this.options.applePay = this.applePay;
    }
    this.create();
  }
};
</script>
