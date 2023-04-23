<template>
  <div id="fileExplorer" ref="fileExplorer"
       class="medium_bg w-full h-full relative overflow-hidden rounded-tr-lg">
    <div class="text-neutral-300 w-full min-h-[50px] max-h-[50px] p-2 flex items-center medium_bg
                divide-x-2 divide-neutral-600">
      <div class="sidebar_button bright_bg rounded-md w-fit mr-2">
        <div v-on:click="clickedBack()"
             v-tooltip="{ content: 'Exit' }"
             class="cursor-pointer hover:text-neutral-200 p-2">
          <XMarkIcon class="h-6 w-6"></XMarkIcon>
        </div>
      </div>
      <div class="pl-2">
        <input type="text" name="fileSearch" id="fileSearch" ref="fileSearch"
               v-model="query"
               placeholder="Search..."
               class="bright_bg rounded-md px-2 py-1 h-[40px]">
      </div>
    </div>
    <template v-if="snippets && snippets.length > 0">
      <div class="h-[calc(100%-50px)] w-full flex flex-col relative gap-2
                  overflow-x-hidden overflow-y-auto p-2">
        <template v-for="snippet in snippets" :key="snippet.guid">
          <template v-if="query === '' || snippet.filename.toLowerCase().includes(query)">
            <div class="w-full h-fit relative file_outer pr-2">
              <div class="file_download absolute top-0 right-2 darkest_bg rounded p-2 cursor-pointer"
                   v-tooltip.left="{content: 'Delete File'}"
                   v-on:click="deleteSnippet(snippet.guid)">
                <TrashIcon class="h-6 w-6"></TrashIcon>
              </div>
              <a :href="snippet.url"
                 download>
                <div class="btn_bg_primary cursor-pointer"
                     v-tooltip.top="{content: 'Download File'}">
                  <template v-if="snippet.filetype.includes('image/')">
                    <img :src="snippet.url"
                         alt="&nbsp;"
                         class="max-w-[128px] max-h-[128px] mb-1">
                  </template>
                  <template v-else-if="snippet.filetype.includes('audio/')">
                    <audio controls preload="auto"
                           class="mb-1">
                      <source :src="snippet.url">
                      Your browser does not support playing audio.
                    </audio>
                  </template>
                  <p class="font-bold text-sm mb-1">{{ snippet.filename }}</p>
                  <div class="flex gap-x-2 items-center">
                    <FolderArrowDownIcon class="h-6 w-6"></FolderArrowDownIcon>
                    <p class="text-sm">{{ snippet.filesizeMB }} MB</p>
                  </div>
                  <p class="font-bold text-xs text-end">
                    {{ getHumanReadableDateText(snippet.filedate) }}
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
        <p class="p-2 text-sm text-neutral-300 dark_bg rounded-md">No files found!</p>
      </div>
    </template>
  </div>
</template>

<script>
import { FolderArrowDownIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline'
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
    TrashIcon
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
          mainDiv.classList.add('pt-[55px]')
        } else {
          mainDiv.classList.remove('pt-[55px]')
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
          url: 'm6/clarifier/' + this.chatguid
        }).then((data) => {
          this.snippets = data.result.snippets
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
        url: 'm6/del/' + guid
      })
        .then(() => {
          this.getSnippets()
          this.$notify(
            {
              title: 'File Deleted',
              text: '',
              type: 'info'
            })
        })
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
