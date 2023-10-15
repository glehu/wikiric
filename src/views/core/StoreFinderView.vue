<template>
  <div class="flex w-full h-full pt-[55px] justify-center">
    <div class="max-w-screen-xl w-full bright_bg rounded-t
                overflow-hidden">
      <div class="px-4 py-3 medium_bg bshadow mb-2 cursor-default">
        <p class="text-3xl font-bold text-neutral-300">wikiric Stores</p>
      </div>
      <div class="px-4 py-3 flex flex-col gap-y-2">
        <div class="px-2 py-1 medium_bg dshadow mb-2
                    overflow-hidden rounded cursor-default">
          <p class="font-bold">Your Store</p>
        </div>
        <template v-if="!isLoggedIn">
          <div class="rounded dark_bg w-fit mx-2 mb-4
                      overflow-hidden dshadow cursor-default">
            <p class="px-3 py-1 font-bold">Sign in to check your store!</p>
          </div>
        </template>
        <template v-else-if="ownStore != null">
          <div class="rounded medium_bg w-fit mx-2 mb-8
                      overflow-hidden dshadow">
            <div class="px-3 py-1 dark_bg">
              <div class="flex items-baseline gap-x-2">
                <p class="font-bold text-lg">
                  {{ ownStore.t }}
                </p>
                <p class="text-sm text-neutral-400">
                  {{ ownStore.desc }}
                </p>
              </div>
            </div>
            <div class="px-3 py-1 m-3 cursor-default">
              <p class="italic text-sm">
                Dashboard is coming soon!
              </p>
            </div>
            <div class="m-2 px-3 py-1 grid grid-cols-2 gap-2">
              <div class="rounded cursor-pointer
                        dark_bg hover:darkest_bg
                        px-2 py-1 border-[1px] border-neutral-600"
                   v-on:click="$router.push('/stores/own/items')">
                <p class="font-bold text-xl">
                  Inventory
                </p>
                <p class="text-sm text-neutral-400">
                  Manage items/services you want to sell
                </p>
              </div>
              <div class="rounded cursor-pointer
                        dark_bg hover:darkest_bg
                        px-2 py-1 border-[1px] border-neutral-600"
                   v-on:click="$router.push('/stores/own/commissions')">
                <p class="font-bold text-xl">
                  Commissions
                </p>
                <p class="text-sm text-neutral-400">
                  View commissions from your customers
                </p>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="rounded medium_bg w-fit mx-2 mb-8 pb-2
                      overflow-hidden dshadow">
            <div class="flex items-center dark_bg px-3 py-1 cursor-default">
              <StarIcon class="w-5 h-5 text-orange-500 mr-2"/>
              <p class="text-neutral-300">
                Become a seller on wikiric!
              </p>
            </div>
            <p class="text-sm text-neutral-300 px-3 py-1 my-2 cursor-default">
              Create your own store and become a seller yourself!
              <br>
              Add items to sell, manage your commissions
              and connect with your customers... all on wikiric.
            </p>
            <div class="rounded w-fit mx-3 cursor-pointer
                        dark_bg hover:darkest_bg
                        px-2 py-1 border-[1px] border-neutral-600"
                 v-on:click="isCreatingStore = true">
              <p class="text-sm">Create your Store</p>
            </div>
          </div>
        </template>
        <div class="px-2 py-1 medium_bg dshadow mb-2
                    overflow-hidden rounded cursor-default">
          <p class="font-bold">Find a store</p>
        </div>
        <div class="w-full flex justify-center">
          <div class="w-[80%] mx-2">
            <div class="rounded-lg flex items-center relative">
              <MagnifyingGlassIcon class="w-6 h-6 mx-2 text-neutral-300 absolute translate-x-1"/>
              <input id="search-field" type="text"
                     class="search-field py-6 pl-10 pr-4 dark_bg h-8 border-2 border-zinc-700"
                     placeholder="Search..."
                     v-on:keyup.enter="searchStores()"
                     v-model="queryText">
            </div>
          </div>
        </div>
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
</template>

<script>
import { StarIcon } from '@heroicons/vue/24/solid'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import modal from '@/components/Modal.vue'

export default {
  name: 'StoreFinderView',
  components: {
    modal,
    MagnifyingGlassIcon,
    StarIcon
  },
  data () {
    return {
      ownStore: null,
      queryText: '',
      isCreatingStore: false,
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
          })
          .then(() => resolve())
          .catch((err) => {
            this.ownStore = null
            console.debug(err.message)
          })
      })
    },
    searchStores: function () {
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
    }
  }
}
</script>

<style>

.search-field {
  color: white;
  border-radius: 10px;
  resize: none;
  overflow: hidden;
  width: 100%;
}

</style>
