import { openDB } from 'idb'
import { toRaw } from 'vue'

const dbPromise = openDB('wikiric-database', 1, {
  upgrade (db) {
    db.createObjectStore('sessions')
    db.createObjectStore('timestamps')
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
