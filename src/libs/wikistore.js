import { openDB } from 'idb'
import { toRaw } from 'vue'

const dbPromise = openDB('wikiric-database', 1, {
  upgrade (db) {
    db.createObjectStore('sessions')
    db.createObjectStore('timestamps')
    db.createObjectStore('users')
  }
})

export async function dbGetSession (key) {
  return (await dbPromise).get('sessions', key)
}

export async function dbSetSession (key, val) {
  return (await dbPromise).put('sessions', toRaw(val), key)
}

export async function dbGetTimestamp (key) {
  return (await dbPromise).get('timestamps', key)
}

export async function dbSetTimestamp (key, val) {
  return (await dbPromise).put('timestamps', toRaw(val), key)
}

export async function del (key) {
  return (await dbPromise).delete('sessions', key)
}

export async function clear () {
  return (await dbPromise).clear('sessions')
}

export async function keys () {
  return (await dbPromise).getAllKeys('sessions')
}

export async function dbGetDisplayName (key) {
  return (await dbPromise).get('users', key)
}

export async function dbSetDisplayName (key, val) {
  return (await dbPromise).put('users', toRaw(val), key)
}

const dbPromiseWebhooks = openDB('wikiric-webhooks', 1, {
  upgrade (db) {
    db.createObjectStore('integrations')
    db.createObjectStore('auth')
    db.createObjectStore('templates')
  }
})

export async function dbGetAllWebhookIntegrations () {
  return (await dbPromiseWebhooks).getAll('integrations')
}

export async function dbGetWebhookIntegration (key) {
  return (await dbPromiseWebhooks).get('integrations', key)
}

export async function dbSetWebhookIntegration (key, val) {
  return (await dbPromiseWebhooks).put('integrations', toRaw(val), key)
}

export async function dbGetWebhookAuth (key) {
  return (await dbPromiseWebhooks).get('auth', key)
}

export async function dbSetWebhookAuth (key, val) {
  return (await dbPromiseWebhooks).put('auth', toRaw(val), key)
}

export async function dbGetWebhookTemplate (key) {
  return (await dbPromiseWebhooks).get('templates', key)
}

export async function dbSetWebhookTemplate (key, val) {
  return (await dbPromiseWebhooks).put('templates', toRaw(val), key)
}
