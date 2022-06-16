<template>
  <section id="content"
           style="min-height: 100vh; max-width: 100vw; width: 100%; overflow: hidden"
           :style="{ backgroundImage: 'url('+require('@/assets/'+'account/pexels-marek-piwnicki-10050567.jpg')+')',
                     backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }">
    <div class="header-margin"></div>
    <div style="color: white; width: 100vw; display: flex; padding: 20px 5vw 20px 5vw;
                border-bottom: 4px dotted #192129;">
      <div style="width: 100%">
        <div id="header_title"
             style="border-left: 4px dotted #aeaeb7; padding: 20px; color: #aeaeb7; background-color: rgba(16,16,16,0.5);
                    border-radius: 0 50px 50px 0">
          <h2
            style="font-family: 'Lato', sans-serif; pointer-events: none; font-size: clamp(3rem, 4vw, 5rem); margin: 0"
            class="text-center">
            Build your
          </h2>
          <h1 style="font-family: 'Lato', sans-serif; font-weight: bold; font-style: italic; pointer-events: none; color: #aeaeb7;
                     font-size: clamp(4rem, 8vw, 7rem); margin: 0"
              class="text-center">
            Enterprise Network
          </h1>
          <p class="demotext c_lightgray">
            Bringing ideas and people close.
            <br>Communicate and share files on a platform that grows as you do.
          </p>
        </div>
        <div class="d-flex justify-content-center" style="margin-top: 40px; margin-bottom: 40px">
          <button class="btn btn-lg btn-dark muArrow fw-bold"
                  v-on:click="gotoClarifier()"
                  style="border-radius: 30px 0 30px 0; width: 200px; height: 50px">
            <i class="sb_link_icon bi bi-app-indicator lead"></i>
            Explore
          </button>
        </div>
        <div style="width: 100%" class="wrapper"><!-- Demo Wrapper -->
          <div style="width: 100%; display: flex; justify-content: center">
            <img src='@/assets/clarifier/clarifier_demo.png' alt=""
                 style="width: 100%; border-radius: 10px; background-color: #101010">
          </div>
          <div style="width: 100%; display: flex; align-items: center; justify-content: center">
            <p class="demotext c_lightgray">
              Connect and collaborate in a modern, fast and responsive environment.
              <br>
              <br>
              <i class="bi bi-download lead p-1"></i>
              <span class="lead">
                Available as a Progressive Web App for all devices.
              </span>
            </p>
          </div>
        </div><!-- Demo Wrapper End -->
      </div>
    </div>
  </section>
  <div style="color: white; width: 100vw; display: flex; padding: 20px 5vw 20px 5vw;
              border-bottom: 4px dotted #192129;"
       class="b_darkergray">
    <div class="wrapper"><!-- Demo Wrapper -->
      <div style="width: 100%; display: flex; align-items: center; justify-content: center">
        <p class="demotext c_lightgray">
          Create as many Subchats as you need. For any purpose imaginable.
          <br>With just a few clicks you can easily set up your Group to fit your needs.
          <br>
          <br>
          <i class="bi bi-boxes lead p-1"></i>
          <span class="lead">
            Keeping things organized, efficiently.
          </span>
        </p>
      </div>
      <div style="width: 100%; display: flex; justify-content: center">
        <img src='@/assets/clarifier/clarifier_subchat_demo.png' alt=""
             style="width: 80%; border-radius: 10px; background-color: #101010">
      </div>
    </div><!-- Demo Wrapper End -->
  </div>
  <div style="color: white; width: 100vw; display: flex; padding: 20px 5vw 20px 5vw;
              border-bottom: 4px dotted #192129;"
       class="b_darkergray">
    <div class="wrapper"><!-- Demo Wrapper -->
      <div style="width: 100%; display: flex; justify-content: center">
        <img src='@/assets/clarifier/clarifier_member_demo.png' alt=""
             style="width: 80%; border-radius: 10px; background-color: #101010">
      </div>
      <div style="width: 100%; display: flex; align-items: center; justify-content: center">
        <p class="demotext c_lightgray">
          Manage your Group's members and add role to categorize them!
          <br>Invite new people by clicking on the envelope button
          and sending them the invite link.
          <br>
          <br>
          <i class="bi bi-people lead p-1"></i>
          <span class="lead">
            Gather your friends or (business) partners.
          </span>
        </p>
      </div>
    </div><!-- Demo Wrapper End -->
  </div>
  <div style="color: white; width: 100vw; display: flex; padding: 20px 5vw 20px 5vw;
              border-bottom: 4px dotted #192129;"
       class="b_darkergray">
    <div class="wrapper"><!-- Demo Wrapper -->
      <div style="width: 100%; display: flex; align-items: center; justify-content: center">
        <p class="demotext c_lightgray">
          Don't worry, you can send your memes here, too. We got you covered.
          <br>
          <br>
          <i class="bi bi-file-arrow-up lead p-1"></i>
          <span class="lead">
            Share images and audio files drag'n'drop style.
          </span>
        </p>
      </div>
      <div style="width: 100%; display: flex; justify-content: center">
        <img src='@/assets/clarifier/clarifier_file_demo.png' alt=""
             style="width: 80%; border-radius: 10px; background-color: #101010">
      </div>
    </div><!-- Demo Wrapper End -->
  </div>
  <div style="color: white; width: 100vw; display: flex; padding: 20px 5vw 20px 5vw"
       class="b_darkergray">
    <div class="wrapper"><!-- Demo Wrapper -->
      <div style="width: 100%; display: flex; justify-content: center">
        <img src='@/assets/clarifier/clarifier_gif_demo.png' alt=""
             style="width: 80%; border-radius: 10px; background-color: #101010">
      </div>
      <div style="width: 100%; display: flex; align-items: center; justify-content: center">
        <p class="demotext c_lightgray">
          GIFs. GIFs for everybody.
          <br>
          <br>
          <i class="bi bi-camera-video lead p-1"></i>
          <span class="lead">
            Reaction GIFs and way more, powered by GIPHY.
          </span>
        </p>
      </div>
    </div><!-- Demo Wrapper End -->
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    scrollTo (content) {
      document.getElementById(content).scrollIntoView({ behavior: 'smooth' })
    },
    gotoClarifier () {
      this.$router.push('/apps/clarifier')
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
    }
  },
  computed: {
    isLoggedIn () {
      return this.$store.state.authenticated
    },
    usageTracker () {
      return this.$store.state.usageTracking
    }
  }
}
</script>

<style scoped>

.header-margin {
  min-height: 60px;
}

.b_purple {
  background-color: #68349b;
}

.c_purple {
  color: #68349b;
}

.b_darkblue {
  background-color: #041830;
}

.c_darkblue {
  color: #041830;
}

.b_darkgray {
  background-color: #192129;
}

.c_darkgray {
  color: #192129;
}

.b_darkergray {
  background-color: #101010;
}

.c_darkergray {
  color: #101010;
}

.b_gray {
  background-color: #293139;
}

.c_gray {
  color: #293139;
}

.c_lightgray {
  color: #aeaeb7;
}

.b_orange {
  background-color: #ff5d37;
}

.c_orange {
  color: #ff5d37;
}

.wrapper {
  display: grid;
  gap: 50px;
  grid-auto-rows: minmax(100px, auto);
  grid-template-columns: repeat(1, 1fr);
}

/* Small devices (portrait tablets and large phones, 765px and up) */
@media only screen and (min-width: 992px) {
  .wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}

.shadow-box {
  box-shadow: -10px 10px 20px 15px rgba(0, 0, 0, 0.8);
  border-radius: 1em
}

.darkbutton {
  background-color: #192129;
}

.darkbutton:hover {
  background-color: #303c46;
}

.purplehover {
  color: #68349b;
  text-shadow: 0 0 10px #7b40b4;
}

.darkbutton:hover > .purplehover {
  color: #46b59b;
  text-shadow: 0 0 15px #46b59b;
}

.muArrow, .mdArrow {
  position: relative;
  top: 0;
  transition: top ease 0.5s;
}

.muArrow:hover {
  top: -8px;
}

.mdArrow:hover {
  top: +8px;
}

.demotext {
  font-size: 1rem;
  padding-top: 10px;
  pointer-events: none;
  width: 100%;
  text-align: center
}

</style>
