<template>
  <div class="supercenter text-white"
       style="width: 90vw; background-color: darkblue; padding: 50px">
    <div style="position: absolute; top: 10px; left: 15px; display: flex">
      <i class="bi bi-terminal c_lightgray" style="font-size: 125%"></i>
      <p class="m-0 ms-2 c_lightgray">wikiric os</p>
    </div>
    <div style="position: absolute; top: 10px; right: 10px">
      <button class="btn btn-light p-0" style="width: 30px; height: 30px" disabled>
        <i class="bi bi-dash-lg"></i>
      </button>
      <button class="btn btn-light ms-2 p-0" style="width: 30px; height: 30px" disabled>
        <i class="bi bi-square small"></i>
      </button>
      <button class="btn btn-light ms-2 p-0" style="width: 30px; height: 30px"
              v-on:click="this.$router.push('/')">
        <span class="m-0">X</span>
      </button>
    </div>
    <div id="BSOD" class="text-center">
      <i class="bi bi-exclamation-triangle" style="font-size: 666%"></i>
      <br>
      <div>
        <strong style="font-size: 150%; margin: 0 0 0 10px">
          A FATAL&nbsp;ERROR HAS OCCURRED
        </strong>
      </div>
      <br><br>
      <p id="reason" style="font-size: 150%"></p>
    </div>
    <hr style="color: white">
    <div id="help" class="mt-2">
      <p>Consider the following:</p>
      <ul class="list-disc list-inside">
        <li>Report this error via
          <a class="underline" :href="'https://github.com/glehu/wikiric/issues'">Github</a>,
          providing a description of how this happened
        </li>
        <li>Visit another page</li>
      </ul>
    </div>
    <hr style="color: white">
    <div id="links" class="text-center">
      <p class="fw-bold underline">
        <i class="bi bi-house mx-2"/><a :href="'/'">Homepage</a>
        <i class="bi bi-chat-dots mx-2 ms-3"/><a :href="'/apps/clarifier'">Clarifier</a>
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

.c_lightgray {
  color: #aeaeb7;
}

</style>
