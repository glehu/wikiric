<template>
  <div class="preferences" style="min-height: 100vh; background-color: #0A0A0F">
    <div style="min-height: 10ch"></div>
    <div class="container" style="margin: auto">
      <h1 class="fw-bold text-white p-3">
        Hey, no running in the hallways!
      </h1>
      <div class="mt-3">
        <div class="text-white">
          <h2>
            Allow Cookies?
          </h2>
          <button class="btn text-white text-decoration-underline"
                  v-on:click="toggleExplanation('cookieExplanation')">
            What's that?
          </button>
        </div>
        <div id="cookieExplanation" style="display: none">
          <hr style="color: white">
          <p class="text-white">
            Cookies (data stored locally on your device) are required for this website.
            <br>Without those, the website cannot operate as intended, and worse, the cookie monster will be saddened.
          </p>
          <hr style="color: white">
        </div>
        <div class="d-md-flex">
          <div class="btn-group">
            <button class="btn btn-lg btn-outline-danger" v-on:click="revokeCookieAllowances"
                    style="width: 150px">
              <span>No<br>Cookies</span>
            </button>
            <button class="btn btn-lg btn-outline-info ms-1" v-on:click="allowEssentialCookies"
                    style="width: 150px">
              <span>Essential<br>Cookies</span>
            </button>
          </div>
          <p class="ms-3 text-white">
            Are cookies currently allowed?
            <span class="fw-bold ms-2" style="font-size: 200%">
            {{ generalCookieAllowance }}
          </span>
          </p>
        </div>
      </div>
      <div class="mt-5">
        <div class="text-white">
          <h2>
            Allow usage tracking?
          </h2>
          <button class="btn text-white text-decoration-underline"
                  v-on:click="toggleExplanation('trackingExplanation')">
            What's that?
          </button>
        </div>
        <div id="trackingExplanation" style="display: none">
          <hr style="color: white">
          <p class="text-white">
            In order to optimize the website, I need your usage data to know what you're doing most of the time.
            <br>No personal data will be sent to the server.
          </p>
          <hr style="color: white">
        </div>
        <div class="d-md-flex">
          <div class="btn-group">
            <button class="btn btn-lg btn-outline-danger" v-on:click="denyUsageTracking"
                    style="width: 150px">
              <span>No Usage<br>Tracking</span>
            </button>
            <button class="btn btn-lg btn-outline-info ms-1" v-on:click="allowUsageTracking"
                    style="width: 150px">
              <span>Allow Usage<br>Tracking</span>
            </button>
          </div>
          <p class="ms-3 text-white">
            Is usage tracking currently allowed?
            <span class="fw-bold ms-2" style="font-size: 200%">
            {{ usageTrackingAllowance }}
          </span>
          </p>
        </div>
      </div>
      <div class="mt-3 p-3">
        <button class="btn btn-lg btn-outline-success mt-2" v-on:click="confirm">Confirm</button>
      </div>
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
