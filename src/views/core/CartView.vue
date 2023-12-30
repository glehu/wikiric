<template>
  <div class="cart">
    <div style="min-height: 10vh"></div>
    <section
      class="container">
      <div class="text-light p-3">
        <h1 class="font-bold flex">
          Shopping Cart, Total: {{ cartTotal }} €
        </h1>
        <br>
        <button class="btn btn-outline-light" v-on:click="clearCart(true)">Clear Cart</button>
        <button class="btn btn-outline-warning ms-5" v-on:click="submitOrder()">Submit Order</button>
        <br>
        <textarea class="bg-black  mt-3" style="width: 75%"
                  v-model="note" placeholder="&nbsp;Add a note for the seller.">
        </textarea>
      </div>
    </section>
    <div v-show="!emptyCart" id="itemsSection" :style="{ backgroundImage: bg }">
      <section>
        <div class="mt-4" style="min-height: 3vh"></div>
        <div class="container wrapper">
          <div class="card"
               v-for="item in $store.state.cart" :key="item"
               style="background: black; color: white">
            <div class="card-title">
              <h3 class="font-bold m-3">
                {{ item.description }}
              </h3>
            </div>
            <div class="card-body">
              <hr>
              <div class="flex">
                <button title="Remove from cart" class="btn btn-outline-danger"
                        v-on:click="this.removeItem(item)">
                  <i class="bi bi-x-lg"></i> Remove
                </button>
              </div>
              <p class="text-end font-bold lead">
                {{ item.amount }}x {{ item.price }} €
              </p>
              <hr>
            </div>
            <div class="card-footer text-center">
              <img style="max-width: 75%; max-height: 75%" v-bind:src="getImg(item)" alt="No Image Available."/>
            </div>
          </div>
        </div>
        <div style="min-height: 5vh"></div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WCart',
  data () {
    return {
      resultsList: {},
      itemList: {},
      note: '',
      angle: '180',
      color1: 'rebeccapurple',
      color2: 'darkblue'
    }
  },
  methods: {
    removeItem: function (item) {
      this.$store.commit('removeFromCart', item)
    },
    clearCart (notification) {
      this.$store.commit('clearCart')
      if (notification) {
        this.$notify(
          {
            title: 'Cart cleared.',
            text: '',
            type: 'info'
          })
        if (this.usageTracker) {
          this.sendUsageData({
            source: 'web',
            module: 'cart',
            action: 'clearCart'
          })
        }
      }
    },
    submitOrder () {
      if (!this.emptyCart) {
        const headers = new Headers()
        headers.set('Authorization', 'Bearer ' + this.$store.state.token)
        headers.set('Content-Type', 'application/json')
        fetch(
          this.$store.state.serverIP + '/api/m3/neworder',
          {
            method: 'post',
            headers: headers,
            body: JSON.stringify({
              cart: this.cart,
              customerNote: this.note
            })
          }
        )
          .then((res) => res.json())
          .then((data) => this.$notify(
            {
              title: 'Order #' + data + ' submitted',
              text: 'Thanks for your order.',
              type: 'info'
            })
          )
        this.clearCart(false)
        this.note = ''
        if (this.usageTracker) {
          this.sendUsageData({
            source: 'web',
            module: 'cart',
            action: 'submitOrder'
          })
        }
      } else {
        this.$notify(
          {
            title: 'Error: Cart is empty.',
            text: 'Order was not submitted.',
            type: 'error'
          })
      }
    },
    async sendUsageData (usageObj) {
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      headers.set('Content-Type', 'application/json')
      fetch(
        this.$store.state.serverIP + '/api/utr',
        {
          method: 'post',
          headers: headers,
          body: JSON.stringify(usageObj)
        }
      ).then(r => console.log(r))
    },
    getImg (item) {
      return 'data:image/jpeg;base64,' + item.imageBase64String
    }
  },
  computed: {
    cart () {
      return this.$store.state.cart
    },
    bg () {
      return `linear-gradient(${this.angle}deg, ${this.color1}, ${this.color2})`
    },
    emptyCart () {
      const empty = this.$store.state.cart.length === 0
      console.log(empty)
      return empty
    },
    cartTotal () {
      let total = 0
      for (let i = 0; i < this.$store.state.cart.length; i++) {
        total += (this.$store.state.cart[i].price * this.$store.state.cart[i].amount)
      }
      return total
    },
    usageTracker () {
      return this.$store.state.usageTracking
    }
  }
}
</script>

<style scoped>

.wrapper {
  display: grid;
  gap: 1em;
  grid-auto-rows: minmax(100px, auto);
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .wrapper {
    grid-template-columns: repeat(1, 1fr);
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .wrapper {
    grid-template-columns: repeat(4, 1fr);
  }

  .hide_on_big {
    display: none
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  .wrapper {
    grid-template-columns: repeat(5, 1fr);
  }
}

</style>
