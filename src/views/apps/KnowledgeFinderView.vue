<template>
  <template v-if="!isoverlay">
    <div class="header-margin shadow-xl"/>
  </template>
  <template v-if="knowledgeExists">
    <div class="h-full">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full bg-neutral-900 h-full">
        <div class="border-r border-neutral-700 h-full"
             :style="{
                backgroundImage: 'url('+require('@/assets/'+'account/BigBlur.webp')+')',
                backgroundPosition: 'top left', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }">
          <div class="bg-neutral-900 bg-opacity-40 h-full relative">
            <div class="py-1 shadow rounded-none hidden">
              <div class="flex items-center">
                <div v-on:click="$router.push(
                  '/apps/clarifier/wss/' + srcguid
                )"
                     class="h-full ml-4 mr-2 px-2 py-4 rounded-xl text-center text-gray-300 hover:text-orange-500 cursor-pointer">
                  <i class="sb_link_icon bi bi-x-square text-xl"></i>
                </div>
                <div class="font-bold w-full overflow-x-hidden pr-2">
                  <div class="py-2 px-2 text-gray-100 pointer-events-none">
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
            <div class="shadow py-2 backdrop-brightness-75">
              <div class="px-3 py-2 rounded-lg flex items-center relative">
                <MagnifyingGlassIcon class="w-8 h-8 mx-1 text-neutral-300 absolute translate-x-1"/>
                <input id="search-field" type="text"
                       class="search-field py-4 pl-12 pr-4 bg-neutral-900 h-8 text-lg border-2 border-neutral-800"
                       placeholder="Search..."
                       v-on:keyup.enter="searchWisdom()"
                       v-model="queryText">
              </div>
              <div style="width: 100%; height: 35px; padding-top: 5px;
                      display: flex; position: relative; align-items: center">
                <span class="font-bold text-neutral-300 pointer-events-none ml-5">Categories</span>
                <button class="text-white btn-no-outline"
                        style="position: absolute; right: 15px"
                        title="New Subchat"
                        v-on:click="isAddingCategory = true">
                  <i class="bi bi-plus lead orange-hover text-neutral-300" style="font-size: 150%"></i>
                </button>
              </div>
              <div class="px-3 pb-2 flex items-center w-full">
                <div class="overflow-x-auto overflow-y-hidden py-2 w-full">
                  <template v-for="category in knowledge.categories" :key="category">
                    <div
                      class="kf_category">
                      <p>{{ category.category.replace(' ', '&nbsp;') }}</p>
                      <template v-if="category.count > 0">
                        <p class="ml-auto">{{ category.count }}</p>
                      </template>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <!-- QUICK VIEW -->
            <div class="px-4 py-2 sm:absolute sm:bottom-0 sm:w-full">
              <div class="flex">
                <button
                  class="border-orange-600 hover:border-orange-400 hover:bg-orange-600 border-2 rounded-xl py-1 px-2 text-gray-200 hover:text-gray-200 mr-3 w-1/2 backdrop-brightness-75">
                  <i class="bi bi-question-lg mr-2"></i>
                  Ask
                </button>
                <button v-on:click="writeLesson()"
                        class="border-indigo-600 hover:border-indigo-400 hover:bg-indigo-600 border-2 rounded-xl py-1 px-2 text-gray-200 hover:text-gray-200 w-1/2 backdrop-brightness-75">
                  <i class="bi bi-lightbulb small mr-2"></i>
                  Teach
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="lg:col-span-2 pt-3 overflow-y-scroll overflow-x-hidden h-full">
          <template v-if="emptyState">
            <div class="text-neutral-400 px-2 ml-2">
              <p class="text-2xl font-bold mb-2 pointer-events-none">Top Contributors</p>
              <div class="flex w-full overflow-x-auto py-2">
                <div v-for="author in topWriters.contributors" :key="author.username"
                     class="mr-4 text-neutral-400 shadow shadow-black rounded-xl">
                  <div class="bg-neutral-800 rounded-t-xl py-2 px-3 pointer-events-none">
                    <p class="text-2xl">{{ author.username }}</p>
                  </div>
                  <div class="bg-slate-700 rounded-b-xl py-1 px-3 pointer-events-none">
                    <div class="flex items-center">
                      <BookOpenIcon class="h-6 w-6 mr-2"></BookOpenIcon>
                      <p class="text-xl">{{ author.lessons }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="flex w-full justify-content-center items-center text-neutral-400 pointer-events-none p-2 my-3 border-t border-t-neutral-800 border-b border-b-neutral-800">
              <MagnifyingGlassIcon class="h-8 w-8 mr-4"></MagnifyingGlassIcon>
              <p>Search to get some results!</p>
            </div>
            <div id="d3wordcloud"></div>
          </template>
          <template v-if="noResults">
            <div class="flex w-full justify-content-center items-center text-gray-300 p-3 md:mt-10">
              <div>
                <p class="pointer-events-none text-center">No Results for...</p>
                <p class="text-gray-400 text-center"> {{ querySubmission }} </p>
                <p class="text-gray-400 pointer-events-none mt-3 text-center border-t border-t-gray-400 pt-3">
                  Ask a question or teach people!
                </p>
                <div class="mt-2">
                  <div class="flex">
                    <button
                      class="border-orange-600 hover:border-orange-400 hover:bg-orange-600 border-2 rounded-xl py-1 px-2 text-gray-300 hover:text-gray-200 w-1/2">
                      <i class="bi bi-question-lg mr-2"></i> <span class="text-sm">Ask</span>
                    </button>
                    <button v-on:click="writeLesson()"
                            class="border-indigo-600 hover:border-indigo-400 hover:bg-indigo-600 border-2 rounded-xl py-1 px-2 text-gray-300 hover:text-gray-200 ml-1 w-1/2">
                      <i class="bi bi-lightbulb small mr-2"></i> <span class="text-sm">Teach</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!-- RESULTS -->
          <template v-if="results.length > 0">
            <div class="text-neutral-400 pointer-events-none px-3 pb-2">
              {{ results.length }} results in {{ results.time }} seconds
            </div>
            <template v-for="result in results" :key="result">
              <div v-on:click="gotoWisdom(result.result.gUID)"
                   class="result relative text-gray-300 hover:bg-neutral-800 hover:bg-opacity-25 hover:border-l-2 hover:border-l-neutral-500 px-3 py-3 border-b border-neutral-800">
                <template v-if="result.priority === 'low'">
                  <div
                    class="absolute top-0 left-0 bottom-0 right-0 bg-neutral-900 bg-opacity-50 hover:bg-opacity-0"></div>
                </template>
                <div class="text-neutral-400 mb-2 flex items-center">
                  <template v-if="result.priority === 'high'">
                    <SparklesIcon class="w-6 h-6 mr-2"></SparklesIcon>
                  </template>
                  <div class="pointer-events-none">
                    {{ capitalizeFirstLetter(result.result.type) }}
                    from
                    {{ result.result.author }}
                  </div>
                  <div v-if="result.result.reacts != null" class="flex ml-4">
                    <div v-for="reaction in result.result.reacts" :key="reaction.src"
                         style="display: flex; padding: 2px 4px 2px 4px; margin-right: 4px; border-radius: 5px"
                         class="text-neutral-300 gray-hover"
                         :title="JSON.parse(reaction).src.toString() + ' reacted to this.'"
                         v-on:click="reactToMessage(result.result, JSON.parse(reaction).t)"
                         :id="'react_' + result.result.gUID + '_' + JSON.parse(reaction).t">
                      <HandThumbUpIcon v-if="JSON.parse(reaction).t === '+'"
                                       class="w-6 h-6 mr-1"></HandThumbUpIcon>
                      <HandThumbDownIcon v-else-if="JSON.parse(reaction).t === '-'"
                                         class="w-6 h-6 mr-1"></HandThumbDownIcon>
                      <StarIcon v-else-if="JSON.parse(reaction).t === '⭐'"
                                class="w-6 h-6 mr-1"></StarIcon>
                      <span v-else> {{ JSON.parse(reaction).t }} </span>
                      {{ JSON.parse(reaction).src.length }}
                    </div>
                  </div>
                </div>
                <div class="flex">
                  <Markdown class="text-lg markedFinder hover:text-orange-500 cursor-pointer"
                            :source="result.result.t"
                            :plugins="plugins"></Markdown>
                </div>
                <Markdown class="text-gray-400 markedFinder lg:w-3/4"
                          :source="result.result.desc"
                          :plugins="plugins"></Markdown>
                <div class="flex mt-3">
                  <template v-if="result.result.copyContent != null">
                    <ClipboardIcon
                      class="w-10 h-8 text-yellow-500 flex items-center px-2 border-2 border-yellow-500 rounded-lg mr-1">
                    </ClipboardIcon>
                  </template>
                  <template v-for="cat in result.result.categories" :key="cat">
                    <div v-if="JSON.parse(cat).category != null"
                         class="h-8 text-gray-400 flex items-center px-2 border-2 border-gray-500 rounded-lg w-fit mr-1 pointer-events-none">
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
        <div class="flex">
          <div class="mb-3">
            <button v-on:click="createLesson()"
                    class="mr-2 py-2 px-5 border-2 border-gray-300 rounded-full hover:bg-gray-200 hover:text-black font-bold">
              Submit
            </button>
            <button v-on:click="deleteLesson()"
                    class="py-2 px-3 border-2 border-red-700 rounded-full hover:bg-red-700 hover:text-black font-bold">
              Delete
            </button>
          </div>
        </div>
        <div class="flex w-[90vw]" style="max-height: 90vh">
          <div class="w-full pr-12 md:pr-0 md:w-1/2">
            <label for="wisTitle" class="text-xl font-bold">Title:</label>
            <br>
            <input type="text" id="wisTitle" v-model="wisTitle"
                   class="bg-neutral-900 rounded-xl w-full py-2 px-3">
            <br>
            <div class="block lg:flex w-full">
              <div class="lg:w-1/2">
                <label for="wisCategories" class="text-xl mt-2 font-bold">Categories:</label>
                <br>
                <Listbox v-model="wisCategories" multiple id="wisCategories">
                  <div class="relative mt-1">
                    <ListboxButton
                      class="bg-neutral-900 w-full relative cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
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
                        class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-neutral-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
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
              <div class="md:w-3/5 lg:ml-3">
                <label for="wisKeywords" class="text-xl mt-2 font-bold">Keywords:</label>
                <br>
                <input type="text" id="wisKeywords" v-model="wisKeywords"
                       class="bg-neutral-900 rounded-xl py-2 px-3 w-full">
              </div>
            </div>
            <label for="wisDescription" class="text-xl mt-2 font-bold">Description:</label>
            <br>
            <textarea type="text" id="wisDescription" v-model="wisDescription" rows="20"
                      class="bg-neutral-900 rounded-xl w-full py-2 px-3"></textarea>
            <br>
            <label for="wisCopyContent" class="text-xl mt-2 font-bold">Copy Content:</label>
            <br>
            <textarea type="text" id="wisCopyContent" v-model="wisCopyContent" rows="5"
                      class="bg-neutral-900 rounded-xl w-full py-2 px-3"></textarea>
          </div>
          <div class="hidden md:block w-[46%] ml-2">
            <p class="text-xl font-bold pointer-events-none">Preview:</p>
            <div class="bg-neutral-900 rounded-xl p-2 cursor-not-allowed">
              <Markdown :source="wisTitle" class="w-full markedFinder" :plugins="plugins"></Markdown>
              <Markdown :source="wisDescription" class="w-full mt-4 markedFinder" :plugins="plugins"></Markdown>
            </div>
            <template v-if="wisCopyContent != null">
              <p class="text-xl my-2 pointer-events-none font-bold">Copy Content:</p>
              <div class="bg-neutral-900 rounded-xl p-2">
                <Markdown :source="wisCopyContent" class="w-full markedFinder" :plugins="plugins"></Markdown>
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
import markdownItMermaid from 'markdown-it-mermaid'
import 'highlight.js/styles/hybrid.css'
import {
  BookOpenIcon,
  ClipboardIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  MagnifyingGlassIcon,
  StarIcon
} from '@heroicons/vue/24/outline'
import { ArrowsUpDownIcon, CheckIcon, SparklesIcon } from '@heroicons/vue/24/solid'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { Base64 } from 'js-base64'
import mermaid from 'mermaid'
import * as d3 from 'd3'
import * as d3Cloud from 'd3-cloud'

export default {
  name: 'KnowledgeFinderView',
  props: {
    isoverlay: Boolean,
    srcguid: String
  },
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
    SparklesIcon,
    HandThumbUpIcon,
    HandThumbDownIcon,
    StarIcon,
    BookOpenIcon
  },
  data () {
    return {
      source: '',
      swords: [],
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
      results: [],
      topWriters: [],
      plugins: [
        {
          plugin: markdownItMermaid
        }
      ]
    }
  },
  created () {
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
      if (this.srcguid != null) {
        const chatroom = await this.getClarifierChatroom(this.srcguid)
        if (chatroom != null) {
          this.source = chatroom.t
        }
        const knowledge = await this.getKnowledge(this.srcguid)
        if (knowledge != null) {
          this.knowledge = knowledge
        }
        // Did we already search for something?
        const params = new Proxy(new URLSearchParams(window.location.search), {
          get: (searchParams, prop) => searchParams.get(prop)
        })
        const queryText = params.query
        if (queryText != null) {
          this.queryText = queryText
          await this.searchWisdom()
        }
        await this.getTopContributors(this.srcguid)
        await this.getRecentKeywords()
        await this.getRecentCategories()
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
                this.knowledge.categories[i].count = 0
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
        mainChatroomGUID: this.srcguid,
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
            this.getKnowledge(this.srcguid)
          })
          .then(() => resolve)
          .catch((err) => console.error(err.message))
      })
    },
    searchWisdom: async function (substitute = null) {
      this.results = []
      this.emptyState = false
      this.querySubmission = substitute ?? this.queryText
      if (this.querySubmission == null || this.querySubmission === '') {
        this.emptyState = true
        this.noResults = false
        await this.getTopContributors()
        await this.getRecentKeywords()
        await this.getRecentCategories()
        return
      }
      const payload = {
        query: this.querySubmission
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
            const parsedData = data
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
          .then(() => {
            setTimeout(() => {
              mermaid.initialize({
                startOnLoad: true,
                theme: 'dark'
              })
            }, 0)
            setTimeout(() => {
              mermaid.init()
            }, 0)
          })
          .then(() => resolve)
          .catch((err) => {
            console.error(err.message)
            this.noResults = true
          })
          .finally(() => {
            this.$router.push({
              query: {
                query: this.querySubmission
              }
            })
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
      return new Promise((resolve) => {
        const headers = new Headers()
        headers.set('Authorization', 'Bearer ' + this.$store.state.token)
        fetch(
          this.$store.state.serverIP + '/api/m7/teach',
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
    deleteLesson: async function () {
      if (this.wisGUID == null || this.wisGUID === '') return
      await this.serverLogin()
      return new Promise((resolve) => {
        const headers = new Headers()
        headers.set('Authorization', 'Bearer ' + this.$store.state.token)
        fetch(
          this.$store.state.serverIP + '/api/m7/delete/' + this.wisGUID,
          {
            method: 'get',
            headers: headers
          }
        )
          .then(res => res)
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
            this.$notify(
              {
                title: 'Wisdom deleted.',
                text: '',
                type: 'info'
              })
          })
          .then(() => resolve)
          .catch((err) => {
            this.$notify(
              {
                title: 'Error!',
                text: 'Maybe you aren\'t the owner of the Wisdom.',
                type: 'info'
              })
            console.error(err.message)
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
    capitalizeFirstLetter: function ([first, ...rest], locale = navigator.language) {
      return first === undefined ? '' : first.toLocaleUpperCase(locale) + rest.join('')
    },
    serverLogin: async function () {
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
    },
    getTopContributors: async function () {
      return new Promise((resolve) => {
        const headers = new Headers()
        headers.set('Authorization', 'Bearer ' + this.$store.state.token)
        fetch(
          this.$store.state.serverIP + '/api/m7/topwriters/' + this.knowledge.gUID,
          {
            method: 'get',
            headers: headers
          }
        )
          .then((res) => res.json())
          .then((data) => {
            this.topWriters = data
            resolve()
          })
          .catch((err) => {
            console.error(err.message)
          })
      })
    },
    reactToMessage: async function (wisdom, t) {
      const payload = JSON.stringify({
        src: [],
        t: t
      })
      return new Promise((resolve) => {
        const headers = new Headers()
        headers.set('Authorization', 'Bearer ' + this.$store.state.token)
        fetch(
          this.$store.state.serverIP + '/api/m7/react/' + wisdom.gUID,
          {
            method: 'post',
            headers: headers,
            body: payload
          }
        )
          .then(() => {
            this.$notify(
              {
                title: 'Feedback sent to the server.',
                text: 'Thanks!',
                type: 'info'
              })
          })
          .then(() => resolve)
          .catch((err) => {
            console.error(err.message)
          })
      })
    },
    gotoWisdom: function (id) {
      if (id == null) return
      this.$router.push('/apps/knowledge/' + id + '?src=' + this.srcguid)
    },
    wordCloud: function (text, {
      size = group => group.length, // Given a grouping of words, returns the size factor for that word
      word = d => d, // Given an item of the data array, returns the word
      marginTop = 0, // top margin, in pixels
      marginRight = 0, // right margin, in pixels
      marginBottom = 0, // bottom margin, in pixels
      marginLeft = 0, // left margin, in pixels
      width = 640, // outer width, in pixels
      height = 400, // outer height, in pixels
      maxWords = 50, // maximum number of words to extract from the text
      fontFamily = 'Lato', // font family
      fontScale = 12, // base font size
      padding = 4, // amount of padding between the words (in pixels)
      rotate = 0, // a constant or function to rotate the words
      invalidation // when this promise resolves, stop the simulation
    } = {}) {
      const words = typeof text === 'string' ? text.split(/\W+/g) : Array.from(text)

      const data = d3.rollups(words, size, w => w)
        .sort(([, a], [, b]) => d3.descending(a, b))
        .slice(0, maxWords)
        .map(([key, size]) => ({
          text: word(key),
          size: Math.exp(size)
        }))

      const svg = d3.create('svg')
        .attr('viewBox', [0, 0, width, height])
        .attr('width', width)
        .attr('font-family', fontFamily)
        .attr('text-anchor', 'middle')
        .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')

      const g = svg.append('g').attr('transform', `translate(${marginLeft},${marginTop})`)
      const vueInstance = this
      const cloud = d3Cloud()
        .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
        .words(data)
        .padding(padding)
        .rotate(rotate)
        .font(fontFamily)
        .fontSize(d => (Math.sqrt(d.size) * fontScale))
        .on('word', ({
          size,
          x,
          y,
          rotate,
          text
        }) => {
          g.append('text')
            .attr('font-size', Math.min(Math.max(size, 0), 100)) // caps size at 100
            .attr('fill', '#AFAFAF')
            .attr('transform', `translate(${x},${y}) rotate(${rotate})`)
            .text(text)
            .on('click', function () {
              vueInstance.searchWisdom(text)
            })
            .attr('class', 'cursor-pointer')
            .on('mouseover', function () {
              d3.select(this).transition()
                .duration('100')
                .attr('fill', '#da6c0e')
            })
            .on('mouseout', function () {
              d3.select(this).transition()
                .duration('200')
                .attr('fill', '#AFAFAF')
            })
        })

      cloud.start()
      invalidation && invalidation.then(() => cloud.stop())
      return svg.node()
    },
    getRecentKeywords: async function () {
      return new Promise((resolve) => {
        const headers = new Headers()
        headers.set('Authorization', 'Bearer ' + this.$store.state.token)
        fetch(
          this.$store.state.serverIP + '/api/m7/keywordlist/' + this.knowledge.gUID,
          {
            method: 'get',
            headers: headers
          }
        )
          .then((res) => res.json())
          .then((data) => {
            let keywords = []
            if (data.keywords) keywords = data.keywords
            const svg = this.wordCloud(keywords)
            const myNode = document.getElementById('d3wordcloud')
            while (myNode.lastElementChild) {
              myNode.removeChild(myNode.lastElementChild)
            }
            myNode.appendChild(svg)
            resolve()
          })
          .catch((err) => {
            console.error(err.message)
          })
      })
    },
    getRecentCategories: async function () {
      return new Promise((resolve) => {
        const headers = new Headers()
        headers.set('Authorization', 'Bearer ' + this.$store.state.token)
        fetch(
          this.$store.state.serverIP + '/api/m7/categorylist/' + this.knowledge.gUID,
          {
            method: 'get',
            headers: headers
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (!data.categories) return
            if (this.knowledge && this.knowledge.categories) {
              for (let i = 0; i < data.categories.length; i++) {
                const category = data.categories[i]
                for (let j = 0; j < this.knowledge.categories.length; j++) {
                  if (this.knowledge.categories[j].category === category.category) {
                    this.knowledge.categories[j].count = category.count
                  }
                }
              }
            }
            resolve()
          })
          .catch((err) => {
            console.error(err.message)
          })
      })
    }
  }
}
</script>

<style>

.header-margin {
  min-height: 60px;
}

.search-field {
  color: white;
  border-radius: 10px;
  resize: none;
  overflow: hidden;
  width: 100%;
}

.markedFinder p {
  @apply mb-4;
}

.markedFinder p:last-child {
  @apply m-0;
}

.markedFinder a {
  @apply underline;
}

.markedFinder ul {
  @apply list-disc list-inside mb-2;
}

.markedFinder ol {
  @apply list-decimal list-inside mb-2;
}

.markedFinder pre {
  @apply mb-2;
}

.markedFinder table {
  @apply mb-4;
}

.markedFinder th, .markedFinder td {
  @apply p-2 border border-slate-700;
}

.markedFinder tr {
  @apply hover:bg-neutral-800;
}

.markedFinder h1 {
  @apply text-4xl mb-2;
}

.markedFinder h2 {
  @apply text-3xl mb-2;
}

.markedFinder h3 {
  @apply text-2xl mb-2;
}

.markedFinder h4 {
  @apply text-xl mb-2;
}

.markedFinder h5 {
  @apply text-lg mb-2;
}

.markedFinder h6 {
  @apply text-lg;
}

.gray-hover:hover {
  @apply bg-neutral-700 text-neutral-200;
  cursor: pointer;
  border-radius: 10px;
}

.kf_category {
  @apply font-bold text-xs text-neutral-400 bg-black bg-opacity-40 cursor-pointer mb-1 flex items-center text-center px-3 rounded-full hover:border-gray-100 hover:text-gray-100 h-8;
}

</style>
