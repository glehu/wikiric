<template>
  <div id="root" class="home">
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top" style="background-color: black">
      <div class="container">
        <!--<a href="#" class="navbar-brand fw-bold">
          <img src="../public/favicon.png" alt=""/>
          Orochi Batsuzoku
        </a>-->
        <a class="navbar-brand fw-bold" href="/">wikiric.xyz</a>
        <input class="keyword-search"
               id="keyword-search"
               style="width: 20ch; font-weight: bold"
               v-model="keyword"
               v-on:keyup.enter="processKeyword(keyword)"
               placeholder="ctrl+y"
               list="keywords">
        <!-- Autocompletion List -->
        <datalist id="keywords">
          <option value="About"/>
          <option value="Account"/>
          <option value="API Manager"/>
          <option value="Artists"/>
          <option value="Cart"/>
          <option value="Chat"/>
          <option value="Clarifier"/>
          <option value="Discover"/>
          <option value="Home"/>
          <option value="Invoices"/>
          <option value="Mockingbird"/>
          <option value="Planner"/>
          <option value="Preferences"/>
          <option value="Settings"/>
          <option value="Shop"/>
          <option value="Songs"/>
        </datalist>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navmenu"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse navm" id="navmenu">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item" data-bs-toggle="collapse" data-bs-target="#navmenu">
              <router-link to="/" class="nav-link fw-bold">
                <span style="color: white">
                  <i class="bi bi-house"></i> Home</span>
              </router-link>
            </li>
            <li class="nav-item" data-bs-toggle="collapse" data-bs-target="#navmenu">
              <router-link to="/artists" class="nav-link fw-bold">
                <span style="color: white">
                  <i class="bi bi-people"></i> Artists</span>
              </router-link>
            </li>
            <li class="nav-item" data-bs-toggle="collapse" data-bs-target="#navmenu">
              <router-link to="/songs" class="nav-link fw-bold">
                <span style="color: white">
                  <i class="bi bi-music-note"></i> Songs</span>
              </router-link>
            </li>
            <li class="nav-item" data-bs-toggle="collapse" data-bs-target="#navmenu">
              <router-link to="/shop" class="nav-link fw-bold">
                <span style="color: white">
                  <i class="bi bi-shop-window"></i> Shop</span>
              </router-link>
            </li>
            <li class="nav-item" data-bs-toggle="collapse" data-bs-target="#navmenu">
              <router-link to="/about" class="nav-link fw-bold">
                <span style="color: white">
                  <i class="bi bi-question-circle"></i> About</span>
              </router-link>
            </li>
            <!-- Account -->
            <li v-if="isLoggedIn"
                class="nav-item" data-bs-toggle="collapse" data-bs-target="#navmenu">
              <router-link to="/account" class="nav-link">
                <span style="color: white">
                  <i class="bi bi-person-bounding-box"></i> {{ this.$store.state.username.split('@')[0] }}
                  (<i class="bi bi-stack small"></i> {{ this.$store.state.cart.length }})
                </span>
              </router-link>
            </li>
            <li v-else
                class="nav-item" data-bs-toggle="collapse" data-bs-target="#navmenu">
              <router-link to="/login?redirect=/account" class="nav-link">
                <span style="color: white">
                  <i class="bi bi-person-bounding-box"></i> Login
                  (<i class="bi bi-stack small"></i> {{ this.$store.state.cart.length }})
                </span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div style="min-height: 100vh; background-color: #0A0A0F">
      <router-view/>
    </div>
    <notifications position="bottom right"/>
  </div>
</template>

<style scoped>

@font-face {
  font-family: "JetBrains Mono Medium";
  font-style: normal;
  font-display: auto;
  src: local("JetBrains Mono Medium"), url(./assets/fonts/JetBrainsMono-Medium.ttf) format("truetype");
}

@font-face {
  font-family: "JetBrains Mono Bold";
  font-style: normal;
  font-display: auto;
  src: local("JetBrains Mono Bold"), url(./assets/fonts/JetBrainsMono-Bold.ttf) format("truetype");
}

.keyword-search:focus {
  height: 3ch;
  font-size: 125%;
  transition: 0.5s ease-out;
}

.keyword-search:focus::placeholder {
  color: transparent;
}

.navbar {
  min-height: 60px;
}

@media only screen and (min-width: 992px) {
  .nav-link {
    padding-top: 0;
    padding-bottom: 0;
  }
}

</style>

<script>
import { Base64 } from 'js-base64'
import firebase from 'firebase/app'
import 'firebase/firebase-messaging'

export default {
  mounted () {
    this.checkServerIP()
    this.serverLogin()

    const firebaseConfig = {
      apiKey: 'AIzaSyDMz_cfwofnEW7d49795IhtOBZgmrJtyqA',
      authDomain: 'wikiric-bcd62.firebaseapp.com',
      projectId: 'wikiric-bcd62',
      storageBucket: 'wikiric-bcd62.appspot.com',
      messagingSenderId: '1096845773501',
      appId: '1:1096845773501:web:08c1e315c26ea9401685d4',
      measurementId: 'G-4ECZ10SYLF'
    }

    firebase.initializeApp(firebaseConfig)

    const bc = new BroadcastChannel('dlChannel')
    bc.onmessage = event => {
      this.serverLogin()
      if (event.data.subchatGUID) {
        window.location.href = event.data.destination + '?sub=' + event.data.subchatGUID
      } else {
        window.location.href = event.data.destination
      }
    }

    // eslint-disable-next-line no-unused-vars
    const messaging = firebase.messaging()

    messaging.getToken({ vapidKey: 'BOzbV7unTf_hYvuQj6sjJkJ-5G6msi1sLNc3-8zJ6VBtOrrxTnGRjob0fck7A8V8scucPw_hq3ReBDCljZTrC9g' }).then((currentToken) => {
      if (currentToken) {
        this.$store.commit('setFCMToken', currentToken)
      } else {
        console.log('No registration token available. Request permission to generate one.')
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err)
    })

    messaging.onMessage((payload) => {
      console.log('Message received. ', payload)
      if (!this.$route.fullPath.includes('/clarifier/wss/')) {
        this.$notify(
          {
            title: payload.notification.title,
            text: payload.notification.body,
            type: 'info'
          })
      }
    })

    window.addEventListener('keydown', function (event) {
      if (event.ctrlKey && event.key === 'y') {
        event.preventDefault()
        const keywordSearch = document.getElementById('keyword-search')
        keywordSearch.focus()
        keywordSearch.select()
      }
    })
  },
  data () {
    return {
      angle: '45',
      color1: 'darkred',
      color2: 'rebeccapurple',
      keyword: ''
    }
  },
  methods: {
    checkServerIP () {
      this.$store.commit('setServerIP', 'https://wikiric.xyz')
    },
    serverLogin: function () {
      if (this.$store.state.username === undefined || this.$store.state.username === '') return
      const headers = new Headers()
      headers.set(
        'Authorization',
        'Basic ' + Base64.encode(this.$store.state.username + ':' + this.$store.state.password)
      )
      fetch(
        this.$store.state.serverIP + '/login',
        {
          method: 'get',
          headers: headers
        }
      )
        .then((res) => res.json())
        .then((data) => (this.loginResponse = JSON.parse(data.contentJson)))
        .then(this.processLogin)
        .catch((err) => this.$notify(
          {
            title: 'Unable to Login',
            text: err.message,
            type: 'error'
          }))
    },
    processLogin: function () {
      if (this.loginResponse.httpCode === 200) {
        this.$store.commit('setServerToken', this.loginResponse.token)
      }
    },
    processKeyword: function (keyword) {
      const term = keyword.toLowerCase().replace(' ', '')
      if (term === undefined || term === '') return
      switch (term) {
        case 'home':
          this.$router.push('/')
          break
        case 'discover':
          this.$router.push('/discover')
          break
        case 'artists':
          this.$router.push('/artists')
          break
        case 'songs':
          this.$router.push('/songs')
          break
        case 'shop':
          this.$router.push('/shop')
          break
        case 'about':
          this.$router.push('/about')
          break
        case 'account':
          if (this.isLoggedIn) {
            this.$router.push('/account')
          } else {
            this.$router.push('/login?redirect=/account')
          }
          break
        case 'cart':
          this.$router.push('/cart')
          break
        case 'invoices':
          this.$router.push('/invoices')
          break
        case 'preferences':
        case 'settings':
          this.$router.push('/preferences?redirect=/account')
          break
        case 'planner':
          this.$router.push('/apps/planner/_user')
          break
        case 'apimanager':
        case 'mockingbird':
          this.$router.push('/dev/api')
          break
        case 'chat':
        case 'clarifier':
          this.$router.push('/apps/clarifier')
          break
        default:
          this.$notify(
            {
              title: 'Nothing Found :(',
              text: 'No results for ' + this.keyword + '. Try something else maybe?',
              type: 'error'
            })
      }
      this.keyword = ''
      document.activeElement.blur()
    }
  },
  computed: {
    bg () {
      return `linear-gradient(${this.angle}deg, ${this.color1}, ${this.color2})`
    },
    isLoggedIn () {
      return this.$store.state.authenticated
    }
  }
}
</script>
