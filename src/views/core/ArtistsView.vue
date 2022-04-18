<template>
  <div class="container">
    <div style="min-height: 10ch"></div>
    <div class="wrapper">
      <!-- Artist Hub Welcome Message -->
      <div class="text-center">
        <div class="mb-4" style="display: flex; justify-content: space-evenly">
          <div class="doHover">
            <i class="bi bi-search text-white h1 mx-2"/>
          </div>
          <div class="doHover2">
            <i class="bi bi-book text-white h1 mx-2"/>
          </div>
          <div class="doHover3">
            <i class="bi bi-lightning text-white h1 mx-2"/>
          </div>
        </div>
        <h1 class="text-white mb-4 fw-bold">Discover. Learn. Improve.</h1>
        <h3 class="text-white mb-3">Welcome to the Artist Hub</h3>
        <hr style="color: white">
        <p class="text-white mb-4" style="text-align: justify; text-justify: inter-word; width: 100%">
          Fresh, organic picks out of the garden, whose sole purpose is to please your sonic portals to the world.
          Creative juices sizzling out of excitement, unable to contain themselves any longer, just for you.
        </p>
        <p class="text-white text-end mt-5 fw-light" style="font-style: italic">
          <i class="bi bi-quote"></i> Let's celebrate this moment, where hearts touch and souls connect. -&nbsp;sincerely,&nbsp;wiki.
        </p>
        <hr style="color: white">
        <p class="text-white text-start">
          For when your life feels like a movie:
        </p>
        <button title="Become one of us"
                class="btn bi-file-earmark-text btn-lg muArrow" style="color: white;"
                v-on:click="gotoArtistSubmission">
          <span class="ms-2 small">Episode 1: Becoming one of us <span class="fw-light small ms-1">(Click Me!)</span></span>
        </button>
      </div>
      <!-- Artists -->
      <div>
        <div id="indie" class="mt-3">
          <p class="h3 fw-bold text-white text-center">Indie / Rock</p>
          <hr style="color: white">
          <div>
            <!-- Graffiti Falls -->
            <div class="card-subtitle text-white">
              <div class="card-body">
                <h3 class="card-title fw-bold text-light">
                  Graffiti Falls
                </h3>
                <p class="card-text cardtext">
                  Band
                </p>
                <div class="card-footer">
                  <button title="Artist Page"
                          class="btn bi-person btn-lg muArrow" style="color: white;"
                          v-on:click="gotoArtist('graffitifalls')"><span class="ms-2 small">Artist Page</span></button>
                  <br>
                  <button title="SoundCloud"
                          class="btn bi-cloud-fill btn-lg muArrow" style="color: white;"
                          v-on:click="redirectSoundcloudGraffitiFalls"><span class="ms-2 small">SoundCloud</span>
                  </button>
                  <button title="Youtube"
                          class="btn bi-youtube btn-lg muArrow" style="color: white;"
                          v-on:click="redirectYoutubeGraffitiFalls"><span class="ms-2 small">Youtube</span></button>
                  <button title="Instagram"
                          class="btn bi-instagram btn-lg muArrow" style="color: white;"
                          v-on:click="redirectInstagramGraffitiFalls"><span class="ms-2 small">Instagram</span>
                  </button>
                </div>
              </div>
            </div>
            <!-- CLOUDDAY -->
            <div class="card-subtitle text-white mt-2">
              <div class="card-body">
                <h3 class="card-title fw-bold text-light">
                  CLOUDDAY
                </h3>
                <p class="card-text cardtext">
                  Singer-Songwriter, Producer
                </p>
                <p class="card-footer">
                  <button title="SoundCloud"
                          class="btn bi-cloud-fill btn-lg muArrow" style="color: white;"
                          v-on:click="redirectSoundcloudCloudday"><span class="ms-2 small">SoundCloud</span></button>
                  <button title="Spotify"
                          class="btn btn-lg muArrow" style="color: white;"
                          v-on:click="redirectSpotifyCloudday">
                    <img src="../../assets/spotify/Spotify_Icon_RGB_White.png" alt="Spotify"
                         style="width: 20px; height: 20px" class="mb-1"/> Spotify
                  </button>
                  <button title="Instagram"
                          class="btn bi-instagram btn-lg muArrow" style="color: white;"
                          v-on:click="redirectInstagramCloudday"><span class="ms-2 small">Instagram</span></button>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div id="hiphop" class="mt-3">
          <p class="h3 fw-bold text-white text-center">Hip-Hop / Rap</p>
          <hr style="color: white">
          <!-- Casper: TFD -->
          <div class="card-subtitle text-white mt-2">
            <div class="card-body">
              <h3 class="card-title fw-bold text-light">
                Casper: TFD
              </h3>
              <p class="card-text cardtext">
                Singer-Songwriter, Producer
              </p>
              <p class="card-footer">
                <button title="SoundCloud"
                        class="btn bi-cloud-fill btn-lg muArrow" style="color: white;"
                        v-on:click="redirectSoundcloudCasper"><span class="ms-2 small">SoundCloud</span></button>
                <button title="Spotify"
                        class="btn btn-lg muArrow" style="color: white;"
                        v-on:click="redirectSpotifyCasper">
                  <img src="../../assets/spotify/Spotify_Icon_RGB_White.png" alt="Spotify"
                       style="width: 20px; height: 20px" class="mb-1"/> Spotify
                </button>
                <button title="Youtube"
                        class="btn bi-youtube btn-lg muArrow" style="color: white;"
                        v-on:click="redirectYoutubeCasper"><span class="ms-2 small">Youtube</span></button>
                <button title="Instagram"
                        class="btn bi-instagram btn-lg muArrow" style="color: white;"
                        v-on:click="redirectInstagramCasper"><span class="ms-2 small">Instagram</span></button>
              </p>
            </div>
          </div>
          <!-- Krag / Kräuteraggro / Blütenaggressivität -->
          <div class="card-subtitle text-white mt-2">
            <div class="card-body">
              <h3 class="card-title fw-bold text-light">
                Krag / Kräuteraggro / Blütenaggressivität
              </h3>
              <p class="card-text cardtext">
                Singer-Songwriter, Producer
              </p>
              <p class="card-footer">
                <button title="SoundCloud"
                        class="btn bi-cloud-fill btn-lg muArrow" style="color: white;"
                        v-on:click="redirectSoundcloudKrag">
                  <span class="ms-2 small">SoundCloud (Krag)</span>
                </button>
                <button title="SoundCloud"
                        class="btn bi-cloud-fill btn-lg muArrow" style="color: white;"
                        v-on:click="redirectSoundcloudBluetenaggressivitaet">
                  <span class="ms-2 small">SoundCloud (Blütenaggressivität)</span>
                </button>
                <button title="Youtube"
                        class="btn bi-youtube btn-lg muArrow" style="color: white;"
                        v-on:click="redirectYoutubeKrag"><span class="ms-2 small">Youtube</span></button>
                <button title="Instagram"
                        class="btn bi-instagram btn-lg muArrow" style="color: white;"
                        v-on:click="redirectInstagramKrag"><span class="ms-2 small">Instagram</span></button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArtistOverview',
  methods: {
    gotoArtist (artist) {
      this.$router.push('/artists/' + artist)
    },
    async sendUsageData (usageObj) {
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      headers.set(
        'Content-Type', 'application/json'
      )
      fetch(
        this.$store.state.serverIP + '/api/utr',
        {
          method: 'post',
          headers: headers,
          body: JSON.stringify(usageObj)
        }
      ).then(r => console.log(r))
    },
    redirectSoundcloudGraffitiFalls () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'artists',
          action: 'redirectSoundcloudGraffitiFalls'
        })
      }
      window.open('https://soundcloud.com/graffiti_falls')
    },
    redirectInstagramGraffitiFalls () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'artists',
          action: 'redirectInstagramGraffitiFalls'
        })
      }
      window.open('https://www.instagram.com/graffitifallsband/')
    },
    redirectYoutubeGraffitiFalls () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'artists',
          action: 'redirectYoutubeGraffitiFalls'
        })
      }
      window.open('https://www.youtube.com/channel/UCf28Jwvrdb6Qeu8t--rBk2Q')
    },
    redirectInstagramCloudday () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'artists',
          action: 'redirectInstagramCloudday'
        })
      }
      window.open('https://www.instagram.com/cloudday/')
    },
    redirectSoundcloudCloudday () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'artists',
          action: 'redirectSoundcloudCloudday'
        })
      }
      window.open('https://soundcloud.com/cloudvx')
    },
    redirectSpotifyCloudday () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'artists',
          action: 'redirectSpotifyCloudday'
        })
      }
      window.open('https://open.spotify.com/artist/56NVjfoRlGzoUWiZxrqj0P?si=YXgxJhWCS8WYMFsSyBTCtw')
    },
    redirectInstagramCasper () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'artists',
          action: 'redirectInstagramCasper'
        })
      }
      window.open('https://www.instagram.com/caspertfd_/')
    },
    redirectSoundcloudCasper () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'artists',
          action: 'redirectSoundcloudCasper'
        })
      }
      window.open('https://soundcloud.com/casperthefriendlydemon')
    },
    redirectSpotifyCasper () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'artists',
          action: 'redirectSpotifyCasper'
        })
      }
      window.open('https://open.spotify.com/artist/56Zt5OmCumfVBvxf2JAqEU')
    },
    redirectYoutubeCasper () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'artists',
          action: 'redirectYoutubeCasper'
        })
      }
      window.open('https://www.youtube.com/c/CablizzCTFD')
    },
    redirectSoundcloudKrag () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'artists',
          action: 'redirectSoundCloudKrag'
        })
      }
      window.open('https://soundcloud.com/kraaag')
    },
    redirectSoundcloudBluetenaggressivitaet () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'artists',
          action: 'redirectSoundCloudBluetenaggressivitaet'
        })
      }
      window.open('https://soundcloud.com/bluetenaggressivitaet')
    },
    redirectInstagramKrag () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'artists',
          action: 'redirectInstagramKrag'
        })
      }
      window.open('https://www.instagram.com/wannabepunkjesus/')
    },
    redirectYoutubeKrag () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'artists',
          action: 'redirectYoutubeKrag'
        })
      }
      window.open('https://www.youtube.com/channel/UCiWJT6QbpVr51V2lCa7xZ5w')
    },
    gotoArtistSubmission () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'artists',
          action: 'gotoArtistSubmission'
        })
      }
      this.$router.push('/submissions/artist')
    }
  },
  computed: {
    usageTracker () {
      return this.$store.state.usageTracking
    }
  }
}
</script>

<style scoped>

.muArrow {
  position: relative;
  top: 0;
  transition: top ease 0.5s;
}

.muArrow:hover {
  top: -8px;
}

.doHover {
  animation: hover 4s ease-in-out infinite;
}

@keyframes hover {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(20%);
  }
  100% {
    transform: translateY(0);
  }
}

.doHover2 {
  animation: hover2 5s ease-in-out infinite;
}

@keyframes hover2 {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(30%);
  }
  100% {
    transform: translateY(0);
  }
}

.doHover3 {
  animation: hover3 6s ease-in-out infinite;
}

@keyframes hover3 {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(40%);
  }
  100% {
    transform: translateY(0);
  }
}

.wrapper {
  display: grid;
  gap: 4em;
  grid-auto-rows: minmax(100px, auto);
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 300px) {
  .wrapper {
    grid-template-columns: repeat(1, 1fr);
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}

.cardtext {
  font-weight: lighter;
  font-style: italic;
}

</style>
