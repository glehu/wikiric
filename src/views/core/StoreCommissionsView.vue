<template>
  <div class="flex w-full h-full pt-[55px] justify-center">
    <div class="max-w-screen-xl w-full bright_bg
                rounded-t overflow-x-hidden
                overflow-y-auto">
      <div class="px-4 py-3 medium_bg bshadow z-10">
        <p class="text-3xl font-bold text-neutral-300">Inventory</p>
      </div>
      <div class="pt-2 z-0 relative">
        <template v-if="ownStore != null">
          <div class="w-full h-full p-2 pb-16">
            <div class="rounded medium_bg w-fit mx-2 mb-4
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
            </div>
            <div class="rounded medium_bg w-fit mx-2 mb-4
                      overflow-hidden dshadow">
              <template v-if="items.length < 1">
                <div class="flex items-center dark_bg px-3 py-1 cursor-default">
                  <p class="text-neutral-300">
                    No items available!
                  </p>
                </div>
                <p class="text-sm text-neutral-300 px-3 py-1 my-2 cursor-default">
                  Add an item to get started!
                </p>
              </template>
              <template v-else>
                <div class="flex items-center dark_bg px-3 py-1 cursor-default">
                  <p class="text-neutral-300">
                    {{ items.length }} items listed!
                  </p>
                </div>
                <p class="text-sm text-neutral-300 px-3 py-1 my-2 cursor-default">
                  Add or modify items.
                </p>
              </template>
              <div class="rounded w-fit m-3 cursor-pointer
                        dark_bg hover:darkest_bg
                        px-4 py-2 border-[1px] border-neutral-600"
                   v-on:click="isModifyingItem = true">
                <p class="font-bold">Add an Item</p>
              </div>
            </div>
            <template v-if="items.length > 0">
              <div class="m-2 flex flex-col gap-y-4">
                <template v-for="item in items" :key="item">
                  <div class="medium_bg p-2 rounded dshadow store_item relative
                              max-w-[750px]">
                    <div class="flex gap-x-2">
                      <template v-if="item.iurls == null || item.iurls.length < 1">
                        <div class="min-w-[8rem] min-h-[8rem]
                                    md:min-w-[12rem] md:min-h-[12rem]
                                    lg:min-w-[14rem] lg:min-h-[14rem]
                                    xl:min-w-[16rem] xl:min-h-[16rem]
                                    max-w-[8rem] max-h-[8rem]
                                    md:max-w-[12rem] md:max-h-[12rem]
                                    lg:max-w-[14rem] lg:max-h-[14rem]
                                    xl:max-w-[16rem] xl:max-h-[16rem]
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
                            <div class="flex flex-row justify-center gap-x-1">
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
                                  <td><p class="text-neutral-400 text-xs px-1">
                                    {{ attribute.desc }}
                                  </p></td>
                                </tr>
                              </template>
                            </table>
                          </div>
                        </template>
                        <template v-if="item.tvars && item.tvars.length > 0">
                          <div class="m-2 flex gap-x-4">
                            <div v-for="(variation, index) in item.vars" :key="variation">
                              <Listbox v-model="item.tvars[index].vars[0]">
                                <div class="relative mt-1">
                                  <ListboxButton
                                    class="dark_bg w-full relative cursor-default rounded-lg py-2 pl-3
                                           min-w-[8rem] bg-opacity-50
                                           pr-10 text-left shadow-md focus:outline-none
                                           focus-visible:border-indigo-500 focus-visible:ring-2
                                           focus-visible:ring-white focus-visible:ring-opacity-75
                                           focus-visible:ring-offset-2
                                           focus-visible:ring-offset-orange-300 sm:text-sm"
                                  >
                                    <template v-if="item.tvars[index].vars != null && item.tvars[index].vars[0].sval ">
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
                               v-on:click="orderItem(item)">
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
                      <Menu as="div" class="relative inline-block text-left h-full">
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
                                <button v-on:click="editItem(item)"
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
                              <MenuItem v-slot="{ active }">
                                <button v-on:click="deleteItem(item.uid)"
                                        :class="[active
                                      ? 'p_card_menu_active'
                                      : 'text-neutral-900','group p_card_menu_item']">
                                  <TrashIcon
                                    :active="active"
                                    class="mr-2 h-5 w-5"
                                    aria-hidden="true"
                                  />
                                  Delete
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
          </div>
        </template>
      </div>
    </div>
  </div>
  <modal @close="isModifyingItem = false"
         v-show="isModifyingItem">
    <template v-slot:header>
      <span class="text-xl font-bold">Modify Item</span>
    </template>
    <template v-slot:body>
      <div class="p-2 w-full h-full overflow-hidden min-w-[clamp(300px,500px,92dvw)]">
        <p class="text-sm mb-1 font-bold">Product Description</p>
        <div class="rounded-lg flex items-center relative mb-1">
          <input id="modName" ref="modName" type="text"
                 class="search-field py-5 px-4 dark_bg h-8
                        border-2 border-zinc-700
                        placeholder-neutral-400"
                 placeholder="Name..."
                 v-model="modItem.t">
        </div>
        <textarea type="text" id="modDesc" ref="modDesc"
                  v-model="modItem.desc" rows="4"
                  placeholder="Description..."
                  class="search-field py-2 px-4 dark_bg
                         border-2 border-zinc-700 text-sm
                         placeholder-neutral-400"></textarea>
        <p class="text-sm mb-1 font-bold">Images</p>
        <div class="w-full min-h-[60px] p-2 rounded medium_bg flex
                    overflow-x-scroll gap-x-4 mb-2">
          <template v-if="modItem.iurls && modItem.iurls.length > 0">
            <div v-for="(img, index) in modItem.iurls" :key="img"
                 class="flex flex-col">
              <div class="min-w-[8rem] min-h-[8rem]
                          md:min-w-[12rem] md:min-h-[12rem]
                          max-w-[8rem] max-h-[8rem]
                          md:max-w-[12rem] md:max-h-[12rem]
                          flex items-start justify-center">
                <img :src="getImg(img.url, true)" alt="?"
                     v-on:click="showItemImages(modItem, index)">
              </div>
              <p class="text-sm">{{ img.t }}</p>
            </div>
          </template>
          <div class="rounded p-4 border-2 border-dashed flex
                      items-center justify-center cursor-pointer
                      hover:dark_bg"
               v-on:click="isAddingMedia = true">
            <p class="font-bold text-sm">Add Image</p>
          </div>
        </div>
        <p class="text-sm mb-1 font-bold">Attributes</p>
        <div class="rounded medium_bg p-1 mb-2">
          <table class="">
            <tr class="text-sm">
              <th class="text-neutral-300">
                Name (e.g. Weight)
              </th>
              <th class="text-neutral-300">
                Value (e.g. 2)
              </th>
              <th class="text-neutral-300">
                Description (e.g. kg)
              </th>
              <th></th>
            </tr>
            <template v-for="(attribute, index) in modItem.attr" :key="attribute">
              <tr>
                <td>
                  <input type="text" name="mod_attr_t"
                         class="search-field py-1 px-2 dark_bg
                                border-2 border-zinc-700 text-sm
                                placeholder-neutral-400"
                         v-model="attribute.t">
                </td>
                <td>
                  <input type="text" name="mod_attr_sval"
                         class="search-field py-1 px-2 dark_bg
                      border-2 border-zinc-700 text-sm
                      placeholder-neutral-400"
                         v-model="attribute.sval">
                </td>
                <td>
                  <input type="text" name="mod_attr_desc"
                         class="search-field py-1 px-2 dark_bg
                      border-2 border-zinc-700 text-sm
                      placeholder-neutral-400"
                         v-model="attribute.desc">
                </td>
                <td>
                  <p class="text-sm font-bold px-2 py-1 dark_bg
                            hover:darkest_bg cursor-pointer
                            rounded w-fit"
                     v-on:click="removeAttribute(index)">
                    X
                  </p>
                </td>
              </tr>
            </template>
          </table>
          <div class="flex justify-end">
            <p class="text-sm font-bold px-2 py-1 dark_bg
                      hover:darkest_bg cursor-pointer
                      rounded w-fit"
               v-on:click="addAttribute()">
              Add
            </p>
          </div>
        </div>
        <p class="text-sm mb-1 font-bold">Variations</p>
        <div class="rounded medium_bg p-1 mb-2 w-full">
          <table class="table-auto w-full">
            <tr class="text-sm w-full">
              <th class="text-neutral-300">
                Type (e.g. Size)
              </th>
              <th></th>
              <th class="text-neutral-300 w-1/2">
                Values (e.g. S, M, L, XL)
              </th>
            </tr>
            <template v-for="(variations, index) in modItem.vars" :key="variations">
              <tr class="w-full align-top">
                <td>
                  <input type="text" name="mod_attr_t"
                         class="search-field py-1 px-2 dark_bg
                                border-2 border-zinc-700 text-sm
                                placeholder-neutral-400"
                         v-model="variations.t">
                </td>
                <td>
                  <p class="text-sm font-bold px-2 py-1 dark_bg
                            hover:darkest_bg cursor-pointer
                            rounded w-fit"
                     v-on:click="removeVariation(index)">
                    X
                  </p>
                </td>
                <td class="w-1/2">
                  <div class="rounded bright_bg p-1 mb-2 w-full">
                    <table class="table-auto">
                      <tr>
                        <th></th>
                        <th></th>
                      </tr>
                      <template v-for="(variation, indexVarVar) in variations.vars" :key="variation">
                        <tr>
                          <td>
                            <input type="text" name="mod_attr_t"
                                   class="search-field py-1 px-2 dark_bg
                                          border-2 border-zinc-700 text-sm
                                          placeholder-neutral-400"
                                   v-model="variation.sval">
                          </td>
                          <td>
                            <p class="text-sm font-bold px-2 py-1 dark_bg
                            hover:darkest_bg cursor-pointer
                            rounded w-fit"
                               v-on:click="removeVarVariation(index, indexVarVar)">
                              X
                            </p>
                          </td>
                        </tr>
                      </template>
                    </table>
                    <div class="flex justify-end">
                      <p class="text-sm font-bold px-2 py-1 dark_bg
                      hover:darkest_bg cursor-pointer
                      rounded w-fit"
                         v-on:click="addVarVariation(index)">
                        Add
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </table>
          <div class="flex justify-end">
            <p class="text-sm font-bold px-2 py-1 dark_bg
                      hover:darkest_bg cursor-pointer
                      rounded w-fit"
               v-on:click="addVariation()">
              Add
            </p>
          </div>
        </div>
        <p class="text-sm mb-1 font-bold">Pricing</p>
        <div class="flex gap-x-2 items-center mb-1">
          <input type="number" name="mod_net" id="mod_net"
                 class="search-field py-2 px-4 dark_bg
                      border-2 border-zinc-700 text-sm
                      placeholder-neutral-400"
                 v-model="modItem.net"
                 style="width: 8rem"
                 min="0">
          <p class="w-1/2">€ gross</p>
        </div>
        <div class="flex gap-x-2 items-center">
          <input type="number" name="mod_net" id="mod_net"
                 class="search-field py-2 px-4 dark_bg
                        border-2 border-zinc-700 text-sm
                        placeholder-neutral-400"
                 v-model="modItem.vatp"
                 style="width: 8rem"
                 min="0" step="0.01">
          <p class="w-1/2 text-sm">
            VAT = {{ modItem.vatp * 100 }} %
          </p>
        </div>
        <p class="ml-1 text-neutral-200">
          = {{ modItemNet }} € net
        </p>
        <div class="btn_bg_primary w-fit mt-4"
             v-on:click="modifyItem()">
          <p>Submit</p>
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
             multiple v-on:change="handleUploadFileSelect"/>
      <input type="text"
             class="search-field py-1 px-2 dark_bg
                    border-2 border-zinc-700 text-sm
                    placeholder-neutral-400"
             v-model="uploadFileMeta">
      <template v-if="uploadFileBase64 !== ''">
        <p class="text-neutral-300 font-bold">{{ uploadFileName }}</p>
        <div class="mt-3 w-full">
          <template v-if="uploadFileType.includes('image')">
            <button class="darkbutton text-white p-2 w-full flex items-center justify-center rounded-full"
                    style="height: 2.5em;
                           border-color: transparent; margin: auto"
                    title="Send"
                    v-on:click="setImageMode">
              <span class="font-bold flex"><i class="bi bi-send mr-2"></i>Add Image</span>
              <span style="margin-left: 10px" class="c_lightgray text-xs"> {{ uploadFileType }}</span>
            </button>
          </template>
          <template v-else>
            <div class="text-white p-2 w-full flex items-center justify-center rounded-full
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
import modal from '@/components/Modal.vue'
import { SquaresPlusIcon } from '@heroicons/vue/24/outline'
import { ArrowsUpDownIcon, CheckIcon, PencilSquareIcon, ShoppingCartIcon, TrashIcon } from '@heroicons/vue/24/solid'
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

export default {
  name: 'StoreInventoryView',
  components: {
    ListboxOption,
    ListboxOptions,
    ListboxButton,
    Listbox,
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    TrashIcon,
    SquaresPlusIcon,
    PencilSquareIcon,
    ShoppingCartIcon,
    modal,
    ArrowsUpDownIcon,
    CheckIcon
  },
  data () {
    return {
      ownStore: null,
      orders: [],
    }
  },
  mounted () {
    this.initFunction()
  },
  methods: {
    initFunction: async function () {
      await this.getOwnStore()
      await this.getOrders()
    },
    getOwnStore: function () {
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
    getOrders: function () {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'orders/private/commissions/' + this.ownStore.uid
        })
          .then((data) => {
            this.orders = data.result.orders
            console.log(this.orders)
          })
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
      })
    }
  },
  computed: {}
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

.store_item_edit_overlay {
  opacity: 0;
}

.store_item:hover .store_item_edit_overlay {
  opacity: 1;
}

</style>
