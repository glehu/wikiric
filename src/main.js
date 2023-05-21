import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import chunk from 'chunk'
import Notifications from '@kyvg/vue3-notification'
import Markdown from 'vue3-markdown-it'
import './index.css'
import WorkerRic from '@/libs/workeric'
import {
  // Directive
  VTooltip,
  VClosePopper,
  // Components
  Dropdown,
  Tooltip,
  Menu
} from 'floating-vue'
import 'floating-vue/dist/style.css'

const app = createApp(App)

app.config.globalProperties.$Worker = WorkerRic
app.config.globalProperties.$Worker.worker = new Worker('/dworker.js')

app.directive('tooltip', VTooltip)
app.directive('close-popper', VClosePopper)

app.component('VDropdown', Dropdown)
app.component('VTooltip', Tooltip)
app.component('VMenu', Menu)

app.use(store)
  .use(router)
  .use(chunk)
  .use(Notifications)
  .use(Markdown)
  .mount('#app')
