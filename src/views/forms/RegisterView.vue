<template>
  <div class="h-screen w-screen d-md-flex align-items-center justify-center pt-[60px]">
    <form class="register flex"
          @submit.prevent="register">
      <template v-if="metamask.account === ''">
        <section>
          <div id="registration" class="container h-full p-3">
            <div class="justify-content-center align-items-center h-full">
              <div class="card text-white border-[1px] border-neutral-600 h-full"
                   style="border-radius: 1rem; background: #131313">
                <div class="card-body p-5 text-center">
                  <div class="mt-md-0">
                    <h1 class="fw-bold mb-4 text-4xl"
                        style="pointer-events: none">
                      REGISTER
                    </h1>
                    <div class="form-outline form-white mb-4">
                      <input
                        required
                        v-model="user.email"
                        type="email"
                        class="text-black py-1 px-2 rounded placeholder-neutral-600"
                        placeholder="Email"
                      />
                    </div>
                    <div class="form-outline form-white mb-4">
                      <input
                        required
                        v-model="user.password"
                        type="password"
                        class="text-black py-1 px-2 rounded placeholder-neutral-600"
                        placeholder="Password"
                        autocomplete="new-password"
                      />
                    </div>
                    <div class="form-outline form-white mb-4">
                      <input
                        required
                        v-model="user.passwordRpt"
                        type="password"
                        class="text-black py-1 px-2 rounded placeholder-neutral-600"
                        placeholder="Confirm Password"
                        autocomplete="new-password"
                      />
                    </div>
                    <div class="form-outline form-white mb-4">
                      <p class="pointer-events-none text-neutral-300 py-1">How should we call you?</p>
                      <input
                        required
                        v-model="user.username"
                        type="text"
                        class="text-black py-1 px-2 rounded placeholder-neutral-600 placeholder-wave"
                        placeholder="Username"
                      />
                    </div>
                    <button class="btn btn-outline-light btn-lg px-5" type="submit">Register</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
      <template v-if="hasMetaMask">
        <section>
          <div id="metamask_registration" class="container h-full p-3">
            <div class="justify-content-center align-items-center h-full">
              <div class="card text-white border-[1px] border-neutral-600 h-full"
                   style="border-radius: 1rem; background: #131313">
                <div class="card-body p-5 text-center">
                  <div class="mt-md-0">
                    <p class="pointer-events-none">Register via</p>
                    <h1 class="fw-bold text-4xl"
                        style="pointer-events: none">
                      MetaMask
                    </h1>
                    <div class="w-full h-[128px] flex justify-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                           class="w-full h-full"
                           alt="MetaMask Icon">
                    </div>
                    <template v-if="metamask.account === ''">
                      <div>
                        <button class="rounded py-2 px-4 bg-zinc-700 m-1 hover:bg-zinc-800 my-4"
                                type="button"
                                v-on:click="handleMetaMaskLogin()">
                          Connect
                        </button>
                      </div>
                    </template>
                    <div class="form-outline form-white mb-4">
                      <p class="pointer-events-none text-neutral-300 py-1">How should we call you?</p>
                      <input
                        required
                        v-model="user.username"
                        type="text"
                        class="text-black py-1 px-2 rounded placeholder-neutral-600 placeholder-wave"
                        placeholder="Username"
                      />
                    </div>
                    <button class="btn btn-outline-light btn-lg px-5"
                            type="submit"
                            v-show="metamask.account !== ''">
                      Register
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
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'
import { Base64 } from 'js-base64'

export default {
  mounted () {
    this.checkForMetaMask()
  },
  data () {
    return {
      user: {
        email: '',
        username: '',
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
      }
    }
  },
  computed: {
    usageTracker () {
      return this.$store.state.usageTracking
    }
  },
  methods: {
    register () {
      if (this.user.password === this.user.passwordRpt) {
        this.serverRegister()
      } else {
        this.user.passwordRpt = ''
        alert('Passwords do not match.')
      }
    },
    serverRegister () {
      if (this.hasMetaMask) {
        this.handleMetaMaskSignup()
      } else {
        this.$Worker.execute({
          action: 'signup',
          u: Base64.encode(this.user.email + ':' + this.user.password),
          uRaw: this.user.email + ':' + this.user.password,
          username: this.user.username
        })
          .then((data) => (this.response = data))
          .then(this.processRegistration)
          .catch((err) => console.log(err.message))
      }
    },
    processRegistration () {
      if (this.response.success) {
        const params = new Proxy(new URLSearchParams(window.location.search), {
          get: (searchParams, prop) => searchParams.get(prop)
        })
        const redirect = params.redirect
        if (redirect) {
          this.$router.push('/login?redirect=' + redirect)
        } else {
          this.$router.push('/login?redirect=/account')
        }
      } else {
        this.user.email = ''
        this.user.password = ''
        this.user.passwordRpt = ''
        alert(this.response.message)
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
        .then((data) => (this.response = data))
        .then(this.processRegistration)
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
</style>
