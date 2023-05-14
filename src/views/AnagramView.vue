<script>
import { RouterLink } from 'vue-router'
import NameAnagram from '../components/NameAnagram.vue';

export default {
    components: {
        RouterLink,
        NameAnagram
    }
}
</script>

<template>
    <div>
        <h1>Author anagram</h1>
        <NameAnagram />
        <router-link to="/" class="btn btn-outline-success btn-sm">Home</router-link>
        <router-link to="/max3" class="btn btn-outline-success btn-sm">Max 3 errors</router-link>
        <router-link to="/2player" class="btn btn-outline-danger btn-sm ">2-player</router-link>
        <router-link to="/timer" class="btn btn-outline-warning btn-sm">Timer</router-link>
    </div>
</template>