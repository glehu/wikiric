<template>
  <div class="h-full w-full overflow-x-hidden overflow-y-auto mt_nav background">
    <div class="flex min-h-[800px] h-[calc(100dvh-50px)]">
      <div class="absolute top-0 left-0 w-full h-full opacity-20 blur saturate-200 contrast-200"
           :style="{ backgroundImage: 'url('+require('@/assets/'+'account/pexels-marek-piwnicki-10050567.jpg')+')',
                 backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }"></div>
      <div class="w-full h-full flex overflow-x-hidden">
        <div class="w-full h-full relative">
          <div class="w-full h-full"><!-- Demo Wrapper -->
            <div style="transform: translate3d(0, 0, 0)"
                 class="w-full h-full
                        justify-center lg:items-center
                        flex px-4 py-4 rounded-r-md">
              <div style="pointer-events: inherit"
                   class="rounded-2xl w-full h-fit p-4 max-w-screen-2xl
                          lg:mb-20">
                <div class="flex items-center md:p-4 pointer-events-none">
                  <div class="text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl
                              w-fit flex flex-col gap-y-2">
                    <p>Open Source</p>
                    <p class="font-bold">Collaboration</p>
                  </div>
                </div>
                <div class="flex mt-10 flex-wrap gap-4">
                  <div class="w-fit h-fit backdrop-blur-2xl
                              p-6 rounded-md bshadow"
                       style="border: 1px solid var(--md-sys-color-surface-variant)">
                    <p class="text-lg font-bold pointer-events-none">
                      {{ $t("home.title") }}
                      <br>Powered by wikiric and <span class="italic">{{ userCount }}</span> others.
                    </p>
                    <div class="relative mt-6">
                      <div class="flex w-full justify-center md:justify-start">
                        <div
                          class="relative flex flex-col
                                 sm:grid sm:grid-cols-2 gap-4 sm:items-center
                                 justify-center w-full md:w-fit">
                          <button
                            class="muArrow font-bold rounded text-start primary-container bshadow
                                   px-4 py-3 hover:dshadow"
                            v-on:click="gotoLogin()">
                            <span class="text-xl">Sign In</span>
                            <br><span class="text-sm">Welcome back</span>
                          </button>
                          <button
                            class="muArrow font-bold rounded text-start primary-container bshadow
                               px-4 py-3 hover:dshadow"
                            v-on:click="gotoRegistration()">
                            <span class="text-xl">Sign Up</span>
                            <br><span class="text-sm">Start your adventure</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flex-grow flex items-center xl:justify-center overflow-x-auto
                              mt-4 ml-2">
                    <div class="p-1">
                      <div class="primary w-fit px-2 py-1 rounded-full">
                        <p class="font-bold text-sm">
                          New Feature
                        </p>
                      </div>
                      <p class="font-bold text-xl lg:text-2xl xl:text-3xl mt-2">
                        E-Commerce
                      </p>
                      <p>
                        Have your own web shop presence.
                        <br>With just a few clicks.
                      </p>
                      <div class="flex flex-wrap gap-2 mt-2 w-full">
                        <div class="rounded px-2 py-1 bshadow surface">
                          <p class="text-sm">Inventory Management</p>
                        </div>
                        <div class="rounded px-2 py-1 bshadow surface">
                          <p class="text-sm">Order Handling</p>
                        </div>
                        <div class="rounded px-2 py-1 bshadow surface">
                          <p class="text-sm">Automatic Emailing</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <template class="hidden md:block">
                  <div
                    class="absolute bottom-0 left-0 p-4 ml-4 mt-4 hidden">
                    <div class="text-center cursor-pointer hover:darkest_bg p-4 rounded-full"
                         v-on:click="scrollTo('firstSection')">
                      <p class="font-bold">Explore</p>
                      <i class="bi bi-arrow-down text-2xl"></i>
                    </div>
                  </div>
                </template>
                <template class="hidden md:block">
                  <div
                    class="absolute bottom-0 right-0 p-4 mr-8 mb-8 flex items-baseline pointer-events-">
                    <span class="font-bold text-5xl xl:text-6xl 2xl:text-7xl ml-1">wikiric</span>
                  </div>
                </template>
              </div>
            </div>
          </div><!-- Demo Wrapper End -->
        </div>
      </div>
    </div>
    <div class="hidden">
      <div id="firstSection"
           style="color: white; width: 100%;
              display: flex; padding: 20px 5vw 20px 5vw;
              border-bottom: 4px dotted #192129"
           class="b_darkergray">
        <div style="width: 100%" class="wrapper mt_nav"><!-- Demo Wrapper -->
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
              Create as many channels as you need. For any purpose imaginable.
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
              display: flex; padding: 20px 5vw 100px 5vw"
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
  </div>
</template>

<script>

export default {
  data () {
    return {
      userCount: '8'
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
    gotoLogin () {
      if (this.$store.state.authenticated) {
        this.$router.push('/account')
      } else {
        this.$router.push('/login?redirect=/account')
      }
    },
    gotoRegistration () {
      if (this.$store.state.authenticated) {
        this.$router.push('/account')
      } else {
        this.$router.push('/register?redirect=/account')
      }
    },
    getUsercount: async function () {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api-http',
          method: 'get',
          url: 'users/public/count'
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
