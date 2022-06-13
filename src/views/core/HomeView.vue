<template>
  <section id="content"
           style="min-height: 100vh; max-width: 100vw; width: 100%;
           overflow: hidden; position: absolute"
           :style="{ backgroundImage: 'url('+require('@/assets/'+'account/pexels-emre-can-acer-2449364.jpg')+')',
                     backgroundPosition: 'top center', backgroundRepeat: 'no-repeat', backgroundSize: 'fit' }">
    <div class="header-margin"></div>
    <div style="color: white; width: 100vw; display: flex; padding: 20px 5vw 0 5vw;">
      <div style="margin-bottom: 20px">
        <div id="header_title" style="border-left: 4px dotted #101010; padding-left: 20px">
          <h2 style="font-style: italic; color: black; pointer-events: none;
                font-size: clamp(3rem, 4vw, 7rem); margin: 0">
            Build your
          </h2>
          <div style="border-radius: 95% 25% 75% 0; font-family: 'Lato', sans-serif">
            <!--:style="{backgroundImage: 'url('+require('@/assets/'+'account/pexels-anni-roenkae-2156881.jpg')+')',
               backgroundPosition: 'center top', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }"-->
            <h1 style="font-weight: bold; font-style: italic; pointer-events: none;
                font-size: clamp(4rem, 8vw, 7rem); margin: 0; color: black">
              Enterprise Network
            </h1>
          </div>
          <p style="font-size: 1rem; padding-top: 10px; pointer-events: none;
             color: black; width: 100%; text-align: center">
            Connect, share files and collaborate in a modern, fast and responsive environment.
          </p>
          <p style="font-size: 1rem; color: black; width: 100%; text-align: center;
                    pointer-events: none;">
            <span style="font-weight: bold">This platform grows as you do.</span>
          </p>
        </div>
        <div class="d-flex justify-content-between" style="margin-top: 0.5em">
          <button class="btn btn-lg btn-dark muArrow fw-bold"
                  v-on:click="gotoClarifier()"
                  style="width: 45%; border: 2px solid #101010">
            <i class="sb_link_icon bi bi-app-indicator"></i>
            Explore
          </button>
          <button v-show="!isLoggedIn"
                  class="btn btn-lg btn-light muArrow fw-bold"
                  v-on:click="gotoRegister()"
                  style="width: 45%; border: 2px solid #101010">
            <i class="sb_link_icon bi bi-stars"></i>
            Register
          </button>
          <button v-show="isLoggedIn"
                  class="btn btn-lg btn-light muArrow fw-bold"
                  v-on:click="gotoAccount()"
                  style="width: 45%; border: 2px solid #101010">
            <i class="sb_link_icon bi bi-person-bounding-box"></i>
            Account
          </button>
        </div>
        <div style="margin-top: 25px">
          <img src='@/assets/clarifier/clarifier_demo.png' alt=""
               style="width: 100%; border-radius: 10px;
               background-color: #101010; padding-top: 10px; padding-bottom: 10px">
          <p style="font-weight: lighter; font-size: clamp(1rem, 1.5vw, 1.25rem);
                    pointer-events: none;
                    color: #bebebe; width: 100%; text-align: center">
            Available as a Progressive Web App for all devices.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    scrollTo (content) {
      document.getElementById(content).scrollIntoView({ behavior: 'smooth' })
    },
    gotoRegister () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'home',
          action: 'gotoRegister'
        })
      }
      this.$router.push('/register')
    },
    gotoAccount () {
      this.$router.push('/account')
    },
    gotoClarifier () {
      this.$router.push('/apps/clarifier')
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
    }
  },
  computed: {
    isLoggedIn () {
      return this.$store.state.authenticated
    },
    usageTracker () {
      return this.$store.state.usageTracking
    }
  }
}
</script>

<style scoped>

.header-margin {
  min-height: 60px;
}

.b_purple {
  background-color: #68349b;
}

.c_purple {
  color: #68349b;
}

.b_darkblue {
  background-color: #041830;
}

.c_darkblue {
  color: #041830;
}

.b_darkgray {
  background-color: #192129;
}

.c_darkgray {
  color: #192129;
}

.b_darkergray {
  background-color: #101010;
}

.c_darkergray {
  color: #101010;
}

.b_gray {
  background-color: #293139;
}

.c_gray {
  color: #293139;
}

.c_lightgray {
  color: #aeaeb7;
}

.b_orange {
  background-color: #ff5d37;
}

.c_orange {
  color: #ff5d37;
}

.wrapper {
  display: grid;
  gap: 50px;
  grid-auto-rows: minmax(100px, auto);
  grid-template-columns: repeat(1, 1fr);
}

/* Small devices (portrait tablets and large phones, 765px and up) */
@media only screen and (min-width: 992px) {
  .wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}

.shadow-box {
  box-shadow: -10px 10px 20px 15px rgba(0, 0, 0, 0.8);
  border-radius: 1em
}

.darkbutton {
  background-color: #192129;
}

.darkbutton:hover {
  background-color: #303c46;
}

.purplehover {
  color: #68349b;
  text-shadow: 0 0 10px #7b40b4;
}

.darkbutton:hover > .purplehover {
  color: #46b59b;
  text-shadow: 0 0 15px #46b59b;
}

.muArrow, .mdArrow {
  position: relative;
  top: 0;
  transition: top ease 0.5s;
}

.muArrow:hover {
  top: -8px;
}

.mdArrow:hover {
  top: +8px;
}

</style>
