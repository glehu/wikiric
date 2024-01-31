<template>
  <div class="mt_nav h_full_nav w-full flex flex-row">
    <div ref="sidebar"
         class="h-full flex flex-col gap-1 surface-variant w-full max-w-xs fmt_border_top">
      <div class="w-full surface p-2">
        <p class="font-bold">
          Sandbox
        </p>
      </div>
      <div class="w-full surface p-4 rounded">
        <div class="fmt_button w-full"
             v-on:click="addBox()">
          <p class="font-bold text-center w-full">Create Box</p>
        </div>
      </div>
    </div>
    <div class="w-full h-full">
      <div ref="sandbox"
           class="relative">
        <canvas ref="sandbox_canvas" class="pointer-events-none absolute"></canvas>
        <canvas ref="sandbox_canvas_tmp" class="absolute cursor-crosshair fmt_border"></canvas>
      </div>
      <div ref="content" class="z-50 absolute w-full h-full">
        <div :id="'draggableText_0_div'"
             class="absolute z-50 hidden">
          <div class="flex gap-x-2 items-center">
            <div :id="'draggableText_0_div_anchor'"
                 class="draggable_meme_text_anchor surface w-8 h-8 flex items-center justify-center"
                 style="font-family: Arial, sans-serif; text-shadow: none">
              <i class="bi bi-arrows-move"></i>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SandboxView',
  data () {
    return {
      ctx: null,
      ctx2: null,
      gridSize: 16
    }
  },
  mounted () {
    this.initFunction()
  },
  methods: {
    initFunction: async function () {
      this.initCanvas()
    },
    initCanvas: function () {
      // Main Canvas
      const canvas = this.$refs.sandbox_canvas
      this.ctx = canvas.getContext('2d')
      // Temporary Canvas (e.g. rectangle drawing guide etc.)
      const canvas2 = this.$refs.sandbox_canvas_tmp
      this.ctx2 = canvas2.getContext('2d')
      // ---
      canvas.style.minWidth = '700px'
      canvas.style.maxWidth = canvas.style.minWidth
      canvas.style.minHeight = '700px'
      canvas.style.maxHeight = canvas.style.minHeight
      canvas.width = 700
      canvas.height = 700
      canvas2.style.minWidth = '700px'
      canvas2.style.maxWidth = canvas.style.minWidth
      canvas2.style.minHeight = '700px'
      canvas2.style.maxHeight = canvas.style.minHeight
      canvas2.width = 700
      canvas2.height = 700
      this.ctx.strokeStyle = '#ffffff'
      this.ctx.lineWidth = 1
      this.ctx.lineHeight = 1
      this.ctx2.strokeStyle = '#ffffff'
      this.ctx2.lineWidth = 1
      this.ctx2.lineHeight = 1
      // --- Draw grid
      this.ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.ctx2.clearRect(0, 0, canvas.width, canvas.height)
      // for (let y = 1; y <= this.gridSize; y++) {
      //   this.ctx.beginPath()
      //   this.ctx.moveTo(0, (y * (canvas.height / this.gridSize)))
      //   this.ctx.lineTo(canvas.width, (y * (canvas.height / this.gridSize)))
      //   this.ctx.stroke()
      // }
      // for (let x = 1; x <= this.gridSize; x++) {
      //   this.ctx.beginPath()
      //   this.ctx.moveTo((x * (canvas.width / this.gridSize)), 0)
      //   this.ctx.lineTo((x * (canvas.width / this.gridSize)), canvas.height)
      //   this.ctx.stroke()
      // }
      // Event listeners
      const vueInst = this
      const ctx2 = this.ctx2
      const sidebar = this.$refs.sidebar
      const gridSize = this.gridSize
      const cellWidth = canvas2.width / gridSize
      const cellHeight = canvas2.height / gridSize
      this.$refs.content.onmousemove = (e) => {
        this.ctx2.clearRect(0, 0, canvas.width, canvas.height)
        const posX = e.clientX - sidebar.clientWidth // Subtract Sidebar
        const posY = e.clientY - 40 // Subtract Navbar
        const flatX = Math.floor(posX / cellWidth) * cellWidth
        const flatY = Math.floor(posY / cellHeight) * cellHeight
        // Calculate
        ctx2.beginPath()
        vueInst.ctx2.rect(flatX, flatY, cellWidth, cellHeight)
        vueInst.ctx2.stroke()
      }
    },
    addBox: function () {
      const elem = document.getElementById('draggableText_0_div')
      elem.style.left = '320px'
      elem.style.top = '200px'
      elem.style.display = 'block'
      this.makeElementDraggable(elem)
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

</style>
