<template>
  <template v-if="knowledgeExists">
    <div id="users" ref="users"></div>
    <div class="flex w-full h-full pt-[55px] relative">
      <div class="border-t-[2px] border-t-neutral-700 w-full absolute"></div>
      <div class="fixed left-0 w-[250px] h-full medium_bg z-50">
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
            <div class="flex w-full items-center justify-evenly mb-2 py-2">
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
            <div class="flex w-full pt-2">
              <button class="ml-auto text-neutral-300 px-2 py-1 rounded medium_bg hover:darkest_bg"
                      v-on:click="resetCanvas()">
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
        <div class="rounded m-2 p-2 dark_bg">
          <p class="font-bold text-xs">Session Settings ({{ session.connectedUsers.length }} connected)</p>
          <div class="p-1">
            <div class="flex w-full items-center py-2">
              <Menu as="div" class="relative inline-block text-left">
                <MenuButton
                  title="Options"
                  class="hover:darkest_bg p-1 ml-2 bg-opacity-50 rounded flex items-center cursor-pointer">
                  <div class="text-neutral-200 p-2 rounded-md hover:darkest_bg flex items-center">
                    <UserPlusIcon class="w-[24px] h-[24px]"></UserPlusIcon>
                    <span class="pl-2">Invite</span>
                  </div>
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
                        v-on:click="removeConnection(connection.username)">
                  x
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <canvas id="canvas" ref="canvas" class="w-full h-full absolute z-40"></canvas>
      <canvas id="canvasTmp" ref="canvasTmp" class="w-full h-full absolute z-30"></canvas>
      <div id="userCanvases" ref="userCanvases" class="w-full h-full"></div>
    </div>
  </template>
</template>

<script>
// Icons
import { CursorArrowRaysIcon, PaintBrushIcon } from '@heroicons/vue/24/outline'
import { UserPlusIcon } from '@heroicons/vue/24/solid'
import WRTC from '@/libs/wRTC'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

export default {
  name: 'StudioView',
  components: {
    CursorArrowRaysIcon,
    PaintBrushIcon,
    UserPlusIcon,
    Menu,
    MenuButton,
    MenuItems,
    MenuItem
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
      userSettings: {
        cursorMode: 'cursor', // cursor or draw
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
      this.setUpWRTC()
      this.setUpConnector()
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
      if (this.userSettings.cursorMode === 'cursor') {
        btnCursor.classList.add('btnActive')
        btnDraw.classList.remove('btnActive')
        this.$refs.canvas.style.cursor = 'default'
      } else {
        btnCursor.classList.remove('btnActive')
        btnDraw.classList.add('btnActive')
        this.$refs.canvas.style.cursor = 'crosshair'
      }
    },
    setShapeButton: function (override = null) {
      if (override != null && typeof override === 'string') {
        this.userSettings.shapeMode = override
      }
      const btnFree = this.$refs.btnShapeFree
      const btnLine = this.$refs.btnShapeLine
      const btnRect = this.$refs.btnShapeRect
      if (this.userSettings.shapeMode === 'free') {
        btnFree.classList.add('btnActive')
        btnLine.classList.remove('btnActive')
        btnRect.classList.remove('btnActive')
      } else if (this.userSettings.shapeMode === 'line') {
        btnFree.classList.remove('btnActive')
        btnLine.classList.add('btnActive')
        btnRect.classList.remove('btnActive')
      } else if (this.userSettings.shapeMode === 'rect') {
        btnFree.classList.remove('btnActive')
        btnLine.classList.remove('btnActive')
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
      const vueInst = this
      // ---
      canvas.width = canvas.parentElement.clientWidth
      canvas.height = canvas.parentElement.clientHeight
      this.ctx.lineCap = 'round'
      this.ctx.strokeStyle = stroke.value
      this.ctx.lineWidth = this.userSettings.strokeSize
      canvas2.width = canvas2.parentElement.clientWidth
      canvas2.height = canvas2.parentElement.clientHeight
      this.ctx2.strokeStyle = '#FFFF00'
      // Listeners
      canvas.addEventListener('mousedown', function (e) {
        if (vueInst.userSettings.cursorMode !== 'draw') return
        vueInst.ctx.strokeStyle = stroke.value
        vueInst.ctx.lineWidth = vueInst.userSettings.strokeSize
        const shape = vueInst.userSettings.shapeMode
        if (shape === 'free') {
          vueInst.userState.isDrawing = true
        } else if (shape === 'rect' || shape === 'line') {
          if (vueInst.userState.isPreparing) return
          vueInst.userState.prevX = e.clientX - canvas.offsetLeft
          vueInst.userState.prevY = e.clientY - canvas.offsetTop
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
            const X2 = e.clientX - X1 - canvas.offsetLeft
            const Y2 = e.clientY - Y1 - canvas.offsetTop
            vueInst.ctx.rect(X1, Y1, X2, Y2)
            vueInst.broadcast(
              `[c:DR]${vueInst.$store.state.username};${vueInst.userState.prevX};${vueInst.userState.prevY};${e.clientX};${e.clientY}`
            )
          } else if (shape === 'line') {
            const X2 = e.clientX - canvas.offsetLeft
            const Y2 = e.clientY - canvas.offsetTop
            vueInst.ctx.moveTo(X1, Y1)
            vueInst.ctx.lineTo(X2, Y2)
            vueInst.broadcast(
              `[c:DL]${vueInst.$store.state.username};${vueInst.userState.prevX};${vueInst.userState.prevY};${e.clientX};${e.clientY}`
            )
          }
        }
        vueInst.ctx.stroke()
        vueInst.ctx.beginPath()
        // Send to others
        vueInst.broadcast(`[c:MU]${vueInst.$store.state.username}`)
      })
      canvas.addEventListener('mousemove', function (e) {
        // Show cursor to others
        vueInst.broadcast(`[c:CP]${vueInst.$store.state.username};${e.clientX};${e.clientY}`)
        // ---
        if (vueInst.userState.isPreparing) {
          const shape = vueInst.userSettings.shapeMode
          vueInst.ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
          vueInst.ctx2.beginPath()
          const X1 = vueInst.userState.prevX
          const Y1 = vueInst.userState.prevY
          if (shape === 'rect') {
            const X2 = e.clientX - X1 - canvas2.offsetLeft
            const Y2 = e.clientY - Y1 - canvas2.offsetTop
            vueInst.ctx2.rect(X1, Y1, X2, Y2)
          } else if (shape === 'line') {
            const X2 = e.clientX - canvas.offsetLeft
            const Y2 = e.clientY - canvas.offsetTop
            vueInst.ctx2.moveTo(X1, Y1)
            vueInst.ctx2.lineTo(X2, Y2)
          }
          vueInst.ctx2.stroke()
        }
        if (!vueInst.userState.isDrawing) return
        vueInst.ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)
        vueInst.ctx.stroke()
        // Send to others
        vueInst.broadcast(`[c:DF]${vueInst.$store.state.username};${e.clientX};${e.clientY}`)
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
      if (this.wRTC.getPeerConnection(remoteId) !== null) return
      this.wRTC.initiatePeerConnection(null, this.userId, remoteId, true)
      const offer = await this.wRTC.createOffer(remoteId)
      if (offer.offer) {
        const userTarget = this.getUserFromId(remoteId)
        await this.$Worker.execute({
          action: 'fwd',
          username: userTarget,
          type: '[A]',
          value: JSON.stringify(offer)
        })
      }
    },
    setUpWRTC: function () {
      // Initialize wRTC.js
      this.wRTC = WRTC
      this.wRTC.sayHi() // :D
      // Create BroadcastChannel to listen to wRTC events!
      const eventChannel = new BroadcastChannel('wrtcevents')
      eventChannel.onmessage = event => {
        this.handleWRTCEvent(event)
      }
    },
    handleWRTCEvent: async function (event) {
      if (!event || !event.data) return
      if (event.data.event === 'connection_change') {
        if (this.wRTC.doLog) console.debug('%c' + event.data.status, this.wRTC.logStyle)
      } else if (event.data.event === 'new_ice') {
        const candidateId = event.data.candidateId
        const peerConnection = await this.wRTC.getPeerConnection(event.data.remoteId)
        for (let i = 0; i < peerConnection.candidates.length; i++) {
          if (peerConnection.candidates[i].id === candidateId) {
            const candidatePayload = {
              selfId: peerConnection.remoteId,
              remoteId: this.userId,
              candidate: peerConnection.candidates[i].candidate
            }
            if (this.wRTC.doLog && this.wRTC.doLogVerbose) {
              console.debug('%cSending renegotiated Candidate',
                this.wRTC.logStyle,
                peerConnection.candidates[i].candidate)
            }
            const userTarget = this.getUserFromId(peerConnection.remoteId)
            await this.$Worker.execute({
              action: 'fwd',
              username: userTarget,
              type: '[C]',
              value: JSON.stringify(candidatePayload)
            })
            break
          }
        }
      } else if (event.data.event === 'incoming_track') {
        // const remoteStream = this.wRTC.getStream(event.data.remoteId)
      } else if (event.data.event === 'negotiationneeded') {
        // await this.startCall(event.data.remoteId, this.peerStreamOutgoingConstraints)
        console.log('>>> RENEGOTIATION')
      } else if (event.data.event === 'datachannel_open') {
        // Add data channel and connection
        const dC = this.wRTC.getPeerConnection(event.data.remoteId).dataChannel
        dC.send('HEY')
        const username = this.getUserFromId(event.data.remoteId)
        this.session.connectedUsers.push({
          username: username,
          datachannel: dC
        })
        // Create canvas for remote user
        const remoteCanvas = document.createElement('canvas')
        remoteCanvas.id = `rc-${username}`
        remoteCanvas.style.position = 'absolute'
        remoteCanvas.width = this.$refs.canvas.parentElement.clientWidth
        remoteCanvas.height = this.$refs.canvas.parentElement.clientHeight
        const userCanvasListElem = document.getElementById('userCanvases')
        userCanvasListElem.appendChild(remoteCanvas)
        // Add to map for performance reasons
        const remoteCtx = document.getElementById(`rc-${username}`).getContext('2d')
        remoteCtx.lineCap = 'round'
        remoteCtx.strokeStyle = '#FFFFFF'
        remoteCtx.lineWidth = 5
        this.session.userCtx.set(username, remoteCtx)
        // Add remote visualizer element
        const elem = document.createElement('div')
        elem.id = `cp-${username}`
        elem.style.position = 'absolute'
        elem.style.color = 'white'
        elem.style.fontSize = '0.75rem'
        elem.style.fontWeight = 'bold'
        const userTxt = document.createTextNode('◤ ' + username)
        elem.appendChild(userTxt)
        const userListElem = document.getElementById('users')
        userListElem.appendChild(elem)
      } else if (event.data.event === 'datachannel_message') {
        if (event.data.message.substring(0, 6) === '[c:CP]') {
          const valueList = event.data.message.substring(6).split(';')
          const usrElem = document.getElementById('cp-' + valueList[0])
          if (!usrElem) return
          usrElem.style.left = `${valueList[1]}px`
          usrElem.style.top = `${valueList[2]}px`
        } else if (event.data.message.substring(0, 5) === '[c:X]') {
          this.removeConnection(event.data.message.substring(5))
        } else if (event.data.message.substring(0, 6) === '[c:DL]') {
          // Draw Line
          const valueList = event.data.message.substring(6).split(';')
          const ctx = this.session.userCtx.get(valueList[0])
          ctx.moveTo(
            parseInt(valueList[1]) - this.$refs.canvas.offsetLeft,
            parseInt(valueList[2]))
          ctx.lineTo(
            parseInt(valueList[3]) - this.$refs.canvas.offsetLeft,
            parseInt(valueList[4]) - this.$refs.canvas.offsetTop)
          ctx.stroke()
        } else if (event.data.message.substring(0, 6) === '[c:DR]') {
          // Draw Rect
          const valueList = event.data.message.substring(6).split(';')
          const ctx = this.session.userCtx.get(valueList[0])
          const X1 = parseInt(valueList[1]) - this.$refs.canvas.offsetLeft
          const Y1 = parseInt(valueList[2])
          ctx.rect(
            X1,
            Y1,
            parseInt(valueList[3]) - X1 - this.$refs.canvas.offsetLeft,
            parseInt(valueList[4]) - Y1 - this.$refs.canvas.offsetTop)
          ctx.stroke()
        } else if (event.data.message.substring(0, 6) === '[c:DF]') {
          // Draw Free
          const valueList = event.data.message.substring(6).split(';')
          const ctx = this.session.userCtx.get(valueList[0])
          ctx.lineTo(
            parseInt(valueList[1]) - this.$refs.canvas.offsetLeft,
            parseInt(valueList[2]) - this.$refs.canvas.offsetTop)
          ctx.stroke()
        } else if (event.data.message.substring(0, 6) === '[c:MU]') {
          // Mouse Up
          const valueList = event.data.message.substring(6).split(';')
          const ctx = this.session.userCtx.get(valueList[0])
          ctx.beginPath()
        }
      }
      return new Promise((resolve) => {
        resolve()
      })
    },
    setUpConnector: function () {
      this.connector = new BroadcastChannel('connector')
      this.connector.onmessage = async event => {
        if (event.data.type == null) return
        if (event.data.type.substring(0, 4) === 'fwd:' && event.data.type.length > 4) {
          const type = event.data.type.substring(4)
          if (type === '[A]') {
            // Received offer
            const offer = JSON.parse(event.data.msg)
            if (offer.selfId !== this.userId) return
            const answer = await this.wRTC.acceptOffer(offer.selfId, offer.remoteId, offer.offer, null)
            if (answer.answer) {
              const userTarget = this.getUserFromId(offer.remoteId)
              await this.$Worker.execute({
                action: 'fwd',
                username: userTarget,
                type: '[B]',
                value: JSON.stringify(answer)
              })
            }
          } else if (type === '[B]') {
            // Received answer
            const answer = JSON.parse(event.data.msg)
            const accepted = await this.wRTC.acceptAnswer(answer.remoteId, answer.answer)
            if (!accepted) return
            const resp = {
              selfId: answer.remoteId,
              remoteId: answer.selfId
            }
            const userTarget = this.getUserFromId(answer.remoteId)
            await this.$Worker.execute({
              action: 'fwd',
              username: userTarget,
              type: '[D]',
              value: JSON.stringify(resp)
            })
            const peerConnection = await this.wRTC.getPeerConnection(answer.remoteId)
            if (peerConnection.candidates) {
              for (let i = 0; i < peerConnection.candidates.length; i++) {
                const candidatePayload = {
                  selfId: peerConnection.remoteId,
                  remoteId: this.userId,
                  candidate: peerConnection.candidates[i].candidate
                }
                await this.$Worker.execute({
                  action: 'fwd',
                  username: userTarget,
                  type: '[C]',
                  value: JSON.stringify(candidatePayload)
                })
              }
            }
          } else if (type === '[C]') {
            // ICE Candidates
            const rtcCandidatePayload = JSON.parse(event.data.msg)
            if (rtcCandidatePayload.selfId === this.userId) {
              await this.wRTC.setICECandidate(rtcCandidatePayload.remoteId, rtcCandidatePayload.candidate)
            }
          } else if (type === '[D]') {
            // Accepted -> ICE Candidates
            const payload = JSON.parse(event.data.msg)
            const peerConnection = await this.wRTC.getPeerConnection(payload.remoteId)
            if (peerConnection && peerConnection.candidates) {
              const userTarget = this.getUserFromId(payload.remoteId)
              for (let i = 0; i < peerConnection.candidates.length; i++) {
                const candidatePayload = {
                  selfId: payload.remoteId,
                  remoteId: this.userId,
                  candidate: peerConnection.candidates[i].candidate
                }
                await this.$Worker.execute({
                  action: 'fwd',
                  username: userTarget,
                  type: '[C]',
                  value: JSON.stringify(candidatePayload)
                })
              }
            }
          }
        }
      }
    },
    getUserFromId: function (userId) {
      if (this.members.length < 1) return null
      for (let i = 0; i < this.members.length; i++) {
        if (this.members[i].id === userId) {
          return this.members[i].usr
        }
      }
    },
    removeConnection: function (username) {
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
          // Delete user elements from screen
          let elem = document.getElementById('rc-' + username)
          if (elem) elem.remove()
          elem = document.getElementById('cp-' + username)
          if (elem) elem.remove()
          return
        }
      }
    },
    broadcast: function (payload) {
      for (let i = 0; i < this.session.connectedUsers.length; i++) {
        this.session.connectedUsers[i].datachannel.send(payload)
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

</style>
