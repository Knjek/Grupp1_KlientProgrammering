<template>
    <h2>"{{ title }}" is written by...</h2>
</template>

<script>
export default {
    props: {
        title: String
    }
}
</script>

<style>
h2 {
    padding-top: 1em;
}
</style>