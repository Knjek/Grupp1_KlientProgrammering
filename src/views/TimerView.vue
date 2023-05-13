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
    <h1>Guess before your time run's out!</h1>
    <BooksAndAuthors/>
    <router-link to="/" class="btn btn-outline-primary btn-sm">Home</router-link>
    <router-link to="/max3" class="btn btn-outline-success btn-sm" >Max 3 errors</router-link>
    <router-link to="/2player" class="btn btn-outline-danger btn-sm">2-player</router-link>
  </div>
</template>