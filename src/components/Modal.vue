<script>
import { XMarkIcon } from '@heroicons/vue/24/outline'
export default {
  name: 'CModal',
  components: {
    XMarkIcon
  },
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
      <div class="modal background"
           role="dialog"
           aria-labelledby="modalTitle"
           aria-describedby="modalDescription"
      >
        <header
          class="modal-header surface-variant z-50"
          id="modalTitle"
        >
          <slot name="header">
          </slot>
          <button
            type="button"
            class="btn-close hover:primary rounded"
            @click="close"
            aria-label="Close modal"
          >
            <XMarkIcon class="h-6 w-6"></XMarkIcon>
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
.c_lightgray {
  color: #aeaeb7;
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
  @apply relative rounded-lg max-h-[calc(100dvh-50px)] max-w-[100dvw];
  box-shadow: black 2px 2px 10px 1px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: fit-content;
  top: unset;
  left: unset;
  margin-top: 50px;
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
  border-bottom: 2px solid var(--md-sys-color-outline-variant);
  @apply font-bold text-lg items-center pl-4 ;
}

.modal-body {
  position: relative;
  padding: 12px;
  max-height: 100%;
  overflow-y: auto;
  @apply pt-5;
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
