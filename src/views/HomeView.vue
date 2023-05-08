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
  <BooksAndAuthors/>
  <router-link to="/other">Other</router-link> 
</template>