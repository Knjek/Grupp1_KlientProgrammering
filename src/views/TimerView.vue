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
  <div>
    <BooksAndAuthors heading="Guess before your time run's out!" />

    <button id="startButton" @click="timerCount=10">Start</button>

    <p>{{ timerCount }} seconds left </p>
  </div>
</template>*/