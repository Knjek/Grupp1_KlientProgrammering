<script>
export default {
    props: {
        small: {
            type: Boolean,
            required: true,
        }
    }
}
</script>

<template>
    <nav v-if="small">
        <div class="dropdown">
            <button class="btn btn-warning dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
                Choose game style
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <router-link to="/" class="dropdown-item">Home</router-link>
                <router-link to="/max3" class="dropdown-item">Max 3 errors</router-link>
                <router-link to="/timer" class="dropdown-item">Timer</router-link>
                <router-link to="/2player" class="dropdown-item">2 Players</router-link>
                <router-link to="/anagram" class="dropdown-item">Anagram</router-link>
            </div>
        </div>
    </nav>
    <nav v-else class="row">
        <router-link to="/" class="btn btn-outline-primary btn-sm col-sm">Home</router-link>
        <router-link to="/max3" class="btn btn-outline-success btn-sm col-sm">Max 3 errors</router-link>
        <router-link to="/timer" class="btn btn-outline-warning btn-sm col-sm">Timer</router-link>
        <router-link to="/2player" class="btn btn-outline-danger btn-sm col-sm">2 Players</router-link>
        <router-link to="/anagram" class="btn btn-outline-dark btn-sm col-sm">Anagram</router-link>
    </nav>
</template>