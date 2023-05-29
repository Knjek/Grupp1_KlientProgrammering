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
      <BooksAndAuthors heading="2-player mode" id="twoplayer"/>
    </div>
  </template>

  <style>
  #twoplayer {
    border: 0.5em solid  rgb(166, 223, 147);
  }
</style>