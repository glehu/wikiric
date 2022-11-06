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
      <div class="modal b_darkgray c_lightgray container"
           role="dialog"
           aria-labelledby="modalTitle"
           aria-describedby="modalDescription"
      >
        <header
          class="modal-header"
          id="modalTitle"
        >
          <slot name="header">
          </slot>
          <button
            type="button"
            class="btn-close orange-hover"
            style="margin-right: 0"
            @click="close"
            aria-label="Close modal"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </header>

        <section
          class="modal-body"
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
  @apply rounded-lg;
  box-shadow: black 2px 2px 10px 1px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-height: 95vh;
  width: fit-content;
  max-width: 95vw;
  top: unset;
  left: unset;
}

.modal-header,
.modal-footer {
  display: flex;
}

.modal-header {
  position: relative;
  border-bottom: none;
  justify-content: space-between;
}

.modal-body {
  position: relative;
  padding: 0;
}

.modal-footer {
  padding: 0 0 8px 0;
  border: none;
}

.btn-close {
  position: absolute;
  top: 10px;
  right: 5px;
  border: none;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  background: transparent;
  color: white;
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
