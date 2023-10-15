<template>
  <div class="flex w-full h-full pt-[55px] justify-center bright_bg">
    <template v-if="store != null">
      <div ref="storeView"
           class="w-full overflow-x-hidden
                  overflow-y-auto">
        <div class="w-full">
          <div class="w-full mb-4
                      overflow-hidden bshadow">
            <div class="px-3 py-3 darkest_bg flex justify-center">
              <div class="max-w-screen-xl w-full flex items-center">
                <BuildingStorefrontIcon
                  class="h-14 w-14 text-neutral-300 mr-4"/>
                <div>
                  <p class="font-bold text-3xl">
                    {{ store.t }}
                  </p>
                  <p class="text-sm text-neutral-400">
                    {{ store.desc }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-center px-4">
            <div class="max-w-screen-xl w-full lg:flex lg:gap-x-4">
              <div id="shop-sidebar"
                   class="mb-4 lg:sticky lg:top-4 h-fit">
                <div class="rounded-lg flex items-center relative mb-4
                            max-w-[350px] w-full">
                  <MagnifyingGlassIcon class="w-6 h-6 mx-2 text-neutral-300 absolute translate-x-1"/>
                  <input id="search-field" type="text"
                         class="search-field py-6 pl-10 pr-4 w-full
                                dark_bg h-8 border-2 border-zinc-700"
                         placeholder="Search..."
                         v-on:keyup.enter="getItems()"
                         v-model="queryText">
                </div>
                <div class="bright_bg max-w-[350px] pb-2
                          border-t-2 border-l-2 border-neutral-700
                          rounded overflow-hidden dshadow">
                  <div class="w-full medium_bg px-2 py-1
                            font-bold text-neutral-300
                            flex items-center bshadow">
                    <FunnelIcon class="h-5 w-5 mr-2"/>
                    <p class="text-neutral-300">Filters</p>
                  </div>
                  <div>
                    <p class="w-full px-2 mt-2 pb-1 text-sm
                          font-bold text-neutral-200">
                      Pricing
                    </p>
                    <div class="px-2 flex gap-x-2 relative">
                      <div class="search-field dark_bg w-fit
                              border-2 border-zinc-700 text-sm">
                        <span class="absolute py-2 pl-3">€</span>
                        <input type="number" id="minCost"
                               placeholder="Min"
                               class="placeholder-neutral-400
                                  dark_bg py-2 pl-7 pr-4">
                      </div>
                      <div class="search-field dark_bg w-fit
                              border-2 border-zinc-700 text-sm">
                        <span class="absolute py-2 pl-3">€</span>
                        <input type="number" id="maxCost"
                               placeholder="Max"
                               class="placeholder-neutral-400
                                  dark_bg py-2 pl-7 pr-4">
                      </div>
                    </div>
                    <p class="w-full px-2 mt-2 pb-1 text-sm
                          font-bold text-neutral-200">
                      Sort by
                    </p>
                    <div class="px-2 flex gap-x-2 relative">
                      <div class="metaTag cursor-pointer" :class="{active: sort.byRelevance}"
                           v-on:click="sortResults('relevance')">
                        <div class="flex items-center text-neutral-300">
                          <FunnelIcon class="h-4 w-4 mr-1"/>
                          <p class="text-xs font-bold">
                            Relevance
                          </p>
                        </div>
                      </div>
                      <div class="metaTag cursor-pointer" :class="{active: sort.byViews}"
                           v-on:click="sortResults('views')">
                        <div class="flex items-center text-neutral-300">
                          <EyeIcon class="h-4 w-4 mr-1"/>
                          <p class="text-xs font-bold">
                            Views
                          </p>
                        </div>
                      </div>
                      <div class="metaTag cursor-pointer" :class="{active: sort.byCost}"
                           v-on:click="sortResults('cost')">
                        <div class="flex items-center text-neutral-300">
                          <TagIcon class="h-4 w-4 mr-1"/>
                          <p class="text-xs font-bold">
                            Cost
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <template v-if="items.length > 0">
                <div id="shop-items"
                     class="flex flex-col gap-y-4 pb-16 w-full">
                  <div class="metaTag pointer-events-none">
                    <p class="text-xs text-neutral-300 font-bold">
                      {{ items.length }} results in {{ respTime }} s
                    </p>
                  </div>
                  <template v-for="item in items" :key="item">
                    <div class="medium_bg p-2 rounded dshadow store_item relative
                                max-w-[750px]">
                      <div class="flex gap-x-2">
                        <template v-if="item.iurls == null || item.iurls.length < 1">
                          <div class="min-w-[8rem] min-h-[8rem]
                                    md:min-w-[10rem] md:min-h-[10rem]
                                    lg:min-w-[12rem] lg:min-h-[12rem]
                                    xl:min-w-[14rem] xl:min-h-[14rem]
                                    max-w-[8rem] max-h-[8rem]
                                    md:max-w-[10rem] md:max-h-[10rem]
                                    lg:max-w-[12rem] lg:max-h-[12rem]
                                    xl:max-w-[14rem] xl:max-h-[14rem]
                                    dark_bg
                                    rounded flex items-center justify-center">
                            <p class="text-xs font-bold text-neutral-400">( No Image )</p>
                          </div>
                        </template>
                        <template v-else>
                          <div class="flex flex-col rounded dark_bg relative">
                            <div class="pb-6">
                              <div class="min-w-[8rem] min-h-[8rem]
                                      md:min-w-[12rem] md:min-h-[12rem]
                                      lg:min-w-[14rem] lg:min-h-[14rem]
                                      xl:min-w-[16rem] xl:min-h-[16rem]
                                      max-w-[8rem] max-h-[8rem]
                                      md:max-w-[12rem] md:max-h-[12rem]
                                      lg:max-w-[14rem] lg:max-h-[14rem]
                                      xl:max-w-[16rem] xl:max-h-[16rem]
                                      flex items-start justify-center">
                                <img :src="getImg(item.iurls[item.iix].url, true)" alt="?"
                                     v-on:click="showItemImages(item, item.iix)">
                              </div>
                            </div>
                            <div class="absolute bottom-0 w-full overflow-hidden">
                              <div class="flex flex-row justify-center gap-x-1 pb-1">
                                <template v-for="(img, index) in item.iurls" :key="img">
                                  <div class="img_index"
                                       :class="{active: index === item.iix}"
                                       v-on:click="item.iix = index">
                                    <p>{{ index + 1 }}</p>
                                  </div>
                                </template>
                              </div>
                              <div class="flex gap-x-1 px-2 py-1">
                                <p class="text-sm text-neutral-400">
                                  [{{ item.iix + 1 }}/{{ item.iurls.length }}]
                                </p>
                                <p class="text-sm text-neutral-400">
                                  {{ item.iurls[item.iix].t }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </template>
                        <div class="text-sm text-neutral-300 w-full">
                          <div class="cursor-pointer hover:bright_bg
                                    rounded px-2 py-1 w-full"
                               v-on:click="showItem(item)">
                            <p class="font-bold text-xl mb-2">
                              {{ item.t }}
                            </p>
                            <p class="text-sm">{{ item.desc }}</p>
                          </div>
                          <template v-if="item.attr.length > 0">
                            <div class="border-[1px] border-neutral-500
                                      p-2 rounded m-2 w-fit">
                              <table style="margin-bottom: 0">
                                <template v-for="attribute in item.attr" :key="attribute">
                                  <tr>
                                    <td><p class="px-1">
                                      {{ attribute.t }}:
                                    </p></td>
                                    <td><p class="px-1">
                                      {{ attribute.sval }}
                                    </p></td>
                                    <td><p class="text-neutral-400 text-xs px-1 hidden md:block">
                                      {{ attribute.desc }}
                                    </p></td>
                                  </tr>
                                </template>
                              </table>
                            </div>
                          </template>
                          <template v-if="item.tvars && item.tvars.length > 0">
                            <div class="m-2 flex-wrap gap-x-4 gap-y-2 flex w-full">
                              <div v-for="(variation, index) in item.vars" :key="variation">
                                <Listbox v-model="item.tvars[index].vars[0]">
                                  <div class="relative mt-1">
                                    <ListboxButton
                                      class="dark_bg w-full relative cursor-default rounded-lg py-2 pl-3
                                             min-w-[8rem]
                                             pr-10 text-left shadow-md focus:outline-none
                                             focus-visible:border-indigo-500 focus-visible:ring-2
                                             focus-visible:ring-white focus-visible:ring-opacity-75
                                             focus-visible:ring-offset-2
                                             focus-visible:ring-offset-orange-300 sm:text-sm"
                                    >
                                      <template
                                        v-if="item.tvars[index].vars != null && item.tvars[index].vars[0].sval ">
                                        <div class="block truncate font-bold text-neutral-300">
                                          {{ variation.t }}: {{ item.tvars[index].vars[0].sval }}
                                        </div>
                                      </template>
                                      <template v-else>
                                      <span class="block truncate font-bold text-neutral-300">
                                        Select {{ variation.t }}...
                                      </span>
                                      </template>
                                      <div
                                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <ArrowsUpDownIcon class="h-5 w-5 text-neutral-400" aria-hidden="true"/>
                                      </div>
                                    </ListboxButton>
                                    <transition
                                      leave-active-class="transition duration-100 ease-in"
                                      leave-from-class="opacity-100"
                                      leave-to-class="opacity-0">
                                      <ListboxOptions
                                        class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md
                                               dark_bg py-1 text-base shadow-lg ring-1 ring-black
                                               ring-opacity-5 focus:outline-none sm:text-sm z-50"
                                      >
                                        <ListboxOption
                                          v-slot="{ active, selected }"
                                          v-for="cat in variation.vars"
                                          :key="cat"
                                          :value="cat"
                                          as="template"
                                        >
                                          <li
                                            :class="[ active ? 'bg-gray-700' : '',
                                  'relative cursor-pointer select-none py-2 pl-10 pr-4 text-neutral-200' ]">
                                            <div
                                              :class="[ selected ? 'font-medium' : 'font-normal', 'block truncate' ]">
                                              {{ cat.sval }}
                                            </div>
                                            <div
                                              v-if="selected"
                                              class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                              <CheckIcon class="h-5 w-5" aria-hidden="true"/>
                                            </div>
                                          </li>
                                        </ListboxOption>
                                      </ListboxOptions>
                                    </transition>
                                  </div>
                                </Listbox>
                              </div>
                            </div>
                          </template>
                          <div class="flex items-center gap-x-2 m-2 mt-4 h-14">
                            <input type="number" min="0" v-model="item.amt"
                                   class="border-[1px] w-[5rem] h-full
                                        border-neutral-500 px-3 py-1 rounded
                                        dark_bg text-xl">
                            <div class="cursor-pointer border-[1px] h-full
                                      border-neutral-500 px-3 py-1 rounded
                                      dark_bg hover:darkest_bg w-fit
                                      flex items-center justify-between gap-x-4"
                                 v-on:click="addToCart(item)">
                              <ShoppingCartIcon class="h-8 w-8"/>
                              <div>
                                <p class="text-xl font-bold">
                                  {{ ((item.net * (item.vatp + 1)) * item.amt).toFixed(2) }} €
                                </p>
                                <div class="flex items-center text-xs gap-x-2">
                                  <p class="text-neutral-400">
                                    {{ item.net.toFixed(2) }} €
                                  </p>
                                  <p class="text-neutral-400">
                                    {{ item.vatp.toFixed(2) * 100 }} % VAT
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        class="mr-auto absolute top-0 right-0 h-full">
                        <Menu as="div" class="relative inline-block text-left h-full hidden">
                          <MenuButton
                            title="Options"
                            class="store_item_edit_overlay hover:bright_bg rounded text-neutral-300
                               m-1 p-1 backdrop-blur-3xl flex items-center cursor-pointer">
                            <SquaresPlusIcon class="h-5 w-5"></SquaresPlusIcon>
                          </MenuButton>
                          <transition
                            enter-active-class="transition duration-100 ease-out"
                            enter-from-class="transform scale-95 opacity-0"
                            enter-to-class="transform scale-100 opacity-100"
                            leave-active-class="transition duration-75 ease-in"
                            leave-from-class="transform scale-100 opacity-100"
                            leave-to-class="transform scale-95 opacity-0"
                          >
                            <MenuItems
                              class="p_card_menu_list_medium_p bg-zinc-100"
                            >
                              <div class="px-1 py-1">
                                <MenuItem v-slot="{ active }">
                                  <button v-on:click="deletePeriodicAction(action)"
                                          :class="[active
                                      ? 'p_card_menu_active'
                                      : 'text-neutral-900','group p_card_menu_item']">
                                    <PencilSquareIcon
                                      :active="active"
                                      class="mr-2 h-5 w-5"
                                      aria-hidden="true"
                                    />
                                    Edit
                                  </button>
                                </MenuItem>
                              </div>
                            </MenuItems>
                          </transition>
                        </Menu>
                      </div>
                    </div>
                  </template>
                </div>
              </template>
              <template v-else-if="isLoading">
                <div class="w-full flex
                            items-center justify-center">
                  <p class="font-bold p-8">
                    Loading...
                  </p>
                </div>
              </template>
              <template v-else>
                <div class="w-full flex
                            items-center justify-center">
                  <p class="font-bold p-8">
                    No Results :(
                  </p>
                </div>
              </template>
              <template v-if="$store.state.cart && $store.state.cart.length > 0">
                <div>
                  <div v-on:click="showCart"
                       class="cartButton">
                    <ShoppingCartIcon class="h-6 w-6 text-neutral-300 mr-2"/>
                    <p class="text-neutral-300 font-bold">Show&nbsp;Cart</p>
                    <p class="translate-y-4 translate-x-2
                              text-white bg-orange-900 bg-opacity-50
                              px-1.5 py-0.5 rounded-full font-bold text-xs
                              border-[2px] border-orange-600">
                      {{ $store.state.cart.length }}
                    </p>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
  <div id="cartSidebar" ref="cartSidebar"
       style="margin-top: 55px; box-shadow: 1px 0 4px 1px rgb(40 40 43)"
       class="cartSidebar brightest_bg lg:rounded-tl">
    <div class="h-full relative">
      <div class="w-full medium_bg px-3 py-2
                  font-bold text-neutral-300
                  flex items-center bshadow
                  absolute top-0 justify-between">
        <p class="text-neutral-300 hidden md:block">
          Shopping Cart
        </p>
        <div class="px-2 py-1 rounded hover:dark_bg
                    text-neutral-300 items-center
                    cursor-pointer flex gap-x-2"
             v-on:click="hideCart()">
          <p class="text-sm block md:hidden">
            Continue Shopping
          </p>
          <ChevronRightIcon class="h-6 w-6"/>
        </div>
      </div>
      <div class="pt-14 px-2 h-full">
        <template v-if="$store.state.cart && $store.state.cart.length > 0">
          <div class="cursor-pointer px-1 rounded mb-2 mt-1
                      dark_bg hover:darkest_bg w-fit"
               v-on:click="$store.commit('clearCart')">
            <p class="font-bold text-sm text-neutral-300">
              Clear
            </p>
          </div>
          <div class="btn_bg_primary mb-2"
               v-on:click="cartCheckout()">
            <p class="text-center font-bold">Proceed to Checkout</p>
          </div>
          <div class="flex flex-col gap-y-2">
            <div v-for="cartItem in $store.state.cart" :key="cartItem.uid"
                 class="p-2 m-1 rounded bright_bg dshadow">
              <p class="font-bold">{{ cartItem.t }}</p>
              <p class="text-sm">{{ cartItem.desc }}</p>
              <div class="flex gap-x-2 mt-2">
                <input type="number" min="0" v-model="cartItem.amt"
                       class="border-[1px] w-[5rem]
                            border-neutral-500 px-3 py-1 rounded
                            dark_bg text-xl text-neutral-200">
                <div>
                  <p class="text-xl font-bold">
                    {{ ((cartItem.net * (cartItem.vatp + 1)) * cartItem.amt).toFixed(2) }} €
                  </p>
                  <div class="flex items-center text-xs gap-x-2">
                    <p class="text-neutral-400">
                      {{ cartItem.net.toFixed(2) }} €
                    </p>
                    <p class="text-neutral-400">
                      {{ cartItem.vatp.toFixed(2) * 100 }} % VAT
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="h-full flex items-center justify-center">
            <p>Nothing here, yet!</p>
          </div>
        </template>
      </div>
    </div>
  </div>
  <modal
    v-show="isViewingImage"
    @close="isViewingImage = false">
    <template v-slot:header>
      <p>Images</p>
    </template>
    <template v-slot:body>
      <div v-if="viewingImageURLs.length > 0"
           class="overflow-hidden w-full h-full p-1 dark_bg relative">
        <div class="h-[75vh] w-full flex justify-center items-start pb-16">
          <img :src="getImg(viewingImageURLs[viewingImageIndex].url, true)" alt="?"
               class="object-contain h-full w-full">
        </div>
        <div class="absolute bottom-0 w-full overflow-hidden">
          <div class="flex flex-row justify-center gap-x-2 pt-2 w-full">
            <template v-for="(img, index) in viewingImageURLs" :key="img">
              <div class="img_index"
                   :class="{active: index === viewingImageIndex}"
                   v-on:click="viewingImageIndex = index">
                <p class="text-neutral-400">{{ index + 1 }}</p>
              </div>
            </template>
          </div>
          <div class="flex gap-x-1 px-2 pt-1 pb-2">
            <p class="text-sm text-neutral-400">
              [{{ viewingImageIndex + 1 }}/{{ viewingImageURLs.length }}]
            </p>
            <p class="text-sm text-neutral-400">
              {{ viewingImageURLs[viewingImageIndex].t }}
            </p>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
</template>

<script>
import {
  ArrowsUpDownIcon,
  BuildingStorefrontIcon,
  CheckIcon,
  ChevronRightIcon,
  EyeIcon,
  FunnelIcon,
  PencilSquareIcon,
  ShoppingCartIcon,
  TagIcon
} from '@heroicons/vue/24/solid'
import { MagnifyingGlassIcon, SquaresPlusIcon } from '@heroicons/vue/24/outline'
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems
} from '@headlessui/vue'
import modal from '@/components/Modal.vue'

export default {
  name: 'ShopNewView',
  components: {
    modal,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    Menu,
    MenuItem,
    MenuItems,
    MenuButton,
    ArrowsUpDownIcon,
    PencilSquareIcon,
    SquaresPlusIcon,
    CheckIcon,
    ShoppingCartIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    FunnelIcon,
    BuildingStorefrontIcon,
    TagIcon,
    ChevronRightIcon
  },
  data () {
    return {
      storeID: '',
      store: null,
      items: [],
      respTime: 0,
      noResults: false,
      isLoading: false,
      isViewingImage: false,
      viewingImageURLs: [],
      viewingImageIndex: 0,
      queryText: '',
      sort: {
        byRelevance: true,
        byViews: false,
        byCost: false
      },
      isViewingCart: false
    }
  },
  mounted () {
    this.initFunction()
    document.onkeydown = this.handleGlobalKeyEvents
  },
  methods: {
    initFunction: async function () {
      this.storeID = this.$route.params.id
      await this.getStore()
      this.getItems('.*')
    },
    getStore: function () {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api-http',
          method: 'get',
          url: 'stores/public/get/' + this.storeID
        })
          .then((data) => {
            this.store = data.result
          })
          .then(() => resolve())
          .catch((err) => {
            this.store = null
            console.debug(err.message)
          })
      })
    },
    getItems: function (substitute = null) {
      this.items = []
      this.isLoading = true
      this.$refs.storeView.scrollTo({
        top: 0,
        behavior: 'auto'
      })
      this.noResults = false
      const payload = {
        query: substitute ?? this.queryText
      }
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api-http',
          method: 'post',
          url: 'items/public/query/' + this.store.uid,
          body: JSON.stringify(payload)
        })
          .then((data) => {
            if (data.result.items && data.result.items.length > 0) {
              for (let i = 0; i < data.result.items.length; i++) {
                data.result.items[i].amt = 1
                data.result.items[i].iix = 0
                if (data.result.items[i].vars) {
                  data.result.items[i].tvars = structuredClone(data.result.items[i].vars)
                  for (let j = 0; j < data.result.items[i].tvars.length; j++) {
                    data.result.items[i].tvars[j].vars = [{}]
                  }
                }
              }
              this.items = data.result.items
              this.respTime = data.result.respTime
              this.sortResults(null)
            } else {
              this.noResults = true
            }
          })
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
          .finally(() => {
            this.isLoading = false
          })
      })
    },
    sortResults: function (type) {
      if (type === 'relevance' || (type == null && this.sort.byRelevance === true)) {
        this.sort.byRelevance = true
        this.sort.byViews = false
        this.sort.byCost = false
        this.items.sort(this.compareRelevance)
      } else if (type === 'views' || (type == null && this.sort.byViews === true)) {
        this.sort.byRelevance = false
        this.sort.byViews = true
        this.sort.byCost = false
        this.items.sort(this.compareViews)
      } else if (type === 'cost' || (type == null && this.sort.byCost === true)) {
        this.sort.byRelevance = false
        this.sort.byViews = false
        this.sort.byCost = true
        this.items.sort(this.compareCost)
      }
    },
    compareRelevance: function (a, b) {
      return b.accuracy - a.accuracy
    },
    compareViews: function (a, b) {
      return b.views - a.views
    },
    compareCost: function (a, b) {
      return a.net - b.net
    },
    showItem: function (item) {
    },
    addToCart: function (item) {
      this.$store.commit('putInCart', item)
      this.$notify(
        {
          title: item.amt + 'x ' + item.t + ' added to the cart!',
          text: '',
          type: 'info'
        })
      this.showCart()
    },
    showCart: function () {
      this.$refs.cartSidebar.classList.remove('active')
      this.$refs.cartSidebar.classList.add('active')
    },
    hideCart: function () {
      this.$refs.cartSidebar.classList.remove('active')
    },
    cartCheckout: function () {
      this.$router.push('/checkout/' + this.storeID)
    },
    formatCurrency: function (number) {
      const formatted = parseInt(number.toString()).toLocaleString()
      return formatted + '.' + number.toFixed(2).split('.')[1]
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
    showItemImages: function (item, index) {
      if (item == null || item.iurls == null || item.iurls.length < 1) return
      this.viewingImageURLs = item.iurls
      this.viewingImageIndex = index
      this.isViewingImage = true
    },
    handleGlobalKeyEvents: function (event) {
      const ev = event
      if (ev.key === 'Escape') {
        this.isViewingImage = false
      } else if (ev.key === 'ArrowLeft') {
        if (this.isViewingImage === true && this.viewingImageIndex > 0) {
          this.viewingImageIndex -= 1
        }
      } else if (ev.key === 'ArrowRight') {
        if (this.isViewingImage === true && this.viewingImageIndex < this.viewingImageURLs.length - 1) {
          this.viewingImageIndex += 1
        }
      }
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
}

.store_item_edit_overlay {
  opacity: 0;
}

.store_item:hover .store_item_edit_overlay {
  opacity: 1;
}

.cartSidebar {
  opacity: 0;
  width: 0;
  height: calc(100% - 55px);
  position: absolute;
  z-index: 100;
  top: 0;
  right: 0;
  overflow-x: clip;
  overflow-y: scroll;
  transition: ease-in-out all 0.2s;
  float: right;
}

.cartSidebar.active {
  min-width: 350px;
  opacity: 1;
}

.cartButton {
  @apply rounded-b lg:rounded px-2 py-1
  medium_bg hover:dark_bg
  cursor-pointer flex
  border-l-[2px] border-b-[2px]
  border-r-[2px]
  lg:border-none lg:dshadow
  border-neutral-800
  fixed top-[55px] right-[10px]
  lg:sticky lg:top-4;
}

</style>
