<template>
  <div class="header-margin shadow-xl"/>
  <template v-if="knowledgeExists">
    <div class=""
         style="min-height: calc(100vh - 60px)">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full bg-neutral-900 h-full">
        <div class="border-r border-neutral-700 h-full sm:h-[calc(100vh-60px)]"
             :style="{
                backgroundImage: 'url('+require('@/assets/'+'account/pexels-anni-roenkae-2156881.jpg')+')',
                backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }">
          <div class="backdrop-blur-2xl backdrop-brightness-75 h-full relative">
            <div class="py-1 shadow rounded-none">
              <div class="flex items-center">
                <div v-on:click="$router.back()"
                     class="h-full ml-4 mr-2 px-2 py-4 rounded-xl text-center text-gray-300 hover:text-orange-500 cursor-pointer">
                  <ArrowLeftOnRectangleIcon
                    class="h-8 w-8"></ArrowLeftOnRectangleIcon>
                </div>
                <div class="font-bold w-full overflow-x-hidden mr-2">
                  <div class="py-4 px-2 text-gray-100 pointer-events-none">
                    <div class="text-5xl border-l border-gray-300 pl-5">
                      {{ this.knowledge.t }}
                    </div>
                    <div class="border-l border-gray-300 pl-5 text-gray-300">
                      {{ this.knowledge.desc }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="shadow py-4 backdrop-brightness-75">
              <div class="px-4 py-2 rounded-lg flex items-center">
                <MagnifyingGlassIcon class="w-12 h-12 mx-1 text-gray-200"></MagnifyingGlassIcon>
                <input id="search-field" type="text"
                       class="search-field py-4 bg-neutral-900 h-8 ml-2 text-lg border-2 border-neutral-800"
                       placeholder="Search..."
                       v-on:keyup.enter="searchWisdom()"
                       v-model="queryText">
              </div>
              <div class="px-4 py-2 flex items-center">
                <div class="flex overflow-x-scroll overflow-y-hidden pb-3">
                  <template v-for="category in this.knowledge.categories" :key="category">
                    <div
                      class="font-bold text-gray-200 backdrop-brightness-75 cursor-pointer mr-3 flex items-center py-1 border-2 border-gray-500 rounded-full hover:border-gray-100 hover:text-gray-100"
                      style="min-width: 150px; max-width: 200px">
                      <div class="text-center w-100">
                        <div> {{ category.category }}</div>
                      </div>
                    </div>
                  </template>
                  <div
                    class="font-bold text-gray-200 backdrop-brightness-50 cursor-pointer mr-3 flex items-center py-1 border-2 border-dashed border-gray-500 rounded-full hover:border-gray-100 hover:text-gray-100"
                    style="min-width: 150px; max-width: 200px"
                    v-on:click="this.isAddingCategory = true">
                    <div class="text-center w-100">
                      <i class="bi bi-plus-circle-dotted lead"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- QUICK VIEW -->
            <div class="mt-2 p-2 pt-4 pb-4 sm:absolute sm:bottom-0 sm:w-full">
              <div class="flex">
                <button
                  class="border-orange-600 hover:border-orange-400 hover:bg-orange-600 border-2 rounded-xl py-1 px-2 text-xl text-gray-200 hover:text-gray-200 mr-3 w-1/2 backdrop-brightness-75">
                  <i class="bi bi-question-lg mr-2"></i>
                  Ask
                </button>
                <button v-on:click="writeLesson()"
                        class="border-indigo-600 hover:border-indigo-400 hover:bg-indigo-600 border-2 rounded-xl py-1 px-2 text-xl text-gray-200 hover:text-gray-200 w-1/2 backdrop-brightness-75">
                  <i class="bi bi-lightbulb small mr-2"></i>
                  Teach
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- RESULTS -->
        <div class="md:col-span-2 pt-2 overflow-y-scroll overflow-x-hidden md:max-h-[calc(100vh-120px)]">
          <template v-if="emptyState">
            <div class="flex w-full justify-content-center items-center text-gray-300 pointer-events-none p-3 md:mt-10">
              <MagnifyingGlassIcon class="h-16 w-16 mr-4"></MagnifyingGlassIcon>
              <p>Search to get some results!</p>
            </div>
          </template>
          <template v-if="noResults">
            <div class="flex w-full justify-content-center items-center text-gray-300 p-3 md:mt-10">
              <div>
                <p class="pointer-events-none text-center">No Results for...</p>
                <p class="text-gray-400 text-center"> {{ this.querySubmission }} </p>
                <p class="text-gray-400 pointer-events-none mt-3 text-center border-t border-t-gray-400 pt-3">
                  Ask a question or teach people!
                </p>
                <div class="mt-2">
                  <div class="flex">
                    <button
                      class="border-orange-600 hover:border-orange-400 hover:bg-orange-600 border-2 rounded-xl py-1 px-2 text-xl text-gray-300 hover:text-gray-200 w-1/2">
                      <i class="bi bi-question-lg mr-2"></i>
                      Ask
                    </button>
                    <button v-on:click="writeLesson()"
                            class="border-indigo-600 hover:border-indigo-400 hover:bg-indigo-600 border-2 rounded-xl py-1 px-2 text-xl text-gray-300 hover:text-gray-200 ml-1 w-1/2">
                      <i class="bi bi-lightbulb small mr-2"></i>
                      Teach
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-if="results.length > 0">
            <div class="text-gray-300 pointer-events-none px-4 py-1">
              {{ results.length }} Results <span class="text-gray-500">({{ results.time }} s)</span>
            </div>
            <hr class="text-gray-300 opacity-100 mb-2">
            <template v-for="result in results" :key="result">
              <div
                class="result relative text-gray-300 hover:bg-gray-800 hover:bg-opacity-25 mb-2 p-3 mb-4 pb-4 border-b border-gray-700">
                <template v-if="result.priority === 'low'">
                  <div
                    class="absolute top-0 left-0 bottom-0 right-0 bg-neutral-900 bg-opacity-50 hover:bg-opacity-0"></div>
                </template>
                <div
                  class="absolute right-0 flex text-white result-copy backdrop-blur">
                  <div v-if="result.result.author === $store.state.username"
                       v-on:click="editWisdom(result.result)"
                       class="cursor-pointer hover:bg-gray-600 rounded-full p-3 mr-2">
                    <PencilSquareIcon class="h-8 w-8">
                    </PencilSquareIcon>
                    Edit
                  </div>
                  <div v-if="result.result.copyContent != null"
                       v-on:click="copy(result.result.copyContent)"
                       class="cursor-pointer hover:bg-gray-600 rounded-full p-3 mr-2">
                    <ClipboardIcon class="h-8 w-8">
                    </ClipboardIcon>
                    Copy
                  </div>
                </div>
                <div class="text-gray-500 mb-4 flex items-center">
                  <template v-if="result.priority === 'high'">
                    <SparklesIcon class="w-4 h-4 mr-2"></SparklesIcon>
                  </template>
                  <div class="pointer-events-none">
                    {{ capitalizeFirstLetter(result.result.type) }}
                    from
                    {{ result.result.author }}
                  </div>
                </div>
                <div class="flex">
                  <Markdown class="text-lg marked" :source="result.result.t"></Markdown>
                  <span></span>
                </div>
                <Markdown class="text-gray-400 marked" :source="result.result.desc"></Markdown>
                <div class="flex mt-4">
                  <template v-if="result.result.copyContent != null">
                    <ClipboardIcon v-on:click="copy(result.result.copyContent)"
                                   class="w-10 h-10 text-yellow-500 flex items-center px-2 border-2 border-yellow-500 rounded-lg mr-1 cursor-pointer hover:bg-yellow-500 hover:text-black">
                    </ClipboardIcon>
                  </template>
                  <template v-for="cat in result.result.categories" :key="cat">
                    <div v-if="JSON.parse(cat).category != null"
                         class="text-gray-400 flex items-center px-2 border-2 border-gray-500 rounded-lg w-fit mr-1 pointer-events-none">
                      {{ JSON.parse(cat).category }}
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
    <modal @close="isAddingCategory = false"
           v-show="isAddingCategory">
      <template v-slot:header>
        <span class="text-3xl font-bold">Add Category</span>
      </template>
      <template v-slot:body>
        <div class="m-3">
          <label for="new_category" class="text-2xl mb-2">Category:</label>
          <br>
          <input type="text" id="new_category" v-model="newCategory"
                 class="search-field bg-neutral-900 text-2xl"
                 v-on:keyup.enter="addCategory()">
          <br>
          <button v-on:click="addCategory()"
                  class="mt-3 py-2 px-3 border-2 border-gray-300 rounded-full hover:bg-gray-200 hover:text-black">
            Add
          </button>
        </div>
      </template>
      <template v-slot:footer>
      </template>
    </modal>
    <modal @close="isWritingLesson = false"
           v-show="isWritingLesson">
      <template v-slot:header>
        <span class="text-3xl font-bold">Teach</span>
      </template>
      <template v-slot:body>
        <div class="flex w-full lg:w-[90vw]" style="max-height: 90vh">
          <div class="w-full pr-3 md:pr-0 md:w-1/2">
            <label for="wisTitle" class="text-xl mb-2">Title:</label>
            <br>
            <input type="text" id="wisTitle" v-model="wisTitle"
                   class="bg-neutral-900 rounded-xl w-full py-2 px-3">
            <br>
            <div class="block lg:flex w-full">
              <div class="lg:w-1/2">
                <label for="wisCategories" class="text-xl mt-2 mb-2">Categories:</label>
                <br>
                <Listbox v-model="wisCategories" multiple id="wisCategories">
                  <div class="relative mt-1">
                    <ListboxButton
                      class="bg-gray-700 w-full relative cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                    >
                      <template v-if="wisCategories.length > 0">
                        <div class="block truncate font-bold text-gray-300">
                          {{ wisCategories.map((cat) => cat.category).join(', ') }}
                        </div>
                      </template>
                      <template v-else>
                        <span class="block truncate font-bold text-gray-500">Select...</span>
                      </template>
                      <div
                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ArrowsUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true"/>
                      </div>
                    </ListboxButton>
                    <transition
                      leave-active-class="transition duration-100 ease-in"
                      leave-from-class="opacity-100"
                      leave-to-class="opacity-0">
                      <ListboxOptions
                        class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                      >
                        <ListboxOption
                          v-slot="{ active, selected }"
                          v-for="cat in knowledge.categories"
                          :key="cat"
                          :value="cat"
                          as="template"
                        >
                          <li
                            :class="[ active ? 'bg-gray-700' : '',
                                  'relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-200' ]">
                            <div
                              :class="[ selected ? 'font-medium' : 'font-normal', 'block truncate' ]">
                              {{ cat.category }}
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
              <div class="lg:w-1/2 lg:ml-3">
                <label for="wisKeywords" class="text-xl mb-2 mt-2">Keywords:</label>
                <br>
                <input type="text" id="wisKeywords" v-model="wisKeywords"
                       class="bg-neutral-900 rounded-xl py-2 px-3 w-full">
              </div>
            </div>
            <br>
            <label for="wisDescription" class="text-xl mt-2 mb-2">Description:</label>
            <br>
            <textarea type="text" id="wisDescription" v-model="wisDescription" rows="10"
                      class="bg-neutral-900 rounded-xl w-full py-2 px-3"></textarea>
            <br>
            <label for="wisCopyContent" class="text-xl mt-2 mb-2">Copy Content:</label>
            <br>
            <textarea type="text" id="wisCopyContent" v-model="wisCopyContent" rows="10"
                      class="bg-neutral-900 rounded-xl w-full py-2 px-3"></textarea>
            <br>
            <button v-on:click="createLesson()"
                    class="mt-3 mb-2 py-2 px-3 border-2 border-gray-300 rounded-full hover:bg-gray-200 hover:text-black">
              Submit
            </button>
          </div>
          <div class="hidden lg:block w-2/5 ml-2 pl-2">
            <p class="text-xl font-bold mb-2 pointer-events-none">Preview:</p>
            <div class="bg-neutral-900 rounded-xl p-2 cursor-not-allowed">
              <Markdown :source="wisTitle" class="w-full marked"></Markdown>
              <Markdown :source="wisDescription" class="w-full mt-4 marked"></Markdown>
            </div>
            <template v-if="wisCopyContent != null">
              <p class="text-xl my-2 pointer-events-none">Copy Content:</p>
              <div class="bg-neutral-900 rounded-xl p-2">
                <Markdown :source="wisCopyContent" class="w-full marked"></Markdown>
              </div>
            </template>
          </div>
        </div>
      </template>
      <template v-slot:footer>
      </template>
    </modal>
  </template>
  <template v-else>
    <div class="">
      <div :style="{ backgroundImage: 'url('+require('@/assets/'+'account/pexels-anni-roenkae-2156881.jpg')+')',
         backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }">
        <div class="backdrop-blur-3xl p-10 backdrop-brightness-75">
          <div class="text-gray-300 mb-5 pointer-events-none">
            <span class="text-5xl font-bold">Create new Knowledge Hub</span>
            <hr class="text-neutral-500 opacity-100">
          </div>
          <form class="flex" @submit.prevent="createKnowledge">
            <div class="text-gray-300 w-96 ml-5">
              <label for="title" class="text-3xl mb-2">Title</label>
              <br>
              <input type="text" id="title" class="rounded text-xl w-full p-2 bg-neutral-400 bg-opacity-25"
                     required v-model="titleCreation">
              <br>
              <label for="description" class="mt-3 mb-2 text-3xl">Description</label>
              <br>
              <textarea type="text" rows="3" id="description"
                        class="rounded text-xl w-full p-2 bg-neutral-400 bg-opacity-25"
                        v-model="descriptionCreation"></textarea>
            </div>
            <div class="text-gray-300 w-96 ml-5">
              <label for="keywords" class="text-3xl mb-2 mr-3">Keywords</label>
              <span class="text-gray-500">Comma separated</span>
              <br>
              <input type="text" id="keywords" class="rounded text-xl w-full p-2 bg-neutral-400 bg-opacity-25"
                     v-model="keywordsCreation">
              <br>
              <button type="submit"
                      class="mt-3 py-2 px-3 border-2 border-gray-300 rounded-full hover:bg-gray-200 hover:text-black">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import modal from '../../components/Modal.vue'
import Markdown from 'vue3-markdown-it'
import 'highlight.js/styles/hybrid.css'
import {
  MagnifyingGlassIcon,
  ClipboardIcon,
  PencilSquareIcon
} from '@heroicons/vue/24/outline'
import {
  CheckIcon,
  ArrowsUpDownIcon,
  ArrowLeftOnRectangleIcon,
  SparklesIcon
} from '@heroicons/vue/24/solid'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/vue'
import { Base64 } from 'js-base64'

export default {
  name: 'KnowledgeFinderView',
  components: {
    modal,
    Markdown,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    CheckIcon,
    ArrowsUpDownIcon,
    MagnifyingGlassIcon,
    ClipboardIcon,
    ArrowLeftOnRectangleIcon,
    SparklesIcon,
    PencilSquareIcon
  },
  data () {
    return {
      srcGUID: '',
      source: '',
      knowledgeExists: true,
      knowledge: {},
      // Knowledge Creation
      titleCreation: '',
      descriptionCreation: '',
      keywordsCreation: '',
      // Wisdom Creation
      wisTitle: '## ',
      wisDescription: '',
      wisKeywords: '',
      wisCopyContent: '',
      wisCategories: [],
      wisGUID: '',
      // Etc.
      newCategory: '',
      isAddingCategory: false,
      isWritingWisdom: false,
      isWritingLesson: false,
      isEditingWisdom: false,
      queryText: '',
      querySubmission: '',
      emptyState: true,
      noResults: false,
      results: []
    }
  },
  mounted () {
    this.initFunction()
  },
  methods: {
    initFunction: async function () {
      await this.serverLogin()
      const input = document.getElementById('search-field')
      input.focus()
      // Whose knowledge are we trying to see?
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop)
      })
      const srcGUID = params.src
      if (srcGUID != null) {
        const chatroom = await this.getClarifierChatroom(srcGUID)
        if (chatroom != null) {
          this.srcGUID = srcGUID
          this.source = chatroom.t
        }
        const knowledge = await this.getKnowledge(srcGUID)
        if (knowledge != null) {
          this.knowledge = knowledge
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
    },
    getKnowledge: async function (sessionID) {
      return new Promise((resolve) => {
        const headers = new Headers()
        headers.set('Authorization', 'Bearer ' + this.$store.state.token)
        fetch(
          this.$store.state.serverIP + '/api/m7/get?src=' + sessionID + '&from=clarifier',
          {
            method: 'get',
            headers: headers
          }
        )
          .then((res) => res.json())
          .then((data) => {
            this.knowledge = data
            if (this.knowledge.categories != null) {
              for (let i = 0; i < this.knowledge.categories.length; i++) {
                this.knowledge.categories[i] = JSON.parse(this.knowledge.categories[i])
              }
            }
            resolve()
          })
          .catch((err) => {
            console.error(err.message)
            this.knowledgeExists = false
          })
      })
    },
    createKnowledge: async function () {
      const payload = {
        mainChatroomGUID: this.srcGUID,
        title: this.titleCreation,
        description: this.descriptionCreation,
        keywords: this.keywordsCreation,
        isPrivate: true
      }
      return new Promise((resolve) => {
        const headers = new Headers()
        headers.set('Authorization', 'Bearer ' + this.$store.state.token)
        fetch(
          this.$store.state.serverIP + '/api/m7/create',
          {
            method: 'post',
            headers: headers,
            body: JSON.stringify(payload)
          }
        )
          .then((res) => res.json())
          .then(() => {
            this.knowledgeExists = true
          })
          .then(() => resolve)
          .catch((err) => console.error(err.message))
      })
    },
    addCategory: async function () {
      const payload = {
        action: 'add',
        category: this.newCategory
      }
      return new Promise((resolve) => {
        const headers = new Headers()
        headers.set('Authorization', 'Bearer ' + this.$store.state.token)
        fetch(
          this.$store.state.serverIP + '/api/m7/edit/categories/' + this.knowledge.gUID,
          {
            method: 'post',
            headers: headers,
            body: JSON.stringify(payload)
          }
        )
          .then(() => {
            this.newCategory = ''
            this.knowledgeExists = true
            this.isAddingCategory = false
            this.getKnowledge(this.srcGUID)
          })
          .then(() => resolve)
          .catch((err) => console.error(err.message))
      })
    },
    searchWisdom: async function () {
      this.results = []
      this.emptyState = false
      this.querySubmission = this.queryText
      const payload = {
        query: this.queryText
      }
      return new Promise((resolve) => {
        const headers = new Headers()
        headers.set('Authorization', 'Bearer ' + this.$store.state.token)
        fetch(
          this.$store.state.serverIP + '/api/m7/search/' + this.knowledge.gUID,
          {
            method: 'post',
            headers: headers,
            body: JSON.stringify(payload)
          }
        )
          .then(res => res.json())
          .then((data) => {
            this.noResults = false
            const parsedData = JSON.parse(data)
            console.log(parsedData)
            if (parsedData.first != null) {
              for (let i = 0; i < parsedData.first.length; i++) {
                this.results.push({
                  priority: 'high',
                  result: parsedData.first[i].wisdom
                })
              }
            }
            if (parsedData.second != null) {
              for (let i = 0; i < parsedData.second.length; i++) {
                this.results.push({
                  priority: 'medium',
                  result: parsedData.second[i].wisdom
                })
              }
            }
            if (parsedData.third != null) {
              for (let i = 0; i < parsedData.third.length; i++) {
                this.results.push({
                  priority: 'low',
                  result: parsedData.third[i].wisdom
                })
              }
            }
            this.results.time = parsedData.time / 1000
          })
          .then(() => resolve)
          .catch((err) => {
            console.error(err.message)
            this.noResults = true
          })
      })
    },
    createLesson: async function () {
      await this.serverLogin()
      const categories = []
      for (let i = 0; i < this.wisCategories.length; i++) {
        categories.push(JSON.stringify(this.wisCategories[i]))
      }
      const payload = {
        title: this.wisTitle,
        description: this.wisDescription,
        knowledgeGUID: this.knowledge.gUID,
        keywords: this.wisKeywords,
        copyContent: this.wisCopyContent,
        categories: categories
      }
      const bodyPayload = JSON.stringify(payload)
      let extension = ''
      if (this.isEditingWisdom) {
        extension = '?guid=' + this.wisGUID
      }
      return new Promise((resolve) => {
        const headers = new Headers()
        headers.set('Authorization', 'Bearer ' + this.$store.state.token)
        fetch(
          this.$store.state.serverIP + '/api/m7/teach' + extension,
          {
            method: 'post',
            headers: headers,
            body: bodyPayload
          }
        )
          .then(() => {
            this.wisTitle = '## '
            this.wisDescription = ''
            this.wisKeywords = ''
            this.wisCopyContent = ''
            this.wisCategories = []
            this.wisGUID = ''
            this.isWritingWisdom = false
            this.isWritingLesson = false
            this.isEditingWisdom = false
          })
          .then(() => resolve)
          .catch((err) => {
            console.error(err.message)
            this.noResults = true
          })
      })
    },
    writeLesson: function () {
      this.wisTitle = ''
      this.wisDescription = ''
      this.wisKeywords = ''
      this.wisCopyContent = ''
      this.wisCategories = []
      this.wisGUID = ''
      this.isWritingWisdom = true
      this.isWritingLesson = true
      this.isEditingWisdom = false
      // Defaults
      this.wisTitle = '## ' + this.capitalizeFirstLetter(this.queryText).trim()
    },
    editWisdom: function (wisdom) {
      this.wisTitle = ''
      this.wisDescription = ''
      this.wisKeywords = ''
      this.wisCopyContent = ''
      this.wisCategories = []
      this.wisGUID = ''
      this.isWritingWisdom = true
      this.isWritingLesson = true
      this.isEditingWisdom = true
      // Defaults
      this.wisTitle = wisdom.t
      this.wisDescription = wisdom.desc
      this.wisKeywords = wisdom.keywords
      console.log(wisdom.categories)
      for (let i = 0; i < wisdom.categories.length; i++) {
        this.wisCategories.push(JSON.parse(wisdom.categories[i]))
      }
      this.wisCopyContent = wisdom.copyContent
      this.wisGUID = wisdom.gUID
    },
    capitalizeFirstLetter: function ([first, ...rest], locale = navigator.language) {
      return first === undefined ? '' : first.toLocaleUpperCase(locale) + rest.join('')
    },
    copy: function (parameter) {
      navigator.clipboard.writeText(parameter)
      this.$notify(
        {
          title: 'Quick Copy Done!',
          text: 'CTRL-V to paste.',
          type: 'info'
        })
    },
    serverLogin: function () {
      return new Promise((resolve) => {
        if (this.$store.state.email === undefined || this.$store.state.email === '') return
        const headers = new Headers()
        headers.set(
          'Authorization',
          'Basic ' + Base64.encode(this.$store.state.email + ':' + this.$store.state.password)
        )
        fetch(
          this.$store.state.serverIP + '/login',
          {
            method: 'get',
            headers: headers
          }
        )
          .then((res) => res.json())
          .then((data) => (this.loginResponse = JSON.parse(data.contentJson)))
          .then(this.processLogin)
          .then(resolve)
          .catch((err) => this.$notify(
            {
              title: 'Unable to Login',
              text: err.message,
              type: 'error'
            }))
      })
    },
    processLogin: function () {
      if (this.loginResponse.httpCode === 200) {
        this.$store.commit('setServerToken', this.loginResponse.token)
      }
    }
  }
}
</script>

<style>

.header-margin {
  min-height: 60px;
}

.search-field {
  padding: 6px 12px 6px 12px;
  color: white;
  border-radius: 10px;
  resize: none;
  overflow: hidden;
  width: 100%;
}

.marked p {
  @apply mb-4;
}

.marked p:last-child {
  @apply m-0;
}

.marked a {
  @apply underline;
}

.marked ul {
  @apply list-disc list-inside;
}

.marked ol {
  @apply list-decimal list-inside;
}

.marked h1 {
  @apply text-4xl;
}

.marked h2 {
  @apply text-3xl;
}

.marked h3 {
  @apply text-2xl;
}

.marked h4 {
  @apply text-xl;
}

.marked h5 {
  @apply text-lg;
}

.result-copy {
  opacity: 0;
}

.result:hover .result-copy {
  opacity: 1;
}

</style>
