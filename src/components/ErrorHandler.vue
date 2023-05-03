<template>
    Error: {{ msg }}
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