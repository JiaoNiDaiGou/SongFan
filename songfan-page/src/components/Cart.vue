<template>
    <div>
      <div id='braintree-drop-in-container'></div>
      <button id='submit-button'>Request payment method</button>
        <braintree-drop-in
            authorization='[token]'
            container='braintree-drop-in-container'
            submitButton='submit-button'
            :paypal='paypal'
            :paypalCredit='paypalCredit'
            v-on:nonce='showNonce' />
    </div>
</template>

<script>
import BraintreeDropIn from './BraintreeDropIn'
export default {
  name: 'Cart',
  data () {
    return {
      message: 'this is shopping car',
      paypal: {
        flow: 'checkout',
        amount: '10.00',
        currency: 'USD'
      },
      paypalCredit: {
        flow: 'checkout',
        amount: '10.00',
        currency: 'USD'
      },
      components: {
        'braintree-drop-in': BraintreeDropIn
      },
      methods: {
        showNonce (value) {
          // The value is payment nonce which appears after submit button was clicked
        }
      }
    }
  }
}
</script>
