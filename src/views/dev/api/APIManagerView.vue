<template>
  <div
    style="min-height: 100vh; background-color: #131313; overflow-x: clip">
    <div style="min-height: 10vh"></div>
    <div class="container">
      <div id="title" class="shadow-box" style="width: 100%; border: 2px solid white; border-radius: 1em">
        <div class="px-3 pt-2" style="display: flex; justify-content: space-between">
          <div style="display: flex">
            <i class="h2 bi bi-cloud-upload text-white d-none d-lg-flex"/>
            <p class="h2 ps-2 fw-bold text-white jetb">API Dashboard</p>
          </div>
          <p id="clock" class="ps-5 text-white text-end jetb">{{ time }}</p>
        </div>
      </div>
      <div id="settings" class="mt-5 shadow-box" style="width: 100%; border-radius: 1em">
        <div id="_server_ip" class="ps-2">
          <label class="text-white jetb" for="server_ip">Server IP Address</label><br>
          <input class="ms-3 fw-bold big-on-small" id="server_ip"
                 style="height: 4ch; background: black; color: white">
          <button title="Save Setting" class="btn text-white" v-on:click="updateServerIP">
            <i class="bi bi-layer-backward px-1" style="font-size: 150%"/> Save
          </button>
        </div>
        <div id="_server_token" class="ps-2">
          <label class="text-white jetb" for="server_ip">Token</label><br>
          <input class="ms-3 fw-bold big-on-small" id="server_token"
                 style="height: 4ch; background: black; color: white">
          <button title="Save Setting" class="btn text-white" v-on:click="updateServerToken">
            <i class="bi bi-layer-backward px-1" style="font-size: 150%"/> Save
          </button>
          <button title="Retrieve Token" class="btn text-white" v-on:click="serverLogin">
            <i class="bi bi-layer-forward px-1" style="font-size: 150%"/> Request
          </button>
        </div>
        <div id="_fcm_token" class="ps-2">
          <label class="text-white jetb" for="fcm_token">FCM Token</label><br>
          <input class="ms-3 fw-bold big-on-small" id="fcm_token"
                 style="height: 4ch; background: black; color: white">
        </div>
      </div>
      <div id="mock-service" class="mt-5 shadow-box" style="width: 100%; border-radius: 1em">
        <div class="ps-2">
          <div style="display: flex">
            <h2 class="ps-2 jetb">M<span><i class="bi bi-hurricane text-white"/></span>CKINGBIRD</h2>
            <button id="mockDescToggler" class="ms-5 btn text-white text-decoration-underline"
                    v-on:click="toggleElement('mock_explanation')">
              What's that?
            </button>
          </div>
          <div id="mock_explanation" style="display: none">
            <hr style="color: white">
            <p class="jetb">
              Test your own API using the brand-new service for anything mocking-service related.
            </p>
            <p class="jetb">
              We've prepared a special endpoint just for you.
              <br>Configure it as needed and you're ready to get mocked.
            </p>
            <p class="jetb">
              Send requests and receive either predefined messages or HTTP response status codes.
              <br>Responses can be sent with or without delay to simulate a more realistic backend.
            </p>
          </div>
          <hr style="color: white">
          <p class="jetb">Send POST requests to
            <span class="ms-1" style="display: inline-block">
              <span class="fw-bold" style="font-size: 115%"
                    @click="copyMockDestination">
                {{ this.endpoint }}
              </span>
              <span class="tooltip-mock-destination" :class="{'show':showMockDestinationCopied}">Copied!</span>
            </span>
          </p>
          <h4 class="jetb">Configuration</h4>
          <!-- Return Type -->
          <div class="config_wrapper d-block">
            <label for="return_type" class="fw-bold jetb">Return&nbsp;Type:</label>
            <select id="return_type" name="return_type" v-model="mockConfig.return_type"
                    class="fw-bold jetb text-black ms-2">
              <option>Message</option>
              <option>HTTP Code</option>
            </select>
            <!-- Message Type if Message -->
            <div v-if="mockConfig.return_type === 'Message'">
              <label for="message_type" class="fw-bold jetb">Message&nbsp;Type:</label>
              <select id="message_type" name="message_type" v-model="mockConfig.message_type"
                      class="fw-bold jetb text-black ms-2">
                <option>Same Message</option>
                <option>Fixed Message</option>
              </select>
            </div>
            <!-- Content Type if Fixed Message Type -->
            <div>
              <label for="content_type" class="fw-bold jetb">Content&nbsp;Type:</label>
              <select id="content_type" name="content_type"
                      v-model="mockConfig.content_type"
                      class="fw-bold jetb text-black ms-2"
                      v-on:change="setCodeMode">
                <option>text/xml</option>
                <option>text/plain</option>
                <option>application/xml</option>
                <option>application/json</option>
              </select>
            </div>
            <!-- Return HTTP Code if HTTP Code -->
            <div v-if="mockConfig.return_type === 'HTTP Code'">
              <label for="return_code" class="fw-bold jetb">Return&nbsp;Code:</label>
              <select id="return_code" name="return_code" v-model="mockConfig.return_code"
                      class="fw-bold jetb text-black ms-2">
                <optgroup label="Success Codes">
                  <option>200 OK</option>
                  <option>201 Created</option>
                  <option>202 Accepted</option>
                </optgroup>
                <optgroup label="Error Codes">
                  <option>400 Bad Request</option>
                  <option>401 Unauthorized</option>
                  <option>403 Forbidden</option>
                  <option>404 Not Found</option>
                </optgroup>
              </select>
            </div>
            <!-- Return Type -->
            <label for="return_delay" class="fw-bold jetb">Return&nbsp;Delay:</label>
            <input type="number" id="return_delay" name="return_delay" v-model="mockConfig.return_delay"
                   class="fw-bold jetb text-black ms-2"
                   style="width: 6ch"
            >
            <select id="return_delay_unit" name="return_delay_unit" v-model="mockConfig.return_delay_unit"
                    class="fw-bold jetb text-black ms-2" style="width: auto">
              <option>Milliseconds</option>
              <option>Seconds</option>
            </select>
          </div>
          <!-- Return Redirect -->
          <div v-if="mockConfig.return_type === 'Message'">
            <label for="return_redirect" class="fw-bold jetb">Redirect:</label>
            <input id="return_redirect" name="return_redirect" v-model="mockConfig.return_redirect"
                   class="fw-bold jetb text-black ms-2"
            >
          </div>
          <!-- Return Message if Fixed Message Type -->
          <br>
          <div>
            <textarea id="return_message" name="return_message" v-model="mockConfig.return_message"></textarea>
          </div>
          <!-- #### #### Confirm Button needs to be at the bottom #### #### -->
          <div style="display: flex">
            <button id="mockConfigSubmit" title="Confirm Settings"
                    class="btn btn-lg btn-dark m-1 conf_confirm_btn"
                    style="display: flex"
                    v-on:click="confirmSettings()">
              Confirm
            </button>
            <span id="confirm_settings_loading" style="display: none; margin-left: 2em; align-items: center">
              <span class="spinner-grow spinner-grow-sm text-info" role="status" aria-hidden="true"></span>
              <span class="jetb ms-2">Communicating with Server...</span>
            </span>
          </div>
          <div style="min-height: 10vh"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/javascript/javascript.js'
import { Base64 } from 'js-base64'

export default {
  name: 'APICentral',
  data () {
    return {
      time: '',
      user: {},
      showMockDestinationCopied: false,
      mockServiceActive: false,
      submitResponse: {},
      mockConfig: {
        content_type: 'text/xml',
        message_type: 'Same Message',
        return_type: 'Message',
        return_message: '',
        return_code: '',
        return_redirect: '',
        return_delay: 0,
        return_delay_unit: 'Seconds'
      },
      timer: null
    }
  },
  mounted () {
    this.checkServerIPField()
    this.checkServerTokenField()
    this.checkFCMTokenField()
    this.cm = CodeMirror.fromTextArea(document.getElementById('return_message'), {
      lineNumbers: true,
      theme: 'dracula',
      mode: 'xml'
    })
    this.loadConfig()
    this.getTime()
    this.timer = setInterval(this.getTime, 1000)
  },
  beforeUnmount () {
    clearInterval(this.timer)
  },
  methods: {
    setCodeMode: function () {
      switch (this.mockConfig.content_type) {
        case 'text/xml':
          this.cm.setOption('mode', 'xml')
          break
        case 'text/plain':
          this.cm.setOption('mode', '')
          break
        case 'application/json':
          this.cm.setOption('mode', 'javascript')
          break
        case 'application/xml':
          this.cm.setOption('mode', 'xml')
          break
      }
    },
    getTime: function () {
      const today = new Date()
      const date = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0')
      const time = today.getHours().toString().padStart(2, '0') + ':' + today.getMinutes().toString().padStart(2, '0') + ':' + today.getSeconds().toString().padStart(2, '0')
      this.time = date + ' ' + time
    },
    checkServerIPField: function () {
      const field = document.getElementById('server_ip')
      field.value = this.$store.state.serverIP
    },
    checkServerTokenField: function () {
      const field = document.getElementById('server_token')
      field.value = this.$store.state.token
    },
    checkFCMTokenField: function () {
      const field = document.getElementById('fcm_token')
      field.value = this.$store.state.fcmToken
    },
    updateServerIP: function () {
      this.$notify(
        {
          title: 'Not Allowed',
          text: 'The server IP currently cannot be changed.',
          type: 'error'
        })
      /*
      const field = document.getElementById('server_ip')
      this.$store.commit('setServerIP', field.value)
      this.$notify(
        {
          title: 'Settings Updated',
          text: 'Server IP change was submitted.',
          type: 'info'
        })
       */
    },
    updateServerToken: function () {
      const field = document.getElementById('server_token')
      this.$store.commit('setServerToken', field.value)
      this.$notify(
        {
          title: 'Settings Updated',
          text: 'Server Token change was submitted.',
          type: 'info'
        })
    },
    serverLogin: function () {
      const headers = new Headers()
      headers.set(
        'Authorization',
        'Basic ' + Base64.encode(this.$store.state.email + ':' + this.$store.state.password)
      )
      fetch(
        this.$store.state.serverIP + '/login',
        {
          method: 'get',
          headers: headers
        }
      )
        .then((res) => res.json())
        .then((data) => (this.loginResponse = JSON.parse(data.contentJson)))
        .then(this.processLogin)
        .catch((err) => this.$notify(
          {
            title: 'Error',
            text: err.message,
            type: 'error'
          }))
    },
    processLogin: function () {
      if (this.loginResponse.httpCode === 200) {
        this.$store.commit('setServerToken', this.loginResponse.token)
        this.checkServerTokenField()
        this.$notify(
          {
            title: 'Token Retrieved',
            text: 'A Token was received from the server.',
            type: 'success'
          })
      } else {
        this.$notify(
          {
            title: 'Error' + this.loginResponse.httpCode,
            text: 'No Token was received from the server.',
            type: 'error'
          })
      }
    },
    toggleElement: function (id, display = 'block') {
      const explanation = document.getElementById(id)
      if (explanation.style.display === display) {
        explanation.style.display = 'none'
      } else {
        explanation.style.display = display
      }
    },
    copyMockDestination: function () {
      this.showMockDestinationCopied = true
      navigator.clipboard.writeText(this.endpoint)
      setTimeout(() => {
        this.showMockDestinationCopied = false
      }, 1000)
    },
    confirmSettings: function () {
      this.toggleElement('confirm_settings_loading', 'flex')
      document.getElementById('mockConfigSubmit').disabled = true
      // Transfer config to server
      this.submitConfig()
    },
    submitConfig: function () {
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      headers.set('Content-Type', 'application/json')
      this.mockConfig.return_message = this.cm.getValue()
      fetch(
        this.$store.state.serverIP + '/mockingbird/submit?type=config',
        {
          method: 'post',
          headers: headers,
          body: JSON.stringify({
            config: this.mockConfig
          })
        }
      )
        .then(this.processSubmitConfigResponse)
        .catch((err) => this.handleSubmitError(err))
    },
    handleSubmitError: function (err) {
      this.toggleElement('confirm_settings_loading', 'flex')
      document.getElementById('mockConfigSubmit').disabled = false
      this.$notify(
        {
          title: 'Error',
          text: err.message,
          type: 'error'
        })
    },
    processSubmitConfigResponse: function () {
      this.toggleElement('confirm_settings_loading', 'flex')
      document.getElementById('mockConfigSubmit').disabled = false
      this.$notify(
        {
          title: 'Config Submitted',
          text: 'Serverside settings got updated.',
          type: 'success'
        })
    },
    loadConfig: function () {
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      headers.set('Content-Type', 'application/json')
      fetch(
        this.$store.state.serverIP + '/mockingbird/submit?type=load_config',
        {
          method: 'get',
          headers: headers
        }
      )
        .then((res) => res.json())
        .then((data) => (this.setConfig(data)))
        .then(this.setCodeMode)
        .catch((err) => this.handleSubmitError(err))
    },
    setConfig: function (data) {
      if (data.config == null) return
      this.mockConfig = data.config
      this.cm.setValue(data.config.return_message)
    }
  },
  computed: {
    token: function () {
      return this.$store.state.token
    },
    endpoint: function () {
      return this.$store.state.serverIP + '/mockingbird?who=' +
        encodeURIComponent(Base64.encode(this.$store.state.username.split('').reverse().join('')).replaceAll('=', ''))
    }
  }
}
</script>

<style scoped>

.shadow-box {
  border-radius: 1em
}

.jetb, .btn {
  color: white;
}

.big-on-small {
  width: 90%
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .big-on-small {
    width: 75%
  }

  label {
    margin-left: 2em;
  }
}

.tooltip-mock-destination.show {
  opacity: 1;
  transition: 0.5s;
  transform: translateY(-60%);
}

.tooltip-mock-destination {
  margin-left: 1ch;
  color: #ffff;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  width: auto;
  opacity: 0;
  transform: translateY(0);
}

label {
  display: inline-block;
  width: 150px;
  margin-left: 0;
}

select {
  width: 200px;
}

</style>
