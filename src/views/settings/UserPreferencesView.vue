<template>
  <div class="preferences w-full h-full pt-[55px] px-8 pb-8
              flex items-center justify-center"
       style="background-color: #131313">
    <div class="container mt-5 w-full"
         style="justify-items: center; display: grid; text-align: center">
      <h1 class="font-bold text-neutral-200 text-5xl mb-8">
        Hey, no running in the hallways!
      </h1>
      <h2 class="text-neutral-300 text-2xl">
        You must accept the usage of cookies to visit this website.
      </h2>
      <button class="text-neutral-400 my-4"
              v-on:click="toggleExplanation('cookieExplanation')">
        What's that?
      </button>
      <div id="cookieExplanation" style="display: none">
        <hr style="color: white">
        <p class="text-neutral-400 my-3">
          Cookies (data stored locally on your device) are required for this website.
          <br>Without those, the website cannot operate as intended, and worse, the cookie monster will be saddened.
        </p>
        <hr style="color: white">
      </div>
      <button class="my-4 font-bold text-3xl text-emerald-400
                     border-2 border-emerald-400 p-2 rounded-md"
              v-on:click="confirm">
        Accept Cookies
      </button>
      <!-- #### REVOKE #### -->
      <template v-if="generalCookieAllowance">
        <button class="my-4 font-bold text-xl text-red-400
                       border-2 border-red-400 p-2 rounded-md"
                v-on:click="revokeCookieAllowances">
          Reject Cookies
        </button>
        <div class="text-neutral-400">
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
