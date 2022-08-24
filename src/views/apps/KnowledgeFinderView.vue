<template>
  <div class="header-margin mb-2"/>
  <div class="mx-4"
       style="height: calc(100vh - 60px)">
    <div class="px-4 py-1 text-gray-400"
         style="border-radius: 20px">
      <div class="flex items-center">
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
      <div class="btn text-gray-400"
           style="border-radius: 15px; border: 2px dashed #aeaeb7;
                  max-width: 200px; height: 100px; padding: 10px;
                  display: flex; align-items: center">
        <div class="text-center w-100">
          <i class="bi bi-plus-circle-dotted lead"></i>
          <div>Create a new category!</div>
        </div>
      </div>
    </div>
    <div class="mt-2 grid grid-cols-7 gap-3 w-full">
      <div class="col-start-1 col-end-3">
        <div class="c_lightgray bg-gray-700 p-2 rounded-lg flex items-center">
          <MagnifyingGlassIcon class="h-8 w-8 mx-1 text-gray-900"></MagnifyingGlassIcon>
          <input id="search-field" type="text"
                 class="search-field bg-gray-800 h-8"
                 placeholder="Search...">
        </div>
        <div class="c_lightgray bg-gray-700 p-2 mt-2 rounded-lg flex items-center">
          <FunnelIcon class="h-8 w-8 mx-1 text-gray-900"></FunnelIcon>
          <div class="h-8">

          </div>
        </div>
      </div>
      <div class="col-start-3 col-end-6 bg-yellow-100">
      </div>
      <div class="col-start-6 col-end-8 bg-yellow-500">
      </div>
    </div>
  </div>
</template>

<script setup>
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/vue/24/outline'
</script>

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

.header-margin {
  min-height: 60px;
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
