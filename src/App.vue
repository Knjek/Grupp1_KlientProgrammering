<script setup>
import { RouterView } from 'vue-router'
import NavMenu from './components/NavMenu.vue';
</script>

<template>
  <div class="container">
    <div class="center-content">
      <NavMenu class="small" :small="true" />
      <NavMenu class="medium" :small="false" />
      <NavMenu class="big" :small="false" />
    </div>
    <div>
      <RouterView>
      </RouterView>
    </div>
  </div>
</template>

<style>

</style>
