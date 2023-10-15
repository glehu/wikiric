import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { dbGetSession, dbGetTimestamp, dbSetSession, dbSetTimestamp } from '@/libs/wikistore'

export default createStore({
  plugins: [createPersistedState(this)],
  state: {
    // --- Server ---
    serverIP: 'https://wikiric.xyz',
    // --- Cookies ---
    cookieAllowance: false,
    cookies: [
      {
        type: 'Essential',
        allowed: false
      }
    ],
    // --- Tracking ---
    usageTracking: false,
    // --- Authentication ---
    authenticated: false,
    token: '',
    email: '',
    username: '',
    displayName: '',
    password: '',
    fcmToken: '',
    // --- Web Shop ---
    shop: {},
    cart: [],
    // --- Clarifier ---
    clarifierSessions: [],
    clarifierTimestamps: [],
    clarifierKeys: [],
    e2eEncryptionSeen: false,
    lastClarifierGUID: '',
    lastClarifierSubGUID: '',
    // ImgFlip
    imgFlipUsername: '',
    imgFlipPassword: '',
    // Knowledge
    // Wisdom
    wisdomTutorialSeen: false,
    accountType: '',
    plannerCalendarOpen: true,
    clarifierMembersOpen: true,
    clarifierSidebar2Open: true
  },
  mutations: {
    logIn (state, user) {
      state.authenticated = true
      state.email = user.username
      state.username = user.username
      state.displayName = user.displayName
      state.accountType = user.accountType
    },
    logOut (state) {
      state.authenticated = false
      state.token = ''
      state.email = ''
      state.username = ''
      state.password = ''
      state.accountType = ''
    },
    putInCart (state, itemObj) {
      state.cart.unshift(itemObj)
    },
    removeFromCart (state, itemObj) {
      state.cart = state.cart.filter(function (ele) {
        return ele.uid.toString() !== itemObj.uid.toString()
      })
    },
    clearCart (state) {
      state.cart = []
    },
    putShopItems (state, itemList) {
      state.shop = itemList
    },
    /**
     * Allows a given cookieType and sets the general cookie allowance to true.
     * @param state
     * @param cookieType
     */
    allowCookie (state, cookieType) {
      state.cookieAllowance = true
      for (let i = 0; i < state.cookies.length; i++) {
        if (state.cookies[i].type === cookieType) {
          state.cookies[i].allowed = true
        }
      }
    },
    /**
     * Revokes the allowance of a given cookieType.
     * In case no cookie is allowed, sets the general cookie allowance to false.
     * @param state
     * @param cookieType
     */
    revokeCookieAllowance (state, cookieType) {
      let allDisabled = true
      for (let i = 0; i < state.cookies.length; i++) {
        if (state.cookies[i].type === cookieType) {
          state.cookies[i].allowed = false
        }
        if (this.cookies[i].allowed) {
          allDisabled = false
        }
      }
      if (allDisabled) {
        state.cookieAllowance = false
      }
    },
    revokeAllCookieAllowances (state) {
      state.cookieAllowance = false
      for (let i = 0; i < state.cookies.length; i++) {
        state.cookies[i].allowed = false
      }
    },
    allowUsageTracking (state) {
      state.usageTracking = true
    },
    denyUsageTracking (state) {
      state.usageTracking = false
    },
    setServerIP (state, newServerIP) {
      state.serverIP = newServerIP
    },
    setServerToken (state, newServerToken) {
      state.token = newServerToken
    },
    addClarifierSession (state, session) {
      for (let i = 0; i < state.clarifierSessions.length; i++) {
        if (state.clarifierSessions[i].id === session.id) {
          state.clarifierSessions.splice(i, 1)
          break
        }
      }
      state.clarifierSessions.unshift({
        id: session.id,
        title: session.title,
        img: session.img,
        type: session.type,
        banner: session.banner
      })
    },
    removeClarifierSession (state, session) {
      state.clarifierSessions = state.clarifierSessions.filter(function (ele) {
        return ele.id !== session.id
      })
    },
    async addClarifierTimestampNew (state, session) {
      if (session.id == null) return
      // Remove key from local storage (since we're storing them in the indexed db now)
      state.clarifierTimestamps = state.clarifierTimestamps.filter(function (ele) {
        return ele.id !== session.id
      })
      const timestamp = await dbGetTimestamp(session.id)
      if (timestamp) {
        if (timestamp.tsNew >= session.ts) return
        timestamp.tsNew = session.ts
        dbSetTimestamp(session.id, {
          id: session.id,
          tsRead: timestamp.tsRead,
          tsNew: session.ts
        })
        return
      }
      dbSetTimestamp(session.id, {
        id: session.id,
        tsNew: session.ts
      })
    },
    async addClarifierTimestampRead (state, session) {
      if (session.id == null) return
      // Remove key from local storage (since we're storing them in the indexed db now)
      state.clarifierTimestamps = state.clarifierTimestamps.filter(function (ele) {
        return ele.id !== session.id
      })
      const timestamp = await dbGetTimestamp(session.id)
      if (timestamp) {
        if (timestamp.tsRead >= session.ts) return
        timestamp.tsRead = session.ts
        dbSetTimestamp(session.id, {
          id: session.id,
          tsRead: session.ts,
          tsNew: timestamp.tsNew
        })
        return
      }
      dbSetTimestamp(session.id, {
        id: session.id,
        tsRead: session.ts
      })
    },
    setFCMToken (state, newFCMToken) {
      state.fcmToken = newFCMToken
    },
    setClarifierKeyPair (state, payload) {
      // Remove key from local storage (since we're storing them in the indexed db now)
      state.clarifierKeys = state.clarifierKeys.filter(function (ele) {
        return ele.id !== payload.id
      })
      dbSetSession(payload.id, payload)
    },
    setE2EncryptionSeen (state, seen) {
      state.e2eEncryptionSeen = seen
    },
    setImgFlipAccount (state, imgFlipAccount) {
      state.imgFlipUsername = imgFlipAccount.username
      state.imgFlipPassword = imgFlipAccount.password
    },
    setLastClarifierGUID (state, guid) {
      if (guid != null && guid.toString().length > 30) {
        state.lastClarifierGUID = guid
      }
    },
    setLastClarifierSubGUID (state, guid) {
      if (guid != null && (guid.toString().length > 30 || guid === 'none')) {
        state.lastClarifierSubGUID = guid
      }
    },
    setWisdomTutorialSeen (state, seen) {
      state.wisdomTutorialSeen = seen
    },
    togglePlannerCalendar (state) {
      state.plannerCalendarOpen = !state.plannerCalendarOpen
    },
    toggleClarifierMembers (state, force = null) {
      if (force != null) {
        state.clarifierMembersOpen = force
      } else {
        state.clarifierMembersOpen = !state.clarifierMembersOpen
      }
    },
    toggleClarifierSidebar2 (state, force = null) {
      if (force != null) {
        state.clarifierSidebar2Open = force
      } else {
        state.clarifierSidebar2Open = !state.clarifierSidebar2Open
      }
    }
  },
  actions: {},
  modules: {},
  getters: {
    getTimestamp: (state) => (guid) => {
      return dbGetTimestamp(guid)
    },
    getClarifierKeyPair: (state) => (guid) => {
      const keyPair = state.clarifierKeys.find(entry => entry.id === guid)
      if (keyPair) return keyPair
      return dbGetSession(guid)
    },
    hasSeenE2ENotification: (state) => () => {
      return state.e2eEncryptionSeen
    },
    getLastClarifierGUID: (state) => () => {
      return state.lastClarifierGUID
    },
    getLastClarifierSubGUID: (state) => () => {
      return state.lastClarifierSubGUID
    },
    hasSeenWisdomTutorial: (state) => () => {
      return state.wisdomTutorialSeen
    },
    isPlannerCalendarOpen: (state) => () => {
      return state.plannerCalendarOpen
    },
    isClarifierMembersOpen: (state) => () => {
      return state.clarifierMembersOpen
    },
    isClarifierSidebar2Open: (state) => () => {
      return state.clarifierSidebar2Open
    }
  }
})
