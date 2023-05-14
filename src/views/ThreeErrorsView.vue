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
    <BooksAndAuthors :three-view="true" heading="3 wrong guesses and you're out!"/>
  </div>
</template>