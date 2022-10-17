<template>
  <div class="flex w-screen h-screen pt-[60px]">
    <div id="sidebar"
         class="h-full min-w-[265px] bg-slate-700 border-r border-neutral-600">
      <div class="py-1 shadow rounded-none min-h-[80px] flex items-center">
        <div class="flex items-center">
          <div v-on:click="$router.push(
                  '/apps/clarifier/wss/' + srcGUID
                )"
               class="h-full ml-4 mr-2 px-1 py-2 rounded-xl text-center text-gray-300 hover:text-orange-500 cursor-pointer">
            <i class="sb_link_icon bi bi-x-square text-xl"></i>
          </div>
          <div class="font-bold w-full overflow-x-hidden pr-2">
            <div class="py-2 px-1 text-gray-100 pointer-events-none">
              <div class="text-xl border-l border-gray-300 pl-5">
                {{ this.knowledge.t }}
              </div>
              <div class="border-l border-gray-300 pl-5 text-gray-300 text-xs">
                {{ this.knowledge.desc }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center mt-8 cursor-pointer hover:bg-neutral-800 bg-opacity-50 py-2"
           v-on:click="getBoxes(false)">
        <div class="h-full ml-4 mr-2 px-1 rounded-xl text-neutral-300">
          <ArrowPathIcon class="h-6 w-6"></ArrowPathIcon>
        </div>
        <div class="font-bold text-neutral-300">
          Reload Tasks
        </div>
      </div>
    </div>
    <div id="board"
         class="h-full w-full flex p-1 bg-neutral-900 overflow-x-auto overflow-y-auto">
      <template v-if="boxes.length > 0">
        <template v-for="box in boxes" :key="box.uID">
          <div class="p_card">
            <div class="p_card_header_section relative text-neutral-300 flex items-center pb-1">
              <Markdown class="p_markdown p_markdown_xl_only font-bold"
                        :source="box.box.t"
                        :plugins="plugins"></Markdown>
              <div class="ml-auto absolute top-0 right-0 h-full flex items-center">
                <template v-if="box.tasks">
                  <div class="ml-auto pl-2 font-bold flex items-center cursor-default"
                       :title="'Tasks: ' + box.tasks.length">
                    <InboxIcon class="h-4 w-4 mr-1"></InboxIcon>
                    <p>{{ box.tasks.length }}</p>
                  </div>
                </template>
                <Menu as="div" class="relative inline-block text-left">
                  <MenuButton
                    title="Options"
                    class="hover:bg-neutral-900 p-1 ml-2 bg-opacity-50 rounded flex items-center cursor-pointer">
                    <EllipsisVerticalIcon class="h-5 w-5"></EllipsisVerticalIcon>
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
                      class="p_card_menu_list"
                    >
                      <div class="px-1 py-1">
                        <MenuItem v-slot="{ active }">
                          <button v-on:click="finishTask(box.box, true)"
                                  :class="[active ? 'p_card_menu_active' : 'text-gray-900','group p_card_menu_item']">
                            <TrashIcon
                              :active="active"
                              class="mr-2 h-5 w-5"
                              aria-hidden="true"
                            />
                            Delete
                          </button>
                        </MenuItem>
                      </div>
                      <div class="px-1 py-1">
                        <MenuItem v-slot="{ active }">
                          <button
                            :class="[active ? 'p_card_menu_active' : 'text-gray-900','group p_card_menu_item']">
                            <ArrowsPointingOutIcon
                              :active="active"
                              class="mr-2 h-5 w-5"
                              aria-hidden="true"
                            />
                            Move
                          </button>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </transition>
                </Menu>
              </div>
            </div>
            <div v-if="box.tasks" class="mb-4">
              <template v-for="task in box.tasks" :key="task.uID">
                <div class="p_task bg-neutral-900 bg-opacity-75 rounded mb-2 flex items-center relative w-full">
                  <div class="w-full h-full cursor-pointer hover:border rounded py-1 px-2"
                       v-on:click="openTask(task)">
                    <div class="flex mb-2 items-center">
                      <template v-if="task.categories">
                        <template v-for="cat in task.categories" :key="cat">
                          <div v-if="JSON.parse(cat).category != null"
                               class="text-white bg-orange-900 flex items-center px-0.5 px-1 rounded mr-1 pointer-events-none text-xs">
                            {{ JSON.parse(cat).category }}
                          </div>
                        </template>
                      </template>
                    </div>
                    <Markdown class="p_markdown p_markdown_xl_only font-bold text-neutral-300 w-full"
                              :source="task.t"
                              :plugins="plugins"></Markdown>
                    <Markdown class="p_markdown p_markdown_xl_only text-neutral-400 text-sm mt-2 w-full"
                              :source="task.desc"
                              :plugins="plugins"></Markdown>
                    <div class="flex mt-2">
                      <div class="ml-auto flex items-center">
                        <div class="text-xs text-neutral-500 ml-1">
                          {{ task.author }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="ml-auto absolute top-0 right-0 h-full">
                    <Menu as="div" class="relative inline-block text-left h-full">
                      <MenuButton
                        title="Options"
                        class="p_task_overlay hover:bg-neutral-600 rounded m-1 p-1 backdrop-blur-3xl flex items-center cursor-pointer">
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
                          class="p_card_menu_list"
                        >
                          <div class="px-1 py-1">
                            <MenuItem v-slot="{ active }">
                              <button v-on:click="finishTask(task)"
                                      :class="[active ? 'p_card_menu_active' : 'text-gray-900','group p_card_menu_item']">
                                <CheckIcon
                                  :active="active"
                                  class="mr-2 h-5 w-5"
                                  aria-hidden="true"
                                />
                                Finish
                              </button>
                            </MenuItem>
                            <MenuItem v-slot="{ active }">
                              <button v-on:click="finishTask(task, true)"
                                      :class="[active ? 'p_card_menu_active' : 'text-gray-900','group p_card_menu_item']">
                                <TrashIcon
                                  :active="active"
                                  class="mr-2 h-5 w-5"
                                  aria-hidden="true"
                                />
                                Delete
                              </button>
                            </MenuItem>
                          </div>
                          <div class="px-1 py-1">
                            <MenuItem v-slot="{ active }">
                              <button
                                :class="[active ? 'p_card_menu_active' : 'text-gray-900','group p_card_menu_item']">
                                <ArrowsPointingOutIcon
                                  :active="active"
                                  class="mr-2 h-5 w-5"
                                  aria-hidden="true"
                                />
                                Move
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
            <div class="relative flex items-center cursor-pointer">
              <PlusCircleIcon class="h-6 w-6 mx-1 absolute text-neutral-400"></PlusCircleIcon>
              <div class="p_input p_input_icon text-neutral-400"
                   v-on:click="toggleAndFocusNewTask('taskname_' + box.box.uID)">
                Add a Task
              </div>
            </div>
            <div :id="'taskname_' + box.box.uID"
                 class="w-full hidden mt-4 p_new_task_disclosure relative">
              <p class="absolute pt-1 pl-2 text-neutral-400">##</p>
              <input :id="'taskname_' + box.box.uID + '_input'"
                     type="text"
                     class="p_input w-full font-bold"
                     style="padding-left: 2rem"
                     placeholder="Title"
                     v-model="newTask.name"
                     v-on:keydown="newTaskKeyUp(box.box)">
              <textarea :id="'taskname_' + box.box.uID + '_desc'"
                        type="text" v-model="newTask.description"
                        rows="1"
                        class="p_input w-full mt-2"
                        placeholder="Description"
                        v-on:keydown="newTaskKeyUp(box.box)"
                        v-on:keyup="auto_grow('taskname_' + box.box.uID + '_desc')"></textarea>
            </div>
          </div>
        </template>
      </template>
      <div id="new_box" class="p_card">
        <div class="p_card_header_section flex relative items-center">
          <PlusCircleIcon class="h-6 w-6 mx-1 absolute"></PlusCircleIcon>
          <input type="text" class="p_input p_input_icon w-full" placeholder="New Box..."
                 v-model="newBox.name"
                 v-on:keydown="newBoxKeyUp">
        </div>
      </div>
    </div>
  </div>
  <modal @close="isShowingTask = false"
         v-show="isShowingTask">
    <template v-slot:header>
      <span class="text-3xl font-bold">Task</span>
    </template>
    <template v-slot:body>
      <div class="w-full sm:w-[540px] bg-neutral-900 p-2 rounded">
        <Markdown class="p_markdown font-bold text-neutral-300 w-full"
                  :source="showingTask.t"
                  :plugins="plugins"></Markdown>
        <Markdown class="p_markdown text-neutral-400 w-full"
                  :source="showingTask.desc"
                  :plugins="plugins"></Markdown>
      </div>
    </template>
    <template v-slot:footer>
      <div id="wisdomComments" class="w-full mt-6">
        <div class="w-full relative">
          <div
            class="p-2 rounded-full hover:bg-neutral-700 text-neutral-300 hover:text-white absolute right-0 sidebar_button cursor-pointer -translate-y-1">
            <Squares2X2Icon class="h-6 w-6"></Squares2X2Icon>
            <div class="-translate-x-5 translate-y-2.5">
              <div class="sidebar_tooltip text-neutral-400">Preview</div>
            </div>
          </div>
          <textarea type="text" id="input_comment" v-model="showingTaskComment" rows="1"
                    placeholder="Write a comment"
                    class="w-[calc(100%-50px)] border-b border-neutral-400 text-neutral-300 bg-neutral-600 bg-opacity-20 focus:outline-none px-2 py-1"
                    v-on:keyup="auto_grow('input_comment')">
            </textarea>
        </div>
        <template v-if="showingTaskRelated.comments == null">
          <div class="flex w-full items-center justify-content-center py-4">
            <div class="w-full text-neutral-600 pointer-events-none">
              <CubeTransparentIcon class="h-8 w-8 mx-auto"></CubeTransparentIcon>
              <p class="text-md font-bold italic w-fit mx-auto">No Comments</p>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="flex items-center mt-4 mb-2 pointer-events-none">
            <ChatBubbleLeftEllipsisIcon class="w-6 h-6 mr-2 text-neutral-300"></ChatBubbleLeftEllipsisIcon>
            <p class="text-neutral-300 font-bold">
              {{ showingTaskRelated.comments.length }} {{ commentsText }}:
            </p>
          </div>
          <div v-for="comment in showingTaskRelated.comments" :key="comment.uID"
               class="mb-2 w-full bg-neutral-800 bg-opacity-60 rounded-r-xl rounded-l-lg border-b-2 border-r-2 border-b-neutral-700 border-r-neutral-700">
            <Markdown :source="comment.desc"
                      class="text-neutral-300 w-full markedView py-1 px-2"
                      :plugins="plugins"></Markdown>
            <div class="flex w-full">
              <div
                class="text-neutral-400 ml-auto bg-neutral-700 bg-opacity-40 rounded-br-xl rounded-tl-xl py-1 px-2 min-w-[20%] justify-content-between flex items-center">
                <p class="text-neutral-500 text-xs mr-2">{{ comment.cdate }}</p>
                <p class="">{{ comment.author }}</p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </modal>
</template>

<script>

import {
  PlusCircleIcon,
  SquaresPlusIcon,
  ArrowPathIcon,
  EllipsisVerticalIcon,
  CubeTransparentIcon,
  ChatBubbleLeftEllipsisIcon
} from '@heroicons/vue/24/outline'
import {
  InboxIcon,
  TrashIcon,
  CheckIcon,
  ArrowsPointingOutIcon,
  Squares2X2Icon
} from '@heroicons/vue/24/solid'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { Base64 } from 'js-base64'
import Markdown from 'vue3-markdown-it'
import markdownItMermaid from 'markdown-it-mermaid'
import 'highlight.js/styles/hybrid.css'
import mermaid from 'mermaid'
import modal from '../../components/Modal.vue'

export default {
  name: 'PlannerNewView',
  components: {
    modal,
    Markdown,
    PlusCircleIcon,
    InboxIcon,
    SquaresPlusIcon,
    ArrowPathIcon,
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    TrashIcon,
    CheckIcon,
    ArrowsPointingOutIcon,
    EllipsisVerticalIcon,
    CubeTransparentIcon,
    ChatBubbleLeftEllipsisIcon,
    Squares2X2Icon
  },
  data () {
    return {
      srcGUID: '',
      knowledge: {},
      knowledgeExists: false,
      boxes: [],
      newBox: {
        name: ''
      },
      newTask: {
        name: '',
        description: ''
      },
      inputComment: null,
      isShowingTask: false,
      showingTask: {},
      showingTaskRelated: [],
      showingTaskComment: '',
      plugins: [
        {
          plugin: markdownItMermaid
        }
      ]
    }
  },
  computed: {
    commentsText: function () {
      if (this.showingTaskRelated.comments != null) {
        if (this.showingTaskRelated.comments.length > 1) {
          return 'Comments'
        } else {
          return 'Comment'
        }
      } else {
        return ''
      }
    }
  },
  mounted () {
    this.renderMermaidInit()
    this.initFunction()
  },
  methods: {
    initFunction: async function () {
      await this.serverLogin()
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop)
      })
      // Whose knowledge are we trying to see?
      const srcGUID = params.src
      if (srcGUID == null) {
        return
      }
      this.srcGUID = srcGUID
      const input = document.getElementById('input_comment')
      input.addEventListener('keydown', this.handleEnter, false)
      this.inputComment = document.getElementById('input_comment')
      await this.getKnowledge(srcGUID)
      await this.getBoxes()
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
    getBoxes: async function (silent = true) {
      return new Promise((resolve) => {
        const headers = new Headers()
        headers.set('Authorization', 'Bearer ' + this.$store.state.token)
        fetch(
          this.$store.state.serverIP + '/api/m7/tasks/' + this.knowledge.gUID,
          {
            method: 'get',
            headers: headers
          }
        )
          .then((res) => res.json())
          .then((data) => {
            this.boxes = data.boxes.reverse()
            for (let i = 0; i < this.boxes.length; i++) {
              if (this.boxes[i].tasks) {
                this.boxes[i].tasks = this.boxes[i].tasks.reverse()
              }
            }
            this.renderMermaid()
            if (!silent) {
              this.$notify(
                {
                  title: 'Success',
                  text: 'You\'re up to date now.',
                  type: 'info'
                })
            }
            resolve()
          })
          .catch((err) => {
            console.error(err.message)
          })
      })
    },
    newBoxKeyUp: function () {
      if (event.key === 'Enter') {
        if (event.shiftKey) return
        if (this.newBox.name.trim() !== '') {
          this.createBox()
        }
      }
    },
    newTaskKeyUp: function (box) {
      if (event.key === 'Enter') {
        if (event.shiftKey) return
        if (this.newTask.name.trim() !== '') {
          this.createTask(box)
        }
      }
    },
    createBox: async function () {
      await this.serverLogin()
      const categories = []
      let boxColumn = 0
      if (this.boxes.length > 0) {
        boxColumn = this.boxes.length
      }
      const payload = {
        title: this.newBox.name,
        description: '',
        knowledgeGUID: this.knowledge.gUID,
        keywords: '',
        copyContent: '',
        categories: categories,
        isTask: true,
        taskType: 'box',
        columnIndex: boxColumn,
        rowIndex: 0
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
            this.newBox.name = ''
            this.getBoxes()
          })
          .then(() => resolve)
          .catch((err) => {
            console.error(err.message)
            this.noResults = true
          })
      })
    },
    createTask: async function (box) {
      await this.serverLogin()
      const categories = []
      const boxColumn = box.columnIndex
      const payload = {
        title: '## ' + this.newTask.name,
        description: this.newTask.description,
        knowledgeGUID: this.knowledge.gUID,
        keywords: '',
        copyContent: '',
        categories: categories,
        isTask: true,
        taskType: 'task',
        columnIndex: boxColumn,
        rowIndex: 0,
        inBox: true,
        boxGUID: box.gUID
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
            this.getBoxes()
            this.newTask.name = ''
            this.newTask.description = ''
            this.hideNewTaskInputs()
          })
          .then(() => resolve)
          .catch((err) => {
            console.error(err.message)
            this.noResults = true
          })
      })
    },
    toggleElement: function (id, display = 'block') {
      const elem = document.getElementById(id)
      if (elem.style.display === display) {
        elem.style.display = 'none'
      } else {
        elem.style.display = display
      }
    },
    toggleAndFocusNewTask: function (id, display = 'block') {
      this.toggleElement(id, display)
      const elem = document.getElementById(id)
      const input = document.getElementById(id + '_input')
      if (elem.style.display !== 'hidden') {
        input.focus()
      } else {
        input.blur()
      }
    },
    auto_grow: function (id) {
      const elem = document.getElementById(id)
      elem.style.height = '32px' // Default
      elem.style.height = (elem.scrollHeight) + 'px' // Grow if scrollHeight > 0
    },
    finishTask: async function (task, doDelete = false) {
      if (task == null) return
      await this.serverLogin()
      let endpoint = 'finish'
      if (doDelete) endpoint = 'delete'
      return new Promise((resolve) => {
        const headers = new Headers()
        headers.set('Authorization', 'Bearer ' + this.$store.state.token)
        fetch(
          this.$store.state.serverIP + '/api/m7/' + endpoint + '/' + task.gUID,
          {
            method: 'get',
            headers: headers
          }
        )
          .then(res => res)
          .then(() => {
            this.getBoxes()
          })
          .then(() => resolve)
          .catch((err) => {
            this.$notify(
              {
                title: 'Error!',
                text: 'Maybe you aren\'t the owner or a collaborator of this task?',
                type: 'error'
              })
            console.error(err.message)
          })
      })
    },
    hideNewTaskInputs: function () {
      const elements = document.getElementsByClassName('p_new_task_disclosure')
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none'
      }
    },
    gotoWisdom: function (id) {
      if (id == null) return
      this.$router.push('/apps/knowledge/' + id + '?src=' + this.srcGUID)
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
    openTask: async function (task) {
      if (!task.gUID) return
      this.showingTask = task
      this.isShowingTask = true
      await this.getRelated(task)
      this.renderMermaid()
    },
    getRelated: async function (task) {
      return new Promise((resolve) => {
        const headers = new Headers()
        headers.set('Authorization', 'Bearer ' + this.$store.state.token)
        fetch(
          this.$store.state.serverIP + '/api/m7/investigate/' + task.gUID,
          {
            method: 'get',
            headers: headers
          }
        )
          .then((res) => res.json())
          .then((data) => {
            this.showingTaskRelated = data
          })
          .then(() => {
            resolve()
          })
          .catch((err) => {
            console.error(err.message)
          })
      })
    },
    handleEnter: function () {
      if (event.key === 'Enter') {
        if (event.shiftKey) return
        event.preventDefault()
        this.submitComment()
      }
    },
    submitComment: function () {
      this.postComment()
    },
    postComment: async function () {
      if (this.showingTaskComment.trim() === '') return
      const payload = {
        title: '',
        description: this.showingTaskComment.trim(),
        wisdomGUID: this.showingTask.gUID,
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
            this.getRelated(this.showingTask)
            this.resetValues()
            setTimeout(() => {
              this.inputComment.blur()
              this.auto_grow('input_comment')
            }, 0)
          })
          .then(() => resolve)
          .catch((err) => {
            console.error(err.message)
          })
      })
    },
    resetValues: function () {
      this.showingTaskComment = ''
    }
  }
}
</script>

<style>

/* Coloring / Shape */
.p_card {
  @apply bg-slate-700 rounded-lg p-2 text-neutral-300;
}

/* Sizing */
.p_card {
  @apply min-w-[256px] max-w-[256px] h-fit m-1
}

.p_input {
  @apply rounded-md py-1 px-3 bg-neutral-800 hover:bg-neutral-900 focus:bg-neutral-900 bg-opacity-50 placeholder-neutral-400;
}

.p_input_icon {
  @apply pl-8;
}

.p_card_header_section {
  @apply min-h-[36px];
}

.p_task_overlay {
  opacity: 0;
}

.p_task:hover .p_task_overlay {
  opacity: 1;
}

.p_card_menu_active {
  @apply bg-orange-600 text-white font-bold;
}

.p_card_menu_item {
  @apply flex w-full items-center rounded-md px-2 py-2 text-sm;
}

.p_card_menu_list {
  @apply absolute right-0 mt-2 w-56 origin-top-right divide-y divide-neutral-400 rounded-md bg-neutral-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10;
}

.p_markdown p {
  @apply mb-4;
}

.p_markdown p:last-child {
  @apply m-0;
}

.p_markdown a {
  @apply underline;
}

.p_markdown ul {
  @apply list-disc list-inside mb-2;
}

.p_markdown ol {
  @apply list-decimal list-inside mb-2;
}

.p_markdown pre {
  @apply mb-2;
}

.p_markdown table {
  @apply mb-4;
}

.p_markdown th, .p_markdown td {
  @apply p-2 border border-slate-700;
}

.p_markdown tr {
  @apply hover:bg-neutral-800;
}

.p_markdown_xl_only h1,
.p_markdown_xl_only h2,
.p_markdown_xl_only h3,
.p_markdown_xl_only h4,
.p_markdown_xl_only h5 {
  @apply text-xl mb-2 !important;
}

.p_markdown h1 {
  @apply text-5xl mb-2;
}

.p_markdown h2 {
  @apply text-4xl mb-2;
}

.p_markdown h3 {
  @apply text-3xl mb-2;
}

.p_markdown h4 {
  @apply text-2xl mb-2;
}

.p_markdown h5 {
  @apply text-xl mb-2;
}

.p_markdown h6 {
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
