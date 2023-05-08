<script>
import { RouterLink } from 'vue-router'

export default {
  components: {
    RouterLink
  }
}
</script>

<template>
  <div>
    <h1>The other page</h1>
    <router-link to="/">Home</router-link>
  </div>
</template>