<template>
  <div class="h-full w-full md:flex items-center justify-center overflow-x-hidden">
    <form class="login grid grid-cols-1 md:flex pt-[55px]" @submit.prevent="login">
      <section class="flex justify-center">
        <div class="container p-3 h-full">
          <div class="justify-center items-center h-full">
            <div class="bright_card bshadow">
              <div class="p-4 text-center">
                <div class="md:mt-0">
                  <h2 class="font-bold mb-2 text-uppercase text-4xl mb-4">
                    Sign In
                  </h2>
                  <div class="mb-4">
                    <input
                      required
                      v-model="user.email"
                      type="email"
                      class="py-1 px-2 rounded placeholder-neutral-400 text-neutral-200 dark_bg"
                      placeholder="Username"
                      autocomplete="username"
                    />
                  </div>
                  <div class="mb-4">
                    <input
                      required
                      v-model="user.password"
                      v-on:keyup.enter="login"
                      type="password"
                      class="py-1 px-2 rounded placeholder-neutral-400 text-neutral-200 dark_bg"
                      placeholder="Password"
                      autocomplete="current-password"
                    />
                  </div>
                  <!--<p class="small mb-5 pb-lg-2"><a class="text-white-50" href="#">Forgot password?</a></p>-->
                  <button class="btn_bg_primary"
                          type="button"
                          v-on:click="login">
                    Login
                  </button>
                  <div class="flex items-center justify-center w-full mt-5 gap-x-2">
                    <p class="pointer-events-none text-neutral-300 text-sm">No Account?</p>
                    <button v-on:click="gotoRegister"
                            type="button"
                            class="text-white muArrow rounded dark_bg hover:darkest_bg px-2 py-1 ml-2">
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <template v-if="hasMetaMask">
        <section class="flex justify-center">
          <div id="metamask_registration" class="container h-full p-3">
            <div class="justify-center items-center h-full">
              <div class="bright_card bshadow">
                <div class="p-4 text-center">
                  <div class="md:mt-0">
                    <p class="pointer-events-none">Sign in via</p>
                    <h1 class="font-bold text-4xl"
                        style="pointer-events: none">
                      MetaMask
                    </h1>
                    <div class="w-full h-[128px] flex justify-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                           class="w-full h-full py-2"
                           alt="MetaMask Icon">
                    </div>
                    <button class="btn_bg_primary"
                            type="button"
                            v-on:click="handleMetaMaskLogin">
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
      <template v-if="hasPhantom">
        <section class="flex justify-center">
          <div id="phantom_registration" class="container h-full p-3">
            <div class="justify-center items-center h-full">
              <div class="bright_card bshadow">
                <div class="p-4 text-center">
                  <div class="md:mt-0">
                    <p class="pointer-events-none">Sign in via</p>
                    <h1 class="font-bold text-4xl"
                        style="pointer-events: none">
                      Phantom
                    </h1>
                    <div class="w-full h-[128px] flex justify-center">
                      <img src='@/assets/phantom/phantom-icon-purple.svg' alt="Phantom Logo"
                           class="h-full w-full py-3">
                    </div>
                    <button class="btn_bg_primary"
                            type="button"
                            v-on:click="handlePhantomLogin">
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
    </form>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'
import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'

export default {
  data () {
    return {
      user: {
        token: '',
        username: '',
        displayName: '',
        email: '',
        password: '',
        accountType: ''
      },
      loginResponse: {
        httpCode: 0,
        token: ''
      },
      hasMetaMask: false,
      hasPhantom: false
    }
  },
  computed: {
    isLoggedIn () {
      return this.$store.state.authenticated
    },
    usageTracker () {
      return this.$store.state.usageTracking
    }
  },
  mounted () {
    this.checkForMetaMask()
    this.checkForPhantom()
  },
  methods: {
    login () {
      if (!this.isLoggedIn) {
        // Bypass login for testing purposes
        if (this.user.email === 'test@cwo') {
          this.$store.commit('logIn', {
            email: 'test@cwo',
            password: 'test',
            token: '! Test Account - No Token In Offline Mode !'
          })
          this.$router.push(this.$route.query.redirect.toString() || '/')
        } else {
          // Regular login
          this.serverLogin()
        }
      } else {
        console.log('User already logged in.')
      }
    },
    async serverLogin (u = null, p = null, accountType = 'email') {
      if (!u) u = this.user.email
      if (!p) p = this.user.password
      if (accountType) {
        this.user.accountType = accountType
      } else {
        this.user.accountType = 'email'
      }
      this.$Worker.execute({
        action: 'login',
        u: Base64.encode(u + ':' + p)
      })
        .then((data) => {
          this.processLogin(data)
        })
        .catch((err) => {
          this.$notify(
            {
              title: 'Login Failed',
              text: 'Check Credentials or Register.',
              type: 'error'
            })
          this.user.password = ''
          console.debug(err.message)
        })
    },
    processLogin (response) {
      this.user.username = response.result.username
      this.user.displayName = response.result.displayName
      this.user.ownChatId = response.result.chatID
      this.$store.commit('logIn', this.user)
      this.$router.replace(this.$route.query.redirect.toString() || '/')
    },
    gotoRegister () {
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop)
      })
      const redirect = params.redirect
      if (redirect) {
        this.$router.push('/register?redirect=' + redirect)
      } else {
        this.$router.push('/register')
      }
    },
    handleMetaMaskLogin: async function () {
      if (!this.hasMetaMask) return
      const respU = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const signingMessage = 'By signing this message,\nyou are giving wikiric.xyz (later wikiric) access ' +
        'to your account information (e.g. seeing your balance) and allowing the signing of transactions etc.' +
        '\nIn case there is no wikiric account associated with your MetaMask account, one will be created.' +
        '\n\nDo not sign this message if the domain is any other than https://wikiric.netlify.app or ' +
        'https://wikiric.xyz.'
      const web3 = new Web3(window.ethereum)
      const respP = await web3.eth.personal.sign(signingMessage, respU[0], console.log)
      await this.serverLogin(respU[0], respP, 'wallet_metamask')
    },
    checkForMetaMask: async function () {
      try {
        const provider = await detectEthereumProvider({
          mustBeMetaMask: true,
          silent: true,
          timeout: 3000
        })
        if (provider && provider === window.ethereum) {
          this.hasMetaMask = true
        }
      } catch (e) {
        console.debug(e.message)
      }
    },
    checkForPhantom: function () {
      try {
        if ('phantom' in window) {
          const provider = window.phantom?.solana
          if (provider?.isPhantom) {
            this.hasPhantom = true
          }
        }
      } catch (e) {
        console.debug(e.message)
      }
    },
    getPhantomProvider: function () {
      if (!this.hasPhantom) return null
      return window.phantom?.solana
    },
    handlePhantomLogin: async function () {
      const provider = this.getPhantomProvider()
      const resp = await provider.connect()
      const respU = resp.publicKey.toString()
      const signingMessage = 'By signing this message,\nyou are giving wikiric.xyz (later wikiric) access ' +
        'to your account information (e.g. seeing your balance) and allowing the signing of transactions etc.' +
        '\nIn case there is no wikiric account associated with your Phantom account, one will be created.' +
        '\n\nDo not sign this message if the domain is any other than https://wikiric.netlify.app or ' +
        'https://wikiric.xyz.'
      const encodedMessage = new TextEncoder().encode(signingMessage)
      const respP = await provider.signMessage(encodedMessage, 'utf8')
      await this.serverLogin(respU, respP, 'wallet_phantom')
    }
  }
}
</script>

<style scoped>
.muArrow {
  position: relative;
  top: 0;
  transition: top ease 0.5s;
}

.muArrow:hover {
  top: -5px;
}

.bright_card {
  @apply text-white border-[1px] border-neutral-600 h-full rounded-md medium_bg;
}

</style>
