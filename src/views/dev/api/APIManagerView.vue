<template>
  <div class="mt-[55px] h-full w-full overflow-y-scroll text-neutral-200">
    <div class="p-4 max-w-screen-lg mx-auto">
      <div id="title" class="shadow-box" style="width: 100%; border: 2px solid white; border-radius: 1em">
        <div class="px-3 py-2 flex items-center justify-between">
          <div style="display: flex">
            <i class="h2 bi bi-cloud-upload hidden lg:flex"/>
            <p class="h2 px-2 font-bold text-white">API Dashboard</p>
          </div>
          <p id="clock" class="px-5 text-end">{{ time }}</p>
        </div>
      </div>
      <div id="settings" class="mt-5 shadow-box" style="width: 100%; border-radius: 1em">
        <div id="_server_ip" class="px-2">
          <label class="text-white" for="server_ip">Server IP Address</label><br>
          <input class="mckInput dark_bg" id="server_ip">
          <button title="Save Setting" class="text-white ml-2" v-on:click="updateServerIP">
            <i class="bi bi-layer-backward px-1" style="font-size: 150%"/> Save
          </button>
        </div>
        <div id="_fcm_token" class="px-2 mt-3">
          <label class="text-white" for="fcm_token">FCM Token</label><br>
          <input class="mckInput dark_bg" id="fcm_token">
        </div>
      </div>
      <div id="mock-service" class="mt-5 medium_bg rounded w-full">
        <div class="p-3">
          <div class="flex items-center mt-2">
            <div class="px-2 text-3xl font-bold">
              M<span><i class="bi bi-hurricane text-white"/></span>CKINGBIRD
            </div>
            <button id="mockDescToggler" class="mx-5 btn text-decoration-underline"
                    v-on:click="toggleElement('mock_explanation')">
              What's that?
            </button>
          </div>
          <div id="mock_explanation" style="display: none">
            <hr style="color: white">
            <p class="">
              Test your own API using the brand-new service for anything mocking-service related.
            </p>
            <p class="">
              We've prepared a special endpoint just for you.
              <br>Configure it as needed and you're ready to get mocked.
            </p>
            <p class="">
              Send requests and receive either predefined messages or HTTP response status codes.
              <br>Responses can be sent with or without delay to simulate a more realistic backend.
            </p>
          </div>
          <hr style="color: white">
          <p>Send POST requests to:</p>
          <div class="m-2 px-3 py-4 rounded-md dark_bg" style="display: inline-block">
              <span class="font-bold" style="font-size: 115%"
                    @click="copyMockDestination">
                {{ this.endpoint }}
              </span>
            <span class="tooltip-mock-destination" :class="{'show':showMockDestinationCopied}">Copied!</span>
          </div>
          <!-- Return Type -->
          <div class="md:flex">
            <div>
              <p>Configuration:</p>
              <div class="config_wrapper block m-2 px-3 py-4 rounded-md dark_bg">
                <div class="config_wrapper">
                  <label for="return_type" class="font-bold">Return&nbsp;Type:</label>
                  <select id="return_type" name="return_type" v-model="mockConfig.return_type"
                          class="font-bold medium_bg mx-2">
                    <option>Message</option>
                    <option>HTTP Code</option>
                  </select>
                </div>
                <!-- Message Type if Message -->
                <div v-if="mockConfig.return_type === 'Message'" class="config_wrapper">
                  <label for="message_type" class="font-bold">Message&nbsp;Type:</label>
                  <select id="message_type" name="message_type" v-model="mockConfig.message_type"
                          class="font-bold medium_bg mx-2">
                    <option>Same Message</option>
                    <option>Fixed Message</option>
                  </select>
                </div>
                <!-- Content Type if Fixed Message Type -->
                <div class="config_wrapper">
                  <label for="content_type" class="font-bold">Content&nbsp;Type:</label>
                  <select id="content_type" name="content_type"
                          v-model="mockConfig.content_type"
                          class="font-bold medium_bg mx-2"
                          v-on:change="setCodeMode">
                    <option>text/xml</option>
                    <option>text/plain</option>
                    <option>application/xml</option>
                    <option>application/json</option>
                  </select>
                </div>
                <!-- Return HTTP Code -->
                <div class="config_wrapper">
                  <label for="return_code" class="font-bold">Return&nbsp;Code:</label>
                  <select id="return_code" name="return_code" v-model="mockConfig.return_code"
                          class="font-bold medium_bg mx-2">
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
                <div class="config_wrapper">
                  <label for="return_delay" class="font-bold">Return&nbsp;Delay:</label>
                  <input type="number" id="return_delay" name="return_delay" v-model="mockConfig.return_delay"
                         class="font-bold dark_bg mx-2"
                         style="width: 6ch">
                  <select id="return_delay_unit" name="return_delay_unit" v-model="mockConfig.return_delay_unit"
                          class="font-bold medium_bg mx-2" style="width: auto">
                    <option>Milliseconds</option>
                    <option>Seconds</option>
                  </select>
                </div>
                <!-- Return Redirect -->
                <div v-if="mockConfig.return_type === 'Message'" class="config_wrapper">
                  <label for="return_redirect" class="font-bold">Redirect:</label>
                  <input id="return_redirect" name="return_redirect" v-model="mockConfig.return_redirect"
                         class="font-bold medium_bg mx-2">
                </div>
              </div>
            </div>
            <!-- Return Message if Fixed Message Type -->
            <div class="m-2 w-full h-full">
              <p>Response Message:</p>
              <textarea id="return_message" name="return_message" v-model="mockConfig.return_message"></textarea>
            </div>
          </div>
          <!-- #### #### Confirm Button needs to be at the bottom #### #### -->
          <div class="m-1 flex">
            <button id="mockConfigSubmit" title="Confirm Settings"
                    class="conf_confirm_btn"
                    style="display: flex"
                    v-on:click="confirmSettings()">
              Update Settings
            </button>
            <span id="confirm_settings_loading" style="display: none; margin-left: 2em; align-items: center">
              <div class="animate-ping w-2 h-2 rounded-full bg-indigo-400" role="status"></div>
              <span class="mx-2">Communicating with Server...</span>
            </span>
          </div>
        </div>
        <div class="my-5 pb-2">
          <p class="ml-3 my-2">Real-Time Surveillance:</p>
          <table class="min-h-[500px] w-full table-auto rounded-b-md p-2 overflow-hidden"
                 style="margin-bottom: 100px !important">
            <thead>
            <tr class="h-[20px] text-left items-center">
              <th class="p-2 sticky top-0 dark_bg z-50">#</th>
              <th class="p-2 sticky top-0 dark_bg z-50">HTTP Code</th>
              <th class="p-2 sticky top-0 dark_bg z-50">Analysis</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-zinc-500 h-fit">
            <template v-for="callback in callbacks" :key="callback">
              <tr class="w-full p-1 h-fit text-left">
                <td class="py-2">{{ callback._length }}</td>
                <td class="py-2">
                  <div class="flex items-center">
                    <template v-if="callback.responseCode.substring(0,1) === '2'">
                      <div class="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    </template>
                    <template v-else>
                      <div class="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                    </template>
                    <span class="">{{ callback.responseCode }}</span>
                  </div>
                </td>
                <td class="py-2">
                  <p class="my-2 text-lg font-bold">Request:</p>
                  <template v-for="header in callback.requestHeaders" :key="header">
                    <div>
                      {{ header.name }}: {{ header.value }}
                    </div>
                  </template>
                  <div class="mt-2 w-full">
                    <textarea :id="'payloadTextRequ_' + callback._length" class="w-full hidden"
                              v-model="callback.requestPayload"></textarea>
                  </div>
                  <p class="my-2 text-lg font-bold">Response:</p>
                  <div class="mt-2 w-full">
                    <textarea :id="'payloadTextResp_' + callback._length" class="w-full hidden"
                              v-model="callback.responsePayload"></textarea>
                  </div>
                </td>
              </tr>
            </template>
            <template v-if="callbacks.length === 0">
              <tr>
                <td class="p-2"></td>
                <td class="p-2"></td>
                <td class="p-2">
                  <div class="p-2 rounded-md darkest_bg w-fit">
                    <div class="text-center">
                      <p>No Requests recorded yet.</p>
                      <p class="mt-2">
                        Send POST requests to the URL shown above to have them show up here!
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/ayu-mirage.css'
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
        return_delay_unit: 'Seconds',
        callbackUsername: ''
      },
      callbacks: [],
      timer: null
    }
  },
  mounted () {
    this.checkServerIPField()
    this.checkFCMTokenField()
    this.cm = CodeMirror.fromTextArea(document.getElementById('return_message'), {
      lineNumbers: true,
      theme: 'ayu-mirage',
      mode: 'xml'
    })
    this.loadConfig()
    this.getTime()
    this.timer = setInterval(this.getTime, 1000)
    this.connector = new BroadcastChannel('connector')
    this.connector.onmessage = event => {
      if (event.data.type === 'mock') {
        const obj = JSON.parse(event.data.obj)
        obj._length = this.callbacks.length + 1
        this.callbacks.unshift(obj)
        setTimeout(() => {
          let txA = document.getElementById('payloadTextRequ_' + obj._length)
          if (txA) {
            CodeMirror.fromTextArea(txA, {
              lineNumbers: true,
              theme: 'ayu-mirage',
              mode: 'null'
            })
          }
          txA = document.getElementById('payloadTextResp_' + obj._length)
          if (txA) {
            CodeMirror.fromTextArea(txA, {
              lineNumbers: true,
              theme: 'ayu-mirage',
              mode: 'null'
            })
          }
        }, 0)
      }
    }
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
      return new Promise((resolve) => {
        this.mockConfig.return_message = this.cm.getValue()
        this.$Worker.execute({
          action: 'api-no-prefix',
          method: 'post',
          url: 'mockingbird/submit?type=config',
          body: JSON.stringify({
            config: this.mockConfig
          })
        })
          .then(this.processSubmitConfigResponse)
          .then(resolve)
          .catch((err) => this.handleSubmitError(err))
      })
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
          type: 'info'
        })
    },
    loadConfig: function () {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api-no-prefix',
          method: 'get',
          url: 'mockingbird/submit?type=load_config'
        })
          .then((data) => (this.setConfig(data.result)))
          .then(this.setCodeMode)
          .then(resolve)
          .catch((err) => this.handleSubmitError(err))
      })
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

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
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

.mckInput {
  @apply font-bold rounded-md px-3 py-2;
}

.conf_confirm_btn {
  @apply btn_bg_primary;
}

.config_wrapper {
  @apply my-2;
}

</style>
