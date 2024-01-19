<template>
  <div class="w-screen h-screen overflow-hidden pt_nav">
    <div class="w-full h-full rounded-md background px-2.5 py-2 overflow-hidden">
      <div class="w-full h-fit fmt_border_bottom pb-1 mb-4">
        <p class="text-xl font-bold">Mockingbird</p>
      </div>
      <div class="flex flex-col lg:flex-row gap-2 h-full overflow-hidden">
        <div class="px-2.5 py-2 w-full h-[calc(100%-50px)] fmt_border lg:max-w-md overflow-y-auto">
          <p class="font-bold">Configurations</p>
          <button class="btn_bg_primary my-4"
                  v-on:click="createConfig()">
            <span>Create</span>
          </button>
          <template v-if="configs && configs.length > 0">
            <div class="flex gap-2 mt-2 mb-2 items-center">
              <input type="text" class="fmt_input" placeholder="Search Configs..."
                     v-model="searchText">
              <button v-on:click="searchText = ''" class="fmt_input">
                <span class="text-sm">Reset</span>
              </button>
            </div>
            <div class="flex flex-col gap-2">
              <template v-for="config in configs" :key="config.uid">
                <div class="rounded surface p-2"
                     v-if="searchText === '' || configSearchValid(config)">
                  <div class="w-full">
                    <div class="grid grid-cols-1 gap-2 items-center w-full">
                      <div class="flex items-center gap-2">
                        <div class="flex items-center gap-2">
                          <p class="px-1 py-0.5 rounded surface-variant text-sm w-fit font-bold">
                            {{ config.reqMethod }}
                          </p>
                          <p class="font-bold text-xl w-full">{{ config.t }}</p>
                        </div>
                        <div v-on:click="editConfig(config)"
                             class="fmt_button ml-auto"
                             v-tooltip.right="{
                           content: 'Edit'
                         }">
                          <PencilSquareIcon class="h-6 w-6"/>
                        </div>
                      </div>
                      <div class="flex gap-1 items-center w-full">
                        <InformationCircleIcon class="h-5 w-5"/>
                        <p class="text-sm">{{ config.desc }}</p>
                      </div>
                      <div class="flex gap-1 items-center w-full">
                        <ArrowUturnLeftIcon class="h-5 w-5"/>
                        <p class="text-sm">{{ config.respType }}</p>
                      </div>
                    </div>
                    <p class="text-xs px-1 py-0.5 rounded fmt_border w-fit mt-2 surface">
                      {{ getEndpointString(config) }}
                    </p>
                    <div class="flex gap-2 items-center mt-2">
                      <div v-on:click="copyConfigRequest(config)"
                           class="fmt_button"
                           v-tooltip.top="{
                             content: 'Copy cURL request'
                           }">
                        <p class="text-sm">Copy Request</p>
                      </div>
                      <div v-on:click="copyConfigURL(config)"
                           class="fmt_button"
                           v-tooltip.top="{
                             content: 'Copy endpoint URL'
                           }">
                        <p class="text-sm">Copy URL</p>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </template>
          <template v-else>
            <p class="italic mt-2 text-sm">No configs available!<br>
              Add a Mockingbird configuration by clicking the button above.</p>
          </template>
        </div>
        <div class="px-2.5 py-2 fmt_border w-full h-[calc(100%-50px)] overflow-y-auto">
          <div class="flex items-center gap-2">
            <p class="font-bold">Recent Requests</p>
            <div v-if="isRecording"
                 class="relative ml-4 flex gap-3 cursor-default"
                 v-tooltip.top="{
                   content: 'Incoming requests will be shown below'
                 }">
              <div class="relative flex items-center justify-center w-fit">
                <div class="absolute h-3 w-3 rounded-full tertiary animate-ping"></div>
                <div class="absolute h-3 w-3 rounded-full primary-light"></div>
              </div>
              <p class="text-sm">Recording</p>
            </div>
            <div class="ml-auto flex items-center fmt_button"
                 v-on:click="toggleRecording()">
              <template v-if="isRecording">
                <PauseCircleIcon class="h-5 w-5 mr-1"/>
                <p class="text-sm">Pause Recording</p>
              </template>
              <template v-else>
                <PlayCircleIcon class="h-5 w-5 mr-1"/>
                <p class="text-sm">Start Recording</p>
              </template>
            </div>
          </div>
          <div v-show="isActive"
               class="relative w-full overflow-hidden my-2">
            <canvas id="chart_canvas"></canvas>
          </div>
          <div v-show="isActive"
               class="relative w-full flex items-start gap-2">
            <div class="relative w-full max-w-xs overflow-hidden my-2">
              <canvas id="chart_canvas_methods"></canvas>
            </div>
            <div class="w-full m-1 max-h-80 overflow-y-auto">
              <table class="w-full fmt_border surface-variant">
                <tr class="sticky top-0">
                  <th>
                    <p class="text-sm surface-variant fmt_border">
                      Endpoint
                    </p>
                  </th>
                  <th>
                    <p class="text-sm surface-variant fmt_border">
                      Count
                    </p>
                  </th>
                </tr>
                <tr v-for="endpoint in endpointCount" :key="endpoint.t">
                  <td><p class="text-sm fmt_border_top px-1 py-0.5">{{ endpoint.t }}</p></td>
                  <td><p class="text-sm fmt_border_top px-1 py-0.5">{{ endpoint.c }}</p></td>
                </tr>
              </table>
            </div>
          </div>
          <div class="flex gap-2 my-2 items-center">
            <input type="text" class="fmt_input" placeholder="Search Requests..."
                   v-model="searchTextRequests">
            <button v-on:click="searchTextRequests = ''" class="fmt_input">
              <span class="text-sm">Reset</span>
            </button>
            <label for="max_requests" class="text-sm">Max Requests:</label>
            <input type="text" v-model="maxRequests"
                   id="max_requests"
                   class="px-2 py-1 fmt_input w-24">
          </div>
          <template v-if="requests && requests.length > 0">
            <div class="flex flex-col gap-2">
              <template v-for="request in requests" :key="request">
                <div v-if="searchTextRequests === '' || requestSearchValid(request)"
                     class="rounded surface p-2">
                  <div class="flex gap-2 items-center">
                    <p class="px-1 py-0.5 rounded surface-variant mb-2 text-sm w-fit font-bold">
                      {{ request.reqMethod }}
                    </p>
                    <p class="px-1 py-0.5 rounded surface-variant mb-2 text-sm w-fit">
                      {{ getHumanReadableDateText(request.ts, true) }}
                    </p>
                  </div>
                  <p class="text-sm mt-2 mb-1">Endpoint:</p>
                  <p class="text-sm ml-3 font-bold">{{ request.endpoint }}</p>
                  <template v-if="request.reqHeaders && request.reqHeaders.length > 0">
                    <p class="text-sm mt-2 mb-1">Headers:</p>
                    <table class="p-3 ml-3">
                      <tr v-for="header in request.reqHeaders" :key="header">
                        <td class="p-1 fmt_border">
                          <p class="text-sm">
                            {{ header.t }}:
                          </p>
                        </td>
                        <td class="p-1 fmt_border">
                          <p class="text-sm break-all">
                            {{ header.val }}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </template>
                  <template v-if="request.request">
                    <p class="text-sm mt-2 mb-1">Request:</p>
                    <p class="text-sm ml-3 break-all fmt_border px-1 py-0.5">
                      {{ request.request }}
                    </p>
                  </template>
                  <template v-if="request.response">
                    <p class="text-sm mt-2 mb-1">Response:</p>
                    <p class="text-sm ml-3 break-all fmt_border px-1 py-0.5">
                      {{ request.response }}
                    </p>
                  </template>
                </div>
              </template>
            </div>
          </template>
          <template v-else>
            <div class="w-full flex items-center justify-center h-fit">
              <p class="italic mt-2 text-sm">
                No requests have been made so far.
              </p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
  <modal @close="isCreatingConfig = false"
         v-show="isCreatingConfig">
    <template v-slot:header>
      <template v-if="isEditingConfig">
        Edit Config
      </template>
      <template v-else>
        Create Config
      </template>
    </template>
    <template v-slot:body>
      <div class="flex flex-col gap-y-2 w-[calc(100dvw-36px)]">
        <div class="m-1 rounded px-2 py-1 surface-variant">
          <p class="font-bold">
            Create your own Mockingbird API endpoint
          </p>
          <p class="text-sm mt-2">
            HTTP Requests (currently supporting GET and POST)
            towards your endpoints will be analysed and processed by wikiric's backend.
          </p>
          <p class="text-sm mt-2">
            The value of the field "Endpoint" will be used in combination with your username to access the resource.
          </p>
        </div>
        <div class="flex flex-col md:flex-row gap-2 w-full">
          <div class="flex flex-col w-full gap-y-2">
            <p class="font-bold">
              (1/3) Resource (Endpoint)
            </p>
            <label for="config_endpoint" class="text-sm">Endpoint:</label>
            <input type="text" v-model="config.endpoint"
                   id="config_endpoint"
                   required
                   class="px-2 py-1 fmt_input">
            <label for="config_name" class="text-sm">Name:</label>
            <input type="text" v-model="config.t"
                   id="config_name"
                   required
                   class="px-2 py-1 fmt_input">
            <label for="config_desc" class="text-sm">Description (optional):</label>
            <input type="text" v-model="config.desc"
                   id="config_desc"
                   class="px-2 py-1 fmt_input">
            <p class="font-bold">
              (2/3) Request (Incoming)
            </p>
            <label for="request_content_type" class="text-sm">Method:</label>
            <select id="request_content_type" name="content_type"
                    v-model="config.reqMethod"
                    v-on:change="onRequestMethodChange()"
                    class="px-2 py-1 fmt_input">
              <option>GET</option>
              <option>POST</option>
            </select>
            <template v-if="config.reqMethod === 'POST'">
              <label for="request_content_type" class="text-sm">Content&nbsp;Type:</label>
              <select id="request_content_type" name="content_type"
                      v-model="config.reqContentType"
                      class="px-2 py-1 fmt_input">
                <option>text/xml</option>
                <option>text/plain</option>
                <option>application/xml</option>
                <option>application/json</option>
              </select>
            </template>
          </div>
          <div class="flex flex-col w-full gap-y-2">
            <p class="font-bold">
              (3/3) Response (Outgoing)
            </p>
            <div class="hidden">
              <label for="response_content_type" class="text-sm">Method:</label>
              <select id="response_content_type" name="content_type"
                      v-model="config.respMethod"
                      class="px-2 py-1 fmt_input">
                <option>GET</option>
                <option>POST</option>
              </select>
            </div>
            <label for="message_type" class="text-sm">Message&nbsp;Type:</label>
            <select id="message_type" name="message_type" v-model="config.respType"
                    class="px-2 py-1 fmt_input"
                    v-on:change="showResponseCodeMirror()">
              <option value="message-same">Same Message</option>
              <option value="message-fixed">Fixed Message</option>
            </select>
            <label for="return_code" class="text-sm">Return&nbsp;Code:</label>
            <select id="return_code" name="return_code" v-model="config.respStatus"
                    class="px-2 py-1 fmt_input">
              <optgroup label="Success Codes">
                <option value="200">200 OK</option>
                <option value="201">201 Created</option>
                <option value="202">202 Accepted</option>
              </optgroup>
              <optgroup label="Error Codes">
                <option value="400">400 Bad Request</option>
                <option value="401">401 Unauthorized</option>
                <option value="403">403 Forbidden</option>
                <option value="404">404 Not Found</option>
              </optgroup>
            </select>
            <div v-show="config.respType === 'message-fixed'"
                 class="flex flex-col w-full gap-y-2">
              <label for="response_content_type" class="text-sm">Content&nbsp;Type:</label>
              <select id="response_content_type" name="content_type"
                      v-model="config.respContentType"
                      v-on:change="setCodeMode()"
                      class="px-2 py-1 fmt_input">
                <option>text/xml</option>
                <option>text/plain</option>
                <option>application/xml</option>
                <option>application/json</option>
              </select>
              <label for="response_message" class="text-sm">Response:</label>
              <div class="no_fmt w-full h-full min-h-[200px] max-h-[500px] overflow-y-auto"
                   id="response_message_editor">
                <textarea name="response_message" id="response_message" rows="4"
                          v-model="config.response"
                          class="px-2 py-1 fmt_input hidden"></textarea>
              </div>
            </div>
          </div>
        </div>
        <button class="btn_bg_primary mt-4 ml-auto min-w-[100px]"
                v-on:click="submitConfig()">
          <span class="">Submit</span>
        </button>
        <div class="fmt_button_danger mt-2 ml-auto min-w-[100px]"
             v-on:click="submitConfig(true)">
          <p class="">Delete</p>
        </div>
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
</template>

<script>
import modal from '@/components/Modal.vue'
import { ArrowUturnLeftIcon, PencilSquareIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import { PauseCircleIcon, PlayCircleIcon } from '@heroicons/vue/24/solid'
import { toRaw } from 'vue'
import Chart from 'chart.js/auto'
import { Colors } from 'chart.js'
import { basicSetup } from 'codemirror'
import { EditorView, keymap } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { htmlLanguage, html } from '@codemirror/lang-html'
import { indentWithTab } from '@codemirror/commands'
import { language } from '@codemirror/language'
import { json } from '@codemirror/lang-json'

Chart.register(Colors)

export default {
  name: '',
  components: {
    modal,
    PencilSquareIcon,
    ArrowUturnLeftIcon,
    InformationCircleIcon,
    PauseCircleIcon,
    PlayCircleIcon
  },
  data () {
    this.chart = null
    this.chart_methods = null
    this.cm = null
    return {
      configBackup: {},
      config: {
        t: '',
        desc: '',
        endpoint: '',
        reqContentType: 'text/plain',
        reqMethod: 'POST',
        respType: 'message-same',
        respContentType: 'text/plain',
        respMethod: 'POST',
        respStatus: 200,
        response: ''
      },
      configs: [],
      requests: [],
      requestsQueue: new Map(),
      chartData: [],
      chartDataIndex: new Map(),
      analytics: {
        endpoints: new Map(),
        methods: new Map()
      },
      counter: 0,
      isCreatingConfig: false,
      isEditingConfig: false,
      searchText: '',
      searchTextRequests: '',
      totalRequests: 0,
      isRecording: true,
      isActive: false,
      maxRequests: 200
    }
  },
  mounted () {
    this.configBackup = structuredClone(this.config)
    this.initFunction()
    this.startRecording()
  },
  methods: {
    initFunction: function () {
      this.getConfigs()
      this.connector = new BroadcastChannel('connector')
      this.connector.onmessage = event => {
        if (this.isRecording) {
          if (event.data.typ === '[s:MOCKINGBIRD]') {
            if (event.data.act === 'inc_request') {
              const obj = JSON.parse(event.data.msg)
              this.handleIncomingRequest(obj)
            }
          }
        }
      }
      this.createChart()
      this.createMethodsChart()
    },
    getConfigs: function () {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'mockingbird/private/configs'
        })
        .then(async (data) => {
          this.configs = data.result.configs
        })
        .finally(() => resolve())
      })
    },
    submitConfig: function (doDelete = false) {
      if (this.cm != null) {
        this.config.response = this.cm.state.doc.toString()
      }
      let url = 'mockingbird/private/config'
      let method = 'post'
      if (this.isEditingConfig === true) {
        url = 'mockingbird/private/edit/' + this.config.uid
      }
      if (doDelete) {
        url = 'mockingbird/private/delete/' + this.config.uid
        method = 'get'
      }
      if (typeof this.config.respStatus === 'string') {
        this.config.respStatus = parseInt(this.config.respStatus)
      }
      this.$Worker.execute({
        action: 'api',
        method: method,
        url: url,
        body: JSON.stringify(this.config)
      })
      .then(() => {
        this.isCreatingConfig = false
        this.getConfigs()
      })
      .catch((err) => {
        this.$notify(
          {
            title: 'Error!',
            text: err.message,
            type: 'error'
          })
      })
    },
    onRequestMethodChange: function () {
      if (this.config.reqMethod === 'GET') {
        this.config.respType = 'message-fixed'
        this.$notify(
          {
            title: 'Settings Adapted',
            text: 'Response message type changed due to request method being changed to GET',
            type: 'fmt_notify'
          })
      }
    },
    getEndpointString (config) {
      let endpoint = 'cURL'
      // Add Method
      endpoint += ' -X ' + config.reqMethod
      // Are we expecting a POST request?
      if (config.reqMethod === 'POST') {
        // Sample payload
        if (config.reqContentType.includes('xml')) {
          endpoint += ' -d "&lt;sample&gt;PLACEHOLDER&lt;sample/&gt;"'
          endpoint = endpoint.replaceAll('&lt;', '<')
          endpoint = endpoint.replaceAll('&gt;', '>')
        } else if (config.reqContentType.includes('json')) {
          endpoint += ' -d "{\\"sample\\":\\"PLACEHOLDER\\"}"'
        } else {
          endpoint += ' -d "PLACEHOLDER"'
        }
        // Content-Type header
        endpoint += ' -H "Content-Type: ' + config.reqContentType + '"'
      }
      endpoint += ' ' + this.$store.state.serverIP +
        '/mock/u/' + config.usr + '-' + config.endpoint
      return endpoint
    },
    getEndpointURLString (config) {
      return ' ' + this.$store.state.serverIP +
        '/mock/u/' + config.usr + '-' + config.endpoint
    },
    configSearchValid: function (config) {
      if (config.t.includes(this.searchText)) return true
      if (config.desc.includes(this.searchText)) return true
      if (config.endpoint.includes(this.searchText)) return true
      return false
    },
    requestSearchValid: function (request) {
      if (request.endpoint.includes(this.searchTextRequests)) return true
      if (request.request.includes(this.searchTextRequests)) return true
      if (request.response.includes(this.searchTextRequests)) return true
      return false
    },
    editConfig: function (config) {
      // if (this.cm != null) {
      //   this.cm.toTextArea()
      // }
      this.isCreatingConfig = true
      this.isEditingConfig = true
      this.config = structuredClone(config)
      this.showResponseCodeMirror()
    },
    createConfig: function () {
      // if (this.cm != null) {
      //   this.cm.toTextArea()
      // }
      this.isCreatingConfig = true
      this.isEditingConfig = false
      this.config = structuredClone(this.configBackup)
      this.showResponseCodeMirror()
    },
    showResponseCodeMirror: function () {
      setTimeout(() => {
        if (this.cm == null) {
          const elem = document.getElementById('response_message_editor')
          if (elem == null) {
            return
          }
          const tabSize = new Compartment()
          const languageConf = new Compartment()
          const autoLanguage = EditorState.transactionExtender.of(tr => {
            if (!tr.docChanged) return null
            const docIsHTML = /^\s*</.test(tr.newDoc.sliceString(0, 100))
            const stateIsHTML = tr.startState.facet(language) === htmlLanguage
            if (docIsHTML === stateIsHTML) return null
            return {
              effects: languageConf.reconfigure(docIsHTML ? html() : json())
            }
          })
          const state = EditorState.create({
            doc: this.config.response,
            extensions: [
              basicSetup,
              languageConf.of(json()),
              tabSize.of(EditorState.tabSize.of(4)),
              keymap.of([indentWithTab]),
              autoLanguage
            ]
          })
          const view = new EditorView({
            state,
            parent: elem
          })
          if (view == null) return
          this.cm = view
        } else {
          this.cm.dispatch({
            changes: { from: 0, to: this.cm.state.doc.length, insert: this.config.response }
          })
        }
        // this.setCodeMode()
      }, 0)
    },
    copyConfigRequest: function (config) {
      navigator.clipboard.writeText(this.getEndpointString(config))
      this.$notify(
        {
          title: 'Request copied!',
          text: 'CTRL-V to paste.',
          type: 'fmt_notify'
        })
    },
    copyConfigURL: function (config) {
      navigator.clipboard.writeText(this.getEndpointURLString(config))
      this.$notify(
        {
          title: 'URL copied!',
          text: 'CTRL-V to paste.',
          type: 'fmt_notify'
        })
    },
    handleIncomingRequest: function (request) {
      this.isActive = true
      this.totalRequests += 1
      this.requests.unshift(request)
      // Remove last request if there are too many
      while (this.requests.length > this.maxRequests) {
        this.requests.pop()
      }
      if (this.requestsQueue.has(request.endpoint)) {
        let tmp = this.requestsQueue.get(request.endpoint)
        tmp += 1
        this.requestsQueue.set(request.endpoint, tmp)
      } else {
        this.requestsQueue.set(request.endpoint, 1)
      }
      // Further analyse request
      this.processRequest(request)
    },
    getHumanReadableDateText: function (date, withTime = false) {
      if (date == null) return ''
      date = new Date(date)
      const date2 = new Date()
      const diffTime = Math.abs(date2 - date)
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (date.getDate() === date2.getDate() &&
        date.getMonth() === date2.getMonth() &&
        date.getFullYear() === date2.getFullYear()) {
        diffDays = 0
      }
      let suffix = ''
      if (withTime) {
        suffix = ', ' + date.toLocaleTimeString('de-DE')
      }
      if (diffDays === 0) {
        return 'Today' + suffix
      } else if (diffDays === 1) {
        return 'Yesterday' + suffix
      } else if (diffDays === 2) {
        return '2 days ago' + suffix
      } else {
        return date.toLocaleDateString('de-DE') + suffix
      }
    },
    startRecording: function () {
      setTimeout(() => {
        if (this.isRecording && this.isActive) {
          // Increment counter to keep track of what endpoints where actually used
          this.counter += 1
          // Get current time and append it to the chart's labels
          const dateTmp = new Date()
          const dateTs = dateTmp.toLocaleTimeString('de-DE')
          this.chart.data.labels.push(dateTs)
          // Are there new requests?
          this.processNewRequests(dateTs)
          // Now append empty values for all unused endpoints
          this.processUnusedRequests(dateTs)
          // Update charts
          this.chart.update()
          this.chart_methods.update()
        }
        // Recursive call
        this.startRecording()
      }, 1000)
    },
    processNewRequests: function (dateTs) {
      if (this.requestsQueue.size > 0) {
        this.chartData = []
        this.requestsQueue.forEach((val, key) => {
          if (key) {
            // Do we know this dataset?
            if (this.chartDataIndex.has(key)) {
              // Update dataset index
              const index = this.chartDataIndex.get(key)
              index.d.push({
                ts: dateTs,
                count: val
              })
              index.c = this.counter
              // Modify existing dataset
              this.chart.data.datasets[index.i] = this.getChartData(index.d, key)
            } else {
              // Add new dataset to index
              // First, we need to add empty values to reach the current time
              const newData = []
              for (let i = 0; i < this.counter; i++) {
                newData.push({
                  ts: dateTs,
                  count: 0
                })
              }
              // Now append actual data
              newData.push({
                ts: dateTs,
                count: val
              })
              this.chartDataIndex.set(key, {
                i: this.chartDataIndex.size,
                d: newData,
                c: this.counter
              })
              // Append new dataset
              this.chart.data.datasets.push(this.getChartData(newData, key))
            }
          }
        })
        // Reset queue
        this.requestsQueue = new Map()
      }
    },
    processUnusedRequests: function (dateTs) {
      this.chartDataIndex.forEach((val, key) => {
        if (val.c !== this.counter) {
          // Update dataset index with empty value
          const index = this.chartDataIndex.get(key)
          index.d.push({
            ts: dateTs,
            count: 0
          })
          index.c = this.counter
          // Modify existing dataset
          this.chart.data.datasets[index.i] = this.getChartData(index.d, key)
        }
      })
    },
    processRequest: function (request) {
      // Do we know this method?
      let method
      if (this.analytics.methods.has(request.reqMethod)) {
        // Update
        method = this.analytics.methods.get(request.reqMethod)
        method.d += 1
      } else {
        // Append
        method = {
          t: request.reqMethod,
          d: 1,
          i: this.analytics.methods.size
        }
      }
      this.analytics.methods.set(request.reqMethod, method)
      // Generate labels and dataset for method chart
      const labels = []
      const dataset = {
        label: 'Count',
        data: []
      }
      this.analytics.methods.forEach((val, key) => {
        if (key) {
          labels.push(val.t)
          dataset.data.push(val.d)
        }
      })
      this.chart_methods.data.labels = labels
      this.chart_methods.data.datasets = [dataset]
      // Do we know this endpoint?
      let endpoint
      if (this.analytics.endpoints.has(request.endpoint)) {
        endpoint = this.analytics.endpoints.get(request.endpoint)
        endpoint.c += 1
      } else {
        endpoint = {
          t: request.endpoint,
          c: 1
        }
      }
      this.analytics.endpoints.set(request.endpoint, endpoint)
    },
    createChart: function () {
      this.chart = new Chart(
        document.getElementById('chart_canvas'),
        {
          type: 'line',
          options: {
            animation: false,
            responsive: true,
            aspectRatio: 3,
            plugins: {
              tooltip: {
                intersect: false
              }
            }
          },
          data: {
            labels: [],
            datasets: []
          }
        })
    },
    createMethodsChart: function () {
      this.chart_methods = new Chart(
        document.getElementById('chart_canvas_methods'),
        {
          type: 'polarArea',
          options: {
            animation: false,
            responsive: true,
            aspectRatio: 1,
            plugins: {
              tooltip: {
                intersect: false
              }
            }
          },
          data: {
            labels: [],
            datasets: []
          }
        })
    },
    getChartData: function (data, label) {
      const chartData = toRaw(data)
      return {
        label: label,
        data: chartData.map(row => row.count),
        fill: true
      }
    },
    setCodeMode: function () {
      // switch (this.config.respContentType) {
      //   case 'text/xml':
      //     this.cm.setOption('mode', 'xml')
      //     break
      //   case 'text/plain':
      //     this.cm.setOption('mode', '')
      //     break
      //   case 'application/json':
      //     this.cm.setOption('mode', 'javascript')
      //     break
      //   case 'application/xml':
      //     this.cm.setOption('mode', 'xml')
      //     break
      //   default:
      //     this.cm.setOption('mode', '')
      // }
    },
    toggleRecording: function () {
      this.isRecording = !this.isRecording
    },
    compareCount: function (a, b) {
      return b.c - a.c
    }
  },
  computed: {
    endpointString () {
      let endpoint = 'cURL'
      // Add Method
      endpoint += ' -X ' + this.config.reqMethod
      // Are we expecting a POST request?
      if (this.config.reqMethod === 'POST') {
        // Sample payload
        if (this.config.reqContentType.includes('xml')) {
          endpoint += ' -d "&lt;sample&gt;PLACEHOLDER&lt;sample/&gt;"'
          endpoint = endpoint.replaceAll('&lt;', '<')
          endpoint = endpoint.replaceAll('&gt;', '>')
        } else if (this.config.reqContentType.includes('json')) {
          endpoint += ' -d "{\\"sample\\":\\"PLACEHOLDER\\"}"'
        } else {
          endpoint += ' -d "PLACEHOLDER"'
        }
        // Content-Type header
        endpoint += ' -H "Content-Type: ' + this.config.reqContentType + '"'
      }
      endpoint += ' ' + this.$store.state.serverIP +
        '/mock/u/' + this.$store.state.username + '-' + this.config.endpoint
      return endpoint
    },
    endpointCount () {
      if (this.analytics.endpoints.size < 1) return []
      const hist = []
      this.analytics.endpoints.forEach((val, key) => {
        if (key) {
          hist.push(val)
        }
      })
      hist.sort(this.compareCount)
      return hist
    }
  }
}
</script>

<style>

.cm-editor {
  @apply w-full h-full fmt_border overflow-hidden;
  background-color: var(--md-sys-color-surface-light);
}

</style>
