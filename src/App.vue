<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="container">
    <div align="center">
      <nav class="btn-group gap-2 d-flex">
        <router-link to="/" class="btn btn-outline-primary btn-sm">Home</router-link>
        <router-link to="/max3" class="btn btn-outline-success btn-sm">Max 3 errors</router-link>
        <router-link to="/timer" class="btn btn-outline-warning btn-sm">Timer</router-link>
        <router-link to="/2player" class="btn btn-outline-danger btn-sm">2-player</router-link>
        <router-link to="/anagram" class="btn btn-outline-dark btn-sm">Anagram quiz</router-link>
      </nav>
    </div>
    <div>
      <RouterView>
      </RouterView>
    </div>
  </div>
</template>

<style>

</style>
