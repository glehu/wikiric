<template>
  <div class="about">
    <div style="min-height: 10ch"></div>
    <div class="container text-white wrapper">
      <div class="text-wrapper mb-5"
           style="text-align: justify; text-justify: inter-word;
           margin: auto">
        <span class="p-2">
          <!-- Who -->
          <span class="h2 fw-bold" style="pointer-events: none">
            <i class="bi bi-fingerprint"/> What/Who is wikiric.xyz?
          </span>
          <br>This website is part of a project being ran by
           <a style="color: white" :href="'https://github.com/glehu'">Wiki&nbsp;Ric&nbsp;G</a>
          (or Wiki in short). It currently consists of this website including
          all its apps and
          <a :href="'https://github.com/glehu/CWO_ERP'" style="color: white">CWO_DB</a>,
          the back-end database and API hub handling everything being worked on the website.
          <!-- Why -->
          <br><br><span class="h2 fw-bold" style="pointer-events: none">
            <i class="bi bi-fingerprint"/> What is the purpose of this?
          </span>
          <br>I&nbsp;want to make the world a better place, pursuing my dreams by helping others.
          By providing tools and an easily accessible platform for everybody, I'm doing my
          best to reach my goals.
          <br>People need to have fun to be able to learn new things efficiently.
          Creativity blooms in an artistic environment. Let's work on the future.
        </span>
        <p class="text-end pt-2" style="font-style: italic">
          Designed with <i class="bi bi-heart-fill" style="color: red"></i> by
          <a style="color: white" :href="'https://github.com/glehu'">Wiki</a>
        </p>
        <p class="text-center pt-4" style="font-style: italic">
          Background images from
          <a style="color: white" :href="'https://www.pexels.com/'">Pexels</a>
        </p>
      </div>
      <div class="text-center mb-5" style="margin: 20px">
        <p class="h1 fw-bold pb-3">More Info:</p>
        <button title="V i s i o n"
                class="btn btn-outline-light"
                style="font-size: 250%; width: 250px"
                v-on:click="gotoVision">
          V i s i o n
        </button>
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
