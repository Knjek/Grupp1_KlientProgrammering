<script>
export default {
    props: {
        small: {
            type: Boolean,
            required: true,
        }
    },
    
}
</script>

<template>
    <nav v-if="small">
        <div class="dropdown">
            <button type="button" class="btn btn-warning">Author Quiz</button>
            <button class="btn btn-warning dropdown-toggle dropdown-toggle-split" type="button" id="dropdownMenuButton"
                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            </button>
            <button type="button" class="btn btn-success">Author Anagram</button>
            <button class="btn btn-success dropdown-toggle dropdown-toggle-split" type="button" id="dropdownMenuButton"
                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            </button>

            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <h6 class="dropdown-header">Choose game style:</h6>
                <router-link to="/quiz" class="dropdown-item">Basic</router-link>
                <div class="dropdown-divider"></div>
                <router-link to="/max3" class="dropdown-item">Max 3 errors</router-link>
                <div class="dropdown-divider"></div>
                <router-link to="/timer" class="dropdown-item">Timer</router-link>
                <div class="dropdown-divider"></div>
                <router-link to="/2player" class="dropdown-item">2 Players</router-link>
            </div>
        </div>
    </nav>
    <nav v-else class="row">
        <div class="nav-container">
            <router-link to="/quiz" class="btn btn-warning btn-lg">Author Quiz</router-link>
            <router-link to="/anagram" class="btn btn-success btn-lg">Anagram</router-link>
        </div>
        <div class="nav-container">
            <router-link to="/quiz" class="btn btn-outline-warning btn-sm">Basic</router-link>
            <router-link to="/max3" class="btn btn-outline-success btn-sm" >Max 3 errors</router-link>
            <router-link to="/timer" class="btn btn-outline-primary btn-sm" >Timer</router-link>
            <router-link to="/2player" class="btn btn-outline-danger btn-sm" >2 Players</router-link>
        </div>
    </nav>
</template>