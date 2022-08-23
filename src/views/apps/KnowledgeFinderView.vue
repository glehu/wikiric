<template>
  <div class="header-margin"/>
  <div class="container" style="height: calc(100vh - 60px)">
    <div class="c_lightgray b_darkgray"
         style="padding: 10px 10px 10px 25px; border-radius: 20px">
      <div class="d-flex">
        <div class="d-flex align-items-center justify-content-center"
             style="margin-right: 25px">
          <i class="bi bi-book-half" style="font-size: 300%"></i>
        </div>
        <div>
          <h2>Knowledge</h2>
          <template v-if="source !== ''">
            <h4 class="fw-bold">{{ source }}</h4>
          </template>
          <template v-else>
            <h5>Welcome to the Knowledge Hub</h5>
          </template>
        </div>
      </div>
    </div>
    <div class="my-2">
      <div class="btn c_lightgray"
           style="border-radius: 15px; border: 2px dashed #aeaeb7;
                  max-width: 200px; height: 100px; padding: 10px;
                  display: flex; align-items: center">
        <div class="text-center w-100">
          <i class="bi bi-plus-circle-dotted lead"></i>
          <div>Create a new category!</div>
        </div>
      </div>
    </div>
    <div class="wrapper mt-2">
      <div class="c_lightgray b_darkgray"
           style="padding: 10px 10px 10px 10px; border-radius: 20px;
                  grid-column: 1 / 3">
        <input id="search-field" type="text" class="search-field b_darkergray"
               placeholder="Search...">
      </div>
      <div class="c_lightgray"
           style="padding: 10px 10px 10px 10px;
                  grid-column: 3 / 7">
      </div>
      <div class="c_lightgray"
           style="padding: 10px 10px 10px 10px;
                  border-left: 1px solid rgba(174,174,183,0.5);
                  grid-column: 7">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KnowledgeFinderView',
  data () {
    return {
      source: ''
    }
  },
  mounted () {
    this.initFunction()
  },
  methods: {
    initFunction: async function () {
      // Whose knowledge are we trying to see?
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop)
      })
      const srcGUID = params.src
      if (srcGUID != null) {
        const chatroom = await this.getClarifierChatroom(srcGUID)
        if (chatroom != null) {
          this.source = chatroom.t
        }
      }
    },
    getClarifierChatroom: async function (sessionID) {
      return new Promise((resolve) => {
        const headers = new Headers()
        headers.set('Authorization', 'Bearer ' + this.$store.state.token)
        fetch(
          this.$store.state.serverIP + '/api/m5/getchatroom/' + sessionID,
          {
            method: 'get',
            headers: headers
          }
        )
          .then((res) => res.json())
          .then((data) => resolve(data))
          .catch((err) => console.error(err.message))
      })
    }
  }
}
</script>

<style scoped>

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
  background-color: #212b36;
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

.header-margin {
  min-height: 60px;
}

.wrapper {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 10px;
  grid-auto-rows: minmax(100px, auto);
}

/* Small devices (portrait tablets and large phones, 765px and up) */
@media only screen and (min-width: 992px) {
  .wrapper {
    grid-template-columns: repeat(7, 1fr);
  }
}

.search-field {
  padding-top: 3px;
  padding-bottom: 4px;
  padding-left: 1ch;
  color: white;
  border-color: transparent;
  border-radius: 10px;
  resize: none;
  overflow: hidden;
  width: 100%;
}

</style>
