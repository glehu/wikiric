/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  // Register Firebase Service Worker
  register(`${process.env.BASE_URL}firebase-messaging-sw.js`, {
    ready () {
    },
    registered () {
    },
    cached () {
    },
    updatefound () {
    },
    updated () {
    },
    offline () {
    },
    error (error) {
      console.debug('Error during Service Worker registration:', error)
    }
  })
  // Register Cache Service Worker
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a Service Worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered () {
      console.log('Service worker has been registered.')
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      console.log('New content is downloading.')
    },
    updated (registration) {
      console.log('New content is available; please refresh.')
      document.dispatchEvent(
        new CustomEvent('swUpdated', { detail: registration })
      )
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.debug('Error during Service Worker registration:', error)
    }
  })
}
