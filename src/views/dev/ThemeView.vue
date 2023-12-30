<template>
  <div class="w-screen h-screen overflow-hidden flex items-center justify-center gap-2">
    <div class="primary w-60 h-60 center">
      <p>
        Primary
      </p>
    </div>
    <div class="secondary w-40 h-40 center">
      <p>
        Secondary
      </p>
    </div>
    <div class="tertiary w-20 h-20 center">
      <p>
        Tertiary
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {}
  },
  mounted () {
    this.initFunction()
  },
  methods: {
    initFunction: async function () {
    }
  }
}
</script>

<style>

.center {
  @apply rounded flex items-center justify-center;
}

</style>
