<template>
  <div id="root" class="home z-0 w-full darkest_bg">
    <navbarelem class="backdrop-blur-xl fixed top-0 z-20" style="transform: translate3d(0, 0, 0)"></navbarelem>
    <!-- More Than A Dream -->
    <div id="router_view_elem" ref="router_view_elem"
         class="fixed top-0 left-0 z-10 w-full darkest_bg">
      <router-view/>
    </div>
    <notifications position="bottom right"/>
  </div>
</template>

<script>
import navbarelem from './views/core/Navbar.vue'
import firebase from 'firebase/app'
import 'firebase/firebase-messaging'

export default {
  components: {
    navbarelem
  },
  mounted () {
    this.initFunction()
  },
  data () {
    return {
      angle: '45',
      color1: 'darkred',
      color2: 'rebeccapurple'
    }
  },
  methods: {
    initFunction: function () {
      this.checkServerIP()
      this.$store.commit('logOut')

      const firebaseConfig = {
        apiKey: 'AIzaSyDMz_cfwofnEW7d49795IhtOBZgmrJtyqA',
        authDomain: 'wikiric-bcd62.firebaseapp.com',
        projectId: 'wikiric-bcd62',
        storageBucket: 'wikiric-bcd62.appspot.com',
        messagingSenderId: '1096845773501',
        appId: '1:1096845773501:web:08c1e315c26ea9401685d4',
        measurementId: 'G-4ECZ10SYLF'
      }

      // Initialize Firebase and its listeners etc.
      try {
        firebase.initializeApp(firebaseConfig)
        // Broadcast channel to listen to firebase cloud messaging notifications
        const bc = new BroadcastChannel('dlChannel')
        bc.onmessage = event => {
          console.debug('firebase->dlChannel->connect')
          if (event.data.subchatGUID) {
            console.debug('firebase->dlChannel->connect as SUBCHAT', event.data.subchatGUID)
            window.location.href = event.data.destination + '?sub=' + event.data.subchatGUID
          } else {
            if (event.data.destination != null) {
              console.debug('firebase->dlChannel->connect as GENERAL', event.data.destination)
              window.location.href = event.data.destination
            }
          }
        }
        // eslint-disable-next-line no-unused-vars
        const messaging = firebase.messaging()
        messaging.getToken(
          {
            vapidKey: 'BOzbV7unTf_hYvuQj6sjJkJ-5G6msi1sLNc3-8zJ6VBtOrrxTnGRjob0fck7A8V8scucPw_hq3ReBDCljZTrC9g'
          })
          .then((currentToken) => {
            if (currentToken) {
              this.$store.commit('setFCMToken', currentToken)
            } else {
              console.log('No registration token available. Request permission to generate one.')
            }
          })
          .catch((err) => {
            console.log('An error occurred while retrieving token. ', err)
          })
        messaging.onMessage((payload) => {
          console.log('Message received. ', payload)
          let notify = false
          if (payload.data.dlDest && !this.$route.fullPath.includes(payload.data.dlDest)) {
            notify = true
          }
          if (notify) {
            this.$notify(
              {
                title: payload.notification.title,
                text: payload.notification.body,
                type: 'info',
                duration: 5000
              })
            if (payload.data.dlType === 'clarifier') {
              let chatGUID
              if (payload.data.subchatGUID !== '') {
                chatGUID = payload.data.subchatGUID
              } else {
                chatGUID = payload.data.dlDest.substring(21, 36)
              }
              this.$store.commit('addClarifierTimestampNew', {
                id: chatGUID,
                ts: new Date().getTime()
              })
            }
          }
          // Forward the notification to the clarifier
          bc.postMessage(payload)
        })
      } catch (e) {
        console.debug('Firebase Config Failed!', e.message)
      }

      window.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.key === 'y') {
          event.preventDefault()
          const keywordSearch = document.getElementById('cboxinput')
          keywordSearch.focus()
          keywordSearch.select()
        }
      })
      const elem = document.getElementById('router_view_elem')
      if (elem) {
        elem.style.height = Math.floor(window.innerHeight * 1).toString() + 'px'
      }
      window.addEventListener('resize', function () {
        const elem = document.getElementById('router_view_elem')
        if (elem) {
          elem.style.height = Math.floor(window.innerHeight * 1).toString() + 'px'
        }
      })
    },
    checkServerIP () {
      this.$store.commit('setServerIP', 'https://wikiric.xyz')
    },
    async logout () {
      if (!this.isLoggedIn) return
      await this.$Worker.execute({
        action: 'logout'
      })
      this.$store.commit('logOut')
      this.$store.commit('clearCart')
      this.$router.push('/login?redirect=/account')
    }
  },
  computed: {
    bg () {
      return `linear-gradient(${this.angle}deg, ${this.color1}, ${this.color2})`
    },
    isLoggedIn () {
      return this.$store.state.authenticated
    },
    filteredNav () {
      return this.navQuery === ''
        ? this.navigation
        : this.navigation.filter((nav) =>
          nav.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(this.navQuery.toLowerCase().replace(/\s+/g, ''))
        )
    }
  }
}
</script>

<style scoped>

</style>
