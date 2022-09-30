module.exports = {
  pwa: {
    themeColor: '#0A0A0A',
    manifestOptions: {
      gcm_sender_id: '103953800507',
      start_url: 'https://wikiric.netlify.app/apps/clarifier'
    },
    workboxOptions: {
      exclude: ['_redirects']
    }
  }
}
