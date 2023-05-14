<template>
    <div>
        <h2> {{ msg }} </h2>
        <p>You guessed {{ guesses }} times.</p>
        <p>Your score was {{ score }}</p> 
    </div>
</template>

<script>
    export default {
        props: {
            msg: {
                type: String,
                required: true
            },
            guesses: {
                type: Number,
                required: true
            },
            score:{
                type: Number,
            }
        },
    }
</script>