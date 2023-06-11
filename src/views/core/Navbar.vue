<template>
  <Disclosure as="nav" class="w-full darkest_bg"
              v-slot="{ open }" id="global_nav" :ref="'global_nav'">
    <div class="">
      <div class="relative flex items-center justify-between"
           style="height: 55px; max-height: 55px; min-height: 55px">
        <div class="absolute inset-y-0 left-0 sm:hidden
                    flex items-center justify-center
                    min-w-[55px]">
          <div class="flex-shrink-0 flex items-center text-neutral-200 font-bold cursor-pointer text-2xl"
               v-on:click="$router.push('/')">
            <div class="w-[65px] flex items-center justify-center">
              <img src='@/assets/wikiric/wikiric-logo-big.webp' alt="Logo"
                   class="logo"
                   style="max-width: 32px; max-height: 32px; object-fit: contain;">
            </div>
          </div>
          <DisclosureButton
            class="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true"/>
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true"/>
          </DisclosureButton>
        </div>
        <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
          <div class="hidden sm:flex flex-shrink-0 items-center text-neutral-200 font-bold cursor-pointer text-2xl"
               v-on:click="$router.push('/')">
            <div class="w-[60px] flex items-center justify-center">
              <img src='@/assets/wikiric/wikiric-logo-big.webp' alt="Logo"
                   class="logo"
                   style="max-width: 32px; max-height: 32px; object-fit: contain">
            </div>
          </div>
          <div class="hidden sm:block">
            <div class="flex space-x-2 items-center">
              <template v-for="item in navigation" :key="item.name">
                <div v-if="item.main"
                     v-on:click="$router.push(item.href)"
                     :class="[item.current ? 'darkest_bg text-white' : 'text-neutral-300 hover:medium_bg hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium cursor-pointer']"
                     :aria-current="item.current ? 'page' : undefined">
                  {{ item.name }}
                </div>
              </template>
              <Combobox v-model="navSelected" class="ml-2">
                <div class="relative">
                  <div
                    class="relative w-full cursor-default overflow-hidden
                           text-left sm:text-sm"
                  >
                    <div class="relative flex items-center">
                      <ComboboxInput
                        id="cboxinput"
                        placeholder="ctrl-y"
                        class="w-full border-1 border-zinc-900 text-sm leading-5 text-neutral-200 focus:ring-0
                               medium_bg rounded-full placeholder-neutral-400 py-1 pl-3 pr-10 focus:outline-none"
                        :displayValue="(nav) => nav.name"
                        @change="navQuery = $event.target.value"
                        v-on:keyup.enter="processCombo()"
                      />
                    </div>
                    <ComboboxButton
                      class="absolute inset-y-0 right-0 flex items-center pr-2"
                    >
                      <ArrowsUpDownIcon class="h-5 w-5 text-neutral-400" aria-hidden="true"/>
                    </ComboboxButton>
                  </div>
                  <TransitionRoot
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <ComboboxOptions
                      class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md darkest_bg
                             py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    >
                      <div
                        v-if="filteredNav.length === 0 && navQuery !== ''"
                        class="relative cursor-default select-none py-2 px-4 text-neutral-300"
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
                          class="relative cursor-pointer select-none py-2 pl-10 pr-4 hover:text-neutral-200"
                          :class="{'bright_bg': active }"
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
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6">
          <Menu as="div" class="ml-3 relative">
            <div>
              <MenuButton
                v-on:click="getNotifications()"
                class="flex text-sm rounded-full focus:outline-none
                       text-neutral-400 hover:text-white">
                <span class="sr-only">View notifications</span>
                <BellIcon class="h-6 w-6" aria-hidden="true"/>
                <template v-if="notifications.length > 0">
                  <div class="absolute -translate-x-1 translate-y-2">
                    <p class="text-black bg-orange-600 p-0.5 rounded-full font-bold text-xs
                            animate-bounce">
                      {{ notifications.length }}
                    </p>
                  </div>
                </template>
              </MenuButton>
            </div>
            <transition enter-active-class="transition ease-out duration-100"
                        enter-from-class="transform opacity-0 scale-95"
                        enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
                        leave-to-class="transform opacity-0 scale-95">
              <MenuItems
                class="p_card_menu_list_big darkest_bg">
                <template v-if="notifications.length > 0">
                  <MenuItem v-slot="{ active }">
                    <a v-on:click="dismissAllNotifications()"
                       :class="[active ? 'dark_bg' : '', 'block px-4 py-2 text-sm text-neutral-300 cursor-pointer']">
                      <div class="medium_bg px-2 py-1 rounded-md">
                        Dismiss All Notifications
                      </div>
                    </a>
                  </MenuItem>
                  <template v-for="notification in notifications" :key="notification">
                    <MenuItem v-slot="{ active }">
                      <a v-on:click="handleNotificationClicked(notification)"
                         :class="[active ? 'dark_bg' : '', 'block px-4 py-2 text-sm text-neutral-300 cursor-pointer']">
                        <div>
                          <p class="mb-2 w-full text-center">
                            {{ getHumanReadableDateText(notification.cdate) }}
                          </p>
                          <p class="font-bold mb-2">{{ notification.t }}</p>
                          <p>{{ notification.desc }}</p>
                        </div>
                      </a>
                    </MenuItem>
                  </template>
                </template>
                <template v-else>
                  <MenuItem v-slot="{ active }">
                    <a :class="[active ? 'dark_bg' : '', 'block px-4 py-2 text-sm text-neutral-300 cursor-pointer']">
                      <p class="w-full text-center">
                        No Notifications
                      </p>
                    </a>
                  </MenuItem>
                </template>
              </MenuItems>
            </transition>
          </Menu>
          <Menu as="div" class="ml-3 relative">
            <div>
              <MenuButton
                class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                <span class="sr-only">Open user menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="w-8 h-8 rounded-full text-neutral-400 p-1 hover:text-white">
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
                       :class="[active ? 'bg-zinc-300' : '', 'block px-4 py-2 text-sm text-neutral-700 cursor-pointer']">
                      Your Profile
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a v-on:click="$router.push('/preferences')"
                       :class="[active ? 'bg-zinc-300' : '', 'block px-4 py-2 text-sm text-neutral-700 cursor-pointer']">
                      Settings
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a v-on:click="logout()"
                       :class="[active ? 'bg-zinc-300' : '', 'block px-4 py-2 text-sm text-neutral-700 cursor-pointer']">
                      Sign Out
                    </a>
                  </MenuItem>
                </template>
                <template v-else>
                  <MenuItem v-slot="{ active }">
                    <a v-on:click="$router.push('/login?redirect=/account')"
                       :class="[active ? 'bg-zinc-300' : '', 'block px-4 py-2 text-sm text-neutral-700 cursor-pointer']">
                      <i class="bi bi-key mr-3"></i> Sign In
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a v-on:click="$router.push('/register?redirect=/account')"
                       :class="[active ? 'bg-zinc-300' : '', 'block px-4 py-2 text-sm text-neutral-700 cursor-pointer']">
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
                            :class="[item.current ? 'darkest_bg text-white' : 'text-neutral-300 hover:medium_bg hover:text-white', 'block px-3 py-2 rounded-md text-base font-medium cursor-pointer']"
                            :aria-current="item.current ? 'page' : undefined">
            {{ item.name }}
          </DisclosureButton>
        </template>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script>
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
import { DateTime } from 'luxon'
import { toRaw } from 'vue'

export default {
  name: 'Navbar',
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
  methods: {
    getNotifications: function () {
      this.$Worker.execute({
        action: 'api',
        method: 'get',
        url: 'm8/notifications'
      })
        .then((data) => {
          if (data.result) {
            this.notifications = data.result
          }
        })
        .catch((err) => {
          console.debug(err.message)
        })
    },
    handleNotificationClicked: function (notification) {
      if (!notification) return
      // Join Group
      if (notification.clickActionReferenceGUID) {
        if (notification.clickAction === 'join,group' || notification.clickAction === 'open,group') {
          this.$router.push('/redirect?redirect=/apps/clarifier/wss/' + notification.clickActionReferenceGUID)
        }
      }
      this.$Worker.execute({
        action: 'api',
        method: 'get',
        url: 'm8/notifications/dismiss/' + notification.guid
      })
        .then(() => this.getNotifications())
    },
    getHumanReadableDateText: function (date, withTime = true) {
      const time = DateTime.fromISO(date).toLocaleString(DateTime.TIME_24_SIMPLE)
      const start = DateTime.fromISO(DateTime.fromISO(date).toISODate())
      const end = DateTime.fromISO(DateTime.now().toISODate())
      const diffDays = Math.ceil(end.diff(start) / (1000 * 60 * 60 * 24))
      let suffix = ''
      if (withTime) {
        suffix = ', ' + time
      }
      let returnString
      switch (diffDays) {
        case -5:
          returnString = 'In 5 days' + suffix
          break
        case -4:
          returnString = 'In 4 days' + suffix
          break
        case -3:
          returnString = 'In 3 days' + suffix
          break
        case -2:
          returnString = 'In 2 days' + suffix
          break
        case -1:
          returnString = 'Tomorrow' + suffix
          break
        case 0:
          returnString = 'Today' + suffix
          break
        case 1:
          returnString = 'Yesterday' + suffix
          break
        case 2:
          returnString = '2 days ago' + suffix
          break
        default:
          returnString = start.toISODate() + suffix
      }
      return returnString
    },
    dismissAllNotifications: function () {
      this.$Worker.execute({
        action: 'api',
        method: 'get',
        url: 'm8/notifications/dismiss'
      })
        .then(() => this.getNotifications())
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
  data () {
    return {
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
        },
        {
          name: 'Mockingbird',
          href: '/dev/api',
          current: false,
          main: false
        }
      ],
      notifications: [],
      connector: null
    }
  },
  mounted () {
    this.connector = new BroadcastChannel('connector')
    this.connector.onmessage = event => {
      if (event.data.type === 'notification') {
        this.notifications.unshift(JSON.parse(event.data.obj))
      } else if (event.data === 'nav_init_notification') {
        this.getNotifications()
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

<style>

.p_card_menu_list_big {
  @apply absolute mt-2 w-80 divide-y divide-zinc-400 border-[1px] border-zinc-400
  -translate-x-72
  shadow-zinc-900 shadow-2xl rounded-md shadow-lg ring-1 ring-black
  ring-opacity-5 focus:outline-none z-10;
}

</style>
