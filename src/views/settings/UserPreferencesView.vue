<template>
  <div class="preferences" style="min-height: 100vh; background-color: #131313">
    <div style="min-height: 60px"></div>
    <div class="container mt-5" style="width: 100vw; justify-items: center; display: grid; text-align: center">
      <h1 class="fw-bold text-gray-300 text-5xl mb-2">
        Hey, no running in the hallways!
      </h1>
      <h2 class="text-gray-400 text-3xl">
        You must accept the usage of cookies to visit this website.
      </h2>
      <button class="btn text-gray-400 text-decoration-underline"
              v-on:click="toggleExplanation('cookieExplanation')">
        What's that?
      </button>
      <div id="cookieExplanation" style="display: none">
        <hr style="color: white">
        <p class="text-gray-400 my-3">
          Cookies (data stored locally on your device) are required for this website.
          <br>Without those, the website cannot operate as intended, and worse, the cookie monster will be saddened.
        </p>
        <hr style="color: white">
      </div>
      <button style="font-size: 200%" class="btn btn-lg btn-outline-success mt-4" v-on:click="confirm">
        Accept Cookies
      </button>
      <!-- #### REVOKE #### -->
      <template v-if="generalCookieAllowance">
        <button class="btn btn-lg btn-outline-danger mt-5"
                v-on:click="revokeCookieAllowances">
          <span>Reject<br>Cookies</span>
        </button>
        <div class="mt-2 text-gray-400">
          By rejecting all cookies you are also revoking your rights to the usage of this website.
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WUserPreferences',
  computed: {
    generalCookieAllowance () {
      return this.$store.state.cookieAllowance
    },
    usageTrackingAllowance () {
      return this.$store.state.usageTracking
    },
    usageTracker () {
      return this.$store.state.usageTracking
    }
  },
  methods: {
    revokeCookieAllowances () {
      this.$store.commit('revokeAllCookieAllowances')
    },
    allowEssentialCookies () {
      this.$store.commit('allowCookie', 'Essential')
    },
    denyUsageTracking () {
      this.$store.commit('denyUsageTracking')
    },
    allowUsageTracking () {
      this.$store.commit('allowUsageTracking')
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'preferences',
          action: 'allowUsageTracking'
        })
      }
    },
    toggleExplanation (explanationId) {
      const explanation = document.getElementById(explanationId)
      if (explanation.style.display === 'block') {
        explanation.style.display = 'none'
      } else {
        explanation.style.display = 'block'
      }
    },
    confirm () {
      this.allowEssentialCookies()
      if (this.generalCookieAllowance) {
        this.$router.push(this.$route.query.redirect.toString() || '/')
      } else {
        this.$notify(
          {
            title: 'Missing cookie allowance!',
            text: 'Essential cookies need to be allowed.',
            type: 'error'
          })
      }
    },
    async sendUsageData (usageObj) {
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      headers.set(
        'Content-Type', 'application/json'
      )
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
</style>
