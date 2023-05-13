<script>
import BooksAndAuthors from "../components/BooksAndAuthors.vue"
import { RouterLink } from 'vue-router'

export default {
  components: {   
    RouterLink,
    BooksAndAuthors
  }
}
</script>

<template>
  <h1>Guess!</h1>
  <BooksAndAuthors/>
  <router-link to="/max3">Max 3 errors</router-link> 
</template>