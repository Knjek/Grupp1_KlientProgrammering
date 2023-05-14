<script>
import ReadFile from "../data/ReadFile.js"
import { getBookAndAuthorByISBN } from "../data/misc.js"

export default {
    name: "NameAnagram",
    data() {
        return {
            shuffledAuthorName: "",
            correctSpelledAuthorName: "",
            count: 0,
            userGuess: "",
            wrongGuesses: 0
        }
    },
    components: {

    },
    methods: {
        async getISBNList() {
            //Program reads our text file and creates a list containing all the isbn numbers
            this.isbn = await ReadFile.makeList()
        },

        async setup() {
            await this.getISBNList()
            this.randomIndex = Math.floor(Math.random() * this.isbn.length)
            this.titleAuthor = await (getBookAndAuthorByISBN([this.isbn[this.randomIndex]]))
            this.correctSpelledAuthorName = this.titleAuthor[1]
            console.log(this.correctSpelledAuthorName)
            this.shuffledAuthorName = this.shuffleWord(this.correctSpelledAuthorName)
            console.log(this.shuffledAuthorName)
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
            if (this.userGuess === this.correctSpelledAuthorName) {
                this.count++
                console.log("Yay!")

            } else {
                this.wrongGuesses++
                console.log("Buuuuu")
            }
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
        <h3>{{ shuffledAuthorName }}</h3>
        <p>Guess the author name!</p>
        <input type="text" placeholder="Write the name here" v-model="userGuess">
        <input type="button" value="Check if correct" @click="validate">
        <p>Correct guesses: {{ count }}</p>
        <p>Wrong guesses: {{ wrongGuesses }}</p>
    </div>
</template>