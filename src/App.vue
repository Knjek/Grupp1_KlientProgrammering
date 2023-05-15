<script setup>
import { RouterView } from 'vue-router'
import NavMenu from './components/NavMenu.vue';
</script>

<template>
  <div class="container">
    <div align="center">
      <NavMenu id="small" :small="true" />
      <NavMenu id="big" :small="false" />
    </div>
    <div>
      <RouterView>
      </RouterView>
    </div>
  </div>
</template>

<style>
#big {
  display: none;
}
@media screen and (min-width: 576px) {
  #big {
    display: flex;
  }
  #small {
    display: none;
  }
}
</style>
