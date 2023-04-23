<template>
  <div class="mt-[55px] h-full w-full overflow-y-scroll
              pb-8">
    <div class="container pb-3">
      <h1 style=" color: black; background-color: white; padding: 10px">
        V i s i o n . . .
      </h1>
      <h2 style=" color: white; border: 2px solid white; padding: 10px">
        <i class="bi bi-calendar-event"/> SITREP 2022-XX-XX
      </h2>
      <p class="text-center"
         style="color: white">
        Author: <a :href="'https://github.com/glehu'" style="color: white"> Luca Goldhausen</a>
      </p>
      <p class="text-center"
         style=" color: white; border: 2px solid white; padding: 10px">
        Goals and ambitions. Information about the path we're about to walk and what we've been doing so far.
      </p>
    </div>
    <div class="container wrapper">
      <!-- Global Network -->
      <div>
        <p class="text-center"
           style=" color: mediumpurple; font-size: 300%">
          Global Network
        </p>
        <div class="text-wrapper"
             style="text-align: justify; text-justify: inter-word; margin: auto">
          <p style="color: white">
            Both this website and the server/client solution provided by our own enterprise resource planning
            software <a :href="'https://github.com/glehu/CWO_ERP'" style="color: white">CWO_DB</a> are made to
            make information and useful apps accessible for everybody as far as the internet reaches.
          </p>
          <p style="color: white">
            Using modern technology like
            <a :href="'https://ktor.io/'" style="color: white">Ktor</a>
            for our applications and super fast website hosts like
            <a :href="'https://app.netlify.com/'" style="color: white">Netlify</a>,
            we guarantee fast speeds. Welcome to the IoT.
          </p>
          <p style="color: white">
            A network for people, information, business and automated processes.
          </p>
        </div>
      </div>
      <i class="bi bi-globe text-center" style="font-size: 1500%; color: mediumpurple"></i>
      <!-- Database -->
      <i class="bi bi-server text-center" style="font-size: 1500%; color: lightblue"></i>
      <div>
        <p class="text-center"
           style=" color: lightblue; font-size: 300%">
          Data Logistics
        </p>
        <div class="text-wrapper"
             style="text-align: justify; text-justify: inter-word; margin: auto">
          <p style="color: white">
            <a :href="'https://github.com/glehu/CWO_ERP'" style="color: white">CWO_DB</a>,
            a custom self-written Open-Source database to fit our needs.
            Both this website and any other projects will be driven with CWO_DB,
            powered by <a :href="'https://kotlinlang.org/'" style="color: white">Kotlin</a>.
          </p>
          <ul>
            <li>
              <p style="color: white">
                Optimised for speed and easy API support.
              </p>
            </li>
            <li>
              <p style="color: white">
                Features relational, object and document database functionality.
              </p>
            </li>
            <li>
              <p style="color: white">
                Almost real time read speeds using Linked Hash Maps and asynchronous parallel index lookups with
                callbacks.
              </p>
            </li>
          </ul>
        </div>
      </div>
      <!-- Organisation -->
      <div>
        <p class="text-center"
           style=" color: lightgreen; font-size: 300%">
          Organisation
        </p>
        <div class="text-wrapper"
             style="text-align: justify; text-justify: inter-word; margin: auto">
          <p style="color: white">
            Creative minds need head-space, so let
            <span class="font-bold" style="font-size: 150%">us</span>
            do the dirty work instead. Nothing feels as good as being able to express yourself.
          </p>
          <ul>
            <li>
              <p style="color: white">
                Gain detail intel about what's going on in and around your business.
              </p>
            </li>
            <li>
              <p style="color: white">
                Get matched with other people sharing similar ideas and goals.
              </p>
            </li>
            <li>
              <p style="color: white">
                Let software plan and optimize your processes.
              </p>
            </li>
          </ul>
        </div>
      </div>
      <i class="bi bi-boxes text-center" style="font-size: 1500%; color: lightgreen"></i>
      <h1 style=" color: black; background-color: white; padding: 10px">
        Our Promise:
      </h1>
      <h2 class="text-center"
          style=" color: white; border: 2px solid white; padding: 10px">
        Improving your QoL is our ambition.
      </h2>
      <!-- Knowledge -->
      <i class="bi bi-file-earmark-easel text-center" style="font-size: 1500%; color: indianred"></i>
      <div>
        <p class="text-center"
           style=" color: indianred; font-size: 300%">
          Knowledge
        </p>
        <div class="text-wrapper"
             style="text-align: justify; text-justify: inter-word; margin: auto">
          <p style="color: white">
            Our brain is the most amazing thing imaginable, so we're going to use its full potential.
          </p>
          <ul>
            <li>
              <p style="color: white">
                Documentations, step by step tutorials and more. All for you.
              </p>
            </li>
            <li>
              <p style="color: white">
                Data analytics for gathering useful and constructive information.
              </p>
            </li>
          </ul>
        </div>
      </div>
      <!-- Tools -->
      <div>
        <p class="text-center"
           style=" color: lightblue; font-size: 300%">
          Tools
        </p>
        <div class="text-wrapper"
             style="text-align: justify; text-justify: inter-word; margin: auto">
          <p style="color: white">
            We are going to provide useful tools for you to implement into your workflow.
            Made to make things easier.
          </p>
          <ul>
            <li>
              <p style="color: white">
                Planner: Kanban-Style ToDo Lists
              </p>
            </li>
            <li>
              <p style="color: white">
                Mockingbird: Your very own Mocking-/Bouncing-Service
              </p>
            </li>
            <li>
              <p style="color: white">
                Clarifier: A Chat Platform for You and your Team
              </p>
            </li>
            <li>
              <p style="color: white">
                More coming soon...
              </p>
            </li>
          </ul>
        </div>
      </div>
      <i class="bi bi-tools text-center" style="font-size: 1500%; color: lightblue"></i>
      <!-- Outer Wrapper -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'WVision'
}
</script>

<style>

.wrapper {
  display: grid;
  gap: 1em;
  grid-auto-rows: minmax(100px, auto);
  align-items: center;
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

li {
  color: white
}

</style>
