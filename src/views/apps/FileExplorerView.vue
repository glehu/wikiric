<template>
  <div id="fileExplorer" ref="fileExplorer"
       class="background w-full h-full relative overflow-hidden rounded-tr-lg">
    <div class="w-full min-h-[56px] max-h-[56px] px-2 py-3
                flex items-center background bshadow z-20 relative">
      <div class="sidebar_button rounded-md w-fit mr-2 hover:primary p-2 cursor-pointer">
        <div v-on:click="clickedBack()"
             v-tooltip="{ content: 'Exit' }">
          <XMarkIcon class="h-7 w-7"></XMarkIcon>
        </div>
      </div>
      <div class="pl-2 w-full">
        <input type="text" name="fileSearch" id="fileSearch" ref="fileSearch"
               v-model="query"
               placeholder="Search..."
               class="fmt_input rounded-md px-2 py-1 h-[40px] w-full bshadow">
      </div>
    </div>
    <template v-if="snippets && snippets.length > 0">
      <div class="h-[calc(100%-50px)] w-full flex flex-col relative gap-2
                  overflow-x-hidden overflow-y-auto p-2 background">
        <template v-for="snippet in snippets" :key="snippet.uid">
          <template v-if="query === '' || queryValid(snippet)">
            <div class="w-full h-fit relative file_outer pr-2">
              <div class="error file_download absolute top-2 right-4 rounded p-2 cursor-pointer"
                   style="border: 1px solid var(--md-sys-color-outline-variant)"
                   v-tooltip.left="{content: 'Delete File'}"
                   v-on:click="deleteSnippet(snippet.uid)">
                <TrashIcon class="h-6 w-6"></TrashIcon>
              </div>
              <a :href="snippet.pth"
                 download>
                <div class="surface p-2 rounded cursor-pointer flex flex-col
                            hover:surface-variant"
                     style="border: 1px solid var(--md-sys-color-outline-variant)"
                     v-tooltip.top="{content: 'Download File'}">
                  <template v-if="snippet.mime.includes('image/')">
                    <img :src="snippet.pth"
                         alt="&nbsp;"
                         class="max-w-[128px] max-h-[128px] mb-1">
                  </template>
                  <template v-else-if="snippet.mime.includes('audio/')">
                    <audio controls preload="auto"
                           class="mb-1">
                      <source :src="snippet.pth">
                      Your browser does not support playing audio.
                    </audio>
                  </template>
                  <p class="font-bold text-sm my-1">{{ snippet.t }}</p>
                  <div class="flex gap-x-2 items-center my-1">
                    <FolderArrowDownIcon class="h-6 w-6"></FolderArrowDownIcon>
                    <p class="text-sm">{{ snippet.mb }} MB</p>
                  </div>
                  <template v-if="snippet.emote">
                    <div class="flex gap-x-2 items-center my-1">
                      <FaceSmileIcon class="h-6 w-6"></FaceSmileIcon>
                      <p class="text-sm">{{ snippet.ph }}</p>
                    </div>
                  </template>
                  <p class="font-bold text-xs text-end">
                    {{ getHumanReadableDateText(snippet.ts) }}
                  </p>
                </div>
              </a>
            </div>
          </template>
        </template>
      </div>
    </template>
    <template v-else>
      <div class="w-full h-[calc(100%-50px)] flex items-center justify-center pointer-events-none">
        <p class="p-2 text-sm  dark_bg rounded-md">No files found!</p>
      </div>
    </template>
  </div>
</template>

<script>
import { FolderArrowDownIcon, TrashIcon, XMarkIcon, FaceSmileIcon } from '@heroicons/vue/24/outline'
import { DateTime } from 'luxon'

export default {
  name: 'FileExplorerView',
  props: {
    isoverlay: Boolean,
    srcguid: String,
    chatguid: String
  },
  emits: ['close'],
  components: {
    XMarkIcon,
    FolderArrowDownIcon,
    TrashIcon,
    FaceSmileIcon
  },
  data () {
    return {
      snippets: [],
      query: ''
    }
  },
  mounted () {
    this.initFunction()
  },
  methods: {
    initFunction: async function () {
      // Set window padding
      const mainDiv = this.$refs.fileExplorer
      if (mainDiv) {
        if (!this.isoverlay) {
          mainDiv.classList.add('pt_nav')
        } else {
          mainDiv.classList.remove('pt_nav')
        }
      }
      await this.getSnippets()
      this.$refs.fileSearch.focus()
    },
    clickedBack: function () {
      if (!this.isoverlay) {
        this.$router.back()
      } else {
        this.$emit('close')
      }
    },
    getSnippets: async function () {
      if (!this.chatguid) return
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'files/private/chat/' + this.chatguid
        }).then((data) => {
          this.snippets = data.result.files
          for (let i = 0; i < this.snippets.length; i++) {
            this.snippets[i].pth = this.$store.state.serverIP + '/' + this.snippets[i].pth
            if (this.snippets[i].type === 'emote') {
              this.snippets[i].emote = true
              this.snippets[i].ph = ':' + this.snippets[i].t.split('.')[0] + ':'
            }
          }
        })
        .then(() => resolve())
      })
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
    deleteSnippet: function (guid) {
      this.$Worker.execute({
        action: 'api',
        method: 'get',
        url: 'files/private/delete/' + guid
      })
      .then(() => {
        this.getSnippets()
        this.$notify(
          {
            title: 'File Deleted',
            text: '',
            type: 'fmt_notify'
          })
      })
    },
    queryValid (snippet) {
      let valid = false
      valid = snippet.t.toLowerCase().includes(this.query)
      if (!valid && snippet.ph != null) {
        valid = snippet.ph.toLowerCase().includes(this.query)
      }
      return valid
    }
  }
}
</script>

<style>

.sidebar_button:hover {
  @apply brightest_bg;
}

.file_download {
  @apply hidden;
}

.file_outer:hover .file_download {
  @apply block;
}

</style>
