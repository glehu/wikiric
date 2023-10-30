import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'

let i18n

export const SUPPORT_LOCALES = ['en', 'de']

export function setI18nLanguage (locale) {
  loadLocaleMessages(locale)
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale
  } else {
    i18n.global.locale.value = locale
  }
  document.querySelector('html').setAttribute('lang', locale)
  localStorage.setItem('lang', locale)
}

export async function loadLocaleMessages (locale) {
  // load locale messages with dynamic import
  const messages = await import(
    /* webpackChunkName: "locale-[request]" */ `./locales/${locale}.json`)
  console.log(messages)
  // set locale and locale message
  i18n.global.setLocaleMessage(locale, messages.default)
  return nextTick()
}

export default function setupI18n () {
  if (!i18n) {
    let locale =
      navigator.language || localStorage.getItem('lang') || 'en'
    if (locale.length > 2) {
      locale = locale.substring(0, 2)
    }
    i18n = createI18n({
      globalInjection: true,
      legacy: false,
      locale: locale,
      fallbackLocale: 'en'
    })
    setI18nLanguage(locale)
  }
  return i18n
}
