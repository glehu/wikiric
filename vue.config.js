module.exports = {
  pwa: {
    themeColor: '#18181B',
    pluginOptions: {
      i18n: {
        locale: 'en',
        fallbackLocale: 'en',
        localeDir: 'locales',
        enableInSFC: false
      },
      electronBuilder: {
        chainWebpackMainProcess: (config) => {
          config.output.filename('background.js')
        }
      }
    },
    manifestOptions: {
      gcm_sender_id: '103953800507',
      start_url: 'https://wikiric.xyz',
      icons: [
        {
          src: 'img/icons/android-chrome-36x36.png',
          sizes: '36x36',
          type: 'image/png'
        },
        {
          src: 'img/icons/android-chrome-48x48.png',
          sizes: '48x48',
          type: 'image/png'
        },
        {
          src: 'img/icons/android-chrome-72x72.png',
          sizes: '72x72',
          type: 'image/png'
        },
        {
          src: 'img/icons/android-chrome-96x96.png',
          sizes: '96x96',
          type: 'image/png'
        },
        {
          src: 'img/icons/android-chrome-144x144.png',
          sizes: '144x144',
          type: 'image/png'
        },
        {
          src: 'img/icons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'img/icons/android-chrome-256x256.png',
          sizes: '256x256',
          type: 'image/png'
        },
        {
          src: 'img/icons/android-chrome-384x384.png',
          sizes: '384x384',
          type: 'image/png'
        },
        {
          src: 'img/icons/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workboxOptions: {
      exclude: ['_redirects']
    }
  }
}
