<template>
  <div class="shop text-light" style="background-color: #080808">
    <!-- Box View -->
    <section class="container" style="align-items: center; display: flex">
      <div class="row">
        <div class="md:flex" style="margin-top: 70px">
          <button class="btn text-dark font-bold" v-on:click="getItems()">
            <div class="card bg-light text-dark animEmp">
              <div class="card-body text-center">
                <div class="h1 mb-2">
                  <i class="bi bi-bag"></i>
                </div>
                <h3 class="card-title">Items</h3>
                <p class="font-bold text-dark">View Items</p>
              </div>
            </div>
          </button>
        </div>
        <div style="display: flex; margin: 1ch">
          <button class="btn text-white animRot" title="Change Artist" v-on:click="console.log('')">
            <i class="bi bi-arrow-clockwise h1"></i>
          </button>
          <h1 class="font-bold text-white">{{ this.artist }}</h1>
        </div>
      </div>
    </section>
  </div>
  <section id="itemsSection"
           class="min-h-[100dvh]"
           :style="{ backgroundImage: bg }">
    <div class="container">
      <div style="height: 80px"></div>
      <div class="wrapper">
        <div class="card"
             v-for="item in shopItemList" :key="item"
             style="background: black; color: white">
          <div class="card-title">
            <h3 class="font-bold ms-3 mt-3">
              {{ JSON.parse(item).description }}
            </h3>
          </div>
          <div class="card-body text-center">
            <img style="max-width: 75%; max-height: 75%" v-bind:src="getImg(item)" alt="No Image Available."/>
          </div>
          <div class="card-footer">
            {{ JSON.parse(item).info }}
            <hr>
            <div class="flex">
              <button class="btn btn-outline-light"
                      v-on:click="putInCart(JSON.parse(item))">
                <abbr title="Add to cart."><i class="bi bi-cart"></i></abbr> <span class="hide_on_big">Add</span>
              </button>
              <button class="btn btn-outline-light ms-2">
                <abbr title="Buy now."><i class="bi bi-cash-stack"></i></abbr> <span class="hide_on_big">Buy</span>
              </button>
              <input class="ms-2 bg-black text-white p-2"
                     :id="'AMT_' + JSON.parse(item).uID"
                     type="number" value="1" min="1" max="99" size="2"
                     style="border-radius: 1rem">
            </div>
            <p class="text-end font-bold lead">
              {{ JSON.parse((JSON.parse(item).prices[0])).gp }} €
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

export default {
  data () {
    return {
      artist: 'wikiric.xyz',
      resultsList: {},
      itemList: {},
      angle: '180',
      color1: 'rebeccapurple',
      color2: 'darkblue'
    }
  },
  computed: {
    bg () {
      return `linear-gradient(${this.angle}deg, ${this.color1}, ${this.color2})`
    },
    shopItemList () {
      return this.$store.state.shop
    },
    usageTracker () {
      return this.$store.state.usageTracking
    }
  },
  methods: {
    scrollTo (content) {
      document.getElementById(content).scrollIntoView({ behavior: 'smooth' })
    },
    getItems () {
      this.itemList = {}
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      fetch(
        this.$store.state.serverIP + '/api/m4/entry/*?type=name&format=json&lock=false',
        {
          method: 'get',
          headers: headers
        }
      )
        .then((res) => res.json())
        .then((data) => (this.$store.commit('putShopItems', data.resultsList)))
        .then(() => (this.scrollTo('itemsSection')))
        .catch((err) => console.log(err.message))
    },
    putInCart (item) {
      const amount = document.getElementById('AMT_' + item.uID).value
      this.$store.commit('putInCart', {
        posID: this.getUUID(),
        uID: item.uID,
        description: item.description,
        amount: amount,
        price: JSON.parse(item.prices[0]).gp,
        imageBase64String: item.imageBase64String
      })
      this.$notify(
        {
          title: amount + 'x ' + item.description + ' added to the cart.',
          text: '',
          type: 'info'
        })
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'shop',
          action: 'putInCart'
        })
      }
    },
    async sendUsageData (usageObj) {
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      headers.set(
        'Content-Type', 'application/json'
      )
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
      return 'data:image/jpeg;base64,' + JSON.parse(item).imageBase64String
    },
    getUUID: function () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    }
  }
}
</script>

<style>
.animEmp {
  position: relative;
  top: 0;
  left: 0;
  transition: all ease 0.5s;
}

.animEmp:hover {
  top: -5px;
  left: +5px;
  box-shadow: -5px 5px black;
}

.animRot {
  position: relative;
  transition: all ease 0.5s;
}

.animRot:hover {
  transform: rotate(30deg);
}

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
