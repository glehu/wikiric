<template>
  <section id="content"
           style="min-height: 100vh; width: 100vw; overflow: hidden; position: absolute; background-color: #0A0A0F">
    <div class="container mt-4 mt-md-0"
         style="color: white; width: 100vw; min-height: 100vh; display: flex; align-items: center">
      <div class="wrapper" style="margin-bottom: 20px; margin-top: 50px">
        <div id="header_title">
          <div style="background-color: #101010; border-radius: 95% 0 50% 0; font-family: 'Lato', sans-serif"
               :style="{backgroundImage: 'url('+require('@/assets/'+'account/pexels-anni-roenkae-2156881.jpg')+')',
                  backgroundPosition: 'center top', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }">
            <h2 style="font-style: italic;
                font-size: clamp(3rem, 4vw, 7rem); margin: 0">
              Build your
            </h2>
            <h1 style="font-weight: bold; font-style: italic;
                font-size: clamp(4rem, 8vw, 7rem); margin: 0; text-shadow: 5px 5px #101010">
              Enterprise Network
            </h1>
          </div>
          <p style="font-size: 1rem; padding-top: 10px;
             color: #bebebe; width: 100%; text-align: start">
            Connect, share files and collaborate in a modern, fast and responsive environment.
          </p>
          <p style="font-size: 1rem; color: #bebebe; width: 100%; text-align: center">
            <span style="font-weight: bold">This platform grows as you do.</span>
          </p>
          <div class="d-flex justify-content-center" style="margin-top: 0.5em">
            <button class="btn btn-lg btn-outline-light muArrow fw-bold"
                    v-on:click="gotoClarifier()"
                    style="width: 50%">
              <i class="sb_link_icon bi bi-app-indicator"></i>
              Explore
            </button>
            <button v-show="!isLoggedIn"
                    class="btn btn-lg btn-outline-light muArrow fw-bold"
                    v-on:click="gotoRegister()"
                    style="width: 50%">
              <i class="sb_link_icon bi bi-stars"></i>
              Register
            </button>
            <button v-show="isLoggedIn"
                    class="btn btn-lg btn-outline-light muArrow fw-bold"
                    v-on:click="gotoAccount()"
                    style="width: 50%">
              <i class="sb_link_icon bi bi-person-bounding-box"></i>
              Account
            </button>
          </div>
        </div>
        <div>
          <img src='@/assets/clarifier/clarifier_demo.png' alt=""
               style="width: 100%; border-radius: 10px;
               background-color: #101010; padding-top: 10px; padding-bottom: 10px">
          <p style="font-weight: lighter; font-size: clamp(1rem, 1.5vw, 1.25rem);
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
