<template>
  <div class="pb-2">
    <template v-if="showingTask">
      <div class="w-full sm:w-[412px] bg-slate-700 p-2 rounded">
        <div class="w-full bg-neutral-900 p-2 rounded">
          <template v-if="showingTask.categories">
            <div class="flex mb-2 items-center">
              <template v-for="cat in showingTask.categories" :key="cat">
                <div v-if="JSON.parse(cat).category != null"
                     class="text-white bg-orange-900 flex items-center px-0.5 px-1 rounded mr-1 pointer-events-none text-xs">
                  {{ JSON.parse(cat).category }}
                </div>
              </template>
            </div>
          </template>
          <Markdown class="p_markdown font-bold text-neutral-300 w-full"
                    :source="showingTask.t"
                    :plugins="plugins"></Markdown>
          <Markdown class="p_markdown text-neutral-400 w-full"
                    :source="showingTask.desc"
                    :plugins="plugins"></Markdown>
          <div class="flex mt-2">
            <div class="ml-auto flex items-center">
              <div>
                <template v-if="showingTask.dueDate && showingTask.dueDate !== ''">
                  <div class="ml-auto flex items-center text-neutral-500 py-0.5">
                    <div class="m-0 text-xs font-bold">
                      {{ getTaskDueDate(showingTask).replace(' ', '&nbsp;') }}
                    </div>
                    <CalendarIcon class="w-4 h-4 ml-1"></CalendarIcon>
                  </div>
                </template>
                <div class="ml-auto flex items-center text-neutral-500 py-0.5 justify-end">
                  <div class="text-xs ml-1">
                    {{ showingTask.author }}
                  </div>
                  <UserIcon class="w-4 h-4 ml-1"></UserIcon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-2 text-neutral-300">
        <button v-on:click="this.$router.push('/apps/knowledge/' + showingTask.gUID)"
                class="py-2 px-3 rounded bg-slate-700 hover:bg-slate-800">
          <span class="font-bold text-sm mr-1">Open</span>
          <i class="bi bi-arrow-up-right text-sm"></i>
        </button>
      </div>
    </template>
    <template v-else>
      <div class="pointer-events-none my-2">
        <div class="ml-3 text-neutral-500 animate-bounce">Loading Task...</div>
      </div>
    </template>
    <template v-if="parsedMessage && parsedMessage.message !== ''">
      <div class="text-neutral-300 mt-2">
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
          url: 'm7/learn/' + this.parsedMessage.guid
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
            console.error(err.message)
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

</style>
