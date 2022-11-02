<template>
  <div class="flex w-screen h-screen pt-[60px]">
    <div id="sidebar"
         class="active h-full p_sidebar_left bg-slate-700 border-r border-neutral-600 relative">
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
      <div class="flex items-center mt-8 cursor-pointer hover:bg-neutral-800 hover:bg-opacity-50 py-2"
           v-on:click="getBoxes(false)">
        <div class="h-full ml-4 mr-2 px-1 rounded-xl text-neutral-300">
          <ArrowPathIcon class="h-6 w-6"></ArrowPathIcon>
        </div>
        <div class="font-bold text-neutral-300">
          Reload Tasks
        </div>
      </div>
      <div class="flex items-center cursor-pointer hover:bg-neutral-800 hover:bg-opacity-50 py-2"
           v-on:click="openSearch()">
        <div class="h-full ml-4 mr-2 px-1 rounded-xl text-neutral-300">
          <FunnelIcon class="h-6 w-6"></FunnelIcon>
        </div>
        <div class="font-bold text-neutral-300">
          Filter
        </div>
      </div>
      <div
        class="p_sidebar_toggler absolute w-6 right-0 top-0 bottom-0 hover:bg-slate-600 cursor-pointer flex items-center justify-center overflow-hidden"
        v-on:click="toggleSidebar">
      </div>
    </div>
    <div id="board"
         class="h-full w-full flex p-1 bg-neutral-900 overflow-x-auto overflow-y-auto">
      <template v-if="boxes.length > 0">
        <template v-for="box in boxes" :key="box.uID">
          <div class="p_card" style="margin-bottom: 312px !important">
            <div class="p_card_header_section relative text-neutral-300 flex items-center p-2">
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
              <div v-for="task in box.tasks" :key="task.uID" class="p-1 task_container"
                   :id="'taskcontainer_' + task.uID">
                <div :id="'task_' + task.uID"
                     class="p_task bg-neutral-900 bg-opacity-75 rounded flex items-center relative cursor-pointer">
                  <div class="w-full h-full rounded py-1 px-1" v-on:click="openTask(task)">
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
                    <Markdown class="p_markdown p_markdown_xl_only font-bold text-neutral-300 w-full px-1"
                              :source="task.t"
                              :plugins="plugins"></Markdown>
                    <Markdown class="p_markdown p_markdown_xl_only text-neutral-400 text-sm mt-2 w-full px-1"
                              :source="task.desc"
                              :plugins="plugins"></Markdown>
                    <div class="flex mt-2">
                      <div class="ml-auto flex items-center">
                        <div>
                          <template v-if="task.dueDate && task.dueDate !== ''">
                            <div class="ml-auto flex items-center text-neutral-500 py-0.5">
                              <p class="m-0 text-xs font-bold">
                                {{ getTaskDueDate(task).toLocaleString('de-DE').replace(' ', '&nbsp;') }}
                              </p>
                              <CalendarIcon class="w-4 h-4 ml-1"></CalendarIcon>
                            </div>
                          </template>
                          <div class="ml-auto flex items-center text-neutral-500 py-0.5 justify-end">
                            <p class="text-xs ml-1">
                              {{ task.author }}
                            </p>
                            <UserIcon class="w-4 h-4 ml-1"></UserIcon>
                          </div>
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
              </div>
            </div>
            <div class="relative flex items-center cursor-pointer p-2">
              <PlusCircleIcon class="h-6 w-6 mx-1 absolute text-neutral-400"></PlusCircleIcon>
              <div class="p_input p_input_icon text-neutral-400"
                   v-on:click="toggleAndFocusNewTask('taskname_' + box.box.uID)">
                Add a Task
              </div>
            </div>
            <div :id="'taskname_' + box.box.uID"
                 class="w-full hidden mt-4 p_new_task_disclosure relative p-2">
              <p class="absolute pt-1 pl-2 text-neutral-400">##</p>
              <input :id="'taskname_' + box.box.uID + '_input'"
                     type="text"
                     class="p_input w-full font-bold"
                     style="padding-left: 2rem"
                     placeholder="Title"
                     v-model="newTask.name"
                     v-on:keydown="newTaskKeyUp(box.box, 'taskname_' + box.box.uID)">
              <textarea :id="'taskname_' + box.box.uID + '_desc'"
                        type="text" v-model="newTask.description"
                        rows="1"
                        class="p_input w-full mt-2"
                        placeholder="Description"
                        v-on:keydown="newTaskKeyUp(box.box, 'taskname_' + box.box.uID)"
                        v-on:keyup="auto_grow('taskname_' + box.box.uID + '_desc')"></textarea>
              <Listbox v-model="newTask.categories" multiple id="newtaskcategories">
                <div class="relative mt-1">
                  <ListboxButton
                    class="bg-neutral-900 w-full relative cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                  >
                    <template v-if="newTask.categories.length > 0">
                      <div class="block truncate font-bold text-neutral-300">
                        {{ newTask.categories.map((cat) => cat.category).join(', ') }}
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
          </div>
        </template>
      </template>
      <div id="new_box" class="p_card" style="margin-right: 312px">
        <div class="p_card_header_section flex relative items-center p-2">
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
      <div class="h-4 flex items-center text-neutral-400 text-xs">
        <p class="mr-1">uID {{ showingTask.uID }}</p>
        <i class="bi bi-dot mr-1"></i>
        <p class="mr-1">
          {{ new Date(showingTask.cdate).toLocaleString('de-DE').replace(' ', '&nbsp;') }}
        </p>
        <i class="bi bi-dot mr-1"></i>
        <p class="mr-1">{{ showingTask.author }}</p>
      </div>
    </template>
    <template v-slot:body>
      <div class="w-full sm:w-[540px] flex h-full">
        <div class="w-full h-full">
          <div class="w-full bg-neutral-900 p-2 rounded">
            <div class="flex mb-2 items-center">
              <template v-if="showingTask.categories">
                <template v-for="cat in showingTask.categories" :key="cat">
                  <div v-if="JSON.parse(cat).category != null"
                       class="text-white bg-orange-900 flex items-center px-0.5 px-1 rounded mr-1 pointer-events-none text-xs">
                    {{ JSON.parse(cat).category }}
                  </div>
                </template>
              </template>
            </div>
            <Markdown class="p_markdown font-bold text-neutral-300 w-full"
                      :source="showingTask.t"
                      :plugins="plugins"></Markdown>
            <Markdown class="p_markdown text-neutral-400 w-full"
                      :source="showingTask.desc"
                      :plugins="plugins"></Markdown>
          </div>
          <div class="w-full my-2">
            <div class="flex items-center justify-between">
              <label for="task_view_datetime" class="text-neutral-400 text-sm font-bold hidden sm:block">
                Due Date
              </label>
              <input id="task_view_datetime" type="datetime-local" class="p_input ml-auto"
                     v-model="showingTask.dueDate">
            </div>
            <div class="mt-1 flex items-center">
              <button class="rounded-lg bg-neutral-800 hover:bg-neutral-900 py-1 px-2 ml-auto text-sm text-neutral-400"
                      v-on:click="setTaskDueDate()">
                Update
              </button>
            </div>
          </div>
          <div class="w-full my-2">
            <div class="flex items-center justify-between">
              <div class="text-neutral-400 text-sm font-bold">Collaborators</div>
              <template v-if="showingTask.collaborators && showingTask.collaborators.length > 0">
              </template>
              <template v-else>
                <div class="text-neutral-400 text-sm pointer-events-none">
                  No Collaborators
                </div>
              </template>
            </div>
          </div>
          <div id="wisdomComments" class="w-full mt-4 bg-neutral-900 p-2 rounded">
            <div class="w-full relative">
              <div
                class="p-2 rounded-full hover:bg-neutral-700 text-neutral-300 hover:text-white absolute right-1 sidebar_button cursor-pointer">
                <Squares2X2Icon class="h-6 w-6"></Squares2X2Icon>
              </div>
              <textarea type="text" id="input_comment" v-model="showingTaskComment" rows="1"
                        placeholder="Write a comment"
                        class="w-[calc(100%-50px)] border-b border-neutral-400 text-neutral-300 bg-neutral-600 bg-opacity-20 focus:outline-none px-2 py-1"
                        v-on:keyup="auto_grow('input_comment')">
            </textarea>
            </div>
            <template v-if="showingTaskRelated.comments == null">
              <div class="flex w-full items-center justify-content-center py-4">
                <div class="w-full text-neutral-400 pointer-events-none">
                  <CubeTransparentIcon class="h-8 w-8 mx-auto"></CubeTransparentIcon>
                  <p class="text-md font-bold italic w-fit mx-auto">No Comments</p>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="flex items-center mt-4 mb-3 pointer-events-none">
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
        </div>
        <div class="w-30 mx-2 divide-y divide-neutral-500">
          <div class="px-1 pb-1">
            <button v-on:click="finishTask(showingTask)"
                    class="group p_card_menu_item text-neutral-300 hover:text-white hover:bg-neutral-800 text-lg">
              <CheckIcon
                class="mr-2 h-6 w-6"
                aria-hidden="true"
              />
              Finish
            </button>
            <button v-on:click="finishTask(showingTask, true)"
                    class="group p_card_menu_item text-neutral-300 hover:text-white hover:bg-neutral-800 text-lg">
              <TrashIcon
                class="mr-2 h-6 w-6"
                aria-hidden="true"
              />
              Delete
            </button>
          </div>
          <div class="p-1">
            <button v-on:click="gotoWisdom(showingTask.gUID)"
                    class="group p_card_menu_item text-neutral-300 hover:text-white hover:bg-neutral-800 text-lg">
              <WindowIcon
                class="mr-2 h-6 w-6"
                aria-hidden="true"
              />
              Go To
            </button>
          </div>
          <div class="p-1">
            <button disabled
                    class="group p_card_menu_item text-lg text-neutral-500">
              <ClockIcon
                class="mr-2 h-6 w-6"
                aria-hidden="true"
              />
              History
            </button>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
  <template v-if="isSearching">
    <div class="absolute top-[60px] right-1 p_card mt-2"
         style="box-shadow: 0 0 6px 4px rgb(23 23 23 / 1)">
      <div class="p_card_header_section relative text-neutral-300 flex items-center p-2 font-bold w-full">
        <span>Filter</span>
        <i class="bi bi-x-lg ml-auto mr-2 pl-2 hover:text-orange-600 cursor-pointer"
           v-on:click="this.isSearching = false"></i>
      </div>
      <div class="p_card_header_section flex relative items-center p-2">
        <FunnelIcon class="h-6 w-6 mx-1 absolute"></FunnelIcon>
        <input id="search_input"
               type="text" class="p_input p_input_icon w-full" placeholder="Search..."
               v-model="searchQuery"
               v-on:keyup="handleEnter()">
      </div>
      <div class="flex w-full mb-1">
        <button class="rounded-lg bg-neutral-800 hover:bg-neutral-900 py-1 px-2 ml-auto mr-2 text-sm text-neutral-400"
                v-on:click="resetSearchResults()">
          Reset
        </button>
      </div>
      <div class="px-10 py-4 mt-2 bg-neutral-800 rounded-b">
        <div class="flex items-center justify-between mb-2">
          <label for="filterTitle" class="text-sm text-neutral-400 font-bold">Title</label>
          <input id="filterTitle" type="checkbox" v-model="filters.filterTitle"
                 class="w-6 h-6 accent-neutral-400">
        </div>
        <div class="flex items-center justify-between mb-2">
          <label for="filterKeywords" class="text-sm text-neutral-400 font-bold">Keywords</label>
          <input id="filterKeywords" type="checkbox" v-model="filters.filterKeywords"
                 class="w-6 h-6 accent-neutral-400">
        </div>
        <div class="flex items-center justify-between mb-2">
          <label for="filterDescription" class="text-sm text-neutral-400 font-bold">Description</label>
          <input id="filterDescription" type="checkbox" v-model="filters.filterDescription"
                 class="w-6 h-6 accent-neutral-400">
        </div>
        <div class="flex items-center justify-between">
          <label for="filterAuthor" class="text-sm text-neutral-400 font-bold">Author</label>
          <input id="filterAuthor" type="checkbox" v-model="filters.filterAuthor"
                 class="w-6 h-6 accent-neutral-400">
        </div>
      </div>
    </div>
  </template>
</template>

<script>

import {
  ArrowPathIcon,
  ChatBubbleLeftEllipsisIcon,
  CubeTransparentIcon,
  EllipsisVerticalIcon,
  FunnelIcon,
  PlusCircleIcon,
  SquaresPlusIcon
} from '@heroicons/vue/24/outline'
import {
  ArrowsPointingOutIcon,
  ArrowsUpDownIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  InboxIcon,
  Squares2X2Icon,
  TrashIcon,
  UserIcon,
  WindowIcon
} from '@heroicons/vue/24/solid'
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
    Squares2X2Icon,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    ArrowsUpDownIcon,
    WindowIcon,
    ClockIcon,
    CalendarIcon,
    UserIcon,
    FunnelIcon
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
        description: '',
        categories: []
      },
      inputComment: null,
      isShowingTask: false,
      showingTask: {},
      showingTaskRelated: [],
      showingTaskComment: '',
      sidebarActive: true,
      selection: {
        row: -1,
        col: -1
      },
      isSearching: false,
      searchQuery: '',
      filters: {
        filterTitle: true,
        filterKeywords: true,
        filterDescription: true,
        filterAuthor: true
      },
      plugins: [
        {
          plugin: markdownItMermaid
        }
      ],
      results: []
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
    window.addEventListener('keypress', this.handleDocumentKeypress, false)
    window.addEventListener('keyup', this.handleDocumentKeyUp, false)
    window.addEventListener('keydown', this.handleDocumentKeyDown, false)
  },
  beforeUnmount () {
    window.removeEventListener('keypress', this.handleDocumentKeypress, false)
    window.removeEventListener('keyup', this.handleDocumentKeyUp, false)
    window.removeEventListener('keydown', this.handleDocumentKeyDown, false)
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
      this.inputComment = document.getElementById('input_comment')
      this.inputComment.addEventListener('keydown', this.handleEnter, false)
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
            // Retrieve all boxes and tasks from server response
            this.boxes = data.boxes.reverse()
            for (let i = 0; i < this.boxes.length; i++) {
              if (this.boxes[i].tasks) {
                this.boxes[i].tasks = this.boxes[i].tasks.reverse()
              }
            }
            // Draw Mermaid content in tasks
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
    newTaskKeyUp: async function (box, id = '') {
      const ev = event
      if (ev.key === 'Enter') {
        if (ev.shiftKey) return
        if (this.newTask.name.trim() !== '') {
          await this.createTask(box)
          if (ev.ctrlKey && id !== '') {
            this.toggleAndFocusNewTask(id)
          }
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
    createTask: async function (box, taskUpdate = false) {
      await this.serverLogin()
      let categories = []
      let payload = {}
      let extension = ''
      if (!taskUpdate) {
        const boxColumn = box.columnIndex
        for (let i = 0; i < this.newTask.categories.length; i++) {
          categories.push(JSON.stringify(this.newTask.categories[i]))
        }
        payload = {
          title: '## ' + this.newTask.name,
          description: this.newTask.description,
          knowledgeGUID: this.knowledge.gUID,
          keywords: this.newTask.name,
          copyContent: '',
          categories: categories,
          isTask: true,
          taskType: 'task',
          columnIndex: boxColumn,
          rowIndex: 0,
          inBox: true,
          boxGUID: box.gUID
        }
      } else if (taskUpdate) {
        extension = '?guid=' + this.showingTask.gUID
        categories = []
        if (this.showingTask.categories) {
          for (let i = 0; i < this.showingTask.categories.length; i++) {
            categories.push(JSON.stringify(this.newTask.categories[i]))
          }
        }
        payload = {
          title: this.showingTask.t,
          description: this.showingTask.desc,
          knowledgeGUID: this.knowledge.gUID,
          keywords: this.newTask.name,
          copyContent: '',
          categories: categories,
          isTask: true,
          taskType: 'task',
          columnIndex: this.showingTask.columnIndex,
          rowIndex: 0,
          inBox: true,
          boxGUID: this.showingTask.boxGUID,
          dueDate: this.showingTask.dueDate
        }
      }
      const bodyPayload = JSON.stringify(payload)
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
            this.getBoxes()
            this.newTask.name = ''
            this.newTask.description = ''
            this.newTask.categories = []
            this.hideNewTaskInputs()
          })
          .then(() => resolve())
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
      this.hideNewTaskInputs()
      this.toggleElement(id, display)
      const elem = document.getElementById(id)
      const input = document.getElementById(id + '_input')
      if (elem.style.display !== 'hidden') {
        input.focus()
        input.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
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
            if (this.isShowingTask) this.isShowingTask = false
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
      this.showingTask.comments = []
      this.isShowingTask = true
      this.renderMermaid()
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
    handleEnter: async function () {
      if (event.key === 'Enter') {
        if (event.shiftKey) return
        event.preventDefault()
        if (this.isShowingTask) {
          this.submitComment()
        } else if (this.isSearching) {
          await this.searchWisdom()
        }
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
    },
    toggleSidebar: function () {
      const sidebarElem = document.getElementById('sidebar')
      if (!sidebarElem) return
      if (!sidebarElem.classList.contains('active')) {
        sidebarElem.classList.add('active')
      } else {
        sidebarElem.classList.remove('active')
      }
    },
    handleDocumentKeypress: function (event) {
      if (event.key === '[') {
        if (document.activeElement.classList.contains('p_input')) return
        event.preventDefault()
        this.toggleSidebar()
      }
    },
    handleDocumentKeyUp: async function (event) {
      const ev = event
      if (ev.key === 'Escape') {
        ev.preventDefault()
        this.hideNewTaskInputs()
        if (!this.isShowingTask) {
          this.isSearching = false
        }
        this.isShowingTask = false
        document.activeElement.blur()
        document.body.focus()
        this.moveToSelectedTask()
      } else if (ev.key === 't') {
        if (this.isShowingTask) return
        if (document.activeElement.classList.contains('p_input')) return
        if (!this.isTaskSelectionInitial()) {
          if (!this.boxes[this.selection.row]) return
          ev.preventDefault()
          this.toggleAndFocusNewTask('taskname_' + this.boxes[this.selection.row].box.uID)
        }
      } else if (ev.key === 'c') {
        if (!this.isShowingTask) return
        ev.preventDefault()
        const elem = document.getElementById('input_comment')
        if (elem) elem.focus()
      } else if (ev.key === 'r') {
        if (this.isShowingTask) return
        if (document.activeElement.classList.contains('p_input')) return
        ev.preventDefault()
        await this.getBoxes(false)
        this.renderMermaid()
      } else if (ev.key === 'f') {
        if (this.isShowingTask) return
        if (document.activeElement.classList.contains('p_input')) return
        ev.preventDefault()
        this.openSearch()
      }
    },
    handleDocumentKeyDown: function (event) {
      const ev = event
      if (ev.key === 'Enter') {
        if (this.isShowingTask) return
        if (document.activeElement.classList.contains('p_input')) return
        ev.preventDefault()
        if (!this.isTaskSelectionInitial()) {
          if (!this.boxes[this.selection.row] ||
            !this.boxes[this.selection.row].tasks ||
            !this.boxes[this.selection.row].tasks[this.selection.col]) {
            return
          }
          this.openTask(this.boxes[this.selection.row].tasks[this.selection.col])
        }
      } else if (ev.key === 'ArrowUp' || ev.key === 'ArrowRight' || ev.key === 'ArrowDown' || ev.key === 'ArrowLeft') {
        if (this.isShowingTask) return
        if (document.activeElement.classList.contains('p_input')) return
        // Prevent scrolling with arrow keys
        ev.preventDefault()
        this.hideNewTaskInputs()
        if (ev.key === 'ArrowUp') {
          this.moveTaskSelection('up')
        } else if (ev.key === 'ArrowRight') {
          this.moveTaskSelection('right')
        } else if (ev.key === 'ArrowDown') {
          this.moveTaskSelection('down')
        } else if (ev.key === 'ArrowLeft') {
          this.moveTaskSelection('left')
        }
      }
    },
    moveTaskSelection: function (direction) {
      if (this.boxes.length < 1 || !this.boxes[0].tasks) {
        this.selection.row = -1
        this.selection.col = -1
        return
      }
      if (direction === 'up') {
        this.moveAndMarkTask(0, -1)
      } else if (direction === 'right') {
        this.moveAndMarkTask(1, 0)
      } else if (direction === 'down') {
        this.moveAndMarkTask(0, 1)
      } else if (direction === 'left') {
        this.moveAndMarkTask(-1, 0)
      }
    },
    moveAndMarkTask: function (xPlus, yPlus) {
      if (this.isTaskSelectionInitial()) {
        this.selection.row = 0
        this.selection.col = 0
        xPlus = 0
        yPlus = 0
      }
      let xPos = this.selection.row + xPlus
      let yPos = this.selection.col + yPlus
      // Check if what we're going to move to exists
      let tBox = this.boxes[xPos]
      // Return if the box does not exist
      if (!tBox) return
      if (!tBox.tasks) {
        tBox = null
        let xPosTemp = xPos
        while (!tBox) {
          xPosTemp += xPlus
          tBox = this.boxes[xPosTemp]
          // Return if there are no other boxes available
          if (!tBox) return
          if (!tBox.tasks) {
            tBox = null
            continue
          }
          xPos = xPosTemp
        }
      }
      let tTask = tBox.tasks[yPos]
      // Check if there is a task at the specified coordinates
      if (!tTask) {
        if (yPos < 0) return
        // If there are tasks but the specified Y position was too high, set it to the highest possible
        yPos = tBox.tasks.length - 1
        tTask = tBox.tasks[yPos]
      }
      // Now check if the task is visible
      let taskElem = document.getElementById('taskcontainer_' + tTask.uID)
      if (!taskElem || taskElem.style.display === 'none') {
        // Task is invisible or does not exist -> Check for others in this column
        tTask = null
        let yPosTemp = yPos
        let yIncrease = yPlus
        if (yIncrease === 0) {
          if (yPosTemp > 0) {
            yIncrease = -1
          } else {
            yIncrease = 1
          }
        }
        while (!tTask) {
          yPosTemp += yIncrease
          tTask = tBox.tasks[yPosTemp]
          // Return if there are no other tasks available
          if (!tTask) {
            if (xPlus !== 0) this.moveAndMarkTask(xPlus + xPlus, yPlus)
            return
          }
          taskElem = document.getElementById('taskcontainer_' + tTask.uID)
          if (taskElem.style.display === 'none') {
            tTask = null
            continue
          }
          yPos = yPosTemp
        }
      }
      // Reset previous task's active class
      const id = 'task_' + this.boxes[this.selection.row].tasks[this.selection.col].uID
      const elemOld = document.getElementById(id)
      elemOld.classList.remove('active')
      // Now change to new position
      this.selection.row = xPos
      this.selection.col = yPos
      this.moveToSelectedTask(true)
    },
    isTaskSelectionInitial: function () {
      return (this.selection.row === -1 && this.selection.col === -1)
    },
    setTaskDueDate: function () {
      this.createTask(null, true)
    },
    getTaskDueDate: function (task) {
      if (task.dueDate && task.dueDate !== '') {
        return new Date(task.dueDate)
      } else {
        return ''
      }
    },
    searchWisdom: async function () {
      if (!this.isTaskSelectionInitial()) {
        const id = 'task_' + this.boxes[this.selection.row].tasks[this.selection.col].uID
        const elemOld = document.getElementById(id)
        elemOld.classList.remove('active')
      }
      this.selection.row = -1
      this.selection.col = -1
      this.results = []
      let filterOverrideArgs = ''
      if (this.filters.filterTitle) filterOverrideArgs += 'title,'
      if (this.filters.filterKeywords) filterOverrideArgs += 'keywords,'
      if (this.filters.filterDescription) filterOverrideArgs += 'description,'
      if (this.filters.filterAuthor) filterOverrideArgs += 'author,'
      const payload = {
        query: this.searchQuery,
        type: 'task',
        filterOverride: filterOverrideArgs
      }
      return new Promise((resolve) => {
        const elements = document.getElementsByClassName('task_container')
        for (let i = 0; i < elements.length; i++) {
          elements[i].style.display = 'none'
        }
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
          })
          .then(() => {
            // Make tasks visible if they are part of the search results
            let elem
            for (let i = 0; i < this.results.length; i++) {
              elem = document.getElementById('taskcontainer_' + this.results[i].result.uID)
              if (elem) {
                elem.style.display = 'block'
              }
            }
          })
          .then(() => resolve)
          .catch((err) => {
            console.error(err.message)
          })
      })
    },
    openSearch: function () {
      this.isSearching = true
      setTimeout(() => {
        const elem = document.getElementById('search_input')
        elem.focus()
      }, 0)
    },
    resetSearchResults: function () {
      this.searchQuery = ''
      this.filters.filterTitle = true
      this.filters.filterKeywords = true
      this.filters.filterDescription = true
      this.filters.filterAuthor = true
      const elements = document.getElementsByClassName('task_container')
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'block'
      }
    },
    moveToSelectedTask (setActive = false) {
      if (this.selection.row === -1 || this.selection.col === -1) return
      // Set active class for currently selected tasks
      const idContainer = 'taskcontainer_' + this.boxes[this.selection.row].tasks[this.selection.col].uID
      const id = 'task_' + this.boxes[this.selection.row].tasks[this.selection.col].uID
      const elemContainer = document.getElementById(idContainer)
      const elem = document.getElementById(id)
      elemContainer.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
      if (setActive) {
        elem.classList.add('active')
      }
    }
  }
}
</script>

<style>

/* Coloring / Shape */
.p_card {
  @apply bg-slate-700 rounded-lg text-neutral-300;
}

/* Sizing */
.p_card {
  @apply min-w-[256px] max-w-[256px] h-fit m-1;
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

.p_sidebar_left {
  @apply w-7 overflow-x-hidden;
}

.p_sidebar_left > .p_sidebar_toggler {
  @apply bg-slate-700 hover:bg-slate-600;
}

.p_sidebar_left.active {
  @apply min-w-[265px] max-w-[265px];
}

.p_sidebar_left.active > .p_sidebar_toggler {
  background-color: unset;
  @apply hover:bg-slate-600;
}

.p_task.active {
  box-shadow: 0 0 0 2px white;
}

.p_task:hover {
  box-shadow: 0 0 0 2px white;
}

.p_task {
  @apply mb-1 mx-1 w-[calc(100%-0.5rem)]
}

#board {
  scrollbar-width: none;
}

/* Works on Chrome, Edge, and Safari */
#board::-webkit-scrollbar {
  display: none;
}

</style>
