<template>
  <div class="w-full h-full flex items-center justify-center">
    <div>
      <p class="font-bold">Redirecting...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Redirect',
  mounted () {
    setTimeout(() => {
      this.$router.replace(this.$route.query.redirect.toString() || '/')
    }, 0)
  }
}
</script>

<style scoped>

</style>
