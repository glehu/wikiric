<template>
  <div id="root" class="home">
    <Disclosure as="nav" class="bg-neutral-900 fixed-top border-b border-neutral-700"
                v-slot="{ open }">
      <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div class="relative flex items-center justify-between"
             style="height: 60px; max-height: 60px; min-height: 60px">
          <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span class="sr-only">Open main menu</span>
              <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true"/>
              <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true"/>
            </DisclosureButton>
          </div>
          <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div class="flex-shrink-0 flex items-center text-white font-bold cursor-pointer"
                 v-on:click="$router.push('/')">
              <div class="block lg:hidden w-auto">wikiric.xyz</div>
              <div class="hidden lg:block w-auto">wikiric.xyz</div>
            </div>
            <div class="hidden sm:block sm:ml-6">
              <div class="flex space-x-2 items-center">
                <div v-for="item in navigation" :key="item.name"
                     v-on:click="$router.push(item.href)"
                     :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium cursor-pointer']"
                     :aria-current="item.current ? 'page' : undefined">
                  {{ item.name }}
                </div>
                <Combobox v-model="selected">
                  <div class="relative">
                    <div
                      class="relative w-full cursor-default overflow-hidden rounded-lg bg-neutral-400 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                    >
                      <ComboboxInput
                        id="cboxinput"
                        class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                        :displayValue="(nav) => nav.name"
                        @change="query = $event.target.value"
                      />
                      <ComboboxButton
                        class="absolute inset-y-0 right-0 flex items-center pr-2"
                      >
                        <ArrowsUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true"/>
                      </ComboboxButton>
                    </div>
                    <TransitionRoot
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                      @after-leave="query = ''"
                    >
                      <ComboboxOptions
                        class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                      >
                        <div
                          v-if="filteredPeople.length === 0 && query !== ''"
                          class="relative cursor-default select-none py-2 px-4 text-gray-700"
                        >
                          Nothing found.
                        </div>

                        <ComboboxOption
                          v-for="nav in filteredPeople"
                          as="template"
                          :key="nav.name"
                          :value="nav"
                          v-slot="{ selected, active }"
                        >
                          <li
                            class="relative cursor-default select-none py-2 pl-10 pr-4"
                            :class="{
                  'bg-teal-600 text-white': active,
                  'text-gray-900': !active,
                }"
                          >
                <span
                  class="block truncate"
                  :class="{ 'font-medium': selected, 'font-normal': !selected }"
                >
                  {{ nav.name }}
                </span>
                            <span
                              v-if="selected"
                              class="absolute inset-y-0 left-0 flex items-center pl-3"
                              :class="{ 'text-white': active, 'text-teal-600': !active }"
                            >
                </span>
                          </li>
                        </ComboboxOption>
                      </ComboboxOptions>
                    </TransitionRoot>
                  </div>
                </Combobox>
              </div>
            </div>
          </div>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button type="button"
                    class="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span class="sr-only">View notifications</span>
              <BellIcon class="h-6 w-6" aria-hidden="true"/>
            </button>
            <Menu as="div" class="ml-3 relative">
              <div>
                <MenuButton
                  class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <span class="sr-only">Open user menu</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                       stroke="currentColor" class="w-8 h-8 rounded-full text-gray-400 p-1 hover:text-white">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                  </svg>
                </MenuButton>
              </div>
              <transition enter-active-class="transition ease-out duration-100"
                          enter-from-class="transform opacity-0 scale-95"
                          enter-to-class="transform opacity-100 scale-100"
                          leave-active-class="transition ease-in duration-75"
                          leave-from-class="transform opacity-100 scale-100"
                          leave-to-class="transform opacity-0 scale-95">
                <MenuItems
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <template v-if="isLoggedIn">
                    <MenuItem v-slot="{ active }">
                      <a v-on:click="$router.push('/account')"
                         :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700 cursor-pointer']">
                        Your Profile
                      </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <a v-on:click="$router.push('/preferences')"
                         :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700 cursor-pointer']">
                        Settings
                      </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <a v-on:click="logout()"
                         :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700 cursor-pointer']">
                        Sign Out
                      </a>
                    </MenuItem>
                  </template>
                  <template v-else>
                    <MenuItem v-slot="{ active }">
                      <a v-on:click="$router.push('/login?redirect=/account')"
                         :class="[active ? 'bg-gray-200' : '', 'block px-4 py-2 text-sm text-gray-700 cursor-pointer']">
                        <i class="bi bi-key mr-3"></i> Sign In
                      </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <a v-on:click="$router.push('/register?redirect=/account')"
                         :class="[active ? 'bg-gray-200' : '', 'block px-4 py-2 text-sm text-gray-700 cursor-pointer']">
                        <i class="bi bi-person-plus mr-3"></i> Sign Up
                      </a>
                    </MenuItem>
                  </template>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>
      <DisclosurePanel class="sm:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <DisclosureButton v-for="item in navigation" :key="item.name" as="a"
                            v-on:click="$router.push(item.href)"
                            :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block px-3 py-2 rounded-md text-base font-medium']"
                            :aria-current="item.current ? 'page' : undefined">
            {{ item.name }}
          </DisclosureButton>
          <input type="text"
                 class="keyword-search w-72 font-bold block mx-3 my-2 p-1"
                 id="keyword-search-small"
                 v-model="keywordSmall"
                 v-on:keyup.enter="processKeyword(keywordSmall)"
                 placeholder="Search"
                 list="keywords">
        </div>
      </DisclosurePanel>
    </Disclosure>
    <div style="min-height: 100vh" class="bg-neutral-900">
      <router-view/>
    </div>
    <notifications position="bottom right"/>
  </div>
</template>

<script setup>
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot
} from '@headlessui/vue'

import {
  BellIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

import { ArrowsUpDownIcon } from '@heroicons/vue/24/solid'

</script>

<script>
import { Base64 } from 'js-base64'
import firebase from 'firebase/app'
import 'firebase/firebase-messaging'
import { ref, computed } from 'vue'

const navigationDrop = [
  {
    name: 'Clarifier',
    href: '/apps/clarifier',
    current: false
  },
  {
    name: 'Planner',
    href: '/apps/planner/_user',
    current: false
  }
]

const selected = ref({ name: 'ctrl-y' })
const query = ref('')

const filteredPeople = computed(() =>
  query.value === ''
    ? navigationDrop
    : navigationDrop.filter((nav) =>
      nav.name
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(query.value.toLowerCase().replace(/\s+/g, ''))
    )
)

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

    // Broadcast channel to listen to firebase cloud messaging notifications
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
      // Forward the notification to the clarifier
      bc.postMessage(payload)
    })

    window.addEventListener('keydown', function (event) {
      if (event.ctrlKey && event.key === 'y') {
        event.preventDefault()
        const keywordSearch = document.getElementById('cboxinput')
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
      keyword: '',
      keywordSmall: '',
      navigation: [
        {
          name: 'Clarifier',
          href: '/apps/clarifier',
          current: false
        },
        {
          name: 'Planner',
          href: '/apps/planner/_user',
          current: false
        }
      ]
    }
  },
  methods: {
    checkServerIP () {
      this.$store.commit('setServerIP', 'https://wikiric.xyz')
    },
    serverLogin: function () {
      if (this.$store.state.email === '') return
      const headers = new Headers()
      headers.set(
        'Authorization',
        'Basic ' + Base64.encode(this.$store.state.email + ':' + this.$store.state.password)
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
      if (term == null) return
      switch (term) {
        case 'home':
          this.$router.push('/')
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
              text: 'No results for <' + this.keyword + '>. Try something else maybe?',
              type: 'error'
            })
      }
      this.keyword = ''
      this.keywordSmall = ''
      document.activeElement.blur()
    },
    logout () {
      if (this.isLoggedIn) {
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
