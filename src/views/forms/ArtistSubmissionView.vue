<template>
  <div style="min-height: 10ch"></div>
  <div class="container">
    <div class="wrapper">
      <div>
        <p class="text-white" style="text-align: justify; text-justify: inter-word; width: 100%">
          This form is more than just a form, it's a script waiting to be finished by you, character by character being
          typed ( <i class="bi bi-keyboard"/> ) into those fields. You're writing your own story, after all.
        </p>
        <p class="text-white text-center  md:hidden">
          [ For the best experience, use a large screen by using a desktop PC for example. ]
        </p>
        <form
          id="artistform"
          name="form_artistsubmission"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          class="form-control-plaintext text-white"
          enctype="application/x-www-form-urlencoded"
          @submit.prevent="handleSubmit">
          <input type="hidden" name="form-name" value="form_artistsubmission"/>
          <p>
            <label for="artist_name" class="font-bold h2">Name:</label><br>
            <input id="artist_name" v-model="formData.name_value" type="text" name="name_value" style="width: 100%"
                   class="font-bold form-control" required/>
          </p>
          <div class="wrapper">
            <p>
              <label for="artist_type" class="font-bold h2">Type:</label><br>
              <select id="artist_type" name="type_value" v-model="formData.type_value" class="font-bold form-control"
                      style="width: 100%" required>
                <option>Band</option>
                <option>Singer-Songwriter</option>
                <option>Producer</option>
                <option>Singer-Songwriter, Producer</option>
                <option>Visual Artist</option>
                <option>Sound Engineer</option>
                <option>Singer</option>
                <option>Songwriter</option>
                <option>Other</option>
              </select>
            </p>
            <div v-if="typeFilled">
              <div v-if="formData.type_value !== 'Visual Artist'">
                <p>
                  <label for="artist_style" class="font-bold h2">Typically:</label><br>
                  <select id="artist_style" name="style_value" v-model="formData.style_value"
                          class="font-bold form-control"
                          style="width: 100%">
                    <option>Blues</option>
                    <option>Dubstep</option>
                    <option>Glitchhop</option>
                    <option>Gothic Rock</option>
                    <option>Hip-Hop</option>
                    <option>Hyperpop</option>
                    <option>Indie Alternative</option>
                    <option>Indie Rock</option>
                    <option>Indie</option>
                    <option>Industrial</option>
                    <option>Psytrance</option>
                    <option>Punk Rock</option>
                    <option>Punk</option>
                    <option>RnB</option>
                    <option>Rock</option>
                    <option>Techno</option>
                    <option>Trance</option>
                    <option>Trap</option>
                  </select>
                </p>
              </div>
              <div v-if="formData.type_value === 'Visual Artist'">
                <p>
                  <label for="artist_style_visual" class="font-bold h2">Typically:</label><br>
                  <select id="artist_style_visual" name="style_visual_value" v-model="formData.style_visual_value"
                          class="font-bold form-control"
                          style="width: 100%">
                    <option>Paintings</option>
                    <option>Digital Art</option>
                    <option>Videos</option>
                    <option>Post-Editing</option>
                  </select>
                </p>
              </div>
            </div>
          </div>
          <p>
            <label for="artist_lore" class="font-bold h2">Your Lore:</label><br>
            <textarea id="artist_lore" name="lore_value" v-model="formData.lore_value" style="width: 100%; height: 15ch"
                      class="font-bold form-control"></textarea>
          </p>
          <p>
            <label for="artist_soundcloud" class="font-bold h2">SoundCloud:</label><br>
            <input id="artist_soundcloud" v-model="formData.soundcloud_value" type="text" name="soundcloud_value"
                   style="width: 100%"
                   class="font-bold form-control"/>
          </p>
          <p>
            <label for="artist_spotify" class="font-bold h2">Spotify:</label><br>
            <input id="artist_spotify" v-model="formData.spotify_value" type="text" name="spotify_value"
                   style="width: 100%"
                   class="font-bold form-control"/>
          </p>
          <p>
            <label for="artist_youtube" class="font-bold h2">Youtube:</label><br>
            <input id="artist_youtube" v-model="formData.youtube_value" type="text" name="youtube_value"
                   style="width: 100%"
                   class="font-bold form-control"/>
          </p>
          <p>
            <label for="artist_instagram" class="font-bold h2">Instagram:</label><br>
            <input id="artist_instagram" v-model="formData.instagram_value" type="text" name="instagram_value"
                   style="width: 100%"
                   class="font-bold form-control"/>
          </p>
          <p>
            <label for="artist_email" class="font-bold h2">Email:</label><br>
            <input id="artist_email" v-model="formData.email_value" type="email" name="email_value"
                   style="width: 100%"
                   class="font-bold form-control"/>
          </p>
          <!-- FORM END -->
          <p class="text-white text-end">
            By submitting this form, you agree to the storage of any provided data.
          </p>
          <p class="text-end">
            <button class="btn btn-outline-success btn-lg" type="submit">Submit</button>
          </p>
        </form>
      </div>
      <div>
        <p class="h3 text-white font-bold"><i class="bi bi-file-earmark-text"></i> Episode 1: Becoming one of us</p>
        <hr style="color:white">
        <p class="text-white text-center" style="font-style: italic">
          You're a representative for yourself, your band, your collective or organisation.
          <br> After entering Wiki's digital office, he asks you to introduce yourself.
          <br><br> Every protagonist (or antagonist, if you want) needs an introduction.
          <br> It's your time to shine.
        </p>
        <hr style="color:white">
        <div id="story">
          <p id="story_artist_name" class="text-white">
            This is {{ getArtistName() }}
          </p>
          <div v-if="nameFilled || nameSkipped">
            <p class="text-white text-end px-4 py-2 wiki_message">
              Welcome! I hope you're fine. Grab yourself some water, if you like.
              <br>You've come to the right person. But for me to be able to help you out, I need some more info...
            </p>
            <p id="story_artist_type" class="text-white">
              Of course! Well, I'm {{ getArtistType() }} {{ getArtistTypeDescription() }}
            </p>
          </div>
          <div v-if="typeFilled">
            <p class="text-white text-end px-4 py-2 wiki_message">
              That sounds great. Exactly what we needed! Even though I hate labeling things, would you be able to
              tell me what you're generally working on? This makes it easier for others to find you! You can decide not
              to answer this question, though, and continue with the next questions.
            </p>
            <p id="story_artist_style" class="text-white">
              Understandable! I would say you could generally put my work in the following category:
              {{ getArtistStyle() }}
            </p>
          </div>
          <div v-if="styleFilled || styleSkipped">
            <p class="text-white text-end px-4 py-2 wiki_message">
              Excellent. I'm glad you took your time to teach me about your work. You may now tell the world what you
              are about and what your goals and ambitions are! You may also provide me with some links to your social
              media while you're at it.
              <br>Thank you!
            </p>
          </div>
          <p id="story_artist_lore" class="text-white">{{ getArtistLore() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArtistSubmission',
  data () {
    return {
      formData: {
        name_value: '',
        type_value: '',
        style_value: '',
        style_visual_value: '',
        lore_value: '',
        soundcloud_value: '',
        spotify_value: '',
        youtube_value: '',
        instagram_value: '',
        email_value: ''
      }
    }
  },
  methods: {
    scrollTo (content) {
      document.getElementById(content).scrollIntoView({ behavior: 'smooth' })
    },
    createFormDataObj (data) {
      const formData = new FormData()
      for (const key of Object.keys(data)) {
        formData.append(key, data[key])
      }
      return formData
    },
    handleSubmit () {
      const data = {
        'form-name': 'form_artistsubmission',
        ...this.formData
      }
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(this.createFormDataObj(data)).toString()
      })
        .then(() => this.$router.push('/artists'))
        .catch(error => alert(error))
    },
    getArtistName () {
      let string = '...'
      if (this.formData.name_value !== '') {
        string = this.formData.name_value + '. Glad you asked.'
      } else {
        if (this.formData.nameSkipped) {
          string = '... well that\'s not important now, is it? I\'ll get back to this later.'
        }
      }
      return string
    },
    getArtistType () {
      let string = '...'
      if (this.formData.type_value !== '') {
        if (this.formData.type_value === 'Other') {
          string = '... actually, I don\'t really know what I am just yet. I bet you can assist me on this journey, though.'
        } else {
          if (this.formData.type_value === 'Band') {
            string = 'representing a ' + this.formData.type_value + '.'
          } else {
            string = 'a ' + this.formData.type_value + '.'
          }
        }
      } else {
        if (this.nameSkipped || this.typeSkipped) {
          string = '... everything. My power cannot be described by something as simple as words.'
        }
      }
      return string
    },
    getArtistTypeDescription () {
      let string = ''
      if (this.formData.type_value !== '') {
        switch (this.formData.type_value) {
          case 'Band':
            string = 'We\'re the biggest and greatest! I mean that is our goal at least. Team spirit!'
            break
          case 'Singer-Songwriter':
            string = 'Anything singing is my part, okay? Lyrics? Done. Vocals? Being recorded.'
            break
          case 'Producer':
            string = 'Imagine knobs and buttons. A whole army of them. That is my family. Feel the beat!'
            break
          case 'Singer-Songwriter, Producer':
            string = 'Damn, I really do it all, don\'t I? From idea to instrumental to song! Unlimited power!'
            break
          case 'Visual Artist':
            string = 'I\'ll make your eyes go teary by bringing imagination to life! Aesthetics!'
            break
          case 'Sound Engineer':
            string = 'Sound waves are like real waves, except you can\'t surf on them. At least it hurt when I tried.'
            break
          case 'Singer':
            string = 'If you need vocal chords made out of gold, I\'m what you were looking for.'
            break
          case 'Songwriter':
            string = 'Lyrics are my world. Writing them is like writing a story, waiting to be discovered.'
            break
        }
      }
      return string
    },
    getArtistStyle () {
      let string = '...'
      if (this.formData.type_value !== 'Visual Artist') {
        if (this.formData.style_value !== '') {
          string = this.formData.style_value + '.'
        } else {
          if (this.styleSkipped) {
            string = '... nope, I really can\'t categorize it. I guess they will find out themselves!'
          }
        }
      } else {
        if (this.formData.style_visual_value !== '') {
          string = this.formData.style_visual_value + '.'
        } else {
          if (this.styleSkipped) {
            string = '... nope, I really can\'t categorize it. I guess they will find out themselves!'
          }
        }
      }
      return string
    },
    getArtistLore () {
      let string = ''
      if (this.formData.lore_value !== '') {
        string = this.formData.lore_value
      }
      return string
    }
  },
  computed: {
    nameSkipped () {
      let skipped = false
      if (this.formData.name_value === '') {
        if (this.formData.type_value !== '') skipped = true
        if (this.formData.lore_value !== '') skipped = true
      }
      return skipped
    },
    typeSkipped () {
      let skipped = false
      if (this.formData.type_value === '') {
        if (this.formData.lore_value !== '') skipped = true
      }
      return skipped
    },
    styleSkipped () {
      let skipped = false
      if (this.formData.type_value !== 'Visual Artist') {
        if (this.formData.style_value === '') {
          if (this.formData.lore_value !== '') skipped = true
        }
      } else {
        if (this.formData.style_visual_value === '') {
          if (this.formData.lore_value !== '') skipped = true
        }
      }
      return skipped
    },
    nameFilled () {
      return (this.formData.name_value !== '')
    },
    typeFilled () {
      return (this.formData.type_value !== '')
    },
    styleFilled () {
      return (this.formData.style_value !== '' || this.formData.style_visual_value !== '')
    }
  }
}
</script>

<style scoped>

.wrapper {
  display: grid;
  gap: 4em;
  grid-auto-rows: minmax(100px, auto);
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
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

.wiki_message {
  background-color: #1a1a1a;
  border-radius: 2em;
  font-style: italic
}

</style>
