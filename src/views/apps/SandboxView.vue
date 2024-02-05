<template>
  <div class="mt_nav h_full_nav w-full flex flex-row">
    <div ref="sidebar"
         class="h-full flex flex-col gap-1 surface-variant
                w-full max-w-[162px] fmt_border_right overflow-y-auto">
      <div class="w-full surface p-2">
        <p class="font-bold">
          <template v-if="sandboxID === ''">
            Sandbox
          </template>
          <template v-else>
            {{ currentSandbox }}
          </template>
        </p>
      </div>
      <div v-if="currentSandbox !== ''"
           class="w-full surface p-2 grid grid-cols-1 gap-1">
        <p class="text-xs font-bold headerline">
          Components
        </p>
        <div class="fmt_button w-full py-2"
             v-on:click="addBox('text')">
          <p class="font-bold w-full text-sm px-2">Text</p>
        </div>
        <p class="text-xs font-bold headerline mt-1">
          Apps
        </p>
        <div class="fmt_button w-full py-2"
             v-on:click="addBox('feed')">
          <p class="font-bold w-full text-sm px-2">Feed</p>
        </div>
        <div class="fmt_button w-full py-2"
             v-on:click="addBox('knowledge')">
          <p class="font-bold w-full text-sm px-2">Knowledge</p>
        </div>
        <div v-if="canUseChat"
             class="fmt_button w-full py-2"
             v-on:click="addBox('chat')">
          <p class="font-bold w-full text-sm px-2">Chat</p>
        </div>
        <div class="fmt_button w-full py-2"
             v-on:click="addBox('planner')">
          <p class="font-bold w-full text-sm px-2">Planner</p>
        </div>
        <div class="fmt_button w-full py-2"
             v-on:click="addBox('mock')">
          <p class="font-bold w-full text-sm px-2">API Mock</p>
        </div>
      </div>
      <div class="w-full surface p-2">
        <div class="btn_bg_primary"
             v-on:click="createSandbox()">
          <p class="p-2 text-xs font-bold text-center">
            Create Sandbox
          </p>
        </div>
      </div>
      <div class="w-full surface p-2 flex flex-col-reverse gap-2">
        <template v-if="!noSandboxes">
          <template v-if="sandboxes.length > 0">
            <template v-for="sandbox in sandboxes" :key="sandbox.uid">
              <div v-if="sandbox.uid"
                   class="cursor-pointer fmt_border w-full p-1 rounded
                          hover:primary font-bold"
                   v-on:click="viewSandbox(sandbox)"
                   :class="{'tertiary': sandbox.t === currentSandbox}">
                <p class="w-full text-sm px-2">
                  {{ sandbox.t }}
                </p>
              </div>
            </template>
            <p class="text-xs font-bold">
              Sandboxes
            </p>
          </template>
        </template>
        <template v-else>
          <p class="text-xs font-bold">
            No Sandboxes!
          </p>
        </template>
      </div>
    </div>
    <div ref="content_container"
         class="w-full h-full overflow-auto relative">
      <div ref="sandbox"
           class="relative">
        <canvas ref="sandbox_canvas" class="pointer-events-none absolute"></canvas>
        <canvas ref="sandbox_canvas_tmp" class="absolute cursor-crosshair"></canvas>
      </div>
      <div ref="content" class="absolute w-[3000px] h-[3000px]">
        <template v-if="elements.size > 0">
          <template v-for="[key, elem] in elements" :key="elem.uuid">
            <div :id="key + '_div'"
                 class="absolute hover_field"
                 :style="{top: elem.y + 'px', left: elem.x + 'px'}">
              <div class="w-full items-center justify-end absolute
                          hover_show_o flex gap-2 z-50 bottom-1 right-1">
                <div v-show="!elem.hide"
                     class="surface w-6 h-6 flex items-center
                            justify-center rounded-full fmt_button
                            cursor-pointer prevent-select"
                     v-on:click="toggleElement(elem)"
                     style="font-family: Arial, sans-serif; text-shadow: none">
                  <i class="bi bi-dash"></i>
                </div>
                <div v-show="elem.hide"
                     class="surface w-6 h-6 flex items-center
                            justify-center rounded-full fmt_button
                            cursor-pointer prevent-select"
                     v-on:click="toggleElement(elem)"
                     style="font-family: Arial, sans-serif; text-shadow: none">
                  <i class="bi bi-plus"></i>
                </div>
                <div class="surface w-6 h-6 flex items-center
                            justify-center rounded-full fmt_button
                            cursor-pointer prevent-select"
                     v-on:click="deleteElement(elem)"
                     style="font-family: Arial, sans-serif; text-shadow: none">
                  <i class="bi bi-trash-fill"></i>
                </div>
                <div :id="key + '_anchor'"
                     class="surface w-6 h-6 flex items-center
                            justify-center rounded-full fmt_button
                            cursor-move prevent-select"
                     style="font-family: Arial, sans-serif; text-shadow: none">
                  <i class="bi bi-arrows-move"></i>
                </div>
                <div v-show="!elem.hide"
                     :id="key + '_anchor_size'"
                     class="surface w-6 h-6 flex items-center
                            justify-center rounded-full fmt_button
                            cursor-nwse-resize prevent-select"
                     style="font-family: Arial, sans-serif; text-shadow: none">
                  <p class="font-bold text-lg -translate-y-[1px]">⤡</p>
                </div>
              </div>
              <div :id="elem.uuid + '_transition'"
                   class="w-full h-full surface fmt_border rounded
                          p-0.5 flex flex-col overflow-hidden relative"
                   :style="{height: getDimension(elem.h, elem, 65) + 'px',
                            width: getDimension(elem.w, elem, elem.w) + 'px',
                            maxHeight: getDimension(elem.h, elem, 65) + 'px',
                            maxWidth: getDimension(elem.w, elem, elem.w) + 'px'}">
                <div v-if="elem._drag"
                     class="w-full h-full flex items-center justify-center absolute
                            backdrop-blur-sm z-40 fmt_border">
                  <p class="px-3 py-2 rounded-lg surface text-sm font-bold">
                    Drag
                  </p>
                </div>
                <template v-if="elem.type === 'text'">
                  <div v-if="!elem._edit" class="relative flex flex-col w-full h-full">
                    <Markdown :source="elem.t"
                              class="fmt_input w-full markedView min-h-8"
                              :plugins="plugins"></Markdown>
                    <Markdown :source="elem.desc"
                              class="fmt_input w-full flex-grow markedView"
                              :plugins="plugins"></Markdown>
                    <div class="absolute top-1 right-1 hover_show_o
                              cursor-pointer px-1 py-0.5 fmt_button"
                         v-on:click="editElementDescription(elem)">
                      <div class="text-sm font-bold">Edit</div>
                    </div>
                  </div>
                  <template v-else>
                    <input type="text" class="fmt_input w-full font-bold" v-model="elem.t">
                    <textarea :id="key + '_input'"
                              v-model="elem.desc"
                              class="fmt_input w-full flex-grow"></textarea>
                    <button class="btn_small_icon"
                            v-on:click="addMedia(elem)">
                      <DocumentArrowUpIcon
                        class="h-6 w-6 mr-1"
                        aria-hidden="true"
                      />
                      <span>Add File</span>
                    </button>
                  </template>
                  <div v-if="elem._edit"
                       class="cursor-pointer ml-auto fmt_button mt-1 mb-8 mr-1"
                       v-on:click="updateElement(elem)">
                    <div class="text-sm font-bold">Save</div>
                  </div>
                </template>
                <template v-else-if="elem.type === 'mock'">
                  <mockingviewer/>
                </template>
                <template v-else>
                  <div class="absolute z-40 w-full background flex flex-row items-center justify-between">
                    <p class="mr-1 px-2 font-bold">
                      {{ capitalizeFirstLetter(elem.type) }}
                    </p>
                    <Menu as="div"
                          v-show="!elem.hide"
                          class="inline-block text-left w-fit pr-1 z-40">
                      <MenuButton
                        title="Options"
                        class="items-center cursor-pointer group p_card_menu_item hover:primary z-40">
                        <ShareIcon
                          class="mr-2 h-6 w-6"
                          aria-hidden="true"
                        />
                        <template class="hidden sm:block pr-1">
                          Select Group
                        </template>
                      </MenuButton>
                      <transition
                        enter-active-class="transition duration-100 ease-out"
                        enter-from-class="transform scale-95 opacity-0"
                        enter-to-class="transform scale-100 opacity-100"
                        leave-active-class="transition duration-75 ease-in"
                        leave-from-class="transform scale-100 opacity-100"
                        leave-to-class="transform scale-95 opacity-0"
                      >
                        <MenuItems class="p_card_menu_list_medium_p surface fmt_border w-fit">
                          <div class="px-1 py-1">
                            <div class="pointer-events-none">
                              <div class="group p_card_menu_item font-bold">
                                <ChatBubbleLeftRightIcon
                                  class="mr-2 h-6 w-6"
                                  aria-hidden="true"
                                />
                                Clarifier
                              </div>
                            </div>
                          </div>
                          <div class="px-1 py-1">
                            <template v-for="group in $store.state.clarifierSessions" :key="group">
                              <MenuItem v-slot="{ active }" class="mb-1">
                                <button v-on:click="showShareTask(group, elem)"
                                        :class="[active
                                  ? 'p_card_menu_active'
                                  : 'p_card_menu_item','group p_card_menu_item']">
                                  <img class="surface mr-2"
                                       style="width: 32px; height: 32px; border-radius: 10px"
                                       v-bind:src="getImg(group.img,true)"
                                       :alt="'&nbsp;&nbsp;' + group.title.substring(0,1)"/>
                                  <div class="text-md">
                                    {{ group.title }}
                                  </div>
                                </button>
                              </MenuItem>
                            </template>
                          </div>
                        </MenuItems>
                      </transition>
                    </Menu>
                  </div>
                  <div class="w-full h-full pb-10 z-30" v-show="!elem.hide">
                    <template v-if="elem.type === 'feed'">
                      <div class="pt_nav"></div>
                      <feedviewer :isoverlay="true" :srcguid="elem.ref" v-show="!elem.hide"/>
                    </template>
                    <template v-else-if="elem.type === 'knowledge'">
                      <knowledgefinder :isoverlay="true" :srcguid="elem.ref" class="mt_nav" v-show="!elem.hide"/>
                    </template>
                    <template v-else-if="elem.type === 'chat'">
                      <chatviewer :isoverlay="true" :srcoverride="elem.ref" class="z-30" v-show="!elem.hide"/>
                    </template>
                    <template v-else-if="elem.type === 'planner'">
                      <plannerviewer :isoverlay="true" :srcoverride="elem.ref" class="z-30" v-show="!elem.hide"/>
                    </template>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
  <modal @close="isCreatingSandbox = false"
         v-show="isCreatingSandbox">
    <template v-slot:header>
      Create Sandbox
    </template>
    <template v-slot:body>
      <div class="flex min-w-[75vw] w-[50vw] lg:min-w-fit lg:w-[540px]">
        <div class="w-full">
          <label for="processTitle" class="text-xl font-bold">Title:</label>
          <br>
          <input type="text" id="processTitle" ref="processTitle" v-model="sandboxTitle"
                 class="surface rounded-md w-full py-2 px-3">
          <div class="flex mt-2 mb-4 w-full">
            <div class="mb-3 ml-auto text-black font-bold">
              <button v-on:click="submitSandbox()"
                      class="mr-2 btn_bg_primary">
                <span>Create</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
  <modal
    v-show="isAddingMedia"
    @close="cancelAddMedia">
    <template v-slot:header>
      Add File
    </template>
    <template v-slot:body>
      <template v-if="uploadFileType !== ''">
        <div style="display: flex; width: 100%; margin-bottom: 10px; margin-top: 5px"
             class="markedView max-w-[400px]">
          <img v-if="uploadFileType.includes('image')"
               class="uploadFileSnippet"
               v-bind:src="uploadFileBase64" :alt="'&nbsp;'"/>
          <audio v-else-if="uploadFileType.includes('audio')"
                 controls preload="auto"
                 class="uploadFileSnippet">
            <source :src="uploadFileBase64" :type="uploadFileType">
            Your browser does not support playing audio.
          </audio>
          <template v-else-if="uploadFileType.includes('zip')">
            <FolderArrowDownIcon class="h-10 w-10"></FolderArrowDownIcon>
          </template>
          <template v-else-if="uploadFileType.includes('text')">
            <DocumentTextIcon class="h-10 w-10"></DocumentTextIcon>
          </template>
          <template v-else-if="uploadFileType.includes('pdf')">
            <DocumentTextIcon class="h-10 w-10"></DocumentTextIcon>
          </template>
        </div>
      </template>
      <input type="file" class="file_input" id="process_add_media" :ref="'process_add_media'" name="files[]"
             style="width: 100%"
             multiple v-on:change="handleUploadFileSelect"/>
      <template v-if="uploadFileBase64 !== ''">
        <p class=" font-bold">{{ uploadFileName }}</p>
        <div class="mt-3 w-full">
          <button class="darkbutton  p-2 w-full
                           flex items-center justify-center rounded-full"
                  style="height: 2.5em;
                           border-color: transparent; margin: auto"
                  title="Send"
                  v-on:click="uploadSnippet">
            <span class="font-bold flex"><i class="bi bi-send mr-2"></i>Submit</span>
            <span style="margin-left: 10px" class="c_lightgray text-xs"> {{ uploadFileType }}</span>
          </button>
        </div>
      </template>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
</template>

<script>
// Components
import feedviewer from '@/views/apps/BroadcastFeedView.vue'
import knowledgefinder from '@/views/apps/KnowledgeFinderView.vue'
import chatviewer from '@/views/apps/ClarifierChatroomView.vue'
import plannerviewer from '@/views/apps/PlannerNewView.vue'
import mockingviewer from '@/views/dev/api/MockingbirdView.vue'
// External
import Markdown from 'vue3-markdown-it'
import markdownItMermaid from 'markdown-it-mermaid'
import { ChatBubbleLeftRightIcon, ShareIcon } from '@heroicons/vue/24/solid'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems
} from '@headlessui/vue'
import modal from '@/components/Modal.vue'
import { DocumentArrowUpIcon, DocumentTextIcon, FolderArrowDownIcon } from '@heroicons/vue/24/outline'
import mermaid from 'mermaid'

export default {
  name: 'SandboxView',
  components: {
    DocumentTextIcon,
    FolderArrowDownIcon,
    DocumentArrowUpIcon,
    modal,
    knowledgefinder,
    feedviewer,
    chatviewer,
    plannerviewer,
    mockingviewer,
    ShareIcon,
    ChatBubbleLeftRightIcon,
    Markdown,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems
  },
  data () {
    return {
      ctx: null,
      ctx2: null,
      gridSize: 32,
      width: 0,
      height: 0,
      elements: new Map(),
      canUseChat: false,
      sandboxes: [],
      noSandboxes: false,
      isCreatingSandbox: false,
      isAddingMedia: false,
      elemAddingMedia: null,
      uploadFileName: '',
      uploadFileType: '',
      uploadFileBase64: '',
      sandboxID: '',
      sandboxTitle: '',
      currentSandbox: '',
      currentElemID: '',
      newElem: {
        uid: '',
        uuid: '',
        t: '',
        desc: '',
        type: '',
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        ref: '',
        hide: false,
        _edit: false,
        _drag: false
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
      this.initCanvas()
      await this.getSandboxes()
    },
    initCanvas: function () {
      // Prepare dimensions
      const content = this.$refs.content
      const container = this.$refs.content_container
      this.width = content.clientWidth
      this.height = content.clientHeight
      // Main Canvas
      const canvas = this.$refs.sandbox_canvas
      this.ctx = canvas.getContext('2d')
      // Temporary Canvas (e.g. rectangle drawing guide etc.)
      const canvas2 = this.$refs.sandbox_canvas_tmp
      this.ctx2 = canvas2.getContext('2d')
      canvas.style.minWidth = this.width + 'px'
      canvas.style.maxWidth = canvas.style.minWidth
      canvas.style.minHeight = this.height + 'px'
      canvas.style.maxHeight = canvas.style.minHeight
      canvas.width = this.width
      canvas.height = this.height
      canvas2.style.minWidth = this.width + 'px'
      canvas2.style.maxWidth = canvas.style.minWidth
      canvas2.style.minHeight = this.height + 'px'
      canvas2.style.maxHeight = canvas.style.minHeight
      canvas2.width = this.width
      canvas2.height = this.height
      this.ctx.strokeStyle = '#6451a5'
      this.ctx.lineWidth = 2
      this.ctx.lineHeight = 2
      this.ctx2.strokeStyle = '#6451a5'
      this.ctx2.lineWidth = 2
      this.ctx2.lineHeight = 2
      this.ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.ctx2.clearRect(0, 0, canvas.width, canvas.height)
      // Event listeners
      const vueInst = this
      const ctx2 = this.ctx2
      const sidebar = this.$refs.sidebar
      const gridSize = this.gridSize
      const cellWidth = canvas2.width / gridSize
      const cellHeight = canvas2.height / gridSize
      this.$refs.content.onmousemove = (e) => {
        this.ctx2.clearRect(0, 0, canvas.width, canvas.height)
        // subtract sidebar add scroll offset
        const posX = e.clientX - sidebar.clientWidth + container.scrollLeft
        // subtract navbar add scroll offset
        const posY = e.clientY - 40 + container.scrollTop
        const flatX = Math.floor(posX / cellWidth) * cellWidth
        const flatY = Math.floor(posY / cellHeight) * cellHeight
        // Calculate
        ctx2.beginPath()
        vueInst.ctx2.rect(flatX, flatY, cellWidth, cellHeight)
        vueInst.ctx2.stroke()
      }
    },
    getSandboxes: async function () {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'sandbox/private/get'
        })
        .then(async (data) => {
          this.noSandboxes = false
          this.sandboxes = data.result.sandboxes
        })
        .catch((e) => {
          this.noSandboxes = true
          console.debug(e.message)
        })
      })
    },
    addBox: function (type) {
      const container = this.$refs.content_container
      const newElem = structuredClone(this.newElem)
      newElem.type = type
      newElem.uuid = this.getUUID()
      newElem.pid = this.sandboxID
      newElem.x = 200 + container.scrollLeft
      newElem.y = 100 + container.scrollTop
      newElem.w = 300
      newElem.h = 200
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'sandbox/private/add/' + this.sandboxID,
          body: JSON.stringify(newElem)
        })
        .then(() => {
          this.getElements(true)
        })
        .then(() => resolve())
        .catch((err) => console.debug(err.message))
      })
    },
    getUUID: function () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    },
    makeElementDraggable: function (element, obj, resize = false) {
      let pos1 = 0
      let pos2 = 0
      let pos3 = 0
      let pos4 = 0
      let _obj = null
      const _vue = this
      const _this = this.elements
      const _sidebar = this.$refs.sidebar
      const _container = this.$refs.content_container
      const gridSize = this.gridSize
      const cellWidth = this.width / gridSize
      const cellHeight = this.height / gridSize
      const updateFun = this.updateCurrentElement
      let elem
      if (!resize) {
        elem = document.getElementById(obj.uuid + '_anchor')
      } else {
        elem = document.getElementById(obj.uuid + '_anchor_size')
      }
      if (elem) {
        elem.onmousedown = dragMouseDown
      } else {
        element.onmousedown = dragMouseDown
      }

      function dragMouseDown (e) {
        e = (e || window.event)
        e.preventDefault()
        pos3 = e.clientX
        pos4 = e.clientY
        document.onmouseup = closeDragElement
        document.onmousemove = elementDrag
        _obj = _this.get(obj.uuid)
        _obj._drag = true
        _vue.currentElemID = obj.uuid
      }

      function elementDrag (e) {
        e = e || window.event
        e.preventDefault()
        pos1 = (pos3 - e.clientX)
        pos2 = (pos4 - e.clientY)
        pos3 = e.clientX
        pos4 = e.clientY
        // Set objects positional values
        if (!resize) {
          _obj.y = (element.offsetTop - pos2)
          _obj.x = (element.offsetLeft - pos1)
        } else {
          _obj.h = (pos4 - element.offsetTop - 25 + _container.scrollTop)
          _obj.w = (pos3 - element.offsetLeft - _sidebar.clientWidth + 14 + _container.scrollLeft)
        }
      }

      function closeDragElement () {
        document.onmouseup = null
        document.onmousemove = null
        _obj._drag = false
        // Snap element's position to the grid
        _obj.x = Math.round(_obj.x / cellWidth) * cellWidth
        _obj.y = Math.round(_obj.y / cellHeight) * cellHeight
        // Snap element's width and height
        _obj.w = (Math.round(_obj.w / cellWidth)) * cellWidth
        _obj.h = (Math.round(_obj.h / cellHeight)) * cellHeight
        // Update element
        _this.set(obj.uuid, _obj)
        updateFun()
      }
    },
    editElementDescription: function (elem) {
      elem._edit = true
      setTimeout(() => {
        const input = document.getElementById(elem.uuid + '_input')
        if (!input) {
          return
        }
        input.focus()
      }, 100)
    },
    getImg: function (imgGUID, get = false) {
      if (imgGUID == null || imgGUID === '') {
        return ''
      } else {
        let ret = imgGUID
        if (get) ret = this.$store.state.serverIP + '/' + imgGUID
        return ret
      }
    },
    showShareTask: function (group, elem) {
      const _elem = this.elements.get(elem.uuid)
      _elem.ref = group.id
      this.elements.set(elem.uuid, _elem)
      this.updateElement(_elem)
    },
    deleteElement: function (elem) {
      this.elements.delete(elem.uuid)
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'sandbox/private/remove/' + elem.uid
        })
        .then(() => {
          resolve()
        })
        .catch((e) => {
          console.debug(e.message)
        })
      })
    },
    toggleElement: function (elem) {
      const _elem = this.elements.get(elem.uuid)
      const htmlElem = document.getElementById(elem.uuid + '_transition')
      htmlElem.classList.add('transition-all')
      _elem.hide = !_elem.hide
      this.elements.set(elem.uuid, _elem)
      setTimeout(() => {
        htmlElem.classList.remove('transition-all')
      }, 100)
    },
    getDimension: function (value, elem, min = 0) {
      if (elem.hide) {
        return min
      } else {
        return value
      }
    },
    capitalizeFirstLetter: function ([first, ...rest], locale = navigator.language) {
      return first === undefined ? '' : first.toLocaleUpperCase(locale) + rest.join('')
    },
    createSandbox: function () {
      this.isCreatingSandbox = true
      setTimeout(() => {
        this.$refs.processTitle.focus()
      }, 0)
    },
    submitSandbox: function () {
      const payload = {
        t: this.sandboxTitle
      }
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'sandbox/private/create',
          body: JSON.stringify(payload)
        })
        .then((data) => {
          this.isCreatingSandbox = false
          this.getSandboxes()
          this.getElements()
          this.sandboxID = data.result
          this.currentSandbox = this.sandboxTitle
          this.canUseChat = true
        })
        .then(() => resolve())
        .catch((err) => console.debug(err.message))
        .finally(() => {
          this.sandboxTitle = ''
        })
      })
    },
    viewSandbox: function (sandbox) {
      this.sandboxID = sandbox.uid
      this.currentSandbox = sandbox.t
      this.elements = new Map()
      this.getElements()
    },
    getElements: function (preventScroll = false) {
      if (this.sandboxID === '') {
        return
      }
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'sandbox/private/view/' + this.sandboxID
        })
        .then(async (data) => {
          this.elements = new Map()
          let foundChat = false
          for (let i = 0; i < data.result.elements.length; i++) {
            if (!data.result.elements[i].uuid) continue
            this.elements.set(data.result.elements[i].uuid, data.result.elements[i])
            if (data.result.elements[i].type === 'chat') {
              foundChat = true
            }
            setTimeout(() => {
              const elem = document.getElementById(data.result.elements[i].uuid + '_div')
              this.makeElementDraggable(elem, data.result.elements[i])
              this.makeElementDraggable(elem, data.result.elements[i], true)
            }, 500)
          }
          this.canUseChat = !foundChat
        })
        .then(() => {
          resolve()
        })
        .catch((e) => {
          this.canUseChat = true
          console.debug(e.message)
        })
        .finally(() => {
          this.renderMermaid()
          if (!preventScroll) {
            setTimeout(() => {
              this.$refs.content_container.scrollTop = 0
              this.$refs.content_container.scrollLeft = 0
            }, 100)
          }
        })
      })
    },
    updateCurrentElement: function () {
      if (this.currentElemID === '') {
        return
      }
      return new Promise((resolve) => {
        const elem = this.elements.get(this.currentElemID)
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'sandbox/private/edit/' + elem.uid,
          body: JSON.stringify(elem)
        })
        .then(() => resolve())
        .catch((err) => console.debug(err.message))
      })
    },
    updateElement: function (elem) {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'sandbox/private/edit/' + elem.uid,
          body: JSON.stringify(elem)
        })
        .then(() => {
          elem._edit = false
        })
        .then(() => resolve())
        .catch((err) => console.debug(err.message))
      })
    },
    addToTextArea: function (id, text) {
      if (text == null || text === '') return
      const textarea = document.getElementById(id)
      if (textarea == null) return
      const startPosition = textarea.selectionStart
      const endPosition = textarea.selectionEnd
      textarea.value = `${textarea.value.substring(
        0,
        startPosition
      )}${text}${textarea.value.substring(
        endPosition,
        textarea.value.length
      )}`
      const _elem = this.elements.get(this.elemAddingMedia.uuid)
      _elem.desc = textarea.value
      this.elements.set(this.elemAddingMedia.uuid, _elem)
    },
    handleUploadFileSelect: async function (evt, drop = false) {
      if (!evt) return
      evt.stopPropagation()
      evt.preventDefault()
      let files
      if (drop) {
        files = evt.dataTransfer.files
      } else {
        files = evt.target.files
      }
      this.uploadFileBase64 = await this.getBase64(files[0])
      this.uploadFileType = files[0].type
      this.uploadFileName = files[0].name
    },
    getBase64: function (file) {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader()
        reader.onload = function () {
          resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    },
    cancelAddMedia: function () {
      this.isAddingMedia = false
      this.uploadFileType = ''
      this.uploadFileName = ''
      this.uploadFileBase64 = ''
    },
    uploadSnippet: function () {
      const content = JSON.stringify({
        base64: this.uploadFileBase64,
        name: this.uploadFileName
      })
      this.$Worker.execute({
        action: 'api',
        method: 'post',
        url: 'files/private/create',
        body: content
      })
      .then((data) => (this.processUploadSnippetResponse(data.result)))
      .catch((err) => (this.handleUploadSnippetError(err.message)))
    },
    handleUploadSnippetError: function (errorMessage = '') {
      console.debug(errorMessage)
      this.$notify(
        {
          title: 'File Not Uploaded',
          text: 'An Error occurred while uploading the file.',
          type: 'error'
        })
    },
    processUploadSnippetResponse: async function (response) {
      const contentURL = this.$store.state.serverIP + '/files/public/get/' + response.trim()
      let prefix
      if (this.uploadFileType.includes('image')) {
        prefix = '!'
      } else {
        prefix = '\n\n'
      }
      let filename = this.uploadFileName
      if (filename == null || filename === '') filename = 'Snippet'
      let text = prefix + '[' + filename + '](' + contentURL + ')'
      if (prefix === '!') {
        text = '\n\n' + text + '\n\n'
      }
      setTimeout(() => {
        this.addToTextArea(this.elemAddingMedia.uuid + '_input', text)
        this.renderMermaid()
      }, 0)
      this.cancelAddMedia()
    },
    renderMermaid: function () {
      setTimeout(() => {
        mermaid.init()
      }, 0)
    },
    addMedia: function (elem) {
      this.isAddingMedia = true
      this.elemAddingMedia = elem
    }
  }
}
</script>

<style>

.p_card_menu_item {
  @apply flex w-full items-center rounded-md px-1 py-2 text-sm hover:primary-container;
}

.p_card_menu_list_medium_p {
  @apply absolute right-0 mt-2 w-56 origin-top-right divide-y divide-zinc-400 rounded-md
  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10;
}

</style>
