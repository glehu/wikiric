<template>
  <div style="min-height: 10vh"></div>
  <div class="d-md-flex align-items-center">
    <div class="mt-2 text-white" style="padding-left: 10vw">
      <h2 class="fw-bold" style="font-family: 'Lato', sans-serif; pointer-events: none">
        Welcome
      </h2>
      <div class="d-flex">
        <div class="mb-2"
             style="text-align: justify; text-justify: inter-word; width: 200px; pointer-events: none">
          Only a few steps 'till success. Before you lie many possibilities and experiments.
          It is up to you to discover them and figure out what's next. But it is our mission,
          to assist you and make you a part of this project.
        </div>
        <div class="text-center" style="width: 200px">
          <button title="GitHub"
                  class="btn bi-github p-3 btn-lg muArrow" style="color: white;" v-on:click="redirectGitHub"/>
          <br>
          <div class="d-md-none d-block">
            <button title="Registration"
                    class="btn bi-arrow-down p-3 btn-lg mdArrow"
                    style="color: white;" v-on:click="scrollTo('registration')"/>
          </div>
        </div>
      </div>
    </div>
    <form class=" register
          " @submit.prevent="register">
      <section>
        <div id="registration" class="container h-100 p-4">
          <div class="justify-content-center align-items-center h-100">
            <div class="card text-white" style="border-radius: 1rem; background: #131313">
              <div class="card-body p-5 text-center">
                <div class="mt-md-0 pb-5">
                  <h1 class="fw-bold mb-3" style="font-family: 'Lato', sans-serif; pointer-events: none">
                    Register
                  </h1>
                  <div class="form-outline form-white mb-4">
                    <input
                      required
                      v-model="user.email"
                      type="email"
                      placeholder="Email"
                    />
                  </div>
                  <div class="form-outline form-white mb-4">
                    <input
                      required
                      v-model="user.password"
                      type="password"
                      placeholder="Password"
                    />
                  </div>
                  <div class="form-outline form-white mb-4">
                    <input
                      required
                      v-model="user.passwordRpt"
                      type="password"
                      placeholder="Confirm Password"
                    />
                  </div>
                  <div class="form-outline form-white mb-4">
                    <p style="pointer-events: none">How should we call you?</p>
                    <input
                      required
                      v-model="user.username"
                      type="text"
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
    </form>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'

export default {
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
      const headers = new Headers()
      headers.set(
        'Content-Type', 'application/json'
      )
      fetch(
        this.$store.state.serverIP + '/register',
        {
          method: 'post',
          headers: headers,
          body: JSON.stringify({
            email: this.user.email,
            username: this.user.username,
            password: this.user.password
          })
        }
      )
        .then((res) => res.json())
        .then((data) => (this.response = data))
        .then(this.processRegistration)
        .catch((err) => console.log(err.message))
    },
    processRegistration () {
      if (this.response.success) {
        if (this.usageTracker) {
          this.sendUsageData({
            source: 'web',
            module: 'register',
            action: 'register'
          })
        }
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
        this.user.username = ''
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
    async sendUsageData (usageObj) {
      const headers = new Headers()
      headers.set('Authorization', 'Basic ' +
        Base64.encode(this.$store.state.username + ':' + this.$store.state.password).toString('base64'))
      headers.set('Content-Type', 'application/json')
      fetch(
        this.$store.state.serverIP + '/api/utr',
        {
          method: 'post',
          headers: headers,
          body: JSON.stringify(usageObj)
        }
      ).then(r => console.log(r))
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
