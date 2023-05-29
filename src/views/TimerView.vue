<script>
import BooksAndAuthors from "../components/BooksAndAuthors.vue"

export default {
  components: {
    BooksAndAuthors,
  },
  data() {
    return {
      timerCount: 0,
      startButton: false
    }
  },
  methods: {
    start() {
      this.timerCount = 10
      this.startButton = true
    }
  },
  watch: {
    timerCount: {
      handler(value) {
        if (value > 0) {
          setTimeout(()=> {
            this.timerCount--;
          }, 1000);
        }
        if (value === 0) {
          this.startButton = false
        }
      }
    }
  }
}
</script>

<template>
  <div>
    <!-- hide until press start
    AND
    when timer is 0 hide again-->
    <div id="timer">
      <button id="startButton" @click="start">Start</button>

      <h1 v-if="startButton">
        <BooksAndAuthors heading="Guess before your time runs out!" />
      </h1>
      <h1 v-else>Time out! 😢</h1>
    </div>

<!--    <BooksAndAuthors  hading="Guess before your time run's out!" />-->

<!--    <button id="startButton" @click="timerCount=10">Start</button>-->

    <p>{{ timerCount }} seconds left </p>
  </div>
</template>