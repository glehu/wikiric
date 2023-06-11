<template>
  <template v-if="knowledgeExists">
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
      </div>
      <canvas id="canvas" ref="canvas" class="w-full h-full absolute z-40"></canvas>
      <canvas id="canvasTmp" ref="canvasTmp" class="w-full h-full absolute z-30"></canvas>
    </div>
  </template>
</template>

<script>
// Icons
import { CursorArrowRaysIcon, PaintBrushIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'StudioView',
  components: {
    CursorArrowRaysIcon,
    PaintBrushIcon
  },
  data () {
    return {
      srcGUID: '',
      knowledge: {},
      knowledgeExists: true,
      isoverlay: false,
      userSettings: {
        cursorMode: 'cursor', // cursor or draw
        shapeMode: 'free' // free or line or rect
      },
      userState: {
        isDrawing: false, // true if user is currently free drawing
        isPreparing: false, // true if user is preparing to draw line or rect
        prevX: 0,
        prevY: 0
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
      const ctx = canvas.getContext('2d')
      // Temporary Canvas (e.g. rectangle drawing guide etc.)
      const canvas2 = this.$refs.canvasTmp
      const ctx2 = canvas2.getContext('2d')
      // ---
      const stroke = this.$refs.colorStroke
      const vueInst = this
      // ---
      canvas.width = canvas.parentElement.clientWidth
      canvas.height = canvas.parentElement.clientHeight
      canvas2.width = canvas2.parentElement.clientWidth
      canvas2.height = canvas2.parentElement.clientHeight
      ctx2.strokeStyle = '#FFFF00'
      // Listeners
      canvas.addEventListener('mousedown', function (e) {
        if (vueInst.userSettings.cursorMode !== 'draw') return
        ctx.strokeStyle = stroke.value
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
          ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
          ctx2.beginPath()
          vueInst.userState.isPreparing = false
          const X1 = vueInst.userState.prevX
          const Y1 = vueInst.userState.prevY
          if (shape === 'rect') {
            const X2 = e.clientX - X1 - canvas.offsetLeft
            const Y2 = e.clientY - Y1 - canvas.offsetTop
            ctx.rect(X1, Y1, X2, Y2)
          } else if (shape === 'line') {
            const X2 = e.clientX - canvas.offsetLeft
            const Y2 = e.clientY - canvas.offsetTop
            ctx.moveTo(X1, Y1)
            ctx.lineTo(X2, Y2)
          }
        }
        ctx.stroke()
        ctx.beginPath()
      })
      canvas.addEventListener('mousemove', function (e) {
        if (vueInst.userState.isPreparing) {
          const shape = vueInst.userSettings.shapeMode
          ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
          ctx2.beginPath()
          const X1 = vueInst.userState.prevX
          const Y1 = vueInst.userState.prevY
          if (shape === 'rect') {
            const X2 = e.clientX - X1 - canvas2.offsetLeft
            const Y2 = e.clientY - Y1 - canvas2.offsetTop
            ctx2.rect(X1, Y1, X2, Y2)
          } else if (shape === 'line') {
            const X2 = e.clientX - canvas.offsetLeft
            const Y2 = e.clientY - canvas.offsetTop
            ctx2.moveTo(X1, Y1)
            ctx2.lineTo(X2, Y2)
          }
          ctx2.stroke()
        }
        if (!vueInst.userState.isDrawing) return
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)
        ctx.stroke()
      })
    },
    resetCanvas: function () {
      // Main Canvas
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext('2d')
      // Temporary Canvas (e.g. rectangle drawing guide etc.)
      const canvas2 = this.$refs.canvasTmp
      const ctx2 = canvas2.getContext('2d')
      // Reset canvas (technically canvases)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.beginPath()
      ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
      ctx2.beginPath()
      // Report back
      this.$notify(
        {
          title: 'Canvas cleared!',
          text: '',
          type: 'info'
        })
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

</style>
