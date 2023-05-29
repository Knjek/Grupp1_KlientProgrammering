<script>
import BooksAndAuthors from "../components/BooksAndAuthors.vue"

export default {
  components: {
    BooksAndAuthors,
  },
  data() {
    return {
      timerCount:0

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
      }
    }
  }
}
</script>

<template>
  <div class="center-content">
    <BooksAndAuthors heading="Guess before your time run's out!" id="timer"/>

    <button id="startButton" @click="timerCount=10">Start</button>

    <p>{{ timerCount }} seconds left </p>
  </div>
</template>

<style>
#timer {
  border: 0.5em solid  rgba(253, 171, 103, 0.954);
}
</style>