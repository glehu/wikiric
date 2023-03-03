<template>
  <div id="processViewer" ref="processViewer"
       class="medium_bg w-full h-full absolute overflow-hidden rounded-tr-lg">
    <div class="text-neutral-300 w-full min-h-[50px] max-h-[50px] px-2 flex items-center medium_bg">
      <div class="sidebar_button bright_bg rounded-xl w-fit mr-2">
        <div v-on:click="clickedBack()"
             v-tooltip="{ content: 'Exit' }"
             class="cursor-pointer hover:text-neutral-200 p-2">
          <XMarkIcon class="h-6 w-6"></XMarkIcon>
        </div>
      </div>
      <div class="sidebar_button bright_bg rounded-xl w-fit mr-2">
        <div v-on:click="clickedBack()"
             v-tooltip="{ content: 'Generate Documentation' }"
             class="cursor-pointer hover:text-neutral-200 p-2">
          <DocumentArrowDownIcon class="h-6 w-6"></DocumentArrowDownIcon>
        </div>
      </div>
      <div class="darkest_bg rounded p-2 ml-auto">
        <div class="flex items-center text-neutral-200">
          <div>
            <p class="text-sm font-bold">Experimental Feature</p>
          </div>
        </div>
      </div>
    </div>
    <template v-if="processEvents.length > 0">
      <div class="h-[calc(100%-40px)] w-full p-2 overflow-y-auto pb-40 flex justify-center bright_bg rounded-tl-md">
        <div class="grid grid-cols-1 gap-0 w-full">
          <template v-for="segment in processEvents" :key="segment.event.uID">
            <div class="flex text-sm segment">
              <div class="h-full overflow-hidden pr-8 relative">
                <template v-if="segment.event.mode === 'start'">
                  <div class="absolute rounded-r-md darkest_bg flex items-center justify-center p-1">
                    <RocketLaunchIcon class="w-[16px] h-[16px] text-neutral-300"></RocketLaunchIcon>
                  </div>
                </template>
                <template v-else>
                  <div class="absolute rounded-r-md darkest_bg flex items-center justify-center p-1">
                    <BoltIcon class="w-[16px] h-[16px] text-neutral-300"></BoltIcon>
                  </div>
                </template>
                <div class="absolute flex h-full items-center w-[40px]">
                  <EllipsisVerticalIcon class="text-neutral-200 mt-6 segmentSettings"></EllipsisVerticalIcon>
                </div>
                <div class="pathIndicator"></div>
              </div>
              <div class="medium_bg rounded w-full mr-2">
                <div class="w-full">
                  <template v-if="!segment.event.editingTitle">
                    <template v-if="segment.event.t">
                      <Markdown class="markedView w-full p-2"
                                v-on:click="segment.event.editingTitle = true; editEventTitle(segment.event)"
                                :source="'### ' + segment.event.t"
                                :plugins="plugins"></Markdown>
                    </template>
                    <template v-else>
                      <p class="text-neutral-400 w-full p-2"
                         v-on:click="segment.event.editingTitle = true; editEventTitle(segment.event)">
                        (No Title)
                      </p>
                    </template>
                  </template>
                  <template v-else>
                    <div class="w-full">
                    <textarea type="text" v-model="segment.event.t"
                              :id="segment.event.guid + '_title_edit'"
                              v-on:blur="segment.event.editingTitle = false; updateEvent(segment.event)"
                              rows="1"
                              class="text-lg p-2 mb-2 rounded dark_bg text-neutral-200 w-full"></textarea>
                      <button class="editSubmit">
                        Submit
                      </button>
                    </div>
                  </template>
                </div>
                <template v-if="!segment.event.editingDescription">
                  <template v-if="segment.event.desc">
                    <Markdown class="markedView w-full p-2"
                              :source="segment.event.desc"
                              v-on:click="segment.event.editingDescription = true; editEventDescription(segment.event)"
                              :plugins="plugins"></Markdown>
                  </template>
                  <template v-else>
                    <p class="text-neutral-400 w-full p-2"
                       v-on:click="segment.event.editingDescription = true; editEventDescription(segment.event)">
                      (No Description)
                    </p>
                  </template>
                </template>
                <template v-else>
                  <div class="rounded w-full">
                    <textarea :id="segment.event.guid + '_description_edit'"
                              v-model="segment.event.desc"
                              v-on:blur="segment.event.editingDescription = false; updateEvent(segment.event)"
                              maxlength="3000"
                              rows="10"
                              class="p-2 mb-2 dark_bg text-neutral-200 w-full input"></textarea>
                    <button class="editSubmit">
                      Submit
                    </button>
                  </div>
                </template>
              </div>
            </div>
            <div class="flex">
              <div class="h-full relative">
                <template v-if="segment.alternatives && segment.alternatives.length <= 0">
                  <div class="pathIndicator"></div>
                  <template v-if="!segment.event.hasNext">
                    <div v-on:click="writeProcess(segment.event)"
                         v-tooltip.right="{ content: 'Add' }"
                         class="adder_button">
                      <PlusCircleIcon class="h-6 w-6"></PlusCircleIcon>
                    </div>
                  </template>
                  <template v-else>
                    <div v-on:click="writeProcess(segment.event)"
                         v-tooltip.right="{ content: 'Add' }"
                         class="adder_button ml-8" style="border-radius: 100%; background-color: transparent;">
                      <PlusCircleIcon class="h-6 w-6"></PlusCircleIcon>
                    </div>
                  </template>
                </template>
                <div class="pathIndicator"></div>
              </div>
              <template v-if="segment.alternatives && segment.alternatives.length > 0">
                <div class="w-full h-fit ml-8 my-2 grid grid-cols-1">
                  <template v-for="altEvent in segment.alternatives" :key="altEvent.uID">
                    <div class="flex text-sm w-full segment">
                      <div class="h-full overflow-hidden pr-8 relative">
                        <div class="absolute rounded-r-md darkest_bg flex items-center justify-center p-1">
                          <BoltIcon class="w-[16px] h-[16px] text-neutral-300"></BoltIcon>
                        </div>
                        <div class="absolute flex h-full items-center w-[40px]">
                          <EllipsisVerticalIcon class="text-neutral-200 mt-6 segmentSettings"></EllipsisVerticalIcon>
                        </div>
                        <div class="pathIndicator"></div>
                      </div>
                      <div class="medium_bg rounded w-full mr-2 mb-2">
                        <div class="w-full">
                          <template v-if="!altEvent.editingTitle">
                            <template v-if="altEvent.t">
                              <Markdown class="markedView w-full p-2"
                                        v-on:click="altEvent.editingTitle = true; editEventTitle(altEvent)"
                                        :source="'### ' + altEvent.t"
                                        :plugins="plugins"></Markdown>
                            </template>
                            <template v-else>
                              <p class="text-neutral-400 w-full p-2"
                                 v-on:click="altEvent.editingTitle = true; editEventTitle(altEvent)">
                                (No Title)
                              </p>
                            </template>
                          </template>
                          <template v-else>
                            <textarea type="text" v-model="altEvent.t"
                                      :id="altEvent.guid + '_title_edit'"
                                      v-on:blur="altEvent.editingTitle = false; updateEvent(altEvent)"
                                      rows="1"
                                      class="text-lg p-2 mb-2 rounded dark_bg text-neutral-200 w-full"></textarea>
                            <button
                              class="editSubmit">
                              Submit
                            </button>
                          </template>
                        </div>
                        <template v-if="!altEvent.editingDescription">
                          <template v-if="altEvent.desc">
                            <Markdown class="markedView w-full p-2"
                                      :source="altEvent.desc"
                                      v-on:click="altEvent.editingDescription = true; editEventDescription(altEvent)"
                                      :plugins="plugins"></Markdown>
                          </template>
                          <template v-else>
                            <p class="text-neutral-400 w-full p-2"
                               v-on:click="altEvent.editingDescription = true; editEventDescription(altEvent)">
                              (No Description)
                            </p>
                          </template>
                        </template>
                        <template v-else>
                          <div class="rounded w-full">
                            <textarea :id="altEvent.guid + '_description_edit'"
                                      v-model="altEvent.desc"
                                      v-on:blur="altEvent.editingDescription = false; updateEvent(altEvent)"
                                      maxlength="3000"
                                      rows="10"
                                      class="p-2 mb-2 dark_bg text-neutral-200 w-full input"></textarea>
                            <button
                              class="editSubmit">
                              Submit
                            </button>
                          </div>
                        </template>
                      </div>
                    </div>
                  </template>
                  <div class="h-full relative">
                    <div v-on:click="writeProcess(segment.event)"
                         v-tooltip.right="{ content: 'Add' }"
                         class="adder_button">
                      <PlusCircleIcon class="h-6 w-6"></PlusCircleIcon>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </template>
    <modal @close="isWritingProcess = false"
           v-show="isWritingProcess">
      <template v-slot:header>
        Attach Process to "{{ writingSource.t }}"
      </template>
      <template v-slot:body>
        <div class="flex w-full md:w-[540px]" style="max-height: 90vh">
          <div class="w-full">
            <label for="processTitle" class="text-xl font-bold">Title:</label>
            <br>
            <input type="text" id="processTitle" ref="processTitle" v-model="processTitle"
                   class="medium_bg rounded-md w-full py-2 px-3 text-neutral-200">
            <br>
            <label for="processKeywords" class="text-xl mt-2 font-bold">Keywords:</label>
            <br>
            <input type="text" id="processKeywords" v-model="processKeywords"
                   class="medium_bg rounded-md py-2 px-3 w-full text-neutral-200">
            <br>
            <label for="processDescription" class="text-xl mt-2 font-bold">Description:</label>
            <br>
            <div class="rounded-md w-full overflow-hidden">
              <textarea type="text" id="processDescription" v-model="processDescription"
                        rows="2" class="w-full medium_bg py-2 px-3 text-neutral-200"></textarea>
            </div>
            <div class="flex mt-2 mb-4 w-full">
              <div class="mb-3 ml-auto text-black font-bold">
                <button v-on:click="createProcess()"
                        class="mr-2 py-2 px-5 border-2 border-gray-300 rounded-lg bg-gray-200 hover:bg-gray-400">
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
      </template>
    </modal>
  </div>
</template>

<script>
import modal from '../../components/Modal.vue'
import Markdown from 'vue3-markdown-it'
import markdownItMermaid from 'markdown-it-mermaid'
import 'highlight.js/styles/hybrid.css'
import mermaid from 'mermaid'
import { DocumentArrowDownIcon, EllipsisVerticalIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { BoltIcon, PlusCircleIcon, RocketLaunchIcon } from '@heroicons/vue/24/solid'

export default {
  name: 'ProcessView',
  props: {
    isoverlay: Boolean,
    srcguid: String,
    chatguid: String
  },
  emits: ['close'],
  components: {
    modal,
    Markdown,
    XMarkIcon,
    PlusCircleIcon,
    BoltIcon,
    RocketLaunchIcon,
    DocumentArrowDownIcon,
    EllipsisVerticalIcon
  },
  data () {
    return {
      knowledge: {},
      processEvents: [],
      // Process Creation
      processTitle: '',
      processDescription: '',
      processKeywords: '',
      isWritingProcess: false,
      isEditingProcess: false,
      writingSource: {
        guid: ''
      },
      plugins: [
        {
          plugin: markdownItMermaid
        }
      ]
    }
  },
  mounted () {
    this.initFunction()
  },
  methods: {
    initFunction: async function () {
      // Set window padding
      const mainDiv = this.$refs.processViewer
      if (mainDiv) {
        if (!this.isoverlay) {
          mainDiv.classList.add('pt-[60px]')
        } else {
          mainDiv.classList.remove('pt-[60px]')
        }
      }
      // Whose knowledge are we trying to see? Return if there is no source
      // Get URL parameters
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop)
      })
      let srcGUID = this.chatguid
      let from = 'clarifier'
      if (this.chatguid == null) {
        srcGUID = params.kguid
        if (!srcGUID) return
        from = 'guid'
      }
      const knowledge = await this.getKnowledge(srcGUID, from)
      if (knowledge != null) {
        this.knowledge = knowledge
      }
      this.renderMermaidInit()
      await this.getProcessInformation()
    },
    getKnowledge: async function (guid, from = 'clarifier') {
      if (!guid || !from) return
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'm7/get?src=' + guid + '&from=' + from
        }).then((data) => {
          this.knowledge = data.result
          if (this.knowledge.categories != null) {
            for (let i = 0; i < this.knowledge.categories.length; i++) {
              this.knowledge.categories[i] = JSON.parse(this.knowledge.categories[i])
              this.knowledge.categories[i].count = 0
            }
          }
          resolve()
        })
          .catch((err) => {
            if (err.message) this.knowledgeExists = false
          })
      })
    },
    getProcessInformation: async function (srcguidOverride = '') {
      return new Promise((resolve) => {
        let guid
        if (srcguidOverride === '') {
          if (!this.isoverlay) {
            guid = this.$route.params.id
          } else {
            guid = this.srcguid
          }
        } else {
          guid = srcguidOverride
        }
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'm9/path/' + this.knowledge.guid + '?entry=' + guid
        })
          .then((data) => {
            if (srcguidOverride === '') {
              if (data.result.path) this.processEvents = data.result.path
              this.renderMermaid()
              for (let i = 0; i < this.processEvents.length; i++) {
                this.processEvents[i].event.hasNext = (i + 1 < this.processEvents.length)
              }
            }
            resolve(data.result)
          })
          .catch((err) => {
            console.debug(err.message)
          })
      })
    },
    renderMermaidInit: function () {
      setTimeout(() => {
        mermaid.initialize({
          startOnLoad: true,
          theme: 'dark'
        })
        setTimeout(() => {
          mermaid.init()
        }, 0)
      }, 0)
    },
    renderMermaid: function () {
      setTimeout(() => {
        mermaid.init()
      }, 0)
    },
    editProcess: function (sourceEvent) {
      if (sourceEvent == null) return
      const srcGUID = sourceEvent.guid
      if (!srcGUID || srcGUID === '') return
      this.isWritingProcess = true
      this.isEditingProcess = true
      this.writingSource = sourceEvent
      setTimeout(() => {
        this.$refs.processTitle.focus()
      }, 0)
    },
    clickedBack: function () {
      if (!this.isoverlay) {
        this.$router.back()
      } else {
        this.$emit('close')
      }
    },
    writeProcess: function (sourceEvent) {
      const srcGUID = sourceEvent.guid
      if (!srcGUID || srcGUID === '') return
      this.writingSource = sourceEvent
      this.createProcess(true)
    },
    createProcess: async function (empty = false) {
      if (!empty) {
        if (this.processTitle.trim() === '' &&
          this.processDescription.trim() === '' &&
          this.processKeywords.trim() === '') {
          return
        }
      }
      return new Promise((resolve) => {
        let payload
        if (!empty) {
          payload = {
            title: this.processTitle.trim(),
            description: this.processDescription.trim(),
            keywords: this.processKeywords.trim(),
            knowledgeGUID: this.knowledge.guid,
            previousEventGUID: this.writingSource.guid
          }
        } else {
          payload = {
            title: '',
            description: '',
            keywords: '',
            knowledgeGUID: this.knowledge.guid,
            previousEventGUID: this.writingSource.guid
          }
        }
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'm9/create',
          body: JSON.stringify(payload)
        }).then((data) => {
          console.log(data.result)
          this.isWritingProcess = false
          this.processTitle = ''
          this.processDescription = ''
          this.processKeywords = ''
        })
          .then(() => (this.getProcessInformation()))
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
      })
    },
    editEventTitle: function (event) {
      setTimeout(() => {
        const elem = document.getElementById(event.guid + '_title_edit')
        if (elem) {
          elem.focus()
        }
      }, 0)
    },
    editEventDescription: function (event) {
      setTimeout(() => {
        const elem = document.getElementById(event.guid + '_description_edit')
        if (elem) {
          elem.focus()
        }
      }, 0)
    },
    updateEvent: function (event) {
      return new Promise((resolve) => {
        const payload = {
          title: event.t.trim(),
          description: event.desc.trim(),
          keywords: event.keywords.trim(),
          knowledgeGUID: this.knowledge.guid
        }
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'm9/create?mode=edit&guid=' + event.guid,
          body: JSON.stringify(payload)
        })
          .then(() => (this.getProcessInformation()))
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
      })
    }
  }
}
</script>

<style>

.sidebar_button:hover {
  @apply brightest_bg;
}

.adder_button {
  @apply cursor-pointer hover:text-neutral-100 p-1 text-neutral-300
  sidebar_button darkest_bg w-fit h-fit rounded-r-md;
}

.pathIndicator {
  @apply w-[2px] h-full border-2 border-neutral-900 absolute left-0;
}

.modeIndicator {
  @apply text-xs text-neutral-300 font-bold darkest_bg p-1 w-fit rounded-r-md;
}

.editSubmit {
  @apply relative right-0 p-2 m-2 rounded bright_bg font-bold text-sm text-neutral-300;
}

.editSubmit:hover {
  @apply brightest_bg text-neutral-200;
}

.segmentSettings {
  @apply opacity-0;
}

.segment:hover .segmentSettings {
  @apply opacity-100;
}

</style>
