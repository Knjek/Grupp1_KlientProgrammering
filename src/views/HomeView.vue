<script>
import BooksAndAuthors from "../components/BooksAndAuthors.vue"

export default {
  components: {   
    BooksAndAuthors,
  },
}
</script>

<template>
  <BooksAndAuthors :three-view="false" heading="Guess the author!"/>
</template>