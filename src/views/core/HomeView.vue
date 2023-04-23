<template>
  <div class="h-full w-full overflow-x-hidden overflow-y-scroll mt-[55px]">
    <div class="flex min-h-[525px] h-[calc(100dvh-55px)] items-center justify-center"
         :style="{ backgroundImage: 'url('+require('@/assets/'+'account/pexels-marek-piwnicki-10050567.jpg')+')',
                 backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }">
      <div
        class="text-neutral-200 w-full h-full flex pb-8 overflow-x-hidden">
        <div class="w-full h-full relative">
          <div class="w-full h-full"><!-- Demo Wrapper -->
            <div style="transform: translate3d(0, 0, 0)"
              class="w-full h-full items-center justify-center flex px-4 py-4 rounded-r-md backdrop-blur-xl">
              <div style="pointer-events: inherit"
                   class="rounded-2xl w-full h-full p-4">
                <p
                  class="text-neutral-200 text-5xl font-bold md:text-7xl xl:text-8xl w-fit pointer-events-none">
                  <span class="text-fuchsia-500">Web3</span> <span class="">Collaboration</span>
                </p>
                <p
                  class="text-neutral-200 font-bold mb-4 py-2 text-2xl md:text-4xl w-fit pointer-events-none">
                  Powered by wikiric and {{ userCount }} others.
                </p>
                <p class="text-neutral-300 font-bold text-xl w-full pointer-events-none">
                  A secure and responsive environment
                  for communities, projects and ideas.
                  <br>Bridging the gap between Web2 and Web3.
                </p>
                <div class="relative mt-12">
                  <div class="flex w-full justify-center md:justify-start">
                    <div class="relative grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center w-full md:w-fit">
                      <button
                        class="muArrow font-bold rounded text-xl text-start text-black px-4 py-3 bg-fuchsia-500"
                        v-on:click="gotoClarifier()">
                        Join the
                        <br><span class="text-2xl md:text-3xl text-black">Communities</span>
                      </button>
                      <button
                        class="muArrow font-bold rounded text-xl text-start text-neutral-300 px-4 py-3 border-2 border-neutral-300"
                        v-on:click="gotoKnowledgeFinder()">
                        Browse the
                        <br><span class="text-2xl md:text-3xl">Knowledge</span>
                      </button>
                    </div>
                  </div>
                </div>
                <template class="hidden md:block">
                  <div
                    class="absolute bottom-0 left-0 p-4 ml-4">
                    <div class="text-center cursor-pointer hover:darkest_bg p-4 rounded-full text-neutral-300"
                         v-on:click="scrollTo('firstSection')">
                      <p class="font-bold">Explore</p>
                      <i class="bi bi-arrow-down text-2xl"></i>
                    </div>
                  </div>
                </template>
                <template class="hidden md:block">
                  <div
                    class="absolute bottom-0 right-0 p-4 mr-8 mb-8 border-b-[4px] border-r-[4px]
                           border-dotted border-b-fuchsia-500 border-r-fuchsia-500">
                    <div class="text-center text-neutral-300">
                      <p class="font-bold text-4xl pointer-events-none">wikiric</p>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div><!-- Demo Wrapper End -->
        </div>
      </div>
    </div>
    <div id="firstSection"
         style="color: white; width: 100%;
              display: flex; padding: 20px 5vw 20px 5vw;
              border-bottom: 4px dotted #192129"
         class="b_darkergray">
      <div style="width: 100%" class="wrapper mt-[55px]"><!-- Demo Wrapper -->
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
  </div>
</template>

<script>

export default {
  data () {
    return {
      userCount: '45'
    }
  },
  created () {
    this.getUsercount()
  },
  methods: {
    scrollTo (content) {
      document.getElementById(content).scrollIntoView({ behavior: 'smooth' })
    },
    gotoClarifier () {
      this.$router.push('/apps/clarifier')
    },
    gotoKnowledgeFinder () {
      this.$router.push('/apps/knowledge?kguid=903f7d06-ed1b-467c-b8e3-751d07b83584')
    },
    getUsercount: async function () {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api-http',
          method: 'get',
          url: 'm2/count'
        })
          .then((data) => {
            if (data.success) this.userCount = data.result
            resolve()
          })
          .catch((err) => {
            if (err.message) return
            console.debug(err.message)
          })
      })
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
  min-height: 55px;
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
