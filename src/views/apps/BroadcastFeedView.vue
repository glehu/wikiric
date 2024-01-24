<template>
  <div id="broadcastFeedViewer" ref="broadcastFeedViewer"
       class="background w-full h-full relative overflow-hidden"
       :class="{'rounded-tl': isoverlay, 'rounded-tr': !isoverlay}">
    <template v-if="knowledgeExists">
      <div class="w-full h-fit background p-2 flex items-center">
        <button v-on:click="clickedBack()"
                class="mr-2 hover:primary rounded"
                v-tooltip.bottom="{
                         content: 'Close Feed'
                       }">
          <XMarkIcon class="w-8 h-8"/>
        </button>
        <p class="font-bold pointer-events-none">
          Broadcast Feed
        </p>
      </div>
      <template v-if="posts.length < 1">
        <div class="w-full h-fit px-2 py-1 my-2 flex items-center justify-center">
          <p class="font-bold">{{ $t("gen.emptyState") }}</p>
        </div>
      </template>
      <div id="feed_list" ref="feed_list"
           class="w-full max-h-[calc(100%-50px)] flex justify-center
                    overflow-x-hidden overflow-y-auto">
        <div class="w-full h-full max-w-screen-sm pb-96">
          <div class="w-full flex items-center justify-end h-fit">
            <button v-on:click="getFeed(true)"
                    class="w-fit px-4 py-0.5 m-2 rounded-md surface-variant fmt_border
                           hover:primary hover:dshadow flex gap-2 items-center">
              <ArrowPathIcon class="h-4 w-4"/>
              <span class="text-sm">Reload</span>
            </button>
          </div>
          <template v-for="post in posts" :key="post.uid">
            <div class="post_container">
              <div class="post_header">
                <p class="text-sm font-bold">{{ post.name }}</p>
                <p class="text-xs">{{ getHumanReadableDateText(post.result.ts, true) }}</p>
              </div>
              <div class="px-2 pt-2 surface md:rounded-t-md">
                <div v-if="post.result.views && post.result.views > 0"
                     class="flex items-center p-1">
                  <EyeIcon class="w-5 h-5 mr-1"></EyeIcon>
                  <span class="font-bold text-sm">{{ post.result.views }}</span>
                </div>
                <template v-if="post.result.reacts && post.result.reacts.length > 0">
                  <div class="flex">
                    <div v-for="reaction in post.result.reacts" :key="reaction.src"
                         class="flex items-center p-1 mr-1
                                cursor-pointer"
                         :title="reaction.src.toString() + ' reacted to this.'"
                         v-on:click="reactToPost(post, reaction.t)"
                         :id="'react_' + post.result.uid + '_' + reaction.t">
                      <HandThumbUpIcon v-if="reaction.t === '+'"
                                       class="w-5 h-5 mr-1"></HandThumbUpIcon>
                      <HandThumbDownIcon v-else-if="reaction.t === '-'"
                                         class="w-5 h-5 mr-1"></HandThumbDownIcon>
                      <StarIcon v-else-if="reaction.t === '⭐'"
                                class="w-5 h-5 mr-1"></StarIcon>
                      <span v-else> {{ reaction.t }} </span>
                      <span class="font-bold text-sm">{{ reaction.src.length }}</span>
                    </div>
                  </div>
                </template>
              </div>
              <div class="post relative">
                <div v-if="post.result.cats.length > 0"
                     class="flex gap-2 mb-2">
                  <template v-for="cat in post.result.cats" :key="cat">
                    <div v-if="cat.t != null"
                         class="wisdomCat"
                         :style="{borderColor: cat.hex}">
                      {{ cat.t }}
                    </div>
                  </template>
                </div>
                <p class="text-2xl mb-2 font-bold">{{ post.result.t }}</p>
                <template v-if="post.result.desc">
                  <Markdown class="markedView big_img break-words"
                            :source="post.result.desc"
                            :plugins="plugins"></Markdown>
                </template>
                <div :id="'post_emotes_' + post.result.uid"
                     class="hidden w-full h-full absolute bottom-0">
                  <listpickerviewer v-show="isWritingEmote"
                                    class="w-fit z-50 absolute bottom-0 left-0 -translate-x-4"
                                    :list="emoteList"
                                    :query="commentText"
                                    :prefix="':'"
                                    :key-name="'t'"
                                    :headline="'Send a custom emote (Tab to complete)'"
                                    @confirm="handleCustomEmoteConfirmation"
                                    @close="isWritingEmote = false"/>
                </div>
              </div>
            </div>
            <div class="my-1 flex justify-between">
              <div class="w-full">
                <button :id="'post_comment_btn_' + post.result.uid"
                        v-on:click="startReplying(post.result.uid)"
                        class="w-fit px-4 py-0.5 m-2 rounded-full surface-variant fmt_border
                            hover:primary hover:dshadow">
                  <span class="text-sm">Reply</span>
                </button>
                <div :id="'post_comment_text_' + post.result.uid"
                     class="hidden w-full h-fit mb-4">
                  <textarea :id="'post_comment_textarea_' + post.result.uid"
                            v-model="commentText"
                            v-on:input="handleCommentInput()"
                            v-on:keydown="handleEnter()"
                            name="post_comment"
                            rows="3"
                            class="w-full fmt_input ml-1"></textarea>
                  <div class="w-full flex justify-end gap-x-4">
                    <div v-on:click="cancelReplying()"
                         class="w-fit px-4 py-0.5 mt-1 rounded-full surface-variant
                                cursor-pointer hover:error hover:dshadow fmt_border">
                      <span class="text-sm">Cancel</span>
                    </div>
                    <div v-on:click="replyToPost(post)"
                         class="w-fit px-4 py-0.5 mt-1 rounded-full primary
                                cursor-pointer hover:primary-container hover:dshadow">
                      <span class="text-sm">Send</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex w-fit">
                <div class="sidebar_button rounded-md">
                  <div v-on:click="reactToPost(post.result, '+')"
                       v-tooltip.bottom="{
                         content: 'Upvote Post'
                       }"
                       class="cursor-pointer p-2">
                    <HandThumbUpIcon class="h-6 w-6"></HandThumbUpIcon>
                  </div>
                </div>
                <div class="sidebar_button rounded-md">
                  <div v-on:click="reactToPost(post.result, '-')"
                       v-tooltip.bottom="{
                         content: 'Downvote Post'
                       }"
                       class="cursor-pointer p-2">
                    <HandThumbDownIcon class="h-6 w-6"></HandThumbDownIcon>
                  </div>
                </div>
                <div class="sidebar_button rounded-md">
                  <div v-on:click="reactToPost(post.result, '⭐')"
                       v-tooltip.bottom="{
                         content: 'Wow!'
                       }"
                       class="cursor-pointer p-2">
                    <StarIcon class="h-6 w-6"></StarIcon>
                  </div>
                </div>
              </div>
            </div>
            <div class="mx-2 px-1 rounded-l-xl"
                 style="border-left: 2px solid var(--md-sys-color-outline-variant)">
              <template v-for="comment in post.result.replies" :key="comment.uID">
                <div class="mb-1 w-full comment relative">
                  <div class="px-2 py-1 rounded-md w-fit">
                    <div class="flex items-center gap-2">
                      <p class="text-sm font-bold">{{ comment.usr }}</p>
                      <p class="text-xs mr-2">
                        {{ getHumanReadableDateText(comment.ts, true) }}
                      </p>
                      <div v-if="comment.reacts" class="flex">
                        <div v-for="reaction in comment.reacts" :key="reaction.src"
                             class="flex items-center p-1 mr-1 cursor-pointer"
                             :title="reaction.src.toString() + ' reacted to this.'"
                             v-on:click="reactToPost(comment, reaction.t)"
                             :id="'react_' + comment.uid + '_' + reaction.t">
                          <HandThumbUpIcon v-if="reaction.t === '+'"
                                           class="w-5 h-5 mr-1"></HandThumbUpIcon>
                          <HandThumbDownIcon v-else-if="reaction.t === '-'"
                                             class="w-5 h-5 mr-1"></HandThumbDownIcon>
                          <StarIcon v-else-if="reaction.t === '⭐'"
                                    class="w-5 h-5 mr-1"></StarIcon>
                          <span v-else> {{ reaction.t }} </span>
                          <span>{{ reaction.src.length }}</span>
                        </div>
                      </div>
                    </div>
                    <Markdown :source="comment.desc"
                              class="w-full markedView"
                              :plugins="plugins"></Markdown>
                  </div>
                  <div class="flex w-fit absolute translate-x-4 -translate-y-9 right-0">
                    <div class="flex mr-2 comment_react">
                      <div class="sidebar_button rounded-xl">
                        <div v-on:click="reactToPost(comment, '+')"
                             class="cursor-pointer p-2"
                             v-tooltip.bottom="{
                               content: 'Upvote Comment'
                             }">
                          <HandThumbUpIcon class="h-6 w-6"></HandThumbUpIcon>
                        </div>
                      </div>
                      <div class="sidebar_button rounded-xl">
                        <div v-on:click="reactToPost(comment, '-')"
                             class="cursor-pointer p-2"
                             v-tooltip.bottom="{
                               content: 'Downvote Comment'
                             }">
                          <HandThumbDownIcon class="h-6 w-6"></HandThumbDownIcon>
                        </div>
                      </div>
                      <div class="sidebar_button rounded-xl">
                        <div v-on:click="reactToPost(comment, '⭐')"
                             class="cursor-pointer p-2"
                             v-tooltip.bottom="{
                               content: 'Wow!'
                             }">
                          <StarIcon class="h-6 w-6"></StarIcon>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="post.result.moreReplies">
                <div class="w-full h-fit flex justify-center">
                  <div :id="'post_comment_btn_' + post.result.uid"
                       v-on:click="loadMoreReplies(post)"
                       class="w-fit px-4 py-0.5 m-2 rounded-full surface-variant fmt_border
                              cursor-pointer hover:primary hover:dshadow">
                    <span class="text-sm">Show all replies</span>
                  </div>
                </div>
              </template>
            </div>
          </template>
          <div class="w-full h-fit flex justify-center items-center mt-24 pointer-events-none">
            <CheckIcon class="w-8 h-8 mr-2"/>
            <p class="text-lg font-bold">Done!</p>
          </div>
        </div>
      </div>
      <div>
        <div v-on:click="startWriting()"
             class="newPostButton primary"
             v-tooltip.top="{
                               content: 'New Post'
                             }">
          <PlusIcon class="h-6 w-6"/>
        </div>
      </div>
    </template>
  </div>
  <modal @close="isWritingPost = false"
         v-show="isWritingPost">
    <template v-slot:header>
      <p>New Post</p>
    </template>
    <template v-slot:body>
      <div class="flex w-[calc(100dvw-36px)] h-[calc(100dvh-150px)] gap-x-1 p-2 overflow-x-hidden">
        <div class="w-full md:w-1/2">
          <div class="md:hidden flex mt-2 w-full">
            <div class="mb-1 text-black font-bold rounded
                          w-full flex items-center justify-end">
              <button v-on:click="createPost()"
                      class="mr-2 btn_bg_primary"
                      v-tooltip.top="{
                       content: 'Save changes'
                     }">
                <span>Submit</span>
              </button>
              <button v-on:click="isWritingPost = false"
                      class="mr-2 py-2 px-3 hover:dshadow rounded-md surface-variant"
                      v-tooltip.top="{
                       content: 'Discard changes'
                     }">
                <span>Cancel</span>
              </button>
            </div>
          </div>
          <div class="block lg:flex w-full">
            <div class="lg:w-1/2">
              <label for="wisCategories" class="mt-2 font-bold">
                <span>Categories:</span>
              </label>
              <br>
              <Listbox v-model="newPost.cats" multiple id="wisCategories">
                <div class="relative mt-1">
                  <ListboxButton
                    class="surface w-full relative cursor-default rounded-lg
                             py-2 pl-3 pr-10 mb-2 text-left shadow-sm focus:outline-none
                             focus-visible:border-indigo-500 focus-visible:ring-2
                             focus-visible:ring-white focus-visible:ring-opacity-75
                             focus-visible:ring-offset-2
                             focus-visible:ring-offset-orange-300 sm:text-sm"
                  >
                    <template v-if="newPost.cats.length > 0">
                      <div class="block truncate font-bold">
                        <p>{{ newPost.cats.map((cat) => cat.t).join(', ') }}</p>
                      </div>
                    </template>
                    <template v-else>
                      <span class="block truncate font-bold ">Select...</span>
                    </template>
                    <div
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ArrowsUpDownIcon class="h-5 w-5 " aria-hidden="true"/>
                    </div>
                  </ListboxButton>
                  <transition
                    leave-active-class="transition duration-100 ease-in"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0">
                    <ListboxOptions
                      class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md surface
                               py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5
                               focus:outline-none sm:text-sm z-50">
                      <ListboxOption
                        v-slot="{ active, selected }"
                        v-for="cat in knowledge.cats"
                        :key="cat"
                        :value="cat"
                        as="template">
                        <li
                          :class="[ active ? 'primary-container' : '',
                                  'relative cursor-pointer select-none py-2 pl-10 pr-4' ]">
                          <div
                            :class="[ selected ? 'font-medium' : 'font-normal', 'block truncate' ]">
                            <p class="border-l-8 pl-2 rounded-l-md"
                               :style="{borderColor: cat.hex}">
                              {{ cat.t }}
                            </p>
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
            <div class="lg:w-3/5 lg:ml-3">
              <label for="wisKeywords" class="mt-2 font-bold">Keywords:</label>
              <br>
              <input type="text" id="wisKeywords" v-model="newPost.keys"
                     class="fmt_input surface rounded-md py-2 px-3 mt-1 w-full">
            </div>
          </div>
          <label for="wisTitle" class="font-bold">
            <span>Title:</span>
          </label>
          <input type="text" id="wisTitle" v-model="newPost.t"
                 class="fmt_input surface rounded-md w-full py-2 px-3 mt-1 mb-2">
          <div class="flex items-center">
            <label for="postDescription" class="font-bold">Description:</label>
            <div class="ml-2 p-1">
              <button class="btn_small_icon"
                      v-on:click="isAddingMedia = true">
                <DocumentArrowUpIcon
                  class="h-6 w-6 mr-1"
                  aria-hidden="true"
                />
                <span>Add File</span>
              </button>
            </div>
          </div>
          <div id="postDescriptionEditor" ref="postDescriptionEditor"
               class="w-full mt-1 h-full no_fmt">
            <textarea type="text" id="postDescription" v-model="newPost.desc"
                      rows="20" class="fmt_input w-full surface py-2 px-3 hidden"></textarea>
          </div>
        </div>
        <div class="hidden md:block w-1/2">
          <label class="text-xl font-bold pointer-events-none">Preview:</label>
          <br>
          <div class="flex mt-1 w-full">
            <div class="text-black font-bold rounded-md w-full
                          flex justify-end items-center mb-2">
              <button v-on:click="createPost()"
                      class="mr-2 btn_bg_primary"
                      v-tooltip.top="{
                       content: 'Submit entry'
                     }">
                <span>Submit</span>
              </button>
              <button v-on:click="isWritingPost = false"
                      class="mr-2 py-2 px-3 rounded-md hover:dshadow surface-variant"
                      v-tooltip.top="{
                       content: 'Discard'
                     }">
                <span>Cancel</span>
              </button>
            </div>
          </div>
          <div class="surface rounded-md p-2 mt-1 cursor-not-allowed fmt_border">
            <Markdown :source="'# ' + newPost.t" class="w-full markedView" :plugins="plugins"></Markdown>
            <Markdown :source="newPost.desc" class="w-full mt-4 markedView" :plugins="plugins"></Markdown>
          </div>
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
          <button class="darkbutton p-2 w-full
                           flex items-center justify-center rounded-full"
                  style="height: 2.5em;
                           border-color: transparent; margin: auto"
                  title="Send"
                  v-on:click="uploadSnippet">
            <span class="font-bold flex on-primary-text">Submit</span>
            <span style="margin-left: 10px"
                  class="c_lightgray text-xs on-primary-text">
                {{ this.uploadFileType }}
              </span>
          </button>
        </div>
      </template>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
</template>

<script>
import modal from '../../components/Modal.vue'
import Markdown from 'vue3-markdown-it'
import markdownItMermaid from 'markdown-it-mermaid'
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from '@headlessui/vue'
import {
  DocumentArrowUpIcon,
  DocumentTextIcon, EyeIcon,
  FolderArrowDownIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  StarIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'
import { ArrowsUpDownIcon, CheckIcon, PlusIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import { Compartment, EditorState } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import { EditorView, keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { markdown } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { dbGetDisplayName } from '@/libs/wikistore'
import { DateTime } from 'luxon'
import mermaid from 'mermaid'
import listpickerviewer from '@/views/components/ListPickerView.vue'

export default {
  name: 'BroadcastFeedView',
  props: {
    isoverlay: Boolean,
    srcguid: String
  },
  emits: ['close'],
  components: {
    listpickerviewer,
    EyeIcon,
    HandThumbDownIcon,
    HandThumbUpIcon,
    StarIcon,
    FolderArrowDownIcon,
    DocumentTextIcon,
    PlusIcon,
    modal,
    CheckIcon,
    Markdown,
    ArrowsUpDownIcon,
    DocumentArrowUpIcon,
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    XMarkIcon,
    ArrowPathIcon
  },
  data () {
    return {
      chatGUID: '',
      knowledgeExists: true,
      knowledge: {
        t: '',
        desc: ''
      },
      newPost: {
        t: '',
        desc: '',
        keys: '',
        cats: []
      },
      newPostBackup: {},
      posts: [],
      lazyLoadingStatus: 'idle',
      pageIndex: 0,
      pageSize: 5,
      isWritingPost: false,
      isAddingMedia: false,
      isWritingEmote: false,
      isTaggingUser: false,
      lastReplyUID: '',
      plugins: [
        {
          plugin: markdownItMermaid
        }
      ],
      uploadFileName: '',
      uploadFileType: '',
      uploadFileBase64: '',
      commentText: '',
      emotes: null,
      emoteList: []
    }
  },
  mounted () {
    this.initFunction()
  },
  methods: {
    initFunction: async function () {
      // Backup new post object
      this.newPostBackup = structuredClone(this.newPost)
      // Get URL parameters
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop)
      })
      // Set window height
      const mainDiv = document.getElementById('broadcastFeedViewer')
      if (mainDiv) {
        if (!this.isoverlay) {
          mainDiv.classList.add('pt_nav')
        } else {
          mainDiv.classList.remove('pt_nav')
        }
      }
      // Whose knowledge are we trying to see? Return if there is no source
      let fromChat = false
      let srcGUID = this.srcguid
      if (srcGUID == null || srcGUID === '') {
        srcGUID = params.cguid
        this.chatGUID = srcGUID
      }
      if (srcGUID != null) {
        fromChat = true
        const chatroom = await this.getClarifierChatroom(srcGUID)
        if (chatroom != null) {
          this.source = chatroom.t
        }
      } else {
        srcGUID = params.kguid
        if (!srcGUID) return
      }
      const knowledge = await this.getKnowledge(srcGUID, fromChat)
      if (knowledge != null) {
        this.knowledge = knowledge
        this.chatGUID = this.knowledge.pid
      }
      if (fromChat) {
        await this.getCustomEmotes(srcGUID)
      }
      this.getFeed()
    },
    getClarifierChatroom: async function (sessionID) {
      if (!sessionID) return
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'chat/private/get/' + sessionID
        }).then((data) => resolve(data.result))
        .catch((err) => console.debug(err.message))
      })
    },
    getKnowledge: async function (guid, fromChat = false) {
      if (!guid) return
      return new Promise((resolve) => {
        let url
        if (fromChat) {
          url = 'knowledge/private/chat/'
        } else {
          url = 'knowledge/private/get/'
        }
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: url + guid
        }).then((data) => {
          this.knowledgeExists = true
          this.knowledge = data.result
          resolve()
        })
        .catch((err) => {
          if (err.message) this.knowledgeExists = false
        })
      })
    },
    getFeed: function (notify) {
      this.posts = []
      this.pageIndex = 0
      this.searchWisdom()
      if (notify) {
        this.$notify(
          {
            title: 'Up To Date!',
            text: '',
            type: 'fmt_notify'
          })
      }
    },
    createPost: async function () {
      const categories = []
      for (let i = 0; i < this.newPost.cats.length; i++) {
        categories.push(this.newPost.cats[i])
      }
      const payload = {
        type: 'post',
        t: this.newPost.t,
        desc: this.newPost.desc,
        pid: this.knowledge.uid,
        keys: this.newPost.keys,
        cats: categories
      }
      // Create entry on the backend
      const bodyPayload = JSON.stringify(payload)
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'wisdom/private/create',
          body: bodyPayload
        })
        .then(() => {
          this.resetWriting()
          // Since we are about to fetch the newest posts...
          // ...we need to reset the page index to 0
          this.pageIndex = 0
          // Fetch the newest posts
          this.getFeed()
        })
        .then(() => resolve())
        .catch((err) => {
          console.debug(err.message)
          this.noResults = true
        })
      })
    },
    startWriting: function () {
      this.isWritingPost = true
      this.showDescriptionCodeMirror()
    },
    resetWriting: function () {
      this.isWritingPost = false
      this.newPost = structuredClone(this.newPostBackup)
    },
    showDescriptionCodeMirror: function () {
      setTimeout(() => {
        if (this.cm == null) {
          const elem = document.getElementById('postDescriptionEditor')
          if (elem == null) {
            return
          }
          const tabSize = new Compartment()
          const updatePostDescription = EditorState.transactionExtender.of(tr => {
            if (!tr.docChanged) return null
            this.newPost.desc = tr.newDoc.toString()
          })
          const state = EditorState.create({
            doc: this.newPost.desc,
            extensions: [
              basicSetup,
              tabSize.of(EditorState.tabSize.of(4)),
              keymap.of([indentWithTab]),
              markdown({ codeLanguages: languages }),
              updatePostDescription,
              EditorView.lineWrapping
            ]
          })
          const view = new EditorView({
            state,
            parent: elem
          })
          if (view == null) return
          this.cm = view
        } else {
          this.cm.dispatch({
            changes: { from: 0, to: this.cm.state.doc.length, insert: this.newPost.desc }
          })
        }
      }, 0)
    },
    searchWisdom: async function (substitute = '.', lazyLoad = false) {
      if (lazyLoad) {
        this.pageIndex += 1
      }
      const payload = {
        query: substitute,
        type: 'post',
        state: 'any',
        fields: '',
        withReply: true,
        noSort: true,
        descLen: 1000
      }
      const parameters =
        '?page=' + this.pageIndex +
        '&results=' + this.pageSize
      let success = false
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'wisdom/private/query/' + this.knowledge.uid + parameters,
          body: JSON.stringify(payload)
        })
        .then((data) => {
          const parsedData = data.result
          if (parsedData.misc && parsedData.misc.length > 0) {
            this.addResults(parsedData.misc, 'post')
            success = true
          } else {
            this.lazyLoadingStatus = 'done'
          }
        })
        .then(() => resolve())
        .catch((err) => {
          console.debug(err.message)
          this.lazyLoadingStatus = 'done'
        })
        .finally(() => {
          if (success) {
            this.lazyLoadingStatus = 'idle'
            setTimeout(() => {
              if (this.$refs.feed_list) {
                // Set scroll listener to enable lazy loading upon reaching the end of the list
                this.$refs.feed_list.onscroll = this.checkScroll
                // Initiate checkScroll once to make sure we're not stuck in a list too small to trigger it
                this.checkScroll()
              }
            }, 100)
          }
        })
      })
    },
    addResults: async function (results, type) {
      let entry
      for (let i = 0; i < results.length; i++) {
        results[i].t = this.formatTitle(results[i].t)
        let dName = await dbGetDisplayName(results[i].usr)
        if (dName == null) {
          dName = results[i].usr
        }
        // Replace emotes in main content
        results[i].desc = this.replaceEmotePlaceholders(results[i].desc)
        // Are there comments? If so, replace emotes there, too
        if (results[i].replies) {
          for (let j = 0; j < results[i].replies.length; j++) {
            results[i].replies[j].desc = this.replaceEmotePlaceholders(results[i].replies[j].desc)
          }
        }
        // Add post to list
        entry = {
          priority: 'high',
          type: type,
          result: results[i],
          name: dName
        }
        this.posts.push(entry)
      }
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
    getHumanReadableDateText: function (date, withTime = true) {
      const time = DateTime.fromISO(date).toLocaleString(DateTime.TIME_24_SIMPLE)
      const start = DateTime.fromISO(DateTime.fromISO(date).toISODate())
      const end = DateTime.fromISO(DateTime.now().toISODate())
      const diffDays = Math.ceil(end.diff(start) / (1000 * 60 * 60 * 24))
      let suffix = ''
      if (withTime) {
        suffix = ', ' + time
      }
      let returnString
      switch (diffDays) {
        case -5:
          returnString = 'In 5 days' + suffix
          break
        case -4:
          returnString = 'In 4 days' + suffix
          break
        case -3:
          returnString = 'In 3 days' + suffix
          break
        case -2:
          returnString = 'In 2 days' + suffix
          break
        case -1:
          returnString = 'Tomorrow' + suffix
          break
        case 0:
          returnString = 'Today' + suffix
          break
        case 1:
          returnString = 'Yesterday' + suffix
          break
        case 2:
          returnString = '2 days ago' + suffix
          break
        default:
          returnString = start.toISODate() + suffix
      }
      return returnString
    },
    addToTextArea: function (id, text) {
      if (text == null || text === '') return
      const textarea = document.getElementById(id)
      if (textarea == null) return
      const startPosition = this.cm.state.selection.main.head
      const endPosition = this.cm.state.selection.main.head
      textarea.value = `${textarea.value.substring(
        0,
        startPosition
      )}${text}${textarea.value.substring(
        endPosition,
        textarea.value.length
      )}`
      this.newPost.desc = textarea.value
      this.showDescriptionCodeMirror()
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
          title: 'File Not Uploaded',
          text: 'An Error occurred while uploading the file.',
          type: 'error'
        })
    },
    processUploadSnippetResponse: async function (response) {
      const contentURL = this.$store.state.serverIP + '/files/public/get/' + response.trim()
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
        this.addToTextArea('postDescription', text)
        this.renderMermaid()
      }, 0)
      this.cancelAddMedia()
    },
    renderMermaid: function () {
      setTimeout(() => {
        mermaid.init()
      }, 0)
    },
    clickedBack: function () {
      if (!this.isoverlay) {
        this.$router.back()
      } else {
        this.$emit('close')
      }
    },
    reactToPost: async function (post, t) {
      const payload = JSON.stringify({
        reaction: t
      })
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'wisdom/private/react/' + post.uid,
          body: payload
        })
        .then(() => {
          this.$notify(
            {
              title: 'Feedback sent to the server.',
              text: 'Thanks!',
              type: 'fmt_notify'
            })
        })
        .then(() => resolve)
        .catch((err) => {
          console.debug(err.message)
        })
      })
    },
    startReplying: function (uid) {
      if (this.lastReplyUID !== '') {
        this.cancelReplying(this.lastReplyUID)
      }
      this.lastReplyUID = uid
      this.commentText = ''
      const button = document.getElementById('post_comment_btn_' + uid)
      const input = document.getElementById('post_comment_text_' + uid)
      button.style.display = 'none'
      input.style.display = 'block'
      const emoteSelector = document.getElementById('post_emotes_' + uid)
      emoteSelector.style.display = 'block'
      setTimeout(() => {
        const text = document.getElementById('post_comment_textarea_' + uid)
        text.focus()
        text.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        })
      }, 0)
    },
    cancelReplying: function (uid) {
      if (uid == null) {
        if (this.lastReplyUID !== '') {
          uid = this.lastReplyUID
        }
      }
      this.commentText = ''
      const button = document.getElementById('post_comment_btn_' + uid)
      const input = document.getElementById('post_comment_text_' + uid)
      button.style.display = 'block'
      input.style.display = 'none'
      const emoteSelector = document.getElementById('post_emotes_' + uid)
      emoteSelector.style.display = 'none'
    },
    replyToPost: async function (post, title = '') {
      const comment = this.commentText
      if (comment.trim() === '') return
      const payload = {
        t: title,
        desc: comment.trim(),
        ref: post.result.uid,
        keys: '',
        type: 'reply',
        pid: this.knowledge.uid
      }
      const bodyPayload = JSON.stringify(payload)
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'wisdom/private/reply',
          body: bodyPayload
        })
        .then(() => {
          this.cancelReplying(post.result.uid)
          this.$notify(
            {
              title: 'Comment submitted.',
              text: 'Thanks for your contribution!',
              type: 'fmt_notify'
            })
        })
        .then(() => resolve())
        .catch((err) => {
          console.debug(err.message)
        })
        .finally(() => {
          this.loadMoreReplies(post, 4)
          this.isWritingEmote = false
          this.isTaggingUser = false
        })
      })
    },
    loadMoreReplies: function (post, maxResults = -1) {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'wisdom/private/investigate/' + post.result.uid
        })
        .then(async (data) => {
          const related = data.result
          if (related.replies) {
            // Update post entry
            if (maxResults <= 0) {
              post.result.replies = related.replies
              post.result.moreReplies = false
            } else {
              post.result.replies = []
              // Limit actual maxResults as it can be smaller in reality
              if (related.replies.length < maxResults) {
                maxResults = related.replies.length
              }
              for (let i = 0; i < maxResults; i++) {
                related.replies[i].desc = this.replaceEmotePlaceholders(related.replies[i].desc)
                post.result.replies.push(related.replies[i])
              }
              post.result.moreReplies = related.replies.length > maxResults
            }
          }
        })
        .then(() => {
          this.renderMermaid()
          resolve()
        })
        .catch((err) => {
          console.debug(err.message)
        })
      })
    },
    checkScroll: function () {
      const temp = this.$refs.feed_list.scrollTop
      const distanceToBottom = this.$refs.feed_list.scrollHeight -
        this.$refs.feed_list.clientHeight - temp
      // If we're 600px from the bottom, start loading new messages
      if (distanceToBottom < 600) {
        if (this.lazyLoadingStatus === 'idle') {
          this.lazyLoadingStatus = 'start'
          this.searchWisdom('.', true)
        }
      }
    },
    getCustomEmotes: function (chatID) {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'files/private/chat/' + chatID + '?type=emote'
        }).then((data) => {
          const emotes = data.result.files
          if (emotes.length < 1) return
          let url
          let md
          let fname
          this.emotes = new Map()
          this.emoteList = []
          for (let i = 0; i < emotes.length; i++) {
            url = this.$store.state.serverIP + '/' + emotes[i].pth
            emotes[i].t = emotes[i].t.split('.')[0]
            fname = ':' + emotes[i].t + ':'
            // Build Markdown image string
            md = `![${fname}](${url})`
            this.emotes[fname] = md
            // Add to emote list (user prompt)
            emotes[i]._md = md
            this.emoteList.push(emotes[i])
          }
        })
        .then(() => resolve())
      })
    },
    replaceEmotePlaceholders: function (msg) {
      if (this.emotes == null) return msg
      const escape = s => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
      const pattern = new RegExp(
        Object.keys(this.emotes).map(escape).join('|'), 'g'
      )
      return msg.replace(pattern, match => this.emotes[match])
    },
    handleCommentInput: function () {
      // Check for @ to prompt user for tagging a person
      if (this.commentText.substring(this.commentText.length - 1) === '@') {
        this.isTaggingUser = true
      } else {
        // Hide the tagging window if there is no @ present
        if (this.isTaggingUser === true && !this.commentText.includes('@')) {
          this.isTaggingUser = false
        }
      }
      // Check for : to prompt user for completing a custom emote text
      if ((this.commentText.length === 1 && this.commentText.substring(this.commentText.length - 1)) === ':' ||
        this.commentText.substring(this.commentText.length - 2) === ' :') {
        this.isWritingEmote = true
        setTimeout(() => {
          const text = document.getElementById('post_comment_textarea_' + this.lastReplyUID)
          text.focus()
          text.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest'
          })
        }, 0)
      } else {
        // Hide the emote window if we typed a space
        if (this.isWritingEmote &&
          (this.commentText.substring(this.commentText.length - 1) === ' ' || !this.commentText.includes(':'))) {
          this.isWritingEmote = false
        }
      }
    },
    handleEnter: function () {
      if (event.key === 'Tab' || event.key === 'Tabulator' || event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        if (this.isTaggingUser === true || this.isWritingEmote === true) {
          event.preventDefault()
        }
      }
    },
    handleCustomEmoteConfirmation: function (obj) {
      this.isWritingEmote = false
      if (obj == null || obj.t == null) {
        return
      }
      for (let i = this.commentText.length - 1; i >= 0; i--) {
        if (this.commentText.substring(i, i + 1) === ':') {
          let j = i + 1
          for (j; j < this.commentText.length; j++) {
            if (this.commentText.substring(j, j + 1) === ' ') {
              break
            }
          }
          this.commentText = this.commentText.substring(0, i + 1) +
            obj.t + ': ' + this.commentText.substring(j)
          break
        }
      }
    }
  }
}
</script>

<style>
.newPostButton {
  @apply p-4
  cursor-pointer flex z-50
  fixed bottom-[30px] right-[40px]
  dshadow rounded-full;
  background-color: var(--md-sys-color-primary-container);
  border: 1px solid var(--md-sys-color-primary);
}

.newPostButton:hover {
  @apply primary;
}

.post_container {
  @apply w-full md:rounded-md;
}

.post_header {
  @apply flex justify-between items-baseline px-2 pt-6 pb-1;
}

.post {
  @apply p-2 surface;
}

.sidebar_button {
  @apply flex items-center h-fit ml-1 background;
}

.sidebar_button:hover {
  @apply primary;
}

</style>
