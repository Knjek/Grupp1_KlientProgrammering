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
                <router-link to="/" class="dropdown-item">Basic</router-link>
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
        <div>
            <button type="button" class="btn btn-warning"><router-link to="/"
                    class="btn btn-outline-dark">Author Quiz</router-link></button>
            <button type="button" class="btn btn-success"><router-link to="/anagram"
                    class="btn btn-outline-dark btn-sm col-sm">Anagram</router-link></button>
        </div>
        <router-link to="/" class="btn btn-outline-warning btn-sm col-sm">Basic</router-link>
        <router-link to="/max3" class="btn btn-outline-success btn-sm col-sm">Max 3 errors</router-link>
        <router-link to="/timer" class="btn btn-outline-warning btn-sm col-sm">Timer</router-link>
        <router-link to="/2player" class="btn btn-outline-danger btn-sm col-sm">2 Players</router-link>

    </nav>
</template>