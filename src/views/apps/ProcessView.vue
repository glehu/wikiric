<template>
  <div id="processViewer" ref="processViewer"
       class="medium_bg w-full h-full absolute overflow-hidden rounded-tr-lg">
    <div class="text-neutral-300 w-full min-h-[50px] max-h-[50px] px-2 flex items-center medium_bg
                divide-x-2 divide-neutral-600">
      <div class="sidebar_button bright_bg rounded-xl w-fit mr-2">
        <div v-on:click="clickedBack()"
             v-tooltip="{ content: 'Exit' }"
             class="cursor-pointer hover:text-neutral-200 p-2">
          <XMarkIcon class="h-6 w-6"></XMarkIcon>
        </div>
      </div>
      <div class="flex items-center pl-2">
        <div class="sidebar_button bright_bg rounded-xl w-fit mr-2">
          <div v-on:click="generateDocumentation()"
               v-tooltip="{ content: 'Generate Documentation' }"
               class="cursor-pointer hover:text-neutral-200 p-2">
            <DocumentArrowDownIcon class="h-6 w-6"></DocumentArrowDownIcon>
          </div>
        </div>
        <div class="sidebar_button bright_bg rounded-xl w-fit mr-2">
          <div v-on:click="createTasks()"
               v-tooltip="{ content: 'Tasks' }"
               class="cursor-pointer hover:text-neutral-200 p-2">
            <ViewColumnsIcon class="h-6 w-6"></ViewColumnsIcon>
          </div>
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
              <div class="h-full pr-8 relative">
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
                <div class="absolute flex h-full items-center">
                  <Menu as="div" class="absolute inline-block text-left">
                    <MenuButton
                      title="Options"
                      class="hover:darkest_bg p-1 bg-opacity-50 text-neutral-200 rounded-full
                             flex items-center cursor-pointer">
                      <EllipsisVerticalIcon class="h-7 w-7 segmentSettings"></EllipsisVerticalIcon>
                    </MenuButton>
                    <transition
                      enter-active-class="transition duration-100 ease-out"
                      enter-from-class="transform scale-95 opacity-0"
                      enter-to-class="transform scale-100 opacity-100"
                      leave-active-class="transition duration-75 ease-in"
                      leave-from-class="transform scale-100 opacity-100"
                      leave-to-class="transform scale-95 opacity-0"
                    >
                      <MenuItems
                        class="p_card_menu_list dark_bg"
                      >
                        <div class="px-1 py-1">
                          <MenuItem v-slot="{ active }">
                            <button v-on:click="deleteEvent(segment.event)"
                                    class="flex text-neutral-300 p-2"
                                    :class="
                                      [active ? 'medium_bg' : '']
                                    ">
                              <TrashIcon
                                :active="active"
                                class="mr-2 h-5 w-5"
                                aria-hidden="true"
                              />
                              <span class="font-bold">Delete</span>
                            </button>
                          </MenuItem>
                        </div>
                      </MenuItems>
                    </transition>
                  </Menu>
                </div>
                <div class="pathIndicator"></div>
              </div>
              <div class="medium_bg rounded w-full mr-2">
                <div class="w-full">
                  <template v-if="segment.task">
                    <template v-if="segment.task.finished">
                      <div class="px-1 py-1 rounded bg-green-800 flex w-16 mr-2 items-center">
                        <CheckIcon class="h-4 w-4 mr-1 text-neutral-300"></CheckIcon>
                        <span class="text-xs font-bold text-neutral-300">Done</span>
                      </div>
                    </template>
                    <template v-else>
                      <div class="px-1 py-1 rounded bg-red-800 flex w-16 mr-2 items-center">
                        <Cog6ToothIcon class="h-4 w-4 mr-1 text-neutral-300"></Cog6ToothIcon>
                        <span class="text-xs font-bold text-neutral-300">W.I.P.</span>
                      </div>
                    </template>
                  </template>
                  <template v-if="!segment.event.editingTitle">
                    <template v-if="segment.event.t">
                      <Markdown class="markedView w-full p-2"
                                v-on:click="editEventTitle(segment.event)"
                                :source="'### ' + segment.event.t"
                                :plugins="plugins"></Markdown>
                    </template>
                    <template v-else>
                      <p class="text-neutral-400 w-full p-2"
                         v-on:click="editEventTitle(segment.event)">
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
                              v-on:click="editEventDescription(segment.event)"
                              :plugins="plugins"></Markdown>
                  </template>
                  <template v-else>
                    <p class="text-neutral-400 w-full p-2"
                       v-on:click="editEventDescription(segment.event)">
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
                  <div v-on:click="writeProcess(segment.event, !segment.event.hasNext)"
                       v-tooltip.right="{ content: 'Add' }"
                       class="adder_button ml-8" style="border-radius: 100%; background-color: transparent;">
                    <PlusCircleIcon class="h-6 w-6"></PlusCircleIcon>
                  </div>
                  <template v-if="!segment.event.hasNext">
                    <div v-on:click="writeProcess(segment.event)"
                         v-tooltip.right="{ content: 'Add' }"
                         class="adder_button">
                      <PlusCircleIcon class="h-6 w-6"></PlusCircleIcon>
                    </div>
                  </template>
                </template>
                <div class="pathIndicator"></div>
              </div>
              <template v-if="segment.alternatives && segment.alternatives.length > 0">
                <div class="w-full h-fit ml-8 my-2 grid grid-cols-1"
                     :id="'box_events_guid_' + segment.event.guid"
                     :ref="'box_events_guid_' + segment.event.guid">
                  <draggable
                    :list="segment.alternatives"
                    :group="segment.event.guid"
                    :id="segment.event.guid"
                    v-bind="dragOptions"
                    @start="drag=true"
                    @end="endDrag"
                    @change="handleDragChange"
                    @move="handleDragMove"
                    ghostClass="ghost"
                    tag="transition-group"
                    fallbackTolerance="5"
                    forceFallback="true"
                    fallbackClass="chosen"
                    :component-data="{
                        tag: 'div',
                        type: 'transition-group',
                        name: !drag ? 'flip-list' : null
                      }"
                    item-key="order">
                    <template #item="{element}">
                      <div class="flex text-sm w-full segment relative" :key="element.event.guid">
                        <div class="h-full pr-8">
                          <div class="relative rounded-r-md darkest_bg flex items-center justify-center p-1">
                            <BoltIcon class="w-[16px] h-[16px] text-neutral-300"></BoltIcon>
                          </div>
                          <div class="relative flex h-full items-center">
                            <Menu as="div" class="absolute inline-block text-left mt-8">
                              <MenuButton
                                title="Options"
                                class="hover:darkest_bg p-1 bg-opacity-50 text-neutral-200 rounded-full
                                       flex items-center cursor-pointer">
                                <EllipsisVerticalIcon class="h-7 w-7 segmentSettings"></EllipsisVerticalIcon>
                              </MenuButton>
                              <transition
                                enter-active-class="transition duration-100 ease-out"
                                enter-from-class="transform scale-95 opacity-0"
                                enter-to-class="transform scale-100 opacity-100"
                                leave-active-class="transition duration-75 ease-in"
                                leave-from-class="transform scale-100 opacity-100"
                                leave-to-class="transform scale-95 opacity-0"
                              >
                                <MenuItems
                                  class="p_card_menu_list dark_bg"
                                >
                                  <div class="px-1 py-1">
                                    <MenuItem v-slot="{ active }">
                                      <button v-on:click="deleteEvent(element.event)"
                                              class="flex text-neutral-300 p-2"
                                              :class="
                                      [active ? 'medium_bg' : '']
                                    ">
                                        <TrashIcon
                                          :active="active"
                                          class="mr-2 h-5 w-5"
                                          aria-hidden="true"
                                        />
                                        <span class="font-bold">Delete</span>
                                      </button>
                                    </MenuItem>
                                  </div>
                                </MenuItems>
                              </transition>
                            </Menu>
                          </div>
                          <div class="pathIndicator"></div>
                        </div>
                        <div class="medium_bg rounded w-full mr-2 mb-2 overflow-hidden">
                          <div class="w-full">
                            <template v-if="element.task">
                              <template v-if="element.task.finished">
                                <div class="px-1 py-1 rounded bg-green-800 flex w-16 mr-2 items-center">
                                  <CheckIcon class="h-4 w-4 mr-1 text-neutral-300"></CheckIcon>
                                  <span class="text-xs font-bold text-neutral-300">Done</span>
                                </div>
                              </template>
                              <template v-else>
                                <div class="px-1 py-1 rounded bg-red-800 flex w-16 mr-2 items-center">
                                  <Cog6ToothIcon class="h-4 w-4 mr-1 text-neutral-300"></Cog6ToothIcon>
                                  <span class="text-xs font-bold text-neutral-300">W.I.P.</span>
                                </div>
                              </template>
                            </template>
                            <template v-if="!element.event.editingTitle">
                              <template v-if="element.event.t">
                                <Markdown class="markedView w-full p-2 break-words"
                                          v-on:click="editEventTitle(element.event)"
                                          :source="'### ' + element.event.t"
                                          :plugins="plugins"></Markdown>
                              </template>
                              <template v-else>
                                <p class="text-neutral-400 w-full p-2"
                                   v-on:click="editEventTitle(element.event)">
                                  (No Title)
                                </p>
                              </template>
                            </template>
                            <template v-else>
                            <textarea type="text" v-model="element.event.t"
                                      :id="element.event.guid + '_title_edit'"
                                      v-on:blur="element.event.editingTitle = false; updateEvent(element.event)"
                                      rows="1"
                                      class="text-lg p-2 mb-2 rounded dark_bg text-neutral-200 w-full"></textarea>
                              <button
                                class="editSubmit">
                                Submit
                              </button>
                            </template>
                          </div>
                          <template v-if="!element.event.editingDescription">
                            <template v-if="element.event.desc">
                              <Markdown class="markedView w-full p-2 break-words"
                                        :source="element.event.desc"
                                        v-on:click="editEventDescription(element.event)"
                                        :plugins="plugins"></Markdown>
                            </template>
                            <template v-else>
                              <p class="text-neutral-400 w-full p-2"
                                 v-on:click="editEventDescription(element.event)">
                                (No Description)
                              </p>
                            </template>
                          </template>
                          <template v-else>
                            <div class="rounded w-full">
                            <textarea :id="element.event.guid + '_description_edit'"
                                      v-model="element.event.desc"
                                      v-on:blur="element.event.editingDescription = false; updateEvent(element.event)"
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
                  </draggable>
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
        <div class="flex w-full md:w-[540px]">
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
    <modal @close="isViewingDocumentation = false"
           v-show="isViewingDocumentation">
      <template v-slot:header>
        <p>Documentation</p>
      </template>
      <template v-slot:body>
        <div class="w-[90vw] md:w-[70vw] max-w-[1000px] rounded overflow-hidden flex justify-center">
          <div class="lg:flex max-w-full overflow-x-hidden overflow-y-auto break-all">
            <div class="md:rounded-l dark_bg p-1 min-w-[124px]">
              <button class="flex items-center justify-center text-neutral-300 p-1 rounded-md hover:medium_bg w-full"
                      v-on:click="publishLesson()">
                <PlusCircleIcon class="h-6 w-6 mr-2"></PlusCircleIcon>
                <template v-if="!docExists">
                  <span>Publish</span>
                </template>
                <template v-else>
                  <span>Replace</span>
                </template>
              </button>
            </div>
            <Markdown class="markedView w-fit p-4 medium_bg md:rounded-r max-w-full break-words"
                      :source="documentation"
                      :plugins="plugins"></Markdown>
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
import draggable from 'vuedraggable'
import { DocumentArrowDownIcon, EllipsisVerticalIcon, ViewColumnsIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import {
  BoltIcon,
  CheckIcon,
  Cog6ToothIcon,
  PlusCircleIcon,
  RocketLaunchIcon,
  TrashIcon
} from '@heroicons/vue/24/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

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
    EllipsisVerticalIcon,
    TrashIcon,
    ViewColumnsIcon,
    Cog6ToothIcon,
    CheckIcon,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    draggable
  },
  data () {
    return {
      drag: false,
      lastDragMove: undefined,
      knowledge: {},
      processEvents: [],
      // Process Creation
      processTitle: '',
      processDescription: '',
      processKeywords: '',
      isWritingProcess: false,
      isEditingProcess: false,
      isViewingDocumentation: false,
      documentation: '',
      docExists: false,
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
  computed: {
    dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
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
              if (this.processEvents.length > 0) {
                this.docExists = this.processEvents[0].event.wisdomUID !== -1
              }
              this.renderMermaid()
              for (let i = 0; i < this.processEvents.length; i++) {
                this.processEvents[i].event.hasNext = ((i + 1) < this.processEvents.length)
              }
            }
            resolve(data.result)
          })
          .catch((err) => {
            console.debug(err.message)
            this.processEvents = []
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
    writeProcess: function (sourceEvent, addExtra = false) {
      const srcGUID = sourceEvent.guid
      if (!srcGUID || srcGUID === '') return
      this.writingSource = sourceEvent
      this.createProcess(true)
      if (addExtra) this.createProcess(true)
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
      if (this.drag) return
      event.editingTitle = true
      setTimeout(() => {
        const elem = document.getElementById(event.guid + '_title_edit')
        if (elem) {
          elem.focus()
        }
      }, 0)
    },
    editEventDescription: function (event) {
      if (this.drag) return
      event.editingDescription = true
      setTimeout(() => {
        const elem = document.getElementById(event.guid + '_description_edit')
        if (elem) {
          elem.focus()
        }
      }, 0)
    },
    updateEvent: function (pEvent) {
      return new Promise((resolve) => {
        let eventWisdomGUID = ''
        if (pEvent.wisdomGUID) eventWisdomGUID = pEvent.wisdomGUID
        const payload = {
          title: pEvent.t.trim(),
          description: pEvent.desc.trim(),
          keywords: pEvent.keywords.trim(),
          knowledgeGUID: this.knowledge.guid,
          wisdomGUID: eventWisdomGUID
        }
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'm9/create?mode=edit&guid=' + pEvent.guid,
          body: JSON.stringify(payload)
        })
          .then(() => (this.getProcessInformation()))
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
      })
    },
    deleteEvent: function (event) {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'm9/delete/' + event.guid
        })
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
          .finally(() => {
            this.getProcessInformation()
          })
      })
    },
    generateDocumentation: function () {
      if (this.processEvents.length < 1) return
      return new Promise((resolve) => {
        const payload = {
          action: 'generate_documentation'
        }
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'm9/interact/' + this.processEvents[0].event.guid,
          body: JSON.stringify(payload)
        })
          .then((data) => {
            this.isViewingDocumentation = true
            this.documentation = data.result
          })
          .then(() => this.renderMermaid())
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
      })
    },
    createTasks: function () {
      if (this.processEvents.length < 1) return
      return new Promise((resolve) => {
        const payload = {
          action: 'create_tasks'
        }
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'm9/interact/' + this.processEvents[0].event.guid,
          body: JSON.stringify(payload)
        })
          .then((data) => {
            this.$router.push('/apps/knowledge/' + data.result + '?src=' + this.knowledge.guid)
          })
          .then(() => this.renderMermaid())
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
      })
    },
    publishLesson: function () {
      const mTitle = this.documentation.split('\n', 1)[0]
      const mBody = this.documentation.split(mTitle)[1]
      const payload = {
        title: mTitle,
        description: mBody,
        knowledgeGUID: this.knowledge.guid,
        keywords: 'documentations,docs,process,' + mTitle.replaceAll('#', '').trim(),
        copyContent: '',
        categories: []
      }
      // Create entry on the backend
      const bodyPayload = JSON.stringify(payload)
      let wisdomGUID = ''
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'm7/teach',
          body: bodyPayload
        })
          .then((data) => {
            this.setWisdomGUIDForEvent(data.result)
            wisdomGUID = data.result
          })
          .then(() => {
            this.$router.push('/apps/knowledge/' + wisdomGUID + '?src=' + this.knowledge.guid)
          })
          .then(() => resolve)
          .catch((err) => {
            console.debug(err.message)
            this.noResults = true
          })
      })
    },
    setWisdomGUIDForEvent: async function (guid) {
      if (!guid || guid === '') return
      const pEvent = this.processEvents[0].event
      pEvent.wisdomGUID = guid
      await this.updateEvent(pEvent)
    },
    handleDragChange: function (e) {
      const prefix = 'box_events_guid_'
      if (e.added) {
        // Moved to another box!
        console.log(e.added.element.event.guid, 'MOVED to index', e.added.newIndex,
          'for new box', this.lastDragMove.to.parentElement.id.substring(prefix.length))
        // Set new rowIndex and boxGUID for this task!
        this.moveTask(e.added.element.event.guid, e.added.newIndex,
          this.lastDragMove.to.parentElement.id.substring(prefix.length))
      } else if (e.moved) {
        // Moved inside current box.
        console.log(e.moved.element.event.guid, 'MOVED to index', e.moved.newIndex)
        // Set new rowIndex for this task!
        this.moveTask(e.moved.element.event.guid, e.moved.newIndex,
          this.lastDragMove.to.parentElement.id.substring(prefix.length))
      }
    },
    moveTask: function (taskGUID, newRowIndex, boxGUID) {
      for (const i in this.processEvents) {
        if (this.processEvents[i].event.guid === boxGUID) {
          if (this.processEvents[i].alternatives && this.processEvents[i].alternatives.length > 1) {
            if (newRowIndex > 0) {
              // rowIndex != 0 so compare the tasks before and after
              const rowIndexTaskBefore = this.processEvents[i].alternatives[newRowIndex - 1].event.rowIndex
              if (this.processEvents[i].alternatives.length - 1 > newRowIndex) {
                const rowIndexTaskAfter = this.processEvents[i].alternatives[newRowIndex + 1].event.rowIndex
                newRowIndex = Math.floor((rowIndexTaskBefore + rowIndexTaskAfter) / 2)
              } else {
                newRowIndex = rowIndexTaskBefore + 20000
              }
            } else {
              // rowIndex = 0 so just look at the second task if it exists
              newRowIndex = Math.floor(this.processEvents[i].alternatives[1].event.rowIndex / 2)
            }
          } else {
            // First task => Set it to 0
            newRowIndex = 20000
          }
        }
      }
      console.log('New Row Index:', newRowIndex)
      const payload = {
        knowledgeGUID: this.knowledge.guid,
        rowIndex: newRowIndex,
        previousEventGUID: boxGUID
      }
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'm9/create?mode=row&guid=' + taskGUID,
          body: JSON.stringify(payload)
        })
          .then(() => (this.getProcessInformation()))
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
      })
    },
    handleDragMove: function (e) {
      this.lastDragMove = e
    },
    endDrag: function () {
      setTimeout(() => (this.drag = false), 100)
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

.segmentSettings:focus,
.segmentSettings:hover,
.segment:hover .segmentSettings {
  @apply opacity-100;
}

.p_card_menu_list {
  @apply absolute mt-2 origin-top-right divide-y divide-zinc-400 rounded-md
  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10;
}

.ghost {
  @apply m-2 brightest_bg border-2 border-zinc-200 rounded;
}

.ghost * {
  @apply opacity-0;
}

.chosen {
  @apply opacity-100 -rotate-3;
}

.chosen .pathIndicator {
  @apply opacity-0;
}

</style>
