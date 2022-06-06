<template>
  <div style="min-height: 100vh; overflow: hidden"
       :style="{backgroundImage: 'url('+require('@/assets/'+'account/pexels-anni-roenkae-2156881.jpg')+')',
       backgroundPosition: 'center top', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }">
    <section>
      <div style="height: 60px"></div>
      <div class="row" style="width: 100%">
        <div class="bartext justify-content-center align-items-center text-center" style="pointer-events: none">
          wikiric.xyz
          <div class="wow">wikiric.xyz</div>
          <div class="wow">wikiric.xyz</div>
          <div class="wow">wikiric.xyz</div>
          <div class="wow">wikiric.xyz</div>
        </div>
      </div>
      <div class="container mb-5" style="padding-top: 20px">
        <div class="wrapper mt-4">
          <div v-for="card in this.cards" :key="card"
               class="card text-white shadow-box b_darkergray"
               style="z-index: 2">
            <span class="card-header text-center fw-bold lead"
                  style="pointer-events: none">
              {{ card.title }}
            </span>
            <button v-if="card.link !== '/wip'" title="Explore"
                    class="btn btn-lg m-2 darkbutton"
                    v-on:click="this.$router.push(card.link)">
              <i class="bi bi-app-indicator purplehover" style="font-size: 125%"/>
            </button>
            <div v-else
                 style="pointer-events: none"
                 class="btn btn-lg mt-2 mb-3">
              <span style="font-size: 80%; color: lightgray">
                Work in Progress
              </span>
            </div>
            <div class="card-footer p-2"
                 style="font-style: italic; pointer-events: none; width: 100%;
                 display: inline-block; align-items: center">
              <span class="b_purple" style="border-radius: 10px; padding: 4px">
                {{ card.type }}
              </span>
              <span style="margin-left: 10px; font-size: 85%" class="c_lightgray">
                {{ card.category }}
              </span>
            </div>
            <span class="card-body text-center c_lightgray"
                  style="pointer-events: none">
              {{ card.body }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cards: [
        {
          title: 'Planner',
          body: 'Kanban-Board style task management.',
          type: 'App',
          category: 'Management',
          link: '/apps/planner/_user'
        },
        {
          title: 'Clarifier',
          body: 'Communication platform for you and your team.',
          type: 'App',
          category: 'Communication',
          link: '/apps/clarifier'
        },
        {
          title: 'Mockingbird',
          body: 'API testing tools and backend simulation.',
          type: 'Service',
          category: 'Networking',
          link: '/dev/api'
        },
        {
          title: 'SnippetBase',
          body: 'Temporary storage for any XML/JSON data.',
          type: 'Service',
          category: 'Data Storage',
          link: '/wip'
        }
      ]
    }
  }
}
</script>

<style scoped>

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

@keyframes slide {
  0% {
    top: 0;
  }
  25% {
    top: -4rem;
  }
  50% {
    top: -8rem;
  }
  75% {
    top: -12.25rem;
  }
}

.wow {
  font-family: 'JetBrains Mono Bold', sans-serif;
  color: black;
  text-shadow: 5px 5px 0 #68349b,
  10px 10px 0 #052939,
  15px 15px 0 #46b59b,
  20px 20px 0 #017e7f,
  25px 25px 0 #052939;
}

.bartext {
  position: relative;
  margin: auto;
  left: -2vw;
  color: transparent;
  font-size: 12vw;
  font-weight: bold;
  overflow: hidden;
  z-index: 2;
}

.bartext > div {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.bartext > div:nth-child(1) {
  mask-image: linear-gradient(black 25%, transparent 25%);
  animation: bartext1 11s infinite;
}

.bartext > div:nth-child(2) {
  mask-image: linear-gradient(transparent 25%, black 25%, black 50%, transparent 50%);
  animation: bartext2 11s infinite;
}

.bartext > div:nth-child(3) {
  mask-image: linear-gradient(transparent 50%, black 50%, black 75%, transparent 75%);
  animation: bartext3 12s infinite;
}

.bartext > div:nth-child(4) {
  mask-image: linear-gradient(transparent 75%, black 75%);
  animation: bartext4 13s infinite;
}

@keyframes bartext1 {
  0% {
    transform: translateX(0%);
  }
  33% {
    transform: translateX(2%);
  }
  66% {
    transform: translateX(-0.6%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes bartext2 {
  0% {
    transform: translateX(0%);
  }
  33% {
    transform: translateX(2.2%);
  }
  66% {
    transform: translateX(-1%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes bartext3 {
  0% {
    transform: translateX(0%);
  }
  33% {
    transform: translateX(-1.6%);
  }
  66% {
    transform: translateX(2%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes bartext4 {
  0% {
    transform: translateX(0%);
  }
  33% {
    transform: translateX(-0.2%);
  }
  66% {
    transform: translateX(1%);
  }
  100% {
    transform: translateX(0);
  }
}

.wrapper {
  display: grid;
  gap: 0.5em;
  grid-auto-rows: minmax(100px, auto);
  grid-template-columns: repeat(2, 1fr);
}

/* Small devices (portrait tablets and large phones, 765px and up) */
@media only screen and (min-width: 765px) {
  .wrapper {
    grid-template-columns: repeat(4, 1fr);
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

</style>
