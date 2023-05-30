<script>
import BooksAndAuthors from "../components/BooksAndAuthors.vue"

export default {
  components: {
    BooksAndAuthors,
  },
  data() {
    return {
      timerCount: 0,
      startButton: false,
      showTimeoutMessage: false,
      timeoutId: null
    }
  },
  methods: {
    start() {
      this.timerCount = 10
      this.startButton = true
      this.showTimeoutMessage = false
      this.startTimeout()
    },
    startTimeout() {
      clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(() => {
        this.showTimeoutMessage = true
        setTimeout(() => {
          this.showTimeoutMessage = false
        }, 5000)
      }, this.timerCount * 1000)
    }
  },
  watch: {
    timerCount(value) {
      if (value > 0) {
        setTimeout(() => {
          this.timerCount--;
        }, 1000);
      } else if (value === 0) {
        this.startButton = false
        clearTimeout(this.timeoutId)
      }
    }
  }
}
</script>

<template>
  <!-- hide until press start
              AND
              when timer is 0 hide again-->

  <div id="timer">
    <button id="startButton" @click="start">Start</button>
    <div v-if="startButton">
      <BooksAndAuthors :timer-view="true" :timer-count="timerCount" heading="Guess the author!" />
    </div>
    <p v-else-if="showTimeoutMessage"> Time out! 😢</p>
  </div>
</template>

<style>
#timer {
  border: 0.5em solid rgba(253, 171, 103, 0.954);
  background-color: whitesmoke;
}

#timer #counter {
  color: black;
}

#timer #message {
  color: black;
}
</style>