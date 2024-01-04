<template>
  <div class="flex w-full h-full pt_nav justify-center">
    <template v-if="store != null">
      <div ref="storeView"
           class="w-full overflow-x-hidden overflow-y-scroll relative background">
        <div class="w-full relative">
          <div class="w-full overflow-hidden relative surface-variant bshadow z-10">
            <div class="p-4 flex justify-center">
              <div class="w-full flex flex-col md:flex-row gap-4 md:items-center">
                <template v-if="store.iurl == null || store.iurl === ''">
                  <BuildingStorefrontIcon
                    class="h-20 w-20 "/>
                </template>
                <template v-else>
                  <img :src="getImg(store.iurl, true)" alt="?"
                       class="object-contain w-[176px] max-h-[176px] rounded-md">
                </template>
                <div class="ml-2 md:ml-4">
                  <p class="font-bold text-3xl md:text-4xl lg:text-5xl mb-2 ">
                    {{ store.t }}
                  </p>
                  <p class="">
                    {{ store.desc }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-center">
            <div class="w-full lg:flex">
              <div id="shop-sidebar"
                   class="lg:sticky lg:top-0 h-fit pt-4 px-2 rounded-b-lg background">
                <div class="rounded-lg flex items-center relative pl-2 pr-4
                            max-w-[552px] w-full">
                  <MagnifyingGlassIcon class="w-6 h-6 mx-2 absolute translate-x-1"/>
                  <input id="search-field" type="text"
                         class="search-field py-6 pl-10 pr-4 w-full h-8
                                surface on-surface-text bshadow"
                         style="border: 1px solid var(--md-sys-color-outline-variant)"
                         placeholder="Search..."
                         v-on:keyup.enter="getItems()"
                         v-model="queryText">
                </div>
                <div class="max-w-[550px] xl:max-w-[350px] pb-2
                            rounded overflow-hidden">
                  <div class="p-2">
                    <p class="w-full pb-1 text-sm
                              font-bold">
                      {{ $t("eco.pricing") }}
                    </p>
                    <div class="flex gap-x-2 relative items-center pr-2 w-full">
                      <div class="search-field surface w-full text-sm">
                        <p class="ml-2 mt-1 text-xs">Min</p>
                        <span class="absolute py-2 pl-3">€</span>
                        <input type="number" id="minCost"
                               v-model="queryMinCost"
                               v-on:keyup.enter="getItems()"
                               placeholder="Min"
                               class="py-2 pl-7 pr-4
                                      surface on-surface-text">
                      </div>
                      <div class="search-field surface w-full text-sm">
                        <p class="ml-2 mt-1 text-xs">Max</p>
                        <span class="absolute py-2 pl-3">€</span>
                        <input type="number" id="maxCost"
                               v-model="queryMaxCost"
                               v-on:keyup.enter="getItems()"
                               placeholder="Max"
                               class="py-2 pl-7 pr-4
                                      surface on-surface-text">
                      </div>
                    </div>
                    <p class="w-full mt-2 pb-1 text-sm
                              font-bold">
                      {{ $t("gen.sortBy") }}
                    </p>
                    <div class="flex gap-x-2 relative w-full pr-2">
                      <div class="metaTag cursor-pointer w-full" :class="{active: sort.byRelevance}"
                           v-on:click="sortResults('relevance')">
                        <div class="flex items-center">
                          <FunnelIcon class="h-4 w-4 mr-2"/>
                          <p class="text-xs font-bold">
                            {{ $t("gen.relevance") }}
                          </p>
                        </div>
                      </div>
                      <div class="metaTag cursor-pointer w-full" :class="{active: sort.byViews}"
                           v-on:click="sortResults('views')">
                        <div class="flex items-center">
                          <EyeIcon class="h-4 w-4 mr-2"/>
                          <p class="text-xs font-bold">
                            {{ $t("gen.views") }}
                          </p>
                        </div>
                      </div>
                      <div class="metaTag cursor-pointer w-full" :class="{active: sort.byCost}"
                           v-on:click="sortResults('cost')">
                        <div class="flex items-center">
                          <TagIcon class="h-4 w-4 mr-2"/>
                          <p class="text-xs font-bold">
                            {{ $t("gen.cost") }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <template v-if="filters && filters.vars && filters.vars.length > 0">
                      <p class="w-full mt-2 pb-1 text-sm
                                font-bold">
                        {{ $t("gen.variations") }}
                      </p>
                      <div class="pr-2 flex items-start flex-col gap-y-2 w-full
                                  max-h-[calc(50vh)] overflow-y-auto pb-2">
                        <template v-for="variation in filters.vars" :key="variation.t">
                          <template v-if="variation.vars">
                            <Disclosure v-slot="{ open }" as="div"
                                        :default-open="true"
                                        class="flex flex-wrap items-center
                                               rounded-xl w-full surface">
                              <DisclosureButton
                                class="btn_disclosure rounded-lg w-full m-1">
                                <p class="text-sm font-bold rounded-lg">
                                  {{ variation.t }}
                                </p>
                                <ChevronUpIcon
                                  :class="open ? 'rotate-180 transform' : ''"
                                  class="h-5 w-5"
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
                                         class="metaTag cursor-pointer variTag" style="margin: 0 !important"
                                         :class="{active: checkActiveVariation(variation.t, subVariation.sval)}"
                                         v-on:click="toggleVariationQuery(variation.t, subVariation.sval)">
                                      <p class="text-sm">
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
              <div class="w-full px-4 pt-4">
                <template v-if="variationQuery.length > 0">
                  <div class="flex flex-wrap gap-2 w-fit mb-4">
                    <div v-for="variation in variationQuery" :key="variation.t"
                         class="p-1 surface-variant bshadow flex flex-wrap rounded">
                      <p class="text-sm font-bold px-2 py-1 surface w-fit rounded mr-2">
                        {{ variation.t }}:
                      </p>
                      <div class="flex flex-wrap items-center gap-2 divide-x divide-neutral-500">
                        <div v-for="subVariation in variation.svals" :key="subVariation"
                             class="px-2 py-1 hover:primary cursor-pointer flex gap-x-3 items-center"
                             v-on:click="removeVariationQuery(variation.t, subVariation)">
                          <XMarkIcon class="h-4 w-4  ml-2"/>
                          <p class="text-sm font-bold">{{ subVariation }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-if="items.length > 0">
                  <div class="w-full">
                    <div class="metaTag pointer-events-none mb-4">
                      <p class="text-sm">
                        {{ items.length }} {{ $t("gen.resultsIn") }} {{ respTime.toFixed(4) }} s
                      </p>
                    </div>
                    <div id="shop-items"
                         class="flex flex-col xl:grid xl:grid-cols-2
                                gap-2 pb-52 w-full pr-2">
                      <template v-for="item in items" :key="item">
                        <div class="surface store_item rounded-md flex-grow w-full
                                    md:max-w-2xl lg:max-w-7xl"
                             style="border: 1px solid var(--md-sys-color-outline-variant)">
                          <div class="p-2 h-full rounded-md
                                      flex flex-col
                                      md:flex-row xl:flex-col 2xl:flex-row
                                      gap-2 lg:gap-x-4">
                            <template v-if="item.iurls == null || item.iurls.length < 1">
                              <div class="flex flex-col rounded relative pl-1 pt-1 pr-1">
                                <div class="pb-14 flex justify-center">
                                  <p class="text-xs font-bold
                                            imagecontainer">
                                    {{ $t("img.no-img") }}
                                  </p>
                                </div>
                              </div>
                            </template>
                            <template v-else>
                              <div class="flex flex-col rounded relative w-full lg:w-fit">
                                <div class="pb-16 flex justify-center
                                            rounded overflow-hidden relative surface">
                                  <div class="store_image">
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
                                  <div class="flex gap-x-1 px-2 py-1 items-baseline w-fit m-1 rounded
                                              surface-variant">
                                    <p class="text-sm font-bold ">
                                      [{{ item.iix + 1 }}/{{ item.iurls.length }}]
                                    </p>
                                    <p class="text-sm ">
                                      {{ item.iurls[item.iix].t }}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </template>
                            <div class="text-sm w-full pt-2 xl:pt-0
                                        flex flex-col h-full gap-y-2">
                              <div class="cursor-pointer
                                          rounded px-2 py-1 w-full"
                                   v-on:click="showItem(item)">
                                <p class="font-bold text-xl lg:text-2xl
                                          mb-2 mt-2 xl:mt-0 ">
                                  {{ item.t }}
                                </p>
                                <p class="max-w-[90%]">
                                  {{ item.desc }}
                                </p>
                              </div>
                              <template v-if="item.attr.length > 0">
                                <div class="m-2">
                                  <div class="w-fit surface bshadow rounded p-2">
                                    <table style="margin-bottom: 0 !important;"
                                           class="divide-y divide-neutral-500">
                                      <template v-for="attribute in item.attr" :key="attribute">
                                        <tr>
                                          <td><p class="pr-1 ">
                                            {{ attribute.t }}:
                                          </p></td>
                                          <td><p class="px-1 ">
                                            {{ attribute.sval }}
                                            <br>
                                            <span class="text-xs">
                                              {{ attribute.desc }}
                                            </span>
                                          </p></td>
                                        </tr>
                                      </template>
                                    </table>
                                  </div>
                                </div>
                              </template>
                              <template v-if="item.tvars && item.tvars.length > 0">
                                <p class="w-full px-2 text-sm text-end xl:text-start
                                         ">
                                  {{ $t("gen.variations") }}
                                </p>
                                <div class="mx-2 flex flex-row flex-wrap
                                            justify-end xl:justify-start
                                            gap-x-4 gap-y-2 ml-auto xl:ml-0">
                                  <div v-for="(variation, index) in item.vars" :key="variation">
                                    <Listbox v-model="item.tvars[index].vars[0]">
                                      <div class="relative mb-1 ml-2">
                                        <ListboxButton
                                          class="background
                                                 w-full relative cursor-default rounded-lg py-2 pl-3
                                                 min-w-[12rem]
                                                 pr-10 text-left shadow-md focus:outline-none
                                                 border-b-[1px] border-b-neutral-400
                                                 focus-visible:ring-2
                                                 focus-visible:ring-white
                                                 focus-visible:ring-opacity-75
                                                 focus-visible:ring-offset-2
                                                 focus-visible:ring-offset-orange-300 sm:text-sm"
                                        >
                                          <template
                                            v-if="item.tvars[index].vars != null && item.tvars[index].vars[0].sval ">
                                            <div class="block truncate">
                                              {{ variation.t }}: {{ item.tvars[index].vars[0].sval }}
                                            </div>
                                          </template>
                                          <template v-else>
                                            <template v-if="item.tvars[index].opt">
                                              <span class="block truncate">
                                                ({{ $t("gen.optional") }}) {{ variation.t }}...
                                              </span>
                                            </template>
                                            <template v-else>
                                              <span class="block truncate">
                                                {{ $t("gen.select") }} {{ variation.t }}...
                                              </span>
                                            </template>
                                          </template>
                                          <div
                                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ArrowsUpDownIcon class="h-5 w-5" aria-hidden="true"/>
                                          </div>
                                        </ListboxButton>
                                        <transition
                                          leave-active-class="transition duration-100 ease-in"
                                          leave-from-class="opacity-100"
                                          leave-to-class="opacity-0">
                                          <ListboxOptions
                                            class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md
                                               background py-1 text-base shadow-lg ring-1 ring-black
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
                                                :class="[ active ? 'primary-container' : '',
                                  'relative cursor-pointer select-none py-2 pl-10 pr-4' ]">
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
                              <div class="flex items-center gap-x-2 m-2 mt-auto h-14 ml-auto xl:ml-2">
                                <input type="number" min="0" v-model="item.amt"
                                       class="surface w-[5rem] h-full
                                              px-1 py-1 rounded
                                              text-xl text-center"
                                       style="border: 1px solid var(--md-sys-color-outline);">
                                <div class="primary-container cursor-pointer h-full
                                            px-3 py-1 rounded w-fit
                                            hover:primary hover:dshadow
                                            flex items-center justify-between gap-x-2"
                                     style="border: 1px solid var(--md-sys-color-primary);"
                                     v-on:click="addToCart(item)">
                                  <ShoppingCartIcon class="h-8 w-8"/>
                                  <div>
                                    <p class="text-xl font-bold ">
                                      {{ ((item.net * (item.vatp + 1)) * item.amt).toFixed(2) }} €
                                    </p>
                                    <div class="flex items-center text-xs gap-x-2">
                                      <p class="">
                                        {{ item.net.toFixed(2) }}&nbsp;€
                                      </p>
                                      <p class="">
                                        {{ item.vatp.toFixed(2) * 100 }}&nbsp;%&nbsp;{{ $t("eco.vat") }}
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
                       class="cartButton primary">
                    <ShoppingCartIcon class="h-6 w-6 mr-2"/>
                    <p class="font-bold">{{ $t("stores.showCart") }}</p>
                    <div class="translate-y-6
                                primary bshadow
                                px-1.5 py-0.5 rounded-full"
                         style="border: 2px solid var(--md-sys-color-primary-container)">
                      <p class="font-bold text-xs on-primary-text">
                        {{ $store.state.cart.length }}
                      </p>
                    </div>
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
       style="margin-top: 50px; box-shadow: 1px 0 4px 1px rgb(40 40 43)"
       class="cartSidebar background xl:rounded-tl">
    <div class="h-full relative">
      <div class="w-full surface px-3 py-2
                  flex items-center bshadow
                  absolute top-0 justify-between">
        <p class=" hidden md:block font-bold">
          {{ $t("stores.shoppingCart") }}
        </p>
        <div class="px-2 py-1 rounded hover:surface-variant
                    hover:dshadow
                     items-center
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
          <div class="btn_bg_primary mb-2"
               v-on:click="cartCheckout()">
            <p class="text-center font-bold">
              {{ $t("stores.proceedCheckout") }}
            </p>
          </div>
          <div class="flex flex-col gap-y-2">
            <div v-for="cartItem in $store.state.cart" :key="cartItem.uid"
                 class="p-2 m-1 rounded surface bshadow">
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
                       class="w-[5rem] px-3 py-1 rounded
                              surface-variant text-xl"
                       style="border: 1px solid var(--md-sys-color-outline-variant)">
                <div>
                  <p class="text-xl font-bold">
                    {{ ((cartItem.net * (cartItem.vatp + 1)) * cartItem.amt).toFixed(2) }} €
                  </p>
                  <div class="flex items-center text-xs gap-x-2">
                    <p class="">
                      {{ cartItem.net.toFixed(2) }} €
                    </p>
                    <p class="">
                      {{ cartItem.vatp.toFixed(2) * 100 }} % {{ $t("eco.vat") }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="cursor-pointer px-1 rounded mb-2 mt-4 ml-2 w-fit bshadow surface"
                   v-on:click="$store.commit('removeFromCart', cartItem)">
                <p class="font-bold text-sm">
                  {{ $t("stores.removeFromCart") }}
                </p>
              </div>
            </div>
          </div>
          <div class="cursor-pointer px-1 rounded mb-2 mt-4 ml-2 w-fit bshadow surface"
               v-on:click="$store.commit('clearCart')">
            <p class="font-bold text-sm">
              {{ $t("gen.clear") }}
            </p>
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
           class="background overflow-hidden w-full h-full p-1 relative">
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
                <p class="">{{ index + 1 }}</p>
              </div>
            </template>
          </div>
          <div class="flex gap-x-1 px-2 pt-1 pb-2">
            <p class="text-sm">
              [{{ viewingImageIndex + 1 }}/{{ viewingImageURLs.length }}]
            </p>
            <p class="text-sm">
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
      variationQuery: [],
      variationMap: new Map()
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
          type: 'fmt_notify'
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
        // Add to map too
        this.variationMap.set(`${variation}:${value}`, true)
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
          // Add to map too
          this.variationMap.set(`${variation}:${value}`, true)
          if (query) this.getItems()
          return
        }
      }
      this.variationQuery.push({
        t: variation,
        svals: [value]
      })
      // Add to map too
      this.variationMap.set(`${variation}:${value}`, true)
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
              // Remove subvariation value
              this.variationQuery[i].svals.splice(j, 1)
              // Remove from map too
              this.variationMap.delete(`${variation}:${value}`)
              // Remove whole variation if there are no values anymore
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
    },
    checkActiveVariation: function (variation, subvariation) {
      return this.variationMap.has(`${variation}:${subvariation}`)
    }
  }
}
</script>

<style>

.search-field {
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
  position: absolute;
  z-index: 100;
  bottom: 0;
  right: 0;
  overflow-x: clip;
  overflow-y: scroll;
  transition: ease-in-out all 0.2s;
  float: right;
  @apply h_full_nav;
}

.cartSidebar.active {
  min-width: 350px;
  opacity: 1;
}

.cartButton {
  @apply rounded-b pl-4 py-4
  cursor-pointer flex z-50
  fixed bottom-[30px] right-[40px]
  dshadow rounded-md;
  background-color: var(--md-sys-color-primary-container);
  border: 1px solid var(--md-sys-color-primary);
}

.cartButton:hover {
  @apply primary;
}

.variTag.active {
  @apply primary;
}

.store_image {
  @apply min-w-[16rem] min-h-[16rem]
  max-w-[16rem] max-h-[16rem]
  lg:min-w-[14rem] lg:min-h-[14rem]
  lg:max-w-[14rem] lg:max-h-[14rem]
  flex items-center justify-center overflow-hidden
  p-1;
}

</style>
