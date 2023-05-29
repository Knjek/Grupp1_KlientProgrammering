<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="sidebar">
    <router-link to="/home" class="btn btn-primary btn-sm">Home</router-link>
    <router-link to="/about" class="btn btn-primary btn-sm">About</router-link>
  </div>
  <div>
    <RouterView />
  </div>
</template>

<style></style>
