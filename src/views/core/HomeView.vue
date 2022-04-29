<template>
  <div style="min-height: 100vh; overflow: hidden"
       :style="{backgroundImage: 'url('+require('@/assets/'+'account/pexels-anni-roenkae-2156881.jpg')+')',
       backgroundPosition: 'center top', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }">
    <section>
      <div style="width: 100%; padding-top: 30px">
        <div class="row justify-content-center align-items-center text-center">
          <div class="bartext" style="pointer-events: none">
            wikiric.xyz
            <div class="wow">wikiric.xyz</div>
            <div class="wow">wikiric.xyz</div>
            <div class="wow">wikiric.xyz</div>
            <div class="wow">wikiric.xyz</div>
          </div>
          <!--
          <div class="slider my-4 clearfix"
               style="vertical-align: center; pointer-events: none;
               text-shadow: 5px 5px 10px black;
               font-family: 'Gill Sans MT', sans-serif;">
            <div class="caption">
              Welcome
            </div>
            <div class="text-box text-white fw-bold">
              <div class="fw-bold">API&nbsp;Hub</div>
              <div class="fw-bold">DevOps</div>
              <div class="fw-bold">Insights</div>
            </div>
          </div>
          -->
        </div>
      </div>
      <div class="container mb-5" style="padding-top: 20px">
        <div class="card text-white shadow-box"
             style="z-index: 2; border: 2px solid #46b59b; pointer-events: none">
          <h2 class="card-body text-center fw-bold">
            Tools for you and your team</h2>
        </div>
        <div class="wrapper mt-4">
          <div v-for="card in this.cards" :key="card"
               class="card text-white shadow-box"
               style="z-index: 2; border: 2px solid #46b59b">
            <p class="card-header text-center fw-bold"
               style="font-size: 150%; pointer-events: none">
              {{ card.title }}
            </p>
            <button v-if="card.link !== '/wip'" title="Explore"
                    class="btn btn-lg btn-outline-light m-2"
                    v-on:click="this.$router.push(card.link)">
              <i class="bi bi-app-indicator"/>
            </button>
            <p v-else class="card-body fw-bold text-center" style="pointer-events: none">
              (Work In Progress)
            </p>
            <p style="pointer-events: none"
               class="card-body text-center fw-bold">
              {{ card.body }}
            </p>
            <p class="card-text p-2" style="font-style: italic; pointer-events: none">
              <span
                style="border-radius: 75%; padding: 4px; background-color: #017e7f">
                {{ card.type }}
              </span>
              {{ card.category }}
            </p>
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
          body: 'Communicate, share tasks and be there for each other.',
          type: 'App',
          category: 'Communication',
          link: '/apps/clarifier'
        },
        {
          title: 'Mockingbird',
          body: 'Tools for REST/SOAP API testing.',
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

.slider {
  text-align: center;
}

.caption {
  line-height: 100px;
  font-size: 10vw;
  font-weight: bold;
  color: white;
  margin-left: -40vw;
}

.text-box {
  display: inline-block;
  position: relative;
  font-size: 10vw;
  margin-left: 10vw;
  top: -6.5vw;
}

.text-box div {
  display: inline-block;
  position: absolute;
  transform: rotateX(-90deg);
  opacity: 0;
  animation-timing-function: ease;
}

.text-box div:nth-child(1) {
  animation: rollDown 15s forwards infinite;
}

.text-box div:nth-child(2) {
  animation: rollDown2 15s forwards infinite;
}

.text-box div:nth-child(3) {
  animation: rollDown3 15s forwards infinite;
}

@keyframes rollDown {
  0% {
    top: -200px;
    transform: rotateX(-90deg);
  }
  11% {
    top: -74px;
    transform: rotateX(0deg);
    opacity: 1;
  }
  22% {
    top: -74px;
    transform: rotateX(0deg);
    opacity: 1;
  }
  33% {
    top: 50px;
    transform: rotateX(30deg);
    opacity: 0;
  }
}

@keyframes rollDown2 {
  33% {
    top: -200px;
    transform: rotateX(-90deg);
  }
  44% {
    top: -74px;
    transform: rotateX(0deg);
    opacity: 1;
  }
  55% {
    top: -74px;
    transform: rotateX(0deg);
    opacity: 1;
  }
  66% {
    top: 50px;
    transform: rotateX(30deg);
    opacity: 0;
  }
}

@keyframes rollDown3 {
  66% {
    top: -200px;
    transform: rotateX(-90deg);
  }
  77% {
    top: -74px;
    transform: rotateX(0deg);
    opacity: 1;
  }
  88% {
    top: -74px;
    transform: rotateX(0deg);
    opacity: 1;
  }
  99% {
    top: 50px;
    transform: rotateX(30deg);
    opacity: 0;
  }
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
  text-shadow: 5px 5px 0 rebeccapurple,
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
    grid-template-columns: repeat(3, 1fr);
  }
}

.shadow-box {
  background-color: rgba(0, 0, 0, 0.6);
  box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.6);
  border-radius: 1em
}

</style>
