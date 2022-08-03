<template>
  <div class="supercenter text-white"
       style="width: 90vw; background-color: darkblue; padding: 50px">
    <div id="BSOD" class="text-center">
      <i class="bi bi-exclamation-triangle" style="font-size: 666%"></i>
      <strong style="font-size: 150%; margin-left: 20px">FATAL&nbsp;ERROR</strong>
      <br><strong id="reason" style="font-size: 150%"></strong>
    </div>
    <hr style="color: white">
    <div id="help" class="mt-2">
      <p>Consider the following:</p>
      <ul>
        <li>Report this error via
          <a style="color: white;" :href="'https://github.com/glehu/wikiric/issues'">Github</a>,
          providing a description of how this happened
        </li>
        <li>Visit another page</li>
      </ul>
    </div>
    <hr style="color: white">
    <div id="links" class="text-center">
      <p class="fw-bold">
        <i class="bi bi-house mx-2"/><a style="color: white;" :href="'/'">Homepage</a>
        <i class="bi bi-chat-dots mx-2 ms-3"/><a style="color: white;" :href="'/apps/clarifier'">Clarifier</a>
      </p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'BSOD',
  mounted () {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop)
    })
    if (params.reason != null) {
      document.getElementById('reason').innerText = 'Reason: ' + params.reason
    } else {
      document.getElementById('reason').innerText = '(Unknown Reason)'
    }
  }
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
  margin: 0 0 0 calc(-45vw);
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

</style>
