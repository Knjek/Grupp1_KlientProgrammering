<script>
import BooksAndAuthors from "../components/BooksAndAuthors.vue"

export default {
    components: {
        BooksAndAuthors,
    },
}
</script>

<template>
    <div>
        <BooksAndAuthors :three-view="false" :timer-view="false" heading="Guess the author!" id="home" />
    </div>
</template>

<style>
#home {
    border: 0.5em solid rgba(253, 236, 140, 0.949);
}
</style>