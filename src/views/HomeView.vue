<script>
import BooksAndAuthors from "../components/BooksAndAuthors.vue"
import NavMenu from "../components/NavMenu.vue";

export default {
  components: {
    BooksAndAuthors,
    NavMenu,
  },
}
</script>

<template>
  <div class="container">
    <div class="center-content">
      <NavMenu class="small" :small="true" />
      <NavMenu class="medium" :small="false" />
      <NavMenu class="big" :small="false" />
    </div>
    <RouterView :key="$route.path"/>
  </div>
</template>

<style>
#home {
  border: 0.5em solid rgba(253, 236, 140, 0.949);
}
</style>