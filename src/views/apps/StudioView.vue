<template>
  <template v-if="knowledgeExists">
    <div id="users" ref="users"></div>
    <div class="flex w-full h-full relative">
      <div class="border-b-[2px] border-b-neutral-700 w-full fixed top-0 left-0 pt-[55px]"></div>
      <div class="fixed left-0 top-0 w-[250px] h-full medium_bg z-50 pt-[55px] z-50">
        <div class="py-1">
          <div class="flex items-center">
            <div v-on:click="clickedBack()"
                 class="h-full ml-2 mr-2 p-2 rounded-lg text-neutral-300
                        hover:text-orange-500 cursor-pointer flex items-center justify-center">
              <i class="sb_link_icon bi bi-x-square text-xl"></i>
            </div>
            <div class="w-full overflow-x-hidden pr-2">
              <div class="py-2 px-2 pointer-events-none">
                <div class="text-lg border-l border-gray-300 pl-5 text-neutral-300 font-bold">
                  {{ this.knowledge.t }}
                </div>
                <div class="text-sm border-l border-gray-300 pl-5 text-neutral-300 text-neutral-400">
                  {{ this.knowledge.desc }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rounded m-2 p-2 dark_bg">
          <p class="font-bold text-xs mb-2">Draw Settings</p>
          <div class="p-1">
            <div class="flex w-full justify-evenly mb-2">
              <div id="btnCursorCursor" ref="btnCursorCursor"
                   class="studioToolbarButton"
                   v-on:click="setToolButton('cursor')">
                <CursorArrowRaysIcon class="h-6 w-6 text-neutral-100"></CursorArrowRaysIcon>
              </div>
              <div id="btnCursorDraw" ref="btnCursorDraw"
                   class="studioToolbarButton"
                   v-on:click="setToolButton('draw')">
                <PaintBrushIcon class="h-6 w-6 text-neutral-100"></PaintBrushIcon>
              </div>
              <div id="btnCursorText" ref="btnCursorText"
                   class="studioToolbarButton"
                   v-on:click="setToolButton('text')">
                <PencilSquareIcon class="h-6 w-6 text-neutral-100"></PencilSquareIcon>
              </div>
            </div>
            <div class="flex w-full justify-evenly mb-2">
              <div id="btnShapeFree" ref="btnShapeFree"
                   class="studioToolbarButton"
                   v-on:click="setShapeButton('free')">
                <p class="text-sm">Free</p>
              </div>
              <div id="btnShapeLine" ref="btnShapeLine"
                   class="studioToolbarButton"
                   v-on:click="setShapeButton('line')">
                <p class="text-sm">Line</p>
              </div>
              <div id="btnShapeRect" ref="btnShapeRect"
                   class="studioToolbarButton"
                   v-on:click="setShapeButton('rect')">
                <p class="text-sm">Rect.</p>
              </div>
            </div>
            <div class="flex w-full items-center justify-evenly">
              <div>
                <label for="strokeSize" class="text-sm text-neutral-300">
                  Size ({{ userSettings.strokeSize }} px)
                </label><br>
                <input v-model="userSettings.strokeSize" type="range" name="strokeSize" id="strokeSize"
                       step="1" min="1" max="40"
                       class="w-[100px]">
              </div>
              <div class="rounded-full bg-white"
                   :style="{width: userSettings.strokeSize + 'px', height: userSettings.strokeSize + 'px'}">
                &nbsp;
              </div>
            </div>
            <div class="flex w-full justify-evenly mb-2">
              <div class="w-16">
                <label for="colorStroke" class="text-sm text-neutral-300">Stroke</label><br>
                <input type="color" name="colorStroke" id="colorStroke" ref="colorStroke" value="#FFFFFF">
              </div>
              <div class="w-16">
                <label for="colorStroke" class="text-sm text-neutral-300">Fill</label><br>
                <input type="color" name="colorFill" id="colorFill" ref="colorFill" value="#FFFFFF">
              </div>
            </div>
            <div class="flex w-full justify-end gap-x-2">
              <button class="text-neutral-300 px-2 py-1 rounded medium_bg hover:darkest_bg"
                      v-on:click="resetCanvas()">
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
        <div class="rounded m-2 p-2 dark_bg">
          <p class="font-bold text-xs mb-2">Media</p>
          <div class="p-1">
            <template v-if="imageToDraw !== null">
              <button class="text-neutral-300 px-2 py-1 rounded w-full
                             bg-red-800 hover:bg-red-900 border-[1px] border-red-500"
                      v-on:click="cancelAddMedia()">
                <span>Cancel media</span>
              </button>
            </template>
            <template v-else>
              <button class="btn_small_icon text-neutral-300"
                      v-on:click="isAddingMedia = true">
                <DocumentArrowUpIcon
                  class="mr-3 h-6 w-6"
                  aria-hidden="true"
                />
                <span class="text-mg">Add image</span>
              </button>
            </template>
          </div>
        </div>
        <div class="rounded m-2 p-2 dark_bg">
          <p class="font-bold text-xs">Session Settings ({{ session.connectedUsers.length }} connected)</p>
          <div class="p-1">
            <div class="flex w-full items-center py-2">
              <Menu as="div" class="relative inline-block text-left">
                <MenuButton
                  title="Options"
                  class="btn_small_icon text-neutral-300 flex items-center cursor-pointer">
                  <UserPlusIcon class="w-6 h-6 mr-3"></UserPlusIcon>
                  <span class="text-md">Invite</span>
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
                    class="p_card_menu_list_big_p bg-zinc-100"
                  >
                    <div class="px-1 py-1">
                      <template v-for="member in members" :key="member.usr">
                        <MenuItem v-slot="{ active }">
                          <button v-on:click="inviteUser(member.id)"
                                  :class="[active ? 'p_card_menu_active' : 'text-neutral-900','group p_card_menu_item']">
                            {{ member.usr }}
                          </button>
                        </MenuItem>
                      </template>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
            <div>
              <div v-for="connection in session.connectedUsers" :key="connection"
                   class="flex items-center justify-between">
                <p>{{ connection.username }}</p>
                <button class="px-2 py-1 rounded medium_bg hover:darkest_bg"
                        v-tooltip.top="{ content: 'Remove' }"
                        v-on:click="removeConnection(connection)">
                  <span>x</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <canvas id="canvas" ref="canvas" class="w-full h-full absolute z-20 border-[2px] border-neutral-700"></canvas>
      <canvas id="canvasTmp" ref="canvasTmp" class="w-full h-full absolute z-30 pointer-events-none"></canvas>
      <div id="userCanvases" ref="userCanvases" class="w-full h-full"></div>
      <div :id="'draggableText_0_div'"
           class="imgflip_text z-40 hidden">
        <div class="flex gap-x-2 items-center">
          <div :id="'draggableText_0_div_anchor'"
               class="draggable_meme_text_anchor"
               style="font-family: Arial, sans-serif; text-shadow: none">
            <i class="bi bi-arrows-move" style="font-size: 75%; color: black"></i>
          </div>
          <div>
            <button class="btn_bg_primary w-fit flex items-center justify-center"
                    style="height: 24px !important;"
                    v-on:click="renderText">
              <span>Submit</span>
            </button>
          </div>
        </div>
        <textarea :id="'draggableText_0'" rows="1" cols="16"
                  class="font-bold draggable_meme_text border-2 border-black"></textarea>
      </div>
    </div>
  </template>
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
        </div>
      </template>
      <input type="file" class="file_input" id="studio_add_media" ref="studio_add_media" name="files[]"
             accept="image/png, image/jpeg"
             style="width: 100%"
             multiple v-on:change="handleUploadFileSelect"/>
      <template v-if="uploadFileBase64 !== ''">
        <p class="text-neutral-300 font-bold">{{ this.uploadFileName }}</p>
        <div class="mt-3 w-full">
          <template v-if="uploadFileType.includes('image')">
            <button class="darkbutton text-white p-2 w-full flex items-center justify-center rounded-full"
                    style="height: 2.5em;
                           border-color: transparent; margin: auto"
                    title="Send"
                    v-on:click="setImageMode">
              <span class="font-bold flex"><i class="bi bi-send mr-2"></i>Draw</span>
              <span style="margin-left: 10px" class="c_lightgray text-xs"> {{ this.uploadFileType }}</span>
            </button>
          </template>
          <template v-else>
            <div class="text-white p-2 w-full flex items-center justify-center rounded-full
                        bg-red-800">
              <p>File does not contain an image!</p>
            </div>
          </template>
        </div>
      </template>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
</template>

<script>
// Own
import modal from '../../components/Modal.vue'
// Icons
import { CursorArrowRaysIcon, DocumentArrowUpIcon, PaintBrushIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'
import { UserPlusIcon } from '@heroicons/vue/24/solid'
import WRTC from '@/libs/wRTC'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

export default {
  name: 'StudioView',
  components: {
    modal,
    CursorArrowRaysIcon,
    PaintBrushIcon,
    UserPlusIcon,
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    DocumentArrowUpIcon,
    PencilSquareIcon
  },
  data () {
    return {
      srcGUID: '',
      knowledge: {},
      knowledgeExists: true,
      chatroom: {},
      members: [],
      userId: '',
      connector: null,
      isoverlay: false,
      isAddingMedia: false,
      uploadFileName: '',
      uploadFileType: '',
      uploadFileBase64: '',
      imageToDraw: null,
      userSettings: {
        cursorMode: 'cursor', // cursor or draw or image
        shapeMode: 'free', // free or line or rect
        strokeSize: 5
      },
      userState: {
        isDrawing: false, // true if user is currently free drawing
        isPreparing: false, // true if user is preparing to draw line or rect
        prevX: 0,
        prevY: 0
      },
      session: {
        wRTC: {},
        connectedUsers: [],
        userCtx: new Map(),
        ctx1: null,
        ctx2: null
      }
    }
  },
  mounted () {
    this.initFunction()
  },
  methods: {
    initFunction: async function () {
      this.setToolButton()
      this.setShapeButton()
      this.initCanvas()
      // ---
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop)
      })
      // Whose knowledge are we trying to see?
      const srcGUID = params.src
      if (srcGUID == null) {
        return
      }
      this.srcGUID = srcGUID
      await this.getKnowledge(srcGUID)
      await this.getUniChatroom(srcGUID)
      this.setUpWRTC()
    },
    getKnowledge: async function (sessionID) {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'm7/get?src=' + sessionID + '&from=clarifier'
        })
          .then((data) => {
            this.knowledgeExists = true
            this.knowledge = data.result
            if (this.knowledge.categories != null) {
              for (let i = 0; i < this.knowledge.categories.length; i++) {
                this.knowledge.categories[i] = JSON.parse(this.knowledge.categories[i])
              }
            }
            resolve()
          })
          .catch((err) => {
            console.debug(err.message)
            this.knowledgeExists = false
          })
      })
    },
    getUniChatroom: async function (sessionID) {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'm5/getchatroom/' + sessionID
        })
          .then((data) => {
            this.chatroom = data.result
            this.members = []
            // Parse JSON serialized users for performance
            if (this.chatroom.members) {
              for (let i = 0; i < this.chatroom.members.length; i++) {
                // Main Members
                this.members[i] = JSON.parse(this.chatroom.members[i])
                if (this.members[i].usr === this.$store.state.username) {
                  this.userId = this.members[i].id
                }
              }
            }
          })
          .then(resolve)
      })
    },
    clickedBack: function () {
      if (!this.isoverlay) {
        this.$router.back()
      } else {
        this.$emit('close')
      }
    },
    setToolButton: function (override = null) {
      if (override != null && typeof override === 'string') {
        this.userSettings.cursorMode = override
      }
      const btnCursor = this.$refs.btnCursorCursor
      const btnDraw = this.$refs.btnCursorDraw
      const btnText = this.$refs.btnCursorText
      btnCursor.classList.remove('btnActive')
      btnDraw.classList.remove('btnActive')
      btnText.classList.remove('btnActive')
      if (this.userSettings.cursorMode === 'cursor') {
        btnCursor.classList.add('btnActive')
        this.$refs.canvas.style.cursor = 'default'
      } else if (this.userSettings.cursorMode === 'draw') {
        btnDraw.classList.add('btnActive')
        this.$refs.canvas.style.cursor = 'crosshair'
      } else if (this.userSettings.cursorMode === 'text') {
        btnText.classList.add('btnActive')
        this.$refs.canvas.style.cursor = 'default'
        this.toggleTextMode()
      }
    },
    setShapeButton: function (override = null) {
      if (override != null && typeof override === 'string') {
        this.userSettings.shapeMode = override
      }
      const btnFree = this.$refs.btnShapeFree
      const btnLine = this.$refs.btnShapeLine
      const btnRect = this.$refs.btnShapeRect
      btnFree.classList.remove('btnActive')
      btnLine.classList.remove('btnActive')
      btnRect.classList.remove('btnActive')
      if (this.userSettings.shapeMode === 'free') {
        btnFree.classList.add('btnActive')
      } else if (this.userSettings.shapeMode === 'line') {
        btnLine.classList.add('btnActive')
      } else if (this.userSettings.shapeMode === 'rect') {
        btnRect.classList.add('btnActive')
      }
    },
    initCanvas: function () {
      // Main Canvas
      const canvas = this.$refs.canvas
      this.ctx = canvas.getContext('2d')
      // Temporary Canvas (e.g. rectangle drawing guide etc.)
      const canvas2 = this.$refs.canvasTmp
      this.ctx2 = canvas2.getContext('2d')
      // ---
      const stroke = this.$refs.colorStroke
      const fill = this.$refs.colorFill
      const vueInst = this
      // ---
      // canvas.style.minWidth = canvas.parentElement.clientWidth + 'px'
      // canvas.style.maxWidth = canvas.style.minWidth
      // canvas.style.minHeight = canvas.parentElement.clientHeight + 'px'
      // canvas.style.maxHeight = canvas.style.minHeight
      // canvas.width = canvas.parentElement.clientWidth
      // canvas.height = canvas.parentElement.clientHeight
      canvas.style.minWidth = '2000px'
      canvas.style.maxWidth = canvas.style.minWidth
      canvas.style.minHeight = '2000px'
      canvas.style.maxHeight = canvas.style.minHeight
      canvas.width = 2000
      canvas.height = 2000
      // ---
      this.ctx.lineCap = 'round'
      this.ctx.strokeStyle = stroke.value
      this.ctx.fillStyle = fill.value
      this.ctx.lineWidth = this.userSettings.strokeSize
      this.ctx.font = '20px \'Open Sans\''
      // canvas2.style.minWidth = canvas.style.minWidth
      // canvas2.style.maxWidth = canvas.style.minWidth
      // canvas2.style.minHeight = canvas.style.minHeight
      // canvas2.style.maxHeight = canvas.style.minHeight
      // canvas2.width = canvas2.parentElement.clientWidth
      // canvas2.height = canvas2.parentElement.clientHeight
      canvas2.style.minWidth = '2000px'
      canvas2.style.maxWidth = canvas.style.minWidth
      canvas2.style.minHeight = '2000px'
      canvas2.style.maxHeight = canvas.style.minHeight
      canvas2.width = 2000
      canvas2.height = 2000
      this.ctx2.strokeStyle = '#FFFF00'
      // Listeners
      canvas.addEventListener('mousedown', function (e) {
        if (vueInst.userSettings.cursorMode !== 'draw') return
        vueInst.ctx.strokeStyle = stroke.value
        vueInst.ctx.lineWidth = vueInst.userSettings.strokeSize
        const shape = vueInst.userSettings.shapeMode
        if (shape === 'free') {
          vueInst.userState.isDrawing = true
        } else if (shape === 'rect' || shape === 'line' || shape === 'image') {
          if (vueInst.userState.isPreparing) return
          vueInst.userState.prevX = e.clientX
          vueInst.userState.prevY = e.clientY
          vueInst.userState.isPreparing = true
        }
      })
      canvas.addEventListener('mouseup', function (e) {
        if (vueInst.userState.isDrawing) {
          vueInst.userState.isDrawing = false
        }
        if (vueInst.userState.isPreparing) {
          const shape = vueInst.userSettings.shapeMode
          vueInst.ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
          vueInst.ctx2.beginPath()
          vueInst.userState.isPreparing = false
          const X1 = vueInst.userState.prevX
          const Y1 = vueInst.userState.prevY
          if (shape === 'rect') {
            const X2 = e.clientX - X1
            const Y2 = e.clientY - Y1
            vueInst.ctx.rect(X1, Y1, X2, Y2)
            vueInst.broadcast(
              vueInst.buildABString('[c:DR]', vueInst.userState.prevX, vueInst.userState.prevY, e.clientX, e.clientY)
            )
          } else if (shape === 'line') {
            const X2 = e.clientX
            const Y2 = e.clientY
            vueInst.ctx.moveTo(X1, Y1)
            vueInst.ctx.lineTo(X2, Y2)
            vueInst.broadcast(
              vueInst.buildABString('[c:DL]', vueInst.userState.prevX, vueInst.userState.prevY, e.clientX, e.clientY)
            )
          } else if (shape === 'image') {
            const X2 = e.clientX - X1
            const Y2 = e.clientY - Y1
            vueInst.ctx.drawImage(vueInst.imageToDraw, X1, Y1, X2, Y2)
            vueInst.broadcast(
              vueInst.buildIString('[c:DI]', vueInst.userState.prevX, vueInst.userState.prevY, e.clientX, e.clientY)
            )
            vueInst.cancelAddMedia()
          }
        }
        vueInst.ctx.stroke()
        vueInst.ctx.beginPath()
        // Send to others
        vueInst.broadcast(`[c:MU]${vueInst.$store.state.username}`)
      })
      canvas.addEventListener('mousemove', function (e) {
        // Show cursor to others
        vueInst.broadcast(`[c:CP]${vueInst.$store.state.username}|${e.clientX}|${e.clientY}`)
        // ---
        if (vueInst.userState.isPreparing) {
          const shape = vueInst.userSettings.shapeMode
          vueInst.ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
          vueInst.ctx2.beginPath()
          const X1 = vueInst.userState.prevX
          const Y1 = vueInst.userState.prevY
          if (shape === 'rect' || shape === 'image') {
            const X2 = e.clientX - X1
            const Y2 = e.clientY - Y1
            vueInst.ctx2.rect(X1, Y1, X2, Y2)
          } else if (shape === 'line') {
            const X2 = e.clientX
            const Y2 = e.clientY
            vueInst.ctx2.moveTo(X1, Y1)
            vueInst.ctx2.lineTo(X2, Y2)
          }
          vueInst.ctx2.stroke()
        }
        if (!vueInst.userState.isDrawing) return
        vueInst.ctx.lineTo(e.clientX, e.clientY)
        vueInst.ctx.stroke()
        // Send to others
        vueInst.broadcast(vueInst.buildFString('[c:DF]', e.clientX, e.clientY))
      })
    },
    resetCanvas: function () {
      // Main Canvas
      const canvas = this.$refs.canvas
      // Temporary Canvas (e.g. rectangle drawing guide etc.)
      const canvas2 = this.$refs.canvasTmp
      // Reset canvas (technically canvases)
      this.ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.ctx.beginPath()
      this.ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
      this.ctx2.beginPath()
      // Report back
      this.$notify(
        {
          title: 'Canvas cleared!',
          text: '',
          type: 'info'
        })
    },
    inviteUser: async function (remoteId) {
      if (remoteId == null) return
      if (this.session.wRTC.getPeerConnection(remoteId) !== null) {
        this.session.wRTC.hangup(remoteId)
      }
      const remoteName = this.getUserFromId(remoteId)
      this.session.wRTC.initiatePeerConnection(
        null, this.userId, remoteId, remoteName, true)
    },
    setUpWRTC: function () {
      // Initialize wRTC.js
      this.session.wRTC = WRTC
      this.session.wRTC.initialize(this.$Worker, this.$store.state.username, this.userId, true, true)
      // Create BroadcastChannel to listen to wRTC events!
      const eventChannel = new BroadcastChannel('wrtcevents')
      eventChannel.onmessage = event => {
        this.handleWRTCEvent(event)
      }
    },
    handleWRTCEvent: async function (event) {
      if (!event || !event.data) return
      if (event.data.event === 'connection_change') {
        console.log(`%c${event.data.status}`, this.session.wRTC.logStyle)
      } else if (event.data.event === 'datachannel_open') {
        const username = this.getUserFromId(event.data.remoteId)
        // Report back
        this.$notify(
          {
            title: 'User joined!',
            text: `${username} is now collaborating with you.`,
            type: 'info'
          })
        // Add data channel and connection
        const dC = this.session.wRTC.getPeerConnection(event.data.remoteId).dataChannel
        dC.send('DataChannel:OPEN')
        this.session.connectedUsers.push({
          username: username,
          datachannel: dC,
          remoteId: event.data.remoteId
        })
        // Create canvas for remote user
        const remoteCanvas = document.createElement('canvas')
        remoteCanvas.id = `rc-${username}`
        remoteCanvas.style.position = 'absolute'
        // remoteCanvas.style.minWidth = this.$refs.canvas.style.minWidth
        // remoteCanvas.style.maxWidth = this.$refs.canvas.style.maxWidth
        // remoteCanvas.style.minHeight = this.$refs.canvas.style.minHeight
        // remoteCanvas.style.maxHeight = this.$refs.canvas.style.maxHeight
        // remoteCanvas.width = this.$refs.canvas.parentElement.clientWidth
        // remoteCanvas.height = this.$refs.canvas.parentElement.clientHeight
        remoteCanvas.style.minWidth = '2000px'
        remoteCanvas.style.maxWidth = remoteCanvas.style.minWidth
        remoteCanvas.style.minHeight = '2000px'
        remoteCanvas.style.maxHeight = remoteCanvas.style.minHeight
        remoteCanvas.width = 2000
        remoteCanvas.height = 2000
        const userCanvasListElem = document.getElementById('userCanvases')
        userCanvasListElem.appendChild(remoteCanvas)
        // Add to map for performance reasons
        const remoteCtx = document.getElementById(`rc-${username}`).getContext('2d')
        remoteCtx.lineCap = 'round'
        remoteCtx.strokeStyle = '#FFFFFF'
        remoteCtx.fillStyle = '#FFFFFF'
        remoteCtx.lineWidth = 5
        remoteCtx.font = '20px \'Open Sans\''
        this.session.userCtx.set(username, remoteCtx)
        // Add remote visualizer element
        const elem = document.createElement('div')
        elem.id = `cp-${username}`
        elem.style.position = 'absolute'
        elem.style.color = 'white'
        elem.style.padding = '1px 2px 1px 2px'
        elem.style.borderRadius = '50%'
        elem.style.backgroundColor = 'rgb(24 24 27)'
        elem.style.fontSize = '0.75rem'
        elem.style.fontWeight = 'bold'
        const userTxt = document.createTextNode('◤ ' + username)
        elem.appendChild(userTxt)
        const userListElem = document.getElementById('users')
        userListElem.appendChild(elem)
      } else if (event.data.event === 'datachannel_message') {
        if (event.data.message.substring(0, 6) === '[c:CP]') {
          // Cursor Position
          const valueList = event.data.message.substring(6).split('|')
          const usrElem = document.getElementById('cp-' + valueList[0])
          if (!usrElem) return
          usrElem.style.left = `${valueList[1]}px`
          usrElem.style.top = `${valueList[2]}px`
        } else if (event.data.message.substring(0, 5) === '[c:X]') {
          this.removeConnection(event.data.message.substring(5))
        } else if (event.data.message.substring(0, 6) === '[c:DL]') {
          // Draw Line
          const valueList = event.data.message.substring(6).split('|')
          const ctx = this.session.userCtx.get(valueList[0])
          ctx.lineWidth = parseInt(valueList[5])
          ctx.strokeStyle = valueList[6]
          ctx.moveTo(
            parseInt(valueList[1]),
            parseInt(valueList[2]))
          ctx.lineTo(
            parseInt(valueList[3]),
            parseInt(valueList[4]))
          ctx.stroke()
        } else if (event.data.message.substring(0, 6) === '[c:DR]') {
          // Draw Rect
          const valueList = event.data.message.substring(6).split('|')
          const ctx = this.session.userCtx.get(valueList[0])
          ctx.lineWidth = parseInt(valueList[5])
          ctx.strokeStyle = valueList[6]
          const X1 = parseInt(valueList[1])
          const Y1 = parseInt(valueList[2])
          const X2 = parseInt(valueList[3])
          const Y2 = parseInt(valueList[4])
          ctx.rect(
            X1,
            Y1,
            X2 - X1,
            Y2 - Y1)
          ctx.stroke()
        } else if (event.data.message.substring(0, 6) === '[c:DI]') {
          // Draw Image
          const valueList = event.data.message.substring(6).split('|')
          const ctx = this.session.userCtx.get(valueList[0])
          const X1 = parseInt(valueList[1])
          const Y1 = parseInt(valueList[2])
          const X2 = parseInt(valueList[3])
          const Y2 = parseInt(valueList[4])
          const imageToDraw = new Image()
          imageToDraw.onload = function () {
            ctx.drawImage(imageToDraw,
              X1,
              Y1,
              X2 - X1,
              Y2 - Y1)
          }
          imageToDraw.src = valueList[5]
        } else if (event.data.message.substring(0, 6) === '[c:DT]') {
          // Draw Text
          const valueList = event.data.message.substring(6).split('|')
          const ctx = this.session.userCtx.get(valueList[0])
          ctx.fillStyle = valueList[4]
          const X1 = parseInt(valueList[1])
          const Y1 = parseInt(valueList[2])
          ctx.fillText(valueList[3], X1, Y1)
        } else if (event.data.message.substring(0, 6) === '[c:DF]') {
          // Draw Free
          const valueList = event.data.message.substring(6).split('|')
          const ctx = this.session.userCtx.get(valueList[0])
          ctx.lineWidth = parseInt(valueList[3])
          ctx.strokeStyle = valueList[4]
          ctx.lineTo(
            parseInt(valueList[1]),
            parseInt(valueList[2]))
          ctx.stroke()
        } else if (event.data.message.substring(0, 6) === '[c:MU]') {
          // Mouse Up
          const valueList = event.data.message.substring(6).split('|')
          const ctx = this.session.userCtx.get(valueList[0])
          ctx.beginPath()
        }
      }
      return new Promise((resolve) => {
        resolve()
      })
    },
    getUserFromId: function (userId) {
      if (this.members.length < 1) return null
      for (let i = 0; i < this.members.length; i++) {
        if (this.members[i].id === userId) {
          return this.members[i].usr
        }
      }
    },
    removeConnection: function (connection) {
      if (connection == null) return
      const username = connection.username
      if (username == null || username === '') return
      // Remove user context
      this.session.userCtx.delete(username)
      // Remove connection
      if (this.session.connectedUsers.length < 1) return null
      for (let i = 0; i < this.session.connectedUsers.length; i++) {
        if (this.session.connectedUsers[i].username === username) {
          // Close datachannel and remove connection
          this.session.connectedUsers[i].datachannel.send('[c:X]' + this.$store.state.username)
          this.session.connectedUsers[i].datachannel.close()
          this.session.connectedUsers.splice(i)
          this.session.wRTC.hangup(connection.remoteId)
          // Delete user elements from screen
          let elem = document.getElementById('rc-' + username)
          if (elem) elem.remove()
          elem = document.getElementById('cp-' + username)
          if (elem) elem.remove()
          return
        }
      }
    },
    buildABString: function (prfx, oldX, oldY, x, y, lnW = null, sC = null, fC = null) {
      if (lnW == null) lnW = this.userSettings.strokeSize
      if (sC == null) sC = this.$refs.colorStroke.value
      if (fC == null) fC = this.$refs.colorFill.value
      return `${prfx}${this.$store.state.username}|${oldX}|${oldY}|${x}|${y}|${lnW}|${sC}|${fC}`
    },
    buildFString: function (prfx, x, y, lnW = null, sC = null, fC = null) {
      if (lnW == null) lnW = this.userSettings.strokeSize
      if (sC == null) sC = this.$refs.colorStroke.value
      if (fC == null) fC = this.$refs.colorFill.value
      return `${prfx}${this.$store.state.username}|${x}|${y}|${lnW}|${sC}|${fC}`
    },
    buildIString: function (prfx, oldX, oldY, x, y) {
      return `${prfx}${this.$store.state.username}|${oldX}|${oldY}|${x}|${y}|${this.uploadFileBase64}`
    },
    buildTString: function (prfx, x, y, text, fC = null) {
      if (fC == null) fC = this.$refs.colorFill.value
      return `${prfx}${this.$store.state.username}|${x}|${y}|${text}|${fC}`
    },
    broadcast: function (payload) {
      if (this.session.connectedUsers.length < 1) return
      for (let i = 0; i < this.session.connectedUsers.length; i++) {
        this.session.connectedUsers[i].datachannel.send(payload)
      }
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
      this.imageToDraw = null
      this.userSettings.shapeMode = 'free'
      this.setShapeButton('free')
    },
    setImageMode: function () {
      const imageToDraw = new Image()
      const vueInst = this
      imageToDraw.onload = function () {
        vueInst.userSettings.cursorMode = 'draw'
        vueInst.userSettings.shapeMode = 'image'
        vueInst.imageToDraw = this
        vueInst.isAddingMedia = false
        vueInst.setToolButton('draw')
        vueInst.setShapeButton('image')
      }
      imageToDraw.src = this.uploadFileBase64
    },
    toggleTextMode: function () {
      const elem = document.getElementById('draggableText_0_div')
      elem.style.left = '320px'
      elem.style.top = '200px'
      const defaultTextarea = document.getElementById('draggableText_0')
      defaultTextarea.value = ''
      elem.style.display = 'block'
      this.makeElementDraggable(elem)
      setTimeout(() => {
        defaultTextarea.focus()
        defaultTextarea.select()
      }, 100)
    },
    renderText: function () {
      const defaultTextarea = document.getElementById('draggableText_0')
      if (defaultTextarea == null || defaultTextarea.value == null || defaultTextarea.value === '') return
      const elem = document.getElementById('draggableText_0_div')
      // Render
      let y = parseInt(elem.style.top)
      y = y + 52
      let x = parseInt(elem.style.left)
      x = x + 12
      this.ctx.fillStyle = this.$refs.colorFill.value
      this.ctx.fillText(defaultTextarea.value, x, y)
      // Broadcast
      this.broadcast(
        this.buildTString('[c:DT]', x, y, defaultTextarea.value)
      )
      // Reset
      elem.style.display = 'none'
      elem.onmousedown = null
      elem.onmousemove = null
      elem.style.left = '320px'
      elem.style.top = '200px'
      this.userSettings.cursorMode = 'draw'
      this.setToolButton('draw')
    },
    makeElementDraggable: function (element) {
      let pos1 = 0
      let pos2 = 0
      let pos3 = 0
      let pos4 = 0
      const elem = document.getElementById(element.id + '_anchor')
      if (elem) {
        elem.onmousedown = dragMouseDown
      } else {
        element.onmousedown = dragMouseDown
      }

      function dragMouseDown (e) {
        e = e || window.event
        e.preventDefault()
        pos3 = e.clientX
        pos4 = e.clientY
        document.onmouseup = closeDragElement
        document.onmousemove = elementDrag
      }

      function elementDrag (e) {
        e = e || window.event
        e.preventDefault()
        pos1 = pos3 - e.clientX
        pos2 = pos4 - e.clientY
        pos3 = e.clientX
        pos4 = e.clientY
        element.style.top = (element.offsetTop - pos2) + 'px'
        element.style.left = (element.offsetLeft - pos1) + 'px'
      }

      function closeDragElement () {
        document.onmouseup = null
        document.onmousemove = null
      }
    }
  }
}
</script>

<style>

.btnActive {
  @apply bg-indigo-700;
}

.studioToolbarButton {
  @apply w-16 border-[2px] border-neutral-500 rounded
  flex items-center justify-center p-1
  hover:border-neutral-200
  cursor-pointer;
}

.p_card_menu_active {
  @apply darkest_bg bg-opacity-60 text-white font-bold;
}

.p_card_menu_item {
  @apply flex w-full items-center rounded-md px-1 py-2 text-sm;
}

.p_card_menu_list_big_p {
  @apply absolute top-0 mb-2 w-80 divide-y divide-zinc-400 border-[1px] border-zinc-400
  shadow-zinc-900 shadow-2xl rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10
  max-h-40 overflow-y-scroll;
}

.darkbutton {
  @apply darkest_bg px-2 py-2;
}

.darkbutton:hover {
  @apply bg-black;
}

.imgflip_text {
  width: calc(100% - 330px);
  height: 55px;
  position: absolute;
  left: 320px;
  top: 200px;
  color: white;
  background: transparent;
  border: none;
}

.draggable_meme_text {
  resize: horizontal;
  color: white;
  padding-left: 10px;
  @apply bg-black;
}

.draggable_meme_text_anchor {
  width: 24px;
  height: 24px;
  background-color: white;
  cursor: move;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center
}

</style>
