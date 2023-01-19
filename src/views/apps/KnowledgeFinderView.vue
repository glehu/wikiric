<template>
  <div id="knowledgeFinder"
       class="bg-zinc-800 w-full h-full absolute overflow-hidden rounded-tr-lg border-r-2 border-r-zinc-900">
    <template v-if="knowledgeExists">
      <div class="h-full w-full">
        <template v-if="!isViewingWisdom">
          <div class="grid grid-cols-1 md:grid-cols-3 w-full h-full">
            <div id="knowledgeFinder_sidebar"
                 class="h-[calc(100%-1rem)] rounded-lg overflow-hidden m-2 bg-zinc-700">
              <div class="h-full relative">
                <div class="py-1 shadow">
                  <div class="flex items-center">
                    <div v-on:click="clickedBack()"
                         class="h-full ml-4 mr-2 px-2 py-4 rounded-xl text-center text-gray-300 hover:text-orange-500 cursor-pointer">
                      <i class="sb_link_icon bi bi-x-square text-xl"></i>
                    </div>
                    <div class="w-full overflow-x-hidden pr-2">
                      <div class="py-2 px-2 pointer-events-none">
                        <div class="text-xl border-l border-gray-300 pl-5 text-neutral-300 font-bold">
                          {{ this.knowledge.t }}
                        </div>
                        <div class="text-sm border-l border-gray-300 pl-5 text-gray-300 text-neutral-400">
                          {{ this.knowledge.desc }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="py-2">
                  <div class="px-3 py-2 rounded-lg flex items-center relative">
                    <MagnifyingGlassIcon class="w-8 h-8 mx-1 text-neutral-300 absolute translate-x-1"/>
                    <input id="search-field" type="text"
                           class="search-field py-4 pl-12 pr-4 bg-neutral-900 h-8 border-2 border-zinc-700"
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
                            v-on:click="startAddingCategory()">
                      <i class="bi bi-plus lead orange-hover text-neutral-300" style="font-size: 150%"></i>
                    </button>
                  </div>
                  <div class="px-3 pb-2 flex items-center w-full">
                    <div class="overflow-x-hidden overflow-y-auto py-2 w-full">
                      <template v-if="knowledge.categories && knowledge.categories.length > 0">
                        <template v-for="category in knowledge.categories" :key="category">
                          <div
                            class="kf_category">
                            <p>{{ category.category.replace(' ', '&nbsp;') }}</p>
                            <template v-if="category.count > 0">
                              <p class="ml-auto">{{ category.count }}</p>
                            </template>
                          </div>
                        </template>
                      </template>
                      <template v-else>
                        <button class="w-full flex justify-center text-neutral-500 font-bold text-sm"
                                v-on:click="startAddingCategory()">
                          No Categories.
                        </button>
                      </template>
                    </div>
                  </div>
                </div>
                <!-- QUICK VIEW -->
                <div class="px-3 py-3 md:absolute md:bottom-0 md:w-full">
                  <div class="flex">
                    <button v-on:click="writeWisdom('ask')"
                            class="border-orange-500 hover:bg-orange-600 border-2
                                   rounded-xl py-1 px-2 text-gray-200 hover:text-gray-200 mr-3 w-1/2">
                      <i class="bi bi-question-lg mr-2"></i>
                      Ask
                    </button>
                    <button v-on:click="writeWisdom('teach')"
                            class="border-indigo-500 hover:bg-indigo-600 border-2
                                   rounded-xl py-1 px-2 text-gray-200 hover:text-gray-200 w-1/2">
                      <i class="bi bi-lightbulb small mr-2"></i>
                      Teach
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="md:col-span-2 pt-3 overflow-y-scroll overflow-x-hidden h-full">
              <template v-if="emptyState">
                <div class="text-neutral-400 px-2 ml-2">
                  <p class="text-xl font-bold mb-2 pointer-events-none text-neutral-400">
                    Top Contributors
                  </p>
                  <div class="flex w-full overflow-x-auto pt-1 mb-2">
                    <div v-for="author in topWriters.contributors" :key="author.username"
                         class="mr-4 text-neutral-400 shadow shadow-black rounded-xl">
                      <div class="bg-zinc-700 rounded-t-xl py-2 px-3 pointer-events-none">
                        <p class="text-xl">{{ author.username }}</p>
                      </div>
                      <div class="bg-zinc-900 rounded-b-xl py-1 px-3 pointer-events-none">
                        <div class="flex items-center">
                          <BookOpenIcon class="h-6 w-6 mr-2"></BookOpenIcon>
                          <p class="text-xl">{{ author.lessons }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="questions.length > 0" class="text-neutral-400 px-2 ml-2">
                  <p class="text-xl font-bold mb-2 pointer-events-none text-neutral-400">
                    Recent Questions
                  </p>
                  <div class="flex w-full overflow-x-auto pt-1 mb-2 gap-x-2 pb-4">
                    <div v-for="task in questions" :key="task.uID"
                         v-on:click="gotoWisdom(task.result.gUID)"
                         class="text-neutral-400 w-full rounded-xl cursor-pointer hover:brightness-150 relative min-w-[250px]">
                      <div class="bg-zinc-800 text-neutral-300 rounded-t py-1 px-3 pointer-events-none">
                        <p class="font-bold">{{ task.result.t }}</p>
                      </div>
                      <div
                        class="bg-zinc-700 text-neutral-300 rounded-b py-1 px-3 pointer-events-none max-h-[11em] overflow-y-hidden">
                        <div class="flex items-center">
                          <p class="text-sm">{{ task.result.desc }}</p>
                        </div>
                      </div>
                      <div class="flex w-full mt-1 text-xs text-neutral-400">
                        <p>{{ task.result.author }}</p>
                        <p class="ml-auto">{{ getHumanReadableDateText(new Date(task.result.cdate), true) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="px-2 ml-2">
                  <div class="flex w-full justify-content-center items-center p-2">
                    <div id="d3wordcloud"></div>
                  </div>
                </div>
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
                        <button v-on:click="writeWisdom('ask')"
                                class="border-orange-500 hover:bg-orange-600 border-2
                                   rounded-xl py-1 px-2 text-gray-200 hover:text-gray-200 mr-3 w-1/2">
                          <i class="bi bi-question-lg mr-2"></i>
                          Ask
                        </button>
                        <button v-on:click="writeWisdom('teach')"
                                class="border-indigo-500 hover:bg-indigo-600 border-2
                                   rounded-xl py-1 px-2 text-gray-200 hover:text-gray-200 w-1/2">
                          <i class="bi bi-lightbulb small mr-2"></i>
                          Teach
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
                       class="result cursor-pointer">
                    <template v-if="result.priority === 'low'">
                      <div
                        class="absolute top-0 left-0 bottom-0 right-0 bg-neutral-900 bg-opacity-50 hover:bg-opacity-0"></div>
                    </template>
                    <div class="text-neutral-400 flex items-center text-sm">
                      <template v-if="result.priority === 'high'">
                        <SparklesIcon class="w-5 h-5 mr-2 text-amber-600"></SparklesIcon>
                      </template>
                      <div class="flex text-sm">
                        <span class="pr-2 border-r-2 border-r-neutral-600">{{
                            getHumanReadableDateText(new Date(result.result.cdate), true)
                          }}</span>
                        <span class="px-2">{{ result.result.author }}</span>
                      </div>
                      <div class="pointer-events-none ml-auto flex items-center">
                        <div v-if="result.result.reacts != null" class="flex">
                          <div v-for="reaction in result.result.reacts" :key="reaction.src"
                               style="padding: 2px 4px 2px 4px; margin-right: 4px; border-radius: 5px"
                               class="text-neutral-300 gray-hover flex items-center"
                               :title="JSON.parse(reaction).src.toString() + ' reacted to this.'"
                               :id="'react_' + result.result.gUID + '_' + JSON.parse(reaction).t">
                            <HandThumbUpIcon v-if="JSON.parse(reaction).t === '+'"
                                             class="w-5 h-5 mr-1"></HandThumbUpIcon>
                            <HandThumbDownIcon v-else-if="JSON.parse(reaction).t === '-'"
                                               class="w-5 h-5 mr-1"></HandThumbDownIcon>
                            <StarIcon v-else-if="JSON.parse(reaction).t === '⭐'"
                                      class="w-5 h-5 mr-1"></StarIcon>
                            <span v-else> {{ JSON.parse(reaction).t }} </span>
                            {{ JSON.parse(reaction).src.length }}
                          </div>
                        </div>
                        <template v-if="result.result.type === 'lesson'">
                          <div class="px-2 py-0.5 mx-2 rounded-md bg-indigo-800 text-neutral-300 font-bold">
                            {{ capitalizeFirstLetter(result.result.type) }}
                          </div>
                        </template>
                        <template v-else-if="result.result.type === 'question'">
                          <div class="px-2 py-0.5 mx-2 rounded-md bg-orange-800 text-neutral-300 font-bold">
                            {{ capitalizeFirstLetter(result.result.type) }}
                          </div>
                        </template>
                        <template v-else class="mx-2">
                          {{ capitalizeFirstLetter(result.result.type) }}
                        </template>
                      </div>
                    </div>
                    <div class="w-full py-4 px-1">
                      <Markdown class="markedFinder"
                                :source="'# ' + result.result.t"
                                :plugins="plugins"></Markdown>
                      <Markdown class="text-gray-400 markedFinder text-base"
                                :source="result.result.desc"
                                :plugins="plugins"></Markdown>
                    </div>
                    <div class="flex">
                      <template v-if="result.result.copyContent != null">
                        <ClipboardIcon
                          class="w-10 h-8 text-yellow-500 flex items-center px-2 border-2 border-yellow-500 rounded-lg mr-1">
                        </ClipboardIcon>
                      </template>
                      <template v-for="cat in result.result.categories" :key="cat">
                        <div v-if="JSON.parse(cat).category != null"
                             class="text-gray-400 text-sm flex items-center px-1 py-0.5 border-2 border-gray-500 rounded-lg w-fit mr-1 pointer-events-none">
                          {{ JSON.parse(cat).category }}
                        </div>
                      </template>
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </template>
        <template v-else>
          <template v-if="wisdomGUID != null">
            <wisdomviewer :isoverlay="true" :srcguid="wisdomGUID" :chatguid="srcguid"
                          @close="wisdomGUID = undefined; isViewingWisdom = false"/>
          </template>
        </template>
      </div>
    </template>
    <template v-else>
      <div class="h-full">
        <div class="backdrop-blur p-10 backdrop-brightness-75 h-full">
          <div class="text-gray-300 mb-5 pointer-events-none">
            <span class="text-5xl font-bold">Create new Knowledge Hub</span>
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
    </template>
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
                 class="search-field py-1 px-2 bg-neutral-900 text-lg border-2 border-neutral-800"
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
    <modal @close="isWritingWisdom = false"
           v-show="isWritingWisdom">
      <template v-slot:header>
        <template v-if="isWritingLesson">Teach</template>
        <template v-else-if="isWritingQuestion">Ask</template>
      </template>
      <template v-slot:body>
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
              <Markdown :source="'# ' + wisTitle" class="w-full markedFinder" :plugins="plugins"></Markdown>
              <Markdown :source="wisDescription" class="w-full mt-4 markedFinder" :plugins="plugins"></Markdown>
            </div>
            <div class="flex mt-2 mb-4 w-full">
              <div class="mb-3 ml-auto text-black font-bold">
                <button v-on:click="createLesson()"
                        class="mr-2 py-2 px-5 border-2 border-gray-300 rounded-lg bg-gray-200 hover:bg-gray-400">
                  <template v-if="isWritingLesson">Teach</template>
                  <template v-else-if="isWritingQuestion">Ask</template>
                </button>
                <button v-on:click="deleteLesson()"
                        class="py-2 px-3 border-2 border-red-700 rounded-lg bg-red-700 hover:bg-red-900">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
      </template>
    </modal>
  </div>
</template>

<script>
import modal from '../../components/Modal.vue'
import wisdomviewer from '../../views/apps/KnowledgeView'
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
import mermaid from 'mermaid'
import * as d3 from 'd3'
import * as d3Cloud from 'd3-cloud'

export default {
  name: 'KnowledgeFinderView',
  props: {
    isoverlay: Boolean,
    srcguid: String
  },
  emits: ['close'],
  components: {
    modal,
    wisdomviewer,
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
      knowledgeExists: true,
      knowledge: {},
      // Knowledge Creation
      titleCreation: '',
      descriptionCreation: '',
      keywordsCreation: '',
      // Wisdom Creation
      wisTitle: '',
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
      isWritingQuestion: false,
      isEditingWisdom: false,
      queryText: '',
      querySubmission: '',
      emptyState: true,
      noResults: false,
      results: [],
      topWriters: [],
      questions: [],
      isViewingWisdom: false,
      wisdomGUID: '',
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
      // Get URL parameters
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop)
      })
      // Set window height
      const mainDiv = document.getElementById('knowledgeFinder')
      if (mainDiv) {
        if (!this.isoverlay) {
          mainDiv.classList.add('pt-[60px]')
        } else {
          mainDiv.classList.remove('pt-[60px]')
        }
      }
      // Focus search field
      const input = document.getElementById('search-field')
      input.focus()
      // Whose knowledge are we trying to see? Return if there is no source
      let srcGUID = this.srcguid
      let from = 'clarifier'
      if (this.srcguid != null) {
        const chatroom = await this.getClarifierChatroom(srcGUID)
        if (chatroom != null) {
          this.source = chatroom.t
        }
      } else {
        srcGUID = params.kguid
        if (!srcGUID) return
        from = 'guid'
      }
      const knowledge = await this.getKnowledge(srcGUID, from)
      if (knowledge != null) {
        this.knowledge = knowledge
      }
      // Did we already search for something?
      const queryText = params.query
      if (queryText != null) {
        this.queryText = queryText
        await this.searchWisdom()
      } else {
        await this.getRecentKeywords()
      }
      await this.getTopContributors(srcGUID)
      await this.getRecentCategories()
      await this.getRecentQuestions()
    },
    getClarifierChatroom: async function (sessionID) {
      if (!sessionID) return
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'm5/getchatroom/' + sessionID
        }).then((data) => resolve(data.result))
          .catch((err) => console.error(err.message))
      })
    },
    getKnowledge: async function (guid, from = 'clarifier') {
      if (!guid || !from) return
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'm7/get?src=' + guid + '&from=' + from
        }).then((data) => {
          this.knowledge = data.result
          if (this.knowledge.categories != null) {
            for (let i = 0; i < this.knowledge.categories.length; i++) {
              this.knowledge.categories[i] = JSON.parse(this.knowledge.categories[i])
              this.knowledge.categories[i].count = 0
            }
          }
          resolve()
        })
          .catch((err) => {
            if (err.message) this.knowledgeExists = false
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
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'm7/create',
          body: JSON.stringify(payload)
        })
          .then(() => {
            this.knowledgeExists = true
            if (this.srcguid) this.getKnowledge(this.srcguid)
          })
          .then(() => resolve())
          .catch((err) => console.error(err.message))
      })
    },
    addCategory: async function () {
      const payload = {
        action: 'add',
        category: this.newCategory
      }
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'm7/edit/categories/' + this.knowledge.gUID,
          body: JSON.stringify(payload)
        })
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
    searchWisdom: async function (substitute = null, questionsOnly = false) {
      if (!questionsOnly) {
        this.results = []
        this.emptyState = false
      }
      this.querySubmission = substitute ?? this.queryText
      if (this.querySubmission == null || this.querySubmission === '') {
        this.emptyState = true
        this.noResults = false
        await this.getTopContributors()
        await this.getRecentKeywords()
        await this.getRecentCategories()
        await this.getRecentQuestions()
        return
      }
      let entryType = ''
      // Are we looking for a specific wisdom type?
      // Extract the type using regex, looking for the pattern: "type:<userInput>"
      if (/type:\w+/g.test(this.querySubmission)) {
        // If found, extract the type by splitting away the prefix "type:"
        try {
          entryType = this.querySubmission.match(/type:\w+/g)[0].split(':')[1]
          if (entryType === 'ask' || entryType === 'q') entryType = 'question'
          if (entryType === 'ans' || entryType === 'a') entryType = 'answer'
          if (entryType === 'teach' || entryType === 'l') entryType = 'lesson'
          if (entryType === 'todo' || entryType === 't') entryType = 'task'
          if (entryType === 'reply' || entryType === 'c') entryType = 'comment'
        } catch (e) {
          console.error(e.message)
        }
      }
      let state = ''
      // Are we looking for a specific wisdom finished state?
      if (/state:\w+/g.test(this.querySubmission)) {
        try {
          state = this.querySubmission.match(/state:\w+/g)[0].split(':')[1]
          if (state === 'done' || state === 'finished') state = 'true'
          if (state === 'todo' || state === 'unfinished') state = 'false'
        } catch (e) {
          console.error(e.message)
        }
      }
      const payload = {
        query: this.querySubmission,
        entryType: entryType,
        state: state
      }
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'm7/search/' + this.knowledge.gUID,
          body: JSON.stringify(payload)
        })
          .then((data) => {
            if (!questionsOnly) this.noResults = false
            const parsedData = data.result
            let entry
            if (parsedData.first != null) {
              for (let i = 0; i < parsedData.first.length; i++) {
                parsedData.first[i].wisdom.t = this.formatTitle(parsedData.first[i].wisdom.t)
                entry = {
                  priority: 'high',
                  result: parsedData.first[i].wisdom
                }
                if (questionsOnly) {
                  this.questions.push(entry)
                } else {
                  this.results.push(entry)
                }
              }
            }
            if (parsedData.second != null) {
              for (let i = 0; i < parsedData.second.length; i++) {
                parsedData.second[i].wisdom.t = this.formatTitle(parsedData.second[i].wisdom.t)
                entry = {
                  priority: 'medium',
                  result: parsedData.second[i].wisdom
                }
                if (questionsOnly) {
                  this.questions.push(entry)
                } else {
                  this.results.push(entry)
                }
              }
            }
            if (parsedData.third != null) {
              for (let i = 0; i < parsedData.third.length; i++) {
                parsedData.third[i].wisdom.t = this.formatTitle(parsedData.third[i].wisdom.t)
                entry = {
                  priority: 'low',
                  result: parsedData.third[i].wisdom
                }
                if (questionsOnly) {
                  this.questions.push(entry)
                } else {
                  this.results.push(entry)
                }
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
          .then(() => resolve())
          .catch((err) => {
            console.error(err.message)
            if (!questionsOnly) this.noResults = true
          })
          .finally(() => {
            if (!questionsOnly) {
              const queryObj = {
                query: this.querySubmission
              }
              const params = new Proxy(new URLSearchParams(window.location.search), {
                get: (searchParams, prop) => searchParams.get(prop)
              })
              if (params.kguid) queryObj.kguid = params.kguid
              this.$router.replace({
                query: queryObj
              })
            }
          })
      })
    },
    formatTitle: function (title) {
      if (!title || title.length < 1) return ''
      if (title.startsWith('#')) {
        let cutUntil = 0
        for (let i = 0; i < title.length; i++) {
          if (title.substring(i, i + 1) === '#') {
            cutUntil++
          }
        }
        return title.substring(cutUntil).trim()
      } else {
        return title
      }
    },
    createLesson: async function () {
      const categories = []
      for (let i = 0; i < this.wisCategories.length; i++) {
        categories.push(JSON.stringify(this.wisCategories[i]))
      }
      let keywordSuffix = ''
      if (this.isWritingQuestion && !this.wisKeywords.includes('question')) {
        if (this.wisKeywords !== '') this.wisKeywords += ','
        keywordSuffix = 'question'
      }
      const payload = {
        title: this.wisTitle,
        description: this.wisDescription,
        knowledgeGUID: this.knowledge.gUID,
        keywords: this.wisKeywords + keywordSuffix,
        copyContent: this.wisCopyContent,
        categories: categories
      }
      // Lesson (teach) or Question (ask)?
      let endpoint = 'teach'
      if (this.isWritingQuestion) endpoint = 'ask'
      // Create entry on the backend
      const bodyPayload = JSON.stringify(payload)
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'm7/' + endpoint,
          body: bodyPayload
        })
          .then(() => {
            this.resetWriting()
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
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'm7/delete/' + this.wisGUID
        })
          .then(() => {
            this.resetWriting()
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
    writeWisdom: function (type = 'lesson') {
      this.wisTitle = ''
      this.wisDescription = ''
      this.wisKeywords = ''
      this.wisCopyContent = ''
      this.wisCategories = []
      this.wisGUID = ''
      this.isWritingWisdom = true
      if (type === 'lesson' || type === 'teach') this.isWritingLesson = true
      if (type === 'question' || type === 'ask') this.isWritingQuestion = true
      this.isEditingWisdom = false
      // Defaults
      this.wisTitle = this.capitalizeFirstLetter(this.queryText).trim()
    },
    resetWriting: function () {
      this.wisTitle = ''
      this.wisDescription = ''
      this.wisKeywords = ''
      this.wisCopyContent = ''
      this.wisCategories = []
      this.wisGUID = ''
      this.isWritingWisdom = false
      this.isWritingLesson = false
      this.isWritingQuestion = false
      this.isEditingWisdom = false
    },
    capitalizeFirstLetter: function ([first, ...rest], locale = navigator.language) {
      return first === undefined ? '' : first.toLocaleUpperCase(locale) + rest.join('')
    },
    getTopContributors: async function () {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'm7/topwriters/' + this.knowledge.gUID
        })
          .then((data) => {
            this.topWriters = data.result
          })
          .catch((err) => {
            console.error(err.message)
          })
          .finally(() => resolve())
      })
    },
    gotoWisdom: function (id) {
      if (id == null) return
      if (!this.isoverlay) {
        if (this.srcguid) {
          this.$router.push('/apps/knowledge/' + id + '?src=' + this.srcguid)
        } else {
          this.$router.push('/apps/knowledge/' + id)
        }
      } else {
        this.isViewingWisdom = true
        this.wisdomGUID = id
      }
    },
    wordCloud: function (text, {
      size = group => group.length, // Given a grouping of words, returns the size factor for that word
      word = d => d, // Given an item of the data array, returns the word
      marginTop = 4, // top margin, in pixels
      marginRight = 4, // right margin, in pixels
      marginBottom = 4, // bottom margin, in pixels
      marginLeft = 4, // left margin, in pixels
      width = 600, // outer width, in pixels
      height = 300, // outer height, in pixels
      maxWords = 100, // maximum number of words to extract from the text
      fontFamily = 'Lato', // font family
      fontScale = 16, // base font size
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
          size: size
        }))

      const svg = d3.create('svg')
        .attr('viewBox', [0, 0, width, height])
        .attr('width', width)
        .attr('font-family', fontFamily)
        .attr('text-anchor', 'middle')
        .attr('style', 'max-width: 100%; height: auto; height: intrinsic; font-weight: bold; font-style: italic;')

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
            .attr('font-size', size)
            .attr('fill', 'rgb(154,154,154)')
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
                .attr('fill', 'rgb(206,206,206)')
            })
        })

      cloud.start()
      invalidation && invalidation.then(() => cloud.stop())
      return svg.node()
    },
    getRecentKeywords: async function () {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'm7/keywordlist/' + this.knowledge.gUID
        })
          .then((data) => {
            let keywords = []
            if (data.result.keywords) keywords = data.result.keywords
            const svg = this.wordCloud(keywords)
            const myNode = document.getElementById('d3wordcloud')
            while (myNode.lastElementChild) {
              myNode.removeChild(myNode.lastElementChild)
            }
            myNode.appendChild(svg)
          })
          .catch((err) => {
            console.error(err.message)
          })
          .finally(() => resolve())
      })
    },
    getRecentCategories: async function () {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'm7/categorylist/' + this.knowledge.gUID
        })
          .then((data) => {
            if (!data.result.categories) return
            if (this.knowledge && this.knowledge.categories) {
              for (let i = 0; i < data.result.categories.length; i++) {
                const category = data.result.categories[i]
                for (let j = 0; j < this.knowledge.categories.length; j++) {
                  if (this.knowledge.categories[j].category === category.category) {
                    this.knowledge.categories[j].count = category.count
                  }
                }
              }
            }
          })
          .catch((err) => {
            console.error(err.message)
          })
          .finally(() => resolve())
      })
    },
    startAddingCategory: function () {
      this.isAddingCategory = true
      setTimeout(() => {
        const input = document.getElementById('new_category')
        input.focus()
      }, 0)
    },
    clickedBack: function () {
      if (!this.isoverlay) {
        this.$router.back()
      } else {
        this.$emit('close')
      }
    },
    getHumanReadableDateText: function (date, withTime = false) {
      const date2 = new Date()
      const diffTime = Math.abs(date2 - date)
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (date.getDate() === date2.getDate() &&
        date.getMonth() === date2.getMonth() &&
        date.getFullYear() === date2.getFullYear()) {
        diffDays = 0
      }
      let suffix = ''
      if (withTime) {
        suffix = ', ' + date.toLocaleTimeString('de-DE')
      }
      if (diffDays === 0) {
        return 'Today' + suffix
      } else if (diffDays === 1) {
        return 'Yesterday' + suffix
      } else if (diffDays === 2) {
        return '2 days ago' + suffix
      } else {
        return date.toLocaleDateString('de-DE') + suffix
      }
    },
    getRecentQuestions: async function () {
      this.questions = []
      await this.searchWisdom('type:question state:false question', true)
      return new Promise((resolve) => {
        resolve()
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
  @apply text-xl font-bold;
}

.markedFinder h2 {
  @apply text-base my-4 font-bold;
}

.markedFinder h3 {
  @apply text-base my-4 font-bold;
}

.markedFinder h4 {
  @apply text-base my-2 font-bold;
}

.markedFinder h5 {
  @apply text-base my-2 font-bold;
}

.markedFinder h6 {
  @apply text-base my-1 font-bold;
}

.markedFinder p code {
  @apply py-0.5 px-1 rounded-md mx-1 font-bold bg-neutral-700 text-neutral-400 my-2;
}

.markedFinder hr {
  @apply my-6 h-[4px] w-full;
}

.markedFinder > :last-child {
  @apply mb-0 !important;
}

.markedFinder > :first-child {
  @apply mt-0 !important;
}

.gray-hover:hover {
  @apply bg-neutral-700 text-neutral-200;
  cursor: pointer;
  border-radius: 10px;
}

.kf_category {
  @apply font-bold text-xs text-neutral-400 bg-black bg-opacity-40 cursor-default mb-1 flex items-center text-center px-3 rounded-full hover:border-gray-100 hover:text-gray-100 h-8;
}

.result {
  @apply my-1 relative text-gray-300 px-3 py-3 border-y border-y-zinc-700;
}

.result:hover {
  @apply bg-zinc-700 bg-opacity-50;
  box-shadow: 0 0 0 1px rgb(82 82 91);
}

</style>
