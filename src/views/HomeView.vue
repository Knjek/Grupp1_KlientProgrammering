<script>
import BooksAndAuthors from "../components/BooksAndAuthors.vue"
import { RouterLink } from 'vue-router'
import NameAnagram from "../components/NameAnagram.vue";

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
  <router-link to="/max3" class="btn btn-outline-success btn-sm" >Max 3 errors</router-link> 
  <router-link to="/2player" class="btn btn-outline-danger btn-sm ">2-player</router-link>
  <router-link to="/timer" class="btn btn-outline-warning btn-sm">Timer</router-link>
  <router-link to="/anagram" class="btn btn-outline-success btn-sm">Author anagram quiz!</router-link>
</template>