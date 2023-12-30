<template>
  <div class="flex w-full h-full pt_nav justify-center background">
    <div class="max-w-screen-xl w-full
                overflow-x-hidden overflow-y-auto">
      <div class="px-4 py-3 surface bshadow mb-2 cursor-default rounded-b-lg">
        <p class="text-3xl font-bold">wikiric Stores</p>
      </div>
      <div class="px-4 py-3 flex flex-col gap-y-2">
        <div class="w-full flex justify-center mt-2 mb-4">
          <div class="w-[80%] mx-2">
            <div class="rounded-lg flex items-center relative">
              <MagnifyingGlassIcon class="w-6 h-6 mx-2 absolute translate-x-1"/>
              <input id="search-field" type="text"
                     class="search-field py-6 pl-10 pr-4 surface h-8 bshadow"
                     placeholder="Search..."
                     v-on:keyup.enter="searchStores()"
                     v-model="queryText">
            </div>
          </div>
        </div>
        <template v-if="!isLoggedIn">
          <div class="rounded surface w-fit mx-2 mb-4
                      overflow-hidden bshadow cursor-default">
            <p class="px-3 py-1 font-bold">{{ $t("stores.sign-in") }}</p>
          </div>
        </template>
        <template v-else-if="ownStore != null">
          <div class="rounded surface w-fit mx-2 mb-8 pb-4
                      overflow-hidden bshadow">
            <div class="px-3 py-1 surface-variant
                        sm:flex sm:items-center sm:gap-x-4">
              <template v-if="ownStore.iurl && ownStore.iurl !== ''">
                <img :src="getImg(ownStore.iurl, true)" alt="?"
                     class="object-contain w-[100px] h-[100px] my-2">
              </template>
              <div class="my-2">
                <p class="font-bold text-xl sm:text-2xl">
                  {{ ownStore.t }}
                </p>
                <p class="text-sm">
                  {{ ownStore.desc }}
                </p>
              </div>
            </div>
            <p class="mt-2 px-3 py-1 text-xs">
              Store ID: {{ ownStore.uid }}
            </p>
            <div class="p-3 grid grid-cols-2 gap-2">
              <div class="px-3 py-2 rounded surface-variant w-fit flex items-center gap-x-2">
                <p class=" font-bold text-lg">
                  {{ ownStore.views }}
                </p>
                <EyeIcon class="w-6 h-6"/>
              </div>
            </div>
            <div class="p-3 grid grid-cols-2 gap-2">
              <div class="rounded cursor-pointer dshadow
                          primary-container hover:primary
                          px-4 py-2"
                   v-on:click="$router.push('/stores/own/items')">
                <p class="font-bold text-xl">
                  {{ $t("eco.inventory") }}
                </p>
                <p>{{ items }} {{ $t("eco.items") }}</p>
                <p class="mt-2 text-xs">
                  {{ $t("stores.invDesc") }}
                </p>
              </div>
              <div class="rounded cursor-pointer dshadow
                          primary-container hover:primary
                          px-4 py-2"
                   v-on:click="$router.push('/stores/own/commissions')">
                <p class="font-bold text-xl">
                  {{ $t("eco.commissions") }}
                </p>
                <p>{{ orders }} {{ $t("eco.commissions") }}</p>
                <p class="mt-2 text-xs">
                  {{ $t("stores.commDesc") }}
                </p>
              </div>
            </div>
            <div class="grid grid-cols-1 gap-y-2 w-fit mt-4">
              <div class="px-3 py-1 surface-variant hover:surface
                          rounded-r cursor-pointer dshadow"
                   v-on:click="openShop()">
                <p class="px-2 py-1 text-sm font-bold">
                  {{ $t("stores.viewStore") }}
                </p>
              </div>
              <div class="px-3 py-1 surface-variant hover:surface
                          rounded-r cursor-pointer dshadow"
                   v-on:click="copyShopLink()">
                <p class="px-2 py-1 text-sm font-bold">
                  {{ $t("gen.copyLink") }}
                </p>
              </div>
              <div class="px-3 py-1 surface-variant hover:surface
                          rounded-r cursor-pointer dshadow"
                   v-on:click="isAddingMedia = true">
                <p class="px-2 py-1 text-sm font-bold">
                  {{ $t("stores.setImage") }}
                </p>
              </div>
              <div class="px-3 py-1 surface-variant hover:surface
                          rounded-r cursor-pointer dshadow"
                   v-on:click="editStoreBank()">
                <p class="px-2 py-1 text-sm font-bold">
                  {{ $t("eco.bank") }}
                </p>
              </div>
              <div class="hidden px-3 py-1 surface-variant hover:surface
                          rounded-r cursor-pointer dshadow"
                   v-on:click="editStoreAppearance()">
                <p class="px-2 py-1 text-sm font-bold">
                  {{ $t("gen.appearance") }}
                </p>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <template v-if="storeQueryDone">
            <div class="rounded medium_bg w-fit mx-2 mb-8 pb-2
                      overflow-hidden dshadow">
              <div class="flex items-center dark_bg px-3 py-1 cursor-default">
                <StarIcon class="w-5 h-5 text-orange-500 mr-2"/>
                <p class="">
                  {{ $t("stores.opt-in-t") }}
                </p>
              </div>
              <p class="text-sm  px-3 py-1 my-2 cursor-default">
                {{ $t("stores.opt-in-d1") }}
                <br>
                {{ $t("stores.opt-in-d2") }}
              </p>
              <div class="rounded w-fit mx-3 cursor-pointer
                        dark_bg hover:darkest_bg
                        px-2 py-1 border-[1px] border-neutral-600"
                   v-on:click="isCreatingStore = true">
                <p class="text-sm">{{ $t("stores.opt-in") }}</p>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
  <modal @close="isCreatingStore = false"
         v-show="isCreatingStore">
    <template v-slot:header>
      <span class="text-xl font-bold">Create your Store</span>
    </template>
    <template v-slot:body>
      <div class="p-2 w-full h-full overflow-hidden min-w-[clamp(300px,500px,92dvw)]">
        <p class="mb-2 text-lg">
          What's the store's name?
        </p>
        <div class="rounded-lg flex items-center relative mb-4">
          <input id="new_store_title" type="text"
                 class="search-field py-5 px-4 dark_bg h-8
                        border-2 border-zinc-700
                        placeholder-neutral-400"
                 placeholder="Name..."
                 v-model="newStore.t">
        </div>
        <p class="mb-2 text-lg">
          How would you describe your store?
        </p>
        <textarea type="text" id="input_comment" ref="input_comment"
                  v-model="newStore.desc" rows="4"
                  placeholder="Description..."
                  class="search-field py-2 px-4 dark_bg
                         border-2 border-zinc-700 text-sm
                         placeholder-neutral-400"></textarea>
        <p class="mb-2 text-lg">
          How will people pay you?
        </p>
        <div class="rounded-lg flex items-center relative mb-4">
          <input id="new_store_title" type="text"
                 class="search-field py-5 px-4 dark_bg h-8
                        border-2 border-zinc-700
                        placeholder-neutral-400"
                 placeholder="Your Name..."
                 v-model="newStore.bank.name">
        </div>
        <div class="rounded-lg flex items-center relative mb-4">
          <input id="new_store_title" type="text"
                 class="search-field py-5 px-4 dark_bg h-8
                        border-2 border-zinc-700
                        placeholder-neutral-400"
                 placeholder="Bank Name..."
                 v-model="newStore.bank.bank">
        </div>
        <div class="rounded-lg flex items-center relative mb-4">
          <input id="new_store_title" type="text"
                 class="search-field py-5 px-4 dark_bg h-8
                        border-2 border-zinc-700
                        placeholder-neutral-400"
                 placeholder="IBAN..."
                 v-model="newStore.bank.iban">
        </div>
        <div class="rounded-lg flex items-center relative mb-4">
          <input id="new_store_title" type="text"
                 class="search-field py-5 px-4 dark_bg h-8
                        border-2 border-zinc-700
                        placeholder-neutral-400"
                 placeholder="SWIFT (BIC)..."
                 v-model="newStore.bank.swift">
        </div>
        <div class="btn_bg_primary w-fit mt-2"
             v-on:click="createStore()">
          <p>Finish Creation</p>
        </div>
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
  <modal @close="isEditingStoreBank = false"
         v-show="isEditingStoreBank">
    <template v-slot:header>
      <span class="text-xl font-bold">Edit Bank Information</span>
    </template>
    <template v-slot:body>
      <div class="p-2 w-full h-full overflow-hidden min-w-[clamp(300px,500px,92dvw)]">
        <p class="mb-2 text-lg">
          How will people pay you?
        </p>
        <div class="rounded-lg flex items-center relative mb-4">
          <input id="new_store_title" type="text"
                 class="search-field py-5 px-4 dark_bg h-8
                        border-2 border-zinc-700
                        placeholder-neutral-400"
                 placeholder="Your Name..."
                 v-model="newStore.bank.name">
        </div>
        <div class="rounded-lg flex items-center relative mb-4">
          <input id="new_store_title" type="text"
                 class="search-field py-5 px-4 dark_bg h-8
                        border-2 border-zinc-700
                        placeholder-neutral-400"
                 placeholder="Bank Name..."
                 v-model="newStore.bank.bank">
        </div>
        <div class="rounded-lg flex items-center relative mb-4">
          <input id="new_store_title" type="text"
                 class="search-field py-5 px-4 dark_bg h-8
                        border-2 border-zinc-700
                        placeholder-neutral-400"
                 placeholder="IBAN..."
                 v-model="newStore.bank.iban">
        </div>
        <div class="rounded-lg flex items-center relative mb-4">
          <input id="new_store_title" type="text"
                 class="search-field py-5 px-4 dark_bg h-8
                        border-2 border-zinc-700
                        placeholder-neutral-400"
                 placeholder="SWIFT (BIC)..."
                 v-model="newStore.bank.swift">
        </div>
        <div class="btn_bg_primary w-fit mt-2"
             v-on:click="updateStoreBank()">
          <p>{{ $t('gen.submit') }}</p>
        </div>
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
  <modal
    v-show="isAddingMedia"
    @close="cancelAddMedia">
    <template v-slot:header>
      Add File
    </template>
    <template v-slot:body>
      <template v-if="uploadFileType !== ''">
        <div style="display: flex; width: 100%; margin-bottom: 10px; margin-top: 5px"
             class="markedView max-w-[400px]">
          <img v-if="uploadFileType.includes('image')"
               class="uploadFileSnippet"
               v-bind:src="uploadFileBase64" :alt="'&nbsp;'"/>
        </div>
      </template>
      <input type="file" class="file_input" id="studio_add_media" ref="studio_add_media" name="files[]"
             accept="image/png, image/jpeg"
             style="width: 100%"
             v-on:change="handleUploadFileSelect"/>
      <template v-if="uploadFileBase64 !== ''">
        <p class=" font-bold">{{ uploadFileName }}</p>
        <div class="mt-3 w-full">
          <template v-if="uploadFileType.includes('image')">
            <button class="darkbutton  p-2 w-full flex items-center justify-center rounded-full"
                    style="height: 2.5em;
                           border-color: transparent; margin: auto"
                    title="Send"
                    v-on:click="setImageMode">
              <span class="font-bold flex"><i class="bi bi-send mr-2"></i>Add Image</span>
              <span style="margin-left: 10px" class="c_lightgray text-xs"> {{ uploadFileType }}</span>
            </button>
          </template>
          <template v-else>
            <div class=" p-2 w-full flex items-center justify-center rounded-full
                        bg-red-800">
              <p>File does not contain an image!</p>
            </div>
          </template>
        </div>
      </template>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
  <modal @close="isEditingStoreAppearance = false"
         v-show="isEditingStoreAppearance">
    <template v-slot:header>
      <p class="text-xl font-bold">
        {{ $t('gen.appearance') }}
      </p>
    </template>
    <template v-slot:body>
      <div v-if="ownStore"
           class="px-24 py-8 flex
                  items-center justify-center">
        <div class="px-2 py-1 rounded
                    dark_bg hover:darkest_bg
                    cursor-pointer"
             v-on:click="updateStoreAppearance()">
          <template v-if="ownStore.shiny">
            <p>Un-Shiny</p>
          </template>
          <template v-else>
            <p>Shiny</p>
          </template>
        </div>
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
</template>

<script>
import { StarIcon, EyeIcon } from '@heroicons/vue/24/solid'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import modal from '@/components/Modal.vue'

export default {
  name: 'StoreFinderView',
  components: {
    modal,
    MagnifyingGlassIcon,
    StarIcon,
    EyeIcon
  },
  data () {
    return {
      ownStore: null,
      storeQueryDone: false,
      queryText: '',
      isCreatingStore: false,
      isEditingStoreBank: false,
      isEditingStoreAppearance: false,
      isAddingMedia: false,
      uploadFileName: '',
      uploadFileType: '',
      uploadFileBase64: '',
      imageToDraw: null,
      orders: 0,
      items: 0,
      newStore: {
        t: '',
        desc: '',
        bank: {
          name: '',
          bank: '',
          iban: '',
          swift: ''
        }
      }
    }
  },
  created () {
    this.initFunction()
  },
  computed: {
    isLoggedIn () {
      return this.$store.state.authenticated
    }
  },
  methods: {
    initFunction: function () {
      this.getOwnStore()
    },
    getOwnStore: function () {
      if (!this.isLoggedIn) return
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'stores/private/get'
        })
          .then((data) => {
            this.ownStore = data.result
            this.getItems()
            this.getOrders()
          })
          .then(() => resolve())
          .catch((err) => {
            this.ownStore = null
            this.storeQueryDone = true
            console.debug(err.message)
          })
      })
    },
    searchStores: function () {
      return new Promise((resolve) => {
        const payload = JSON.stringify({
          query: this.queryText
        })
        this.$Worker.execute({
          action: 'api-http',
          method: 'post',
          url: 'stores/public/discover',
          body: payload
        })
          .then((data) => {
            if (data.result) {
              console.log(data.result)
            }
          })
          .catch((err) => {
            console.debug(err.message)
          })
          .finally(() => resolve())
      })
    },
    createStore: function () {
      if (this.newStore.t === '') {
        this.$notify(
          {
            title: 'Missing Name',
            text: 'Your store needs a name!',
            type: 'error'
          })
      }
      return new Promise((resolve) => {
        const payload = JSON.stringify(this.newStore)
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'stores/private/create',
          body: payload
        })
          .then((data) => {
            if (data.result) {
              this.isCreatingStore = false
              this.getOwnStore()
            }
          })
          .then(() => resolve())
          .catch((err) => {
            this.ownStore = null
            console.debug(err.message)
          })
      })
    },
    editStoreBank: function () {
      this.newStore.bank = structuredClone(this.ownStore.bank)
      this.isEditingStoreBank = true
    },
    updateStoreBank: function () {
      return new Promise((resolve) => {
        const newBank = JSON.stringify(this.newStore.bank)
        const payload = {
          type: 'edit',
          field: 'bank',
          new: newBank
        }
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'stores/private/mod/' + this.ownStore.uid,
          body: JSON.stringify(payload)
        })
          .then(() => {
            this.isEditingStoreBank = false
            this.getOwnStore()
          })
          .finally(() => {
            resolve()
          })
      })
    },
    editStoreAppearance: function () {
      this.isEditingStoreAppearance = true
    },
    updateStoreAppearance: function () {
      return new Promise((resolve) => {
        let value
        if (this.ownStore.shiny) {
          value = 'false'
        } else {
          value = 'true'
        }
        const payload = {
          type: 'edit',
          field: 'shiny',
          new: value
        }
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'stores/private/mod/' + this.ownStore.uid,
          body: JSON.stringify(payload)
        })
          .then(() => {
            this.isEditingStoreAppearance = false
            this.getOwnStore()
          })
          .finally(() => {
            resolve()
          })
      })
    },
    getOrders: function () {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'orders/private/commissions'
        })
          .then((data) => {
            this.orders = data.result.orders.length
          })
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
      })
    },
    getItems: function () {
      const payload = {
        query: '.*'
      }
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api-http',
          method: 'post',
          url: 'items/public/query/' + this.ownStore.uid,
          body: JSON.stringify(payload)
        })
          .then((data) => {
            this.items = data.result.items.length
          })
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
      })
    },
    openShop: function () {
      this.$router.push('/store/' + this.ownStore.usr + '?ref=usr')
    },
    handleUploadFileSelect: async function (evt, drop = false) {
      if (!evt) return
      evt.stopPropagation()
      evt.preventDefault()
      let files
      if (drop) {
        files = evt.dataTransfer.files
      } else {
        files = evt.target.files
      }
      this.uploadFileBase64 = await this.getBase64(files[0])
      this.uploadFileType = files[0].type
      this.uploadFileName = files[0].name
    },
    getBase64: function (file) {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader()
        reader.onload = function () {
          resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    },
    cancelAddMedia: function () {
      this.isAddingMedia = false
      this.uploadFileType = ''
      this.uploadFileName = ''
      this.uploadFileBase64 = ''
      this.imageToDraw = null
    },
    setImageMode: function () {
      const imageToDraw = new Image()
      const vueInst = this
      const updateFunc = this.submitAddImage
      imageToDraw.onload = function () {
        vueInst.imageToDraw = this
        vueInst.isAddingMedia = false
        updateFunc()
      }
      imageToDraw.src = this.uploadFileBase64
    },
    submitAddImage: function () {
      this.isSubmittingImage = true
      const payload = {
        type: 'edit',
        field: 'iurl',
        new: this.uploadFileBase64
      }
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'stores/private/mod/' + this.ownStore.uid,
          body: JSON.stringify(payload)
        })
          .then(() => {
            this.getOwnStore()
          })
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
          .finally(() => {
            this.isSubmittingImage = false
          })
      })
    },
    getImg: function (imgGUID, get = false) {
      if (imgGUID == null || imgGUID === '') {
        return ''
      } else {
        let ret = imgGUID
        if (ret.substring(0, 5) !== 'files') return ret
        if (get) ret = this.$store.state.serverIP + '/' + imgGUID
        return ret
      }
    },
    copyShopLink: function () {
      const contentURL = this.$store.state.serverIP + '/store/' + this.ownStore.usr + '?ref=usr'
      navigator.clipboard.writeText(contentURL)
      this.$notify(
        {
          title: 'Link Copied',
          text: '',
          type: 'info'
        })
    }
  }
}
</script>

<style>

.search-field {
  border-radius: 10px;
  resize: none;
  overflow: hidden;
  width: 100%;
}

</style>
