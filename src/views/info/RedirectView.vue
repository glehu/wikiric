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
      let redirect = this.$route.query.redirect.toString()
      if (this.$route.query.ref) {
        const ref = this.$route.query.ref.toString()
        if (ref && ref !== '') {
          if (redirect.includes('?')) {
            // Redirect has query params => Attach with ampersand
            redirect = redirect + '&ref=' + ref
          } else {
            // Redirect has no query params => Attach with query operator / question mark
            redirect = redirect + '?ref=' + ref
          }
        }
      }
      this.$router.replace(redirect || '/')
    }, 0)
  }
}
</script>

<style scoped>

</style>
