<template style="max-width: 100vw; width: 100vw; overflow: hidden">
  <div class="flex w-full h-screen items-center justify-center"
       :style="{ backgroundImage: 'url('+require('@/assets/'+'account/pexels-marek-piwnicki-10050567.jpg')+')',
                 backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }">
    <div class="text-gray-200 w-full h-full flex backdrop-brightness-75 mt-[60px] py-8 overflow-x-hidden">
      <div class="w-full h-full relative p-8">
        <div class="w-full"><!-- Demo Wrapper -->
          <div class="w-full h-full items-center justify-center flex">
            <div style="pointer-events: inherit"
                 class="rounded-2xl w-full h-full">
              <p
                class="text-white font-bold pb-2 mb-2 text-4xl md:text-7xl w-fit pointer-events-none border-b-[4px] border-dotted border-b-fuchsia-500">
                Web3 Collaboration
              </p>
              <p class="text-neutral-300 mb-12 text-lg w-full pointer-events-none">
                A secure and responsive environment for communities,
                projects and ideas.
                <br>Bridging the gap between Web2 and Web3.
              </p>
              <div hidden class="lead demotext text-neutral-400 mb-4">
                <i class="bi bi-download lead p-1"></i>
                Install me on any device.
              </div>
            </div>
          </div>
        </div><!-- Demo Wrapper End -->
        <div class="relative">
          <div class="flex w-full">
            <div class="relative grid grid-cols-2 gap-4 items-center justify-center">
              <button
                class="muArrow fw-bold rounded-full text-xl md:text-3xl text-neutral-300 flex items-center justify-center px-4 py-3 border-2 border-neutral-300 backdrop-blur"
                v-on:click="gotoClarifier()">
                Knowledge
              </button>
              <button
                class="muArrow fw-bold rounded-full text-xl md:text-3xl text-neutral-300 flex items-center justify-center px-4 py-3 border-2 border-neutral-300 backdrop-blur"
                v-on:click="gotoClarifier()">
                Communities
              </button>
            </div>
          </div>
        </div>
        <div hidden style="width: 400px; display: flex; justify-content: center">
          <img src='@/assets/clarifier/clarifier_demo.png' alt=""
               style="width: 100%; object-fit: contain">
        </div>
        <template class="hidden md:block">
          <div
            class="absolute bottom-0 left-0 p-4 ml-8 mb-8 border-b-[4px] border-l-[4px] border-dotted border-b-fuchsia-500 border-l-fuchsia-500">
            <div class="text-center cursor-pointer hover:bg-neutral-900 p-4 rounded-full text-neutral-300"
                 v-on:click="scrollTo('firstSection')">
              <p class="font-bold">Explore</p>
              <i class="bi bi-arrow-down text-2xl"
                 id="firstSection"></i>
            </div>
          </div>
        </template>
        <template class="hidden md:block">
          <div
            class="absolute bottom-0 right-0 p-4 mr-8 mb-8 border-b-[4px] border-r-[4px] border-dotted border-b-fuchsia-500 border-r-fuchsia-500">
            <div class="text-center text-neutral-300">
              <p class="font-bold text-4xl pointer-events-none">wikiric</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <div style="color: white; width: 100%;
              display: flex; padding: 20px 5vw 20px 5vw;
              border-bottom: 4px dotted #192129"
       class="b_darkergray">
    <div style="width: 100%" class="wrapper"><!-- Demo Wrapper -->
      <div style="width: 100%; display: flex; justify-content: center">
        <img src='@/assets/clarifier/clarifier_e2e_demo.png' alt=""
             style="width: 80%; border-radius: 10px; background-color: #101010">
      </div>
      <div style="width: 100%; display: flex; align-items: center; justify-content: center">
        <p class="demotext c_lightgray">
          You don't trust anonymous strangers? Good.
          <br>Each Message is End-to-End encrypted for your privacy.
          <br>
          <br>Look for the shield icon (<i class="bi bi-shield-lock"></i>) to make sure nobody can sniff around.
          <br>
          <br>
          <i class="bi bi-box lead p-1"></i>
          <span class="lead">
            Contain and protect.
          </span>
        </p>
      </div>
    </div><!-- Demo Wrapper End -->
  </div>
  <div style="color: white; width: 100%;
              display: flex; padding: 20px 5vw 20px 5vw;
              border-bottom: 4px dotted #192129;"
       class="b_darkergray">
    <div style="width: 100%" class="wrapper"><!-- Demo Wrapper -->
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
  <div style="color: white; width: 100%;
              display: flex; padding: 20px 5vw 20px 5vw;
              border-bottom: 4px dotted #192129;"
       class="b_darkergray">
    <div style="width: 100%" class="wrapper"><!-- Demo Wrapper -->
      <div style="width: 100%; display: flex; justify-content: center">
        <img src='@/assets/clarifier/clarifier_member_demo.png' alt=""
             style="width: 80%; border-radius: 10px; background-color: #101010">
      </div>
      <div style="width: 100%; display: flex; align-items: center; justify-content: center">
        <p class="demotext c_lightgray">
          Manage your Group's members and add roles to categorize them!
          <br>Invite new people by clicking on the invite button
          and sending them the link.
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
  <div style="color: white; width: 100%;
              display: flex; padding: 20px 5vw 20px 5vw;
              border-bottom: 4px dotted #192129;"
       class="b_darkergray">
    <div style="width: 100%" class="wrapper"><!-- Demo Wrapper -->
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
             style="width: 75%; border-radius: 10px; background-color: #101010">
      </div>
    </div><!-- Demo Wrapper End -->
  </div>
  <div style="color: white; width: 100%;
              display: flex; padding: 20px 5vw 20px 5vw"
       class="b_darkergray">
    <div style="width: 100%" class="wrapper"><!-- Demo Wrapper -->
      <div style="width: 100%; display: flex; justify-content: center">
        <img src='@/assets/clarifier/clarifier_gif_demo.png' alt=""
             style="width: 75%; border-radius: 10px; background-color: #101010">
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
  background-color: #131313;
}

.c_darkergray {
  color: #131313;
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
