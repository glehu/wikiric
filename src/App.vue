<template>
  <div id="root" class="home z-0 w-full darkest_bg">
    <navbarelem class="fixed top-0 z-20"></navbarelem>
    <!-- More Than A Dream -->
    <div id="router_view_elem" ref="router_view_elem"
         class="fixed top-0 left-0 z-10 w-full darkest_bg">
      <router-view/>
      <template v-if="incomingCall">
        <div class="w-full h-full absolute left-0 top-0 flex items-center justify-center
                    backdrop-brightness-50"
             style="z-index: 9999">
          <div class="p-8 font-bold darkest_bg rounded-md border-2 border-zinc-600">
            <p class="w-full text-center">Incoming Call</p>
            <p class="w-full text-center my-3 text-xl">{{ call.srcUsername }}</p>
            <div class="flex items-center justify-evenly w-full p-1 mt-4 gap-x-4">
              <PhoneIcon
                v-on:click="acceptCall()"
                class="min-w-[58px] min-h-[58px] max-w-[58px] max-h-[58px]
                       text-emerald-500 p-2 rounded-md hover:medium_bg cursor-pointer"></PhoneIcon>
              <PhoneXMarkIcon
                v-on:click="incomingCall = false"
                class="min-w-[58px] min-h-[58px] max-w-[58px] max-h-[58px]
                       text-red-500 p-2 rounded-md hover:medium_bg cursor-pointer"></PhoneXMarkIcon>
            </div>
          </div>
        </div>
      </template>
      <template v-if="updateExists">
        <div class="w-full h-full absolute left-0 top-0 flex items-center justify-center
                    backdrop-brightness-50"
             style="z-index: 9999">
          <div class="p-8 font-bold darkest_bg rounded-md border-2 border-zinc-600 text-neutral-300">
            <p class="text-2xl font-bold text-neutral-200">Update Available!</p>
            <div class="flex items-center justify-center">
              <button class="btn_bg_primary my-4"
                      v-on:click="refreshApp">
                Update
              </button>
            </div>
            <p class="mt-4 mb-2 italic text-sm">Changelog:</p>
            <p class="text-neutral-400 text-xs italic">(Coming Soon)</p>
          </div>
        </div>
      </template>
    </div>
    <notifications position="bottom right"/>
  </div>
</template>

<script>
import navbarelem from './views/core/Navbar.vue'
import updater from './mixins/wUpdate'
import firebase from 'firebase/app'
import 'firebase/firebase-messaging'
import { PhoneIcon, PhoneXMarkIcon } from '@heroicons/vue/24/solid'

export default {
  components: {
    navbarelem,
    PhoneIcon,
    PhoneXMarkIcon
  },
  mounted () {
    this.initFunction()
  },
  mixins: [updater],
  data () {
    return {
      angle: '45',
      color1: 'darkred',
      color2: 'rebeccapurple',
      connector: null,
      incomingCall: false,
      call: {}
    }
  },
  methods: {
    initFunction: async function () {
      this.checkServerIP()
      this.$store.commit('logOut')

      this.connector = new BroadcastChannel('connector')
      this.connector.onmessage = event => {
        if (event.data.type === 'incoming call') {
          this.incomingCall = true
          this.call = event.data
        }
      }

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
            this.$router.push('/redirect?redirect=' + event.data.destination + '?sub=' + event.data.subchatGUID)
          } else {
            if (event.data.destination != null) {
              console.debug('firebase->dlChannel->connect as GENERAL', event.data.destination)
              this.$router.push('/redirect?redirect=' + event.data.destination)
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
    checkServerIP: function () {
      this.$store.commit('setServerIP', 'https://wikiric.xyz')
    },
    logout: async function () {
      if (!this.isLoggedIn) return
      await this.$Worker.execute({
        action: 'logout'
      })
      this.$store.commit('logOut')
      this.$store.commit('clearCart')
      this.$router.push('/login?redirect=/account')
    },
    acceptCall: function () {
      if (this.call.chatroomGUID) {
        this.incomingCall = false
        this.$router.push('/redirect?redirect=/apps/clarifier/wss/' + this.call.chatroomGUID + '?call=true')
      }
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
