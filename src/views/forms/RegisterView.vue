<template>
  <div class="h-full w-full md:flex items-center justify-center overflow-x-hidden">
    <form class="register md:flex pt_nav"
          @submit.prevent="register()">
      <template v-if="metamask.account === '' && phantom.account === ''">
        <section class="flex justify-center">
          <div id="registration" class="container h-full p-3">
            <div class="justify-center items-center h-full">
              <div class="bright_card">
                <div class="p-5 text-center">
                  <div class="md:mt-0">
                    <h1 class="font-bold mb-4 text-4xl"
                        style="pointer-events: none">
                      REGISTER
                    </h1>
                    <div class="mb-2">
                      <input
                        v-model="user.email"
                        type="email"
                        class="fmt_input"
                        placeholder="Email"
                        autocomplete="user"
                      />
                    </div>
                    <div class="mb-4">
                      <input
                        required
                        v-model="user.username"
                        type="text"
                        class="fmt_input"
                        placeholder="Username"
                        autocomplete="user"
                      />
                    </div>
                    <div class="mb-2">
                      <input
                        required
                        v-model="user.password"
                        type="password"
                        class="fmt_input"
                        placeholder="Password"
                        autocomplete="new-password"
                      />
                    </div>
                    <div class="mb-2">
                      <input
                        required
                        v-model="user.passwordRpt"
                        type="password"
                        class="fmt_input"
                        placeholder="Confirm Password"
                        autocomplete="new-password"
                      />
                    </div>
                    <div class="form-outline form-white mb-4">
                      <p class="pointer-events-none  py-1">How should we call you?</p>
                      <input
                        required
                        v-model="user.displayName"
                        type="text"
                        class="fmt_input"
                        placeholder="Display Name"
                      />
                    </div>
                    <div class="w-full flex justify-center">
                      <button class="btn_bg_primary"
                              type="submit">
                        <span>Register</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
      <template v-if="hasMetaMask && phantom.account === ''">
        <section class="flex justify-center">
          <div id="metamask_registration" class="container h-full p-3">
            <div class="justify-center items-center h-full">
              <div class="bright_card">
                <div class="p-5 text-center">
                  <div class="md:mt-0">
                    <p class="pointer-events-none">Register via</p>
                    <h1 class="font-bold text-4xl"
                        style="pointer-events: none">
                      MetaMask
                    </h1>
                    <div class="w-full h-[128px] flex justify-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                           class="w-full h-full py-2"
                           alt="MetaMask Icon">
                    </div>
                    <template v-if="metamask.account === ''">
                      <div>
                        <button class="btn_bg_primary"
                                type="button"
                                v-on:click="handleMetaMaskLogin()">
                          Connect
                        </button>
                      </div>
                    </template>
                    <template v-else>
                      <div class="mb-4">
                        <p class="pointer-events-none  py-1">How should we call you?</p>
                        <input
                          required
                          v-model="user.username"
                          type="text"
                          class="py-1 px-2 rounded placeholder-neutral-400  dark_bg"
                          placeholder="Username"
                        />
                      </div>
                      <button class="btn_bg_primary"
                              type="button"
                              v-on:click="register('metamask')"
                              v-show="metamask.account !== ''">
                        Register
                      </button>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
      <template v-if="hasPhantom && metamask.account === ''">
        <section class="flex justify-center">
          <div id="phantom_registration" class="container h-full p-3">
            <div class="justify-center items-center h-full">
              <div class="bright_card">
                <div class="p-5 text-center">
                  <div class="md:mt-0">
                    <p class="pointer-events-none">Register via</p>
                    <h1 class="font-bold text-4xl"
                        style="pointer-events: none">
                      Phantom
                    </h1>
                    <div class="w-full h-[128px] flex justify-center">
                      <img src='@/assets/phantom/phantom-icon-purple.svg' alt="Phantom Logo"
                           class="h-full w-full py-3">
                    </div>
                    <template v-if="phantom.account === ''">
                      <div>
                        <button class="btn_bg_primary"
                                type="button"
                                v-on:click="handlePhantomLogin()">
                          Connect
                        </button>
                      </div>
                    </template>
                    <template v-else>
                      <div class="mb-4">
                        <p class="pointer-events-none  py-1">How should we call you?</p>
                        <input
                          required
                          v-model="user.username"
                          type="text"
                          class="py-1 px-2 rounded placeholder-neutral-400  dark_bg"
                          placeholder="Username"
                        />
                      </div>
                      <button class="btn_bg_primary"
                              type="button"
                              v-on:click="register('phantom')"
                              v-show="phantom.account !== ''">
                        Register
                      </button>
                    </template>
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
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'
import { Base64 } from 'js-base64'

export default {
  mounted () {
    // Check for installed wallet browser extensions
    this.checkForMetaMask()
    this.checkForPhantom()
  },
  data () {
    return {
      user: {
        email: '',
        username: '',
        displayName: '',
        password: '',
        passwordRpt: ''
      },
      response: {
        success: false,
        message: ''
      },
      hasMetaMask: false,
      metamask: {
        account: ''
      },
      hasPhantom: false,
      phantom: {
        account: ''
      }
    }
  },
  computed: {
    usageTracker () {
      return this.$store.state.usageTracking
    }
  },
  methods: {
    register (type) {
      if (this.user.password === this.user.passwordRpt) {
        this.serverRegister(type)
      } else {
        this.user.passwordRpt = ''
        alert('Passwords do not match.')
      }
    },
    serverRegister (type) {
      if (type === 'metamask') {
        this.handleMetaMaskSignup()
      } else if (type === 'phantom') {
        this.handlePhantomSignup()
      } else {
        // Regular Register
        this.$Worker.execute({
          action: 'signup',
          u: Base64.encode(this.user.username + ':' + this.user.password),
          uRaw: this.user.username + ':' + this.user.password,
          username: this.user.username,
          displayName: this.user.displayName,
          password: this.user.password
        })
          .then((data) => {
            this.response = data
          })
          .then(() => {
            this.processRegistration()
          })
          .catch((err) => console.log(err.message))
      }
    },
    processRegistration () {
      if (this.response.success) {
        const redirect = this.$route.query.redirect
        if (redirect) {
          this.$router.push('/login?redirect=' + redirect)
        } else {
          this.$router.push('/login?redirect=/apps/clarifier')
        }
      } else {
        this.user.email = ''
        this.user.password = ''
        this.user.passwordRpt = ''
        this.$notify(
          {
            title: 'Register Failed',
            text: this.response.result.message,
            type: 'error'
          })
      }
    },
    redirectGitHub () {
      window.open('https://github.com/glehu')
    },
    scrollTo (content) {
      document.getElementById(content).scrollIntoView({ behavior: 'smooth' })
    },
    checkForMetaMask: async function () {
      const provider = await detectEthereumProvider()
      if (provider && provider === window.ethereum) {
        this.hasMetaMask = true
      }
    },
    handleMetaMaskLogin: async function () {
      if (!this.hasMetaMask) return
      const resp = await window.ethereum.request({ method: 'eth_requestAccounts' })
      this.metamask.account = resp[0]
      this.hasPhantom = false
    },
    handleMetaMaskSignup: async function () {
      if (!this.hasMetaMask) return
      const signingMessage = 'By signing this message,\nyou are giving wikiric.xyz (later wikiric) access ' +
        'to your account information (e.g. seeing your balance) and allowing the signing of transactions etc.' +
        '\nIn case there is no wikiric account associated with your MetaMask account, one will be created.' +
        '\n\nDo not sign this message if the domain is any other than https://wikiric.netlify.app or ' +
        'https://wikiric.xyz.'
      const web3 = new Web3(window.ethereum)
      const response = await web3.eth.personal.sign(signingMessage, this.metamask.account, console.log)
      this.$Worker.execute({
        action: 'signup',
        u: Base64.encode(this.metamask.account + ':' + response),
        uRaw: this.metamask.account + ':' + response,
        username: this.user.username
      })
        .then((data) => {
          this.response = data
        })
        .then(() => {
          this.processRegistration()
        })
        .catch((err) => console.log(err.message))
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
      if (!this.hasPhantom) return
      const provider = this.getPhantomProvider()
      const resp = await provider.connect()
      this.phantom.account = resp.publicKey.toString()
      this.hasMetaMask = false
    },
    handlePhantomSignup: async function () {
      if (!this.hasPhantom) return
      const provider = this.getPhantomProvider()
      const signingMessage = 'By signing this message,\nyou are giving wikiric.xyz (later wikiric) access ' +
        'to your account information (e.g. seeing your balance) and allowing the signing of transactions etc.' +
        '\nIn case there is no wikiric account associated with your Phantom account, one will be created.' +
        '\n\nDo not sign this message if the domain is any other than https://wikiric.netlify.app or ' +
        'https://wikiric.xyz.'
      const encodedMessage = new TextEncoder().encode(signingMessage)
      const signedMessage = await provider.signMessage(encodedMessage, 'utf8')
      const signedString = btoa(String.fromCharCode.apply(null, signedMessage.signature))
      this.$Worker.execute({
        action: 'signup',
        u: Base64.encode(this.phantom.account + ':' + signedString),
        uRaw: this.phantom.account + ':' + signedString,
        username: this.user.username
      })
        .then((data) => {
          this.response = data
        })
        .then(() => {
          this.processRegistration()
        })
        .catch((err) => console.log(err.message))
    }
  }
}
</script>

<style scoped>
.muArrow, .mdArrow {
  position: relative;
  top: 0;
  transition: top ease 0.5s;
}

.muArrow:hover {
  top: -5px;
}

.mdArrow:hover {
  top: +10px;
}

.bright_card {
  @apply h-full rounded-md surface-variant;
  border: 1px solid var(--md-sys-color-outline-variant);
}

</style>
