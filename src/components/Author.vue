<template>
    <input type="button" :value="name">
</template>

<script>
export default {
    props: {
        name: String
    }
}
</script>