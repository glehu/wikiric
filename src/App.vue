<template>
  <div id="root" class="home">
    <Disclosure as="nav" class="backdrop-blur-xl fixed-top"
                v-slot="{ open }" id="global_nav">
      <div class="px-4">
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
            <div class="flex-shrink-0 flex items-center text-neutral-200 font-bold cursor-pointer text-2xl"
                 v-on:click="$router.push('/')">
              <div class="block lg:hidden w-auto sm:ml-5">wikiric</div>
              <div class="hidden lg:block w-auto ml-5">wikiric</div>
            </div>
            <div class="hidden sm:block sm:ml-6">
              <div class="flex space-x-2 items-center">
                <template v-for="item in navigation" :key="item.name">
                  <div v-if="item.main"
                       v-on:click="$router.push(item.href)"
                       :class="[item.current ? 'bg-neutral-900 text-white' : 'text-neutral-300 hover:bg-neutral-700 hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium cursor-pointer']"
                       :aria-current="item.current ? 'page' : undefined">
                    {{ item.name }}
                  </div>
                </template>
                <Combobox v-model="navSelected" class="ml-2">
                  <div class="relative">
                    <div
                      class="relative w-full cursor-default overflow-hidden rounded-lg bg-neutral-400 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                    >
                      <div class="relative flex items-center">
                        <ComboboxInput
                          id="cboxinput"
                          placeholder="ctrl-y"
                          class="w-full border-none py-1 pl-3 pr-10 text-sm leading-5 text-neutral-900 focus:ring-0"
                          :displayValue="(nav) => nav.name"
                          @change="navQuery = $event.target.value"
                          v-on:keyup.enter="processCombo()"
                        />
                      </div>
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
                    >
                      <ComboboxOptions
                        class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                      >
                        <div
                          v-if="filteredNav.length === 0 && navQuery !== ''"
                          class="relative cursor-default select-none py-2 px-4 text-gray-700"
                        >
                          Nothing found.
                        </div>

                        <ComboboxOption
                          v-for="nav in filteredNav"
                          as="template"
                          :key="nav.name"
                          :value="nav"
                          v-slot="{ selected, active }"
                        >
                          <li
                            class="relative cursor-pointer select-none py-2 pl-10 pr-4 hover:text-blue-600"
                            :class="{'bg-gray-300': active }"
                            v-on:click="processCombo()"
                          >
                            <div
                              class="block truncate"
                              :class="{ 'font-medium': selected, 'font-normal': !selected }"
                            >
                              {{ nav.name }}
                            </div>
                            <div
                              v-if="selected"
                              class="absolute inset-y-0 left-0 flex items-center pl-3"
                              :class="{ 'text-white': active }">
                            </div>
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
                    class="p-1 rounded-full text-neutral-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
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
                         :class="[active ? 'bg-neutral-300' : '', 'block px-4 py-2 text-sm text-neutral-700 cursor-pointer']">
                        Your Profile
                      </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <a v-on:click="$router.push('/preferences')"
                         :class="[active ? 'bg-neutral-300' : '', 'block px-4 py-2 text-sm text-neutral-700 cursor-pointer']">
                        Settings
                      </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <a v-on:click="logout()"
                         :class="[active ? 'bg-neutral-300' : '', 'block px-4 py-2 text-sm text-neutral-700 cursor-pointer']">
                        Sign Out
                      </a>
                    </MenuItem>
                  </template>
                  <template v-else>
                    <MenuItem v-slot="{ active }">
                      <a v-on:click="$router.push('/login?redirect=/account')"
                         :class="[active ? 'bg-neutral-300' : '', 'block px-4 py-2 text-sm text-neutral-700 cursor-pointer']">
                        <i class="bi bi-key mr-3"></i> Sign In
                      </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <a v-on:click="$router.push('/register?redirect=/account')"
                         :class="[active ? 'bg-neutral-300' : '', 'block px-4 py-2 text-sm text-neutral-700 cursor-pointer']">
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
          <template v-for="item in navigation" :key="item.name">
            <DisclosureButton v-if="item.main" as="a"
                              v-on:click="$router.push(item.href)"
                              :class="[item.current ? 'bg-neutral-900 text-white' : 'text-neutral-300 hover:bg-neutral-700 hover:text-white', 'block px-3 py-2 rounded-md text-base font-medium cursor-pointer']"
                              :aria-current="item.current ? 'page' : undefined">
              {{ item.name }}
            </DisclosureButton>
          </template>
        </div>
      </DisclosurePanel>
    </Disclosure>
    <!-- More Than A Dream -->
    <div id="router_view_elem"
         class="absolute top-0 left-0 w-full bg-zinc-900">
      <router-view/>
    </div>
    <notifications position="bottom right"/>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firebase-messaging'
import { toRaw } from 'vue'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionRoot
} from '@headlessui/vue'

import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'

import { ArrowsUpDownIcon } from '@heroicons/vue/24/solid'

export default {
  components: {
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
    TransitionRoot,
    BellIcon,
    Bars3Icon,
    XMarkIcon,
    ArrowsUpDownIcon
  },
  mounted () {
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
      elem.style.minHeight = (window.innerHeight * 0.01 * 100).toString() + 'px'
    }
    window.addEventListener('resize', function () {
      const elem = document.getElementById('router_view_elem')
      if (elem) {
        elem.style.minHeight = (window.innerHeight * 0.01 * 100).toString() + 'px'
      }
    })
  },
  data () {
    return {
      angle: '45',
      color1: 'darkred',
      color2: 'rebeccapurple',
      navQuery: '',
      navSelected: { name: '' },
      navigation: [
        {
          name: 'Home',
          href: '/',
          current: false,
          main: false
        },
        {
          name: 'About',
          href: '/about',
          current: false,
          main: true
        },
        {
          name: 'Account',
          href: '/account',
          current: false,
          main: false
        },
        {
          name: 'Cookie Settings',
          href: '/preferences',
          current: false,
          main: false
        },
        {
          name: 'Chat',
          href: '/apps/clarifier',
          current: false,
          main: false
        },
        {
          name: 'Planner',
          href: '/apps/plannernew',
          current: false,
          main: false
        },
        {
          name: 'Tasks',
          href: '/apps/plannernew',
          current: false,
          main: false
        }
      ]
    }
  },
  methods: {
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
    },
    processCombo: function () {
      setTimeout(() => {
        const value = toRaw(this.navSelected)
        if (value.href == null) {
          return
        }
        this.$router.push(value.href)
        this.navQuery = ''
        this.navSelected = { name: '' }
      }, 100)
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

</style>
