<template>
  <div class="about min-h-full w-full flex items-center justify-around">
    <div class="container  wrapper mt_nav p-2">
      <div class="text-wrapper mb-5"
           style="text-align: justify; text-justify: inter-word;
           margin: auto">
        <div class="p-2">
          <!-- Who -->
          <span class="h2 font-bold" style="pointer-events: none">
            <i class="bi bi-fingerprint"/> What/Who is wikiric.xyz?
          </span>
          <br>This website is part of a project being worked on by
          <a style="color: white" :href="'https://github.com/glehu'">Luca Goldhausen</a>.
          It currently consists of this website including all its apps and services and
          <a :href="'https://github.com/glehu/WikiricGo/tree/master'" style="color: white">CWO_DB</a>,
          the back-end, database and API hub handling everything being shown on this website.
          <!-- Why -->
          <br><br><span class="h2 font-bold" style="pointer-events: none">
            <i class="bi bi-fingerprint"/> What is the purpose of this?
          </span>
          <br>I&nbsp;want to make the world a better place, pursuing my dreams by helping others.
          By providing tools and an easily accessible platform for everybody, I'm doing my
          best to reach my goals.
          <br>People need to have fun to be able to learn new things efficiently.
          Creativity blooms in an artistic environment. Let's work on the future.
        </div>
        <p class="text-end pt-2" style="font-style: italic">
          Designed with <i class="bi bi-heart-fill" style="color: red"></i> by
          <a style="color: white" :href="'https://github.com/glehu'">Luca</a>
        </p>
        <p class="text-center pt-4" style="font-style: italic">
          Background images from
          <a style="color: white" :href="'https://www.pexels.com/'">Pexels</a>
        </p>
      </div>
      <div class="text-center mb-5" style="margin: 20px">
        <p class="h1 font-bold pb-3">More Info:</p>
        <button title="V i s i o n"
                class="btn btn-outline-light"
                style="font-size: 250%; width: 250px; margin-bottom: 40px"
                v-on:click="gotoVision">
          V i s i o n
        </button>
        <p>Luca&nbsp;Goldhausen</p>
        <p>86179 Augsburg</p>
        <p>luca.goldhausen@gmail.com</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    gotoVision () {
      this.$router.push('/vision')
    }
  }
}
</script>

<style scoped>

.wrapper {
  display: grid;
  gap: 1em;
  grid-auto-rows: minmax(100px, auto);
}

.wrapper {
  grid-template-columns: repeat(1, 1fr);
}

.text-wrapper {
  width: 350px;
}

@media only screen and (min-width: 992px) {
  .wrapper {
    grid-template-columns: repeat(2, 1fr);
  }

  .text-wrapper {
    width: 500px;
  }
}

</style>
