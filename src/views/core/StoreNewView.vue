<template>
  <div class="flex w-full h-full pt-[55px] justify-center brightest_bg">
    <template v-if="store != null">
      <div ref="storeView"
           class="w-full overflow-x-hidden overflow-y-scroll">
        <div class="w-full">
          <div class="w-full mb-4
                      overflow-hidden bshadow">
            <div class="p-4 darkest_bg flex justify-center">
              <div class="max-w-screen-2xl w-full
                          flex flex-col md:flex-row md:items-center
                          gap-4">
                <template v-if="store.iurl == null || store.iurl === ''">
                  <BuildingStorefrontIcon
                    class="h-14 w-14 text-neutral-300"/>
                </template>
                <template v-else>
                  <img :src="getImg(store.iurl, true)" alt="?"
                       class="object-contain w-[176px] max-h-[176px]">
                </template>
                <div class="ml-2">
                  <p class="font-bold text-3xl md:text-4xl lg:text-5xl mb-2">
                    {{ store.t }}
                  </p>
                  <p class="text-neutral-400">
                    {{ store.desc }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-center px-4">
            <div class="max-w-screen-2xl w-full xl:flex xl:gap-x-4">
              <div id="shop-sidebar"
                   class="mb-4 xl:sticky xl:top-4 h-fit">
                <div class="rounded-lg flex items-center relative mb-4
                            max-w-[552px] xl:max-w-[350px] w-full">
                  <MagnifyingGlassIcon class="w-6 h-6 mx-2 text-neutral-300 absolute translate-x-1"/>
                  <input id="search-field" type="text"
                         class="search-field py-6 pl-10 pr-4 w-full
                                dark_bg h-8 border-2 border-zinc-700"
                         placeholder="Search..."
                         v-on:keyup.enter="getItems()"
                         v-model="queryText">
                </div>
                <div class="max-w-[550px] xl:max-w-[350px] pb-2
                            rounded overflow-hidden border-2 border-neutral-600">
                  <div class="w-full bright_bg bg-opacity-75 px-2 py-1
                            font-bold text-neutral-100
                            flex items-center bshadow">
                    <FunnelIcon class="h-5 w-5 mr-2"/>
                    <p class="text-neutral-100">
                      {{ $t("gen.filters") }}
                    </p>
                  </div>
                  <div class="p-2">
                    <p class="w-full px-2 mt-2 pb-1 text-sm
                          font-bold text-neutral-100">
                      {{ $t("eco.pricing") }}
                    </p>
                    <div class="px-2 flex gap-x-2 relative items-center">
                      <div class="search-field dark_bg w-fit
                                  border-2 border-zinc-700 text-sm">
                        <p class="ml-2 mt-1 text-xs">MIN</p>
                        <span class="absolute py-2 pl-3">€</span>
                        <input type="number" id="minCost"
                               v-model="queryMinCost"
                               v-on:keyup.enter="getItems()"
                               placeholder="Min"
                               class="placeholder-neutral-400
                                  dark_bg py-2 pl-7 pr-4">
                      </div>
                      <div class="search-field dark_bg w-fit
                              border-2 border-zinc-700 text-sm">
                        <p class="ml-2 mt-1 text-xs">MAX</p>
                        <span class="absolute py-2 pl-3">€</span>
                        <input type="number" id="maxCost"
                               v-model="queryMaxCost"
                               v-on:keyup.enter="getItems()"
                               placeholder="Max"
                               class="placeholder-neutral-400
                                  dark_bg py-2 pl-7 pr-4">
                      </div>
                    </div>
                    <p class="w-full px-2 mt-2 pb-1 text-sm
                          font-bold text-neutral-100">
                      {{ $t("gen.sortBy") }}
                    </p>
                    <div class="px-2 flex gap-x-2 relative">
                      <div class="metaTag cursor-pointer" :class="{active: sort.byRelevance}"
                           v-on:click="sortResults('relevance')">
                        <div class="flex items-center text-neutral-300">
                          <FunnelIcon class="h-4 w-4 mr-1"/>
                          <p class="text-xs font-bold">
                            {{ $t("gen.relevance") }}
                          </p>
                        </div>
                      </div>
                      <div class="metaTag cursor-pointer" :class="{active: sort.byViews}"
                           v-on:click="sortResults('views')">
                        <div class="flex items-center text-neutral-300">
                          <EyeIcon class="h-4 w-4 mr-1"/>
                          <p class="text-xs font-bold">
                            {{ $t("gen.views") }}
                          </p>
                        </div>
                      </div>
                      <div class="metaTag cursor-pointer" :class="{active: sort.byCost}"
                           v-on:click="sortResults('cost')">
                        <div class="flex items-center text-neutral-300">
                          <TagIcon class="h-4 w-4 mr-1"/>
                          <p class="text-xs font-bold">
                            {{ $t("gen.cost") }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <template v-if="filters && filters.vars && filters.vars.length > 0">
                      <p class="w-full px-2 mt-2 pb-1 text-sm
                              font-bold text-neutral-100">
                        {{ $t("gen.variations") }}
                      </p>
                      <div class="pl-1 pr-3 flex items-start flex-col gap-y-2 w-full
                                  max-h-[calc(50vh)] overflow-y-scroll pb-4">
                        <template v-for="variation in filters.vars" :key="variation.t">
                          <template v-if="variation.vars">
                            <Disclosure v-slot="{ open }" as="div"
                                        :default-open="true"
                                        class="flex flex-wrap items-center bg-opacity-50
                                               gap-2 rounded-xl w-full bright_bg dshadow">
                              <DisclosureButton
                                class="btn_disclosure rounded-lg w-full m-1">
                                <p class="text-sm font-bold rounded-lg">{{ variation.t }}</p>
                                <ChevronUpIcon
                                  :class="open ? 'rotate-180 transform' : ''"
                                  class="h-5 w-5 text-neutral-400"
                                />
                              </DisclosureButton>
                              <transition
                                enter-active-class="transition duration-100 ease-out"
                                enter-from-class="transform scale-95 opacity-0"
                                enter-to-class="transform scale-100 opacity-100"
                                leave-active-class="transition duration-75 ease-out"
                                leave-from-class="transform scale-100 opacity-100"
                                leave-to-class="transform scale-95 opacity-0"
                              >
                                <DisclosurePanel>
                                  <div class="flex flex-wrap gap-2 items-center p-2">
                                    <div v-for="subVariation in variation.vars" :key="subVariation.sval"
                                         class="metaTag cursor-pointer" style="margin: 0 !important"
                                         v-on:click="toggleVariationQuery(variation.t, subVariation.sval)">
                                      <p class="text-xs font-bold">
                                        {{ subVariation.sval }}
                                      </p>
                                    </div>
                                  </div>
                                </DisclosurePanel>
                              </transition>
                            </Disclosure>
                          </template>
                        </template>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              <div class="w-full">
                <template v-if="variationQuery.length > 0">
                  <div class="flex flex-wrap gap-2 w-fit mb-4">
                    <div v-for="variation in variationQuery" :key="variation.t"
                         class="p-1 medium_bg dshadow flex flex-wrap">
                      <p class="text-sm font-bold px-2 py-1 dark_bg w-fit rounded mr-2">
                        {{ variation.t }}:
                      </p>
                      <div class="flex flex-wrap items-center gap-2 divide-x divide-neutral-500">
                        <div v-for="subVariation in variation.svals" :key="subVariation"
                             class="px-2 py-1 hover:darkest_bg cursor-pointer flex gap-x-3 items-center"
                             v-on:click="removeVariationQuery(variation.t, subVariation)">
                          <XMarkIcon class="h-4 w-4 text-neutral-300 ml-2"/>
                          <p class="text-sm font-bold">{{ subVariation }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-if="items.length > 0">
                  <div class="w-full">
                    <div class="metaTag pointer-events-none mb-4">
                      <p class="text-xs text-neutral-300 font-bold">
                        {{ items.length }} {{ $t("gen.resultsIn") }} {{ respTime.toFixed(4) }} s
                      </p>
                    </div>
                    <div id="shop-items"
                         class="grid grid-cols-1
                              md:grid-cols-2
                              2xl:grid-cols-3
                              gap-2 pb-16 w-full">
                      <template v-for="item in items" :key="item">
                        <div class="bright_bg dshadow store_item relative w-full rounded-md">
                          <img v-if="store.shiny"
                               :src="getImg(item.iurls[item.iix].url, true)" alt="?"
                               class="absolute w-full h-full opacity-20">
                          <div class="backdrop-blur-3xl
                                      p-2 h-full rounded-md">
                            <template v-if="item.iurls == null || item.iurls.length < 1">
                              <div class="flex flex-col rounded relative">
                                <div class="pb-14 flex justify-center">
                                  <p class="text-xs font-bold text-neutral-400
                                          imagecontainer">
                                    {{ $t("img.no-img") }}
                                  </p>
                                </div>
                              </div>
                            </template>
                            <template v-else>
                              <div class="flex flex-col rounded relative">
                                <div class="pb-14 flex justify-center
                                            bshadow">
                                  <div class="imagecontainer">
                                    <img :src="getImg(item.iurls[item.iix].url, true)" alt="?"
                                         v-on:click="showItemImages(item, item.iix)">
                                  </div>
                                </div>
                                <div class="absolute bottom-0 w-full overflow-hidden">
                                  <div class="flex flex-row justify-center gap-x-1">
                                    <template v-for="(img, index) in item.iurls" :key="img">
                                      <div class="img_index"
                                           :class="{active: index === item.iix}"
                                           v-on:click="item.iix = index">
                                        <p>{{ index + 1 }}</p>
                                      </div>
                                    </template>
                                  </div>
                                  <div class="flex gap-x-1 px-2 py-1 items-baseline">
                                    <p class="text-sm font-bold text-neutral-300">
                                      [{{ item.iix + 1 }}/{{ item.iurls.length }}]
                                    </p>
                                    <p class="text-sm text-neutral-200">
                                      {{ item.iurls[item.iix].t }}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </template>
                            <div class="text-sm text-neutral-300 w-full pt-2">
                              <div class="cursor-pointer
                                          rounded px-2 py-1 w-full"
                                   v-on:click="showItem(item)">
                                <p class="font-bold text-xl lg:text-2xl mb-2 mt-2">
                                  {{ item.t }}
                                </p>
                                <p class="text-sm font-bold">{{ item.desc }}</p>
                              </div>
                              <template v-if="item.attr.length > 0">
                                <div class="border-2 border-neutral-500
                                          p-2 rounded m-2 w-fit">
                                  <table style="margin-bottom: 0">
                                    <template v-for="attribute in item.attr" :key="attribute">
                                      <tr>
                                        <td><p class="px-1 font-bold">
                                          {{ attribute.t }}:
                                        </p></td>
                                        <td><p class="px-1 font-bold">
                                          {{ attribute.sval }}
                                        </p></td>
                                        <td><p class="text-neutral-300 px-1">
                                          {{ attribute.desc }}
                                        </p></td>
                                      </tr>
                                    </template>
                                  </table>
                                </div>
                              </template>
                              <template v-if="item.tvars && item.tvars.length > 0">
                                <div class="m-2 md:flex md:flex-wrap gap-x-4 gap-y-2">
                                  <div v-for="(variation, index) in item.vars" :key="variation">
                                    <Listbox v-model="item.tvars[index].vars[0]">
                                      <div class="relative mt-1">
                                        <ListboxButton
                                          class="dark_bg w-full relative cursor-default rounded-lg py-2 pl-3
                                           min-w-[8rem] bg-opacity-50
                                           pr-10 text-left shadow-md focus:outline-none
                                           border-b-[1px] border-b-neutral-500
                                           focus-visible:ring-2
                                           focus-visible:ring-white
                                           focus-visible:ring-opacity-75
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
                                            <template v-if="item.tvars[index].opt">
                                            <span class="block truncate font-bold text-neutral-300">
                                              ({{ $t("gen.optional") }}) {{ variation.t }}...
                                            </span>
                                            </template>
                                            <template v-else>
                                            <span class="block truncate font-bold text-neutral-300">
                                              {{ $t("gen.select") }} {{ variation.t }}...
                                            </span>
                                            </template>
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
                                            border-neutral-500 px-1 py-1 rounded
                                            dark_bg text-xl text-center">
                                <div class="cursor-pointer border-[1px] h-full
                                      border-neutral-500 px-3 py-1 rounded
                                      dark_bg hover:darkest_bg w-fit
                                      flex items-center justify-between gap-x-2"
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
                                        {{ item.vatp.toFixed(2) * 100 }} % {{ $t("eco.vat") }}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </template>
                <template v-else-if="isLoading">
                  <div class="w-full flex
                            items-center justify-center">
                    <p class="font-bold p-8">
                      {{ $t("eta.loading") }}
                    </p>
                  </div>
                </template>
                <template v-else>
                  <div class="w-full flex
                            items-center justify-center">
                    <p class="font-bold p-8">
                      {{ $t("gen.noResults") }}
                    </p>
                  </div>
                </template>
              </div>
              <template v-if="$store.state.cart && $store.state.cart.length > 0">
                <div>
                  <div v-on:click="showCart"
                       class="cartButton">
                    <ShoppingCartIcon class="h-6 w-6 text-neutral-300 mr-2"/>
                    <p class="text-neutral-300 font-bold">{{ $t("stores.showCart") }}</p>
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
       class="cartSidebar brightest_bg xl:rounded-tl">
    <div class="h-full relative">
      <div class="w-full medium_bg px-3 py-2
                  text-neutral-300
                  flex items-center bshadow
                  absolute top-0 justify-between">
        <p class="text-neutral-300 hidden md:block font-bold">
          {{ $t("stores.shoppingCart") }}
        </p>
        <div class="px-2 py-1 rounded hover:dark_bg
                    text-neutral-300 items-center
                    cursor-pointer flex gap-x-2"
             v-on:click="hideCart()">
          <p class="text-sm">
            {{ $t("stores.continueShopping") }}
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
              {{ $t("gen.clear") }}
            </p>
          </div>
          <div class="btn_bg_primary mb-2"
               v-on:click="cartCheckout()">
            <p class="text-center font-bold">
              {{ $t("stores.proceedCheckout") }}
            </p>
          </div>
          <div class="flex flex-col gap-y-2">
            <div v-for="cartItem in $store.state.cart" :key="cartItem.uid"
                 class="p-2 m-1 rounded bright_bg dshadow">
              <p class="font-bold">{{ cartItem.t }}</p>
              <p class="text-sm">{{ cartItem.desc }}</p>
              <div v-if="cartItem.tvars && cartItem.tvars.length > 0"
                   class="mt-4">
                <p class="italic text-sm my-2">
                  {{ $t("gen.variations") }}:
                </p>
                <template v-for="variation in cartItem.tvars" :key="variation">
                  <div v-if="variation.vars && variation.vars[0] && variation.vars[0].sval"
                       class="flex gap-x-1">
                    <p>* {{ variation.t }}:</p>
                    <p class="font-bold">
                      {{ variation.vars[0].sval }}
                    </p>
                  </div>
                </template>
              </div>
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
                      {{ cartItem.vatp.toFixed(2) * 100 }} % {{ $t("eco.vat") }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="cursor-pointer px-1 rounded mb-2 mt-2
                          dark_bg hover:darkest_bg w-fit"
                   v-on:click="$store.commit('removeFromCart', cartItem)">
                <p class="font-bold text-sm text-neutral-300">
                  {{ $t("stores.removeFromCart") }}
                </p>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="h-full flex items-center justify-center">
            <p>{{ $t("gen.emptyState") }}</p>
          </div>
        </template>
      </div>
    </div>
  </div>
  <modal
    v-show="isViewingImage"
    @close="isViewingImage = false">
    <template v-slot:header>
      <p>{{ $t("img.images") }}</p>
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
  ChevronRightIcon, ChevronUpIcon,
  EyeIcon,
  FunnelIcon,
  ShoppingCartIcon,
  TagIcon
} from '@heroicons/vue/24/solid'
import {
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import {
  Disclosure,
  DisclosureButton, DisclosurePanel,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from '@headlessui/vue'
import modal from '@/components/Modal.vue'

export default {
  name: 'ShopNewView',
  components: {
    DisclosurePanel,
    Disclosure,
    DisclosureButton,
    ChevronUpIcon,
    modal,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    ArrowsUpDownIcon,
    CheckIcon,
    ShoppingCartIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    FunnelIcon,
    BuildingStorefrontIcon,
    TagIcon,
    ChevronRightIcon,
    XMarkIcon
  },
  data () {
    return {
      storeID: '',
      storeSource: '',
      store: null,
      items: [],
      respTime: 0,
      noResults: false,
      isLoading: false,
      isViewingImage: false,
      viewingImageURLs: [],
      viewingImageIndex: 0,
      queryText: '',
      queryMinCost: 0.0,
      queryMaxCost: 0.0,
      sort: {
        byRelevance: true,
        byViews: false,
        byCost: false
      },
      isViewingCart: false,
      filters: null,
      variationQuery: []
    }
  },
  mounted () {
    this.initFunction()
    document.onkeydown = this.handleGlobalKeyEvents
  },
  methods: {
    initFunction: async function () {
      this.storeID = this.$route.params.id
      if (this.$route.query.ref && this.$route.query.ref === 'usr') {
        this.storeSource = 'usr'
      }
      await this.getStore()
      this.getItems('.*')
      this.getFilters()
    },
    getStore: function () {
      return new Promise((resolve) => {
        let endpoint = 'stores/public/get/'
        if (this.storeSource === 'usr') {
          endpoint = 'stores/public/usr/'
        }
        this.$Worker.execute({
          action: 'api-http',
          method: 'get',
          url: endpoint + this.storeID
        })
          .then((data) => {
            this.store = data.result
            this.storeID = this.store.uid
          })
          .then(() => resolve())
          .catch((err) => {
            this.store = null
            console.debug(err.message)
          })
      })
    },
    getItems: function (substitute = null) {
      // Preparations
      this.isLoading = true
      this.noResults = false
      // Check
      if (this.queryMinCost == null || this.queryMinCost === '') {
        this.queryMinCost = 0
      }
      if (this.queryMaxCost == null || this.queryMaxCost === '') {
        this.queryMaxCost = 0
      }
      // Scroll up
      // this.$refs.storeView.scrollTo({
      //   top: 0,
      //   behavior: 'auto'
      // })
      // Query items
      const payload = {
        query: substitute ?? this.queryText,
        minCost: this.queryMinCost,
        maxCost: this.queryMaxCost
      }
      if (payload.query === '') {
        payload.query = '.*'
      }
      if (this.variationQuery.length > 0) {
        payload.vars = this.variationQuery
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
              this.items = []
              this.noResults = true
            }
          })
          .catch((err) => {
            this.items = []
            console.debug(err.message)
          })
          .finally(() => {
            this.isLoading = false
            resolve()
          })
      })
    },
    getFilters: function () {
      // Preparations
      this.filters = []
      // Query filters
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api-http',
          method: 'get',
          url: 'items/public/filters/' + this.store.uid
        })
          .then((data) => {
            this.filters = data.result
            // Conveniently set min and max cost filters
            if (this.filters.min) {
              this.queryMinCost = parseFloat((this.filters.min - 1).toFixed(0))
            }
            if (this.filters.max) {
              this.queryMaxCost = parseFloat((this.filters.max + 1).toFixed(0))
            }
          })
          .catch((err) => {
            console.debug(err.message)
          })
          .finally(() => {
            resolve()
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
      const tmp = this.$store.state.cart.length
      const copy = structuredClone(item)
      // Check if all mandatory variations are being provided
      const valid = this.checkItem(copy)
      if (!valid) {
        this.$notify(
          {
            title: this.$t('gen.error'),
            text: this.$t('stores.err-choose-var'),
            type: 'error'
          })
        return
      }
      // Put item in cart
      this.$store.commit('putInCart', copy)
      this.$notify(
        {
          title: copy.amt + 'x ' + copy.t + ' added to the cart!',
          text: '',
          type: 'info'
        })
      if (tmp === 0) {
        this.showCart()
      }
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
    },
    toggleVariationQuery: function (variation, value, query = true) {
      const removed = this.removeVariationQuery(variation, value, query)
      if (!removed) {
        this.addVariationQuery(variation, value, query)
      }
    },
    addVariationQuery: function (variation, value, query = true) {
      if (this.variationQuery.length < 1) {
        this.variationQuery.push({
          t: variation,
          svals: [value]
        })
        if (query) this.getItems()
        return
      }
      for (let i = 0; i < this.variationQuery.length; i++) {
        if (this.variationQuery[i].t === variation) {
          for (let j = 0; j < this.variationQuery[i].svals.length; j++) {
            if (this.variationQuery[i].svals[j] === value) {
              return
            }
          }
          this.variationQuery[i].svals.push(value)
          if (query) this.getItems()
          return
        }
      }
      this.variationQuery.push({
        t: variation,
        svals: [value]
      })
      if (query) this.getItems()
    },
    removeVariationQuery: function (variation, value, query = true) {
      if (this.variationQuery.length < 1) {
        return false
      }
      for (let i = 0; i < this.variationQuery.length; i++) {
        if (this.variationQuery[i].t === variation) {
          for (let j = 0; j < this.variationQuery[i].svals.length; j++) {
            if (this.variationQuery[i].svals[j] === value) {
              this.variationQuery[i].svals.splice(j, 1)
              if (this.variationQuery[i].svals.length < 1) {
                this.variationQuery.splice(i, 1)
              }
              if (query) this.getItems()
              return true
            }
          }
        }
      }
      return false
    },
    checkItem: function (item) {
      if (item.vars.length < 1) return true
      // Iterate over all variations
      for (let i = 0; i < item.vars.length; i++) {
        // Find mandatory variations
        if (item.vars[i].opt !== true) {
          // Not optional -> Check if provided
          for (let j = 0; j < item.tvars.length; j++) {
            if (item.tvars[j].t === item.vars[i].t) {
              // Main variation found -> Check for sub variation
              if (item.tvars[j].vars && item.tvars[j].vars[0] &&
                item.tvars[j].vars[0].sval != null && item.tvars[j].vars[0].sval !== '') {
                console.log(item.tvars[j].vars[0].sval)
                return true
              }
            }
          }
          return false
        }
      }
      return false
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
  @apply rounded-b px-2 py-1
  medium_bg hover:dark_bg
  cursor-pointer flex
  border-l-[4px]
  border-l-orange-600
  fixed top-[55px] right-[20px]
  dshadow;
}

</style>
