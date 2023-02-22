<script>
export default {
  name: 'CModal',
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal medium_bg c_lightgray"
           role="dialog"
           aria-labelledby="modalTitle"
           aria-describedby="modalDescription"
      >
        <header
          class="modal-header darkest_bg z-50"
          id="modalTitle"
        >
          <slot name="header">
          </slot>
          <button
            type="button"
            class="btn-close orange-hover"
            @click="close"
            aria-label="Close modal"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </header>

        <section
          class="modal-body mt-[42px] z-40"
          id="modalDescription"
        >
          <slot name="body">
          </slot>
        </section>

        <footer class="modal-footer">
          <slot name="footer">
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<style>
.b_purple {
  background-color: #68349b;
}

.c_purple {
  color: #68349b;
}

.b_darkblue {
  background-color: #041830;
}

.c_darkblue {
  color: #041830;
}

.b_darkgray {
  @apply bg-slate-700;
}

.c_darkgray {
  color: #192129;
}

.b_darkergray {
  background-color: #131313;
}

.c_darkergray {
  color: #131313;
}

.b_gray {
  background-color: #293139;
}

.c_gray {
  color: #293139;
}

.c_lightgray {
  color: #aeaeb7;
}

.b_orange {
  background-color: #ff5d37;
}

.c_orange {
  color: #ff5d37;
}

.modal-backdrop {
  z-index: 999;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  @apply rounded-lg max-h-[calc(90dvh-60px)] max-w-[95dvw];
  box-shadow: black 2px 2px 10px 1px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: fit-content;
  top: unset;
  left: unset;
  transform: translateY(30px);
}

.modal-header,
.modal-footer {
  display: flex;
}

.modal-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 52px;
  @apply font-bold text-lg border-b-4 border-b-zinc-700 items-center pl-4;
}

.modal-body {
  position: relative;
  padding: 12px;
  max-height: 100%;
  overflow-y: auto;
}

.modal-footer {
  padding: 0 0 8px 0;
  border: none;
}

.btn-close {
  position: absolute;
  top: 12px;
  right: 12px;
  border: none;
  font-size: 20px;
  cursor: pointer;
  font-weight: bold;
  background: transparent;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.btn-green {
  color: white;
  border-radius: 10px;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.1s ease-in;
}

.orange-hover:hover {
  color: #ff5d37;
  cursor: pointer;
}

</style>
