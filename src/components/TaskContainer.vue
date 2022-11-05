<template>
  <div>
    <template v-if="showingTask">
      <div class="w-full sm:w-[412px] bg-slate-700 p-2 rounded">
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

export default {
  name: 'TaskContainer',
  props: {
    message: String
  },
  components: {
    Markdown
  },
  mounted () {
    if (!this.message || this.message === '') return
    this.parsedMessage = JSON.parse(this.message)
    console.log(this.parsedMessage)
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
        const headers = new Headers()
        headers.set('Authorization', 'Bearer ' + this.$store.state.token)
        fetch(
          this.$store.state.serverIP + '/api/m7/learn/' + this.parsedMessage.guid,
          {
            method: 'get',
            headers: headers
          }
        )
          .then((res) => res.json())
          .then((data) => {
            this.showingTask = data
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
