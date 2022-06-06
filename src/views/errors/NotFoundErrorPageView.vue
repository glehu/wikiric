<template>
  <div class="supercenter text-white" style="width: 350px">
    <div id="404" class="text-center">
      <p class="fw-bold doHover" style="font-size: 400%;">404</p>
      <p class="doHover" style="color: gray; font-size: 200%;">(╯°□°）╯︵ ┻━┻</p>
      <strong>The requested content does not exist.</strong>
    </div>
    <hr style="color: white">
    <div id="help" class="mt-2">
      <p>Consider the following:</p>
      <ul>
        <li>Check the spelling of the URL</li>
        <li>Visit another page</li>
      </ul>
    </div>
    <hr style="color: white">
    <div id="links" class="text-center">
      <p class="fw-bold">
        <i class="bi bi-house mx-2"/><a :href="'/'">Homepage</a>
        <i class="bi bi-chat-dots mx-2 ms-3"/><a :href="'/apps/clarifier'">Clarifier</a>
      </p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'NotFoundErrorPage'
}

</script>

<style scoped>

h1 {
  font-size: 2em;
}

.supercenter {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0 0 0 -175px;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

.doHover {
  animation: hover 3s ease-in-out infinite;
}

@keyframes hover {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(15%);
  }
  100% {
    transform: translateY(0);
  }
}

</style>
