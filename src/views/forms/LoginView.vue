<template>
  <div class="h-screen w-screen d-md-flex align-items-center justify-center"
       style="min-height: 100vh; min-width: 100vw; max-width: 100vw; overflow-x: hidden"
       :style="{ backgroundImage: 'url('+require('@/assets/'+'account/pexels-adrien-olichon-2387819.jpg')+')',
              backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }">
    <form class="login md:flex pt-[60px]" @submit.prevent="login">
      <section>
        <div class="container p-3 h-full">
          <div class="justify-content-center align-items-center h-full">
            <div class="card text-white border-[1px] border-neutral-600 h-full"
                 style="border-radius: 1rem; background: #131313">
              <div class="card-body p-4 text-center">
                <div class="mt-md-0">
                  <h2 class="fw-bold mb-2 text-uppercase text-4xl mb-4"
                      style="font-family: 'Lato', sans-serif; pointer-events: none">
                    Sign In
                  </h2>
                  <div class="form-outline form-white mb-4">
                    <input
                      required
                      v-model="user.email"
                      type="email"
                      class="text-black py-1 px-2 rounded placeholder-neutral-500"
                      placeholder="Email"
                      autocomplete="username"
                    />
                  </div>
                  <div class="form-outline form-white mb-4">
                    <input
                      required
                      v-model="user.password"
                      type="password"
                      class="text-black py-1 px-2 rounded placeholder-neutral-500"
                      placeholder="Password"
                      autocomplete="current-password"
                    />
                  </div>
                  <!--<p class="small mb-5 pb-lg-2"><a class="text-white-50" href="#">Forgot password?</a></p>-->
                  <button class="btn btn-outline-light btn-lg px-5"
                          type="button"
                          v-on:click="login()">
                    Login
                  </button>
                  <div class="flex items-center justify-content-center w-full mt-5">
                    <p class="pointer-events-none text-neutral-400">Don't have an account?</p>
                    <button v-on:click="gotoRegister()"
                            class="btn btn-lg text-white muArrow">
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div id="metamask_registration" class="container h-full p-3">
          <div class="justify-content-center align-items-center h-full">
            <div class="card text-white border-[1px] border-neutral-600 h-full"
                 style="border-radius: 1rem; background: #131313">
              <div class="card-body p-4 text-center">
                <div class="mt-md-0">
                  <p class="pointer-events-none">Sign in via</p>
                  <h1 class="fw-bold text-4xl"
                      style="pointer-events: none">
                    MetaMask
                  </h1>
                  <div class="w-full h-[128px] flex justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                         class="w-full h-full py-2"
                         alt="MetaMask Icon">
                  </div>
                  <button class="rounded py-2 px-4 bg-zinc-700 m-1 hover:bg-zinc-800 my-4"
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
      <section>
        <div id="phantom_registration" class="container h-full p-3">
          <div class="justify-content-center align-items-center h-full">
            <div class="card text-white border-[1px] border-neutral-600 h-full"
                 style="border-radius: 1rem; background: #131313">
              <div class="card-body p-4 text-center">
                <div class="mt-md-0">
                  <p class="pointer-events-none">Sign in via</p>
                  <h1 class="fw-bold text-4xl"
                      style="pointer-events: none">
                    Phantom
                  </h1>
                  <div class="w-full h-[128px] flex justify-center">
                    <img src='@/assets/phantom/phantom-icon-purple.svg' alt="Phantom Logo"
                         class="h-full w-full py-3">
                  </div>
                  <button class="rounded py-2 px-4 bg-zinc-700 m-1 hover:bg-zinc-800 my-4"
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
    async serverLogin (u, p, accountType = 'email') {
      if (!u) u = this.user.email
      if (!p) p = this.user.password
      if (accountType) {
        this.user.accountType = accountType
      } else {
        this.user.accountType = 'email'
      }
      const response = await this.$Worker.execute({
        action: 'login',
        u: Base64.encode(u + ':' + p)
      })
      if (!response.success) {
        this.$notify(
          {
            title: 'Login Failed',
            text: 'Check Credentials or Register.',
            type: 'error'
          })
        this.user.password = ''
        return
      }
      this.processLogin(response)
    },
    processLogin (response) {
      this.user.username = response.result.username
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
      const provider = await detectEthereumProvider()
      if (provider && provider === window.ethereum) {
        this.hasMetaMask = true
      }
    },
    checkForPhantom: function () {
      if ('phantom' in window) {
        const provider = window.phantom?.solana
        if (provider?.isPhantom) {
          this.hasPhantom = true
        }
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
</style>
