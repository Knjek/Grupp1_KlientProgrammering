<script>
import BooksAndAuthors from "../components/BooksAndAuthors.vue"

export default {
  components: {
    BooksAndAuthors,
  },
}
</script>

<template>
  <div>
    <BooksAndAuthors :three-view="true" heading="3 wrong guesses and you're out!" id="three"/>
  </div>
</template>

<style>
#three {
  border: 0.5em solid  rgba(252, 182, 147, 0.944);
}
</style>