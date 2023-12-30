<template>
  <div id="processViewer" ref="processViewer"
       class="background w-full h-full relative overflow-hidden"
       :class="{'rounded-tl': isoverlay, 'rounded-tr': !isoverlay}">
    <div class="w-full min-h-[50px] max-h-[50px] px-2 flex items-center surface-variant
                divide-x-2 divide-neutral-600 bshadow relative">
      <div class="sidebar_button rounded-xl w-fit mr-2">
        <div v-on:click="clickedBack()"
             v-tooltip="{ content: 'Exit' }"
             class="cursor-pointer p-2">
          <XMarkIcon class="h-6 w-6"></XMarkIcon>
        </div>
      </div>
      <div class="flex items-center pl-2">
        <div class="sidebar_button rounded-xl w-fit mr-2">
          <div v-on:click="generateDocumentation()"
               v-tooltip="{ content: 'Generate Documentation' }"
               class="cursor-pointer p-2">
            <DocumentArrowDownIcon class="h-6 w-6"></DocumentArrowDownIcon>
          </div>
        </div>
        <div class="sidebar_button rounded-xl w-fit mr-2">
          <div v-on:click="createTasks()"
               v-tooltip="{ content: 'Tasks' }"
               class="cursor-pointer p-2">
            <ViewColumnsIcon class="h-6 w-6"></ViewColumnsIcon>
          </div>
        </div>
      </div>
      <div class="inverse-surface rounded p-2 ml-auto">
        <div class="flex items-center">
          <p class="text-sm font-bold">Experimental Feature</p>
        </div>
      </div>
    </div>
    <template v-if="processEvents.length > 0">
      <div class="h-[calc(100%-40px)] w-full p-2 flex justify-center background">
        <div class="h-full w-full overflow-y-auto pb-40 flex justify-center" ref="processScroller">
          <div class="grid grid-cols-1 gap-0 w-full max-w-screen-lg">
            <template v-for="segment in processEvents" :key="segment.process.uid">
              <div class="flex text-sm segment">
                <div class="h-full pr-8 relative">
                  <template v-if="segment.process.mode === 'start'">
                    <div class="absolute rounded-r-md primary flex items-center justify-center p-1">
                      <RocketLaunchIcon class="w-[16px] h-[16px]"></RocketLaunchIcon>
                    </div>
                  </template>
                  <template v-else>
                    <div class="absolute rounded-r-md primary flex items-center justify-center p-1">
                      <BoltIcon class="w-[16px] h-[16px]"></BoltIcon>
                    </div>
                  </template>
                  <div class="absolute flex h-full items-center">
                    <Menu as="div" class="absolute inline-block text-left">
                      <MenuButton
                        title="Options"
                        class="hover:primary p-1 rounded-full
                             flex items-center cursor-pointer">
                        <EllipsisVerticalIcon class="h-7 w-7 segmentSettings"></EllipsisVerticalIcon>
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
                          class="p_card_menu_list surface w-[150px]"
                        >
                          <div class="px-1 py-1 w-full">
                            <MenuItem v-slot="{ active }">
                              <button v-on:click="deleteEvent(segment.process)"
                                      class="flex p-2 w-full rounded"
                                      :class="
                                      [active ? 'error' : '']
                                    ">
                                <TrashIcon
                                  :active="active"
                                  class="mr-2 h-5 w-5"
                                  aria-hidden="true"
                                />
                                <span class="font-bold">Delete</span>
                              </button>
                            </MenuItem>
                          </div>
                          <div class="px-1 py-1 w-full" v-if="segment.task">
                            <MenuItem v-slot="{ active }">
                              <button v-on:click="finishEventTask(segment.task)"
                                      class="flex  p-2 w-full rounded"
                                      :class="
                                      [active ? 'medium_bg' : '']
                                    ">
                                <CheckIcon
                                  :active="active"
                                  class="mr-2 h-5 w-5"
                                  aria-hidden="true"
                                />
                                <span class="font-bold">Finish Task</span>
                              </button>
                            </MenuItem>
                          </div>
                        </MenuItems>
                      </transition>
                    </Menu>
                  </div>
                  <div class="pathIndicator"></div>
                </div>
                <div class="surface rounded w-full mr-2">
                  <div class="w-full">
                    <template v-if="segment.task">
                      <template v-if="segment.task.done">
                        <div class="px-1 py-1 rounded-tl rounded-br primary flex w-16 mr-2 items-center">
                          <CheckIcon class="h-4 w-4 mr-1"></CheckIcon>
                          <span class="text-xs font-bold">Done</span>
                        </div>
                      </template>
                      <template v-else>
                        <div class="px-1 py-1 rounded-tl rounded-br error flex w-16 mr-2 items-center">
                          <Cog6ToothIcon class="h-4 w-4 mr-1"></Cog6ToothIcon>
                          <span class="text-xs font-bold">WIP</span>
                        </div>
                      </template>
                    </template>
                    <template v-if="!segment.process.editingTitle">
                      <template v-if="segment.process.t">
                        <Markdown class="markedView w-full p-2"
                                  v-on:click="editEventTitle(segment.process)"
                                  :source="'# ' + segment.process.t"
                                  :plugins="plugins"></Markdown>
                      </template>
                      <template v-else>
                        <p class=" w-full p-2"
                           v-on:click="editEventTitle(segment.process)">
                          (No Title)
                        </p>
                      </template>
                    </template>
                    <template v-else>
                      <div class="w-full">
                    <textarea type="text" v-model="segment.process.t"
                              :id="segment.process.uid + '_title_edit'"
                              v-on:blur="updateEvent(segment.process)"
                              rows="1"
                              class="text-lg p-2 mb-2 rounded surface w-full"></textarea>
                        <button class="editSubmit">
                          <span>Submit</span>
                        </button>
                      </div>
                    </template>
                  </div>
                  <template v-if="!segment.process.editingDescription">
                    <template v-if="segment.process.desc">
                      <Markdown class="markedView w-full h-full p-2"
                                :source="segment.process.desc"
                                v-on:click="editEventDescription(segment.process)"
                                :plugins="plugins"></Markdown>
                    </template>
                    <template v-else>
                      <p class="w-full h-full p-2"
                         v-on:click="editEventDescription(segment.process)">
                        (No Description)
                      </p>
                    </template>
                  </template>
                  <template v-else>
                    <div class="rounded w-full">
                      <div class="my-1 p-1">
                        <button class="btn_small_icon"
                                v-on:click="isAddingMedia = true">
                          <DocumentArrowUpIcon
                            class="mr-1 h-6 w-6"
                            aria-hidden="true"
                          />
                          <span>Add File</span>
                        </button>
                      </div>
                      <textarea :id="segment.process.uid + '_description_edit'"
                                v-model="segment.process.desc"
                                maxlength="3000"
                                rows="10"
                                class="p-2 mb-2 surface w-full input"></textarea>
                      <button class="editSubmit" v-on:click="updateEvent(segment.process)">
                        <span>Submit</span>
                      </button>
                    </div>
                  </template>
                </div>
              </div>
              <div class="flex">
                <div class="h-full relative">
                  <template v-if="segment.children && segment.children.length <= 0">
                    <div class="pathIndicator"></div>
                    <div v-on:click="writeProcess(segment.process, !segment.process.hasNext)"
                         v-tooltip.right="{ content: 'Add' }"
                         class="adder_button ml-8" style="border-radius: 100%; background-color: transparent;">
                      <PlusCircleIcon class="h-6 w-6"></PlusCircleIcon>
                    </div>
                    <template v-if="!segment.process.hasNext">
                      <div v-on:click="writeProcess(segment.process)"
                           v-tooltip.right="{ content: 'Add' }"
                           class="adder_button">
                        <PlusCircleIcon class="h-6 w-6"></PlusCircleIcon>
                      </div>
                    </template>
                  </template>
                  <div class="pathIndicator"></div>
                </div>
                <template v-if="segment.children && segment.children.length > 0 || drag">
                  <div class="w-full h-fit ml-8 my-2 grid grid-cols-1"
                       :id="'box_events_guid_' + segment.process.uid"
                       :ref="'box_events_guid_' + segment.process.uid">
                    <draggable
                      :list="segment.children"
                      :group="segment.process.uid"
                      :id="segment.process.uid"
                      v-bind="dragOptions"
                      :disabled="this.isEditingProcess"
                      @start="drag=true"
                      @end="endDrag"
                      @change="handleDragChange"
                      @move="handleDragMove"
                      ghostClass="ghost"
                      tag="transition-group"
                      fallbackTolerance="5"
                      forceFallback="true"
                      fallbackClass="chosen"
                      :component-data="{
                        tag: 'div',
                        type: 'transition-group',
                        name: !drag ? 'flip-list' : null
                      }"
                      item-key="order">
                      <template #item="{element}">
                        <div class="flex text-sm w-full segment relative" :key="element.uid">
                          <div class="h-full pr-8">
                            <div class="relative rounded-r-md primary flex items-center justify-center p-1">
                              <BoltIcon class="w-[16px] h-[16px]"></BoltIcon>
                            </div>
                            <div class="relative flex h-full items-center">
                              <Menu as="div" class="absolute inline-block text-left mt-8">
                                <MenuButton
                                  title="Options"
                                  class="hover:primary p-1 bg-opacity-50  rounded-full
                                       flex items-center cursor-pointer">
                                  <EllipsisVerticalIcon class="h-7 w-7 segmentSettings"></EllipsisVerticalIcon>
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
                                    class="p_card_menu_list surface w-[150px] drop-shadow-2xl"
                                  >
                                    <div class="px-1 py-1 w-full">
                                      <MenuItem v-slot="{ active }">
                                        <button v-on:click="deleteEvent(element)"
                                                class="flex p-2 w-full rounded"
                                                :class="
                                      [active ? 'error' : '']
                                    ">
                                          <TrashIcon
                                            :active="active"
                                            class="mr-2 h-5 w-5"
                                            aria-hidden="true"
                                          />
                                          <span class="font-bold">Delete</span>
                                        </button>
                                      </MenuItem>
                                    </div>
                                    <div class="px-1 py-1 w-full" v-if="element.task">
                                      <MenuItem v-slot="{ active }">
                                        <button v-on:click="finishEventTask(element.task)"
                                                class="flex  p-2 w-full rounded"
                                                :class="
                                      [active ? 'primary' : '']
                                    ">
                                          <CheckIcon
                                            :active="active"
                                            class="mr-2 h-5 w-5"
                                            aria-hidden="true"
                                          />
                                          <span class="font-bold">Finish Task</span>
                                        </button>
                                      </MenuItem>
                                    </div>
                                  </MenuItems>
                                </transition>
                              </Menu>
                            </div>
                            <div class="pathIndicator"></div>
                          </div>
                          <div class="surface rounded w-full mr-2 mb-2 overflow-hidden">
                            <div class="w-full">
                              <template v-if="element.task">
                                <template v-if="element.task.done">
                                  <div class="px-1 py-1 rounded-tl rounded-br primary flex w-16 mr-2 items-center">
                                    <CheckIcon class="h-4 w-4 mr-1"></CheckIcon>
                                    <span class="text-xs font-bold">Done</span>
                                  </div>
                                </template>
                                <template v-else>
                                  <div class="px-1 py-1 rounded-tl rounded-br error flex w-16 mr-2 items-center">
                                    <Cog6ToothIcon class="h-4 w-4 mr-1"></Cog6ToothIcon>
                                    <span class="text-xs font-bold">WIP</span>
                                  </div>
                                </template>
                              </template>
                              <template v-if="!element.editingTitle">
                                <template v-if="element.t">
                                  <Markdown class="markedView w-full p-2 break-words"
                                            v-on:click="editEventTitle(element)"
                                            :source="'## ' + element.t"
                                            :plugins="plugins"></Markdown>
                                </template>
                                <template v-else>
                                  <p class=" w-full p-2"
                                     v-on:click="editEventTitle(element)">
                                    (No Title)
                                  </p>
                                </template>
                              </template>
                              <template v-else>
                            <textarea type="text" v-model="element.t"
                                      :id="element.uid + '_title_edit'"
                                      v-on:blur="updateEvent(element)"
                                      rows="1"
                                      class="text-lg p-2 mb-2 rounded surface w-full"></textarea>
                                <button
                                  class="editSubmit">
                                  <span>Submit</span>
                                </button>
                              </template>
                            </div>
                            <template v-if="!element.editingDescription">
                              <template v-if="element.desc">
                                <Markdown class="markedView w-full p-2 break-words"
                                          :source="element.desc"
                                          v-on:click="editEventDescription(element)"
                                          :plugins="plugins"></Markdown>
                              </template>
                              <template v-else>
                                <p class="w-full p-2"
                                   v-on:click="editEventDescription(element)">
                                  (No Description)
                                </p>
                              </template>
                            </template>
                            <template v-else>
                              <div class="rounded w-full">
                                <div class="my-1 p-1">
                                  <button class="btn_small_icon"
                                          v-on:click="isAddingMedia = true">
                                    <DocumentArrowUpIcon
                                      class="mr-3 h-6 w-6"
                                      aria-hidden="true"
                                    />
                                    <span>Add File</span>
                                  </button>
                                </div>
                                <textarea :id="element.uid + '_description_edit'"
                                          v-model="element.desc"
                                          maxlength="3000"
                                          rows="10"
                                          class="p-2 mb-2 surface w-full input"></textarea>
                                <button v-on:click="updateEvent(element)"
                                        class="editSubmit">
                                  <span>Submit</span>
                                </button>
                              </div>
                            </template>
                          </div>
                        </div>
                      </template>
                    </draggable>
                    <div class="h-full relative">
                      <div v-on:click="writeProcess(segment.process)"
                           v-tooltip.right="{ content: 'Add' }"
                           class="adder_button">
                        <PlusCircleIcon class="h-6 w-6"></PlusCircleIcon>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </div>
        </div>
        <div :class="{'hidden': issmall}">
          <div id="rightbar"
               class="max-h-[calc(100%-30px)] w-[350px] hidden lg:flex lg:flex-col
                    overflow-hidden rounded-b-xl">
            <ul ref="contentLinks"
                class="rounded-l-xl pl-2 py-2 mt-2 surface-variant
                     overflow-y-auto h-fit max-h-full w-full max-w-[350px]">
              <div class="background p-1 pr-0 rounded-tl-md">
                <span class="pl-2 text-xs font-bold">Contents</span>
              </div>
              <li v-for="contentLink in contentLinksArr" :key="contentLink"
                  :id="'link_' + contentLink.link"
                  class="flex items-center border-l-4 pl-1"
                  :class="{ 'border-l-indigo-800': contentLink.active, 'border-outline': !contentLink.active }">
                <div v-for="level in contentLink.level" :key="level"
                     class="min-w-[1.5rem] h-full flex items-start justify-center">
                  <div v-if="level === '|'"
                       class="h-1 w-1 rounded-full surface"></div>
                </div>
                <a :href="contentLink.link"
                   class=" text-sm py-0.5 px-1 rounded
                      hover:primary border-[2px] border-transparent hover:border-indigo-600">
                  <span>{{ contentLink.t }}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
    <modal @close="isWritingProcess = false"
           v-show="isWritingProcess">
      <template v-slot:header>
        Attach Process to "{{ writingSource.t }}"
      </template>
      <template v-slot:body>
        <div class="flex w-full md:w-[540px]">
          <div class="w-full">
            <label for="processTitle" class="text-xl font-bold">Title:</label>
            <br>
            <input type="text" id="processTitle" ref="processTitle" v-model="processTitle"
                   class="medium_bg rounded-md w-full py-2 px-3">
            <br>
            <label for="processKeywords" class="text-xl mt-2 font-bold">Keywords:</label>
            <br>
            <input type="text" id="processKeywords" v-model="processKeywords"
                   class="medium_bg rounded-md py-2 px-3 w-full">
            <br>
            <label for="processDescription" class="text-xl mt-2 font-bold">Description:</label>
            <br>
            <div class="rounded-md w-full overflow-hidden">
              <textarea type="text" id="processDescription" v-model="processDescription"
                        rows="2" class="w-full medium_bg py-2 px-3"></textarea>
            </div>
            <div class="flex mt-2 mb-4 w-full">
              <div class="mb-3 ml-auto text-black font-bold">
                <button v-on:click="createProcess()"
                        class="mr-2 py-2 px-5 border-2 border-gray-300 rounded-lg bg-gray-200 hover:bg-gray-400">
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
      </template>
    </modal>
    <modal @close="isViewingDocumentation = false"
           v-show="isViewingDocumentation">
      <template v-slot:header>
        <p>Documentation</p>
      </template>
      <template v-slot:body>
        <div class="max-w-[1000px] rounded overflow-hidden flex justify-center">
          <div class="lg:flex max-w-full overflow-x-hidden overflow-y-auto break-all">
            <div class="md:rounded-l dark_bg p-1 min-w-[124px]">
              <button class="flex items-center justify-center  p-1 rounded-md hover:medium_bg w-full"
                      v-on:click="publishLesson()">
                <PlusCircleIcon class="h-6 w-6 mr-2"></PlusCircleIcon>
                <template v-if="!docExists">
                  <span>Publish</span>
                </template>
                <template v-else>
                  <span>Replace</span>
                </template>
              </button>
            </div>
            <Markdown class="markedView w-fit p-4 medium_bg md:rounded-r max-w-full break-words"
                      :source="documentation"
                      :plugins="plugins"></Markdown>
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
            <audio v-else-if="uploadFileType.includes('audio')"
                   controls preload="auto"
                   class="uploadFileSnippet">
              <source :src="uploadFileBase64" :type="uploadFileType">
              Your browser does not support playing audio.
            </audio>
            <template v-else-if="uploadFileType.includes('zip')">
              <FolderArrowDownIcon class="h-10 w-10"></FolderArrowDownIcon>
            </template>
            <template v-else-if="uploadFileType.includes('text')">
              <DocumentTextIcon class="h-10 w-10"></DocumentTextIcon>
            </template>
            <template v-else-if="uploadFileType.includes('pdf')">
              <DocumentTextIcon class="h-10 w-10"></DocumentTextIcon>
            </template>
          </div>
        </template>
        <input type="file" class="file_input" id="process_add_media" :ref="'process_add_media'" name="files[]"
               style="width: 100%"
               multiple v-on:change="handleUploadFileSelect"/>
        <template v-if="uploadFileBase64 !== ''">
          <p class=" font-bold">{{ this.uploadFileName }}</p>
          <div class="mt-3 w-full">
            <button class="darkbutton  p-2 w-full
                           flex items-center justify-center rounded-full"
                    style="height: 2.5em;
                           border-color: transparent; margin: auto"
                    title="Send"
                    v-on:click="uploadSnippet">
              <span class="font-bold flex"><i class="bi bi-send mr-2"></i>Submit</span>
              <span style="margin-left: 10px" class="c_lightgray text-xs"> {{ this.uploadFileType }}</span>
            </button>
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
      </template>
      <template v-slot:body>
        <div class="h-[75vh] w-full flex justify-center">
          <img :src="viewingImageURL" alt="No Content"
               style="object-fit: contain"
               class="h-full w-full">
        </div>
      </template>
      <template v-slot:footer>
      </template>
    </modal>
  </div>
</template>

<script>
import modal from '../../components/Modal.vue'
import Markdown from 'vue3-markdown-it'
import markdownItMermaid from 'markdown-it-mermaid'
import 'highlight.js/styles/hybrid.css'
import mermaid from 'mermaid'
import draggable from 'vuedraggable'
import {
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  DocumentTextIcon,
  EllipsisVerticalIcon,
  FolderArrowDownIcon,
  ViewColumnsIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

import {
  BoltIcon,
  CheckIcon,
  Cog6ToothIcon,
  PlusCircleIcon,
  RocketLaunchIcon,
  TrashIcon
} from '@heroicons/vue/24/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

export default {
  name: 'ProcessView',
  props: {
    isoverlay: Boolean,
    srcguid: String,
    chatguid: String,
    issmall: Boolean
  },
  emits: ['close'],
  components: {
    modal,
    Markdown,
    XMarkIcon,
    PlusCircleIcon,
    BoltIcon,
    RocketLaunchIcon,
    DocumentArrowDownIcon,
    EllipsisVerticalIcon,
    TrashIcon,
    ViewColumnsIcon,
    Cog6ToothIcon,
    CheckIcon,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    draggable,
    DocumentTextIcon,
    FolderArrowDownIcon,
    DocumentArrowUpIcon
  },
  data () {
    return {
      drag: false,
      lastDragMove: undefined,
      knowledge: {},
      processEvents: [],
      // Process Creation
      processTitle: '',
      processDescription: '',
      processKeywords: '',
      isWritingProcess: false,
      isEditingProcess: false,
      editingProcess: null,
      isViewingDocumentation: false,
      documentation: '',
      docExists: false,
      isViewingImage: false,
      viewingImageURL: '',
      isAddingMedia: false,
      uploadFileName: '',
      uploadFileType: '',
      uploadFileBase64: '',
      writingSource: {
        guid: ''
      },
      contentLinks: new Map(),
      contentLinksArr: [],
      currentHeaders: new Map(),
      plugins: [
        {
          plugin: markdownItMermaid
        }
      ]
    }
  },
  mounted () {
    this.initFunction()
  },
  computed: {
    dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  methods: {
    initFunction: async function () {
      // Set window padding
      const mainDiv = this.$refs.processViewer
      if (mainDiv) {
        if (!this.isoverlay) {
          mainDiv.classList.add('pt_nav')
        } else {
          mainDiv.classList.remove('pt_nav')
        }
      }
      // Whose knowledge are we trying to see? Return if there is no source
      // Get URL parameters
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop)
      })
      let srcGUID = this.chatguid
      if (srcGUID == null || srcGUID === '') {
        srcGUID = params.cguid
      }
      let from = 'clarifier'
      if (srcGUID == null) {
        srcGUID = params.kguid
        if (!srcGUID) return
        from = 'guid'
      }
      const knowledge = await this.getKnowledge(srcGUID, from)
      if (knowledge != null) {
        this.knowledge = knowledge
      }
      this.renderMermaidInit()
      await this.getProcessInformation()
      this.$refs.processScroller.onscroll = this.throttle(() => this.handleScroll())
    },
    getKnowledge: async function (guid, from = 'clarifier') {
      if (!guid || !from) return
      let url = 'knowledge/private/chat/' + guid
      if (from === 'uid') {
        url = 'knowledge/private/get/' + guid
      }
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: url
        }).then((data) => {
          this.knowledge = data.result
          if (this.knowledge.categories != null) {
            for (let i = 0; i < this.knowledge.categories.length; i++) {
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
    getProcessInformation: async function (srcguidOverride = '') {
      return new Promise((resolve) => {
        let guid
        if (srcguidOverride === '') {
          if (!this.isoverlay) {
            guid = this.$route.params.id
          } else {
            guid = this.srcguid
          }
        } else {
          guid = srcguidOverride
        }
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'process/private/path/' + guid
        })
          .then((data) => {
            if (srcguidOverride === '') {
              this.contentLinks = new Map()
              if (data.result.path) this.processEvents = data.result.path
              if (this.processEvents.length > 0) {
                this.docExists = this.processEvents[0].process.ref !== -1
              }
              let elem
              for (let i = 0; i < this.processEvents.length; i++) {
                this.processEvents[i].process.hasNext = ((i + 1) < this.processEvents.length)
                elem = this.processEvents[i]
                this.buildContentLinks(elem.process, false)
                if (elem.children && elem.children.length > 0) {
                  for (let j = 0; j < elem.children.length; j++) {
                    this.buildContentLinks(elem.children[j].process, false)
                  }
                }
              }
              this.contentLinksArr = Array.from(this.contentLinks, function (item) {
                return item[1]
              })
            }
            resolve(data.result)
          })
          .catch((err) => {
            console.debug(err.message)
            this.processEvents = []
          })
          .finally(() => {
            this.renderMermaid()
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
    clickedBack: async function () {
      // Are we currently editing an event?
      if (this.isEditingProcess === true) {
        await this.updateEvent(this.editingProcess)
      }
      if (!this.isoverlay) {
        this.$router.back()
      } else {
        this.$emit('close')
      }
    },
    writeProcess: async function (sourceEvent, addExtra = false) {
      const srcGUID = sourceEvent.uid
      if (!srcGUID || srcGUID === '') return
      this.writingSource = sourceEvent
      await this.createProcess(true)
      if (addExtra) {
        await this.createProcess(true)
      }
    },
    createProcess: async function (empty = false) {
      if (!empty) {
        if (this.processTitle.trim() === '' &&
          this.processDescription.trim() === '' &&
          this.processKeywords.trim() === '') {
          return
        }
      }
      return new Promise((resolve) => {
        let payload
        if (!empty) {
          payload = {
            t: this.processTitle.trim(),
            desc: this.processDescription.trim(),
            keys: this.processKeywords.trim(),
            pid: this.knowledge.uid,
            prev: [this.writingSource.uid]
          }
        } else {
          payload = {
            t: '',
            desc: '',
            keys: '',
            pid: this.knowledge.uid,
            prev: [this.writingSource.uid]
          }
        }
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'process/private/create',
          body: JSON.stringify(payload)
        }).then((data) => {
          console.log(data.result)
          this.isWritingProcess = false
          this.processTitle = ''
          this.processDescription = ''
          this.processKeywords = ''
        })
          .then(() => (this.getProcessInformation()))
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
      })
    },
    editEventTitle: async function (event) {
      if (this.drag) return
      // Are we currently editing an event?
      if (this.isEditingProcess === true && (this.editingProcess && this.editingProcess.uid !== event.uid)) {
        await this.updateEvent(this.editingProcess)
      }
      event.editingTitle = true
      this.isEditingProcess = true
      this.dragOptions.disabled = true
      setTimeout(() => {
        const elem = document.getElementById(event.uid + '_title_edit')
        if (elem) {
          elem.focus()
        }
      }, 0)
    },
    editEventDescription: async function (event) {
      if (this.drag) return
      // Are we currently editing an event?
      if (this.isEditingProcess === true && (this.editingProcess && this.editingProcess.uid !== event.uid)) {
        await this.updateEvent(this.editingProcess)
      }
      event.editingDescription = true
      this.isEditingProcess = true
      this.editingProcess = event
      this.dragOptions.disabled = true
      setTimeout(() => {
        const elem = document.getElementById(event.uid + '_description_edit')
        if (elem) {
          elem.focus()
        }
      }, 0)
    },
    updateEvent: function (pEvent) {
      let payload
      if (pEvent.editingTitle) {
        payload = {
          field: 'title',
          new: pEvent.t.trim()
        }
      } else if (pEvent.editingDescription) {
        payload = {
          field: 'desc',
          new: pEvent.desc.trim()
        }
      }
      pEvent.editingTitle = false
      pEvent.editingDescription = false
      this.isEditingProcess = false
      this.dragOptions.disabled = true
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'process/private/edit/' + pEvent.uid,
          body: JSON.stringify(payload)
        })
          .then(() => (this.editingProcess = null))
          .then(() => (this.getProcessInformation()))
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
      })
    },
    deleteEvent: function (event) {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'process/private/delete/' + event.uid
        })
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
          .finally(() => {
            this.getProcessInformation()
          })
      })
    },
    finishEventTask: async function (task, doDelete = false) {
      if (task == null) return
      let endpoint = 'finish'
      if (doDelete) endpoint = 'delete'
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'wisdom/private/' + endpoint + '/' + task.uid
        })
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
          .finally(() => {
            this.getProcessInformation()
          })
      })
    },
    generateDocumentation: function () {
      if (this.processEvents.length < 1) return
      return new Promise((resolve) => {
        const payload = {
          action: 'generate_documentation'
        }
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'm9/interact/' + this.processEvents[0].process.uid,
          body: JSON.stringify(payload)
        })
          .then((data) => {
            this.isViewingDocumentation = true
            this.documentation = data.result
          })
          .then(() => this.renderMermaid())
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
      })
    },
    createTasks: function () {
      if (this.processEvents.length < 1) return
      return new Promise((resolve) => {
        const payload = {
          action: 'create_tasks'
        }
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'm9/interact/' + this.processEvents[0].process.uid,
          body: JSON.stringify(payload)
        })
          .then((data) => {
            this.$router.push('/apps/knowledge/' + data.result + '?src=' + this.knowledge.uid)
          })
          .then(() => this.renderMermaid())
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
      })
    },
    publishLesson: function () {
      const mTitle = this.documentation.split('\n', 1)[0]
      const mBody = this.documentation.split(mTitle)[1]
      const payload = {
        t: mTitle,
        desc: mBody,
        pid: this.knowledge.uid,
        keys: 'documentations,docs,process,' + mTitle.replaceAll('#', '').trim(),
        copy: '',
        cats: [],
        type: 'lesson'
      }
      // Create entry on the backend
      const bodyPayload = JSON.stringify(payload)
      let wisdomGUID = ''
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'wisdom/private/create',
          body: bodyPayload
        })
          .then((data) => {
            this.setWisdomGUIDForEvent(data.result)
            wisdomGUID = data.result
          })
          .then(() => {
            this.$router.push('/apps/knowledge/' + wisdomGUID + '?src=' + this.knowledge.uid)
          })
          .then(() => resolve)
          .catch((err) => {
            console.debug(err.message)
            this.noResults = true
          })
      })
    },
    setWisdomGUIDForEvent: async function (guid) {
      if (!guid || guid === '') return
      const pEvent = this.processEvents[0].process
      pEvent.wisdomGUID = guid
      await this.updateEvent(pEvent)
    },
    handleDragChange: function (e) {
      const prefix = 'box_events_guid_'
      if (e.added) {
        // Moved to another box!
        console.log(e.added.element.uid, 'MOVED to index', e.added.newIndex,
          'for new box', this.lastDragMove.to.parentElement.id.substring(prefix.length))
        // Set new rowIndex and boxGUID for this task!
        this.moveTask(e.added.element.uid, e.added.newIndex,
          this.lastDragMove.to.parentElement.id.substring(prefix.length), true)
      } else if (e.moved) {
        // Moved inside current box.
        console.log(e.moved.element.uid, 'MOVED to index', e.moved.newIndex)
        // Set new rowIndex for this task!
        this.moveTask(e.moved.element.uid, e.moved.newIndex,
          this.lastDragMove.to.parentElement.id.substring(prefix.length), false)
      }
    },
    moveTask: function (taskGUID, newRowIndex, boxGUID, newBox) {
      for (const i in this.processEvents) {
        if (this.processEvents[i].process.uid === boxGUID) {
          if (this.processEvents[i].children && this.processEvents[i].children.length > 1) {
            if (newRowIndex > 0) {
              // rowIndex != 0 so compare the tasks before and after
              const rowIndexTaskBefore = this.processEvents[i].children[newRowIndex - 1].row
              if (this.processEvents[i].children.length - 1 > newRowIndex) {
                const rowIndexTaskAfter = this.processEvents[i].children[newRowIndex + 1].row
                newRowIndex = Math.floor((rowIndexTaskBefore + rowIndexTaskAfter) / 2)
              } else {
                newRowIndex = rowIndexTaskBefore + 20000
              }
            } else {
              // rowIndex = 0 so just look at the second task if it exists
              newRowIndex = Math.floor(this.processEvents[i].children[1].row / 2)
            }
          } else {
            // First task => Set it to 0
          }
        }
      }
      if (newRowIndex <= 1) {
        newRowIndex = 0.5
      }
      console.log('New Row Index:', newRowIndex)
      let field = 'row'
      if (newBox) {
        field = 'link'
      }
      const payload = {
        field: field,
        row: newRowIndex,
        fromId: boxGUID
      }
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'process/private/edit/' + taskGUID + '?mode=sub',
          body: JSON.stringify(payload)
        })
          .then(() => (this.getProcessInformation()))
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
      })
    },
    handleDragMove: function (e) {
      this.lastDragMove = e
    },
    endDrag: function () {
      setTimeout(() => (this.drag = false), 100)
    },
    addToTextArea: function (id, text, addToProcess = true) {
      if (text == null || text === '') return
      const textarea = document.getElementById(id)
      if (textarea == null) return
      const startPosition = textarea.selectionStart
      const endPosition = textarea.selectionEnd

      textarea.value = `${textarea.value.substring(
        0,
        startPosition
      )}${text}${textarea.value.substring(
        endPosition,
        textarea.value.length
      )}`
      if (addToProcess) {
        this.editingProcess.desc = textarea.value
      }
    },
    handleUploadFileSelect: async function (evt, drop = false) {
      if (!evt) return
      evt.stopPropagation()
      evt.preventDefault()
      let files
      if (drop) {
        files = evt.dataTransfer.files
      } else {
        files = evt.target.files
      }
      this.uploadFileBase64 = await this.getBase64(files[0])
      this.uploadFileType = files[0].type
      this.uploadFileName = files[0].name
    },
    getBase64: function (file) {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader()
        reader.onload = function () {
          resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    },
    cancelAddMedia: function () {
      this.isAddingMedia = false
      this.uploadFileType = ''
      this.uploadFileName = ''
      this.uploadFileBase64 = ''
    },
    uploadSnippet: function () {
      const content = JSON.stringify({
        base64: this.uploadFileBase64,
        name: this.uploadFileName
      })
      this.$Worker.execute({
        action: 'api',
        method: 'post',
        url: 'files/private/create',
        body: content
      })
        .then((data) => (this.processUploadSnippetResponse(data.result)))
        .catch((err) => (this.handleUploadSnippetError(err.message)))
    },
    handleUploadSnippetError: function (errorMessage = '') {
      console.debug(errorMessage)
      this.$notify(
        {
          t: 'File Not Uploaded',
          text: 'An Error occurred while uploading the file.',
          type: 'error'
        })
    },
    processUploadSnippetResponse: async function (response) {
      const contentURL = this.$store.state.serverIP + '/files/public/get/' + response
      let prefix
      if (this.uploadFileType.includes('image')) {
        prefix = '!'
      } else {
        prefix = '\n\n'
      }
      let filename = this.uploadFileName
      if (filename == null || filename === '') filename = 'Snippet'
      let text = prefix + '[' + filename + '](' + contentURL + ')'
      if (prefix === '!') {
        text = '\n\n' + text + '\n\n'
      }
      setTimeout(() => {
        this.addToTextArea(this.editingProcess.uid + '_description_edit', text)
        this.renderMermaid()
      }, 0)
      this.cancelAddMedia()
    },
    buildContentLinks: function (process, reset = true) {
      if (reset) {
        this.contentLinks = new Map()
      }
      if (!process) {
        return
      }
      let header
      let headerLink
      let headerNumber
      let linkLevel
      // Title
      if (process.t && process.t !== '') {
        linkLevel = this.getLinkLevel(process.t)
        header = process.t.replace(/^#+/g, '')
        headerLink = this.convertToLink(header)
        this.contentLinks.set(headerLink, {
          t: header.trim(),
          link: headerLink,
          level: linkLevel,
          active: false
        })
      }
      // Description
      const headers = [...process.desc.matchAll(/^#+.*/gm)]
      if (headers.length > 0) {
        const counter = new Map()
        for (let i = 0; i < headers.length; i++) {
          linkLevel = this.getLinkLevel(headers[i].toString())
          header = headers[i].toString().replace(/^#+/g, '')
          headerLink = this.convertToLink(header)
          if (counter.has(headerLink)) {
            headerNumber = counter.get(headerLink)
            counter.set(headerLink, counter.get(headerLink) + 1)
            headerLink = `${headerLink}-${headerNumber}`
          } else {
            counter.set(headerLink, 1)
          }
          this.contentLinks.set(headerLink, {
            t: header.trim(),
            link: headerLink,
            level: linkLevel,
            active: false
          })
        }
      }
    },
    convertToLink: function (header) {
      if (!header || header === '') {
        return ''
      }
      header = header.trim()
      header = header.replace(/\s+/g, '-')
      header = header.toLowerCase()
      header = encodeURIComponent(header)
      return '#' + header
    },
    /**
     * Returns the link level (# lvl 0, ## lvl 1, ### lvl 2, etc.)
     * @param {string} header
     * @returns {Array}
     */
    getLinkLevel: function (header) {
      if (!header || header === '' || typeof header !== 'string') {
        return []
      }
      const length = header.length
      const level = []
      let levelCounter = 0
      let sub
      for (let i = 0; i < length; i++) {
        sub = header.substring(i, i + 1)
        if (sub === '#') {
          levelCounter += 1
          if (levelCounter > 1) {
            level.push(' ')
          }
        } else if (sub === ' ' || sub.match(/\w/g)) {
          break
        }
      }
      if (level.length > 0) {
        level[level.length - 1] = '|'
      }
      return level
    },
    throttle: function (callback, limit = 100) {
      let waiting = false
      return function () {
        if (!waiting) {
          callback.apply(this, arguments)
          waiting = true
          setTimeout(function () {
            waiting = false
          }, limit)
        }
      }
    },
    handleScroll: function () {
      const headers = this.$refs.processScroller.querySelectorAll('h1, h2, h3, h4, h5, h6')
      let offsetTop
      for (let i = headers.length - 1; i >= 0; i--) {
        offsetTop = headers[i].getBoundingClientRect().top - 120
        if (offsetTop < 0) {
          if (!this.currentHeaders.has(headers[i])) {
            this.currentHeaders.set(headers[i], true)
            const tmp = this.contentLinks.get(`#${headers[i].id}`)
            if (tmp) {
              tmp.active = true
              this.contentLinks.set(`#${headers[i].id}`, tmp)
              document.getElementById(`link_#${headers[i].id}`).scrollIntoView({
                block: 'center'
              })
            }
          }
        } else {
          if (this.currentHeaders.has(headers[i])) {
            this.currentHeaders.delete(headers[i])
            const tmp = this.contentLinks.get(`#${headers[i].id}`)
            if (tmp) {
              tmp.active = false
              this.contentLinks.set(`#${headers[i].id}`, tmp)
              document.getElementById(`link_#${headers[i].id}`).scrollIntoView({
                block: 'center'
              })
            }
          }
        }
      }
    }
  }
}
</script>

<style>

.sidebar_button:hover {
  @apply primary;
}

.adder_button {
  @apply cursor-pointer primary hover:primary-container p-1
  sidebar_button w-fit h-fit rounded-r-md;
}

.adder_button * {
  @apply primary rounded-full
}

.pathIndicator {
  @apply w-[2px] h-full absolute left-0;
  border: 2px solid var(--md-sys-color-primary);
}

.modeIndicator {
  @apply text-xs font-bold primary p-1 w-fit rounded-r-md;
}

.editSubmit {
  @apply relative right-0 btn_bg_primary;
}

.segmentSettings {
  @apply opacity-0;
}

.segmentSettings:focus,
.segmentSettings:hover,
.segment:hover .segmentSettings {
  @apply opacity-100;
}

.p_card_menu_list {
  @apply absolute mt-2 origin-top-right divide-y divide-zinc-400 rounded-md
  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10;
}

.ghost {
  @apply m-2 brightest_bg border-2 border-zinc-200 rounded;
}

.ghost * {
  @apply opacity-0;
}

.chosen {
  @apply opacity-100 -rotate-3;
}

.chosen .pathIndicator {
  @apply opacity-0;
}

</style>
