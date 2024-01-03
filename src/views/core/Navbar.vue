<template>
  <Disclosure as="nav" class="w-full bshadow primary-light"
              style="background: linear-gradient(90deg, var(--md-sys-color-primary-light), var(--md-sys-color-tertiary-light))"
              v-slot="{ open }" id="global_nav" :ref="'global_nav'">
    <div class="backdrop-brightness-75">
      <div class="relative flex items-center justify-between navbar_body">
        <div class="absolute inset-y-0 left-0 sm:hidden
                    flex items-center justify-center
                    min-w-[55px]">
          <div class="flex-shrink-0 flex items-center font-bold cursor-pointer text-2xl"
               v-on:click="$router.push('/')">
            <div class="w-[55px] flex items-center justify-center">
              <img src='@/assets/wikiric/wikiric-logo-big.webp' alt="Logo"
                   style="max-width: 28px; max-height: 28px; object-fit: contain;
                          filter: brightness(0%) invert(1)">
            </div>
          </div>
          <DisclosureButton
            class="inline-flex items-center justify-center p-2
                   rounded-md
                   hover:primary-container focus:outline-none
                   focus:ring-2 focus:ring-inset focus:ring-white text-light">
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true"/>
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true"/>
          </DisclosureButton>
        </div>
        <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
          <div class="hidden sm:flex flex-shrink-0 items-center font-bold cursor-pointer text-2xl"
               v-on:click="$router.push('/')">
            <div class="w-[55px] flex items-center justify-center">
              <img src='@/assets/wikiric/wikiric-logo-big.webp' alt="Logo"
                   style="max-width: 28px; max-height: 28px; object-fit: contain;
                          filter: brightness(0%) invert(1)">
            </div>
          </div>
          <div class="hidden sm:block">
            <div class="flex space-x-2 items-center">
              <template v-for="item in navigation" :key="item.name">
                <div v-if="item.main"
                     v-on:click="$router.push(item.href)"
                     :class="[item.current ? '' : 'hover:surface', 'px-3 py-2 rounded-md text-sm font-bold cursor-pointer']"
                     :aria-current="item.current ? 'page' : undefined">
                  <p class="">{{ item.name }}</p>
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
                        class="w-full text-sm
                               leading-5 focus:ring-2
                               surface rounded
                               py-1 pl-3
                               pr-10"
                        style="color: var(--md-sys-color-on-surface) !important;"
                        :displayValue="(nav) => nav.name"
                        @change="navQuery = $event.target.value"
                        v-on:keyup.enter="processCombo()"
                      />
                    </div>
                    <ComboboxButton class="absolute inset-y-0 right-0
                                           flex items-center pr-2">
                      <ArrowsUpDownIcon class="h-5 w-5 surface"
                                        aria-hidden="true"/>
                    </ComboboxButton>
                  </div>
                  <TransitionRoot
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <ComboboxOptions
                      class="surface
                             absolute mt-1 max-h-60 w-full overflow-auto rounded-md
                             py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5
                             focus:outline-none sm:text-sm"
                    >
                      <div
                        v-if="filteredNav.length === 0 && navQuery !== ''"
                        class="relative cursor-default select-none py-2 px-4"
                      >
                        <p>Nothing found.</p>
                      </div>
                      <ComboboxOption
                        v-for="nav in filteredNav"
                        as="template"
                        :key="nav.name"
                        :value="nav"
                        v-slot="{ selected, active }"
                      >
                        <li
                          class="surface relative cursor-pointer select-none py-2 pl-10 pr-4"
                          :class="{'primary-container': active }"
                          v-on:click="processCombo()"
                        >
                          <div
                            class="block truncate font-bold"
                          >
                            <p class="nav_link_name">{{ nav.name }}</p>
                          </div>
                          <div
                            v-if="selected"
                            class="absolute inset-y-0 left-0 flex items-center pl-3"
                            :class="{ '': active }">
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
        <div class="absolute inset-y-0 right-0 flex items-center mx-2 my-1 gap-4">
          <div class="h-6 w-6 relative
                      focus:outline-none cursor-pointer text-light"
               v-on:click="toggleViewingPeriodicActions()"
               v-tooltip.bottom="{ content: 'View periodic actions' }">
            <CalendarIcon class="h-6 w-6" aria-hidden="true"/>
          </div>
          <Menu as="div" class="relative">
            <div>
              <MenuButton
                v-on:click="getNotifications()"
                class="h-6 w-6 flex text-sm rounded-full focus:outline-none text-light"
                v-tooltip.bottom="{ content: 'Show notifications' }">
                <span class="sr-only">View notifications</span>
                <template v-if="notifications.length > 0">
                  <div class="">
                    <p class=" bg-orange-900 bg-opacity-50 px-1.5 py-0.5 rounded-full font-bold text-xs
                              border-[2px] border-orange-600">
                      {{ notifications.length }}
                    </p>
                  </div>
                </template>
                <template v-else>
                  <BellIcon class="h-6 w-6" aria-hidden="true"/>
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
                class="p_card_menu_list_big darkest_bg
                       max-h-[75vh] overflow-y-auto">
                <template v-if="notifications.length > 0">
                  <MenuItem v-slot="{ active }">
                    <a v-on:click="dismissAllNotifications()"
                       :class="[active ? 'dark_bg' : '', 'block px-4 py-2 text-sm  cursor-pointer']">
                      <div class="medium_bg px-2 py-1 rounded-md">
                        Dismiss All Notifications
                      </div>
                    </a>
                  </MenuItem>
                  <template v-for="notification in notifications" :key="notification">
                    <MenuItem v-slot="{ active }">
                      <a v-on:click="handleNotificationClicked(notification)"
                         :class="[active ? 'dark_bg' : '', 'block px-4 py-2 text-sm  cursor-pointer']">
                        <div>
                          <p class="mb-2 w-full text-center">
                            {{ getHumanReadableDateText(notification.ts) }}
                          </p>
                          <p class="font-bold mb-2">
                            {{ notification.t }}
                          </p>
                          <p>
                            {{ notification.desc }}
                          </p>
                        </div>
                      </a>
                    </MenuItem>
                  </template>
                </template>
                <template v-else>
                  <MenuItem v-slot="{ active }">
                    <a :class="[active ? 'dark_bg' : '', 'block px-4 py-2 text-sm  cursor-pointer']">
                      <p class="w-full text-center">
                        No Notifications
                      </p>
                    </a>
                  </MenuItem>
                </template>
              </MenuItems>
            </transition>
          </Menu>
          <Menu as="div" class="relative">
            <div>
              <MenuButton
                class="h-6 w-6 flex text-sm rounded-full focus:outline-none
                       focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
                       focus:ring-white text-light"
                v-tooltip.bottom="{ content: 'Open user menu' }">
                <span class="sr-only">Open user menu</span>
                <UserIcon class="h-6 w-6" aria-hidden="true"/>
              </MenuButton>
            </div>
            <transition enter-active-class="transition ease-out duration-100"
                        enter-from-class="transform opacity-0 scale-95"
                        enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
                        leave-to-class="transform opacity-0 scale-95">
              <MenuItems
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg
                       py-1 surface ring-1 ring-black ring-opacity-5 focus:outline-none">
                <template v-if="isLoggedIn">
                  <MenuItem v-slot="{ active }">
                    <a v-on:click="$router.push('/account')"
                       :class="[active ? 'primary' : '', 'block px-4 py-2 text-sm nav_link_name cursor-pointer']">
                      Your Profile
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a v-on:click="$router.push('/preferences')"
                       :class="[active ? 'primary' : '', 'block px-4 py-2 text-sm nav_link_name cursor-pointer']">
                      Settings
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a v-on:click="logout()"
                       :class="[active ? 'primary' : '', 'block px-4 py-2 text-sm nav_link_name cursor-pointer']">
                      Sign Out
                    </a>
                  </MenuItem>
                </template>
                <template v-else>
                  <MenuItem v-slot="{ active }">
                    <a v-on:click="$router.push('/login?redirect=/account')"
                       :class="[active ? 'primary' : '', 'block px-4 py-2 text-sm nav_link_name cursor-pointer']">
                      <i class="bi bi-key mr-3"></i> Sign In
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a v-on:click="$router.push('/register?redirect=/account')"
                       :class="[active ? 'primary' : '', 'block px-4 py-2 text-sm nav_link_name cursor-pointer']">
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
                            :class="[item.current ? 'primary' : 'hover:primary-container', 'block px-3 py-2 rounded-md text-base font-medium cursor-pointer']"
                            :aria-current="item.current ? 'page' : undefined">
            <p>{{ item.name }}</p>
          </DisclosureButton>
        </template>
      </div>
    </DisclosurePanel>
    <modal @close="isViewingPeriodicActions = false"
           v-show="isViewingPeriodicActions">
      <template v-slot:header>
        Periodic Actions
      </template>
      <template v-slot:body>
        <div class="w-full h-full overflow-hidden min-w-[clamp(300px,500px,92dvw)]">
          <div class=" flex items-center gap-x-2 mt-1">
            <div class="flex items-center px-2 py-1.5 rounded mb-2
                        primary hover:primary-container cursor-pointer w-fit"
                 v-on:click="isAddingPeriodicAction = !isAddingPeriodicAction">
              <PlusIcon class="h-4 w-4 mr-2"/>
              <span class="text-xs font-bold">New</span>
            </div>
            <p class="pl-1 mb-2 text-xs  font-bold">Filter:</p>
            <div class="metaTag cursor-pointer" :class="{active: filter.byAll}"
                 v-on:click="filterResults('all')">
              <div class="flex items-center">
                <EyeIcon class="h-4 w-4 mr-1"/>
                <p class="text-xs font-bold">
                  All
                </p>
              </div>
            </div>
            <div class="metaTag cursor-pointer" :class="{active: filter.byReminders}"
                 v-on:click="filterResults('reminders')">
              <div class="flex items-center">
                <FunnelIcon class="h-4 w-4 mr-1"/>
                <p class="text-xs font-bold">
                  Reminders
                </p>
              </div>
            </div>
          </div>
          <template v-if="isAddingPeriodicAction">
            <div class="p-2 rounded surface-variant mt-2">
              <div class="w-full mb-2">
                <label for="task_view_datetime"
                       class=" text-xs font-bold mb-1">
                  <span>Due Date</span>
                </label>
                <div class="flex items-center justify-start">
                  <input id="task_view_datetime" type="date" class="p_input" style="color-scheme: dark;"
                         v-model="newActionTmp.dueDateFormatted">
                  <input id="task_view_time" type="time" class="p_input ml-1" style="color-scheme: dark;"
                         v-model="newActionTmp.dueTimeFormatted">
                </div>
              </div>
              <div class="w-full my-2 flex gap-y-1 gap-x-1">
                <div class="flex flex-col w-1/2 min-w-[40px]">
                  <label for="new_action_webhook_amount"
                         class=" text-xs font-bold mb-1">
                    <span>Amount</span>
                  </label>
                  <input type="number" name="new_action_webhook_amount"
                         id="new_action_webhook_amount" ref="new_action_webhook_amount"
                         min="1" max="999999" step="1" class="n_dark_input p_input"
                         v-model="newAction.amt">
                </div>
                <div class="flex flex-col w-1/2 min-w-[40px]">
                  <label for="new_action_webhook_interval"
                         class=" text-xs font-bold mb-1">
                    <span>Interval (e.g. 5m or 10h)</span>
                  </label>
                  <input type="text" name="new_action_webhook_interval"
                         id="new_action_webhook_interval" ref="new_action_webhook_interval"
                         class="n_dark_input p_input"
                         v-model="newAction.ival">
                </div>
              </div>
              <div class="w-full my-2 flex flex-col gap-y-1">
                <p class=" text-xs font-bold">
                  Notification
                </p>
                <input type="text" name="new_action_title" id="new_action_title" ref="new_action_title"
                       placeholder="Title..." class="n_dark_input p_input"
                       v-model="newAction.tmpl.t">
                <input type="text" name="new_action_topic" id="new_action_topic" ref="new_action_topic"
                       placeholder="Topic..." class="n_dark_input w-1/2 min-w-[100px] p_input"
                       v-model="newAction.topic">
                <textarea rows="2" maxlength="300" placeholder="Description..."
                          class="n_dark_input p_input"
                          v-model="newAction.tmpl.desc"></textarea>
              </div>
              <div class="w-full my-2 flex flex-col gap-y-1">
                <p class=" text-xs font-bold">
                  Webhook
                </p>
                <input type="text" name="new_action_webhook_url"
                       id="new_action_webhook_url" ref="new_action_webhook_url"
                       placeholder="URL..." class="n_dark_input p_input"
                       v-model="newActionTmp.hookURL">
                <div class="n_dark_input flex items-center w-fit"
                     v-tooltip.top="{ content: 'Checked: Posts notification. Unchecked: Makes GET request' }">
                  <input type="checkbox" name="new_action_webhook_post"
                         id="new_action_webhook_post" ref="new_action_webhook_post"
                         class="text-xl"
                         v-model="newActionTmp.hookPost">
                  <label for="new_action_webhook_post"
                         class="ml-2">
                    Post Notification
                  </label>
                </div>
              </div>
              <div class="btn_bg_primary mt-4 w-fit"
                   v-on:click="submitPeriodicAction()">
                <span>Submit</span>
              </div>
            </div>
          </template>
          <template v-else>
            <template v-if="periodicActions.length < 1">
              <div class="surface rounded-md m-2 px-3 py-2">
                <p class="text-sm  font-bold">
                  No periodic actions / reminders found.
                </p>
              </div>
            </template>
            <template v-else>
              <div class="flex flex-col gap-y-2 w-full justify-center">
                <template v-for="action in periodicActions" :key="action.uid">
                  <div class="fmt_border my-1 surface-variant rounded p-2 w-full periodic_action relative"
                       :ref="'list_act_' + action.uid" :id="'list_act_' + action.uid">
                    <div class="flex justify-between items-start">
                      <div class="due_date">
                        <CalendarIcon class="w-4 h-4 mr-2"/>
                        <p class="text-sm font-bold">{{ getHumanReadableDateText(action.due) }}</p>
                      </div>
                      <div class="flex justify-end">
                        <div class="w-fit px-2 py-1 rounded background fmt_border flex items-center text-sm">
                          <p v-if="action.topic && action.topic !== ''">{{ action.topic }}</p>
                          <p v-else class="">(No topic)</p>
                        </div>
                      </div>
                    </div>
                    <template v-if="action.tmpl">
                      <div class="mb-1 px-2 py-1 rounded surface fmt_border">
                        <p class="font-bold mb-1">{{ action.tmpl.t }}</p>
                        <p>{{ action.tmpl.desc }}</p>
                      </div>
                    </template>
                    <div class="flex items-center text-sm mt-2 cursor-default">
                      <template v-if="action.isre && action.isre === true">
                        <ArrowUturnLeftIcon class="h-4 w-4 mr-2"></ArrowUturnLeftIcon>
                        <span>{{ action.amt }} times</span>
                      </template>
                      <template v-else>
                        <CalendarIcon class="h-4 w-4 mr-2"></CalendarIcon>
                        <span>One-time</span>
                      </template>
                      <template v-if="action.rec">
                        <UsersIcon class="h-4 w-4 ml-4 mr-2"/>
                        <span v-tooltip.top="{ content: getPeriodicSubsText(action.rec) }">
                          {{ action.rec.length }} Receivers
                        </span>
                      </template>
                      <template v-if="action.hooks && action.hooks.length > 0">
                        <CloudIcon class="h-4 w-4 ml-4 mr-2"/>
                        <span>{{ action.hooks.length }} Webhooks</span>
                      </template>
                    </div>
                    <div
                      class="mr-auto absolute top-0 right-0 h-full">
                      <Menu as="div" class="relative inline-block text-left h-full">
                        <MenuButton
                          title="Options"
                          class="periodic_action_overlay hover:primary rounded bshadow surface-variant
                                 m-1 p-1 backdrop-blur-3xl flex items-center cursor-pointer">
                          <SquaresPlusIcon class="h-5 w-5"></SquaresPlusIcon>
                        </MenuButton>
                        <transition
                          enter-active-class="transition duration-100 ease-out"
                          enter-from-class="transform scale-95 opacity-0"
                          enter-to-class="transform scale-100 opacity-100"
                          leave-active-class="transition duration-75 ease-in"
                          leave-from-class="transform scale-100 opacity-100"
                          leave-to-class="transform scale-95 opacity-0"
                        >
                          <MenuItems
                            class="p_card_menu_list_medium_p surface"
                          >
                            <div class="px-1 py-1">
                              <MenuItem v-slot="{ active }">
                                <button v-on:click="deletePeriodicAction(action)"
                                        :class="[active
                                      ? 'p_card_menu_active'
                                      : 'p_card_menu_item','group p_card_menu_item']">
                                  <TrashIcon
                                    :active="active"
                                    class="mr-2 h-5 w-5"
                                    aria-hidden="true"
                                  />
                                  <span>Delete</span>
                                </button>
                              </MenuItem>
                            </div>
                          </MenuItems>
                        </transition>
                      </Menu>
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </template>
        </div>
      </template>
      <template v-slot:footer>
      </template>
    </modal>
  </Disclosure>
</template>

<script>
import modal from '../../components/Modal.vue'
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
import {
  ArrowUturnLeftIcon,
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  CloudIcon,
  PlusIcon,
  SquaresPlusIcon,
  UserIcon,
  UsersIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { ArrowsUpDownIcon, EyeIcon, FunnelIcon, TrashIcon } from '@heroicons/vue/24/solid'
import { DateTime } from 'luxon'
import { toRaw } from 'vue'

export default {
  name: 'Navbar',
  components: {
    EyeIcon,
    FunnelIcon,
    SquaresPlusIcon,
    TrashIcon,
    modal,
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
    ArrowsUpDownIcon,
    CalendarIcon,
    ArrowUturnLeftIcon,
    UserIcon,
    UsersIcon,
    PlusIcon,
    CloudIcon
  },
  methods: {
    getNotifications: function () {
      this.$Worker.execute({
        action: 'api',
        method: 'get',
        url: 'notification/private/read'
      })
      .then((data) => {
        if (data.result) {
          this.notifications = data.result.Notifications
        }
      })
      .catch((err) => {
        console.debug(err.message)
      })
    },
    handleNotificationClicked: function (notification) {
      if (!notification) return
      // Join Group
      if (notification.id && notification.id !== '') {
        if (notification.act === 'join' || notification.act === 'open') {
          if (notification.mod === 'chat') {
            this.$router.push('/redirect?redirect=/apps/clarifier/wss/' + notification.id)
          } else if (notification.mod === 'wisdom') {
            this.$router.push('/redirect?redirect=/apps/knowledge/' + notification.id)
          }
        }
      }
      this.$Worker.execute({
        action: 'api',
        method: 'get',
        url: 'notification/private/delete/' + notification.uid
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
      if (this.notifications.length <= 0) return
      this.$Worker.execute({
        action: 'api',
        method: 'get',
        url: 'notification/private/tidy'
      })
      .then(() => this.getNotifications())
    },
    processCombo: function () {
      setTimeout(() => {
        const value = toRaw(this.navSelected)
        if (value.href == null) {
          return
        }
        if (value.href.substring(0, 1) === '!') {
          if (value.href === '!periodic') {
            this.isViewingPeriodicActions = true
          }
        } else {
          this.$router.push(value.href)
        }
        this.navQuery = ''
        this.navSelected = { name: '' }
      }, 100)
    },
    toggleViewingPeriodicActions: function (getOnly = false) {
      if (!getOnly) {
        this.isViewingPeriodicActions = !this.isViewingPeriodicActions
      }
      if (this.isViewingPeriodicActions) {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'periodic/private/read'
        })
        .then((data) => {
          if (data.result) {
            data.result.periodic.sort(this.compareDueDate)
            this.periodicActions = data.result.periodic
          }
        })
        .catch((err) => {
          console.debug(err.message)
        })
      }
    },
    compareDueDate: function (a, b) {
      return a.dunx - b.dunx
    },
    getPeriodicSubsText: function (receivers) {
      let text = ''
      for (let i = 0; i < receivers.length; i++) {
        if (text !== '') text += ', '
        text += receivers[i].usr
      }
      return text
    },
    deletePeriodicAction: function (action) {
      this.$Worker.execute({
        action: 'api',
        method: 'get',
        url: 'periodic/private/delete/' + action.uid
      })
      .then(() => {
        this.toggleViewingPeriodicActions(true)
      })
      .catch((err) => {
        console.debug(err.message)
      })
    },
    filterResults: function (type) {
      if (type === 'all') {
        this.filter.byAll = true
        this.filter.byReminders = false
      } else if (type === 'reminders') {
        this.filter.byAll = false
        this.filter.byReminders = true
      }
    },
    submitPeriodicAction: function () {
      if (!this.newActionTmp.dueDateFormatted && !this.newActionTmp.dueTimeFormatted) {
        alert('Neither date nor time provided')
        return
      }
      let combinedDateTime = ''
      if (this.newActionTmp.dueDateFormatted) {
        combinedDateTime = this.newActionTmp.dueDateFormatted
      }
      // Get current timezone offset
      const o = DateTime.now()
      let c = ''
      if (o.isOffsetFixed && o.offset === 0) {
        c += 'Z'
      } else if (o.o < 0) {
        c += '-'
        c += this.padStart(Math.trunc(-o.o / 60))
        c += ':'
        c += this.padStart(Math.trunc(-o.o % 60))
      } else {
        c += '+'
        c += this.padStart(Math.trunc(o.o / 60))
        c += ':'
        c += this.padStart(Math.trunc(o.o % 60))
      }
      // Attach time
      if (this.newActionTmp.dueTimeFormatted) {
        // If there was no date set, assume the current date was meant and set it accordingly
        if (combinedDateTime === '') {
          combinedDateTime = new Date().toISOString().split('T')[0]
        }
        // Add time either way
        combinedDateTime += 'T' + this.newActionTmp.dueTimeFormatted
        // Add seconds if missing
        if (this.newActionTmp.dueTimeFormatted.length === 5) {
          combinedDateTime += ':00'
        }
        // Add timezone offset
        combinedDateTime += c
      } else {
        if (combinedDateTime !== '') {
          combinedDateTime += 'T00:00:00' + c
          this.newActionTmp.dueTimeFormatted = '00:00'
        }
      }
      this.newAction.due = combinedDateTime
      // Amount and Interval
      this.newAction.isre = this.newAction.amt > 1
      // Sanitize
      if (this.newAction.tmpl.t === '') {
        this.newAction.tmpl.t = '(no title)'
        if (this.newAction.tmpl.desc === '') {
          this.newAction.tmpl.desc = '(no description)'
        }
      }
      // Receiver(s)
      this.newAction.rec.push({
        usr: this.$store.state.username,
        fcm: ''
      })
      // Webhook
      if (this.newActionTmp.hookURL !== '') {
        this.newAction.hooks.push({
          url: this.newActionTmp.hookURL,
          msg: this.newActionTmp.hookPost
        })
      }
      // Send it
      this.$Worker.execute({
        action: 'api',
        method: 'post',
        url: 'periodic/private/create',
        body: JSON.stringify(this.newAction)
      })
      .then(() => {
        this.isAddingPeriodicAction = false
        this.resetNewAction()
        this.toggleViewingPeriodicActions(true)
      })
      .catch((err) => {
        console.debug(err.message)
      })
    },
    resetNewAction: function () {
      this.newActionTmp = structuredClone(this.newActionTmpBackup)
      this.newAction = structuredClone(this.newActionBackup)
    },
    padStart: function (input, n = 2) {
      const isNeg = input < 0
      let padded
      if (isNeg) {
        padded = '-' + ('' + -input).padStart(n, '0')
      } else {
        padded = ('' + input).padStart(n, '0')
      }
      return padded
    },
    logout () {
      this.$store.commit('logOut')
      this.$store.commit('clearCart')
      this.$router.push('/login?redirect=/account')
    }
  },
  data () {
    return {
      navQuery: '',
      navSelected: { name: '' },
      navigation: [
        {
          name: 'Start',
          href: '/',
          current: false,
          main: false
        },
        {
          name: 'Home',
          href: '/account',
          current: false,
          main: true
        },
        {
          name: 'Chat',
          href: '/apps/clarifier',
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
          name: 'Periodic Actions',
          href: '!periodic',
          current: false,
          main: false
        },
        {
          name: 'Reminders',
          href: '!periodic',
          current: false,
          main: false
        },
        {
          name: 'Mockingbird',
          href: '/dev/api',
          current: false,
          main: false
        },
        {
          name: 'Stores',
          href: '/stores',
          current: false,
          main: false
        },
        {
          name: 'About',
          href: '/about',
          current: false,
          main: false
        }
      ],
      notifications: [],
      connector: null,
      isViewingPeriodicActions: false,
      periodicActions: [],
      filter: {
        byAll: true,
        byReminders: false
      },
      isAddingPeriodicAction: false,
      newActionTmpBackup: {},
      newActionTmp: {
        hookURL: '',
        hookPost: false,
        dueTimeFormatted: '',
        dueDateFormatted: ''
      },
      newActionBackup: {},
      newAction: {
        usr: '',
        tmpl: {
          t: '',
          desc: '',
          type: 'reminder'
        },
        topic: '',
        due: '',
        isre: true,
        ival: '',
        amt: 1,
        rec: [],
        hooks: []
      }
    }
  },
  mounted () {
    // Backups
    this.newActionTmpBackup = structuredClone(this.newActionTmp)
    this.newActionBackup = structuredClone(this.newAction)
    // Init
    this.connector = new BroadcastChannel('connector')
    this.connector.onmessage = event => {
      if (event.data.typ === '[s:NOTIFICATION]') {
        this.getNotifications()
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
  shadow-zinc-900 rounded-md shadow-lg ring-1 ring-black
  ring-opacity-5 focus:outline-none z-10;
}

.due_date {
  @apply flex items-center  p-2 mt-1 mx-1 mb-2
  bg-orange-700 bg-opacity-25 justify-between rounded
  border-[1px] border-orange-800;
}

.periodic_action_overlay {
  opacity: 0;
}

.periodic_action:hover .periodic_action_overlay {
  opacity: 1;
}

.p_card_menu_list_medium_p {
  @apply absolute right-0 mt-2 w-56 origin-top-right divide-y divide-zinc-400 rounded-md
  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10;
}

.p_card_menu_active {
  @apply darkest_bg bg-opacity-60  font-bold;
}

.p_card_menu_item {
  @apply flex w-full items-center rounded-md px-1 py-2 text-sm hover:primary-container;
}

.n_dark_input {
  @apply px-2 py-1;
}

.p_input {
  @apply rounded py-1 px-3 surface hover:background focus:surface;
}

.nav_link_name {
}

</style>
