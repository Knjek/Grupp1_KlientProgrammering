<template>
    <input type="button" class="btn btn-primary" :value="name" id="authorname">
</template>

<script>
export default {
    props: {
        name: String
    }
}
</script>



