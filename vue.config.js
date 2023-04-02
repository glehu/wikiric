module.exports = {
  pwa: {
    themeColor: '#18181B',
    manifestOptions: {
      gcm_sender_id: '103953800507',
      start_url: 'https://wikiric.netlify.app/apps/clarifier'
    },
    workboxOptions: {
      exclude: ['_redirects'],
      skipWaiting: true,
      clientsClaim: true
    }
  }
}
