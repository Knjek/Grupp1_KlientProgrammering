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
      <h1>2-player mode</h1>
      <BooksAndAuthors/>
      <router-link to="/" class="btn btn-outline-primary btn-sm">Home</router-link>
      <router-link to="/max3" class="btn btn-outline-success btn-sm" >Max 3 errors</router-link>
      <router-link to="/timer" class="btn btn-outline-warning btn-sm">Timer</router-link>
    </div>
  </template>