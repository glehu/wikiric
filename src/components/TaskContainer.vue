<template>
  <div class="pb-2">
    <template v-if="showingTask">
      <div class="w-full p-1 rounded">
        <div class="w-full background p-2 rounded">
          <template v-if="showingTask.cats">
            <div class="flex mb-2 items-center">
              <template v-for="cat in showingTask.cats" :key="cat">
                <div v-if="cat != null"
                     class="wisdomCat"
                     :style="{borderColor: cat.hex}">
                  {{ cat.t }}
                </div>
              </template>
            </div>
          </template>
          <Markdown class="markedView font-bold w-full"
                    :source="showingTask.t"
                    :plugins="plugins"></Markdown>
          <Markdown class="markedView w-full"
                    :source="showingTask.desc"
                    :plugins="plugins"></Markdown>
          <div class="flex mt-2">
            <div class="ml-auto flex items-center">
              <div>
                <template v-if="showingTask.dueDate && showingTask.dueDate !== ''">
                  <div class="ml-auto flex items-center py-0.5">
                    <div class="m-0 text-xs font-bold">
                      {{ getTaskDueDate(showingTask).replace(' ', '&nbsp;') }}
                    </div>
                    <CalendarIcon class="w-4 h-4 ml-1"></CalendarIcon>
                  </div>
                </template>
                <div class="ml-auto flex items-center py-0.5 justify-end">
                  <div class="text-xs ml-1">
                    {{ showingTask.usr }}
                  </div>
                  <UserIcon class="w-4 h-4 ml-1"></UserIcon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="my-2 mx-1">
        <button v-on:click="this.$router.push('/apps/knowledge/' + showingTask.uid)"
                class="py-2 px-3 fmt_button">
          <span class="font-bold text-sm mr-1">Open</span>
          <i class="bi bi-arrow-up-right text-sm"></i>
        </button>
      </div>
    </template>
    <template v-else>
      <div class="pointer-events-none my-2">
        <div class="ml-3 animate-bounce">Loading Task...</div>
      </div>
    </template>
    <template v-if="parsedMessage && parsedMessage.message !== ''">
      <div class="mt-3">
        {{ parsedMessage.message }}
      </div>
    </template>
  </div>
</template>

<script>
import mermaid from 'mermaid'
import Markdown from 'vue3-markdown-it'
import markdownItMermaid from 'markdown-it-mermaid'
import 'highlight.js/styles/hybrid.css'
import { CalendarIcon, UserIcon } from '@heroicons/vue/24/solid'

export default {
  name: 'TaskContainer',
  props: {
    message: String
  },
  components: {
    Markdown,
    CalendarIcon,
    UserIcon
  },
  mounted () {
    if (!this.message || this.message === '') return
    this.parsedMessage = JSON.parse(this.message)
    this.getWisdom()
  },
  data () {
    return {
      parsedMessage: null,
      showingTask: null,
      plugins: [
        {
          plugin: markdownItMermaid
        }
      ]
    }
  },
  methods: {
    getWisdom: async function () {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'wisdom/private/get/' + this.parsedMessage.guid
        })
        .then((data) => {
          this.showingTask = data.result
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
        .then(() => {
          resolve()
        })
        .catch((err) => {
          console.debug(err.message)
        })
      })
    },
    getTaskDueDate: function (task) {
      if (task.dueDate && task.dueDate !== '') {
        let dateString = new Date(task.dueDate).toLocaleString('de-DE')
        dateString = dateString.substring(0, dateString.length - 3)
        return dateString
      } else {
        return ''
      }
    }
  }
}
</script>

<style>

</style>
