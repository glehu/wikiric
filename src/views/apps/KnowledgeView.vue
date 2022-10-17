<template>
  <div class="flex mx-2 pt-[60px] h-screen overflow-hidden">
    <div id="sidebar"
         class="h-full min-w-[60px] max-w-[60px] border-r border-neutral-700 flex flex-col items-center overflow-y-auto">
      <div class="text-neutral-400 mr-2 pt-2">
        <div class="sidebar_button rounded-full">
          <div v-on:click="$router.back()"
               class="cursor-pointer hover:text-neutral-200 p-2">
            <XMarkIcon class="h-8 w-8"></XMarkIcon>
          </div>
          <div class="sidebar_tooltip">Exit</div>
        </div>
        <div class="my-2 py-2 border-y border-neutral-700">
          <div class="sidebar_button rounded-full">
            <div v-on:click="reactToMessage(wisdom, '+')"
                 class="cursor-pointer hover:text-neutral-200 p-2">
              <HandThumbUpIcon class="h-8 w-8"></HandThumbUpIcon>
            </div>
            <div class="sidebar_tooltip">Upvote</div>
          </div>
          <div class="sidebar_button rounded-full">
            <div v-on:click="reactToMessage(wisdom, '-')"
                 class="cursor-pointer hover:text-neutral-200 p-2">
              <HandThumbDownIcon class="h-8 w-8"></HandThumbDownIcon>
            </div>
            <div class="sidebar_tooltip">Downvote</div>
          </div>
          <div class="sidebar_button rounded-full">
            <div v-on:click="reactToMessage(wisdom, '⭐')"
                 class="cursor-pointer hover:text-neutral-200 p-2">
              <StarIcon class="h-8 w-8"></StarIcon>
            </div>
            <div class="sidebar_tooltip">Wow!</div>
          </div>
        </div>
        <div v-if="wisdom.copyContent != null"
             class="sidebar_button rounded-full">
          <div v-on:click="copy(wisdom.copyContent)"
               class="cursor-pointer hover:text-neutral-200 p-2">
            <ClipboardIcon class="h-8 w-8"></ClipboardIcon>
          </div>
          <div class="sidebar_tooltip">QuickCopy</div>
        </div>
      </div>
    </div>
    <div id="main" class="h-full w-full lg:px-[10vw] flex justify-center overflow-y-auto pb-10">
      <div class="h-fit w-full pt-4 px-4">
        <div class="flex mb-2 items-center">
          <TagIcon class="text-neutral-400 h-5 w-5 mr-2"></TagIcon>
          <template v-if="wisdom.categories">
            <template v-for="cat in wisdom.categories" :key="cat">
              <div v-if="JSON.parse(cat).category != null"
                   class="text-neutral-400 flex items-center py-0.5 px-1.5 rounded mr-1 pointer-events-none text-sm font-bold"
                   style="border: 1px solid #424242">
                {{ JSON.parse(cat).category }}
              </div>
            </template>
          </template>
          <template v-else>
            <div class="text-neutral-600 text-xs pointer-events-none">
              (No Categories)
            </div>
          </template>
        </div>
        <div class="text-neutral-400 mb-4 flex items-center">
          <div class="flex pointer-events-none items-center">
            <p class="mr-2 pr-2 border-r border-neutral-700 font-bold">
              {{ capitalizeFirstLetter(wisdom.type) }}
            </p>
            <p> {{ wisdom.author }} </p>
          </div>
          <template v-if="wisdom.reacts != null">
            <div class="flex ml-5">
              <div v-for="reaction in wisdom.reacts" :key="reaction.src"
                   class="flex items-center p-1 mr-1 text-neutral-400 cursor-pointer hover:text-white"
                   :title="JSON.parse(reaction).src.toString() + ' reacted to this.'"
                   v-on:click="reactToMessage(wisdom, JSON.parse(reaction).t)"
                   :id="'react_' + wisdom.gUID + '_' + JSON.parse(reaction).t">
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
          </template>
          <template v-else>
            <div class="text-neutral-600 text-xs ml-5 pointer-events-none">
              (Unrated)
            </div>
          </template>
          <template v-if="related.comments != null">
            <div class="flex ml-4 items-center p-1 text-neutral-400 cursor-pointer hover:text-white"
                 v-on:click="gotoComments()"
                 title="Go to Comments">
              <ChatBubbleLeftEllipsisIcon class="h-6 w-6 mr-1"></ChatBubbleLeftEllipsisIcon>
              {{ related.comments.length }}
            </div>
          </template>
          <template v-else>
            <div class="text-neutral-600 text-xs ml-5 pointer-events-none">
              (No Comments)
            </div>
          </template>
        </div>
        <div class="flex">
          <Markdown class="markedView text-neutral-300 font-bold"
                    :source="wisdom.t"
                    :plugins="plugins"></Markdown>
          <div v-on:click="editWisdom(wisdom)"
               class="cursor-pointer flex items-center text-neutral-400 w-fit ml-auto hover:text-white">
            <PencilSquareIcon class="h-6 w-6 mr-1"></PencilSquareIcon>
            Edit
          </div>
        </div>
        <hr class="text-neutral-700 opacity-100 mb-3">
        <!-- Main Content -->
        <Markdown class="markedView text-neutral-400"
                  :source="wisdom.desc"
                  :plugins="plugins"></Markdown>
        <!-- Comments/Answers -->
        <div id="wisdomComments" class="w-full mt-10 pt-10">
          <div class="w-full relative">
            <div
              class="p-2 rounded-full hover:bg-neutral-700 text-neutral-500 hover:text-neutral-200 absolute right-0 sidebar_button cursor-pointer -translate-y-1">
              <Squares2X2Icon
                class="h-6 w-6"></Squares2X2Icon>
              <div class="-translate-x-5 translate-y-2.5">
                <div class="sidebar_tooltip text-neutral-400">Preview</div>
              </div>
            </div>
            <textarea type="text" id="input_comment" v-model="wisComment" rows="1"
                      class="w-[calc(100%-50px)] border-b border-neutral-500 text-neutral-300 bg-neutral-600 bg-opacity-20 focus:outline-none px-2 py-1"
                      v-on:keyup="auto_grow">
            </textarea>
          </div>
          <label for="input_comment"
                 class="text-neutral-600">
            Write a comment
          </label>
          <template v-if="related.comments == null">
            <div class="flex w-full items-center justify-content-center py-4">
              <div class="w-full text-neutral-600 pointer-events-none">
                <CubeTransparentIcon class="h-8 w-8 mx-auto"></CubeTransparentIcon>
                <p class="text-md font-bold italic w-fit mx-auto">No Comments</p>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="flex items-center mt-4 mb-2 pointer-events-none">
              <ChatBubbleLeftEllipsisIcon class="w-6 h-6 mr-2 text-neutral-500"></ChatBubbleLeftEllipsisIcon>
              <p class="text-neutral-400 text-2xl italic">
                {{ related.comments.length }} {{ commentsText }}:
              </p>
            </div>
            <div v-for="comment in related.comments" :key="comment.uID"
                 class="mb-2 w-full bg-neutral-800 bg-opacity-60 rounded-r-xl rounded-l-lg border-b-2 border-r-2 border-b-neutral-700 border-r-neutral-700">
              <Markdown :source="comment.desc"
                        class="text-neutral-300 w-full markedView py-3 px-3"
                        :plugins="plugins"></Markdown>
              <div class="flex w-full">
                <div
                  class="text-neutral-400 ml-auto bg-neutral-700 bg-opacity-40 rounded-br-xl rounded-tl-xl py-1 px-2 min-w-[20%] justify-content-between flex items-center">
                  <p class="text-neutral-500 text-xs mr-2">{{ comment.cdate }}</p>
                  <p class="text-xl">{{ comment.author }}</p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div id="rightbar"
         class="h-full w-[400px] border-l border-neutral-700 overflow-y-auto hidden lg:block">
      <div class="ml-2 mt-2 rounded-xl text-neutral-300 py-2 px-3">
        <table class="border-none mb-2 pointer-events-none">
          <tr>
            <th class="text-neutral-400 text-xs pr-2">Author</th>
            <td class="text-sm">{{ wisdom.author }}</td>
          </tr>
          <tr>
            <th class="text-neutral-400 text-xs pr-2">Source</th>
            <td class="text-sm">{{ knowledge.t }}</td>
          </tr>
          <tr>
            <th class="text-neutral-400 text-xs pr-2">Date</th>
            <td class="text-sm">{{ new Date(wisdom.cdate).toLocaleString('de-DE').replace(' ', '&nbsp;') }}</td>
          </tr>
        </table>
        <template v-if="!this.$store.getters.hasSeenWisdomTutorial()">
          <div id="wisdomTutorial"
               class="rounded-xl relative my-4 text-neutral-300">
            <div class="bg-slate-700 rounded-t-xl p-2">
              <XMarkIcon v-on:click="dismissTutorial()"
                         class="h-6 w-6 absolute top-2 right-2 hover:text-white cursor-pointer hover:bg-neutral-600 rounded-xl">
              </XMarkIcon>
              <div class="font-bold ml-1">Hey!</div>
            </div>
            <div class="bg-slate-800 rounded-b-xl p-3 text-sm text-justify">
              Welcome to the the new Wisdom Viewer, now with less distraction!
              <br><br>
              Find out about how things work, rate articles and enjoy the power of
              <span class="font-bold">QuickCopy</span>.
              <br><br>
              By the way... you can now collaborate with others! Comment on their wisdom to share your experiences
              and/or opinions!
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <!-- EDIT MODAL -->
  <modal @close="isWritingLesson = false"
         v-show="isWritingLesson">
    <template v-slot:header>
      <span class="text-3xl font-bold">Edit</span>
    </template>
    <template v-slot:body>
      <div class="flex">
        <div class="mb-3">
          <button v-on:click="editLesson()"
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
                      <div class="block truncate font-bold text-neutral-300">
                        {{ wisCategories.map((cat) => cat.category).join(', ') }}
                      </div>
                    </template>
                    <template v-else>
                      <span class="block truncate font-bold text-neutral-500">Select...</span>
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
                                  'relative cursor-pointer select-none py-2 pl-10 pr-4 text-neutral-200' ]">
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
            <Markdown :source="wisTitle" class="w-full markedView" :plugins="plugins"></Markdown>
            <Markdown :source="wisDescription" class="w-full mt-4 markedView" :plugins="plugins"></Markdown>
          </div>
          <template v-if="wisCopyContent != null">
            <p class="text-xl my-2 pointer-events-none font-bold">Copy Content:</p>
            <div class="bg-neutral-900 rounded-xl p-2">
              <Markdown :source="wisCopyContent" class="w-full markedView" :plugins="plugins"></Markdown>
            </div>
          </template>
        </div>
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
</template>

<script>
import modal from '../../components/Modal.vue'
import { Base64 } from 'js-base64'
import Markdown from 'vue3-markdown-it'
import markdownItMermaid from 'markdown-it-mermaid'
import 'highlight.js/styles/hybrid.css'
import mermaid from 'mermaid'
import {
  HandThumbDownIcon,
  HandThumbUpIcon,
  StarIcon,
  XMarkIcon,
  ClipboardIcon,
  TagIcon,
  PencilSquareIcon,
  CubeTransparentIcon,
  ChatBubbleLeftEllipsisIcon
} from '@heroicons/vue/24/outline'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/vue'
import {
  CheckIcon,
  ArrowsUpDownIcon,
  Squares2X2Icon
} from '@heroicons/vue/24/solid'

export default {
  name: 'KnowledgeView',
  components: {
    modal,
    Markdown,
    ClipboardIcon,
    HandThumbUpIcon,
    HandThumbDownIcon,
    StarIcon,
    XMarkIcon,
    TagIcon,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    CheckIcon,
    ArrowsUpDownIcon,
    PencilSquareIcon,
    CubeTransparentIcon,
    Squares2X2Icon,
    ChatBubbleLeftEllipsisIcon
  },
  data () {
    return {
      // Wisdom Creation
      wisTitle: '## ',
      wisDescription: '',
      wisKeywords: '',
      wisCopyContent: '',
      wisCategories: [],
      wisGUID: '',
      isWritingWisdom: false,
      isWritingLesson: false,
      isEditingWisdom: false,
      isWritingComment: false,
      // ---
      knowledge: {},
      wisdom: {
        type: ''
      },
      related: {
        answers: [],
        comments: []
      },
      wisComment: '',
      inputComment: null,
      plugins: [
        {
          plugin: markdownItMermaid
        }
      ]
    }
  },
  created () {
    this.fetchData()
  },
  mounted () {
    this.initFunction()
  },
  computed: {
    commentsText: function () {
      if (this.related.comments != null) {
        if (this.related.comments.length > 1) {
          return 'Comments'
        } else {
          return 'Comment'
        }
      } else {
        return ''
      }
    }
  },
  methods: {
    fetchData: async function () {
      await this.serverLogin()
      await this.getWisdom()
      await this.getRelated()
      // Whose knowledge are we trying to see?
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop)
      })
      const srcGUID = params.src
      if (srcGUID != null) {
        const knowledge = await this.getKnowledge(srcGUID)
        if (knowledge != null) {
          this.knowledge = knowledge
        }
      }
      return new Promise((resolve) => {
        resolve()
      })
    },
    initFunction: async function () {
      this.renderMermaidInit()
      const input = document.getElementById('input_comment')
      input.addEventListener('keydown', this.handleEnter, false)
      this.inputComment = document.getElementById('input_comment')
      // this.mainContent = document.getElementById('')
      this.auto_grow()
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
    getWisdom: async function () {
      return new Promise((resolve) => {
        const headers = new Headers()
        headers.set('Authorization', 'Bearer ' + this.$store.state.token)
        fetch(
          this.$store.state.serverIP + '/api/m7/learn/' + this.$route.params.id,
          {
            method: 'get',
            headers: headers
          }
        )
          .then((res) => res.json())
          .then((data) => {
            this.wisdom = data
            this.wisGUID = data.gUID
            resolve()
          })
          .catch((err) => {
            console.error(err.message)
          })
      })
    },
    getRelated: async function () {
      return new Promise((resolve) => {
        const headers = new Headers()
        headers.set('Authorization', 'Bearer ' + this.$store.state.token)
        fetch(
          this.$store.state.serverIP + '/api/m7/investigate/' + this.$route.params.id,
          {
            method: 'get',
            headers: headers
          }
        )
          .then((res) => res.json())
          .then((data) => {
            this.related = data
          })
          .then(() => {
            this.renderMermaid()
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
            this.getWisdom()
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
    copy: function (parameter) {
      navigator.clipboard.writeText(parameter)
      this.$notify(
        {
          title: 'Quick Copy Done!',
          text: 'CTRL-V to paste.',
          type: 'info'
        })
    },
    capitalizeFirstLetter: function ([first, ...rest], locale = navigator.language) {
      return first === undefined ? '' : first.toLocaleUpperCase(locale) + rest.join('')
    },
    dismissTutorial: function () {
      const elem = document.getElementById('wisdomTutorial')
      if (elem) {
        elem.remove()
      }
      this.$store.commit('setWisdomTutorialSeen', true)
    },
    editLesson: async function () {
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
      const extension = '?guid=' + this.wisGUID
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
            this.resetValues()
            this.getWisdom()
          })
          .then(() => resolve)
          .catch((err) => {
            console.error(err.message)
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
            this.resetValues()
            this.$notify(
              {
                title: 'Wisdom deleted.',
                text: '',
                type: 'info'
              })
            this.$router.back()
          })
          .then(() => resolve)
          .catch((err) => {
            this.$notify(
              {
                title: 'Error!',
                text: 'Maybe you aren\'t the owner of the Wisdom.',
                type: 'error'
              })
            console.error(err.message)
          })
      })
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
      if (wisdom.categories != null && wisdom.categories.length > 0) {
        for (let i = 0; i < wisdom.categories.length; i++) {
          this.wisCategories.push(JSON.parse(wisdom.categories[i]))
        }
      }
      this.wisCopyContent = wisdom.copyContent
      this.wisGUID = wisdom.gUID
      setTimeout(() => {
        mermaid.init()
      }, 0)
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
    renderMermaidInit: function () {
      setTimeout(() => {
        mermaid.initialize({
          startOnLoad: true,
          theme: 'dark'
        })
        setTimeout(() => {
          mermaid.init()
        }, 0)
      }, 0)
    },
    renderMermaid: function () {
      setTimeout(() => {
        mermaid.init()
      }, 0)
    },
    handleEnter: function () {
      if (event.key === 'Enter') {
        if (event.shiftKey) return
        event.preventDefault()
        this.submitComment()
      }
    },
    submitComment: function () {
      if (!this.isWritingComment) {
        this.postComment(this.wisComment)
      } else {
        this.postComment(this.wisDescription, this.wisTitle)
      }
    },
    postComment: async function (comment, title = '') {
      if (comment.trim() === '') return
      const payload = {
        title: title,
        description: comment.trim(),
        wisdomGUID: this.wisGUID,
        keywords: ''
      }
      const bodyPayload = JSON.stringify(payload)
      return new Promise((resolve) => {
        const headers = new Headers()
        headers.set('Authorization', 'Bearer ' + this.$store.state.token)
        fetch(
          this.$store.state.serverIP + '/api/m7/reply',
          {
            method: 'post',
            headers: headers,
            body: bodyPayload
          }
        )
          .then(() => {
            this.getRelated()
            this.resetValues()
            this.$notify(
              {
                title: 'Comment submitted.',
                text: 'Thanks for your contribution!',
                type: 'info'
              })
            setTimeout(() => {
              this.inputComment.blur()
              this.auto_grow()
            }, 0)
          })
          .then(() => resolve)
          .catch((err) => {
            console.error(err.message)
          })
      })
    },
    resetValues: function () {
      this.wisTitle = '## '
      this.wisDescription = ''
      this.wisKeywords = ''
      this.wisCopyContent = ''
      this.wisCategories = []
      this.wisComment = ''
      this.isWritingWisdom = false
      this.isWritingLesson = false
      this.isEditingWisdom = false
    },
    auto_grow: function () {
      this.inputComment.style.height = '36px' // Default
      this.inputComment.style.height = (this.inputComment.scrollHeight) + 'px' // Grow if scrollHeight > 0
      // this.mainContent.style.bottom = (this.inputComment.scrollHeight - 40) + 'px'
    },
    gotoComments: function () {
      document.getElementById('wisdomComments').scrollIntoView({ behavior: 'smooth' })
    }
  }
}
</script>

<style>

.markedView p {
  @apply mb-4;
}

.markedView p:last-child {
  @apply m-0;
}

.markedView a {
  @apply underline;
}

.markedView ul {
  @apply list-disc list-inside mb-2;
}

.markedView ol {
  @apply list-decimal list-inside mb-2;
}

.markedView pre {
  @apply mb-2;
}

.markedView table {
  @apply mb-4;
}

.markedView th, .markedView td {
  @apply p-2 border border-slate-700;
}

.markedView tr {
  @apply hover:bg-neutral-800;
}

.markedView h1 {
  @apply text-5xl mb-2;
}

.markedView h2 {
  @apply text-4xl mb-2;
}

.markedView h3 {
  @apply text-3xl mb-2;
}

.markedView h4 {
  @apply text-2xl mb-2;
}

.markedView h5 {
  @apply text-xl mb-2;
}

.markedView h6 {
  @apply text-lg;
}

.sidebar_tooltip {
  @apply absolute translate-x-16 -translate-y-9 opacity-0 font-bold pointer-events-none hidden lg:block;
}

.sidebar_button:hover {
  @apply bg-neutral-700;
}

.sidebar_button:hover .sidebar_tooltip {
  @apply opacity-100;
}

</style>
