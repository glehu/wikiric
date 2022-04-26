<template>
  <div
    style="min-height: 100vh; overflow-x: clip;
    background-image: radial-gradient(circle, #002348, #00306e, #143b92, #4543b5, #4543b5, #4543b5, #4543b5, #143b92, #00306e, #002348, #021425)"
  >
    <div id="header_margin"></div>
    <div class="wrapper">
      <!-- Join or Create a new Session -->
      <div class="container c-modal">
        <div class="row d-flex justify-content-center align-items-center">
          <div style="min-width: 400px; width: 80%">
            <div class="card text-white" style="border-radius: 1rem; background: #041830">
              <div class="card-body text-center">
                <div class="mt-md-0">
                  <h1 class="fw-bold mb-2 text-uppercase">Clarifier</h1>
                  <div class="" style="text-align: justify; text-justify: inter-word; width: 100%">
                    Communicate with your colleagues.
                    <br><br>Enter an invite ID and click Join or type in some description and create your own chatroom!
                  </div>
                  <hr style="color: white; height: 4px">
                  <input id="input_session" v-model="input_string"
                         placeholder="Invite ID or Description..."
                         style="width: 100%; font-size: 150%; font-weight: bold; margin-bottom: 1ch; padding-left: 1ch">
                  <br>
                  <button id="btn_join_session"
                          class="btn btn-outline-light" type="submit"
                          style="max-height: 6ch; height: 6ch"
                          v-on:click="join()">
                    <span class="fw-bold lead">Join</span>
                  </button>
                  <button id="btn_create_session"
                          class="btn btn-outline-light" type="submit"
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
      <!-- Active Sessions -->
      <div class="container c-modal">
        <div class="row d-flex justify-content-center align-items-center">
          <div style="min-width: 400px; width: 80%">
            <div class="card text-white" style="border-radius: 1rem; background: #041830">
              <div class="card-body">
                <div class="mt-md-0">
                  <h2 class="fw-bold mb-2 text-uppercase text-center">Active Sessions</h2>
                  <div class="text-center">
                    Your current Clarifier Sessions. Click on one of them to quickly join it!
                  </div>
                  <hr style="color: white; height: 4px">
                  <div v-for="session in this.$store.state.clarifierSessions" :key="session"
                       style="padding-bottom: 2ch; padding-left: 3ch">
                    <button class="btn btn-sm btn-outline-danger"
                            style="margin-right: 2ch"
                            v-on:click="this.removeSession(session)">
                      <i class="bi bi-x-lg"></i>
                    </button>
                    <span class="orange-hover" style="padding-left: 2ch"
                          v-on:click="joinActive(JSON.parse(session).id)">
                      <span class="fw-bold">{{ JSON.parse(session).title }}</span>
                    </span>
                  </div>
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
      input_string: ''
    }
  },
  mounted () {
    document.getElementById('btn_join_session').disabled = true
    document.getElementById('btn_create_session').disabled = true
    document.getElementById('input_session').addEventListener('input', this.checkInput, false)
  },
  methods: {
    create: function () {
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      fetch(
        this.$store.state.serverIP + '/api/m5/createchatroom',
        {
          method: 'post',
          headers: headers,
          body: JSON.stringify({
            title: this.input_string
          })
        }
      )
        .then((res) => res.json())
        .then((data) => (this.$router.push('/apps/clarifier/wss/' + data.guid)))
        .catch((err) => console.log(err.message))
    },
    join: function () {
      this.$router.push('/apps/clarifier/wss/' + this.input_string)
    },
    joinActive: function (id) {
      this.$router.push('/apps/clarifier/wss/' + id)
    },
    removeSession: function (session) {
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
        createBtn.disabled = true
        if (createBtn.classList.contains('active')) createBtn.classList.remove('active')
      }
    }
  }
}
</script>

<style scoped>

.wrapper {
  display: grid;
  gap: 0.5em;
  grid-auto-rows: minmax(100px, auto);
  grid-template-columns: repeat(1, 1fr);
}

#header_margin {
  min-height: 10vh
}

@media only screen and (min-width: 992px) {
  .wrapper {
    grid-template-columns: repeat(2, 1fr);
  }

  #header_margin {
    min-height: 15vh
  }
}

.orange-hover:hover {
  color: #ff5d37;
  cursor: grab;
}

#btn_join_session,
#btn_create_session {
  width: 6rem;
  opacity: 0.5;
  transition: ease-in-out all 0.5s;
}

#btn_join_session.active,
#btn_create_session.active {
  opacity: 1;
  width: calc(80% - 6rem);
}

</style>
