<template>
  <div class="container">
    <div style="min-height: 10ch"></div>
    <div class="wrapper">
      <!-- About -->
      <div>
        <img
          src="https://static.wixstatic.com/media/67f686_b76a2f6ff2b2429c912cfca5196566f1~mv2.jpg/v1/crop/x_0,y_206,w_640,h_735/fill/w_478,h_549,al_c,q_80,usm_0.66_1.00_0.01/IMG_7343.webp"
          style="width: 300px; height: 300px" alt="">
      </div>
      <div style="text-align: justify; text-justify: inter-word; width: 300px">
        <p class="h1 font-bold text-white">Graffiti Falls</p>
        <p class="text-white fw-lighter">
          We are a somerset based band, we play many genres of music ranging from mellow acoustic songs to a gritty
          blues style. The band is formed from 4 members, Gus with vocals and guitar, Sam on guitar, Joe on drums and
          Oscar on the bass. We have music out on youtube and SoundCloud the links are under social media, We have
          played at local festivals and have done many gigs around the area. We are very keen to perform live and have
          many plans from upcoming music and music videos.
        </p>
      </div>
      <!-- Music Links -->
      <div>
        <img
          src="https://static.wixstatic.com/media/67f686_d681aa5223dc4ebfadda78ef9c7e5487~mv2.jpg/v1/fill/w_453,h_453,al_c,q_80,usm_0.66_1.00_0.01/eb16ede2-925b-453f-b7b8-eb8c33252a24_JPG.webp"
          style="width: 300px; height: 300px" alt="">
      </div>
      <div>
        <p class="font-bold text-white">You can find us on those platforms:</p>
        <div class="text-white">
          <button title="SoundCloud"
                  class="btn bi-cloud-fill btn-lg muArrow" style="color: white;"
                  v-on:click="redirectSoundcloud"><span class="ms-2 small">SoundCloud</span></button>
          <br>
          <button title="Youtube"
                  class="btn bi-youtube btn-lg muArrow" style="color: white;"
                  v-on:click="redirectYoutube"><span class="ms-2 small">Youtube</span></button>
          <br>
          <button title="Instagram"
                  class="btn bi-instagram btn-lg muArrow" style="color: white;"
                  v-on:click="redirectInstagram"><span class="ms-2 small">Instagram</span></button>
        </div>
      </div>
      <!-- Studio Work -->
      <div>
        <img
          src="https://static.wixstatic.com/media/67f686_cb4bcdf0cd8c4720bb3cde40176924e6~mv2.jpg/v1/fill/w_291,h_386,al_c,q_80,usm_0.66_1.00_0.01/IMG_7433_JPG.webp"
          style="width: 300px; height: 300px" alt="">
      </div>
      <div style="text-align: justify; text-justify: inter-word; width: 300px">
        <p class="h3 font-bold text-white">Studio Work</p>
        <p class="text-white fw-lighter">
          We have been to several studios to record singles and also music videos, thus having many plans for recording
          in the future, most of which will be done in local studios around the area. We are in the early process of
          creating a full album and hope to have it finished before next year. As a whole we are very keen to work with
          other musicians so there are many more collaborations on the way.
        </p>
      </div>
      <!-- Contact -->
      <p style="font-weight: bold; font-size: 300%; color: white">Contact us:</p>
      <div>
        <button title="Email"
                class="btn bi-send btn-lg muArrow" style="color: white;"
                v-on:click="redirectEmail"><span class="ms-2 small">Email us</span></button>
        <button title="Instagram"
                class="btn bi-instagram btn-lg muArrow" style="color: white;"
                v-on:click="redirectInstagram"><span class="ms-2 small">DM us</span></button>
      </div>
      <!-- Tickets -->
      <p style="font-weight: bold; font-size: 300%; color: white">Get those Tickets:</p>
      <iframe src="https://www.eventbrite.com/e/graffiti-falls-live-victoria-club-street-tickets-264498430927"
              width="100%" height="1000px" allowfullscreen="allowfullscreen"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GraffitiFalls',
  methods: {
    redirectSoundcloud () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'graffitifalls',
          action: 'redirectSoundcloud'
        })
      }
      window.open('https://soundcloud.com/graffiti_falls')
    },
    redirectInstagram () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'graffitifalls',
          action: 'redirectInstagram'
        })
      }
      window.open('https://www.instagram.com/graffitifallsband/')
    },
    redirectYoutube () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'graffitifalls',
          action: 'redirectYoutube'
        })
      }
      window.open('https://www.youtube.com/channel/UCf28Jwvrdb6Qeu8t--rBk2Q')
    },
    redirectEmail () {
      if (this.usageTracker) {
        this.sendUsageData({
          source: 'web',
          module: 'graffitifalls',
          action: 'redirectEmail'
        })
      }
      window.open('mailto:graffitifalls6@gmail.com')
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

.wrapper {
  display: grid;
  gap: 1em;
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

</style>
