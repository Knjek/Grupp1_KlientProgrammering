<template>
    <h2 style="color: red">Error: {{ msg }}</h2>
</template>

<script>
    export default {
        props: {
            msg: {
                type: String,
                required: true
            }
        },
    }
</script>