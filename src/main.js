import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import chunk from 'chunk'
import Notifications from '@kyvg/vue3-notification'
import Markdown from 'vue3-markdown-it'
import './index.css'

createApp(App)
  .use(store)
  .use(router)
  .use(chunk)
  .use(Notifications)
  .use(Markdown)
  .mount('#app')
