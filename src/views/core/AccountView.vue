<template>
  <div class="h-full w-full"
       :style="{backgroundImage: 'url('+require('@/assets/'+'account/pexels-dexter-fernandes-2646237.jpg')+')',
       backgroundPosition: 'center top', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }">
    <section class="container">
      <div style="min-height: 5ch"></div>
      <div class="text-light p-3">
        <h2 class="font-bold my-3 flex doHover" style="overflow: hidden">
          <i class="bi bi-stars" style="font-size: 200%"></i><br>
          Hey, {{ this.$store.state.username.split('@')[0] }}.<br><br>
        </h2>
        <div class="wrapper">
          <div id="apps">
            <div class="card text-white pb-3 shadow-box">
              <h3 class="p-1">Apps</h3>
              <section
                class="container">
                <div class="md:flex justify-between text-white mt-3"
                     style="border-radius: 1rem;">
                  <button class="btn btn-outline-light btn-lg text-start" style="width: 200px"
                          v-on:click="gotoPlanner">
                    <i class="bi bi-wrench-adjustable-circle p-1"></i><span class="font-bold"> Planner</span>
                  </button>
                  <h3 class="hidden lg:block text-end" style="font-weight: lighter">Kanban Board</h3>
                </div>
                <div class="md:flex justify-between text-white mt-3"
                     style="border-radius: 1rem;">
                  <button class="btn btn-outline-light btn-lg text-start" style="width: 200px"
                          v-on:click="gotoClarifier">
                    <i class="bi bi-chat-dots p-1"></i><span class="font-bold"> Clarifier</span>
                  </button>
                  <h3 class="hidden lg:block text-end" style="font-weight: lighter">Communication</h3>
                </div>
                <div class="md:flex justify-between text-white mt-3"
                     style="border-radius: 1rem;">
                  <button class="btn btn-outline-light btn-lg text-start" style="width: 200px"
                          v-on:click="gotoAPI">
                    <i class="bi bi-hurricane"/><span class="font-bold"> Mockingbird</span>
                  </button>
                  <h3 class="hidden lg:block text-end" style="font-weight: lighter">SOAP/REST API Testing</h3>
                </div>
              </section>
            </div>
          </div>
          <div id="account">
            <div class="card text-white pb-3 shadow-box">
              <h3 class="p-1">What's next?</h3>
              <section
                class="container">
                <div class="md:flex justify-between text-white mt-3"
                     style="border-radius: 1rem;">
                  <div class="flex">
                    <button class="btn btn-outline-light btn-lg text-start" style="width: 200px"
                            v-on:click="showCart">
                      <i class="bi bi-cart p-1"></i><span class="font-bold"> Cart</span>
                    </button>
                    <div class="lg:flex">
                      <div class="flex">
                        <i class="bi bi-stack ms-3"></i>
                        <p class="ms-2">
                          {{ this.$store.state.cart.length }} Items
                        </p>
                      </div>
                      <div class="flex">
                        <i class="bi bi-cash-stack ms-3"></i>
                        <p class="ms-2">
                          {{ cartTotal }} €
                        </p>
                      </div>
                    </div>
                  </div>
                  <h3 class="hidden lg:block text-end" style="font-weight: lighter">Your Cart</h3>
                </div>
              </section>
              <section
                class="container">
                <div class="md:flex justify-between text-white mt-3"
                     style="border-radius: 1rem;">
                  <button class="btn btn-outline-light btn-lg text-start" style="width: 200px"
                          v-on:click="gotoInvoices">
                    <i class="bi bi-journal-text p-1"></i><span class="font-bold"> Invoices</span>
                  </button>
                  <h3 class="hidden lg:block text-end" style="font-weight: lighter">Your Invoices</h3>
                </div>
              </section>
              <section
                class="container">
                <div class="md:flex justify-between text-white mt-3"
                     style="border-radius: 1rem;">
                  <button class="btn btn-outline-light btn-lg text-start" style="width: 200px"
                          v-on:click="gotoPreferences">
                    <i class="bi bi-wrench p-1"></i><span class="font-bold"> Preferences</span>
                  </button>
                  <h3 class="hidden lg:block text-end" style="font-weight: lighter">Cookies & Trackers</h3>
                </div>
              </section>
              <section
                class="container">
                <div class="md:flex justify-between text-white mt-3"
                     style="border-radius: 1rem;">
                  <button class="btn btn-outline-light btn-lg text-start" style="width: 200px"
                          v-on:click="gotoThirdPartyAccounts">
                    <i class="bi bi-people p-1"></i><span class="font-bold"> Accounts</span>
                  </button>
                  <h3 class="hidden lg:block text-end" style="font-weight: lighter">3rd Party Accounts</h3>
                </div>
              </section>
              <section
                class="container">
                <div class="md:flex justify-between text-white mt-3"
                     style="border-radius: 1rem;">
                  <button class="btn btn-outline-light btn-lg text-start" style="width: 200px"
                          v-on:click="logout">
                    <i class="bi bi-door-open p-1"></i><span class="font-bold"> Logout</span>
                  </button>
                  <h3 class="hidden lg:block text-end" style="font-weight: lighter">See you soon</h3>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'

export default {
  data () {
    return {
      angleC3: '180',
      colorA2: 'rebeccapurple',
      colorB1: 'darkblue'
    }
  },
  computed: {
    bg3 () {
      return `linear-gradient(${this.angleC3}deg, ${this.colorB1}, ${this.colorA2})`
    },
    cartTotal () {
      let total = 0
      for (let i = 0; i < this.$store.state.cart.length; i++) {
        total += (this.$store.state.cart[i].price * this.$store.state.cart[i].amount)
      }
      return total
    }
  },
  methods: {
    isLoggedIn () {
      return this.$store.state.authenticated
    },
    showCart () {
      this.$router.push('/cart')
    },
    logout () {
      if (this.isLoggedIn()) {
        const headers = new Headers()
        headers.set(
          'Authorization',
          'Basic ' + Base64.encode(this.$store.state.email + ':' + this.$store.state.password)
        )
        fetch(
          this.$store.state.serverIP + '/logout',
          {
            method: 'get',
            headers: headers
          }
        )
        this.$store.commit('logOut')
        this.$store.commit('clearCart')
        this.$router.push('/login?redirect=/account')
      }
    },
    gotoPreferences () {
      this.$router.push('/preferences?redirect=/account')
    },
    gotoAPI () {
      this.$router.push('/dev/api')
    },
    gotoInvoices () {
      this.$router.push('/invoices')
    },
    gotoPlanner () {
      this.$router.push('/apps/planner/_user')
    },
    gotoClarifier () {
      this.$router.push('/apps/clarifier')
    },
    gotoThirdPartyAccounts () {
      this.$router.push('/thirdparty')
    }
  }
}
</script>

<style scoped>

.doHover {
  animation: hover 3s ease-in-out infinite;
}

@keyframes hover {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(10%);
  }
  100% {
    transform: translateY(0);
  }
}

.wrapper {
  display: grid;
  gap: 2em;
  grid-auto-rows: minmax(100px, auto);
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 300px) {
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

.shadow-box {
  background-color: rgba(0, 0, 0, 0.6);
  box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.6);
  border-radius: 1em
}

</style>
