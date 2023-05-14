<script>
import BooksAndAuthors from "../components/BooksAndAuthors.vue"
import { RouterLink } from 'vue-router'

export default {
  components: {
    RouterLink,
    BooksAndAuthors,
  },
}
</script>

<template>
  <div>
    <h1>3 wrong guesses and you're out!</h1>
    <BooksAndAuthors :three-view="true" />
    <router-link to="/" class="btn btn-outline-primary btn-sm">Home</router-link>
    <router-link to="/2player" class="btn btn-outline-danger btn-sm">2-player</router-link>
    <router-link to="/timer" class="btn btn-outline-warning btn-sm">Timer</router-link>
    <router-link to="/anagram" class="btn btn-outline-success btn-sm">Author anagram quiz!</router-link>
  </div>
</template>