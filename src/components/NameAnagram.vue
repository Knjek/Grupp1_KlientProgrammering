<script>
import ReadFile from "../data/ReadFile.js"
import { getBookAndAuthorByISBN } from "../data/misc.js"
import PageLoader from "./PageLoader.vue"
import ErrorHandler from "./ErrorHandler.vue"

export default {
    name: "NameAnagram",
    data() {
        return {
            shuffledAuthorName: "",
            correctSpelledAuthorName: "",
            count: 0,
            userGuess: "",
            wrongGuesses: 0,
            error: false,
            errorMsg: "",
            loading: true,
            show: false,
            msg: ""
        }
    },
    components: {
        PageLoader,
        ErrorHandler,
    },
    methods: {
        async getISBNList() {
            //Program reads our text file and creates a list containing all the isbn numbers
            this.isbn = await ReadFile.makeList()
        },

        async setup() {
            try {
                await this.getISBNList()
                this.randomIndex = Math.floor(Math.random() * this.isbn.length)
                this.titleAuthor = await (getBookAndAuthorByISBN([this.isbn[this.randomIndex]]))
                this.correctSpelledAuthorName = this.titleAuthor[1]
                console.log(this.correctSpelledAuthorName)
                this.shuffledAuthorName = this.shuffleWord(this.correctSpelledAuthorName)
                console.log(this.shuffledAuthorName)
            } catch (Error) {
                this.errorMsg = Error.message
                this.loading = false
                this.show = false
                this.error = true
            }
            this.loading = false
            this.show = true

        },

        shuffleWord(correctSpelledAuthorName) {
            let shuffledWord = "";
            let charArray = correctSpelledAuthorName.split("");
            while (charArray.length > 0) {
                let randomIndex = Math.floor(Math.random() * charArray.length);
                shuffledWord += charArray[randomIndex];
                charArray.splice(randomIndex, 1);
            }
            return shuffledWord;
        },

        async validate() {
            this.loading = true
            if (this.userGuess === this.correctSpelledAuthorName) {
                this.count++
                this.msg = "Aweseome dude!"

            } else {
                this.msg = "U suck..."
            }
            this.userGuess = this.placeholder
            await this.setup()

        }
    },
    async mounted() {
        await this.setup()
    },
}
</script>

<template>
    <div>
        <div v-if="show" align="center">
            <h3 >{{ shuffledAuthorName }}</h3>
            <p>Guess the author name!</p>
            <input type="text" placeholder="Write the name here" v-model="userGuess">
            <input type="button" value="Check if correct" @click="validate">
            <p>Correct guesses: {{ count }}</p>
            <p>Wrong guesses: {{ wrongGuesses }}</p>
            <h2 :style="{ color: msg === 'Aweseome dude!' ? 'green' : 'red' }">{{ msg }}</h2>
        </div>
        <div v-if="loading">
            <PageLoader align="center" />
        </div>
        <div v-if="error">
            <ErrorHandler align="center" :msg="errorMsg" />
        </div>
    </div>
</template>