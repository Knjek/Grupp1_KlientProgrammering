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
    <router-link to="/">Home</router-link>
  </div>
</template>