<template>
  <div class="b_darkergray" style="min-height: 100vh; overflow-x: clip"
       :style="{ backgroundImage: 'url('+require('@/assets/'+'account/BigBlur.webp')+')',
                 backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }">
    <div class="wrapper bg-neutral-900 bg-opacity-80 pt-[80px] h-screen">
      <!-- Active Sessions -->
      <div class="container c-modal">
        <div class="row d-flex justify-content-center align-items-center">
          <div style="min-width: 400px; width: 80%">
            <div class="card-subtitle text-white" style="border-radius: 1rem">
              <div class="card-body mt-md-0">
                <div style="pointer-events: none; margin-bottom: 50px">
                  <div class="flex items-end justify-between">
                    <h1 class="fw-bold text-uppercase text-3xl text-gray-300">
                      Groups
                    </h1>
                    <div class="text-end text-neutral-300">
                      <h3 class="text-2xl" v-if="hour >= 5 && hour < 10">
                        <i class="bi bi-sunrise-fill p-1"></i>
                        Good&nbsp;Morning
                      </h3>
                      <h3 class="text-2xl" v-else-if="hour >= 10 && hour < 17">
                        <i class="bi bi-sun-fill p-1"></i>
                        Good&nbsp;Day
                      </h3>
                      <h3 class="text-2xl" v-else-if="hour >= 17 && hour < 22">
                        <i class="bi bi-sunset p-1"></i>
                        Good&nbsp;Evening
                      </h3>
                      <h3 class="text-2xl" v-else-if="hour >= 22 || hour < 5">
                        <i class="bi bi-moon p-1"></i>
                        Good&nbsp;Night
                      </h3>
                    </div>
                  </div>
                  <hr class="my-2">
                  <p class="text-neutral-400">
                    Your current Clarifier Groups. Click on one of them to quickly enter.
                  </p>
                </div>
                <div v-for="group in $store.state.clarifierSessions" :key="group"
                     class="justify-content-center"
                     style="padding-bottom: 15px; display: flex">
                  <div class="text-neutral-400 hover:text-white hover:bg-slate-700 cursor-pointer"
                       style="display: flex; align-items: center;
                              justify-items: center;
                              width: 75%; border-radius: 15px; padding: 5px"
                       v-on:click="joinActive(group.id)">
                    <img class="b_darkergray"
                         style="width: 40px; height: 40px; border-radius: 10px"
                         v-bind:src="getImg(group.img,true)"
                         :alt="'&nbsp;&nbsp;' + group.title.substring(0,1)"/>
                    <h5 class="sb_link_text text-nowrap"
                        style="margin: 0 0 0 10px; font-weight: bold">
                      &nbsp;{{ group.title }}
                    </h5>
                    <i class="bi bi-shield-lock text-white"
                       title="End-to-End Encrypted Group"
                       style="margin-left: auto; margin-right: 4px"></i>
                  </div>
                  <button class="btn"
                          title="Remove Group"
                          style="color: red; opacity: 0.8"
                          v-on:click="this.removeGroup(group)">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Join or Create a new Session -->
      <div class="container c-modal mb-4">
        <div class="row d-flex justify-content-center align-items-center">
          <div style="min-width: 400px; width: 80%">
            <div class="card-subtitle text-white">
              <div class="card-body">
                <div class="mt-md-0">
                  <h1 class="fw-bold mb-2 text-3xl text-gray-300"
                      style="pointer-events: none">
                    Add or Join
                  </h1>
                  <hr class="my-2">
                  <p style="text-align: justify; text-justify: inter-word; width: 100%; pointer-events: none"
                     class="text-neutral-400">
                    Enter an invite ID or create your own chatroom.
                  </p>
                  <input id="input_session" v-model="input_string"
                         placeholder="Invite ID or Name..."
                         class="font-bold px-2 py-1 my-3 bg-neutral-900 text-neutral-300 rounded-lg border-2 border-neutral-600"
                         style="width: 100%; font-size: 150%"
                         v-on:keyup.enter="joinOrCreate()">
                  <br>
                  <button id="btn_join_session"
                          class="btn btn-outline-light"
                          style="max-height: 6ch; height: 6ch"
                          v-on:click="join()">
                    <span class="fw-bold lead">Join</span>
                  </button>
                  <button id="btn_create_session"
                          class="btn btn-outline-light"
                          style="max-height: 6ch; height: 6ch"
                          v-on:click="create()">
                    <span class="fw-bold lead">Create</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WClarifier',
  data () {
    return {
      input_string: '',
      join_type: '',
      time: '',
      hour: 0
    }
  },
  mounted () {
    setTimeout(() => this.initFunction(), 0)
  },
  methods: {
    initFunction: function () {
      document.getElementById('btn_join_session').disabled = true
      document.getElementById('btn_create_session').disabled = true
      const sessionInput = document.getElementById('input_session')
      sessionInput.addEventListener('input', this.checkInput, false)
      sessionInput.addEventListener('keyup', this.checkInput, false)
      if (window.innerWidth >= 992) sessionInput.focus()
      this.getTime()
      setInterval(this.getTime, 1000)
    },
    create: function () {
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      fetch(
        this.$store.state.serverIP + '/api/m5/createchatroom',
        {
          method: 'post',
          headers: headers,
          body: JSON.stringify({
            title: this.input_string,
            type: 'text'
          })
        }
      )
        .then((res) => res.json())
        .then((data) => (this.$router.push('/apps/clarifier/wss/' + data.guid)))
        .catch((err) => console.log(err.message))
    },
    getImg: function (imgGUID, get = false) {
      if (imgGUID === '') {
        return ''
      } else {
        let ret = imgGUID
        if (get) ret = this.$store.state.serverIP + '/m6/get/' + imgGUID
        return ret
      }
    },
    join: function () {
      this.$router.push('/apps/clarifier/wss/' + this.input_string)
    },
    joinActive: function (id) {
      this.$router.push('/apps/clarifier/wss/' + id)
    },
    removeGroup: function (session) {
      this.$store.commit('removeClarifierSession', session)
    },
    checkInput: function () {
      const createBtn = document.getElementById('btn_create_session')
      const joinBtn = document.getElementById('btn_join_session')
      createBtn.disabled = true
      if (createBtn.classList.contains('active')) createBtn.classList.remove('active')
      if (this.input_string.length > 0) {
        createBtn.disabled = false
        if (!createBtn.classList.contains('active')) createBtn.classList.add('active')
        this.join_type = 'create'
      }
      /*
      000000000011111111112222222222333333
      012345678901234567890123456789012345
      76f7fdc1-b699-4551-bb39-3719a25f23f3
       */
      joinBtn.disabled = true
      if (joinBtn.classList.contains('active')) joinBtn.classList.remove('active')
      if ((this.input_string.length === 36) &&
        (this.input_string.substring(8, 9) === '-') &&
        (this.input_string.substring(13, 14) === '-') &&
        (this.input_string.substring(18, 19) === '-') &&
        (this.input_string.substring(23, 24) === '-')) {
        joinBtn.disabled = false
        if (!joinBtn.classList.contains('active')) joinBtn.classList.add('active')
        this.join_type = 'join'
        createBtn.disabled = true
        if (createBtn.classList.contains('active')) createBtn.classList.remove('active')
      }
    },
    joinOrCreate: function () {
      if (this.join_type === 'join') {
        this.join()
      } else {
        this.create()
      }
    },
    getTime: function () {
      const today = new Date()
      const hours = today.getHours()
      this.time = hours.toString().padStart(2, '0') +
        ':' + today.getMinutes().toString().padStart(2, '0') +
        ':' + today.getSeconds().toString().padStart(2, '0')
      this.hour = hours
    }
  }
}
</script>

<style scoped>

.b_darkergray {
  @apply bg-neutral-900;
}

.c_darkergray {
  @apply text-neutral-900;
}

.b_darkgray {
  @apply bg-gray-800;
}

.c_darkgray {
  @apply text-gray-800;
}

.b_gray {
  @apply bg-gray-700;
}

.c_gray {
  @apply text-gray-700;
}

.c_lightgray {
  @apply text-gray-400;
}

.b_orange {
  background-color: #ff5d37;
}

.c_orange {
  color: #ff5d37;
}

.wrapper {
  display: grid;
  gap: 0.5em;
  grid-auto-rows: minmax(100px, auto);
  grid-template-columns: repeat(1, 1fr);
}

#header_margin {
  min-height: 80px
}

@media only screen and (min-width: 800px) {
  .wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}

.orange-hover:hover {
  color: #ff5d37;
  cursor: pointer;
}

#btn_join_session,
#btn_create_session {
  padding: 0;
  width: 25%;
  opacity: 0.45;
  transition: ease-in-out all 0.5s;
}

#btn_join_session.active,
#btn_create_session.active {
  opacity: 1;
  width: 75%;
}

</style>
