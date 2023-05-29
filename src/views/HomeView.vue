<script>
import BooksAndAuthors from "../components/BooksAndAuthors.vue"

export default {
  components: {   
    BooksAndAuthors,
  },
}
</script>

<template>
  <BooksAndAuthors :three-view="false" heading="Guess the author!" id="home"/>
</template>

<style>
#home {
  border: 0.5em solid rgba(253, 236, 140, 0.949);
}
</style>