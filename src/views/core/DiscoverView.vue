<template>
  <!-- Artist -->
  <div id="graffitifalls" class="d-md-block d-none"
       style="min-height: 100vh; max-height: 100vh; max-width: 100vw ;overflow: hidden; background-color: black"
       :style="{ backgroundImage: 'url('+require('@/assets/'+'graffitifalls/Banner.png')+')',
       backgroundPosition: 'center top', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }">
    <div class="text-white"
         style="width: 250px; height: 50px; position: absolute; top: 38%; left: 10%; margin: -25px 0 0 -125px;">
      <div>
        <p class="font-bold text-white">You can find us on those platforms:</p>
        <div class="text-white">
          <button title="SoundCloud"
                  class="btn bi-cloud-fill btn-lg muArrow" style="color: white;"
                  v-on:click="redirectSoundcloudGraffitiFalls"><span class="ms-2 small">SoundCloud</span></button>
          <br>
          <button title="Youtube"
                  class="btn bi-youtube btn-lg muArrow" style="color: white;"
                  v-on:click="redirectYoutubeGraffitiFalls"><span class="ms-2 small">Youtube</span></button>
          <br>
          <button title="Instagram"
                  class="btn bi-instagram btn-lg muArrow" style="color: white;"
                  v-on:click="redirectInstagramGraffitiFalls"><span class="ms-2 small">Instagram</span></button>
        </div>
      </div>
    </div>
    <div class="text-white"
         style="width: 250px; height: 50px; position: absolute; top: 80%; left: 50%; margin: -25px 0 0 -125px;">
      <div style="display: flex">
        <button class="btn btn-warning btn-lg muArrow font-bold mt-3"
                v-on:click="gotoArtist('graffitifalls')"
                style="width: 200px; height: 50px">
          Check 'em out!
        </button>
        <button class="btn btn-dark btn-lg muArrow font-bold mt-3"
                v-on:click="scrollTo('cloudday')"
                style="width: 50px; height: 50px">
          <i class="bi bi-box-arrow-down"></i>
        </button>
      </div>
      <button class="btn btn-success btn-lg muArrow font-bold mt-3"
              v-on:click="gotoShop"
              style="width: 250px; height: 50px">
        Buy Tickets <i class="bi bi-ticket ps-2"></i>
      </button>
    </div>
  </div>
  <div id="cloudday" class="d-md-block d-none"
       style="min-height: 100vh; max-height: 100vh; overflow: hidden; background-color: black"
       :style="{ backgroundImage: 'url('+require('@/assets/'+'cloudday/clouddaybannerformatted.png')+')',
       backgroundPosition: 'center top', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }">
    <div style="min-height: 10vh"></div>
    <div class="flex">
      <div class="container text-white">
        <h2 class="font-bold">Featured Artist:</h2>
        <p class="font-bold" style="font-size: 400%">CLOUDDAY</p>
        <div class="flex mt-2">
          <div class="mb-2" style="text-align: justify; text-justify: inter-word; width: 250px">
            <p>
              Vocals as soft as clouds, but lyrics hitting as hard as lightning.
              An artist who's catalog shines with diversity. Classics are being made
              aside highly experimental tracks, mixing together known and unknown elements.
              Take a visit to his Spotify or Soundcloud page to find out if this is something for you.
            </p>
          </div>
          <div class="ms-4" style="width: 200px">
            <div class="ms-2">
              <button title="Spotify"
                      class="btn btn-lg muArrow" style="color: white;"
                      v-on:click="redirectSpotifyCloudday">
                <img src="../../assets/spotify/Spotify_Icon_RGB_White.png" alt="Spotify"
                     style="width: 20px; height: 20px"/>
              </button>
              <br>
              <button title="Soundcloud"
                      class="btn bi-cloud-fill btn-lg muArrow mt-4" style="color: white;"
                      v-on:click="redirectSoundcloudCloudday"/>
              <br>
              <button title="Instagram"
                      class="btn bi-instagram btn-lg muArrow mt-4" style="color: white;"
                      v-on:click="redirectInstagramCloudday"/>
              <button
                class="btn mdArrow" v-on:click="scrollTo('pg1')"
                style="margin-left: 150px">
                <span class="font-bold lead" style="color: white">
                  Discover Orochi
                </span>
                <br>
                <i class="bi bi-box-arrow-down h1" style="color: white"></i>
              </button>
            </div>
          </div>
        </div>
        <div style="position: relative; top: -50px">
          <iframe src="https://open.spotify.com/embed/artist/56NVjfoRlGzoUWiZxrqj0P?utm_source=generator&theme=0"
                  width="350px" height="200" allowfullscreen=""
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
        </div>
      </div>
    </div>
  </div>
  <div id="pg1" style="min-height: 100vh; background-color: #080808; position: relative">
    <div class="container" style="position: relative;">
      <div style="display: flex; justify-content: center; align-items: center; position: relative; top: 20vh">
        <div class="items-center justify-content-between text-light p-3">
          <section class="mt-2">
            <h1 class="font-bold m-3 flex">
              <i class="bi bi-stars" style="font-size: 200%"></i><br>
              Welcome.<br>
            </h1>
            <h2>Discover a new world of possibilities for artists.</h2>
          </section>
          <hr>
          <section class="d-md-flex">
            <h1 class="font-bold text-start">
              Unleash your <span style="color: darkred; font-size: 200%">POTENTIAL</span>
            </h1>
            <h3 class="text-end font-bold">
              Whether you're a total beginner or a professional... <br><br>
              We've got you covered.
            </h3>
          </section>
          <button class="btn mdArrow" v-on:click="scrollTo('pg2')"
                  style="position: relative; width: 50px; left: 50%; margin: 10px 0 0 -25px">
            <i class="bi bi-arrow-down h1" style="color: white"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div id="pg2" style="min-height: 100vh; position: relative" :style="{ backgroundImage: bg2 }">
    <div class="container" style="position: relative;">
      <div style="display: flex; justify-content: center; align-items: center; position: relative; top: 20vh">
        <div class="items-center justify-content-between text-light p-3">
          <section class="container mt-5">
            <h1 style="font-weight: bold; color: white">Be part of the collective.</h1>
          </section>
          <hr>
          <section class="d-md-flex">
            <h1 class="font-bold text-start">
              Enjoy <span style="font-size: 200%">DIVERSITY</span>
            </h1>
            <h3 class="text-end font-bold">
              Vocalists, producers, graphics designers and video producers...<br><br>
              From <span style="font-size: 200%">19</span> countries<br>across the world.
            </h3>
          </section>
          <button class="btn mdArrow" v-on:click="scrollTo('pg3')"
                  style="position: relative; width: 50px; left: 50%; margin: 10px 0 0 -25px">
            <i class="bi bi-arrow-down h1" style="color: white"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Box View -->
  <div id="pg3" style="min-height: 100vh" :style="{ backgroundImage: bg3 }">
    <section class="container">
      <div style="display: flex; justify-content: center; align-items: center; padding-top: 20vh">
        <div class="d-md-flex text-light p-3">
          <h1 class="font-bold text-start">
          <span style="color: white; font-size: 200%">
                Join now.<br>
                0R0CHI Batsuzoku
              </span>
          </h1>
          <div class="flex ms-5">
            <div class="text-center">
              <button title="Soundcloud"
                      class="btn bi-cloud-fill btn-lg muArrow"
                      style="color: white"
                      v-on:click="redirectSoundcloud"/>
              <br>
              <button title="Discord"
                      class="btn bi-discord btn-lg muArrow mt-3"
                      style="color: white"
                      v-on:click="redirectDiscord"/>
              <br>
              <button title="Instagram"
                      class="btn bi-instagram btn-lg muArrow mt-3"
                      style="color: white"
                      v-on:click="redirectInstagram"/>
              <br>
              <button title="GitHub"
                      class="btn bi-github btn-lg muArrow mt-3"
                      style="color: white"
                      v-on:click="redirectGitHub"/>
            </div>
            <div class="ms-5">
              <button v-show="!isLoggedIn"
                      class="btn btn-outline-light btn-lg muArrow font-bold"
                      v-on:click="gotoLogin()"
                      style="width: 200px">
                Login
              </button>
              <br>
              <button v-show="!isLoggedIn"
                      class="btn btn-outline-light btn-lg muArrow font-bold mt-3"
                      v-on:click="gotoRegister()"
                      style="width: 200px">
                Register
              </button>
              <button v-show="isLoggedIn"
                      class="btn btn-outline-light btn-lg muArrow font-bold mt-3"
                      v-on:click="gotoAccount()"
                      style="width: 200px">
                Account
              </button>
              <br>
              <button class="btn btn-outline-light btn-lg muArrow font-bold mt-3"
                      v-on:click="gotoShop()"
                      style="width: 200px">
                Shop
              </button>
              <br>
              <button class="btn btn-outline-light btn-lg muArrow font-bold mt-3"
                      v-on:click="scrollTo('root')"
                      style="width: 200px">
                Beam me up
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="p-1">
      <div class="container card-group">
        <div class="row text-center">
          <div class="col-md mt-1 d-md-flex">
            <div class="card-subtitle text-white">
              <div class="card-body text-center">
                <div class="h1 mb-3">
                  <i class="bi bi-file-earmark-music"></i>
                </div>
                <h3 class="card-title">
                  Beats & Instrumentals
                </h3>
                <p class="card-text">
                  Commission beats from our many producers.
                </p>
              </div>
            </div>
          </div>
          <div class="col-md mt-1 d-md-flex">
            <div class="card-subtitle text-white">
              <div class="card-body text-center">
                <div class="h1 mb-3">
                  <i class="bi bi-mic"></i>
                </div>
                <h3 class="card-title">
                  Vocals
                </h3>
                <p class="card-text">
                  What would a song be without vocals?
                  Well, an instrumental, but that's not the point here.<br>
                </p>
              </div>
            </div>
          </div>
          <div class="col-md mt-1 d-md-flex">
            <div class="card-subtitle text-white">
              <div class="card-body text-center">
                <div class="h1 mb-3">
                  <i class="bi bi-broadcast-pin"></i>
                </div>
                <h3 class="card-title">
                  Promotion
                </h3>
                <p class="card-text">
                  We will promote your work on our many platforms.
                </p>
              </div>
            </div>
          </div>
          <div class="col-md mt-1 d-md-flex">
            <div class="card-subtitle text-white">
              <div class="card-body text-center">
                <div class="h1 mb-3">
                  <i class="bi bi-soundwave"></i>
                </div>
                <h3 class="card-title">
                  Mixing & Mastering
                </h3>
                <p class="card-text">
                  We can take care of mixing and/or mastering if needed.
                </p>
              </div>
            </div>
          </div>
          <div class="col-md mt-1 d-md-flex">
            <div class="card-subtitle text-white">
              <div class="card-body text-center">
                <div class="h1 mb-3">
                  <i class="bi bi-heart"></i>
                </div>
                <h3 class="card-title">
                  Emotional Support
                </h3>
                <p class="card-text">
                  Even if you feel lost and alone, we are here for you.
                </p>
              </div>
            </div>
          </div>
          <div class="col-md mt-1 d-md-flex">
            <div class="card-subtitle text-white">
              <div class="card-body text-center">
                <div class="h1 mb-3">
                  <i class="bi bi-shop-window"></i>
                </div>
                <h3 class="card-title">
                  Web Shop
                </h3>
                <p class="card-text">
                  Sell products and services through our own web shop solution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

export default {
  components: {},
  data () {
    return {
      angle: '45',
      angleC1: '180',
      angleC3: '-45',
      colorA1: 'darkred',
      colorA2: 'rebeccapurple',
      colorB1: 'darkblue',
      colorC1: 'gray'
    }
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
    gotoShop () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'home',
          action: 'gotoShop'
        })
      }
      this.$router.push('/shop')
    },
    gotoLogin () {
      this.$router.push('/login?redirect=/account')
    },
    gotoArtist (artist) {
      this.$router.push('/artists/' + artist)
    },
    redirectDiscord () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'home',
          action: 'redirectDiscord'
        })
      }
      window.open('https://discord.gg/pr2vwr8')
    },
    redirectInstagram () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'home',
          action: 'redirectInstagram'
        })
      }
      window.open('https://www.instagram.com/0r0chiclan/')
    },
    redirectSoundcloud () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'home',
          action: 'redirectSoundcloud'
        })
      }
      window.open('https://soundcloud.com/orochiclan')
    },
    redirectGitHub () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'home',
          action: 'redirectGitHub'
        })
      }
      window.open('https://github.com/glehu')
    },
    redirectInstagramCloudday () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'home',
          action: 'redirectInstagramCloudday'
        })
      }
      window.open('https://www.instagram.com/cloudday/')
    },
    redirectSoundcloudCloudday () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'home',
          action: 'redirectSoundcloudCloudday'
        })
      }
      window.open('https://soundcloud.com/cloudvx')
    },
    redirectSpotifyCloudday () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'home',
          action: 'redirectSpotifyCloudday'
        })
      }
      window.open('https://open.spotify.com/artist/56NVjfoRlGzoUWiZxrqj0P?si=YXgxJhWCS8WYMFsSyBTCtw')
    },
    redirectSoundcloudGraffitiFalls () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'graffitifalls',
          action: 'redirectSoundcloud'
        })
      }
      window.open('https://soundcloud.com/graffiti_falls')
    },
    redirectInstagramGraffitiFalls () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'graffitifalls',
          action: 'redirectInstagram'
        })
      }
      window.open('https://www.instagram.com/graffitifallsband/')
    },
    redirectYoutubeGraffitiFalls () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'graffitifalls',
          action: 'redirectYoutube'
        })
      }
      window.open('https://www.youtube.com/channel/UCf28Jwvrdb6Qeu8t--rBk2Q')
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
    bg2 () {
      return `linear-gradient(${this.angle}deg, ${this.colorA2}, ${this.colorB1})`
    },
    bg3 () {
      return `linear-gradient(${this.angleC3}deg, ${this.colorB1}, ${this.colorA2})`
    },
    usageTracker () {
      return this.$store.state.usageTracking
    }
  }
}
</script>

<style scoped>

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
