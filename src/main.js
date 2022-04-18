import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import chunk from 'chunk'
import Notifications from '@kyvg/vue3-notification'

createApp(App)
  .use(store)
  .use(router)
  .use(chunk)
  .use(Notifications)
  .mount('#app')
